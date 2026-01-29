using System.Text.RegularExpressions;

namespace Shared.Kernel.Extensions
{
    public static class StringExtensions
    {
        public static string ToSlug(this string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return string.Empty;

            var s = text.ToLower();
            s = s.Replace("ı", "i").Replace("ğ", "g").Replace("ü", "u")
                 .Replace("ş", "s").Replace("ö", "o").Replace("ç", "c");

            s = Regex.Replace(s, @"[^a-z0-9\s-]", "");

            s = Regex.Replace(s, @"\s+", "-").Trim();

            return s;
        }
    }
}
