import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Plumbing Diagnosis
  app.post("/api/diagnose", async (req, res) => {
    try {
      const { symptom, category } = req.body;
      if (!symptom) {
        return res.status(400).json({ error: "증상을 입력해주세요." });
      }

      // Check if GEMINI_API_KEY exists
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Return a reassuring fallback if API key is placeholder or empty
        return res.json({
          diagnosis: "갑작스러운 설비 문제로 많이 당황하셨겠어요! 지앤지클린이 신속하고 확실하게 해결해 드릴 테니 걱정하지 마세요.\n현재 " + (category || "설비") + " 관련 문의가 급증하고 있어 010-2699-0484로 현장 사진과 함께 전화나 문자를 남겨주시면, 베테랑 팀장이 직접 확인 후 비용 거품 없는 가장 투명하고 정직한 해결 견적을 안내해 드립니다.",
          reassurance: "지앤지클린은 과잉 청구 없는 투명한 가격 정책과 최소한의 타공 공법을 약속드립니다.",
          steps: [
            "수압 문제나 누수가 의심된다면 메인 수도 계량기 밸브를 신속하게 잠가주세요.",
            "하수구막힘이나 변기막힘인 경우 물을 계속 내리지 마시고 대기해 주세요.",
            "010-2699-0484로 문제 부위 사진을 문자 전송 후 전화를 주시면 즉시 상담 가능합니다."
          ]
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
당신은 대한민국 최고의 설비공사 전문업체 '지앤지클린'의 24시간 친절하고 신뢰감 주는 AI 배관 및 누수 공사 상담 실장입니다.
사용자가 입력한 배관, 누수, 하수구 막힘, 싱크대 막힘, 변기 고장, 수전 교체, 겨울철 동파 해빙 등의 고장 증상을 분석하여 아래 조건에 맞는 전문적이고 안심되는 피드백을 제공해 주세요.

[사용자 입력 정보]
- 문의 분야: ${category || "전체 설비"}
- 고장 증상: ${symptom}

[상담 및 답변 지침]
1. 친절하고 신뢰감 넘치는 톤앤매너로 고객의 다급한 마음을 먼저 공감하고 위로해 주세요. (예: "갑작스러운 싱크대 역류로 많이 당황하셨겠어요. 지앤지클린이 도와드릴 테니 안심하세요!")
2. 입력된 증상을 바탕으로 예상되는 원인을 알기 쉬운 우리말로 풀어서 상냥하게 설명해 주세요. 전문 용어가 있다면 꼭 쉬운 말로 풀어서 설명해 주세요.
3. 임시 대처 요령(예: 누수의 경우 계량기 잠그기, 막힘의 경우 무리해서 화학 약품을 계속 붓거나 기구를 쑤시지 않기 등)을 2~3가지 쉽게 안내해 주세요.
4. '지앤지클린(010-2699-0484)'은 '최첨단 장비(배관 내시경 카메라, 열화상 카메라, 청음식 및 가스식 누수 탐지기)'를 사용하여 '최소한의 파쇄(최소한만 깨서 완벽 수리)'와 '거품 없는 투명하고 정직한 비용'으로 신속하게 당일 해결해 줄 수 있음을 강조하고, "010-2699-0484"로 전화하여 즉시 전문가와 무료 상담을 진행하도록 유도해 주세요.
5. 반드시 JSON 형태로 답변해 주세요. JSON 형식은 아래와 같아야 합니다. 마크다운 기호(\`\`\`json) 등은 넣지 말고 순수 JSON 문자열만 출력해 주세요.

[JSON 출력 형식]
{
  "diagnosis": "예상 원인과 지앤지클린의 완벽 해결 방식에 대한 안심 가득한 설명 문자열 (줄바꿈 포함 가능)",
  "reassurance": "고객을 안심시키는 강력하고 짧은 신뢰 문구 (예: '정확한 원인 진단으로 파쇄 범위를 줄이고 비용 부담을 최소화해 드립니다!')",
  "steps": [
    "고객이 현장에서 지금 즉시 취할 수 있는 간단하고 안전한 조치/임시 대처 행동 1",
    "조치/임시 대처 행동 2",
    "지앤지클린(010-2699-0484)에 전화하여 현장 사진을 보내고 실시간 빠른 상담 받기"
  ]
}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      res.json(result);

    } catch (error: any) {
      console.error("Gemini diagnosis error:", error);
      res.status(500).json({
        error: "진단 중 오류가 발생했습니다.",
        details: error.message,
        fallback: {
          diagnosis: "현재 접속자가 많아 AI 분석이 지연되고 있습니다. 하지만 걱정하지 마세요! 지앤지클린(010-2699-0484)으로 바로 연락을 주시면, 배관 설비 최고 경력의 전문가가 직접 정직하고 거품 없는 맞춤 견적과 대응 방법을 1분 만에 안내해 드립니다.",
          reassurance: "지앤지클린은 24시간 긴급 출동이 가능하며 정직한 비용을 고수합니다.",
          steps: [
            "누수가 보인다면 계량기 하단 메인 밸브를 신속히 잠가 주십시오.",
            "증상 부위 사진을 카메라로 촬영해 두시면 더욱 명쾌한 상담이 가능합니다.",
            "010-2699-0484로 지금 바로 전화 주세요."
          ]
        }
      });
    }
  });

  // Vite middleware for development or Static Serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
