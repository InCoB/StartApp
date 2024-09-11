import React from 'react';
import { X, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const chatHistory = [
    { id: 1, title: 'AI Ethics Discussion', date: '2023-04-01' },
    { id: 2, title: 'Future of Technology', date: '2023-04-02' },
    { id: 3, title: 'Quantum Computing Basics', date: '2023-04-03' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Chat History</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </motion.button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {chatHistory.map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ x: 5 }}
            className="p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare size={16} className="text-blue-400" />
              <div>
                <h3 className="font-medium text-sm">{chat.title}</h3>
                <p className="text-xs text-gray-400">{chat.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="m-4 p-2 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center space-x-2 transition-colors"
      >
        <Plus size={20} />
        <span>New Chat</span>
      </motion.button>
    </div>
  );
}