namespace Shared.Kernel.Constants
{
    /// <summary>
    /// Client için key formatında hata mesajları. 
    /// Bu kısım key ve dile göre açıklama eklenerek koleksiyon tipinde client tarafına döndürülebilir
    /// </summary>
    public static class Messages
    {
        public const string UserEmailAlreadyExists = "userEmailAlreadyExists";
        public const string UserNotFound = "userNotFound";
        public const string PasswordIncorrect = "passwordIncorrect";
        public const string SystemError = "systemError";
        public const string ProductNotFound = "productNotFound";
        public const string NameRequired = "nameRequired";
        public const string PriceInvalid = "priceInvalid";
        public const string CategoryRequired = "categoryRequired";
        public const string CategoryNotFound = "categoryNotFound";
        public const string IdMismatch = "idMismatch";
        public const string TranslationAlreadyExists = "translationAlreadyExists";
        public const string InvalidRole = "invalidRole";
        public const string InvalidImage = "invalidImage";
    }
}
