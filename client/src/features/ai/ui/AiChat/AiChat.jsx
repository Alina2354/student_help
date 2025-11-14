import { AiApi } from "../../api/aiApi";
import "./AiChat.css";
import { useState } from "react";

function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serverResponse = await AiApi.generateText(prompt);
      setResponse(serverResponse.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Задайте вопрос..."
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Отправить"}
        </button>
      </form>

      {response && (
        <div className="response">
          <h3>Ответ:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default AIChat;