import styles from "./HomePage.module.css";

export default function HomePage({ user }) {
  return (
    <div className={styles.page}>

      <main className={styles.chatWrapper}>
        <div className={styles.chatContainer}>
          {/* Превью ВСЕГДА видимое */}
          <div className={styles.chatPreview}>
            <img src="/IMG_5467 1.png" className={styles.previewIcon} />
            <h3>
              Привет, любимка!
              <br />
              Задай любой вопрос и я на него отвечу
            </h3>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <textarea
            className={styles.inputField}
            placeholder="Введите своё сообщение"
            disabled={!user?.status}
          />

          <div className={styles.btnGroup}>
            <button className={styles.clearBtn}>
              <img src="/Frame 2131331620.svg" />
            </button>

            <button
              className={`${styles.sendBtn} ${
                user?.status ? styles.active : ""
              }`}
              disabled={!user?.status}
            >
              <img src="/Component 89.svg" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
