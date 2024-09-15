import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {router} from './routes/User.js'
import {companyRouter} from './routes/CompanyRoute.js'
import {jobRouter} from './routes/jobRouter.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

mongoose
  .connect("mongodb://127.0.0.1:27017/jobsDb")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors(corsOptions));
app.use("/api/v1/user",router)
app.use('/api/v1/company', companyRouter)
app.use('/api/v1/job', jobRouter)
app.get("/", (req, res) => {
  res.send("Hello guys nice to meet yall");
});
app.listen(9000, () => {
  console.log("Server running at port 9000");
});
