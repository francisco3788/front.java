import { Routes, Route, Link } from "react-router-dom";
import Reclamos from "./components/Reclamos";
import Sale from "./components/Sale";
import Product from "./components/Product";
import Client from "./components/Client";
import Technician from "./components/Technician";
import Support from "./components/Support";
import ConsultasAvanzadas from "./components/ConsultasAvanzadas";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      {/* Navegación */}
      <nav className="flex gap-4 mb-6 flex-wrap">
        <Link to="/productos" className="text-blue-700 font-semibold hover:underline">Productos</Link>
        <Link to="/ventas" className="text-blue-700 font-semibold hover:underline">Ventas</Link>
        <Link to="/reclamos" className="text-blue-700 font-semibold hover:underline">Reclamos</Link>
        <Link to="/clientes" className="text-blue-700 font-semibold hover:underline">Clientes</Link>
        <Link to="/tecnicos" className="text-blue-700 font-semibold hover:underline">Técnicos</Link>
        <Link to="/soportes" className="text-blue-700 font-semibold hover:underline">Soportes</Link>
        <Link to="/consultas" className="text-blue-700 font-semibold hover:underline">Consultas</Link>
      </nav>

      {/* Rutas */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-white rounded shadow p-8 text-center space-y-4">
              <h1 className="text-3xl font-bold text-blue-700">Sistema de Reclamos y Garantías</h1>
              <p className="text-gray-700 text-lg">
                Administra productos, ventas, reclamos, soporte técnico y más.
              </p>
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm shadow">Productos</span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm shadow">Reclamos</span>
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm shadow">Técnicos</span>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm shadow">Soportes</span>
              </div>
            </div>
          }
        />
        <Route path="/productos" element={<Product />} />
        <Route path="/ventas" element={<Sale />} />
        <Route path="/reclamos" element={<Reclamos />} />
        <Route path="/clientes" element={<Client />} />
        <Route path="/tecnicos" element={<Technician />} />
        <Route path="/soportes" element={<Support />} />
        <Route path="/consultas" element={<ConsultasAvanzadas />} />
      </Routes>
    </div>
  );
}

export default App;
