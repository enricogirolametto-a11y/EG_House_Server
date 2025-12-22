import { useState } from 'react'
import axios from 'axios'
// Import dei componenti shadcn tramite l'alias @ configurato in jsconfig.json
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function App() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const inviaDati = async () => {
    if (!input.trim()) return alert("Scrivi qualcosa prima di inviare!");
    
    setLoading(true)
    try {
      // Nota: usa l'URL corretto del tuo backend locale
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await axios.post(`${API_URL}/api/data`, { testo: input });

      alert("Risposta dal server: " + res.data.message)
      setInput("") // Pulisce l'input dopo l'invio
    } catch (err) {
      console.error("Errore durante l'invio:", err)
      alert("Errore nella connessione al server")
    } finally {
      setLoading(false)
    }
  }

  return (
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

        <Button 
          onClick={inviaDati} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Invio in corso..." : "Salva nel Database"}
        </Button>

        <p className="text-xs text-slate-400 text-center">
          Backend: localhost:3001 | Frontend: Vite + Shadcn
        </p>
      </div>
    </div>
  )
}

export default App
