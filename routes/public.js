import express from "express";
import { getDetails, getTrendingStuff, search } from "../controllers/public.js";

const router = express.Router();

router.get("/trending/:mediaType?/:timeWindow?", getTrendingStuff);
router.get("/search", search);
router.get("/:mediaType/:id/details", getDetails);

export default router;
