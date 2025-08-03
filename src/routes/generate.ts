import { Router } from "express";
import { GenerateRequest } from "../types";
import { generateWebsite, generateMultipleWebsites } from "../services/gemini";

const router = Router();

router.post("/", async (req, res) => {
  const body = req.body;

  try {
    if (Array.isArray(body)) {
      const results = await generateMultipleWebsites(body as GenerateRequest[]);
      return res.json(results);
    }

    const result = await generateWebsite(body as GenerateRequest);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro na geração do(s) site(s)." });
  }
});

export default router;
