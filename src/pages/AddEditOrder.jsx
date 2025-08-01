import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const today = new Date().toISOString().split("T")[0];

  const [order, setOrder] = useState({
    order_number: "",
    date: today,
    final_price: 0,
    status: "Pending",
    products: [], // Array of { product_id }
  });

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.data || []))
      .catch(() => alert("Error al cargar productos"));

    if (isEdit) {
      fetch(`http://localhost:3000/api/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const fetchedOrder = data.data;
          setOrder({
            ...fetchedOrder,
            products: fetchedOrder.products.map((p) => ({
              product_id: p.product_id,
            })),
          });
        })
        .catch(() => alert("Error al cargar la orden"));
    }
  }, [id]);

  useEffect(() => {
    const total = order.products.reduce((acc, item) => {
      const found = allProducts.find((p) => p.id === parseInt(item.product_id));
      return found ? acc + parseFloat(found.unit_price) : acc;
    }, 0);

    setOrder((prev) => ({ ...prev, final_price: total.toFixed(2) }));
  }, [order.products, allProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (productId) => {
    const exists = order.products.some(
      (p) => parseInt(p.product_id) === productId
    );

    let updatedProducts;
    if (exists) {
      updatedProducts = order.products.filter(
        (p) => parseInt(p.product_id) !== productId
      );
    } else {
      updatedProducts = [...order.products, { product_id: productId }];
    }

    setOrder((prev) => ({ ...prev, products: updatedProducts }));
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
        body: JSON.stringify({
          ...order,
          products: order.products.map((p) => ({
            product_id: parseInt(p.product_id),
            quantity: 1,
          })),
        }),
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
          placeholder="Order Number"
          value={order.order_number}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="date"
          value={order.date}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          name="final_price"
          type="text"
          value={`$${order.final_price}`}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          type="text"
          value={`# Products: ${order.products.length}`}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
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

        <h3 className="text-lg mt-4">Seleccionar productos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allProducts.map((product) => (
            <label key={product.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={order.products.some(
                  (p) => parseInt(p.product_id) === product.id
                )}
                onChange={() => handleCheckboxChange(product.id)}
              />
              {product.name} – ${product.price}
            </label>
          ))}
        </div>

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