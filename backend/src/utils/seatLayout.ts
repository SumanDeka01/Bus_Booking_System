import {ISeat} from "../models/bus.model";

export const generateSeatLayout = ({
    totalSeats,
    seatType,
    bookedSeats 
}: {
    totalSeats: number;
    seatType: string;
    bookedSeats?: number[]
}): ISeat[] => {
    const seats: ISeat[] = [];

    for (let i =1; i<= totalSeats; i++) {
        const row = Math.ceil(i / 4);
        const column = (i - 1) % 4 + 1;
        

        seats.push({
            seatNumber: i,
            isAvailable: !bookedSeats?.includes(i),
            isReserved: false,
            row,
            column,
            seatType,
            sleeperLevel: 
                seatType === "sleeper" ? (row <= 2 ? "lower" : "upper") : undefined
        });
    }
    return seats;
};

//bus slots

export const getDepartureSlots = (timeStr: string): string => {
    const [time, period] = timeStr.split("");
    let hour = parseInt(time);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    if (hour >= 0 && hour < 12) return " Morning";
    if (hour >= 12 && hour < 16) return " Afternoon";
    if (hour >= 16 && hour < 20) return " Evening";
    return " Night";
}
