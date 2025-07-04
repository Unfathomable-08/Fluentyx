"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { you: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      console.log("Query:", query)
      const res = await fetch("https://unfathomable08-fluentyx-langweb.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();
      const aiMessage = { ai: data.answer || "Sorry, I couldn't understand." };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [...prev, { ai: "Error contacting AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="relative bg-[#1a1a1a] text-[#1a1a1a] flex justify-center text-white p-4" style={{height: 'calc(100vh - 52px)'}}>
      <div className="max-w-3xl w-full">
        {/* Hero */}
        {messages.length == 0 ? <>
          <motion.div
            className="text-center my-6 "
          >
            <div className="flex justify-center items-center text-[var(--primary)] text-4xl mb-2">
              <FaRobot />
            </div>
            <h1 className="text-xl font-bold mb-2">AI Arabic Helper</h1>
            <p className="text-sm text-text-gray-400">
              Ask anything about Arabic. I’m here to help! ✨
            </p>
          </motion.div>
    
          {/* Input Box */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-3 bg-[#2a2a2a] rounded-xl shadow-md"
          >
            <input
              type="text"
              placeholder="Type your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm"
            />
            <button type="submit" className="text-[var(--primary)] text-xl">
              <FaPaperPlane />
            </button>
          </form>
    
          {/* Suggestions */}
          <div className="mt-8">
            <h2 className="text-md font-semibold mb-2">Suggestions:</h2>
            <div className="grid gap-3">
              {[
                "What’s the difference between 'Inna' and 'Anna'?",
                "How can I learn the Arabic letters?",
                "What is a nominal sentence?"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(suggestion)}
                  className="px-4 py-2 bg-[#2c2c2c] shadow-sm rounded-md hover:bg-[var(--primary)] hover:text-white transition text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </> : <>
          {/* Hero Section */}
          <motion.div
            className="text-center flex justify-start gap-x-3 items-center"
          >
            <div className="flex justify-center items-center text-[var(--primary)] text-3xl mb-2">
              <FaRobot />
            </div>
            <h1 className="text-sm font-medium mb-1">AI Arabic Helper</h1>
          </motion.div>
          
          {/* Messages */}
          <div className="space-y-3 my-2 pb-6 max-h-[400px] overflow-y-auto px-1">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg shadow ${
                  msg.you
                    ? "bg-[#b7b7b7] text-black self-end text-right"
                    : "bg-[#333333] text-white self-start text-left"
                }`}
              >
                <span>{msg.you || msg.ai}</span>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400"
              >
                AI is typing...
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
  
          {/* Input Box */}
          <form
            onSubmit={handleSubmit}
            className="fixed md:mx-4 bottom-26 flex items-center gap-2 p-3 mt-4 bg-[#2a2a2a] rounded-xl shadow-md"
            style={{width: 'calc(100% - 2rem)', maxWidth: 'calc(768px - 2rem)'}}
          >
            <input
              type="text"
              placeholder="Type your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm"
            />
            <button type="submit" className="text-[var(--primary)] text-xl">
              <FaPaperPlane />
            </button>
          </form>
        </>
        }
      </div>
    </main>
  );
}
