import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { dream } = await req.json();

    if (!dream) {
      return NextResponse.json({ error: '꿈 내용을 입력해주세요.' }, { status: 400 });
    }

    const modelsToTry = ["models/gemini-1.5-flash", "models/gemini-1.5-pro", "gemini-1.5-flash"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[API] ${modelName} 시도 중...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `
          꿈 해석 전문가로서 사용자의 꿈을 분석해줘. 
          반드시 아래의 JSON 형식만 출력하고, 다른 설명은 하지마.
          
          {
            "meaning": "핵심 의미 (간결하게)",
            "caution": "주의점 (한 줄)",
            "goodOmen": "길조/행운의 징조 (한 줄)",
            "luckyNumbers": [6개의 행운의 숫자 (1-45 범위)]
          }

          꿈 내용: "${dream}"
        `;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.8, // 창의적인 숫자 생성을 위해 온도를 살짝 높임
          },
        });

        const response = await result.response;
        let text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];
        
        text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        
        const parsedData = JSON.parse(text);
        return NextResponse.json(parsedData);

      } catch (err: any) {
        console.warn(`${modelName} 실패:`, err.message);
        lastError = err;
        continue; 
      }
    }

    throw lastError || new Error("연결에 실패했습니다.");

  } catch (error: any) {
    const errorMessage = `현재 꿈을 해석할 수 있는 별의 연결이 약합니다.\n[사유]\n${error.message}`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
