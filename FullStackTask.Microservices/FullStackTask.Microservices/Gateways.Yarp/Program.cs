///Gateways.Yarp.Program.cs

using Microsoft.AspNetCore.RateLimiting;
using Shared.Kernel.Constants;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var frontendOrigin =
    builder.Configuration[ConfigurationKeys.FrontendOrigin]
    ?? throw new Exception("Cors:FrontendOrigin not configured");

// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
       policy.WithOrigins(frontendOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Rate limiter
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", policy =>
    {
        policy.PermitLimit = 100;
        policy.Window = TimeSpan.FromMinutes(1);
        policy.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        policy.QueueLimit = 5;
    });
});

var app = builder.Build();

if(!app.Environment.IsDevelopment())
   app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseRateLimiter(); 

app.MapReverseProxy();

app.Run();