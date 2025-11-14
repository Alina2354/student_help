import styles from "./SignUpForm.module.css";
import UserApi from "../../entites/user/api/UserApi";
import { useNavigate } from "react-router";
import { setAccessToken } from "../../shared/lib/axiosInstace";

function SignUpForm({ setUser }) {
  const navigate = useNavigate();
  const signUpHandler = async (e) => {
    try {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      
      // Проверка совпадения паролей
      if (formData.password !== formData.confirmPassword) {
        alert("Пароли не совпадают");
        return;
      }
      
      // Удаляем confirmPassword перед отправкой
      delete formData.confirmPassword;
      
      const res = await UserApi.signup(formData); // пошел запрос через (UserApi.signup) в formData - наш объект{ключи:значения}, и от него же мы получаем ответ
      
      // Сохраняем accessToken
      if (res.data?.data?.accessToken) {
        setAccessToken(res.data.data.accessToken);
      }
      
      setUser({ status: "logged", data: res.data.data.user });
      navigate("/personalAccount");
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Произошла ошибка при регистрации";
      alert(errorMessage);
    }
  };
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={signUpHandler}>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Name</div>
          <input className={styles.input} name="name" type="text" required />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Email</div>
          <input className={styles.input} name="email" type="email" required />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Password</div>
          <input
            className={styles.input}
            name="password"
            type="password"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Repeat Password</div>
          <input
            className={styles.input}
            name="confirmPassword"
            type="password"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Подтвердить
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
