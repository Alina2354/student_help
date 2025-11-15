import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./HomePage.module.css";

export default function HomePage({ user }) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://localhost:3000/api/ai", {
        message,
      });

      if (res.data?.reply) {
        setReply(res.data.reply);
      } else {
        setReply("Ответ не получен.");
      }
    } catch (err) {
      console.error("AI ERROR:", err);
      setReply("Ошибка при обращении к AI.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const clearChat = () => {
    setReply("");
    setMessage("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [reply]);

  return (
    <div className={styles.page}>
      <main className={styles.chatWrapper}>
        <div className={styles.chatContainer} ref={chatRef}>
          {/* Превью */}
          {!reply && (
            <div className={styles.chatPreview}>
              <img src="/IMG_5467 1.png" className={styles.previewIcon} />
              <h3>
                Привет, любимка!
                <br />
                Задай любой вопрос и я на него отвечу
              </h3>
            </div>
          )}

          {/* Ответ ИИ */}
          {reply && (
            <div className={styles.replyBubble}>
              {loading ? "Думаю..." : reply}
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
