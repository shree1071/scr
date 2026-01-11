import { generateGeminiResponse } from '../../lib/gemini';

export async function POST(request: Request) {
  try {
    const { mood, stressLevel, workContext, preferences } = await request.json();

    const prompt = `Generate personalized wellness recommendations based on the following workplace context:

Current Mood (1-5): ${mood || 3}
Stress Level (1-5): ${stressLevel || 3}
Work Context: "${workContext || 'General office environment'}"
Preferences: ${preferences ? preferences.join(', ') : 'No specific preferences'}

Please provide 3-4 personalized wellness tips that are:
1. Practical and actionable in a workplace setting
2. Tailored to their current mood and stress level
3. Consider their work context and preferences
4. Include both immediate coping strategies and longer-term wellness habits

Format your response as a JSON object with:
{
  "tips": [
    {
      "title": "Brief title of the tip",
      "description": "Detailed explanation of what to do",
      "category": "breathing | mindfulness | movement | social | productivity",
      "timeRequired": "1-2 min | 5-10 min | 15+ min",
      "difficulty": "easy | medium | challenging"
    }
  ],
  "moodInsight": "Brief insight about their current emotional state",
  "recommendedAction": "One most important action to take right now"
}

Respond only with valid JSON, no other text.`;

    const response = await generateGeminiResponse(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return Response.json(parsed);
    } catch (parseError) {
      // Fallback tips if JSON parsing fails
      const fallbackTips = {
        tips: [
          {
            title: "Take a Mindful Break",
            description: "Step away from your desk for 5 minutes. Focus on your breathing and notice your surroundings.",
            category: "mindfulness",
            timeRequired: "5 min",
            difficulty: "easy"
          },
          {
            title: "Stretch at Your Desk",
            description: "Simple neck rolls, shoulder shrugs, and wrist stretches can relieve tension.",
            category: "movement",
            timeRequired: "2 min",
            difficulty: "easy"
          }
        ],
        moodInsight: "Taking regular breaks helps maintain emotional balance throughout the workday.",
        recommendedAction: "Stand up and stretch for 2 minutes right now."
      };
      return Response.json(fallbackTips);
    }
  } catch (error) {
    console.error('Wellness tips error:', error);
    return Response.json({ error: 'Failed to generate wellness tips' }, { status: 500 });
  }
}
