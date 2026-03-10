import mongoose, { Document, Schema } from "mongoose";


export interface IPassenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: number; 
}

export interface IBooking extends Document {
  busId: mongoose.Types.ObjectId;
  seatsBooked: number[];
  passengers: IPassenger[];
  totalPrice: number;
  status: string; 
}


const PassengerSchema = new Schema<IPassenger>(
  {
    name: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    seatNumber: { 
        type: Number, 
        required: true 
    },
  },
);


const BookingSchema = new Schema<IBooking>(
  {
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    seatsBooked: {
         type: [Number], 
         required: true 
        },
    passengers: { 
        type: [PassengerSchema], 
        required: true 
    },
    totalPrice: {
         type: Number, 
         required: true
         },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true
  }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);