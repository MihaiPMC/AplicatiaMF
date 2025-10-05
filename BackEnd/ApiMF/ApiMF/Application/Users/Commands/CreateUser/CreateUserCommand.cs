using System.Security.Cryptography;
using System.Text;
using ApiMF.Data;
using ApiMF.Entities;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ApiMF.Application.Users.Commands.CreateUser;

public record CreateUserCommand(string FirstName, string LastName, string Email, string Password) : IRequest<UserDto>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly ApplicationDbContext _db;

    public CreateUserCommandHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // Optional pre-check for nicer error (still race-safe due to try-catch below)
        if (await _db.Users.AnyAsync(u => u.Email == normalizedEmail, cancellationToken))
        {
            throw new ValidationException("A user with this email already exists.");
        }

        var passwordHash = HashPasswordPbkdf2(request.Password);

        // Manual mapping instead of AutoMapper
        var user = new User
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash
        };

        _db.Users.Add(user);
        try
        {
            await _db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg && pg.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            throw new ValidationException("A user with this email already exists.");
        }

        // Manual mapping to DTO
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private static string HashPasswordPbkdf2(string password)
    {
        const int iterations = 100_000;
        const int saltSize = 16;
        const int keySize = 32;

        var salt = RandomNumberGenerator.GetBytes(saltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            keySize);

        return $"pbkdf2${iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
    }
}

public class ValidationException : Exception
{
    public ValidationException(string message) : base(message) { }
}
