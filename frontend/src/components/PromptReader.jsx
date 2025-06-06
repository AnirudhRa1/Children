import { useState, useRef } from 'react';
import axios from 'axios';

const PromptReader = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [transcript, setTranscript] = useState('');
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
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const uploadAudio = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('✅ Uploaded successfully!');

      // Now call Whisper API to analyze
      const filename = res.data.filename;
      const analysisRes = await axios.post(`http://localhost:5000/api/analyze/${filename}`);
      setTranscript(analysisRes.data.text);
    } catch (err) {
      setUploadStatus('❌ Upload failed.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Read the prompt:</h2>
      <p className="text-lg italic mb-4">The cat sat on the mat.</p>

      {!isRecording ? (
        <button onClick={startRecording} className="bg-green-600 px-4 py-2 text-white rounded">Start</button>
      ) : (
        <button onClick={stopRecording} className="bg-red-600 px-4 py-2 text-white rounded">Stop</button>
      )}

      {audioURL && (
        <div className="mt-4">
          <h4 className="font-semibold">Playback:</h4>
          <audio controls src={audioURL} className="mt-2" />
        </div>
      )}

      {uploadStatus && (
        <p className={`mt-4 ${uploadStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {uploadStatus}
        </p>
      )}

      {transcript && (
        <div className="mt-4">
          <h4 className="font-semibold">🧠 Transcript:</h4>
          <p className="italic text-lg">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default PromptReader;
