import { useEffect, useState } from "react";
import api from "../services/api";

export default function ConsultasAvanzadas() {
  const [clientesTop, setClientesTop] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [reclamosRapidos, setReclamosRapidos] = useState([]);
  const [promedioDias, setPromedioDias] = useState(null);

  useEffect(() => {
    fetchClientesTop();
    fetchProductosTop();
    fetchReclamosResueltosRapido();
    fetchPromedioResolucion();
  }, []);

  const fetchClientesTop = async () => {
    try {
      const res = await api.get("/reclamos/clientes-top");
      setClientesTop(res.data);
    } catch (err) {
      console.error("Error al cargar clientes-top", err);
    }
  };

  const fetchProductosTop = async () => {
    try {
      const res = await api.get("/reclamos/productos-top");
      setProductosTop(res.data);
    } catch (err) {
      console.error("Error al cargar productos-top", err);
    }
  };

  const fetchReclamosResueltosRapido = async () => {
    try {
      const res = await api.get("/reclamos/resolved-in-less-than-7-days");
      setReclamosRapidos(res.data);
    } catch (err) {
      console.error("Error al cargar reclamos rápidos", err);
    }
  };

  const fetchPromedioResolucion = async () => {
    try {
      const res = await api.get("/soportes/avg-resolution-time");
      setPromedioDias(res.data);
    } catch (err) {
      console.error("Error al cargar promedio de resolución", err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Consultas Avanzadas</h2>

      {/* CLIENTES MÁS RECLAMADORES */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Clientes con más reclamos (último semestre)</h3>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Total de Reclamos</th>
            </tr>
          </thead>
          <tbody>
            {clientesTop.map((c, i) => (
              <tr key={i}>
                <td className="p-2 border">{c.cliente}</td>
                <td className="p-2 border">{c.totalReclamos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRODUCTOS CON MÁS RECLAMOS */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Productos con mayor número de reclamos</h3>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Producto</th>
              <th className="p-2 border">Total de Reclamos</th>
            </tr>
          </thead>
          <tbody>
            {productosTop.map((p, i) => (
              <tr key={i}>
                <td className="p-2 border">{p.nombreProducto}</td>
                <td className="p-2 border">{p.totalReclamos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECLAMOS RESUELTOS EN MENOS DE 7 DÍAS */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Reclamos resueltos en menos de 7 días</h3>
        {reclamosRapidos.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reclamosRapidos.map((r) => (
                <tr key={r.claimId}>
                  <td className="p-2 border">{r.claimId}</td>
                  <td className="p-2 border">{r.type}</td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border">{r.claimDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay reclamos registrados en menos de 7 días.</p>
        )}
      </div>

      {/* PROMEDIO DE DÍAS POR TÉCNICO */}
      <div className="bg-white shadow rounded p-4 text-center">
        <h3 className="text-xl font-semibold mb-3">Promedio de resolución por técnico</h3>
        {promedioDias !== null ? (
          <p className="text-3xl font-bold text-green-600">{promedioDias.toFixed(2)} días</p>
        ) : (
          <p className="text-gray-500">Cargando promedio...</p>
        )}
      </div>
    </div>
  );
}
