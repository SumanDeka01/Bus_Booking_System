

export const formatTime = (time?: string): string => {
    if (!time) return "N/A";
    return time;
}

export const getDepartureTime = (stops: {
    departureTime?: string }[]): string => {
        return stops[0]?.departureTime || "N/A";
    };

export const getArrivalTime = (stops: { arrivalTime?: string }[]): string => {
  return stops[stops.length - 1]?.arrivalTime || "--";
};

export const formatPrice = (price: number): string => {
  return `₹ ${price.toLocaleString("en-IN")}`;
};

