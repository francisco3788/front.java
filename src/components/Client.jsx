import { useEffect, useState } from "react";
import api from "../services/api";

export default function Client() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    identificationNumber: "",
    address: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await api.get("/clientes");
    setClients(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/clientes/${editId}`, form);
      } else {
        await api.post("/clientes", form);
      }
      setForm({
        fullName: "",
        email: "",
        phone: "",
        identificationNumber: "",
        address: "",
      });
      setEditId(null);
      fetchClients();
    } catch (err) {
      alert("Error al guardar el cliente.");
      console.error(err);
    }
  };

  const handleEdit = (client) => {
    setForm({
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      identificationNumber: client.identificationNumber,
      address: client.address,
    });
    setEditId(client.clientId);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este cliente?")) {
      await api.delete(`/clientes/${id}`);
      fetchClients();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 mb-6 shadow rounded">
        <input type="text" name="fullName" placeholder="Nombre completo" value={form.fullName} onChange={handleChange} required className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="identificationNumber" placeholder="Número de identidad" value={form.identificationNumber} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} className="border p-2 rounded col-span-2" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded col-span-2">
          {editId ? "Actualizar Cliente" : "Registrar Cliente"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Identificación</th>
            <th className="p-2 border">Dirección</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.clientId}>
              <td className="p-2 border">{c.clientId}</td>
              <td className="p-2 border">{c.fullName}</td>
              <td className="p-2 border">{c.email}</td>
              <td className="p-2 border">{c.phone}</td>
              <td className="p-2 border">{c.identificationNumber}</td>
              <td className="p-2 border">{c.address}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                <button onClick={() => handleDelete(c.clientId)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
