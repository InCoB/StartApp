import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { MessageCircle } from 'lucide-react';

interface Chat {
  id: string;
  text: string;
  timestamp: Timestamp;
}

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatList: Chat[] = [];
      querySnapshot.forEach((doc) => {
        chatList.push({ id: doc.id, ...doc.data() } as Chat);
      });
      setChats(chatList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-600 dark:text-gray-300">Loading chats...</div>;
  }

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <MessageCircle size={20} className="mr-2" />
          Chat History
        </h2>
      </div>
      {chats.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 p-4">No chats yet. Start a conversation!</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {chats.map((chat) => (
            <li key={chat.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out">
              <p className="text-sm text-gray-800 dark:text-gray-200">{chat.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {chat.timestamp.toDate().toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;