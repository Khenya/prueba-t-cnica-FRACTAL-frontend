import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [order, setOrder] = useState({
    order_number: "",
    date: "",
    final_price: "",
    status: "Pending",
    products: [{ product_id: "", quantity: 1 }],
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:3000/api/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data.data);
        })
        .catch(() => alert("Error al cargar la orden"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...order.products];
    updatedProducts[index][field] = value;
    setOrder((prev) => ({ ...prev, products: updatedProducts }));
  };

  const addProductRow = () => {
    setOrder((prev) => ({
      ...prev,
      products: [...prev.products, { product_id: "", quantity: 1 }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit
      ? `http://localhost:3000/api/orders/${id}`
      : "http://localhost:3000/api/orders";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Error al guardar la orden");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la orden");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Editar Orden" : "New Order"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="order_number"
          placeholder="Número de orden"
          value={order.order_number}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="date"
          value={order.date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="final_price"
          type="number"
          placeholder="Precio final"
          value={order.final_price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <select
          name="status"
          value={order.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>

        <h3 className="text-lg mt-4">Productos</h3>
        {order.products.map((product, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              placeholder="ID del producto"
              value={product.product_id}
              onChange={(e) =>
                handleProductChange(index, "product_id", e.target.value)
              }
              className="flex-1 border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={product.quantity}
              onChange={(e) =>
                handleProductChange(index, "quantity", e.target.value)
              }
              className="w-24 border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addProductRow}
          className="text-sm text-blue-500 hover:underline"
        >
          + Agregar producto
        </button>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}