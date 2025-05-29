using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

namespace ApiProject.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FilesController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        public FilesController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        // יצירת URL להעלאת קובץ ל-S3
        [HttpGet("presigned-url")]
        public IActionResult GetPresignedUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(contentType))
                return BadRequest("Missing fileName or contentType");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = "etti",
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(15),
                //ContentType = contentType
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }

        // הורדת קובץ לפי שם קובץ
        [HttpGet("download/{fileName}")]
        public async Task<IActionResult> DownloadFile(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return BadRequest("Missing fileName");

            var request = new GetObjectRequest
            {
                BucketName = "etti",
                Key = fileName
            };

            try
            {
                using var response = await _s3Client.GetObjectAsync(request);
                if (response.ResponseStream == null)
                    return NotFound("File stream not found");

                var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                var contentType = response.Headers["Content-Type"] ?? "application/octet-stream";

                return File(memoryStream, contentType, fileName);
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return NotFound("File not found in S3");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
