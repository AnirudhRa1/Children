import { useState } from 'react';

export default function ChildrenManager() {
  const [children, setChildren] = useState([
    { id: 1, name: 'Riya' },
    { id: 2, name: 'Arjun' }
  ]);

  const [newName, setNewName] = useState('');

  const addChild = () => {
    setChildren([...children, { id: children.length + 1, name: newName }]);
    setNewName('');
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🧒 Manage Children</h1>
      <ul className="mb-4 space-y-1">
        {children.map((c) => (
          <li key={c.id} className="bg-gray-700 p-2 rounded">{c.name}</li>
        ))}
      </ul>
      <input
        className="text-black px-3 py-1 rounded"
        placeholder="Child Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button
        onClick={addChild}
        className="ml-2 bg-green-600 px-3 py-1 text-white rounded hover:bg-green-700"
      >
        Add
      </button>
    </div>
  );
}
