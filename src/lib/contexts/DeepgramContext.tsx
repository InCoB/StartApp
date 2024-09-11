"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@deepgram/sdk";

interface DeepgramContextType {
  client: ReturnType<typeof createClient> | null;
  error: string | null;
}

const DeepgramContext = createContext<DeepgramContextType>({ client: null, error: null });

export const DeepgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<ReturnType<typeof createClient> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDeepgram = async () => {
      try {
        const response = await fetch('/api/deepgram/transcribe-audio');
        const data = await response.json();
        if (data.apiKey) {
          const newClient = createClient(data.apiKey);
          setClient(newClient);
        } else {
          setError('Deepgram API key not found');
        }
      } catch (error) {
        setError('Error initializing Deepgram client: ' + (error as Error).message);
      }
    };

    initializeDeepgram();
  }, []);

  return (
    <DeepgramContext.Provider value={{ client, error }}>
      {children}
    </DeepgramContext.Provider>
  );
};

export const useDeepgram = (): DeepgramContextType => {
  const context = useContext(DeepgramContext);
  if (!context) {
    throw new Error('useDeepgram must be used within a DeepgramContextProvider');
  }
  return context;
};
