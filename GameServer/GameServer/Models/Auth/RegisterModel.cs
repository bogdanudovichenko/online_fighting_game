using System.ComponentModel.DataAnnotations;

namespace GameServer.Models.Auth
{
    public class RegisterModel : LoginModel
    {
        [Required(ErrorMessage = "Необходимо заполнить поле \"Подтвердите пароль\"")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        [Display(Name = "Подтвердите пароль")]
        public string PasswordConfirm { get; set; }
    }
}