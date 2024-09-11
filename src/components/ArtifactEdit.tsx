import React, { useState, useEffect } from 'react';
import { Artifact } from '@/lib/ArtifactCreator';
import { Save, X } from 'lucide-react';

interface ArtifactEditProps {
  artifact: Artifact;
  onSave: (id: string, title: string, content: string) => Promise<void>;
  onCancel: () => void;
}

const ArtifactEdit: React.FC<ArtifactEditProps> = ({ artifact, onSave, onCancel }) => {
  const [title, setTitle] = useState(artifact.title);
  const [content, setContent] = useState(artifact.content);

  useEffect(() => {
    setTitle(artifact.title);
    setContent(artifact.content);
  }, [artifact]);

  const handleSave = () => {
    onSave(artifact.id, title, content);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-96 p-2 border rounded resize-none dark:bg-gray-700 dark:text-white"
      />
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          <Save size={20} />
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ArtifactEdit;