import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import router from "./controllers";

const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  await mongoose.connect("mongodb://localhost:27017/vaccine");

  app.use(router);

  app.listen(8000, () => {
    console.log("=====================================");
    console.log("Server is now listening on port: 8000");
    console.log("=====================================");
  });
};

startServer();
