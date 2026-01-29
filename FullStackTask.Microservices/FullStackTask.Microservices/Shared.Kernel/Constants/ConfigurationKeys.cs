namespace Shared.Kernel.Constants
{
    public static class ConfigurationKeys
    {
        public const string JwtSettings = "JwtSettings";
        public const string JwtKey = "Key";
        public const string JwtIssuer = "Issuer";
        public const string JwtAudience = "Audience";
        
        public const string GatewayOrigin = "Cors:GatewayOrigin";
        public const string FrontendOrigin = "Cors:FrontendOrigin"; 
        
        public const string PostgreConnection = "ConnectionStrings:PostgreConnection";
        public const string RedisConnection = "ConnectionStrings:Redis";
        public const string RabbitMQSection = "RabbitMQSettings";

    }
}
