import React, { useState } from "react";
import { Star, CheckCircle2, Quote, User, Sparkles, Filter, ShieldCheck, Heart } from "lucide-react";

interface Review {
  id: string;
  category: string;
  serviceTag: string;
  title: string;
  content: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  badge: string;
  emoji: string;
}

const REVIEWS_DATA: Review[] = [
  {
    id: "leak-review",
    category: "누수탐지",
    serviceTag: "누수탐지 & 누수공사 후기",
    title: "정확한 탐지 덕분에 온 집안 누수 걱정 끝났어요",
    content: "아랫집 천장에 물이 새서 걱정했는데, 정확한 위치를 찾아서 깔끔하게 공사해 주셨어요. 마감까지 완벽하게 처리해 주셔서 이제 마음이 정말 편안합니다.",
    author: "김*호",
    location: "서울 마포구",
    rating: 5,
    date: "2026.05.12",
    badge: "정밀 탐지 성공",
    emoji: "💧"
  },
  {
    id: "sewer-review",
    category: "하수구",
    serviceTag: "하수구막힘 & 하수구고압세척 후기",
    title: "상습 막힘 하수구 고압세척으로 속 시원하게 해결",
    content: "자꾸 막히던 하수구 때문에 스트레스였는데, 고압세척으로 배관 속 기름때를 싹 밀어내니 속이 다 시원해요. 진작 전문가를 불러서 해결할 걸 그랬습니다.",
    author: "박*원",
    location: "경기 부천시",
    rating: 5,
    date: "2026.06.02",
    badge: "배관 완벽 세척",
    emoji: "🌪️"
  },
  {
    id: "sink-review",
    category: "싱크대",
    serviceTag: "싱크대막힘 후기",
    title: "싱크대 물 역류 및 고약한 냄새가 싹 사라졌습니다",
    content: "싱크대 물이 역류해서 온 집안에 냄새가 났는데, 꽉 막힌 이물질을 신속하게 뚫어주셨습니다. 작업 후에 관리하는 방법까지 친절하게 설명해 주셔서 유익했어요.",
    author: "이*경",
    location: "인천 연수구",
    rating: 5,
    date: "2026.06.18",
    badge: "역류 즉각 차단",
    emoji: "🚰"
  },
  {
    id: "faucet-review",
    category: "수전/도기",
    serviceTag: "수전교체 & 세면대교체 후기",
    title: "수도꼭지랑 세면대 바꿨을 뿐인데 화장실이 새집 같네요",
    content: "오래된 화장실 수도꼭지와 세면대를 새것으로 바꿨더니 욕실 분위기가 완전히 환해졌어요. 물도 잘 나오고 인테리어 효과까지 얻은 것 같아 대만족입니다.",
    author: "정*희",
    location: "서울 강서구",
    rating: 5,
    date: "2026.07.03",
    badge: "인테리어 효과 극대화",
    emoji: "🚿"
  },
  {
    id: "frozen-review",
    category: "해빙",
    serviceTag: "해빙 & 언수도녹임 후기",
    title: "엄동설한 한파 속 동파된 언수도 완벽 스팀 녹임",
    content: "겨울 한파에 수도가 얼어 물이 안 나와 고생했는데, 연락드리자마자 달려와서 안전하게 녹여주셨어요. 추운 날씨에 고생하셨는데 친절하게 해주셔서 살았습니다.",
    author: "최*식",
    location: "경기 성남시",
    rating: 5,
    date: "2026.01.21",
    badge: "한파 긴급 통수",
    emoji: "❄️"
  },
  {
    id: "budong-review",
    category: "부동전",
    serviceTag: "부동전 교체 후기",
    title: "마당 부동전 동파 및 흙파기 공사까지 대만족",
    content: "겨울에 마당에 있던 부동전이 얼어 터져서 봄이 되어서야 다시 교체 의뢰 했었는데요. 땅 파는 것이 쉬운 일이 아닌데 정말 깔끔하게 교체해 주셔서 대만족이었습니다.",
    author: "강*웅",
    location: "인천 강화군",
    rating: 5,
    date: "2026.04.10",
    badge: "야외 완벽 교체",
    emoji: "🏡"
  }
];

export default function CustomerReviews() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "누수탐지", "하수구", "싱크대", "수전/도기", "해빙", "부동전"];

  const filteredReviews = filter === "All" 
    ? REVIEWS_DATA 
    : REVIEWS_DATA.filter(r => r.category === filter);

  return (
    <div className="w-full bg-white rounded-3xl border border-blue-100 shadow-xl overflow-hidden p-6 md:p-8" id="reviews-section">
      
      {/* Top Title Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-5 border-b border-gray-100 pb-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-inner">
            <Heart className="w-3 h-3 fill-current text-blue-500" />
            고객 감사 만족도 100% 리얼 후기
          </span>
          <h3 className="text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            고객님이 직접 남겨주신 솔직한 감사의 목소리
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            지앤지클린의 자부심은 광고가 아닙니다. 오직 완벽한 성실 정비와 정직한 일처리로 감동받으신 고객님들의 진솔한 시공 피드백입니다.
          </p>
        </div>

        {/* Filter Tab Stack */}
        <div className="flex flex-wrap gap-1 md:max-w-xl xl:max-w-2xl justify-start xl:justify-end items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-1 ${
                filter === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]"
                  : "text-gray-600 hover:bg-white hover:text-blue-600"
              }`}
            >
              <span>{cat === "All" ? "전체보기" : cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trust Highlight Box */}
      <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-center gap-4.5">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl shrink-0">
          👑
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-sm font-black text-gray-900">조작 및 허위 후기 작성 0건, 정직하게 마주합니다</h4>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            현장에서 직접 문제를 해결하고 만족하신 고객님들이 전해주신 100% 순수 실제 경험담입니다. 어떤 과장도 덧붙이지 않은 정직한 평가만을 공개합니다.
          </p>
        </div>
      </div>

      {/* Bento-like Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="group relative bg-slate-50/50 hover:bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Info row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-white border border-gray-100 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-blue-600">
                  <span className="text-xs leading-none">{review.emoji}</span>
                  <span>{review.serviceTag.replace(" 후기", "")}</span>
                </span>
                
                <span className="text-[10px] text-gray-400 font-bold tracking-tight">
                  {review.date}
                </span>
              </div>

              {/* Star review ratings */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-black text-gray-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors">
                  &ldquo;{review.title}&rdquo;
                </h4>
                
                <div className="relative">
                  <span className="absolute -top-1 -left-1 text-blue-200/50 text-2xl font-serif pointer-events-none">&ldquo;</span>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pl-3 pt-0.5">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Author Row */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                  <User className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black text-gray-900 block leading-tight">{review.author} 고객님</span>
                  <span className="text-[10px] text-gray-400 block leading-tight mt-0.5">{review.location}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-[10px] font-extrabold text-blue-700 leading-none">
                <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                <span>시공 완료</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom guarantee footer */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400 flex items-center gap-1.5 text-center md:text-left">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>지앤지클린은 모든 현장 시공 건에 대해 정직한 A/S 사후관리 무상 기간을 제공합니다.</span>
        </p>
        <div className="flex gap-2 shrink-0">
          <a
            href="https://open.kakao.com/o/sWmhpq8f"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FEE500] hover:bg-[#FEE500]/95 text-[#191919] font-black py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>💬</span>
            <span>나도 견적 문의하기</span>
          </a>
        </div>
      </div>

    </div>
  );
}
