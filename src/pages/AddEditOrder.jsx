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
    products: [],
  });

  const [allProducts, setAllProducts] = useState([]);

  // Obtener todos los productos
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.data || []))
      .catch((err) => {
        console.error("❌ Error al cargar productos:", err);
        alert("Error al cargar productos");
      });
  }, []);

  // Obtener la orden si estamos editando
  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:3000/api/orders/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const fetchedOrder = data.data;
          if (!fetchedOrder) throw new Error("Orden no encontrada");
          setOrder({
            ...fetchedOrder,
            products: fetchedOrder.products || [],
          });
        })
        .catch((err) => {
          console.error("❌ Error al obtener la orden:", err);
          alert("Error al cargar la orden");
        });
    }
  }, [id, isEdit]);

  // Calcular precio final
  useEffect(() => {
    const total = order.products.reduce((acc, item) => {
      const producto = allProducts.find(
        (p) => p.id === parseInt(item.product_id)
      );
      const quantity = parseInt(item.quantity) || 1;
      return producto
        ? acc + parseFloat(producto.unit_price) * quantity
        : acc;
    }, 0);
    setOrder((prev) => ({
      ...prev,
      final_price: Number(total.toFixed(2)),
    }));
  }, [order.products, allProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar/quitar producto
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
      updatedProducts = [
        ...order.products,
        { product_id: productId, quantity: 1 },
      ];
    }
    setOrder((prev) => ({ ...prev, products: updatedProducts }));
  };

  // Cambiar cantidad
  const handleQuantityChange = (productId, quantity) => {
    const updatedProducts = order.products.map((p) =>
      parseInt(p.product_id) === productId
        ? { ...p, quantity: parseInt(quantity) || 1 }
        : p
    );
    setOrder((prev) => ({ ...prev, products: updatedProducts }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `http://localhost:3000/api/orders/${id}`
      : "http://localhost:3000/api/orders";
    const method = isEdit ? "PUT" : "POST";

    const finalPrice = parseFloat(order.final_price);

    try {
      const body = {
        order_number: order.order_number,
        date: new Date(order.date).toISOString().split("T")[0],
        final_price: finalPrice,
        status: order.status.toLowerCase(), // 🔥 aquí está el fix
        products: order.products.map((p) => ({
          product_id: parseInt(p.product_id),
          quantity: parseInt(p.quantity),
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Error al guardar la orden: ${error}`);
      }

      navigate("/");
    } catch (err) {
      console.error("❌ Error al enviar orden:", err);
      alert("Error al guardar la orden");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Editar Orden" : "Nueva Orden"}
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
          value={order.final_price}
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

        <h3 className="text-lg mt-4 font-semibold">Seleccionar productos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allProducts.map((product) => {
            const selected = order.products.find(
              (p) => parseInt(p.product_id) === product.id
            );
            return (
              <label key={product.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => handleCheckboxChange(product.id)}
                />
                <span className="flex-1">
                  {product.name} – ${product.unit_price}
                </span>
                {selected && (
                  <input
                    type="number"
                    min="1"
                    value={selected.quantity}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="w-16 border rounded p-1"
                  />
                )}
              </label>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 mt-6">
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