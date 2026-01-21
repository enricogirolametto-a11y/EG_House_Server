
 /*  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4"> */

{/*       <SignedOut>
        <div className="text-center space-y-4 bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold">Benvenuto in EG House</h1>
          <p className="text-slate-500">Accedi per gestire il server</p>
          <SignInButton mode="modal">
            <Button className="w-full">Accedi con Google</Button>
          </SignInButton>
        </div>
      </SignedOut> */}

      
     /*  <SignedIn> */
        {/* <div className="absolute top-4 right-4">
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
              Backend: localhost:5173 | Frontend: Vite + Shadcn
            </p>
          </div>
        </div> */}
     /*  </SignedIn> */
    /* </div> */
/*   );
} */

/* export default App; */
 


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

// Gli import puntano alle CARTELLE
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Prova from "./pages/Prova";
import { Button } from "./components/ui/button";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <>
            <SignedOut> <div className="text-center space-y-4 bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold">Benvenuto in EG House</h1>
          <p className="text-slate-500">Accedi per gestire il server</p>
          <SignInButton mode="modal">
            <Button className="w-full">Accedi con Google</Button>
          </SignInButton>
        </div></SignedOut>
            <SignedIn><Navigate to="/" /></SignedIn>
          </>
        } />

        <Route path="/" element={
          <>
            <SignedIn><Dashboard /></SignedIn>
            <SignedOut><Navigate to="/login" /></SignedOut>
          </>
        } />

        <Route path="/prova" element={<Prova />} />
      </Routes>
    </BrowserRouter>
  );
}
