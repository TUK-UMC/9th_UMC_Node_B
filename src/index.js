import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleStoreRegister } from "./controllers/store.controller.js";
import { handleReviewRegister } from "./controllers/review.controller.js";
import { handleMissionRegister, handleMissionChallenge } from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Good Luck!");
});

app.post("/api/v1/stores", handleStoreRegister);
app.post("/api/v1/reviews", handleReviewRegister);
app.post("/api/v1/missions", handleMissionRegister);
app.post("/api/v1/missions/challenge", handleMissionChallenge);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});