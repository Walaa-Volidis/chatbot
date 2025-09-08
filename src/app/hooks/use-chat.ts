import { useState } from 'react';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const responseText = data.response ?? '';

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '',
      };

      setTypingMessage(botMessage);
      let index = 0;
      const interval = setInterval(() => {
        if (index < responseText.length) {
          botMessage.text += responseText[index];
          setTypingMessage({ ...botMessage });
          index++;
        } else {
          clearInterval(interval);
          setMessages((prev) => [...prev, botMessage]);
          setTypingMessage(null);
          setLoading(false);
        }
      }, 50);
    } catch (error) {
      console.error('Error in chat api', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Error happened while processing your message',
      };

      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    loading,
    typingMessage,
    setInput,
    handleSubmit,
  };
};
