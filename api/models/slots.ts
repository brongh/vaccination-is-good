import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    center: { type: mongoose.Types.ObjectId, ref: "centers", required: true },
    nurse: { type: mongoose.Types.ObjectId, ref: "nurses", required: true },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patients",
      required: true,
      unique: true,
    },
    timeSlot: {
      type: Number,
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

bookingSchema.index(
  { nurse: 1, patient: 1, timeSlot: 1 },
  { unique: true, sparse: true }
);

const Bookings = mongoose.model("bookings", bookingSchema);

export default Bookings;
