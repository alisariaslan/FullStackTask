namespace Shared.Kernel.Constants
{
    /// <summary>
    /// Key tipinde roller
    /// </summary>
    public static class Roles
    {
        /// <summary>
        /// Geçerli (aktif) roller. 
        /// </summary>
        public static readonly string[] ValidRoles = { Admin, User };

        public const string User = "User";
        public const string Admin = "Admin";
    }

}
