import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/:file", (req: Request, res: Response) => {
  const fileName = req.params.file;

  // Segurança: impedir diretórios relativos maliciosos
  if (!/^[\w\-]+\.html$/.test(fileName)) {
    return res.status(400).send("Nome de arquivo inválido.");
  }

  const filePath = path.resolve(__dirname, "..", "..", "uploads", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Arquivo não encontrado.");
  }

  const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <title>Preview: ${fileName}</title>
      <style>
        body { margin: 0; }
        iframe {
          width: 100vw;
          height: 100vh;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe src="/uploads/${fileName}"></iframe>
    </body>
    </html>
  `;

  res.send(html);
});

export default router;
