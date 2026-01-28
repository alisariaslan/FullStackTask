using System.Text.Json;

namespace Product.API.Models
{
    public class ApiResponse<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public static ApiResponse<T> Success(T data, string message = "İşlem başarılı")
        {
            return new ApiResponse<T>
            {
                IsSuccess = true,
                Data = data,
                Message = message,
                Errors = null
            };
        }

        public static ApiResponse<T> Fail(string errorMessage, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                IsSuccess = false,
                Data = default,
                Message = errorMessage,
                Errors = errors ?? new List<string> { errorMessage }
            };
        }

        public override string ToString() => JsonSerializer.Serialize(this);
    }
}