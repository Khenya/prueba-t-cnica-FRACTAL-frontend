import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrdersTable from "../components/OrderTable";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setOrders(data.data);
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
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar la orden");

      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      alert("No se pudo eliminar la orden");
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Cargando órdenes...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <button
          onClick={() => navigate("/add-order")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Order
        </button>
      </div>
      <OrdersTable orders={orders} onDelete={handleDelete} />
    </div>
  );
}