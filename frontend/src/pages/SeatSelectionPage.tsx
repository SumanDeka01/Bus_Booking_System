// imcomplete ! have to cmplt by sunday mrng
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBusById } from "../services/BusAPI";
import type { Seat, BusWithSeats } from "../types";

const SeatSelectionPage = () => {
  const { busId } = useParams();
  const location = useLocation();

  // data will come from the previous page
  const { bus: busInfo, searchParams } = location.state || {};

  const [busData, setBusData] = useState<BusWithSeats | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (busId) {
      fetchBus();
    }
  }, [busId]);

  // fetch bus data from backend
  const fetchBus = async () => {
    try {
      setLoading(true);

      const data = await getBusById(busId!);
      setBusData(data);

      // seat layout will come from backend
    } catch (err) {
      console.log("error loading bus");
    } finally {
      setLoading(false);
    }
  };

  // handle seat selection
  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat.seatNumber)) {
        return prev.filter((s) => s !== seat.seatNumber);
      }

      return [...prev, seat.seatNumber];
    });
  };

  // have to do it !
  const getSeatColor = (seat: Seat) => {
    if (!seat.isAvailable) return "bg-gray-200";

    if (selectedSeats.includes(seat.seatNumber)) return "bg-blue-200";

    return "bg-green-100";
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading seats...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div>
        <h2>Bus Details</h2>
        <p>{busData?.name}</p>
        <p>
          {searchParams?.departureCity} → {searchParams?.arrivalCity}
        </p>
      </div>

      <div>
        <h2>Select Your Seats</h2>

        <div>
          {busData?.seats.map((seat) => (
            <button
              key={seat.seatNumber}
              onClick={() => handleSeatClick(seat)}
              className={getSeatColor(seat)}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>

        <p>
          Selected Seats:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
