// Gemini API integration for AI chatbot
import { GoogleGenAI } from '@google/genai'

// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Initialize the Google Generative AI client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' })

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Generate AI response using Gemini API
 */
export const generateGeminiResponse = async (userMessage: string, conversationHistory: GeminiMessage[] = []): Promise<string> => {
  try {
    console.log('🚀 Calling Gemini API...', { userMessage, historyLength: conversationHistory.length });
    
    // Check API key
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    // System instruction for vent session chatbot
    const systemInstruction = `You are a supportive and empathetic AI workplace companion. You help employees process their feelings about work, provide emotional support, and offer constructive guidance. Be warm, understanding, and professional. Keep responses concise (2-3 sentences max) and conversational. Focus on being a good listener and providing emotional support.`

    // Try different models in order (same as working reference)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
    let lastError: any = null
    let answer: string | null = null

    for (const modelName of modelsToTry) {
      try {
        // Build conversation history for the chat
        let historyForChat: any[] = []
        
        if (conversationHistory.length > 0) {
          // Convert existing history to the format expected by the SDK
          historyForChat = conversationHistory.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: msg.parts
          }))
        }

        // Create a chat session for this request with history
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction: systemInstruction,
          },
          history: historyForChat
        })

        // Send message and get response
        const resultStream = await chat.sendMessageStream({ 
          message: userMessage
        })
        
        // Collect all chunks
        let fullResponse = ''
        for await (const chunk of resultStream) {
          if (chunk.text) {
            fullResponse += chunk.text
          }
        }

        if (fullResponse) {
          answer = fullResponse
          console.log(`✅ Successfully used model: ${modelName}`)
          break
        }
      } catch (error: any) {
        lastError = error
        // If it's a 404 or model not found, try next model
        if (
          error?.status === 404 || 
          error?.message?.includes('404') || 
          error?.message?.includes('not found') ||
          error?.message?.includes('NOT_FOUND')
        ) {
          console.log(`⚠️ Model ${modelName} not available, trying next...`)
          continue
        }
        // For quota errors, try next model
        if (
          error?.status === 429 || 
          error?.message?.includes('429') || 
          error?.message?.includes('quota') ||
          error?.message?.includes('rate limit')
        ) {
          console.log(`⚠️ Model ${modelName} quota exceeded, trying next...`)
          continue
        }
        // For other errors, throw immediately
        throw error
      }
    }

    if (!answer) {
      throw lastError || new Error('No available models found. Please check your API key and quota.')
    }

    console.log('💬 Generated response:', answer)
    return answer.trim()

  } catch (error: any) {
    console.error('💥 Error generating Gemini response:', error)
    
    // Use fallback responses for API errors
    if (error?.message?.includes('API request failed') || 
        error?.message?.includes('404') ||
        error?.message?.includes('quota') ||
        error?.message?.includes('rate limit') ||
        error?.message?.includes('API key not configured')) {
      
      const fallbacks = [
        "I'm here for you. Can you tell me more about what's on your mind?",
        "That sounds challenging. How are you feeling about it?",
        "I understand. Let's work through this together. What would help right now?",
        "Your feelings are valid. What support do you need?",
      ];
      
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)]
      console.log('🔄 Using fallback response:', fallback)
      return fallback
    }
    
    // Re-throw other errors
    throw error
  }
};
