import { useState, useEffect } from "react";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import ChatMessageApi from "../../../entites/chatMessage/api/ChatMessageApi";
import TeacherApi from "../../../entites/teacher/api/TeacherApi";
import styles from "./Chat.module.css";

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (user?.status === "logged" && user?.data?.id) {
      try {
        setIsLoadingHistory(true);
        const response = await ChatMessageApi.getMyMessages();
        if (response.statusCode === 200 && response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки истории:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    } else {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = async (content) => {
    const userMessage = {
      content,
      sender: "user",
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Сохраняем сообщение пользователя (даже если не авторизован, user_id будет null)
      await ChatMessageApi.createMessage({
        content,
        sender: "user"
      });

      // Имитация ответа ассистента
      let assistantResponse = "Извините, я не понял ваш запрос.";

      if (content.trim().length > 0) {
        try {
          const searchResponse = await TeacherApi.searchTeachers(content);
          if (searchResponse.statusCode === 200 && searchResponse.data) {
            const teachers = searchResponse.data;
            if (teachers.length > 0) {
              assistantResponse = `Найдено преподавателей: ${teachers.length}\n\n`;
              teachers.forEach((teacher, index) => {
                const fullName = `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name || ""}`.trim();
                assistantResponse += `${index + 1}. ${fullName}`;
                if (teacher.faculty) assistantResponse += ` (${teacher.faculty})`;
                if (teacher.department) assistantResponse += ` - ${teacher.department}`;
                assistantResponse += `\n   ID: ${teacher.id}\n\n`;
              });
              assistantResponse += "Нажмите на преподавателя, чтобы перейти на его страницу.";
            } else {
              assistantResponse = "Преподаватели не найдены. Попробуйте изменить запрос.";
            }
          }
        } catch (error) {
          console.error("Ошибка поиска:", error);
          assistantResponse = "Произошла ошибка при поиске. Попробуйте позже.";
        }
      }

      const assistantMessage = {
        content: assistantResponse,
        sender: "assistant",
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Сохраняем ответ ассистента
      await ChatMessageApi.createMessage({
        content: assistantResponse,
        sender: "assistant"
      });
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      const errorMessage = {
        content: "Произошла ошибка при отправке сообщения.",
        sender: "assistant",
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHistory) {
    return <div className={styles.loading}>Загрузка истории...</div>;
  }

  return (
    <div className={styles.chat}>
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
