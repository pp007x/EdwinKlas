using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using LoginApi.Data; // replace with your actual namespace
using System;
using System.Text;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddDbContext<UserContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<DatabaseSeeder>(); // Register DatabaseSeeder to DI container

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            // builder.WithOrigins("https://questappproto.azurewebsites.net")
            // builder.WithOrigins("https://appquest.azurewebsites.net")
            // builder.WithOrigins("https://discproto.azurewebsites.net")
            // builder.WithOrigins("https://questproto.azurewebsites.net")
            builder.WithOrigins("https://edwinklas.azurewebsites.net")
            // builder.WithOrigins("http://localhost:3000")
            
            
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add authentication services
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["SecretKey:JwtSecret"]))
        };
    });

var app = builder.Build();

// Ensure the database is created.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<UserContext>();
        if (context.Database.EnsureCreated()) // If the database is newly created
        {
            var seeder = services.GetRequiredService<DatabaseSeeder>(); // Get the seeder from the DI container
            seeder.SeedData(); // Seed the database
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the DB.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
}
else
{
    app.UseHsts();
}

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy",
                            "default-src 'self'; " +
                            "img-src 'self' data:; " +  // Add 'data:' here
                            "font-src 'self'; " +
                            "style-src 'self' 'unsafe-inline'; " +
                            "script-src 'self';" +
                            "frame-ancestors 'none';" +
                            "form-action 'self';");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    await next();
});



app.UseHttpsRedirection();

// Serve static files and use default files
app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = new List<string> { "index.html" },
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "build")),
});


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "build")),
    RequestPath = ""
});

app.UseCors("AllowReactApp"); // Use the CORS policy

app.UseRouting();

app.UseAuthentication(); // Enable authentication

app.UseAuthorization();

app.MapControllers();

// Adding fallback route here.
app.MapFallbackToFile("/index.html");

app.Run();
