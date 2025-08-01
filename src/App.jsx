import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrdersPage from "./pages/MyOrders.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}