import { useState } from "react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in chat api", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Error happened while processing your message",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    loading,
    setInput,
    handleSubmit,
  };
};
