import { NavLink, useNavigate } from "react-router-dom";
import UserApi from "../../entites/user/api/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstace";

export default function Navigation({ setUser, user }) {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      await UserApi.logout();
      setAccessToken(""); // Очищаем accessToken
      setUser({ status: "logging", data: null });
      navigate("/signIn");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      // Всё равно очищаем токен и перенаправляем
      setAccessToken("");
      setUser({ status: "logging", data: null });
      navigate("/signIn");
    }
  };

  return (
    <header>
      <NavLink to="/" style={{ textDecoration: "none", marginRight: "15px" }}>
        Главная
      </NavLink>
      <NavLink
        to="/cookies"
        style={{ textDecoration: "none", marginRight: "15px" }}
      >
        Куки
      </NavLink>
      <NavLink
        to="/tasks"
        style={{ textDecoration: "none", marginRight: "15px" }}
      >
        Задачи
      </NavLink>
      <NavLink to="/ai" style={{ textDecoration: "none", marginRight: "15px" }}>
        GigaChat
      </NavLink>
      {user.status === "logged" ? (
        <>
          <NavLink
            to={"/personalAccount"}
            style={{ textDecoration: "none", marginRight: "15px" }}
          >
            {user?.data?.name}
          </NavLink>
          <NavLink
            onClick={onClick}
            style={{ textDecoration: "none", marginRight: "15px" }}
          >
            Выйти
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/signUp"
            style={{ textDecoration: "none", marginRight: "15px" }}
          >
            Регистрация
          </NavLink>
          <NavLink
            to={"/signIn"}
            style={{ textDecoration: "none", marginRight: "15px" }}
          >
            Войти
          </NavLink>
        </>
      )}
    </header>
  );
}
