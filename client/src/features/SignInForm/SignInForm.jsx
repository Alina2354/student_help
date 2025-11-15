import { useNavigate } from "react-router-dom";
import UserApi from "../../entites/user/api/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstace";
import styles from "./SignInForm.module.css";

export default function SignInForm({ setUser }) {
  const navigate = useNavigate();

  const signInHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = Object.fromEntries(new FormData(event.target));
      const res = await UserApi.login(formData);

      if (res.data?.data?.accessToken) {
        setAccessToken(res.data.data.accessToken);
      }

      setUser({ status: "logged", data: res.data.data.user });
      navigate("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Произошла ошибка при входе";
      alert(errorMessage);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginContainer}>
        <div className={styles.backButton} onClick={() => navigate("/")}>
          <span>←</span> Назад
        </div>

        <div className={styles.slothImage}>
          <img src="/IMG_5449 1.svg" alt="sloth" />
        </div>

        <h2 className={styles.title}>Добро пожаловать в нашу тусовку!</h2>

        <form className={styles.loginForm} onSubmit={signInHandler}>
          <div className={styles.inputGroup}>
            <input type="email" name="email" placeholder="Email" required />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              required
            />
          </div>

          <div className={styles.forgotPassword}>
            <a href="#">Забыли пароль?</a>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.btnLogin}>
              Войти
            </button>
            <a
              className={styles.btnRegister}
              onClick={() => navigate("/signUp")}
            >
              Регистрация
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
