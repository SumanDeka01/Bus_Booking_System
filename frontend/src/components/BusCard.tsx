import type { Bus } from "../types/index";
import { useNavigate } from "react-router-dom";

import {
  getDepartureTime,
  getArrivalTime,
  formatPrice,
} from "../utils/helpers";

interface BusCardProps {
  bus: Bus;
  searchParams: {
    departureCity: string;
    arrivalCity: string;
    date: string;
  };
}

const BusCard = ({ bus, searchParams }: BusCardProps) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/buses/${bus.id}/seats`, {
      state: {
        bus,
        searchParams,
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-3 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-base mb-1">
            {bus.name}
          </h3>

          <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
            {searchParams.departureCity} to {searchParams.arrivalCity}
          </p>

          <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
            {getDepartureTime(bus.stops)} - {getArrivalTime(bus.stops)}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {bus.seatTypes.map((type) => (
              <span
                key={type}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                bus.isAC
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {bus.isAC ? "🌡 AC" : "NON-AC"}
            </span>
            <span className="text-xs text-gray-500">
              {bus.availableSeats} seats left
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 ml-6">
          <p className="text-xl font-bold text-gray-800">
            {formatPrice(bus.price)}
          </p>
          <button
            onClick={handleBookNow}
            disabled={bus.availableSeats === 0}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              bus.availableSeats === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {bus.availableSeats === 0 ? "Full" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
