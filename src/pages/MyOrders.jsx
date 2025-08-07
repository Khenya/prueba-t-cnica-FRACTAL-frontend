import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrdersTable from "../components/OrderTable";
import api from "../api/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    api.get("/orders")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      })
      .catch((err) => {
        console.error("❌ Error al obtener órdenes:", err);
        setError("No se pudieron cargar las órdenes");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar esta orden?");
    if (!confirmed) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      alert("No se pudo eliminar la orden");
      console.error(err);
    }
  };

  const handleEditStatus = (id) => {
    navigate(`/add-order/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-center fs-4">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-center text-danger fs-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="card shadow p-4 mx-auto" style={{ width: "100%", maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 text-primary fw-bold mb-0">My Orders</h1>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate("/add-order")}
            className="btn btn-primary"
          >
            + Add Order
          </button>
          <button
            onClick={() => navigate("/products")}
            className="btn btn-success"
          >
            + Add Product
          </button>
        </div>
      </div>

      <OrdersTable
        orders={orders}
        onDelete={handleDelete}
        onEditStatus={handleEditStatus}
      />
    </div>
  );
}