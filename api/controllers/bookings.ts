import express, { Request, Response } from "express";
import Centers from "../models/centers";
import Patients from "../models/patients";
import Bookings from "../models/slots";
import { bookaSlot } from "../utils/bookaSlot";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const allCenters = await Centers.find({});
  res.send(allCenters);
});

router.get("/slots", async (req: Request, res: Response) => {
  const bookings = await Bookings.find({})
    .populate("center")
    .populate("patient");

  res.send(bookings);
});

router.get("/slots/one", async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.query;
    const userData = await Bookings.findOne({ _id: bookingId })
      .populate("center")
      .populate("patient");

    res.send(userData);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/user", async (req: Request, res: Response) => {
  try {
    const patients = await Patients.find({}).populate({
      path: "bookingDetails",
      populate: { path: "center", model: "Centers" },
    });
    res.send(patients);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/user", async (req: Request, res: Response) => {
  try {
    const { ic, name, time, centerId, oldbookingId, userId } = req.body;
    if (!ic || !name || !time || !centerId || !userId) {
      res.status(400).send({ message: "Invalid parameters" });
      return;
    }
    if (oldbookingId) {
      await Bookings.findByIdAndDelete(oldbookingId);
    }

    const newBooking = await bookaSlot(ic, name, time, centerId, userId);

    res.send(newBooking);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/user", async (req: Request, res: Response) => {
  try {
    const { ic, name, time, centerId } = req.body;
    console.log(req.body);
    if (!ic || !name || !time || !centerId) {
      res.status(400).send({ message: "Invalid parameters" });
      return;
    }

    const bookingDetails = await bookaSlot(ic, name, time, centerId);
    console.log(bookingDetails);
    res.send(bookingDetails);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

router.delete("/user", async (req: Request, res: Response) => {
  try {
    const { bookingId, userId } = req.query;
    await Bookings.findByIdAndDelete(bookingId);
    await Patients.findByIdAndDelete(userId);
    res.send({ message: "Success" });
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
