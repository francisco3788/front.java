import { useEffect, useState } from "react";
import api from "../services/api";

export default function Support() {
  const [supports, setSupports] = useState([]);
  const [claims, setClaims] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState({
    claimId: "",
    technicianId: "",
    startDate: "",
    endDate: "",
    actionTaken: "",
    result: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSupports();
    fetchClaims();
    fetchTechnicians();
  }, []);

  const fetchSupports = async () => {
    const res = await api.get("/soportes");
    setSupports(res.data);
  };

  const fetchClaims = async () => {
    const res = await api.get("/reclamos");
    setClaims(res.data);
  };

  const fetchTechnicians = async () => {
    const res = await api.get("/tecnicos");
    setTechnicians(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      claim: { claimId: form.claimId },
      technician: { technicianId: form.technicianId },
      startDate: form.startDate,
      endDate: form.endDate,
      actionTaken: form.actionTaken,
      result: form.result,
    };

    try {
      if (editId) {
        await api.put(`/soportes/${editId}`, data);
      } else {
        await api.post("/soportes", data);
      }
      setForm({
        claimId: "",
        technicianId: "",
        startDate: "",
        endDate: "",
        actionTaken: "",
        result: "",
      });
      setEditId(null);
      fetchSupports();
    } catch (err) {
      alert("Error al guardar soporte.");
      console.error(err);
    }
  };

  const handleEdit = (s) => {
    setForm({
      claimId: s.claim?.claimId || "",
      technicianId: s.technician?.technicianId || "",
      startDate: s.startDate,
      endDate: s.endDate,
      actionTaken: s.actionTaken,
      result: s.result,
    });
    setEditId(s.idSupport);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este soporte?")) {
      await api.delete(`/soportes/${id}`);
      fetchSupports();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Soportes</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 mb-6 shadow rounded">
        <select name="claimId" value={form.claimId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Seleccione Reclamo</option>
          {claims.map((c) => (
            <option key={c.claimId} value={c.claimId}>
              Reclamo #{c.claimId}
            </option>
          ))}
        </select>

        <select name="technicianId" value={form.technicianId} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Seleccione Técnico</option>
          {technicians.map((t) => (
            <option key={t.technicianId} value={t.technicianId}>
              {t.fullName}
            </option>
          ))}
        </select>

        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="border p-2 rounded" />
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="actionTaken" placeholder="Acción tomada" value={form.actionTaken} onChange={handleChange} required className="border p-2 rounded col-span-2" />
        <input type="text" name="result" placeholder="Resultado" value={form.result} onChange={handleChange} required className="border p-2 rounded col-span-2" />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded col-span-2">
          {editId ? "Actualizar Soporte" : "Registrar Soporte"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Reclamo</th>
            <th className="p-2 border">Técnico</th>
            <th className="p-2 border">Inicio</th>
            <th className="p-2 border">Fin</th>
            <th className="p-2 border">Acción</th>
            <th className="p-2 border">Resultado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {supports.map((s) => (
            <tr key={s.idSupport}>
              <td className="p-2 border">{s.idSupport}</td>
              <td className="p-2 border">#{s.claim?.claimId}</td>
              <td className="p-2 border">{s.technician?.fullName || "-"}</td>
              <td className="p-2 border">{s.startDate}</td>
              <td className="p-2 border">{s.endDate}</td>
              <td className="p-2 border">{s.actionTaken}</td>
              <td className="p-2 border">{s.result}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(s)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                <button onClick={() => handleDelete(s.idSupport)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
