export default function OrderRow({ order, onDelete, onEditStatus }) {
  return (
    <tr>
      <td className="text-center align-middle">{order.id}</td>
      <td className="text-center align-middle">{order.order_number}</td>
      <td className="text-center align-middle">{new Date(order.date).toLocaleDateString()}</td>
      <td className="text-center align-middle">{order.product_count}</td>
      <td className="text-center align-middle">${order.final_price}</td>
      <td className="text-center align-middle">{order.status}</td>
      <td className="text-center align-middle">
        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={() => onEditStatus(order.id)}
            className="btn btn-sm btn-outline-secondary"
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="btn btn-sm btn-outline-danger"
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}