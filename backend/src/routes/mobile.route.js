// routes/mobile.route.js
import express from "express";
import { getMobileProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/products", getMobileProducts); // NO pongas /api/mobile aquí, ya se pone en server.js

export default router;