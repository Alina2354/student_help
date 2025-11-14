import { useNavigate } from "react-router-dom";
import UserApi from "../../entites/user/api/UserApi";
import styles from "./SignInForm.module.css";
import { setAccessToken } from "../../shared/lib/axiosInstace";

export default function LoginForm({setUser}) {

  const navigate = useNavigate()

  const signInHandler= async (event) => {
    try {  
      event.preventDefault() // передотвращаем поведение элемента по умолчанию 
      const formData = Object.fromEntries(new FormData(event.target)); // формируем новый объект из данный в инпутах
      const res = await UserApi.login(formData)

      // Сохраняем accessToken
      if (res.data?.data?.accessToken) {
        setAccessToken(res.data.data.accessToken);
      }

      setUser({status: "logged", data: res.data.data.user})
      navigate("/")


    } catch (error) {
        console.log(error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Произошла ошибка при входе";
      alert(errorMessage)
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={signInHandler}>
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
        <button type="submit" className={styles.submitButton}>
          Подтвердить
        </button>
      </form>
    </div>
  );
}
