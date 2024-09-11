import React from 'react';
import { Bold, Italic, List } from 'lucide-react';

interface ArtefactEditorProps {
  title: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  titleRef: React.RefObject<HTMLTextAreaElement>;
  contentRef: React.RefObject<HTMLTextAreaElement>;
}

export function ArtefactEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  titleRef,
  contentRef
}: ArtefactEditorProps) {
  const insertMarkdown = (markdownSymbol: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = `${before}${markdownSymbol}${text.substring(start, end)}${markdownSymbol}${after}`;
      onContentChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>);
      textarea.focus();
      textarea.setSelectionRange(start + markdownSymbol.length, end + markdownSymbol.length);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        ref={titleRef}
        value={title}
        onChange={onTitleChange}
        className="w-full p-2 text-2xl font-bold bg-transparent border-none resize-none focus:outline-none focus:ring-0"
        placeholder="Untitled"
        rows={1}
      />
      <div className="flex space-x-2 mb-2">
        <button onClick={() => insertMarkdown('**')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bold size={20} />
        </button>
        <button onClick={() => insertMarkdown('*')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Italic size={20} />
        </button>
        <button onClick={() => insertMarkdown('\n- ')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <List size={20} />
        </button>
      </div>
      <textarea
        ref={contentRef}
        value={content}
        onChange={onContentChange}
        className="w-full h-full p-2 bg-transparent border-none resize-none focus:outline-none focus:ring-0"
        placeholder="Start writing here..."
      />
    </div>
  );
}