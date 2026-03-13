import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

let lastRequestTime = 0;
const MIN_REQUEST_GAP = 1500; 

export async function POST(req: Request) {
  try {
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_GAP) {
      return NextResponse.json({ error: '천천히 시도해주세요.' }, { status: 429 });
    }
    lastRequestTime = now;

    const { dream } = await req.json();

    if (!dream) {
      return NextResponse.json({ error: '내용이 없습니다.' }, { status: 400 });
    }

    // 가장 안정적인 gemini-1.5-flash 또는 최신 2.0-flash-exp 시도
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // 2.0 모델명 오류 가능성을 대비해 가장 안정적인 버전으로 우선 설정
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      }
    });

    const prompt = `
      꿈 해석 전문가로서 사용자의 꿈을 분석해줘. 
      결과는 반드시 아래의 JSON 형식만 출력하고, 다른 설명은 하지마. 
      토큰을 아끼기 위해 답변은 짧고 강렬하게 요약해줘.

      {
        "meaning": "핵심 의미 (1~2문장)",
        "caution": "주의점 (한 줄)",
        "goodOmen": "행운의 징조 (한 줄)"
      }

      꿈 내용: "${dream}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // 제미나이가 가끔 보내는 ```json ... ``` 마크다운 태그 제거 로직
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedData = JSON.parse(text);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ 
        meaning: "무의식이 복잡하게 얽혀있네요. 다시 한 번 들려주시겠어요?",
        caution: "생각을 정리할 시간이 필요합니다.",
        goodOmen: "곧 명확한 답을 얻게 될 것입니다."
      });
    }

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || '분석 중 오류 발생' }, { status: 500 });
  }
}
