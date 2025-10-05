using System.Security.Cryptography;
using System.Text;
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Users.Queries.LoginUser;

public record LoginUserQuery(string Email, string Password) : IRequest<UserDto?>;

public class LoginUserQueryHandler : IRequestHandler<LoginUserQuery, UserDto?>
{
    private readonly ApplicationDbContext _db;

    public LoginUserQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto?> Handle(LoginUserQuery request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (user == null)
            return null;

        if (!VerifyPasswordPbkdf2(request.Password, user.PasswordHash))
            return null;

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

    private static bool VerifyPasswordPbkdf2(string password, string stored)
    {
        // Expected format: pbkdf2$iterations$saltBase64$hashBase64
        if (string.IsNullOrWhiteSpace(stored))
            return false;

        var parts = stored.Split('$');
        if (parts.Length != 4 || !string.Equals(parts[0], "pbkdf2", StringComparison.Ordinal))
            return false;

        if (!int.TryParse(parts[1], out var iterations) || iterations <= 0)
            return false;

        byte[] salt, expectedHash;
        try
        {
            salt = Convert.FromBase64String(parts[2]);
            expectedHash = Convert.FromBase64String(parts[3]);
        }
        catch
        {
            return false;
        }

        var actualHash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            expectedHash.Length);

        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }
}

