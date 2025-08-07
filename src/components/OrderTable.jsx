import OrderRow from "./OrderRow";

export default function OrdersTable({ orders, onDelete, onEditStatus }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th># Order</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final Price</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onDelete={onDelete}
                onEditStatus={onEditStatus}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-muted">
                No hay órdenes disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}