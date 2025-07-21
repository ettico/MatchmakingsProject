using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using MatchMakings.Core.IRepositories;
using MatchMakings.Core.IServices;
using MatchMakings.Core;
using MatchMakings.Data.Repository;
using MatchMakings.Data;
using MatchMakings.Service.Services;
using MatchMakings.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ApiMatchMaker.Authorization;
using Microsoft.AspNetCore.Authorization;
using DotNetEnv;
using ApiMatchMaker.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;

Env.Load();

//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


string connectionString = Env.GetString("DATABASE_CONNECTION_STRING");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    options => options.CommandTimeout(60)));

//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySQL(connectionString, ServerVersion.AutoDetect(connectionString)));

//var app = builder.Build();

// המשך קונפיגורציה

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 💡 הוספת שירות CORS עם מדיניות בשם
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllClients", policy =>
    {
        policy.WithOrigins("http://localhost:4200",
            "http://localhost:5173",
            "https://matchmakingsproject.onrender.com", 
            "https://matchmakingsprojectangular.onrender.com") // הוספת הדומיינים הרלוונטיים
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // אם משתמשים ב-Credentials
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
//    options.AddPolicy("MatchMakerOnly", policy => policy.RequireRole("MatchMaker"));
//    options.AddPolicy("CandidateOnly", policy => policy.RequireRole("Male", "Women"));
//    options.AddPolicy("AdminOrMatchMaker", policy =>
//        policy.RequireRole("Admin", "MatchMaker"));
//});

// 🧠 הזרקת תלויות
builder.Services.AddScoped<IFamilyDetailsRepository, FamilyDetailsRepository>();
builder.Services.AddScoped<IFamilyDetailsService, FamilyDetailsService>();
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IMaleRepository, MaleRepository>();
builder.Services.AddScoped<IMaleService, MaleService>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<INoteService, NoteService>();
builder.Services.AddScoped<IMatchMakerRepository, MatchMakerRepository>();
builder.Services.AddScoped<IMatchMakerService, MatchMakerService>();
builder.Services.AddScoped<IMatchMakingRepository, MatchMakingRepository>();
builder.Services.AddScoped<IMatchMakingService, MatchMakingService>();
builder.Services.AddScoped<IWomenRepository, WomenRepository>();
builder.Services.AddScoped<IWomenService, WomenService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IServiceUser, UserService>();
builder.Services.AddHttpClient<MatchService>();
//builder.Services.AddDbContext<DataContext>();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddScoped<GptService>();
builder.Services.AddScoped<IRepositoryUser, RepositoryUsers>();

builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

//builder.Services.AddScoped<IServiceUser, UserService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();

// AWS
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var options = sp.GetRequiredService<IOptions<AWSOptions>>().Value;
    var credentials = new Amazon.Runtime.BasicAWSCredentials(
        Environment.GetEnvironmentVariable("AWS_ACCESSKEY"),
        Environment.GetEnvironmentVariable("AWS_SecretKey")
    );
    var region = Amazon.RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("AWS_REGION"));
    return new AmazonS3Client(credentials, region);
});

//// 🔐 Authentication + JWT
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.RequireHttpsMetadata = true;
//        options.SaveToken = true;
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = builder.Configuration["Jwt:Issuer"],
//            ValidAudience = builder.Configuration["Jwt:Audience"],
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//        };
//        options.Events = new JwtBearerEvents
//        {
//            OnAuthenticationFailed = context =>
//            {
//                Console.WriteLine($"❌ Auth failed: {context.Exception.Message}");
//                Console.WriteLine($"Token: {context.Request.Headers["Authorization"]}");
//                return Task.CompletedTask;
//            },
//            OnTokenValidated = context =>
//            {
//                Console.WriteLine("✅ Token validated");
//                return Task.CompletedTask;
//            }
//        };
//    });


//using (var scope = builder.Services.BuildServiceProvider().CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
//    var permissions = db.Permissions.Select(p => p.PermissionName).ToList();

//    builder.Services.AddAuthorization(options =>
//    {
//        foreach (var permission in permissions)
//        {
//            options.AddPolicy(permission, policy =>
//                policy.Requirements.Add(new PermissionRequirement(permission)));
//        }
//    });
//}

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//options.Authority = "https://accounts.google.com";
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidIssuer = "https://accounts.google.com",
//        ValidateAudience = true,
//        ValidAudience = "300837799563-knrc4dqeie5osqif56d6ofpg8tr93bc7.apps.googleusercontent.com", // תיקנתי את הטעות בסוף
//        ValidateLifetime = true
//    };
//});

// הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("MatchmakerOrAdmin", policy => policy.RequireRole("MatchMaker", "Admin"));
    options.AddPolicy("CandidateOrMatchmaker", policy => policy.RequireRole("Women", "Matchmaker", "Male"));
    options.AddPolicy("WomenOrMatchmaker", policy => policy.RequireRole("Women", "Matchmaker"));
});
builder.Services.AddAuthorization();


builder.AddJwtAuthentication();

builder.AddJwtAuthorization();

// Swagger עם תמיכה ב-JWT
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Enter JWT with Bearer prefix",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});


builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();



var app = builder.Build();

// 🌐 Middleware
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseRouting();

// ✅ שימוש במדיניות CORS בשם
app.UseCors("AllowAllClients");

app.UseAuthentication();
app.UseAuthorization();

// דיווח על Header
app.Use(async (context, next) =>
{
    Console.WriteLine($"Authorization Header: {context.Request.Headers["Authorization"]}");
    await next();
});

app.MapControllers();
app.MapGet("/", () => "Server API is running!");
app.Run();
