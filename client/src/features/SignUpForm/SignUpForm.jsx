import styles from "./SignUpForm.module.css";
import UserApi from "../../entites/user/api/UserApi";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../shared/lib/axiosInstace";

export default function SignUpForm({ setUser }) {
  const navigate = useNavigate();

  const signUpHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = Object.fromEntries(new FormData(e.target));

      if (formData.password !== formData.confirmPassword) {
        alert("Пароли не совпадают");
        return;
      }

      delete formData.confirmPassword;

      const res = await UserApi.signup(formData);

      if (res.data?.data?.accessToken) {
        setAccessToken(res.data.data.accessToken);
      }

      setUser({ status: "logged", data: res.data.data.user });
      navigate("/personalAccount");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Произошла ошибка при регистрации";
      alert(errorMessage);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginContainer}>

        {/* Назад */}
        <div
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <span>←</span> Назад
        </div>

        {/* Картинка */}
        <div className={styles.slothImage}>
          <img src="/IMG_5455 1.svg" alt="sloth" />
        </div>

        <h2 className={styles.title}>Добро пожаловать в нашу тусовку!</h2>

        {/* Форма */}
        <form className={styles.loginForm} onSubmit={signUpHandler}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="ФИО"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.btnLogin}>
              Зарегистрироваться
            </button>

            <div
              className={styles.btnRegister}
              onClick={() => navigate("/signin")}
            >
              Вход
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
