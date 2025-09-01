
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMimeType = (base64: string): string | null => {
    const match = base64.match(/^data:(image\/[a-z]+);base64,/);
    return match ? match[1] : null;
};

const stripMimeType = (base64: string): string => {
    return base64.substring(base64.indexOf(',') + 1);
};

export const generateVirtualTryOnImage = async (userImageBase64: string, outfitImageBase64: string): Promise<string> => {
    const userMimeType = getMimeType(userImageBase64);
    const outfitMimeType = getMimeType(outfitImageBase64);

    if (!userMimeType || !outfitMimeType) {
        throw new Error("Invalid image format. Could not determine MIME type.");
    }

    const userImagePart = { inlineData: { data: stripMimeType(userImageBase64), mimeType: userMimeType } };
    const outfitImagePart = { inlineData: { data: stripMimeType(outfitImageBase64), mimeType: outfitMimeType } };

    const prompt = `
      You are an expert virtual stylist. Your task is to perform a high-fidelity virtual try-on.

      1.  **Base Model:** Use the first image (the person) as the base. YOU MUST PRESERVE the person's face, hairstyle, skin tone, and pose exactly as they are. Do not alter their physical features.
      2.  **Outfit Source:** Use the second image (the clothing item) as the source for the outfit.
      3.  **Clothing Replacement:** Replace ONLY the clothing on the person in the first image with the outfit from the second image. The fit must be realistic, conforming to the person's body shape and pose. Pay close attention to draping, folds, and perspective.
      4.  **Proportions and Shadows:** Ensure the proportions of the clothing are correct on the person's body. Render natural-looking shadows and lighting on the clothing to seamlessly integrate it with the original image's lighting conditions.
      5.  **Background Generation:** Generate a new, visually appealing background that aesthetically complements the style of the new outfit. For example, a formal gown might be placed in an elegant indoor setting, while casual wear might be in an urban or natural outdoor setting. The background should look realistic and not distract from the person.
      6.  **Final Output:** The result must be a single, photorealistic image. Do not add any text, watermarks, or annotations.
    `;
    
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            // Explicitly use an array for contents to match REST API structure and fix 400 error.
            contents: [
                { parts: [userImagePart, outfitImagePart, textPart] }
            ],
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                const mimeType = part.inlineData.mimeType;
                const base64Data = part.inlineData.data;
                return `data:${mimeType};base64,${base64Data}`;
            }
        }

        const fallbackText = response.text?.trim();
        if (fallbackText) {
             throw new Error(`Model returned text instead of an image: "${fallbackText}"`);
        }

        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('400')) {
             throw new Error("The request was invalid. Please check your uploaded images and try again.");
        }
        throw new Error("Failed to generate virtual try-on image. The AI may be busy, please try again later.");
    }
};
