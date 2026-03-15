import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createBooking } from "../services/BusAPI";

interface Passenger {
  name: string;
  age: string;
  gender: string;
}

const BookingConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { busId, busInfo, selectedSeats, searchParams, totalPrice } =
    location.state || {};

  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats?.map(() => ({ name: "", age: "", gender: "" })) || [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    index: number,
    field: keyof Passenger,
    value: string,
  ) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validate = (): boolean => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) {
        setError(`Enter name for Passenger ${i + 1}`);
        return false;
      }
      if (!p.age || isNaN(Number(p.age)) || Number(p.age) < 1) {
        setError(`Enter valid age for Passenger ${i + 1}`);
        return false;
      }
      if (!p.gender) {
        setError(`Select gender for Passenger ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setError("");

      const result = await createBooking({
        busId,
        seats: selectedSeats,
        passengerDetails: passengers.map((p) => ({
          name: p.name.trim(),
          age: Number(p.age),
          gender: p.gender,
        })),
      });

      navigate("/booking/success", {
        state: {
          bookingId: result.id,
          seatsBooked: result.seatsBooked,
          totalPrice: result.totalPrice,
          busInfo,
          searchParams,
        },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!busId || !selectedSeats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-gray-500">No booking data found.</p>
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Payment and Booking Confirmation
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-4">
                Passenger Details
              </h3>

              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Passenger {index + 1}
                    <span className="ml-2 text-gray-400 font-normal text-xs">
                      Seat {selectedSeats[index]}
                    </span>
                  </p>

                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={passenger.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={passenger.age}
                        onChange={(e) =>
                          handleChange(index, "age", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      Gender
                    </label>
                    <div className="flex gap-4">
                      {["male", "female", "other"].map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`gender-${index}`}
                            value={g}
                            checked={passenger.gender === g}
                            onChange={(e) =>
                              handleChange(index, "gender", e.target.value)
                            }
                          />
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>

          <div className="w-full md:w-72 shrink-0 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Bus Details</h3>
              <p className="font-semibold text-gray-800 text-sm">
                {busInfo?.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {busInfo?.isAC ? "AC" : "Non-AC"} · {busInfo?.seatTypes?.[0]}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchParams?.departureCity} → {searchParams?.arrivalCity}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {searchParams?.date}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-700 mb-3">
                Booking Summary
              </h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Seats</span>
                <span>{selectedSeats?.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-800 border-t pt-2">
                <span>Total</span>
                <span className="text-lg">
                  Rs. {totalPrice?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPage;
