require("dotenv").config();
import express from 'express'
import cors from 'cors'
import { clerkMiddleware, getAuth } from "@clerk/express";
import { Pool } from "pg";
//const { Pool } = require("pg");
//const cors = require("cors");
//const { clerkMiddleware, getAuth } = require("@clerk/express");
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

app.use(clerkMiddleware());

app.post("/api/data", async (req, res) => {
  const { userId } = getAuth(req); // Usa getAuth correttamente
  console.log("SONO entrato nel server QUI")
  if (!userId) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const { testo } = req.body;
  if (!testo) {
    return res.status(400).json({ error: "Testo mancante" });
  }

  console.log("Auth OK per utente:", userId);

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
