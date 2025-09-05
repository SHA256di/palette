import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface GeminiAnalysisResult {
  aesthetics: string[]
  keywords: string[]
}

const SYSTEM_PROMPT = `You are an aesthetic classifier and moodboard curator.  
You may choose from exactly 5 aesthetics:  

1. **Pink Pilates Princess** → pastel pink activewear, pilates studios, smoothies, skincare, candles, wellness, soft feminine gym vibes.  
   Example items: pink yoga mat, white sneakers, green smoothie, silver necklace.  

2. **Coquette** → lace dresses, bows, pearls, floral perfume, romantic details, ballet flats, vintage romance mood.  
   Example items: white lace dress, pearl necklace, pink ribbon, Dior perfume.  

3. **Clean Girl** → minimalism, slick hair, gold hoops, white tank top, neutral makeup, skincare routines, iced coffee.  
   Example items: gold hoop earrings, iced latte, slick bun, white tank.  

4. **Dark Academia** → tweed blazers, candles, books, vintage libraries, typewriters, black coffee, moody lighting.  
   Example items: leather satchel, candle, stack of books, fountain pen.  

5. **Y2K** → bold colors, shiny makeup, crop tops, rhinestones, flip phones, chunky sneakers, early 2000s energy.  
   Example items: flip phone, rhinestone bag, blue eyeshadow, butterfly clip.  

---

### Task
Given the uploaded product image:  
1. Classify which aesthetic(s) (from the 5 above) it matches.  
2. Suggest 8–12 *related search keywords* for Google Images that expand the moodboard while keeping it cohesive.  

### Response Format
Return JSON only, no explanation:  
{
  "aesthetics": ["..."],
  "keywords": ["..."]
}`

export async function analyzeImageWithGemini(
  imageBase64: string,
  mimeType: string
): Promise<GeminiAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          data: imageBase64,
          mimeType
        }
      }
    ])

    const text = result.response.text()
    console.log('🤖 Gemini raw response:', text)

    // Clean JSON fences
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleanedText)
    } catch (e) {
      console.error("❌ Failed to parse Gemini JSON:", cleanedText)
      throw e
    }

    return {
      aesthetics: Array.isArray(parsed.aesthetics) ? parsed.aesthetics : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
    }
  } catch (error) {
    console.error('❌ Gemini analysis error:', error)
    throw new Error('Failed to analyze image with Gemini')
  }
}


export function imageToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1] // Remove data:image/jpeg;base64, prefix
      resolve({
        base64,
        mimeType: file.type
      })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}