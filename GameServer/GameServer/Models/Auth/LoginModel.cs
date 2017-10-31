using System.ComponentModel.DataAnnotations;

namespace GameServer.Models.Auth
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Необходимо заполнить поле \"Логин\"")]
        [StringLength(12, MinimumLength = 3, ErrorMessage = "Логин должен быть от 3 до 12 символов")]
        [Display(Name = "Логин")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Необходимо заполнить поле \"Пароль\"")]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }
    }
}