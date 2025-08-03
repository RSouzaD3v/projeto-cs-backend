export interface GenerateRequest {
  niche: string;
  style?: string;
  language?: string;
  sections?: string[];
  companyName?: string;
  mission?: string;
  extraInstructions?: string; 
  tone?: string; // ex: "formal", "divertido", "amigável", "premium"
}
