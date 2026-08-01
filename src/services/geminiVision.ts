const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-1.5-flash"];

const SYSTEM_PROMPT = `Extract every medicine from this prescription image.
Return ONLY valid JSON, no markdown formatting, no extra text.
Format: [{"medicine": string, "dosage": string, "timing": string, "food_instructions": string, "confidence": number}]
If handwriting is unclear, set medicine to "UNKNOWN" and confidence below 50.
Never guess a medicine name you are not confident about.`;

async function callGeminiModel(modelName: string, imageBase64: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: SYSTEM_PROMPT },
          { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
        ]
      }]
    })
  });

  const data = await response.json();
  console.log(`Raw Gemini response (${modelName}):`, JSON.stringify(data));

  if (data.error) {
    throw new Error(data.error.message || `API Error from ${modelName}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response candidates returned by Gemini.");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function scanPrescription(imageBase64: string) {
  try {
    console.log("API_KEY loaded:", !!API_KEY);
    console.log("Image base64 length:", imageBase64?.length);

    let lastError: any = null;

    for (const model of MODELS) {
      try {
        console.log(`Attempting Gemini scan with model: ${model}`);
        const result = await callGeminiModel(model, imageBase64);
        return result;
      } catch (err: any) {
        console.warn(`Model ${model} failed:`, err?.message);
        lastError = err;
        // If quota / resource exhausted, fall through to next model
      }
    }

    throw lastError || new Error("AI is temporarily unavailable. Please try again.");
  } catch (error: any) {
    console.error("Gemini scan error:", error);
    throw new Error(error.message || "AI is temporarily unavailable. Please try again.");
  }
}
