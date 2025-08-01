import { Pencil, Trash } from "lucide-react";

export default function OrderRow({ order, onDelete, onEditStatus }) {
  return (
    <tr className="border-b">
      <td className="p-2">{order.id}</td>
      <td className="p-2">{order.order_number}</td>
      <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
      <td className="p-2">{order.product_count}</td>
      <td className="p-2">${order.final_price}</td>
      <td className="p-2">{order.status}</td>
      <td className="p-2 flex gap-2">
        <Pencil
          className="text-blue-500 cursor-pointer"
          onClick={() => onEditStatus(order.id)}
          />
        <Trash
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(order.id)}
        />
      </td>
    </tr>
  );
}