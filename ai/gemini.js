const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold,} = require("@google/generative-ai");
require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function gemini (question, pdfData) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(`
        PARAGRAPH TEXT -> ${JSON.stringify(pdfData)}.

        QUESTION FROM USER -> ${JSON.stringify(question)}.

        *answer the question by user referring the paragraph in very simple words*
        `);
    const response = result.response.text()
    return response;
    
}

module.exports = gemini;