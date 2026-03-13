const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: 'web/.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("❌ API 에러:", data.error.message);
      return;
    }

    console.log("✅ 사용 가능한 모델 목록:");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name.replace('models/', '')}`);
      }
    });
  } catch (err) {
    console.error("❌ 연결 실패:", err.message);
  }
}

listModels();
