import { useEffect, useState } from "react";
import api from "../api/api";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    <div className="card shadow p-4 mx-auto" style={{ width: "100%", maxWidth: "900px" }}>
      <h2 className="text-primary fw-bold mb-4">Products</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <input
            type="number"
            name="unit_price"
            placeholder="Unit Price"
            value={newProduct.unit_price}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>${p.unit_price}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="btn btn-sm btn-outline-secondary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}