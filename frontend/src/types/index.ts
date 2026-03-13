export interface Stop {
  stopName: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface Bus {
  id: string;
  name: string;
  stops: Stop[];
  availableSeats: number;
  price: number;
  seatTypes: string[];
  isAC: boolean;
}

export interface Seat {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
  seatType: string;
  sleeperLevel?: string;
}

export interface BusWithSeats extends Bus {
  seats: Seat[];
}

export interface PassengerDetail {
  name: string;
  age: string;
  gender: string;
}

export interface BusSearchParams {
  departureCity: string;
  arrivalCity: string;
  date: string;
  seatType?: string;
  isAC?: string;
  departureSlot?: string;
  page?: number;
  pageSize?: number;
}