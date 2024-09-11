'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDeepgram } from '@/lib/contexts/DeepgramContext';
import { Mic, Square } from 'lucide-react';
import { createClient, LiveTranscriptionEvents, DeepgramClient } from '@deepgram/sdk';

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { client, error } = useDeepgram();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    if (!client) {
      console.error('Deepgram client not initialized');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const connection = client.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Connection opened.');
        
        mediaRecorderRef.current!.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };
        
        mediaRecorderRef.current!.start(250);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Connection closed.');
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
        const newTranscript = data.channel.alternatives[0].transcript;
        setTranscript(prev => prev + ' ' + newTranscript);
      });

      connection.on(LiveTranscriptionEvents.Error, (error: any) => {
        console.error('Deepgram error:', error);
      });

      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onTranscriptionComplete(transcript.trim());
      setTranscript('');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <div className="text-red-500 mb-2">
          Error: {error}
        </div>
      )}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-2 rounded-full ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        disabled={!client}
      >
        {isRecording ? <Square size={20} /> : <Mic size={20} />}
      </button>
      {isRecording && (
        <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {transcript || 'Listening...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;