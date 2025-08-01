import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyOrders from "./pages/MyOrders";
import AddEditOrder from "./pages/AddEditOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyOrders />} />
        <Route path="/add-order" element={<AddEditOrder />} />
        <Route path="/add-order/:id" element={<AddEditOrder />} />
      </Routes>
    </Router>
  );
}

export default App;