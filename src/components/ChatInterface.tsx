'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Send, Mic, Image } from 'lucide-react';

export default function ChatInterface() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    // Apply theme to body
    document.body.classList.toggle('dark', theme === 'dark');
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <header className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Nexus Chat
        </h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            theme === 'dark' 
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          } transition-colors`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
      </header>

      <div className="flex-grow overflow-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <Message key={message.id} message={message} theme={theme} />
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex items-center space-x-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className={`flex-grow p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600"
          >
            <Send size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Mic size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            <Image size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}

interface MessageProps {
  message: { role: string; content: string };
  theme: 'light' | 'dark';
}

function Message({ message, theme }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg ${
        message.role === 'user'
          ? 'ml-auto bg-purple-500 text-white'
          : theme === 'dark'
          ? 'bg-gray-800'
          : 'bg-white shadow-md'
      } max-w-[80%]`}
    >
      <p>{message.content}</p>
    </motion.div>
  );
}