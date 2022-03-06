import express, { Request, Response } from "express";
import Centers from "../models/centers";
import Nurses from "../models/nurses";

const router = express.Router();

router.put("/center", async (req: Request, res: Response) => {
  try {
    const { centerId, updates } = req.body;
    if (!updates || !centerId) {
      res.status(400).send({ message: "Invalid Parameters" });
    }

    const centerUpdate = await Centers.findOneAndUpdate(
      {
        _id: centerId,
      },
      updates,
      {
        new: true,
      }
    );

    res.send(centerUpdate);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

router.put("/center-nurse", async (req: Request, res: Response) => {
  const { nurses, centerId } = req.body;
  if (!nurses || !centerId) {
    res.status(400).send({ message: "Invalid Parameters" });
  }
  try {
    const updateNurse = await Centers.findOneAndUpdate(
      {
        _id: centerId,
      },
      {
        $push: {
          nurses: {
            $each: nurses,
          },
        },
      },
      {
        new: true,
      }
    );
    console.log(updateNurse);
    res.send(updateNurse);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/center", async (req: Request, res: Response) => {
  const { centerData, newNurses } = req.body;
  const nursesId = await Nurses.create(newNurses);
  const final = {
    ...centerData,
    nurses: nursesId,
  };

  const newCenter = await Centers.create(final);

  res.send(newCenter);
});

router.get("/nurse", async (req: Request, res: Response) => {
  const nurses = await Nurses.find({});

  res.send(nurses);
});

router.post("/nurse", async (req: Request, res: Response) => {
  const { name } = req.body;
  const newNurse = await Nurses.create({ name });
  res.send(newNurse);
});

export default router;
