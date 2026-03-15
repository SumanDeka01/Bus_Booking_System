import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard";
import { searchBuses } from "../services/BusAPI";
import type { Bus, BusSearchParams } from "../types/index";

interface Filters {
  seatType: string;
  isAC: string;
  departureSlot: string;
}

const BusListPage = () => {
  const [searchParams] = useSearchParams();

  const departureCity = searchParams.get("departureCity") || "";
  const arrivalCity = searchParams.get("arrivalCity") || "";
  const date = searchParams.get("date") || "";

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalBuses, setTotalBuses] = useState(0);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    seatType: "",
    isAC: "",
    departureSlot: "",
  });

  useEffect(() => {
    fetchBuses();
  }, [filters, currentPage]);

  //fetch buses based on search...
  const fetchBuses = async () => {
    setLoading(true);
    setError("");

    try {
      const params: BusSearchParams = {
        departureCity,
        arrivalCity,
        date,
        page: currentPage,
        pageSize: 5,
      };

      if (filters.seatType) params.seatType = filters.seatType;
      if (filters.isAC) params.isAC = filters.isAC;
      if (filters.departureSlot) params.departureSlot = filters.departureSlot;

      const data = await searchBuses(params);
      setBuses(data.buses);
      setTotalBuses(data.totalBuses);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to fetch buses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setCurrentPage(1); // reset to page 1 when filter changes
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({ seatType: "", isAC: "", departureSlot: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Available Buses</h2>
          <p className="text-sm text-gray-500 mt-1">
            {departureCity} → {arrivalCity} | {date}
            {totalBuses > 0 && ` | ${totalBuses} buses found`}
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-52 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
                {(filters.seatType ||
                  filters.isAC ||
                  filters.departureSlot) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-5">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Seat Type
                </p>
                {["normal", "semi-sleeper", "sleeper"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.seatType === type}
                      onChange={() => handleFilterChange("seatType", type)}
                      className="rounded"
                    />
                    {type}
                  </label>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  AC Type
                </p>
                {[
                  { label: "AC", value: "true" },
                  { label: "NON-AC", value: "false" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.isAC === option.value}
                      onChange={() => handleFilterChange("isAC", option.value)}
                      className="rounded"
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Departure Time
                </p>
                {[
                  { label: "Morning (6AM-12PM)", value: "morning" },
                  { label: "Afternoon (12PM-4PM)", value: "afternoon" },
                  { label: "Evening (4PM-8PM)", value: "evening" },
                  { label: "Night (8PM-6AM)", value: "night" },
                ].map((slot) => (
                  <label
                    key={slot.value}
                    className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.departureSlot === slot.value}
                      onChange={() =>
                        handleFilterChange("departureSlot", slot.value)
                      }
                      className="rounded"
                    />
                    {slot.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading && (
              <div className="text-center py-16 text-gray-400">
                Loading buses...
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16 text-red-400">{error}</div>
            )}

            {!loading && !error && buses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No buses found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try changing your filters or search a different date
                </p>
              </div>
            )}

            {!loading && !error && buses.length > 0 && (
              <>
                {buses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    searchParams={{ departureCity, arrivalCity, date }}
                  />
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded border border-gray-300 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded border text-sm transition ${
                            currentPage === page
                              ? "bg-gray-900 text-white border-gray-900"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded border border-gray-300 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 py-4 border-t mt-8">
        ©Suman Deka BusBookinService. All rights reserved.
      </footer>
    </div>
  );
};

export default BusListPage;
