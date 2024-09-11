import React from 'react'
import { Artifact } from '@/lib/ArtifactCreator'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

interface ArtifactListProps {
  artifacts: Artifact[]
  onSelectArtifact: (artifactId: string) => void
  onCreateArtifact: () => Promise<void>
  onToggleCollapse: (artifactId: string) => void
  onToggleVisibility: () => void
  isVisible: boolean
  onDeleteArtifact: (artifactId: string) => void  // Add this line
}

const ArtifactList: React.FC<ArtifactListProps> = ({
  artifacts,
  onSelectArtifact,
  onCreateArtifact,
  onToggleCollapse,
  onToggleVisibility,
  isVisible,
  onDeleteArtifact  // Add this line
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <div className="flex-grow overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700 p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Artifacts</h2>
          <button
            onClick={onCreateArtifact}
            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1 p-2">
          {artifacts.map((artifact) => (
            <div 
              key={artifact.id} 
              className="bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
            >
              <div className="flex justify-between items-center p-2">
                <span 
                  className="font-medium text-gray-800 dark:text-white flex-grow"
                  onClick={() => onSelectArtifact(artifact.id)}
                >
                  {artifact.title}
                </span>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArtifact(artifact.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 mr-2"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollapse(artifact.id);
                    }}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  >
                    {artifact.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </button>
                </div>
              </div>
              {!artifact.collapsed && (
                <p className="px-2 pb-2 text-sm text-gray-600 dark:text-gray-300">{artifact.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArtifactList