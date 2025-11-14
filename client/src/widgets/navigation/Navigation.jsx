import { NavLink, useNavigate } from "react-router-dom";
import UserApi from "../../entites/user/api/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstace";
import styles from "./Navigation.module.css";

export default function Navigation({ setUser, user }) {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      await UserApi.logout();
      setAccessToken("");
      setUser({ status: "logging", data: null });
      navigate("/signIn");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      setAccessToken("");
      setUser({ status: "logging", data: null });
      navigate("/signIn");
    }
  };

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.link}>
        Главная
      </NavLink>
      <NavLink to="/teachers" className={styles.link}>
        Преподаватели
      </NavLink>

      {user.status === "logged" ? (
        <>
          {user?.data?.is_admin && (
            <NavLink to="/admin" className={styles.link}>
              Админ-панель
            </NavLink>
          )}
          <NavLink onClick={onClick} className={styles.link}>
            Выйти
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/signUp" className={styles.link}>
            Регистрация
          </NavLink>
          <NavLink to="/signIn" className={styles.link}>
            Войти
          </NavLink>
        </>
      )}
    </header>
  );
}
