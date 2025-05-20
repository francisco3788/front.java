import { useEffect, useState } from "react";
import api from "../services/api";

export default function ConsultasAvanzadas() {
  const [clientesTop, setClientesTop] = useState([]);
  const [productosTop, setProductosTop] = useState([]);

  useEffect(() => {
    fetchClientesTop();
    fetchProductosTop();
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

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold mb-4">Consultas Avanzadas</h2>

      {/* Clientes con más reclamos */}
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

      {/* Productos con más reclamos */}
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
    </div>
  );
}
