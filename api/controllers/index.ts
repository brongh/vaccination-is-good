import express from "express";

import { default as bookings } from "./bookings";
import { default as admins } from "./admins";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("test");
  res.send("test");
});
router.use("/bookings", bookings);
router.use("/admins", admins);

export default router;
