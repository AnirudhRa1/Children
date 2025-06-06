import { useState } from 'react';

export default function PromptEditor() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    alert(`Prompt saved: "${prompt}"`);
    setPrompt('');
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">✍️ Prompt Editor</h1>
      <p>Add custom sentences or paragraphs for students to read.</p>

      <textarea
        className="mt-4 w-full p-3 text-black rounded"
        rows={4}
        placeholder="Enter reading prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Prompt
      </button>
    </div>
  );
}
