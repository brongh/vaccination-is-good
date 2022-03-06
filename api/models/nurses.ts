import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Nurses = mongoose.model("nurses", nurseSchema);

export default Nurses;
