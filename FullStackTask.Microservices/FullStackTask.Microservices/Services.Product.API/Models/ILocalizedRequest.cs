namespace Services.Product.API.Models
{
    public interface ILocalizedRequest
    {
        string LanguageCode { get; set; }
    }
}
