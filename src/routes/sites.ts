// src/routes/sites.ts
import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", (req, res) => {
  const uploadsDir = path.join(process.cwd(), "uploads");

  try {
    const items = fs.readdirSync(uploadsDir, { withFileTypes: true });

    const sites = items
      .filter((item) => item.isFile() && item.name.endsWith(".html"))
      .map((file) => {
        const filePath = path.join(uploadsDir, file.name);
        const stats = fs.statSync(filePath);

        return {
          name: file.name.replace(".html", ""),
          fileName: file.name,
          url: `/preview/${file.name}`, // agora aponta para preview
          createdAt: stats.birthtime,
        };
      });

    res.json(sites);
  } catch (err) {
    console.error("Erro ao listar sites:", err);
    res.status(500).json({ error: "Erro ao listar sites." });
  }
});

export default router;
