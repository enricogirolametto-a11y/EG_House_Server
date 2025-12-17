const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configurazione connessione Postgres
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

// Rotta per salvare i dati
app.post('/api/data', async (req, res) => {
  const { testo } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO messaggi (contenuto) VALUES ($1) RETURNING *', 
      [testo]
    );
    console.log("Salvato nel DB:", result.rows[0]);
    res.json({ 
      message: "Dati salvati nel DB!", 
      dato: result.rows[0] 
    });
  } catch (err) {
    console.error("Errore DB:", err);
    res.status(500).json({ error: "Errore nel salvataggio" });
  }
});

// Rotta extra per vedere tutti i messaggi (opzionale)
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messaggi ORDER BY data_invio DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001 con Postgres"));
