import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, User!</h1>

      <p className="mb-6">
        Use the options below to get started with reading tests or explore other features.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/reader')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          📖 Start Reading Test
        </button>

        <button
          onClick={() => navigate('/progress')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
        >
          📈 View Progress
        </button>

        <button
          onClick={() => navigate('/results')}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition w-full"
        >
          📋 View All Results
        </button>

        <button
          onClick={() => navigate('/prompt-editor')}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition w-full"
        >
          ✍️ Create New Prompt
        </button>

        <button
          onClick={() => navigate('/children')}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition w-full"
        >
          🧒 Manage Children
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition w-full"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}
