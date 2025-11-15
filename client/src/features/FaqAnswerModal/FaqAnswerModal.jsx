import { useState } from "react";
import styles from "./FaqAnswerModal.module.css";

export default function FaqAnswerModal({ isOpen, onClose, onSubmit }) {
  const [answer, setAnswer] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Добавить ответ</h2>

        <textarea
          className={styles.textarea}
          placeholder="Введите ответ..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button className={styles.submitButton} onClick={handleSubmit}>
          Отправить
        </button>
      </div>
    </div>
  );
}
