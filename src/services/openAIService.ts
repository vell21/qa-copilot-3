import axios from 'axios';
import { getTestCasesPrompt } from '../utils/prompts';
import 'dotenv/config';

export async function generateTestCasesWithAI(workItemDetailsInJSON: object) {
    const url = `https://${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.API_VERSION}`;
    console.log('3.1 Requesting:', url);
    const prompt = getTestCasesPrompt(workItemDetailsInJSON);
    const response = await axios.post(
        url,
        {
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600,
            temperature: 0.2,
        },
        {
            headers: {
                'api-key': `${process.env.AZURE_OPENAI_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );
    console.log('3.2 response:',
        `response.status: ${response.status},
  response.data: ${JSON.stringify(response.data, null, 2).slice(0, 100)}`);

    return response.data.choices[0].message?.content ?? '';
}