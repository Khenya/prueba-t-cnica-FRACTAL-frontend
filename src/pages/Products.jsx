import { useEffect, useState } from "react";
import api from "../api/api";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", unit_price: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data.data);
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, newProduct);
      } else {
        await api.post("/products", newProduct);
      }

      await fetchProducts();
      setNewProduct({ name: "", unit_price: "" });
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => {
    setNewProduct({ name: product.name, unit_price: product.unit_price });
    setEditing(product.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("You are about to delete this product. Are you sure?")) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Producto name"
          value={newProduct.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="unit_price"
          placeholder="unit price"
          value={newProduct.unit_price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Actualizar" : "Create"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2 text-center">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2 text-right">${p.unit_price}</td>
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                Not products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}