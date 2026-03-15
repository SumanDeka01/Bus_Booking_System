import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BusListPage from "./pages/BusListPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import BookingConfirmPage from "./pages/BookingConfirmpage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buses" element={<BusListPage />} />
        <Route path="/buses/:busId/seats" element={<SeatSelectionPage />} />
        <Route path="/booking/confirm" element={<BookingConfirmPage />} />
        <Route path="/booking/success" element={<BookingSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
