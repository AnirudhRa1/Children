export default function Settings() {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">⚙️ Settings</h1>
        <p>Here you can configure system settings like MongoDB URI, scoring weights, or user roles.</p>
  
        <ul className="mt-4 space-y-2">
          <li>• MongoDB URI: <code>mongodb://localhost:27017/readingApp</code></li>
          <li>• Whisper mode: <span className="text-green-400">Local</span></li>
          <li>• Admin Access: <span className="text-yellow-300">Enabled</span></li>
        </ul>
      </div>
    );
  }
  