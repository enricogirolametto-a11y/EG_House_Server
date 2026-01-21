
import { Link } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";


// Definizione interfaccia locale
interface DashboardData {
  id: number;
  testo: string;
}

export default function Dashboard() {
  return (
    <div >
      <DashboardHeader title="Area Gestione 2025" />
      
      <div className="mt-6 p-4 bg-white border rounded shadow-sm">
        <p className="text-slate-600">Qui andrà la logica dell'input.</p>
      </div>

      <nav className="mt-10">
        <Link to="/prova" className="text-blue-500 hover:text-blue-700 font-medium">
          → Vai alla pagina di monitoraggio benzina
        </Link>
      </nav>
    </div>
  );
}
