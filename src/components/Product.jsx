import { useEffect, useState } from "react";
import api from "../services/api";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    warranty: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      warranty: form.warranty,
    };

    try {
      if (editId) {
        await api.put(`/productos/${editId}`, data);
      } else {
        await api.post("/productos", data);
      }
      setForm({ name: "", description: "", price: "", warranty: "" });
      setEditId(null);
      fetchProducts();
    } catch (error) {
      alert("Error al guardar el producto");
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      warranty: product.warranty,
    });
    setEditId(product.productId);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este producto?")) {
      await api.delete(`/productos/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 mb-6 shadow rounded">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="warranty"
          placeholder="Garantía"
          value={form.warranty}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded col-span-2">
          {editId ? "Actualizar Producto" : "Registrar Producto"}
        </button>
      </form>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Garantía</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td className="p-2 border">{p.productId}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.description}</td>
              <td className="p-2 border">${p.price.toFixed(2)}</td>
              <td className="p-2 border">{p.warranty}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 rounded">Editar</button>
                <button onClick={() => handleDelete(p.productId)} className="bg-red-600 text-white px-2 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
