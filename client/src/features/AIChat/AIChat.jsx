import React, { useState } from "react";
import axios from "axios";
import styles from "/AIChat.module.css";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://localhost:3000/api/chat", {
        message,
      });

      const aiReply = res.data?.reply?.trim();
      setReply(aiReply || "Ответ не получен от ассистента.");
      setShowModal(true);
    } catch (err) {
      console.error("Ошибка AI:", err);
      setReply("Ошибка при обращении к AI-сервису.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatBox}>
      <h2>Помощник студента</h2>
      <p className={styles.subtext}>
        Спроси что угодно — ассистент подскажет, объяснит или разберёт задачу.
      </p>

      <input
        type="text"
        className={styles.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Например: что такое булева алгебра?"
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Анализ..." : "Спросить"}
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h3>Ответ</h3>
            <p className={styles.replyText}>{reply}</p>

            <button
              onClick={() => setShowModal(false)}
              className={styles.cancelBtn}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
