import OrderRow from "./OrderRow";

export default function OrdersTable({ orders, onDelete, onEditStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final price</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onDelete={onDelete}
              onEditStatus={onEditStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}