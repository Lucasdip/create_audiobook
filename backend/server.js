const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const gTTS = require('gtts');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use('/audios', express.static('audios'));

// Configuração do Multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  const pdfPath = req.file.path;
  const audioPath = `audios/${Date.now()}.mp3`;

  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const text = data.text.trim().slice(0, 5000); // Limite de caracteres

    const gtts = new gTTS(text, 'pt');
    gtts.save(audioPath, function (err) {
      if (err) {
        return res.status(500).send('Erro ao gerar áudio');
      }
      res.json({ audioUrl: `http://localhost:${PORT}/${audioPath}` });
    });

  } catch (err) {
    res.status(500).send('Erro ao processar PDF');
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
