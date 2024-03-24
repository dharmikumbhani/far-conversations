import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

export async function getAIResponse(promptText: any) {
  try {
    const response = await axios.post(apiUrl, {
      prompt: promptText,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      return response.data.choices[0].text.trim();
    } else {
      return `Error: ${response.status} - ${response.statusText}`;
    }
  } catch (error) {
    return `Error: ${error}`;
  }
}