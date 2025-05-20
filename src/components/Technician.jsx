import { useEffect, useState } from "react";
import api from "../services/api";

export default function Technician() {
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    specialty: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    const res = await api.get("/tecnicos");
    setTechnicians(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/tecnicos/${editId}`, form);
      } else {
        await api.post("/tecnicos", form);
      }
      setForm({ fullName: "", specialty: "" });
      setEditId(null);
      fetchTechnicians();
    } catch (err) {
      alert("Error al guardar el técnico.");
      console.error(err);
    }
  };

  const handleEdit = (tech) => {
    setForm({
      fullName: tech.fullName,
      specialty: tech.specialty,
    });
    setEditId(tech.technicianId);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este técnico?")) {
      await api.delete(`/tecnicos/${id}`);
      fetchTechnicians();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Técnicos</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 mb-6 shadow rounded">
        <input
          type="text"
          name="fullName"
          placeholder="Nombre completo"
          value={form.fullName}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="specialty"
          placeholder="Especialidad"
          value={form.specialty}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded col-span-2">
          {editId ? "Actualizar Técnico" : "Registrar Técnico"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Especialidad</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((t) => (
            <tr key={t.technicianId}>
              <td className="p-2 border">{t.technicianId}</td>
              <td className="p-2 border">{t.fullName}</td>
              <td className="p-2 border">{t.specialty}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(t)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                <button onClick={() => handleDelete(t.technicianId)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
