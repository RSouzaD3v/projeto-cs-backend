import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import generateRouter from "./routes/generate";
import previewRouter from "./routes/preview";
import sitesRouter from "./routes/sites";

import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos gerados
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
app.use("/generate", generateRouter);
app.use("/preview", previewRouter);
app.use("/sites", sitesRouter);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Site Builder API running on http://localhost:${PORT}`);
});
