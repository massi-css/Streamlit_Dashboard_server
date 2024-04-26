import mongoose from "mongoose";

const datatopredictSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    temperature: Number,
    pH: Number,
    turbidity: Number
  });

const datatopredictModel = mongoose.model("datatopredict", datatopredictSchema);

export default datatopredictModel;