import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Google Generative AI 설정 (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { dream } = await req.json();

    if (!dream) {
      return NextResponse.json({ error: '꿈 내용을 입력해주세요.' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ 
        meaning: "API 키가 설정되지 않아 테스트 응답을 보냅니다: 이 꿈은 새로운 변화의 시작을 의미합니다.",
        caution: "현재 상황에서 서두르지 말고 주변을 잘 살피세요.",
        goodOmen: "곧 당신에게 기분 좋은 소식이 찾아올 것입니다."
      });
    }

    // Gemini 모델 가져오기 (1.5 Flash가 빠르고 효율적임)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      너는 신비롭고 깊이 있는 통찰력을 가진 꿈 해석 전문가이자 조언가야. 
      사용자가 꾼 꿈 내용을 듣고, 다음 세 가지 섹션으로 분석해서 JSON 형식으로 답변해줘:
      
      {
        "meaning": "꿈이 상징하는 핵심 의미 (신비롭고 따뜻한 한국어 톤)",
        "caution": "일상에서 조심해야 할 점이나 주의사항",
        "goodOmen": "기대할 수 있는 긍정적인 변화나 행운의 징조"
      }

      꿈 내용: "${dream}"
      
      반드시 한국어로 답변하고, 사용자에게 친근하면서도 깊은 울림을 주는 문체를 사용해줘.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json({ error: '꿈을 분석하는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
