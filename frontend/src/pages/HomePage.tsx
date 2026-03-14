import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    departureCity: "",
    arrivalCity: "",
    date: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (error) setError("");
  };

  const handleSearch = () => {
    if (!form.departureCity.trim()) {
      setError("Please enter a departure city");
      return;
    }
    if (!form.arrivalCity.trim()) {
      setError("Please enter an arrival city");
      return;
    }
    if (!form.date) {
      setError("Please select a travel date");
      return;
    }
    if (
      form.departureCity.trim().toLowerCase() ===
      form.arrivalCity.trim().toLowerCase()
    ) {
      setError("Departure and arrival cities cannot be the same");
      return;
    }

    navigate(
      `/buses?departureCity=${form.departureCity.trim()}&arrivalCity=${form.arrivalCity.trim()}&date=${form.date}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Find Your Bus
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure City
            </label>
            <input
              type="text"
              placeholder="Enter departure city"
              value={form.departureCity}
              onChange={(e) =>
                setForm({ ...form, departureCity: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival City
            </label>
            <input
              type="text"
              placeholder="Enter arrival city"
              value={form.arrivalCity}
              onChange={(e) =>
                setForm({ ...form, arrivalCity: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Travel
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
          >
            Search Buses
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 py-4 border-t">
        © Suman Deka. All rights reserved. Project Assignment.
      </footer>
    </div>
  );
};

export default HomePage;
