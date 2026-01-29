///Services.Auth.API.Program.cs

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using Services.Auth.Application.Interfaces;
using Services.Auth.Infrastructure.Data;
using Services.Auth.Infrastructure.Repositories;
using Services.Auth.Infrastructure.Services;
using Shared.Kernel.Behaviors;
using Shared.Kernel.Constants;
using Shared.Kernel.Middlewares;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "AuthService")
        .WriteTo.Console()
        .WriteTo.File("logs/AuthService-log-.txt", rollingInterval: RollingInterval.Day));

// JWT
var jwtSection = builder.Configuration.GetSection(ConfigurationKeys.JwtSettings);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection[ConfigurationKeys.JwtKey]!)),
            ValidateIssuer = true,
            ValidIssuer = jwtSection[ConfigurationKeys.JwtIssuer],
            ValidateAudience = true,
            ValidAudience = jwtSection[ConfigurationKeys.JwtAudience],
            ClockSkew = TimeSpan.Zero
        };
    });

// EndpointsApiExplorer
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"Bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Cors
var gatewayOrigin = builder.Configuration[ConfigurationKeys.GatewayOrigin] ?? throw new Exception("Gateway origin missing");
builder.Services.AddCors(options => {
    options.AddPolicy("AllowGateway", policy => {
        policy.WithOrigins(gatewayOrigin).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

// Json Naming Policy
builder.Services.AddControllers().AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

//Postgre
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(builder.Configuration[ConfigurationKeys.PostgreConnection]));

// AddHttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// MediatR
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(LocalizationBehavior<,>));
});

var app = builder.Build();

// Serilog
app.UseSerilogRequestLogging();

// Middleware 
app.UseMiddleware<ExceptionMiddleware>();

// DB Migration
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseCors("AllowGateway");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();