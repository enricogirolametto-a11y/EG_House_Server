import { useState } from "react";
import axios from "axios";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/clerk-react";

function App() {
  const { getToken } = useAuth(); // Hook per recuperare il token
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const inviaDati = async () => {
    if (!input.trim()) return alert("Scrivi qualcosa prima di inviare!");

    setLoading(true);
    try {
      const token = await getToken(); // 1. Recupera il token JWT da Clerk
      const res = await axios.post(
        "http://localhost:3001/api/data",
        { testo: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      {/* SE L'UTENTE NON È LOGGATO: Mostra pulsante di login */}
      <SignedOut>
        <div className="text-center space-y-4 bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold">Benvenuto in EG House</h1>
          <p className="text-slate-500">Accedi per gestire il server</p>
          <SignInButton mode="modal">
            <Button className="w-full">Accedi con Google</Button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* SE L'UTENTE È LOGGATO: Mostra l'app e il tasto Logout */}
      <SignedIn>
        <div className="absolute top-4 right-4">
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-slate-50 p-4">
          <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 text-center">
              Gestione Monorepo 2025
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
              Backend: localhost:3001 | Frontend: Vite + Shadcn
            </p>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
