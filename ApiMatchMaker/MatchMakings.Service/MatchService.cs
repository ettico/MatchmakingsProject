using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

public class MatchService
{
    private readonly HttpClient _httpClient;

    public MatchService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Dictionary<string, object>>> GetMatchListAsync(object matchData)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("http://localhost:5001/match", matchData);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"AI Server returned error: {response.StatusCode}");
            }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine("jjjjjjjjjsssssooooonnnn========"+json);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var result = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(json, options);
            return result ?? new List<Dictionary<string, object>>();
        }
        catch (Exception ex)
        {
            // אפשר גם להכניס כאן לוגים
            throw new ApplicationException("Failed to get match list from AI server", ex);
        }
    }
}
