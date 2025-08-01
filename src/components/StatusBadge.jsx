export default function StatusBadge({ status }) {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    InProgress: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
      {status}
    </span>
  );
}