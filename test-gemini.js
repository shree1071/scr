// Simple test for Gemini API
import { generateGeminiResponse } from './lib/gemini.js'

// Test the API with a simple message
generateGeminiResponse('Hello, how are you?')
  .then(response => {
    console.log('✅ Gemini API Test Success:', response)
  })
  .catch(error => {
    console.error('❌ Gemini API Test Failed:', error)
  })
