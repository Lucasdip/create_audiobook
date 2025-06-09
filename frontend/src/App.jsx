import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Selecione um PDF!');
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setAudioUrl(res.data.audioUrl);
    } catch (err) {
      alert('Erro ao processar PDF!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🎧 PDF para Áudio</h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Processando...' : 'Converter'}
        </button>

        {audioUrl && (
          <div className="result">
            <audio controls src={audioUrl}></audio>
            <a href={audioUrl} download="audio.mp3">⬇️ Baixar Áudio</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
