import express from "express";
import { placeOrder } from "../controllers/orderContoller.js";

const router = express.Router();

router.post("/place", placeOrder);

export default router;