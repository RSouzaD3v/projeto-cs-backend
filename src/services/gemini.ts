import "dotenv/config";
import { GenerateRequest } from "../types";
import { writeFile, ensureDir } from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { db } from "../lib/db";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const model = "gemini-2.5-pro";

// Função única
export async function generateWebsite(data: GenerateRequest) {
const {
  niche,
  style = "moderno",
  language = "pt-br",
  sections = ["Início", "Sobre", "Serviços", "Contato"],
  companyName,
  mission,
  tone,
  extraInstructions = "Colocar imagens de acordo com o Nicho."
} = data;


const prompt = `
Gere um arquivo HTML completo para um website, contendo CSS embutido dentro da tag <style> no <head> e JavaScript incorporado dentro da tag <script> antes do fechamento da tag </body>.

O website deve ser focado no nicho de "${niche}", com design no estilo "${style}".
**As seções obrigatórias são:** ${sections.join(", ")}.
Detalhes da empresa e conteúdo:
- **Idioma:** ${language ?? "pt-br"}
- **Tom de Voz:** ${tone ?? "neutro"}
- **Nome da Empresa:** ${companyName ?? "Nome Fictício"}
- **Missão da Empresa:** ${mission ?? "Descrever a missão da empresa de forma genérica."}

**Requisitos Essenciais:**
1.  **Estrutura:** HTML semanticamente correto, bem organizado e com comentários explicativos APENAS dentro do HTML (não no prompt).
2.  **Responsividade:** Design adaptável a diferentes tamanhos de tela (desktop, tablet, mobile).
3.  **Visual:** Atraente e coeso com o estilo "${style}".
4.  **SEO:** Meta tags essenciais (charset, viewport, description, title, keywords), estrutura de cabeçalhos (h1, h2, etc.) e uso de atributos alt em imagens.
5.  **Acessibilidade:** Uso de atributos ARIA quando apropriado, boa contraste de cores, foco na navegação via teclado.
6.  **Funcionalidade JavaScript:** Inclua JavaScript para tornar o site interativo. Exemplo: um menu de navegação responsivo que aparece/desaparece em telas menores, ou um slider de imagens simples, ou uma validação básica de formulário (escolha o mais relevante para o nicho).
7. **Imagens:** Pegar imagens (https://images.pexels.com/).

**Instruções Extras:**
${extraInstructions}

**Formato da Resposta:**
Responda **APENAS com o código HTML completo e válido**, começando estritamente com <!DOCTYPE html> e terminando com </html>.
NÃO inclua qualquer texto adicional, markdown (como blocos de código), explicações, comentários fora das tags HTML, ou qualquer outra coisa além do HTML puro.
`.trim();

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.2,
      topK: 1,
      topP: 0.9
    }
  });

  const html = result.text ?? "";
  if (!html.trim()) throw new Error("Resposta da IA vazia.");

  const fileId = uuidv4();
  const fileName = `${fileId}.html`;
  const uploadDir = path.resolve(__dirname, "..", "..", "uploads");
  await ensureDir(uploadDir);

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, html, "utf-8");

  return {
    html,
    fileName,
    filePath,
    url: `/preview/${fileName}`,
    meta: { niche, style, language },
  };
}

// Função para múltiplos
export async function generateMultipleWebsites(batch: GenerateRequest[]) {
  const results = [];
  for (const data of batch) {
    try {
      const result = await generateWebsite(data);
      results.push(result);
    } catch (err) {
      results.push({ error: (err as Error).message, input: data });
    }
  }
  return results;
}
