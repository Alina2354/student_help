import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./HomePage.module.css";

export default function HomePage({ user }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]); // <— ИСТОРИЯ ЧАТА
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = {
      role: "user",
      text: message.trim(),
    };

    // Добавляем сообщение пользователя
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/ai", {
        message: userMsg.text,
      });

      const aiText =
        res.data?.reply || "Ответ не получен.";

      const aiMsg = {
        role: "ai",
        text: aiText,
      };

      setChat((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI ERROR:", err);

      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Ошибка при обращении к AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChat([]);
    setMessage("");
  };

  // Автоскролл вниз при добавлении сообщения
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  return (
    <div className={styles.page}>
      <main className={styles.chatWrapper}>
        <div className={styles.chatContainer} ref={chatRef}>

          {/* Превью — показываем только когда нет сообщений */}
          {chat.length === 0 && (
            <div className={styles.chatPreview}>
              <img src="/IMG_5467 1.png" className={styles.previewIcon} />
              <h3>
                Привет, {user?.data?.name}!
                <br />
                Задай любой вопрос и я на него отвечу XD
              </h3>
            </div>
          )}

          {/* История сообщений */}
          {chat.map((msg, index) => (
            <div
              key={index}
              className={styles.replyBubble}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user" ? "#ECE8FF" : "#FFFFFF",
              }}
            >
              {msg.text}
            </div>
          ))}

          {/* Сообщение "Думаю..." */}
          {loading && (
            <div className={styles.replyBubble}>
              Думаю...
            </div>
          )}
        </div>

        {/* Ввод */}
        <div className={styles.inputContainer}>
          <textarea
            className={styles.inputField}
            placeholder="Введите своё сообщение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!user?.status}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <div className={styles.btnGroup}>
            <button className={styles.clearBtn} onClick={clearChat}>
              <img src="/Frame 2131331620.svg" />
            </button>

            <button
              className={`${styles.sendBtn} ${
                message.trim() && user?.status ? styles.active : ""
              }`}
              disabled={!message.trim() || !user?.status || loading}
              onClick={sendMessage}
            >
              <img src="/Component 89.svg" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
