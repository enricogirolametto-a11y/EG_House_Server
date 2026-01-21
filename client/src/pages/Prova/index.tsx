import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

import { useState } from "react";
import axios from "axios";

import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Prova() {
  const { getToken } = useAuth(); // Hook per recuperare il token
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const inviaDati = async () => {
    if (!input.trim()) return alert("Scrivi qualcosa prima di inviare!");

    setLoading(true);
    try {
      const token = await getToken(); // 1. Recupera il token JWT da Clerk

      if (!token) {
        alert("Errore: Clerk non ha generato il token. Riprova il login.");
        return;
      }
      const res = await axios.post(
        `${API_URL}/api/data`, // Usa il backtick ` e la variabile
        { testo: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setInput("");
    } catch (err) {
      console.error("Errore auth:", err);
      alert("Sessione scaduta o non autorizzata. Riprova il login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-5">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-slate-50 p-4">
          <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 text-center">
              EGH SERVER
            </h1>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Inserisci il tuo messaggio
              </label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Scrivi qui il testo da salvare..."
                className="w-full"
              />
            </div>

            <Button onClick={inviaDati} disabled={loading} className="w-full">
              {loading ? "Invio in corso..." : "Salva nel Database"}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              Backend: localhost:5173 | Frontend: Vite + Shadcn
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-light text-slate-500 italic">
          Pagina Neutra
        </h1>
        <Link to="/" className="text-red-500 text-2xl">
          Torna Indietro
        </Link>
      </div>
    </>
  );
}
