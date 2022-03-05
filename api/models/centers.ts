import mongoose from "mongoose";

const slotsSubSchema = new mongoose.Schema({
  nurse: { type: mongoose.Types.ObjectId, ref: "nurses" },
  patient: { type: mongoose.Types.ObjectId, ref: "patients" },
  year: { type: Number, min: 2022, required: true },
  month: { type: Number, min: 0, max: 11, required: true },
  day: { type: Number, min: 1, max: 31, required: true },
  hour: { type: Number, min: 0, max: 23, required: true },
  min: {
    type: Number,
    // TODO Check if validator works
    validator: (v: number) => {
      if (v >= 0 && v <= 60) {
        if (v === 0 || v % 10 === 0) {
          return true;
        }
      }
      return false;
    },
  },
});

slotsSubSchema.index(
  { nurse: 1, patient: 1, year: 1, month: 1, day: 1, hour: 1, min: 1 },
  { unique: true }
);

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slots: [slotsSubSchema],
    nurses: [{ type: mongoose.Types.ObjectId, ref: "nurses" }],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

centerSchema.virtual("availableSlots").get(function () {});
