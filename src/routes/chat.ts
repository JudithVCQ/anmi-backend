import { Router } from "express";
import { askGeminiWithDocs } from "../services/gemini";

const router = Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  const answer = await askGeminiWithDocs(message);
  res.json({ answer });
});

export default router;
