import { useState, useRef } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const PromptReader = () => {
  const [childId, setChildId] = useState('');
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('The cat sat on the mat.');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/wav' });
      setAudioURL(URL.createObjectURL(blob));
      uploadAudio(blob);
      chunks.current = [];
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setUploadStatus('');
    setTranscript('');
    setAnalysisResult(null);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const uploadAudio = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    try {
      setUploadStatus('⏫ Uploading...');
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus('✅ Uploaded successfully!');
      const filename = res.data.filename;

      setIsAnalyzing(true);
      const analysisRes = await axios.post(`http://localhost:5000/api/analyze/${filename}`, {
        childId,
        name,
        prompt
      });
      setIsAnalyzing(false);

      const data = analysisRes.data.data;
      setTranscript(data.transcript);
      setAnalysisResult(data);
    } catch (err) {
      setUploadStatus('❌ Upload or analysis failed.');
      setIsAnalyzing(false);
      console.error('AxiosError:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">📖 Read the prompt:</h2>
      <p className="text-lg italic mb-4">{prompt}</p>

      <input
        type="text"
        placeholder="Child ID"
        value={childId}
        onChange={(e) => setChildId(e.target.value)}
        className="text-black px-3 py-1 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-black px-3 py-1 mb-4 block w-full rounded"
      />

      {!isRecording ? (
        <button onClick={startRecording} className="bg-green-600 px-4 py-2 text-white rounded">Start</button>
      ) : (
        <button onClick={stopRecording} className="bg-red-600 px-4 py-2 text-white rounded">Stop</button>
      )}

      {audioURL && (
        <div className="mt-4">
          <h4 className="font-semibold">🔊 Playback:</h4>
          <audio controls src={audioURL} className="mt-2" />
        </div>
      )}

      {uploadStatus && (
        <p className={`mt-4 ${uploadStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {uploadStatus}
        </p>
      )}

      {isAnalyzing && (
        <p className="mt-2 text-yellow-300">🌀 Analyzing...</p>
      )}

      {transcript && (
        <div className="mt-4">
          <h4 className="font-semibold">🧠 Transcript:</h4>
          <p className="italic text-lg">{transcript}</p>
        </div>
      )}

      {analysisResult && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h4 className="text-xl font-semibold mb-2">📊 Detailed Results:</h4>
          <p><strong>Accuracy:</strong> {(analysisResult.accuracy * 100).toFixed(1)}%</p>
          <p><strong>Pronunciation Score:</strong> {(analysisResult.pronunciationScore * 100).toFixed(1)}%</p>
          <p><strong>Hesitation Score:</strong> {(analysisResult.hesitationScore * 100).toFixed(1)}%</p>
          <p><strong>Expression:</strong> {analysisResult.expressionFeedback}</p>
          <p><strong>Proficiency Level:</strong> {analysisResult.proficiencyLevel}</p>
          <p className="mt-2">
            <strong>🔗 Saved Recording:</strong>
            <a
              href={`http://localhost:5000/${analysisResult.recordingUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline ml-1"
            >
              Play Audio
            </a>
          </p>

          {/* 🎯 Chart */}
          <div className="mt-6">
            <h5 className="text-lg font-semibold mb-2">📈 Score Chart</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Accuracy', value: analysisResult.accuracy },
                { name: 'Pronunciation', value: analysisResult.pronunciationScore },
                { name: 'Hesitation', value: analysisResult.hesitationScore },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptReader;
