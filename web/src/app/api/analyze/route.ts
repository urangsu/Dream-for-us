import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { dream } = await req.json();

    if (!dream) {
      return NextResponse.json({ error: '꿈 내용을 입력해주세요.' }, { status: 400 });
    }

    // 404 에러 방지를 위해 'models/' 접두사를 포함한 안정적인 모델 리스트
    const modelsToTry = [
      "models/gemini-2.0-flash",
      "models/gemini-1.5-flash",
      "models/gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[API Try] Attempting with: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `
          당신은 30년 경력의 신비로운 타로 마스터이자 영험한 꿈 해몽가입니다. 
          사용자의 꿈을 분석하여 운명의 실타래를 풀어주세요.
          말투는 신비롭고 지혜로우며, 사용자에게 직접 이야기하듯 따뜻하면서도 날카로운 통찰력을 보여주세요.

          반드시 아래의 JSON 형식만 출력하고, 다른 설명은 하지마세요.
          
          {
            "meaning": "꿈의 핵심적이고 영적인 의미 (2~3문장)",
            "caution": {
              "summary": "운명의 경고 한 줄 평",
              "story": "주의해야 할 점에 대한 6줄 이상의 상세하고 용한 조언. 타로 마스터의 관점에서 구체적인 상황을 들어 설명하세요."
            },
            "goodOmen": {
              "summary": "하늘이 내린 길조 한 줄 평",
              "story": "꿈이 전하는 행운의 징조에 대한 6줄 이상의 신비로운 이야기. 앞으로 다가올 기회와 복을 생생하게 묘사하세요."
            },
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
