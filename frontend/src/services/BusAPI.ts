import axios from "axios";
import type { BusSearchParams } from "../types";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});


export const searchBuses = async (params: BusSearchParams) => {
  const res = await API.get("/api/buses", { params });
  return res.data;
};


export const getBusById = async (busId: string) => {
  const res = await API.get(`/api/buses/${busId}`);
  return res.data;
};


export const reserveSeats = async (busId: string, seats: number[]) => {
  const res = await API.post(`/api/buses/${busId}/reserve`, { seats });
  return res.data;
};


export const createBooking = async (data: {
  busId: string;
  seats: number[];
  passengerDetails: { name: string; age: number; gender: string }[];
}) => {
  const res = await API.post("/api/bookings", data);
  return res.data;
};