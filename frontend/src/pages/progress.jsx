import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Progress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/childrenresults')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">📈 Progress Tracker</h1>
      <p>This page shows improvement trends in reading accuracy, pronunciation, and hesitation over time.</p>

      {data.length === 0 ? (
        <p className="mt-4 text-yellow-300">No results yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {data.map((res, idx) => (
            <li key={idx} className="bg-gray-800 p-4 rounded">
              <strong>{res.name}</strong> — Accuracy: {(res.accuracy * 100).toFixed(1)}%, Proficiency: {res.proficiencyLevel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
