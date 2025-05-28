using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using MatchMakings.Core.Models;

namespace MatchMakings.Service
{
    public class GptService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GptService()
        {
            _apiKey = Environment.GetEnvironmentVariable("AI_KEY");
            if (string.IsNullOrEmpty(_apiKey))
                throw new Exception("API key is missing. Please set the environment variable 'AI_KEY'.");

            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<List<MatchResult>> GetMatchesFromGptAsync(string candidateJson, string allCandidatesJson)
        {
            var prompt = $@"אתה שדכן חכם ומנוסה.

הנה פרטי מועמד פוטנציאלי:
{candidateJson}

הנה רשימת מועמדים אפשריים מהמין השני:
{allCandidatesJson}

עליך לדרג כל מועמד/ת לפי התאמה למועמד הראשי. שים לב לשדות כגון:
- גיל
- מיקום
- תחומי עניין
- תכונות חשובות שבי ובמה שאני מחפש/ת
- ערכים
- השכלה

בנוסף:
- בדוק אם שמו של המועמד מופיע כשם אחד ההורים של המועמד/ת מהמין השני (ולהפך). אם כן – ציין זאת בשדה Warnings.

החזר תשובה בפורמט JSON תקני של רשימת אובייקטים עם השדות:
- UserId (מספר מזהה ייחודי של המועמד/ת)
- Score (ציון התאמה מ-0 עד 100)
- Comment (רשימת מחרוזות עם הערות, אם יש)

החזר אך ורק JSON תקני – ללא הסברים, טקסט נוסף, או עיצוב קוד (ללא ```).
";

            var requestData = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
            new { role = "system", content = "אתה מערכת התאמה לשידוכים" },
            new { role = "user", content = prompt }
        },
                temperature = 0.3
            };

            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"OpenAI API call failed. Status: {response.StatusCode}, Error: {responseContent}");

            var jsonDoc = JsonNode.Parse(responseContent);
            var gptTextRaw = jsonDoc?["choices"]?[0]?["message"]?["content"]?.GetValue<string>() ?? "";

            // ניקוי קוד JSON מיותר (תיקונים לחלק מהבעיות הקיימות)
            string gptText = gptTextRaw.Trim();

            // הסרת חצאי קוד Markdown אם קיימים
            if (gptText.StartsWith("```json"))
                gptText = gptText.Substring(7).TrimStart();

            if (gptText.EndsWith("```"))
                gptText = gptText.Substring(0, gptText.Length - 3).TrimEnd();

            // טיפול בציטוטים כפולים (אם הטקסט עטוף במירכאות כפולות)
            if (gptText.StartsWith("\"") && gptText.EndsWith("\""))
            {
                gptText = gptText[1..^1].Replace("\\\"", "\"");
            }

            // הסרה של תווים לא חוקיים לפני הפיענוח
            gptText = gptText.Replace("\n", "").Replace("\r", "").Trim();

            Console.WriteLine("== GPT TEXT ==");
            Console.WriteLine(gptText);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            List<MatchResult> matchResults;

            try
            {
                matchResults = JsonSerializer.Deserialize<List<MatchResult>>(gptText, options);
            }
            catch (JsonException ex)
            {
                throw new Exception("שגיאה בפיענוח התגובה ל-List<MatchResult>: " + ex.Message + "\nRaw GPT text: " + gptText);
            }

            if (matchResults == null)
                throw new Exception("שגיאה בפיענוח התגובה ל-List<MatchResult>");

            return matchResults;
        }

    }
}
