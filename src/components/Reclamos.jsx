import { useEffect, useState } from "react";
import api from "../services/api";

export default function Reclamos() {
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState({
    saleId: "",
    productId: "",
    claimDate: "",
    type: "",
    status: "",
  });
  const [editId, setEditId] = useState(null);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  // Obtener reclamos, ventas y productos
  useEffect(() => {
    fetchClaims();
    fetchSales();
    fetchProducts();
  }, []);

  const fetchClaims = async () => {
    const res = await api.get("/reclamos");
    setClaims(res.data);
  };

  const fetchSales = async () => {
    const res = await api.get("/ventas");
    setSales(res.data);
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
    try {
      const data = {
        sale: { saleId: form.saleId },
        product: { productId: form.productId },
        claimDate: form.claimDate,
        type: form.type,
        status: form.status,
      };

      if (editId) {
        await api.put(`/reclamos/${editId}`, data);
      } else {
        await api.post("/reclamos", data);
      }

      setForm({ saleId: "", productId: "", claimDate: "", type: "", status: "" });
      setEditId(null);
      fetchClaims();
    } catch (err) {
      alert("Error al guardar el reclamo.");
      console.error(err);
    }
  };

  const handleEdit = (claim) => {
    setForm({
      saleId: claim.sale?.saleId || "",
      productId: claim.product?.productId || "",
      claimDate: claim.claimDate,
      type: claim.type,
      status: claim.status,
    });
    setEditId(claim.claimId);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este reclamo?")) {
      await api.delete(`/reclamos/${id}`);
      fetchClaims();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Reclamos</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        <select name="saleId" value={form.saleId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Seleccione Venta</option>
          {sales.map((s) => (
            <option key={s.saleId} value={s.saleId}>
              Venta #{s.saleId}
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

        <input type="date" name="claimDate" value={form.claimDate} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="type" placeholder="Tipo" value={form.type} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="status" placeholder="Estado" value={form.status} onChange={handleChange} required className="border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 col-span-2">
          {editId ? "Actualizar" : "Registrar"} Reclamo
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Venta</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.claimId}>
              <td className="p-2 border">{c.claimId}</td>
              <td className="p-2 border">#{c.sale?.saleId}</td>
              <td className="p-2 border">{c.product?.name || `#${c.product?.productId}`}</td>
              <td className="p-2 border">{c.claimDate}</td>
              <td className="p-2 border">{c.type}</td>
              <td className="p-2 border">{c.status}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                <button onClick={() => handleDelete(c.claimId)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
