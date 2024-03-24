import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/completions';

export async function getAIResponse(promptText: any) {
  try {
    const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
            'model': 'text-davinci-003',
            'prompt': promptText,
            'temperature': 0.7
        },
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer process.env.OPENAI_API_KEY'
            }
        }
        );
    if (response.status === 200) {
        console.log('Response', response);
        return response.data.choices[0].text.trim();
    } else {
      return `Error: ${response.status} - ${response.statusText}`;
    }
  } catch (error) {
    return `Error: ${error}`;
  }
}

// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function getAIResponse(promptText: any) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: promptText }],
//     model: 'gpt-3.5-turbo',
//   });
//   console.log(chatCompletion)
//   return chatCompletion;
// }