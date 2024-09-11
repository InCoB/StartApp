'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useChat } from 'ai/react'
import { Send, Trash2, Copy, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Edit, X, Plus, Save, Maximize2, Minimize2, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ArtifactCreator, Artifact } from '@/lib/ArtifactCreator'
import ReactMarkdown from 'react-markdown'
import { getLayoutClass } from '@/utils/layoutUtils'
import ChatArea from './ChatArea'
import ArtifactEdit from './ArtifactEdit'
import ArtifactList from './ArtifactList'
import Artefact from '../app/components/Artefact'
import { addDocument } from '@/lib/firebase/firebaseUtils'
import { db } from '@/lib/firebase/firebase'
import ChatList from './ChatList'
import VoiceRecorder from './VoiceRecorder'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  const [layout, setLayout] = useState<'default' | 'expanded' | 'mobile'>('default')
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [isArtifactListVisible, setIsArtifactListVisible] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { theme, setTheme } = useTheme()
  const artifactCreator = useRef(new ArtifactCreator())
  const [isCreatingArtifact, setIsCreatingArtifact] = useState(false)

  useEffect(() => {
    loadArtifacts()
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setLayout('mobile')
    } else {
      setLayout(selectedArtifact ? 'expanded' : 'default')
    }
  }

  const loadArtifacts = async () => {
    const loadedArtifacts = await artifactCreator.current.getAllArtifacts()
    setArtifacts(loadedArtifacts)
  }

  const handleCreateCustomArtifact = useCallback(async () => {
    if (isCreatingArtifact) return;
    
    setIsCreatingArtifact(true);
    try {
      const newArtifact = await artifactCreator.current.createCustomArtifact('New Artifact', 'Enter content here...');
      setArtifacts(prevArtifacts => [...prevArtifacts, newArtifact]);
    } catch (error) {
      console.error("Error creating artifact:", error);
    } finally {
      setIsCreatingArtifact(false);
    }
  }, [isCreatingArtifact]);

  const handleEditArtifact = (artifactId: string) => {
    const artifact = artifacts.find(a => a.id === artifactId)
    if (artifact) {
      setSelectedArtifact(artifact)
      setLayout(window.innerWidth < 768 ? 'mobile' : 'expanded')
    }
  }

  const handleSaveArtifact = async (id: string, title: string, content: string) => {
    const updatedArtifact = await artifactCreator.current.updateArtifact(id, title, content)
    if (updatedArtifact) {
      setArtifacts(artifacts.map(a => a.id === id ? updatedArtifact : a))
    }
    setSelectedArtifact(null)
    setLayout(window.innerWidth < 768 ? 'mobile' : 'default')
  }

  const handleToggleCollapse = (id: string) => {
    setArtifacts(artifacts.map(a => 
      a.id === id ? { ...a, collapsed: !a.collapsed } : a
    ))
  }

  const toggleArtifactList = () => {
    setIsArtifactListVisible(!isArtifactListVisible)
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSelectArtifact = (artifactId: string) => {
    const artifact = artifacts.find(a => a.id === artifactId);
    if (artifact) {
      setSelectedArtifact(artifact);
      setLayout(window.innerWidth < 768 ? 'mobile' : 'expanded');
    }
  };

  const handleBackFromArtifact = () => {
    setSelectedArtifact(null);
    setLayout(window.innerWidth < 768 ? 'mobile' : 'default');
  };

  const handleDeleteArtifact = async (artifactId: string) => {
    const isDeleted = await artifactCreator.current.deleteArtifact(artifactId);
    if (isDeleted) {
      setArtifacts(prevArtifacts => prevArtifacts.filter(a => a.id !== artifactId));
      if (selectedArtifact && selectedArtifact.id === artifactId) {
        setSelectedArtifact(null);
        setLayout(window.innerWidth < 768 ? 'mobile' : 'default');
      }
    }
  };

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleTranscriptionComplete = (transcript: string) => {
    handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <header className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-md p-4 flex justify-between items-center m-4">
        <h1 className="text-2xl font-bold">AI Chat Application</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {layout === 'mobile' && (
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden p-4 space-x-4">
        <div className={`flex flex-col transition-all duration-300 rounded-lg overflow-hidden ${
          layout === 'expanded' ? 'w-1/2' : isArtifactListVisible ? 'w-3/5' : 'w-full'
        } min-w-[300px] bg-white dark:bg-gray-800 shadow-md`}>
          <ChatArea
            messages={messages}
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              handleSubmit(e)
            }}
            layout={layout}
          />
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
          </div>
        </div>
        {(isArtifactListVisible || layout === 'expanded') && (
          <div className={`flex flex-col transition-all duration-300 rounded-lg overflow-hidden ${
            layout === 'expanded' ? 'w-1/2' : 'w-2/5'
          }`}>
            <div className="h-full overflow-y-auto bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
              {selectedArtifact ? (
                <Artefact
                  artefact={selectedArtifact}
                  onBack={handleBackFromArtifact}
                  onSave={handleSaveArtifact}
                />
              ) : (
                <>
                  <ArtifactList
                    artifacts={artifacts}
                    onSelectArtifact={handleSelectArtifact}
                    onCreateArtifact={handleCreateCustomArtifact}
                    onToggleCollapse={handleToggleCollapse}
                    onToggleVisibility={toggleArtifactList}
                    isVisible={isArtifactListVisible}
                    onDeleteArtifact={handleDeleteArtifact}
                  />
                  <ChatList />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}