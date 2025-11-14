import { useEffect, useState } from "react";
import Router from "./app/Router/Router";
import UserApi from "./entites/user/api/UserApi";
import { setAccessToken } from "./shared/lib/axiosInstace";

function App() {
  const [user, setUser] = useState({ status: "logging", data: null }); //начальное значение

  const fetchUser = async () => {
    try {
      const dataFromServer = await UserApi.refreshTokens();

      if (dataFromServer.error) {
        setUser({ status: "logging", data: null });
        return;
      }

      if (dataFromServer.statusCode === 200 && dataFromServer.data?.user) {
        // Сохраняем accessToken
        if (dataFromServer.data?.accessToken) {
          setAccessToken(dataFromServer.data.accessToken);
        }
        setUser({ data: dataFromServer.data.user, status: "logged" });
      } else {
        setUser({ status: "logging", data: null });
      }
    } catch (error) {
      console.error(error);
      setUser({ status: "logging", data: null });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <Router setUser={setUser} user={user} />;
}

export default App;
