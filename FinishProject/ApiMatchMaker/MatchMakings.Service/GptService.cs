using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;


namespace MatchMakings.Service
{

    public class GptService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = Environment.GetEnvironmentVariable("AI_KEY");
        public GptService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> GetMatchesFromGptAsync(string candidateJson, string allCandidatesJson)
        {
            if (string.IsNullOrEmpty(_apiKey))
            {
                throw new Exception("API key is missing. Please set the environment variable 'AI_KEY'.");
            }

            var prompt = $@"
    אתה שדכן מנוסה. הנה מועמד פוטנציאלי: 
    {candidateJson}

    הנה רשימת מועמדים אפשריים:
    {allCandidatesJson}

    אנא החזר את רשימת המועמדים שהכי מתאימים, וציין אם יש בעיות כמו שם אב זהה או שם דומה מדי.
    התוצאה צריכה להיות JSON עם שדות: FullName, Score, Warnings (רשימת טקסטים).
    ";

            var requestData = new
            {
                model = "gpt-4o-mini", // נסי להחליף ל-gpt-3.5-turbo אם gpt-4 לא זמין
                messages = new[]
                {
            new { role = "system", content = "אתה עוזר שידוך" },
            new { role = "user", content = prompt }
        },
                temperature = 0.4
            };

            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenAI API call failed. Status: {response.StatusCode}, Error: {error}");
            }

            return await response.Content.ReadAsStringAsync();
        }

    }

}
