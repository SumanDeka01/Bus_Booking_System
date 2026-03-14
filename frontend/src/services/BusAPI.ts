import axios from "axios";

// base URL points to our backend
const API = axios.create({
  baseURL: "http://localhost:8000/api",
});


export const searchBuses = async (params: Record<string, string | number>) => {
  const res = await API.get("/buses", { params });
  return res.data;
};


export const getBusById = async (busId: string) => {
  const res = await API.get(`/buses/${busId}`);
  return res.data;
};


export const reserveSeats = async (busId: string, seats: number[]) => {
  const res = await API.post(`/buses/${busId}/reserve`, { seats });
  return res.data;
};


export const createBooking = async (data: {
  busId: string;
  seats: number[];
  passengerDetails: { name: string; age: number; gender: string }[];
}) => {
  const res = await API.post("/bookings", data);
  return res.data;
};