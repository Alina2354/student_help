import { useEffect, useRef } from "react";
import styles from "./ChatMessages.module.css";

export default function ChatMessages({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.container}>
      {messages.length === 0 ? (
        <div className={styles.welcome}>
          <h2>Добро пожаловать в Студенческий Помощник!</h2>
          <p>Напишите имя преподавателя или название дисциплины, и я помогу вам найти информацию.</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.sender === "user" ? styles.userMessage : styles.assistantMessage
            }`}
          >
            <div className={styles.messageContent}>{message.content}</div>
            {message.createdAt && (
              <div className={styles.timestamp}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
