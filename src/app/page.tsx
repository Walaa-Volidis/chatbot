"use client";
import { useChat } from "./hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const { messages, input, setInput, loading, handleSubmit } = useChat();

  return (
    <div className="w-full h-screen flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-blue-500 text-white p-4 text-center">
        <h2 className="text-xl font-bold">Chatbot</h2>
      </div>

      <div className="flex-grow h-0 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-200 p-3 rounded-lg">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4 flex">
        <form onSubmit={handleSubmit} className="flex w-full">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-l-lg mr-3"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
