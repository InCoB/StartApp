import React from 'react';
import { useChat } from 'ai/react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} />
      <ChatInput 
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}