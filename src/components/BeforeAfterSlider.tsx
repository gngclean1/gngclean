import React, { useState } from "react";
import { Wrench, CheckCircle, Phone, ArrowRight, ShieldCheck, Eye, Smartphone, AlertCircle } from "lucide-react";

interface ShowcaseItem {
  id: string;
  title: string;
  badge: string;
  localName: string;
  image: string;
  description: string;
  features: string[];
  tags: string[];
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "leak-detection",
    title: "누수탐지 & 누수공사",
    badge: "정밀 과학 탐지",
    localName: "leak_detection",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800&h=600",
    description: "보이지 않는 벽면, 바닥 밑 매립 배관에서 발생하는 미세한 물샘을 정밀 탐지 장비로 오차 없이 찾아내어 깔끔하게 해결합니다. 무조건적인 바닥 파헤치기를 지양하고, 딱 물샘 원인 부위만 정교하게 찾아 복원하는 전문 굴착 최소화 공법을 적용합니다.",
    features: [
      "첨단 청음식 및 가스식 탐지로 미세 누수 포인트 99.9% 정밀 색출",
      "주거 자산 손상을 극한으로 줄이는 '최소 파쇄 공법' 시공",
      "배관 수리 완료 후 2차 압력 정밀 테스트로 재발 우려 완벽 종식"
    ],
    tags: ["#누수탐지", "#최소굴착", "#배관보수", "#압력테스트"]
  },
  {
    id: "sewer-jetting",
    title: "하수구막힘 & 하수구 고압세척",
    badge: "고성능 스케일링",
    localName: "sewer_jetting",
    image: "https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&q=80&w=800&h=600",
    description: "아파트 메인 배관, 공장, 상가, 빌라 횡주관 등 기름 슬러지와 요석이 단단하게 굳어 상습적으로 막히는 하수관로를 해결합니다. 강력한 특수 수압 노즐로 배관 내부의 이물질을 통째로 분쇄하고 깎아내어 배관 신설에 준하는 깨끗한 통수 상태를 만듭니다.",
    features: [
      "배관 깊숙이 누적된 돌처럼 굳은 기름덩어리 완벽 분쇄 및 스케일링",
      "특수 고압 분사 차량 및 초강력 특수 회전 노즐 세척 공법 적용",
      "공사 전후 배관 내부를 초고화질 내시경으로 고객이 직접 투명하게 확인"
    ],
    tags: ["#하수구고압세척", "#배관스케일링", "#횡주관소통", "#내시경검사"]
  },
  {
    id: "sink-clog",
    title: "싱크대막힘",
    badge: "주방 악취 및 역류 해결",
    localName: "sink_clog",
    image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800&h=600",
    description: "음식물 찌꺼기, 오래된 식기 세척 기름때 혼합물로 가로막혀 물이 내려가지 않고 바닥 마루로 역류하는 싱크대 하부를 완벽 해결합니다. 고성능 흡입(석션) 장비와 플렉스 샤프트 회전 스케일러의 하이브리드 조합으로 기름층을 완전히 청소합니다.",
    features: [
      "주방 바닥 마루 변색 및 아랫집 천장 누수를 유발하는 역류 현상 즉각 차단",
      "플렉스 샤프트 장비를 통한 배관 벽면 기름때 완벽 분쇄 및 흡입 제거",
      "싱크대 하부 전용 배수 호스 상태 진단 및 필요 시 노후 소모품 교체 지원"
    ],
    tags: ["#싱크대역류", "#기름슬러지제거", "#플렉스샤프트", "#주방하수구"]
  },
  {
    id: "faucet-replacement",
    title: "수전교체",
    badge: "명품 수도꼭지 안심 시공",
    localName: "faucet_replacement",
    image: "https://images.unsplash.com/photo-1585131838846-a774557b322a?auto=format&fit=crop&q=80&w=800&h=600",
    description: "녹슬고 부식된 수전, 이음새 미세 누수가 있는 수도꼭지, 물줄기가 끊기거나 뻑뻑해진 노후 수전을 철거하고 프리미엄 신형 국산 수전으로 안전하게 교체합니다. 완벽한 나사산 밀착 시공 및 정밀 테프론 씰링 처리를 통하여 초미세 물샘까지 방지합니다.",
    features: [
      "KC 위생안전인증을 공식 통과한 내구성 높은 100% 고급 국산 정품 수전 적용",
      "세면대, 싱크대, 샤워기 등 파손 없는 깔끔한 안전 해체 및 완벽 밀착 시공",
      "시공 직후 연결 부위 물샘 여부를 정밀 육안 검사 및 수압 정밀 검출 테스트"
    ],
    tags: ["#수전교체", "#국산수도꼭지", "#싱크대수전", "#욕실샤워기"]
  },
  {
    id: "bathroom-ceramics",
    title: "세면대교체 & 변기교체",
    badge: "도기 교체 & 위생 마감",
    localName: "bathroom_ceramics",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800&h=600",
    description: "금이 가거나 노후되어 위생과 안전을 위협하는 변기 및 세면대를 안전하게 교체합니다. 노후 도기를 깔끔하게 탈거하고, 트렌디한 디자인의 도기를 정밀 수평 측정을 거쳐 흔들림 없이 수평 장착한 후 위생적으로 안착 시공합니다.",
    features: [
      "지독한 암모니아 화장실 정화조 악취 원인을 유발하는 하부 정밀 씰링 원천 보수",
      "물곰팡이와 변색에 원천 대응하는 최고급 향균 친환경 바이오 실리콘 마감 처리",
      "대림바스, 계림 등 우수한 세정력을 자랑하는 고품질 위생 도기 엄선 시공"
    ],
    tags: ["#변기교체", "#세면대시공", "#바이오실리콘", "#화장실악취차단"]
  },
  {
    id: "frozen-thawing",
    title: "해빙 & 언수도녹임",
    badge: "동파 예방 & 긴급 출동",
    localName: "frozen_thawing",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=800&h=600",
    description: "매서운 혹한기 겨울철에 얼어붙어 수돗물 공급이 단절된 보일러 급탕 파이프, 노출형 수도 배관, 외부 계량기를 용해합니다. 화재 우려가 큰 가열 토치 방식 대신 특수 고온 가압 스팀 장비를 주입하여 안전하게 녹이고 통수를 시킵니다.",
    features: [
      "배관 손상이나 갈라짐 파열 위험 없이 얼음층만 안전하게 용해하는 스팀 기법",
      "수도 계량기 및 노출 부위에 대한 보온재 수리/강화 추가 작업 무상 서비스",
      "갑작스럽게 물이 나오지 않는 엄동설한 한파 시 신속히 구동되는 긴급 통수 예약"
    ],
    tags: ["#언수도녹임", "#해빙작업", "#보일러동파", "#수도계량기녹임"]
  }
];

function ShowcaseImage({ item }: { item: ShowcaseItem }) {
  const candidates = [
    `/assets/${item.localName}.jpg`,
    `/assets/${item.localName}.jpeg`,
    `/assets/${item.localName}.png`,
    `/assets/${item.localName}.webp`,
    `/assets/${item.localName}.JPG`,
    `/assets/${item.localName}.JPEG`,
    `/assets/${item.localName}.PNG`,
    `/assets/${item.localName}.WEBP`,
    item.image // Unsplash fallback
  ];

  const [candidateIndex, setCandidateIndex] = useState(0);

  // Reset candidate index when item changes to try local images first
  React.useEffect(() => {
    setCandidateIndex(0);
  }, [item.id]);

  const handleError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={candidates[candidateIndex]}
      alt={item.title}
      onError={handleError}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      referrerPolicy="no-referrer"
    />
  );
}

export default function BeforeAfterSlider() {
  const [activeTab, setActiveTab] = useState(SHOWCASE_ITEMS[0].id);

  const activeShowcase = SHOWCASE_ITEMS.find((item) => item.id === activeTab) || SHOWCASE_ITEMS[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden p-5 md:p-8" id="construction-showcase">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1 rounded-full mb-2">
            100% 현장 직영 공사 내역
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            지앤지클린의 핵심 공사 내용 및 실제 작업 소개
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            우리가 실제로 책임 시공하는 세부 품목입니다. 터무니없는 부풀리기 없이 핵심적인 진단과 완벽한 정석 시공을 보장합니다.
          </p>
        </div>
        
        {/* Navigation Stack for categories */}
        <div className="flex flex-wrap gap-1.5 max-w-full xl:max-w-2xl justify-start xl:justify-end">
          {SHOWCASE_ITEMS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]"
                  : "bg-slate-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100"
              }`}
            >
              <span className="text-[10px] opacity-75">0{index + 1}</span>
              <span>{item.title.split(" & ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Dynamic Image Representation Column */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-slate-50 group">
            <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{activeShowcase.badge}</span>
            </div>
            
            <ShowcaseImage item={activeShowcase} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
            
            {/* Visual labels on bottom of image */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {activeShowcase.tags.map((tag, i) => (
                  <span key={i} className="bg-white/20 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-white border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="text-base sm:text-lg font-black tracking-tight">{activeShowcase.title}</h4>
            </div>
          </div>
          
          <p className="text-[11px] text-gray-400 mt-2 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>※ 위 시공 사진은 지앤지클린 팀의 전문 시공 현장을 그대로 묘사한 것입니다.</span>
          </p>
        </div>

        {/* Construction details column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-blue-600 block uppercase tracking-wider">GNG CLEAN REAL WORK DETAILS</span>
              <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600 shrink-0" />
                {activeShowcase.title}
              </h4>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-xl">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                {activeShowcase.description}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                지앤지클린이 약속하는 완벽 보장 솔루션
              </h5>
              
              <div className="space-y-2.5">
                {activeShowcase.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 bg-blue-50/30 p-3 rounded-lg border border-blue-50/50">
                    <span className="text-sm shrink-0 mt-0.5">⭐</span>
                    <p className="text-xs text-gray-700 font-bold leading-relaxed">{feat}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AS Guarantee & Action CTA row */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <div className="text-xs text-blue-600/90 font-medium bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span><strong>최종 시공 후 이상 증상 발생 시 확실한 A/S 무상 책임 보장</strong>으로 사후까지 완벽히 정비합니다.</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="https://open.kakao.com/o/sWmhpq8f"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FEE500] hover:bg-[#FEE500]/95 text-[#191919] font-black py-3 px-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span className="text-base sm:text-lg">💬</span>
                <span>카톡 실시간 가견적 문의</span>
              </a>
              <a 
                href="tel:010-2699-0484"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current shrink-0" />
                <span>유선 전화 상담하기</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
