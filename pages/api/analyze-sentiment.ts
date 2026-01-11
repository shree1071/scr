import { generateGeminiResponse } from '../../lib/gemini';

export async function POST(request: Request) {
  try {
    const { text, moodValue } = await request.json();

    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `Analyze the sentiment of this workplace wellness journal entry and provide insights:

Journal Entry: "${text}"
Self-reported mood (1-5 scale): ${moodValue}

Please provide a JSON response with:
1. sentiment_score: A number from -1 (very negative) to 1 (very positive)
2. sentiment_label: One of ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"]
3. insights: An array of 2-3 brief insights about their emotional state, workplace stressors, or positive factors

Focus on workplace context and emotional wellbeing. Be empathetic and constructive.

Respond only with valid JSON, no other text.`;

    const response = await generateGeminiResponse(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return Response.json({ sentiment: parsed });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return Response.json({ 
        sentiment: {
          sentiment_score: moodValue > 3 ? 0.5 : moodValue < 3 ? -0.5 : 0,
          sentiment_label: moodValue > 3 ? 'Positive' : moodValue < 3 ? 'Negative' : 'Neutral',
          insights: ['Keep tracking your mood for better insights']
        }
      });
    }
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return Response.json({ error: 'Failed to analyze sentiment' }, { status: 500 });
  }
}
