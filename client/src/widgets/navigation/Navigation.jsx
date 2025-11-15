import { NavLink, useNavigate } from "react-router-dom";
import UserApi from "../../entites/user/api/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstace";
import styles from "./Navigation.module.css";

export default function Navigation({ setUser, user }) {
  const navigate = useNavigate();

  const onClickLogout = async () => {
    try {
      await UserApi.logout();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }

    setAccessToken("");
    setUser({ status: "logging", data: null });
    navigate("/signIn");
  };

  return (
    <header className={styles.header}>
      {/* ЛОГО + ЛЕВАЯ НАВИГАЦИЯ */}
      <div className={styles.left}>
        <img
          src="/IMG_5467 1.png"
          alt="Логотип"
          className={styles.logo}
          onClick={() => navigate("/")}
        />

        <NavLink to="/" className={styles.link}>
          Главная
        </NavLink>

        <NavLink to="/teachers" className={styles.link}>
          Преподаватели
        </NavLink>
      </div>

      {/* ПРАВАЯ НАВИГАЦИЯ */}
      <div className={styles.right}>
        {user?.status === "logged" ? (
          <>
            {/* Имя пользователя */}
            <div className={styles.userName}>
              {user?.data?.name}
            </div>

            {user?.data?.is_admin && (
              <NavLink to="/admin" className={styles.link}>
                Админ-панель
              </NavLink>
            )}

            <button onClick={onClickLogout} className={styles.linkButton}>
              Выйти
            </button>
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
      </div>
    </header>
  );
}
