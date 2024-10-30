using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Context;
using server.Models;
using server.Services;
using server.Utility;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthUtils _auth;
        private readonly ApplicationContext _context;
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        public AuthController(ApplicationContext context, IConfiguration configuration, IUserService userService)
        {
            _context = context;
            _userService = userService;
            _auth = new AuthUtils(configuration);
            _config = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto req)
        {

            if (req.Email == null)
            {
                return BadRequest("Email is required.");
            }

            if (req.Password == null)
            {
                return BadRequest("Password is required.");
            }

            string lowerCaseEmail = req.Email.ToLower();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == lowerCaseEmail);

            if (user == null)
            {
                return BadRequest("User not found.");
            }

            if (!_auth.VerifyPasswordHash(req.Password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Wrong password.");
            }

            string token = _auth.CreateToken(user);

            return Ok(token);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto req)
        {
            Console.WriteLine("Registration attempt started");
            try
            {
                if (req.Email == null || req.Name == null || req.Password == null)
                {
                    Console.WriteLine("Registration failed: Missing required fields");
                    return BadRequest(new { error = "Missing required fields: email, name, and password are required." });
                }

                if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Password))
                {
                    Console.WriteLine("Registration failed: Empty fields");
                    return BadRequest(new { error = "Fields cannot be empty." });
                }

                if (req.Password.Length < 6)
                {
                    Console.WriteLine("Registration failed: Password too short");
                    return BadRequest(new { error = "Password must be at least 6 characters long." });
                }

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
                if (existingUser != null)
                {
                    Console.WriteLine($"Registration failed: Email {req.Email} already exists");
                    return BadRequest(new { error = "Email is already registered." });
                }

                Console.WriteLine("Creating new user");
                User user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = req.Email,
                    Name = req.Name
                };

                _auth.CreatePasswordHash(req.Password, out byte[] passwordHash, out byte[] passwordSalt);

                user.PasswordSalt = passwordSalt;
                user.PasswordHash = passwordHash;

                _context.Users.Add(user);
                try
                {
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"User {user.Email} successfully registered");
                    return Ok(new { message = "Registration successful" });
                }
                catch (DbUpdateException ex)
                {
                    Console.WriteLine($"Database error during registration: {ex.InnerException?.Message ?? ex.Message}");
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                    }
                    return StatusCode(500, new { error = "Database error occurred while saving user." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error during registration: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { error = "An unexpected error occurred during registration." });
            }
        }

        [HttpGet("validate-token")]
        [Authorize]
        public ActionResult ValidateToken()
        {
            var currentUser = _userService.GetCurrentUser();
            return Ok(currentUser);
        }

        [HttpPost("logout"), Authorize]
        public ActionResult Logout()
        {
            return Ok("Logout successful");
        }

        [HttpGet("current-user"), Authorize]
        public ActionResult<User> GetCurrentUser()
        {
            var currentUser = _userService.GetCurrentUser();
            return Ok(currentUser);
        }
    }
}