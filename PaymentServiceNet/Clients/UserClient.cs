using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace PaymentServiceNet.Clients
{
    public class UserClient
    {
        private readonly HttpClient _http;

        public UserClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<UserDto> GetUserById(long userId)
        {
            var user = await _http.GetFromJsonAsync<UserDto>($"http://localhost:8080/api/users/{userId}");
            return user!;
        }
    }

    public class UserDto
    {
        public long Id { get; set; }
        public string Email { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
    }
}
