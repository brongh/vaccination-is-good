import mongoose from "mongoose";

const bookingsSubSchema = new mongoose.Schema({
  nurse: { type: mongoose.Types.ObjectId, ref: "nurses" },
  patient: { type: mongoose.Types.ObjectId, ref: "patients" },
  year: { type: Number, min: 2022, required: true },
  month: { type: Number, min: 1, max: 12, required: true },
  day: { type: Number, min: 1, max: 31, required: true },
  hour: { type: Number, min: 0, max: 23, required: true },
  min: {
    type: Number,
    // TODO Check if validator works
    validator: (v: number) => {
      if (v >= 0 && v <= 50) {
        if (v === 0 || v % 10 === 0) {
          return true;
        }
      }
      return false;
    },
  },
  active: { type: Boolean, default: true },
});

bookingsSubSchema.index(
  { nurse: 1, patient: 1, year: 1, month: 1, day: 1, hour: 1, min: 1 },
  { unique: true }
);

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    bookings: [bookingsSubSchema],
    nurses: [{ type: mongoose.Types.ObjectId, ref: "nurses" }],
    daysForBooking: { type: Number, max: 7, default: 2 },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

centerSchema.virtual("availableSlots").get(function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const numOfNurses = this.nurses.length;
  const activeBookings = this.bookings.filter((item) => {
    return item.active === true;
  });
  const numOfDays = this.daysForBooking;
  const totalSlots = [];
  for (let i = 0; i < numOfDays; i++) {
    const bookingDay = day + i;
    const oneDaySlots = [];
    const [startHr, endHr] = [8, 20];
    for (let j = startHr; j < endHr + 1; j++) {
      [0, 10, 20, 30, 40, 50].forEach((item) => {
        oneDaySlots.push({
          year,
          month,
          day,
          hour: j,
          min: item,
        });
      });
    }
  }
});
