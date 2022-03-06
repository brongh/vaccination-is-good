import mongoose from "mongoose";

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    nurses: [{ type: mongoose.Types.ObjectId, ref: "nurses" }],
    daysForBooking: { type: Number, max: 7, default: 2 },
    schedule: {
      start: { type: Number, default: 8, min: 0, max: 23 },
      end: { type: Number, default: 20, min: 0, max: 23 },
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

centerSchema.index({ name: 1 });

centerSchema.virtual("availableSlots").get(function () {
  if (this.nurses.length === 0) {
    return [];
  }
  const startHr = this.schedule.start;
  const endHr = this.schedule.end;

  // fixed time fields
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  // variable time fields
  const dayToday = now.getDate();

  const today = new Date(year, month, dayToday, 0, 0);

  const daysForBooking = this.daysForBooking;
  const bookings = [];
  for (let i = 0; i < daysForBooking; i++) {
    const dayForBooking = dayToday + i;
    for (let j = startHr; j < endHr + 1; j++) {
      const hr = j;
      [0, 10, 20, 30, 40, 50].forEach((item) => {
        const time = new Date(year, month, dayForBooking, hr, item).getTime();
        const numOfSlots = this.nurses.length;
        bookings.push({
          time,
          qty: numOfSlots,
        });
      });
    }
  }
  return bookings;
});

centerSchema.virtual("bookings", {
  ref: "bookings",
  localField: "_id",
  foreignField: "center",
  justOne: false,
});

const autoPopulateBookings = function (next: any) {
  this.populate("bookings");
  next();
};

centerSchema.pre("find", autoPopulateBookings);

const Centers = mongoose.model("centers", centerSchema);

export default Centers;
