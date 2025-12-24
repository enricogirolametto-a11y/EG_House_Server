const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const { clerkClient, ClerkExpressWithAuth, ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://eg-house-server-client.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Non autorizzato da CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(ClerkExpressWithAuth());

app.post("/api/data", ClerkExpressRequireAuth(), async (req, res) => {
  console.log("Auth OK per utente:", req.auth.userId);
  const { testo } = req.body;
  
  // Con questo middleware, l'ID utente è in req.auth.userId
  const userId = req.auth.userId;

  try {
    const result = await pool.query(
      "INSERT INTO messaggi (contenuto, user_id) VALUES ($1, $2) RETURNING *",
      [testo, userId]
    );
    res.json({ message: "Dati salvati con successo!", dato: result.rows[0] });
  } catch (err) {
    console.error("Errore DB:", err);
    res.status(500).json({ error: "Errore nel salvataggio" });
  }
});

const isProduction = process.env.DATABASE_URL ? true : false;

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        // Configurazione per Docker Locale
        user: "user",
        host: "localhost",
        database: "mydb",
        password: "password", // Assicurati che sia una stringa
        port: 5432,
        ssl: false,
      }
);

// Funzione per inizializzare il DB automaticamente
const inizializzaDB = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS messaggi (
        id SERIAL PRIMARY KEY,
        contenuto TEXT,
        user_id TEXT,
        data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("Database locale pronto: tabella 'messaggi' verificata.");
  } catch (err) {
    console.error("Errore inizializzazione tabella:", err);
  }
};

inizializzaDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Rotta extra per vedere tutti i messaggi (opzionale)
app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messaggi ORDER BY data_invio DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
});

