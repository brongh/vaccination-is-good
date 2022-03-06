import Centers from "../models/centers";
import Patients from "../models/patients";
import Bookings from "../models/slots";

export const bookaSlot = async (
  ic: string,
  name: string,
  time: number,
  centerId: string,
  userId?: string
) => {
  try {
    const newUser = !userId
      ? await Patients.create({
          ic: ic.toUpperCase(),
          name,
          book: time,
        }).catch((err) => {
          console.log(err);
          throw { error: "Double booking. Please edit your booking instead." };
        })
      : await Patients.findByIdAndUpdate(
          {
            _id: userId,
          },
          {
            ic: ic.toUpperCase(),
            name,
            book: time,
          },
          { new: true }
        ).catch((err) => {
          console.log(err);
          throw { error: "Double booking. Please edit your booking instead." };
        });
    const allNurse = await Centers.findOne({ _id: centerId });

    const workNurses = await Bookings.find({
      center: centerId,
      timeSlot: time,
    });
    if (workNurses.length < 1) {
      const bookingData = await Bookings.create({
        center: centerId,
        nurse: allNurse.nurses[0],
        patient: newUser._id,
        timeSlot: time,
      })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return { error: "slot unavailable " };
        });
      return bookingData;
    }

    const allNurseSet = new Set(allNurse.nurses);
    const freeNurses = [];
    workNurses.forEach((item) => {
      if (allNurseSet.has(item.nurse)) {
        freeNurses.push(item.nurse);
      }
    });
    if (freeNurses.length === 0) {
      return { error: "slot unavailable" };
    }

    const bookingData = await Bookings.create({
      center: centerId,
      nurse: freeNurses[0],
      patient: newUser._id,
      timeSlot: time,
    }).catch((err) => {
      return { error: "slot unavailable " };
    });

    return bookingData;
  } catch (err) {
    return err;
  }
};
