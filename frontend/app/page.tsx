"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. On ajoute le message de l'utilisateur à l'écran
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. On envoie la question au Cerveau (ton API Python)
      // L'URL correspond exactement à ce qu'on a testé tout à l'heure
      const response = await fetch(`https://portfolio-ala-1.onrender.com/poser-question?question=${encodeURIComponent(input)}`, {
        method: "POST",
      });

      const data = await response.json();

      // 3. On affiche la réponse de l'IA à l'écran
      setMessages([...newMessages, { role: "ai", content: data.reponse }]);
    } catch (error) {
      setMessages([...newMessages, { role: "ai", content: "Oups, le cerveau est déconnecté !" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
        
        {/* En-tête */}
        <div className="bg-blue-600 p-4 text-white text-center font-bold text-xl">
          🤖 Portfolio de ALA
        </div>

        {/* Zone de discussion */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Posez-moi une question sur mon parcours !</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user" 
                  ? "bg-blue-100 text-blue-900 self-end rounded-br-none" 
                  : "bg-gray-100 text-gray-800 self-start rounded-bl-none"
              }`}>
                {msg.content}
              </div>
            ))
          )}
          {isLoading && <div className="text-gray-400 self-start text-sm animate-pulse">L'IA réfléchit...</div>}
        </div>

        {/* Zone de saisie */}
        <form onSubmit={sendMessage} className="p-4 bg-gray-100 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Quelles sont tes compétences ?"
            className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            Envoyer
          </button>
        </form>

      </div>
    </main>
  );
}