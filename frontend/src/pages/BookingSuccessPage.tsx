import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingId, seatsBooked, totalPrice, busInfo, searchParams } =
    location.state || {};

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-gray-500">No booking found.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Booking Confirmed!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Your seats have been successfully booked
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-medium text-gray-700 text-xs break-all">
                {bookingId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bus</span>
              <span className="font-medium text-gray-800">{busInfo?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Route</span>
              <span className="font-medium text-gray-800">
                {busInfo.departureCity} → {busInfo.arrivalCity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-800">{busInfo.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Seats</span>
              <span className="font-medium text-gray-800">
                {seatsBooked?.join(", ")}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-500 font-semibold">Total Paid</span>
              <span className="font-bold text-gray-900">
                Rs. {totalPrice?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
          >
            Book Another Bus
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
