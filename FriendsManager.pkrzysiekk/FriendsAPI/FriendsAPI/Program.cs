using FriendsAPI.Data;
using FriendsAPI.Models;
using FriendsAPI.Repository;
using FriendsAPI.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<FriendsContext>();

//DI
builder.Services.AddScoped<IRepository<Friend>, FriendsRepository>();
builder.Services.AddScoped<IService<Friend>, FriendService>();

builder.Services.AddScoped<IRepository<Category>, CategoryRepository>();
builder.Services.AddScoped<IService<Category>, CategoryService>();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FriendsContext>();
    context.Database.EnsureCreated();
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();