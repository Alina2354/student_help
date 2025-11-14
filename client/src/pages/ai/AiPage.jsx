import AIChat from "../../features/ai/ui/AiChat/AiChat";

export default function Ai() {
  return (
    <div>
      <h2>ИИ-ассистент на базе GigaChat</h2>
      <p>Задайте вопрос и получите ответ от нейросети</p>
      <AIChat />
    </div>
  );
}
