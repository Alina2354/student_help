import { useState } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={disabled}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={disabled || !message.trim()}
      >
        Отправить
      </button>
    </form>
  );
}
