const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'user', host: 'localhost', database: 'mydb', password: 'password', port: 5432,
});

app.post('/api/data', async (req, res) => {
  const { testo } = req.body;
  console.log("Ricevuto:", testo);
  // Qui andrebbe la query SQL: await pool.query('INSERT INTO...', [testo])
  res.json({ message: "Dati ricevuti con successo!" });
});

app.listen(3001, () => console.log("Server running on port 3001"));
