import { GoogleGenAI } from "@google/genai";
import { Supplier } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSupplierRisks = async (supplier: Supplier): Promise<string> => {
  try {
    const prompt = `
      Act as a supply chain risk analyst. Analyze the following supplier based on the provided data and general knowledge about the region and industry.

      Supplier Name: ${supplier.name}
      Country: ${supplier.country}
      Industry: ${supplier.industry}
      Risk Score: ${supplier.riskScore} (0-100, where 100 is critical risk)
      Known Flags: ${supplier.flags.join(', ')}

      Please provide a concise 3-bullet point executive summary explaining why this supplier might be at this risk level. Focus on potential ethical, environmental, or financial risks typical for this profile.
      Do not format as markdown. Just plain text with bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.error("Error analyzing supplier:", error);
    return "AI Analysis failed. Please check your connection or API key.";
  }
};

export const getQuickRiskSummary = async (supplier: Supplier): Promise<string> => {
    try {
        const prompt = `
          One sentence risk summary for supplier: ${supplier.name} in ${supplier.country} (${supplier.industry}).
          Flags: ${supplier.flags.join(', ')}. Risk Score: ${supplier.riskScore}.
          Explain the primary concern in one short sentence.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "No summary available.";
    } catch (e) {
        return "Unable to generate summary.";
    }
}

export const analyzeWorkerFeedback = async (feedback: string[]): Promise<string> => {
    if (feedback.length === 0) return "No worker feedback to analyze.";

    const prompt = `
    Analyze these anonymous worker comments from a factory:
    ${feedback.map(f => `"${f}"`).join('\n')}

    Summarize the key sentiment and identify the top 2 urgent issues.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Analysis unavailable.";
    } catch (error) {
        return "Could not analyze worker feedback.";
    }
}