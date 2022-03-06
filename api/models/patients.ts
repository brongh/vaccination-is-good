import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    ic: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    book: { type: Number },
  },
  { toJSON: { virtuals: true, getters: true } }
);

patientSchema.index({ ic: 1 });

patientSchema.virtual("bookingDetails", {
  ref: "bookings",
  localField: "_id",
  foreignField: "patient",
  justOne: true,
});

// patientSchema.virtual("centerDetail", {
//     ref: "centers",
//     localField: "_id",
//     foreignField: "center",

// })

const autoPopulateBookings = function (next: any) {
  this.populate("bookingDetails");
  next();
};

patientSchema.pre("find", autoPopulateBookings);

const Patients = mongoose.model("patients", patientSchema);

export default Patients;
