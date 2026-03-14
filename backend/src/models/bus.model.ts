import mongoose, {Schema, Document} from "mongoose"

export interface ISeat {
    seatNumber: number,
    isAvailable: boolean,
    isReserved: boolean,
    reservedUntil?: Date;
    row: number,
    column:number,
    seatType: string,
    sleeperLevel?: string,
}

export interface IStop {
    stopName: string,
    arrivalTime?: string,
    departureTime?: string
}

export interface IBus extends Document {
  name: string,
  departureCity: string,
  arrivalCity: string,
  date: string,         
  stops: IStop[],
  availableSeats: number, 
  totalSeats: number,
  price: number,        
  seatTypes: string[],   
  isAC: boolean,
  seats: ISeat[]       
}

const SeatSchema = new Schema<ISeat>({
    seatNumber: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
    isReserved: {
        type: Boolean,
        required: true
    },
    reservedUntil: {
        type: Date,
        default: null
    },
    row: {
        type: Number,
        required: true
    },
    column: {
        type: Number,
        required: true
    }
})

const StopSchema = new Schema<IStop>( {
    stopName: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        default: null
    },
    departureTime : {
        type: String,
        default: null
    }
})

const BusSchema = new Schema<IBus>({
    name: {
        type: String,
        required: true
    },
    departureCity: { 
        type: String, 
        required: true, 
        index: true 
    },
    arrivalCity: { 
        type: String, 
        required: true, 
        index: true 
    },
    date: { 
        type: String, 
        required: true, 
        index: true 
    },
    stops: { 
        type: [StopSchema], 
        required: true 
    },
    availableSeats: { 
        type: Number, 
        required: true 
    },
    totalSeats: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    seatTypes: { 
        type: [String], 
        enum: ["normal", "semi-sleeper", "sleeper", "seater"],
        required: true 
    },
    isAC: { 
        type: Boolean, 
        required: true 
    },
    seats: { 
        type: [SeatSchema], 
        required: true
    }

},
{timestamps: true});

export const Bus = mongoose.model<IBus>("Bus", BusSchema);
