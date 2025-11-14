import Chat from "../../features/chat/Chat/Chat";
import styles from "./HomePage.module.css";

export default function HomePage({ user }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Студенческий Помощник</h1>
        {user?.status === "logged" ? (
          <p>Добро пожаловать, {user.data?.name}! Ваша история сообщений сохранена.</p>
        ) : (
          <p>Вы не авторизованы. История сообщений не будет сохранена.</p>
        )}
      </div>
      <Chat user={user} />
    </div>
  );
}
