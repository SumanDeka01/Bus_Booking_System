import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBusById, reserveSeats } from "../services/BusAPI";
import type { Seat, BusWithSeats } from "../types";

const SeatSelectionPage = () => {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { bus: searchParams } = location.state || {};

  const [busData, setBusData] = useState<BusWithSeats | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (busId) {
      fetchBus();
    }
  }, [busId]);

  //timer
  useEffect(() => {
    if (reserving) return;
    if (selectedSeats.length === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats, reserving]);

  const fetchBus = async () => {
    try {
      setLoading(true);
      const data = await getBusById(busId!);
      setBusData(data);
    } catch (err) {
      console.log("error loading bus");
      setError("Could not load seats. Go back and try again.");
    } finally {
      setLoading(false);
    }
  };

  //seat booking limiter : max 6 seats
  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;
    if (selectedSeats.length >= 6 && !selectedSeats.includes(seat.seatNumber)) {
      setError("Maximum 6 seats per booking");
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : [...prev, seat.seatNumber],
    );
  };

  // have to do it !
  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable)
      return "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (selectedSeats.includes(seat.seatNumber))
      return "bg-blue-200 border border-blue-400 text-blue-700 cursor-pointer";
    return "bg-green-100 border border-green-300 text-green-700 cursor-pointer hover:bg-green-200";
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      setError("Select at least one seat");
      return;
    }

    try {
      setReserving(true);
      setError("");

      await reserveSeats(busId!, selectedSeats);

      navigate("/booking/confirm", {
        state: {
          busId,
          busInfo: busData,
          selectedSeats,
          searchParams,
          totalPrice: (busData?.price || 0) * selectedSeats.length,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Reservation failed. Try again.");
    } finally {
      setReserving(false);
    }
  };

  // seats come as flat array, grouping by row for grid
  const groupByRow = () => {
    if (!busData) return {};
    return busData.seats.reduce((acc: Record<number, Seat[]>, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center mt-20 text-gray-400 text-sm">
          Loading seats...
        </p>
      </div>
    );
  }

  const seatsByRow = groupByRow();
  const totalPrice = (busData?.price || 0) * selectedSeats.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Bus Details</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-gray-700">{busData?.name}</p>
              <p className="text-gray-400 text-xs mt-1">
                {busData?.isAC ? "AC" : "Non-AC"} · {busData?.seatTypes[0]}
              </p>
            </div>
            <div className="text-gray-500 text-sm">
              <p>
                {searchParams?.departureCity} → {searchParams?.arrivalCity}
              </p>
              <p className="text-xs mt-1">{searchParams?.date}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Select Your Seats
          </h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="border border-gray-100 rounded-lg p-4 max-w-xs">
            {Object.entries(seatsByRow).map(([row, seats]) => (
              <div key={row} className="flex items-center gap-2 mb-2">
                {seats.map((seat, idx) => (
                  <div key={seat.seatNumber} className="flex items-center">
                    {idx === 2 && <div className="w-4" />}
                    <div
                      onClick={() => handleSeatClick(seat)}
                      className={`w-10 h-10 rounded text-xs font-medium flex items-center justify-center transition ${getSeatColor(seat)}`}
                    >
                      {seat.seatNumber}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex gap-5 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-green-100 border border-green-300 inline-block" />
              available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-200 border border-blue-400 inline-block" />
              selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-gray-200 inline-block" />
              booked
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Booking Summary
          </h2>

          {selectedSeats.length > 0 && timer > 0 && (
            <p className="text-sm text-red-500 mb-2">
              Seats will be held for:{" "}
              <span className="font-semibold">{timer}s</span>
            </p>
          )}
          <p className="text-sm text-gray-500 mb-1">
            Selected Seats:{" "}
            <span className="text-gray-700 font-medium">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </span>
          </p>
          <div className="mb-5">
            <span className="text-sm text-gray-500">Total Price: </span>
            <span className="text-2xl font-bold text-gray-900">
              Rs. {totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0 || reserving}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
              selectedSeats.length === 0 || reserving
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {reserving ? "Reserving..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
