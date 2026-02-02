using System.Text.Json;

namespace Shared.Kernel.Models
{
    /// <summary>
    /// Ortak api cevap sınıfı
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ApiResponse<T>
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public static ApiResponse<T> Success(T? data, string messageKeyOrText = "")
        {
            return new ApiResponse<T>
            {
                IsSuccess = true,
                Data = data,
                Message = messageKeyOrText,
                Errors = null
            };
        }

        public static ApiResponse<T> Fail(string errMessageKeyOrText, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                IsSuccess = false,
                Errors = errors ?? new List<string> { errMessageKeyOrText }
            };
        }

        public override string ToString() => JsonSerializer.Serialize(this);
    }
}