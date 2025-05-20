import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sale() {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    clientId: "",
    productId: "",
    saleDate: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    const res = await api.get("/ventas");
    setSales(res.data);
  };

  const fetchClients = async () => {
    const res = await api.get("/clientes");
    setClients(res.data);
  };

  const fetchProducts = async () => {
    const res = await api.get("/productos");
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      client: { clientId: form.clientId },
      product: { productId: form.productId },
      saleDate: form.saleDate,
    };

    try {
      if (editId) {
        await api.put(`/ventas/${editId}`, data);
      } else {
        await api.post("/ventas", data);
      }
      setForm({ clientId: "", productId: "", saleDate: "" });
      setEditId(null);
      fetchSales();
    } catch (error) {
      alert("Error al guardar la venta");
      console.error(error);
    }
  };

  const handleEdit = (sale) => {
    setForm({
      clientId: sale.client?.clientId || "",
      productId: sale.product?.productId || "",
      saleDate: sale.saleDate || "",
    });
    setEditId(sale.saleId);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar esta venta?")) {
      await api.delete(`/ventas/${id}`);
      fetchSales();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Ventas</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 mb-6 shadow rounded">
        <select name="clientId" value={form.clientId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Seleccione Cliente</option>
          {clients.map((c) => (
            <option key={c.clientId} value={c.clientId}>
              {c.fullName || `Cliente #${c.clientId}`}
            </option>
          ))}
        </select>

        <select name="productId" value={form.productId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Seleccione Producto</option>
          {products.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.name || `Producto #${p.productId}`}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="saleDate"
          value={form.saleDate}
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded col-span-2">
          {editId ? "Actualizar Venta" : "Registrar Venta"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.saleId}>
              <td className="p-2 border">{s.saleId}</td>
              <td className="p-2 border">{s.client?.fullName || `#${s.client?.clientId}`}</td>
              <td className="p-2 border">{s.product?.name || `#${s.product?.productId}`}</td>
              <td className="p-2 border">{s.saleDate}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(s)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                <button onClick={() => handleDelete(s.saleId)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
