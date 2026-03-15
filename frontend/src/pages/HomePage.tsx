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
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#0f172a",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Find Your Bus
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              placeholder="Enter departure city"
              value={form.departureCity}
              onChange={(e) => handleChange("departureCity", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              placeholder="Enter arrival city"
              value={form.arrivalCity}
              onChange={(e) => handleChange("arrivalCity", e.target.value)}
              onKeyDown={handleKeyDown}
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
              onChange={(e) => handleChange("date", e.target.value)}
              onKeyDown={handleKeyDown}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleSearch}
            className="w-full bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
            Search Buses
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 py-4 border-t">
        © Suman Deka. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
