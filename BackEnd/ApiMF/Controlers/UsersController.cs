using MediatR;
using Microsoft.AspNetCore.Mvc;
using ApiMF.Models.Dtos;
using ApiMF.Application.Users.Commands.CreateUser;
using ApiMF.Application.Users.Queries.GetUsers;
using ApiMF.Application.Users.Queries.GetUserById;
using ApiMF.Application.Users.Queries.LoginUser;

namespace ApiMF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/users
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var result = await _mediator.Send(new GetUsersQuery());
        return Ok(result);
    }

    // GET: api/users/{id}
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUserById(long id)
    {
        var user = await _mediator.Send(new GetUserByIdQuery(id));
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request)
    {
        // Basic validation here to return 400 with details
        if (string.IsNullOrWhiteSpace(request.FirstName))
            ModelState.AddModelError(nameof(request.FirstName), "First name is required.");
        if (string.IsNullOrWhiteSpace(request.LastName))
            ModelState.AddModelError(nameof(request.LastName), "Last name is required.");
        if (string.IsNullOrWhiteSpace(request.Email))
            ModelState.AddModelError(nameof(request.Email), "Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            ModelState.AddModelError(nameof(request.Password), "Password must be at least 8 characters.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var cmd = new CreateUserCommand(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Password
        );

        try
        {
            var dto = await _mediator.Send(cmd);
            return CreatedAtAction(nameof(GetUserById), new { id = dto.Id }, dto);
        }
        catch (ValidationException vex)
        {
            ModelState.AddModelError(nameof(request.Email), vex.Message);
            return ValidationProblem(ModelState);
        }
    }

    // POST: api/users/login
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDto>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            ModelState.AddModelError(nameof(request.Email), "Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password))
            ModelState.AddModelError(nameof(request.Password), "Password is required.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var user = await _mediator.Send(new LoginUserQuery(request.Email, request.Password));
        if (user == null)
            return Unauthorized();

        return Ok(user);
    }

    // DTO for input only
    public class CreateUserRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
