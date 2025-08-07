import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

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

  useEffect(() => {
    api.get("/products")
      .then((res) => setAllProducts(res.data.data || []))
      .catch((err) => {
        console.error("❌ Error al cargar productos:", err);
        alert("Error al cargar productos");
      });
  }, []);

  useEffect(() => {
    if (isEdit) {
      api.get(`/orders/${id}`)
        .then((res) => {
          const fetchedOrder = res.data.data;
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

    const finalPrice = parseFloat(order.final_price);
    const body = {
      order_number: order.order_number,
      date: new Date(order.date).toISOString().split("T")[0],
      final_price: finalPrice,
      status: order.status.toLowerCase(),
      products: order.products.map((p) => ({
        product_id: parseInt(p.product_id),
        quantity: parseInt(p.quantity),
      })),
    };

    try {
      if (isEdit) {
        await api.put(`/orders/${id}`, body);
      } else {
        await api.post("/orders", body);
      }
      navigate("/");
    } catch (err) {
      console.error("❌ Error al enviar orden:", err);
      alert("Error al guardar la orden");
    }
  };

  return (
    <div className="card shadow p-4 mx-auto" style={{ width: "100%", maxWidth: "900px" }}>
      <h2 className="text-primary fw-bold mb-4">
        {isEdit ? "Add Order" : "New Order"}
      </h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <input
            name="order_number"
            placeholder="New Order"
            value={order.order_number}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <input
            name="date"
            type="date"
            value={order.date}
            disabled
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <input
            name="final_price"
            type="text"
            value={order.final_price}
            disabled
            className="form-control"
          />
        </div>

        <div className="col-12">
          <select
            name="status"
            value={order.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="col-12">
          <h5 className="fw-bold mt-3">Select Products</h5>
          <div className="row">
            {allProducts.map((product) => {
              const selected = order.products.find(
                (p) => parseInt(p.product_id) === product.id
              );
              return (
                <div key={product.id} className="col-12 d-flex align-items-center mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={!!selected}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  <label className="form-check-label me-auto">
                    {product.name} – ${product.unit_price}
                  </label>
                  {selected && (
                    <input
                      type="number"
                      min="1"
                      value={selected.quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                      className="form-control form-control-sm ms-2"
                      style={{ width: "70px" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}