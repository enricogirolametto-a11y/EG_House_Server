const express = require("express");
const { Pool } = require("pg");
const app = express();

const ClerkExpress = require('@clerk/clerk-sdk-node');
const clerkMiddleware = ClerkExpress.clerkMiddleware;
const requireAuth = ClerkExpress.requireAuth;

const cors = require("cors");

// Configurazione CORS dinamica
const allowedOrigins = [
  "http://localhost:5173", // Per lo sviluppo locale con Vite
  "https://eg-house-server-client.vercel.app", // Il tuo URL di produzione su Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permette richieste senza origine (come app mobile o curl)
      // o se l'origine è nella lista degli autorizzati
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

app.use(clerkMiddleware()); // Inizializza il middleware di Clerk
// Proteggi la rotta POST con requireAuth()
app.post("/api/data", requireAuth(), async (req, res) => {
  const { testo } = req.body;
  // Ora puoi accedere all'ID utente autenticato tramite req.auth
  const userId = req.auth.userId;
  console.log(`Richiesta ricevuta dall'utente Clerk: ${userId}`);
  try {
    // Salviamo anche l'userId nel DB per tracciare chi scrive cosa
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

// Rotta per salvare i dati
app.post("/api/data", async (req, res) => {
  const { testo } = req.body;
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Utente non identificato" });
  }
  
  try {
    const result = await pool.query(
      "INSERT INTO messaggi (contenuto, user_id) VALUES ($1, $2) RETURNING *",
      [testo, clerkUserId]
    );
    console.log("Salvato nel DB:", result.rows[0]);
    res.json({
      message: "Dati salvati nel DB!",
      dato: result.rows[0],
    });
  } catch (err) {
    console.error("Errore DB:", err);
    res.status(500).json({ error: "Errore nel salvataggio" });
  }
});

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

app.listen(3001, () => console.log("Server running on port 3001 con Postgres"));
