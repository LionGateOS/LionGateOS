
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectEstimate, ReceiptData, ClientDetails } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// --- CORE ESTIMATOR ---
export const analyzeJobEstimate = async (
  projectDescription: string, 
  imageBase64: string | undefined,
  location: { country: string; currency: string; state?: string },
  tradeContext?: string
): Promise<ProjectEstimate | null> => {
  try {
    // Strict Schema to force the AI to break down Labor vs Material and Tiers
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "Executive summary of the scope, methods, and complexity factors identified." },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: ["Material", "Labor", "Equipment", "Permits", "Other"] },
              name: { type: Type.STRING, description: "Detailed name of the item or task (e.g., '1/2 inch Drywall Sheets')" },
              quantity: { type: Type.NUMBER, description: "Calculated quantity including waste factor" },
              unit: { type: Type.STRING, description: "Unit (sqft, hrs, ea, lbs, gal)" },
              reasoning: { type: Type.STRING, description: "Explanation of math (e.g., 'Wall area 400sf / 32sf per sheet + 15% waste')" },
              tiers: {
                type: Type.OBJECT,
                properties: {
                  budget: {
                    type: Type.OBJECT,
                    properties: {
                      grade: { type: Type.STRING, enum: ["Budget"] },
                      unitPrice: { type: Type.NUMBER },
                      total: { type: Type.NUMBER },
                      description: { type: Type.STRING, description: "Specific product or method for budget tier" },
                      products: {
                        type: Type.ARRAY,
                        items: {
                           type: Type.OBJECT,
                           properties: {
                             name: { type: Type.STRING },
                             vendor: { type: Type.STRING },
                             price: { type: Type.NUMBER },
                             currency: { type: Type.STRING },
                             isBulk: { type: Type.BOOLEAN },
                             bulkQuantity: { type: Type.NUMBER },
                             bulkPrice: { type: Type.NUMBER }
                           }
                        }
                      }
                    }
                  },
                  standard: {
                     type: Type.OBJECT,
                    properties: {
                      grade: { type: Type.STRING, enum: ["Standard"] },
                      unitPrice: { type: Type.NUMBER },
                      total: { type: Type.NUMBER },
                      description: { type: Type.STRING, description: "Industry standard material/labor rate" },
                      products: {
                        type: Type.ARRAY,
                         items: {
                           type: Type.OBJECT,
                           properties: {
                             name: { type: Type.STRING },
                             vendor: { type: Type.STRING },
                             price: { type: Type.NUMBER },
                             currency: { type: Type.STRING },
                             isBulk: { type: Type.BOOLEAN },
                             bulkQuantity: { type: Type.NUMBER },
                             bulkPrice: { type: Type.NUMBER }
                           }
                        }
                      }
                    }
                  },
                  premium: {
                     type: Type.OBJECT,
                    properties: {
                      grade: { type: Type.STRING, enum: ["Premium"] },
                      unitPrice: { type: Type.NUMBER },
                      total: { type: Type.NUMBER },
                      description: { type: Type.STRING, description: "High-end material or expert labor rate" },
                      products: {
                        type: Type.ARRAY,
                         items: {
                           type: Type.OBJECT,
                           properties: {
                             name: { type: Type.STRING },
                             vendor: { type: Type.STRING },
                             price: { type: Type.NUMBER },
                             currency: { type: Type.STRING },
                             isBulk: { type: Type.BOOLEAN },
                             bulkQuantity: { type: Type.NUMBER },
                             bulkPrice: { type: Type.NUMBER }
                           }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const parts: any[] = [];
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1]; 
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
    }

    let promptText = `You are an expert construction estimator and quantity surveyor for the ${location.country} market (State/Region: ${location.state || 'General'}). Currency: ${location.currency}. `;
    if (tradeContext) promptText += `Act as a Master ${tradeContext}. `;
    
    promptText += `
    YOUR GOAL: Provide a highly detailed, line-item estimate.
    
    RULES FOR LINE ITEMS:
    1. SEPARATE MATERIALS AND LABOR: Do NOT combine them. 
       - CORRECT: Item 1: "Oak Door Slab" (Qty: 1, Unit: ea). Item 2: "Labor: Door Installation" (Qty: 3.5, Unit: hrs).
       - INCORRECT: Item 1: "Door Installation" (Qty: 3.5).
    2. ANALYZE: Read the description. Extract dimensions. Calculate surface areas/volumes.
    3. QUANTIFY: 
       - For MATERIALS: Calculate physical needs + 10-15% waste. Unit must be physical (ea, sqft, lbs).
       - For LABOR: Estimate hours based on standard production rates. Unit must be 'hrs'.
    4. PRICING: Provide 3 distinct price tiers (Budget, Standard, Premium). 
    5. SOURCING: Identify real products from major local vendors.

    Project Description: "${projectDescription}"
    `;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: { 
        responseMimeType: "application/json", 
        responseSchema: responseSchema, 
        temperature: 0.3 // Lower temp for more math consistency
      },
    });

    return JSON.parse(response.text || '{}') as ProjectEstimate;
  } catch (error) {
    console.error("Estimate Error:", error);
    return null;
  }
};

// --- BUSINESS CARD SCANNER ---
export const parseBusinessCard = async (imageBase64: string): Promise<ClientDetails | null> => {
  try {
    const responseSchema: Schema = {
       type: Type.OBJECT,
       properties: {
          name: { type: Type.STRING, description: "Full Name in Title Case" },
          companyName: { type: Type.STRING, description: "Company Name" },
          email: { type: Type.STRING },
          phone: { type: Type.STRING, description: "Formatted phone number" },
          address: { type: Type.STRING, description: "Formatted multi-line address" },
          notes: { type: Type.STRING, description: "Any extra info like title or website" }
       }
    };

    const base64Data = imageBase64.split(',')[1];
    const prompt = `Extract client details from this business card. 
    
    STRICT FORMATTING RULES:
    1. NAME: Use Title Case (e.g. "John Doe", "McDonald").
    2. ADDRESS: Must be formatted in 3-4 lines:
       Line 1: Street Address (Number, Street Name, Apt/Suite). Capitalize Street Types (St., Ave., Blvd).
       Line 2: City, State Abbreviation (ALL CAPS), Zip Code.
       Line 3: Country (Optional if domestic).
       Example: "123 Maple Avenue, Apt 4B\nSpringfield, IL 62704\nUnited States"
    3. PHONE: 
       - If domestic (US/Canada): Format as (XXX) XXX-XXXX.
       - If international: Format as +Code (XXX) XXX-XXXX.
    4. GENERAL: Apply Title Case to all proper nouns.
    `;

    const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Data } }, { text: prompt }] },
       config: { responseMimeType: "application/json", responseSchema: responseSchema }
    });

    return JSON.parse(response.text || '{}') as ClientDetails;
  } catch (e) {
    console.error("Business Card Scan Error", e);
    return null;
  }
};

// --- RECEIPT PARSER ---
export const parseReceiptImage = async (imageBase64: string): Promise<ReceiptData | null> => {
  try {
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        merchant: { type: Type.STRING },
        date: { type: Type.STRING },
        category: { type: Type.STRING, enum: ["Material", "Labor", "Subcontractor", "Other"] },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER }
            }
          }
        }
      }
    };
    const base64Data = imageBase64.split(',')[1]; 
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Data } }, { text: "Extract merchant, date, and line items." }] },
      config: { responseMimeType: "application/json", responseSchema: responseSchema }
    });
    return JSON.parse(response.text || '{}') as ReceiptData;
  } catch (error) {
    console.error("Receipt Error:", error);
    return null;
  }
};

// --- NEW: SAFETY CHECKLIST GENERATOR ---
export const generateSafetyChecklist = async (description: string, imageBase64?: string): Promise<string[]> => {
  try {
    const parts: any[] = [{ text: `Generate a specific OSHA/Safety checklist (5-10 items) for this construction task: "${description}". Return ONLY a JSON array of strings.` }];
    if (imageBase64) parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] } });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) { return ["Wear PPE", "Check Surroundings", "Keep Area Clean"]; }
};

// --- NEW: CHANGE ORDER GENERATOR ---
export const generateChangeOrder = async (originalScope: string, newRequirement: string): Promise<{ title: string, justification: string, cost_impact: string }> => {
  try {
    const prompt = `Write a formal Change Order summary. 
    Original Scope: "${originalScope}"
    New Requirement: "${newRequirement}"
    Return JSON with keys: title (string), justification (professional explanation), cost_impact (estimated description, e.g. "Additional 4 hours labor").`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return { title: "Change Order", justification: "Scope change detected.", cost_impact: "TBD" }; }
};

// --- NEW: PAYMENT REMINDER WRITER ---
export const generatePaymentReminder = async (clientName: string, invoiceNum: string, amount: string, daysOverdue: number): Promise<string> => {
  try {
    const prompt = `Write a professional, polite, but firm email reminder for a client named ${clientName} regarding Invoice ${invoiceNum} for ${amount}. It is ${daysOverdue} days overdue. Keep it under 100 words.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || "Please remit payment.";
  } catch (e) { return "Dear Client, this is a reminder that your payment is overdue."; }
};

// --- NEW: DOCUMENT SUMMARIZER ---
export const summarizeDocument = async (text: string): Promise<string> => {
  try {
     const prompt = `Summarize this construction document, manual, or spec sheet into key bullet points:\n${text}`;
     const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
     return response.text || "Could not summarize.";
  } catch(e) { return "Error summarizing document."; }
}

// --- SUPPORT CHAT ---
export const getSupportResponse = async (userQuestion: string, currentContext: string): Promise<{ answer: string, escalate: boolean }> => {
  try {
     const prompt = `You are SmartQuote Support. Context: ${currentContext}. Question: "${userQuestion}". If asking for new feature, say [ESCALATE]. Keep it short.`;
     const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
     const text = response.text || "";
     return { answer: text.replace("[ESCALATE]", ""), escalate: text.includes("[ESCALATE]") };
  } catch (e) { return { answer: "I am offline.", escalate: false }; }
};
