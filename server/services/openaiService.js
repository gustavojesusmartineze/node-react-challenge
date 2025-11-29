const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

const expandPrompt = async (prompt) => {
    if (process.env.MOCK_MODE === 'true') {
        console.log('Mock Mode: Expanding prompt locally');
        return [
            `${prompt} - Variation 1`,
            `${prompt} - Variation 2`,
            `${prompt} - Variation 3`,
            `${prompt} - Variation 4`,
        ];
    }

    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API Key is missing');
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a creative assistant. Your task is to take a single topic (e.g., 'Toys') and generate 4 distinct, specific items related to that topic (e.g., 'Teddy Bear', 'Toy Car', 'Rubber Duck', 'Yo-Yo'). Return ONLY a JSON array of strings. Do not include markdown formatting."
                },
                {
                    role: "user",
                    content: `Topic: ${prompt}`
                }
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        // Basic cleanup to ensure it's valid JSON
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to expand prompt');
    }
};

module.exports = { expandPrompt };
