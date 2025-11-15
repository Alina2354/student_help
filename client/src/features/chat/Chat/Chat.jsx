import { useState, useEffect } from "react";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import ChatMessageApi from "../../../entites/chatMessage/api/ChatMessageApi";
import axiosInstance from "../../../shared/lib/axiosInstace";
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
      // Отправляем запрос к AI
      const response = await axiosInstance.post("/chat-messages/ai", {
        message: content
      });

      if (response.data.statusCode === 200 && response.data.data) {
        const { userMessage: savedUserMessage, assistantMessage } = response.data.data;
        
        // Обновляем сообщение пользователя (если оно было сохранено)
        if (savedUserMessage) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastUserMsg = updated[updated.length - 1];
            if (lastUserMsg && lastUserMsg.sender === "user") {
              updated[updated.length - 1] = {
                ...lastUserMsg,
                id: savedUserMessage.id,
                createdAt: savedUserMessage.createdAt
              };
            }
            return updated;
          });
        }

        // Добавляем ответ ассистента
        if (assistantMessage) {
          const assistantMsg = {
            id: assistantMessage.id,
            content: assistantMessage.content,
            sender: "assistant",
            createdAt: assistantMessage.createdAt
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      const errorMessage = {
        content: "Произошла ошибка при отправке сообщения. Попробуйте позже.",
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
