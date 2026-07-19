import React, { useState } from "react";
import { Sparkles, Phone, AlertCircle, Wrench, RefreshCw, Send, HelpCircle, Check } from "lucide-react";
import { AIDiagnosisResult } from "../types";

interface SuggestionItem {
  category: string;
  categoryLabel: string;
  text: string;
}

const CATEGORIES = [
  { id: "leak", name: "누수탐지 / 누수공사" },
  { id: "drain", name: "하수구 막힘 / 고압세척" },
  { id: "clog", name: "싱크대 / 변기 막힘" },
  { id: "replace", name: "수전 / 도기 교체" },
  { id: "thawing", name: "동파 해빙 / 보일러 배관" },
  { id: "other", name: "기타 설비 공사" }
];

const SYMPTOM_SUGGESTIONS: SuggestionItem[] = [
  {
    category: "leak",
    categoryLabel: "누수탐지",
    text: "수도세가 갑자기 평소보다 3배 이상 나왔고, 아랫집 천장에서 물이 비친다고 합니다."
  },
  {
    category: "drain",
    categoryLabel: "하수구막힘",
    text: "화장실 바닥 하수구에서 배수가 전혀 안 되고 역류하며 악취가 심하게 올라와요."
  },
  {
    category: "clog",
    categoryLabel: "변기막힘",
    text: "아이 장난감이 변기에 빠진 것 같은데, 물을 내리면 가득 차올랐다가 서서히 내려가요."
  },
  {
    category: "replace",
    categoryLabel: "수전교체",
    text: "주방 싱크대 코브라 수도꼭지 목 부분에서 물이 질질 새고, 온수 손잡이가 너무 뻑뻑해요."
  },
  {
    category: "thawing",
    categoryLabel: "언수도녹임",
    text: "강추위에 보일러 온수가 아예 안 나오고 싱크대 수전에서도 차가운 물 한 방울조차 안 나옵니다."
  }
];

export default function AIDiagnosis() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [symptomText, setSymptomText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AIDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestClick = (suggestion: SuggestionItem) => {
    setSelectedCategory(suggestion.category);
    setSymptomText(suggestion.text);
  };

  const handleDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) {
      setError("증상을 자세히 적거나 아래 추천 문장을 클릭해 주세요!");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Dynamic loading texts to keep user engaged and reassured
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1100);

    try {
      const categoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.name || "설비";
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: symptomText,
          category: categoryLabel
        })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        // Fallback handler if server returns error or API limits
        setResult(data.fallback || {
          diagnosis: "지앤지클린 배관 마스터 팀장입니다! 입력해 주신 문제 증상은 당일 현장 정밀 점검을 통해 즉시 진단이 가능합니다. 거품 없는 투명한 견적을 전화(010-2699-0484)를 통해 바로 상담해 드릴 수 있으니 편하게 연락 주세요.",
          reassurance: "지앤지클린은 무조건 파쇄하지 않으며 최첨단 탐지 장비로 딱 필요한 곳만 손봅니다.",
          steps: [
            "피해 예방을 위해 메인 수도 계량기 밸브를 신속히 잠가 보세요.",
            "010-2699-0484 번호로 상태 사진을 찍어 보내주시면 훨씬 정확한 가견적이 가능합니다.",
            "지금 바로 지앤지클린 전화를 주시면 즉각적인 현장 조언을 해드립니다."
          ]
        });
      }
    } catch (err) {
      console.error(err);
      setResult({
        diagnosis: "현재 지앤지클린 대표전화 010-2699-0484로 즉시 유선 연락을 주시면, 배관 최고 기술자 베테랑 팀장이 직접 막힌 증상과 새는 위치의 원인을 밝혀 거품 없는 원스톱 해결책을 전수해 드립니다.",
        reassurance: "지앤지클린은 안심 책임 시공제로 하자 보수까지 책임집니다.",
        steps: [
          "수도 밸브를 차단하여 추가 물 샘 피해를 예방해 주세요.",
          "증상 부위 사진을 찍어 두시면 상세 견적 산출에 아주 큰 도움이 됩니다.",
          "010-2699-0484 대표 번호로 즉시 전화 연락을 주시면 24시간 항시 무료 통화 상담 가능합니다."
        ]
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const currentCategoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.name;

  return (
    <div className="w-full bg-gradient-to-br from-blue-50/70 via-blue-100/30 to-white rounded-3xl border border-blue-200/60 p-6 md:p-8 shadow-xl relative overflow-hidden" id="ai-diagnosis">
      {/* Decorative clean particles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">INTELLIGENT DIAGNOSIS</span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            24시간 AI 실시간 배관 무료 진단
          </h3>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        지금 집에서 겪고 계신 불편한 증상(누수, 막힘, 싱크대 역류, 수전고장 등)을 설명해 주세요. 
        지앤지클린의 풍부한 배관 시공 노하우와 인공지능이 즉석에서 <strong>예상 원인과 신속한 응급 대처법</strong>을 상세하게 분석해 드립니다.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-5">
          <form onSubmit={handleDiagnosis} className="space-y-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">1. 문제 분류 선택</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-left border transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                    }`}
                  >
                    {cat.name.split(" / ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Input Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                2. 구체적인 증상 입력
              </label>
              <div className="relative">
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="예: 싱크대 밑에서 악취와 함께 물이 조금씩 스며 나와요. 아래층 천장이 축축해졌다고 해서 걱정됩니다."
                  className="w-full h-32 p-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none transition-shadow duration-200 shadow-inner"
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {symptomText.length}자 입력됨
                </div>
              </div>
              {error && (
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:bg-blue-400"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>AI 분석이 진행 중입니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>실시간 배관 상태 무료 진단받기</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Suggestions Chips */}
          <div className="pt-2">
            <span className="text-xs font-bold text-gray-500 block mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> 자주 겪는 고장 증상 (선택 입력)
            </span>
            <div className="flex flex-col gap-2">
              {SYMPTOM_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestClick(sug)}
                  className="text-left text-xs bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-lg p-2.5 text-gray-600 hover:text-blue-700 transition-all flex items-center gap-2 shadow-sm"
                >
                  <span className="bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                    {sug.categoryLabel}
                  </span>
                  <span className="truncate">{sug.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis Result Column */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {isLoading && (
            <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-inner flex flex-col items-center justify-center min-h-[350px] text-center space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-blue-100/50 rounded-full animate-ping"></div>
                <div className="relative p-5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <Wrench className="w-8 h-8 animate-spin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-bold text-gray-900">
                  입력하신 배관 증상을 정밀 분석하고 있습니다
                </h4>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600 font-medium h-5">
                  {loadingStep === 0 && <span>🔍 배관 카테고리 진단 중...</span>}
                  {loadingStep === 1 && <span>💧 역류 및 누수 위험 분석 중...</span>}
                  {loadingStep === 2 && <span>⚙️ 지앤지클린 노하우 매칭 중...</span>}
                  {loadingStep === 3 && <span>📋 최적의 해결 방안 및 대처 가이드 수립 중...</span>}
                </div>
              </div>

              <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                  style={{ width: `${(loadingStep + 1) * 25}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">지앤지클린 AI 배관 솔루션 시스템</p>
            </div>
          )}

          {!isLoading && !result && (
            <div className="bg-blue-50/20 border-2 border-dashed border-blue-100 rounded-2xl p-8 text-center min-h-[350px] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">대기 중 - 실시간 진단 대기</h4>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                  우측 혹은 좌측 양식에 현재 불편하신 문제 상태를 구체적으로 입력하고 버튼을 누르시면, 즉석 분석 결과를 이곳에서 보여드립니다.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm max-w-xs text-xs text-gray-500">
                💡 <strong>빠른 상담 안내</strong>: 전화(<strong>010-2699-0484</strong>) 또는 <a href="https://open.kakao.com/o/sWmhpq8f" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">실시간 카톡상담</a>을 통해 원인과 견적을 1분 만에 친절하게 안내받으실 수 있습니다.
              </div>
            </div>
          )}

          {!isLoading && result && (
            <div className="bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden min-h-[350px] flex flex-col justify-between">
              {/* Result Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span className="text-sm font-bold">지앤지클린 AI 진단 결과서</span>
                </div>
                <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  실시간 맞춤 분석
                </span>
              </div>

              {/* Result Body */}
              <div className="p-5 md:p-6 space-y-5 flex-grow">
                {/* Reassurance text */}
                <div className="bg-blue-50 border border-blue-100/80 rounded-xl p-3.5 text-blue-700 flex items-start gap-2.5">
                  <span className="text-lg shrink-0 mt-0.5">💡</span>
                  <div>
                    <h5 className="text-xs font-bold">지앤지클린 안심 한줄 진단</h5>
                    <p className="text-xs md:text-sm font-semibold mt-0.5">
                      {result.reassurance}
                    </p>
                  </div>
                </div>

                {/* Main Diagnosis text */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500 block">🔬 종합 소견 및 해결 방안</span>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {result.diagnosis}
                  </p>
                </div>

                {/* Quick Emergency Steps */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 block">🚨 즉시 실행해야 할 안심 대처 단계</span>
                  <div className="space-y-1.5">
                    {result.steps && result.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-amber-50/20 hover:bg-amber-50/40 p-2 rounded-lg border border-amber-100/20 transition-all">
                        <span className="bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-tight">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Footer/CTA */}
              <div className="bg-blue-50/50 p-4 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-gray-400 block font-medium">연중무휴 24시간 긴급 출동 가능</span>
                  <span className="text-xs font-bold text-blue-700">가장 편한 방법으로 가견적 받아보세요!</span>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <a
                    href="https://open.kakao.com/o/sWmhpq8f"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 sm:w-auto bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] text-xs font-extrabold px-3.5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>💬</span>
                    <span>카톡 상담</span>
                  </a>
                  <a
                    href="tel:010-2699-0484"
                    className="w-1/2 sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>전화 연결</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
