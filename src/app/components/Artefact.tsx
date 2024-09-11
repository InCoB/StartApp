import React, { useState, useRef, useEffect } from 'react';
import { ArtefactEditor } from './ArtefactEditor';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ChevronLeft, Edit, Save } from 'lucide-react';

interface ArtefactProps {
  artefact: {
    id: string;
    title: string;
    content: string;
  };
  onBack: () => void;
  onSave: (id: string, title: string, content: string) => void;
}

function Artefact({ artefact, onBack, onSave }: ArtefactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(artefact.title);
  const [content, setContent] = useState(artefact.content);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(artefact.id, title, content);
    setIsEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <button onClick={onBack} className="text-blue-500 hover:text-blue-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isEditing ? <Save size={20} /> : <Edit size={20} />}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {isEditing ? (
          <ArtefactEditor
            title={title}
            content={content}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            titleRef={titleRef}
            contentRef={contentRef}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Artefact;