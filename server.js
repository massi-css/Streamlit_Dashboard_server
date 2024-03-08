import express from "express";
import dotenv from "dotenv";
import connectDB from "./connectDB.js";
import DatasRoutes from "./Routes/DatasRoutes.js";

const port = 5000;
const app = express();
app.use(express.json());
dotenv.config();
// connecting to db
connectDB();

// main route for the server
app.get("/", (req, res) => {
  res.send("server is running");
});
app.post("/data", (req, res) => {
  console.log("Data received");
  res.json(req.body);
});
// route for the datas
app.use("/data", DatasRoutes);


// starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
