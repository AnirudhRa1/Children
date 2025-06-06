import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, User!</h1>

      <p className="mb-6">
        Use the options below to get started with reading tests or explore other features.
      </p>

      <button
        onClick={() => navigate('/reader')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📖 Start Reading Test
      </button>
    </div>
  );
}
