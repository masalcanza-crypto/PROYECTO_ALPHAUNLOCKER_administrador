const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Sirve el frontend
app.use(express.static(path.join(__dirname, '../../toolkit-FRONTEND_webapp_alphaunlocker')));

// Credenciales
const USUARIO = 'admin';
const CLAVE = '1234';

app.post('/api/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === USUARIO && pass === CLAVE) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});