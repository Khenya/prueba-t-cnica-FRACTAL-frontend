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

  if (loading) return <p className="p-4">Cargando órdenes...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/add-order")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Order
          </button>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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