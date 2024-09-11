import React from 'react';

interface ModelSelectorProps {
  model: 'openai' | 'anthropic';
  onModelChange: (model: 'openai' | 'anthropic') => void;
}

export default function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <select
      value={model}
      onChange={(e) => onModelChange(e.target.value as 'openai' | 'anthropic')}
      className="p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
    >
      <option value="openai">OpenAI</option>
      <option value="anthropic">Anthropic</option>
    </select>
  );
}