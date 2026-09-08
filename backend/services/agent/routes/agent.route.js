import express from "express";
import { agent } from "../controllers/agent.controller.js";

const router = express.Router();

// POST / or POST /prompt to trigger the agent workflow
router.post("/", agent);
router.post("/prompt", agent);

export default router;
