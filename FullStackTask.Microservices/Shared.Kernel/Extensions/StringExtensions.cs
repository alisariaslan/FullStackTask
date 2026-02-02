using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Shared.Kernel.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Yazıyı slug a çeviren yardımcı metod
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string ToSlug(this string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            text = text.ToLowerInvariant();

            // Türkçe karakterler
            text = text.Replace("ı", "i").Replace("ğ", "g").Replace("ü", "u")
                       .Replace("ş", "s").Replace("ö", "o").Replace("ç", "c");

            // Unicode normalize (é → e)
            text = text.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();

            foreach (var c in text)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    sb.Append(c);
            }

            text = sb.ToString();

            // Alfanumerik + boşluk
            text = Regex.Replace(text, @"[^a-z0-9\s-]", "");

            // Çoklu boşluk / dash temizliği
            text = Regex.Replace(text, @"[\s-]+", "-");

            return text.Trim('-');
        }
    }
}
