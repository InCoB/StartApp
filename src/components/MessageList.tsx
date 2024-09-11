'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from 'ai';
import { Copy, Check, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-3/4 p-4 rounded-2xl shadow-lg relative group ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-100'
            }`}
          >
            <div className="flex items-center mb-2">
              {message.role === 'user' ? (
                <User size={20} className="text-blue-200 mr-2" />
              ) : (
                <Bot size={20} className="text-gray-300 mr-2" />
              )}
              <span className="font-semibold">{message.role === 'user' ? 'You' : 'AI'}</span>
            </div>
            <ReactMarkdown className="prose prose-invert max-w-none">{message.content}</ReactMarkdown>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => copyToClipboard(message.content, message.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy message"
            >
              {copiedId === message.id ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="text-gray-300" />
              )}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}