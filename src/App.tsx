import React, { useState, useEffect } from "react";
import { 
  Droplet, 
  Wrench, 
  Flame, 
  RotateCw, 
  Check, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  MapPin, 
  Clock, 
  Smartphone, 
  AlertTriangle, 
  ChevronRight, 
  ThumbsUp, 
  Hammer, 
  ArrowUpRight 
} from "lucide-react";

import BeforeAfterSlider from "./components/BeforeAfterSlider";
import AIDiagnosis from "./components/AIDiagnosis";
import CustomerReviews from "./components/CustomerReviews";
import GngCleanBookingForm from "./components/GngCleanBookingForm";

interface ServiceCardProps {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  icon: React.ReactNode;
  tags: string[];
}

const HERO_SLIDES = [
  {
    id: "leak_detection",
    title: "누수탐지 & 누수공사",
    badge: "정밀 과학 탐지",
    image: "/assets/leak_detection.jpg",
    desc: "정밀 탐지 장비로 보이지 않는 물샘 지점을 완벽 포착하여 꼼꼼하게 공사합니다.",
  },
  {
    id: "sewer_jetting",
    title: "하수구막힘 & 고압세척",
    badge: "고성능 스케일링",
    image: "/assets/sewer_jetting.jpg",
    desc: "기름 슬러지와 고형 이물질로 가득한 배관 내부를 신설관 수준으로 청소합니다.",
  },
  {
    id: "sink_clog",
    title: "싱크대막힘 해결",
    badge: "악취 및 역류 타파",
    image: "/assets/sink_clog.jpg",
    desc: "주방의 고질적인 싱크대 막힘을 최신 기기 조합으로 완벽 탈탈 털어 뚫어 드립니다.",
  },
  {
    id: "faucet_replacement",
    title: "명품 수전교체",
    badge: "안심 시공 완료",
    image: "/assets/faucet_replacement.jpg",
    desc: "물이 새거나 뻑뻑한 수전을 친환경 국산 정품 수전으로 안전하고 이쁘게 교체합니다.",
  },
  {
    id: "bathroom_ceramics",
    title: "변기 & 세면대교체",
    badge: "위생 도기 시공",
    image: "/assets/bathroom_ceramics.jpg",
    desc: "흔들리고 낡은 위생 도기를 욕실 맞춤형 인테리어 고품질 도기로 완벽 시공합니다.",
  },
  {
    id: "frozen_thawing",
    title: "해빙 & 언수도녹임",
    badge: "동파 방지 긴급",
    image: "/assets/frozen_thawing.jpg",
    desc: "꽁꽁 얼어버린 냉/온수 수도관과 노출 배관을 고온 가압 스팀으로 안전하게 녹입니다.",
  },
];

const FALLBACK_HERO_IMAGES: Record<string, string> = {
  leak_detection: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800&h=600",
  sewer_jetting: "https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&q=80&w=800&h=600",
  sink_clog: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800&h=600",
  faucet_replacement: "https://images.unsplash.com/photo-1585131838846-a774557b322a?auto=format&fit=crop&q=80&w=800&h=600",
  bathroom_ceramics: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800&h=600",
  frozen_thawing: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=800&h=600",
};

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const slide = HERO_SLIDES[current];
  const [imgSrc, setImgSrc] = useState(slide.image);

  useEffect(() => {
    setImgSrc(slide.image);
  }, [slide.id, slide.image]);

  const handleImageError = () => {
    if (imgSrc !== FALLBACK_HERO_IMAGES[slide.id]) {
      setImgSrc(FALLBACK_HERO_IMAGES[slide.id]);
    }
  };

  return (
    <div 
      className="relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden shadow-md group border border-blue-50 bg-slate-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Zoom & Transition */}
      <img
        src={imgSrc}
        alt={slide.title}
        onError={handleImageError}
        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

      {/* Slide Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-blue-600/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
        <span>{slide.badge}</span>
      </div>

      {/* Floating Service Indicator */}
      <div className="absolute top-3 right-3 z-10 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
        {current + 1} / {HERO_SLIDES.length}
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-10 text-white space-y-1 text-left">
        <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-md text-white">
          {slide.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-200 line-clamp-2 drop-shadow-sm font-medium">
          {slide.desc}
        </p>
        
        {/* Navigation Indicator Dots */}
        <div className="flex items-center gap-1 pt-1">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current ? "w-5 bg-blue-500" : "w-1.5 bg-white/40 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Previous / Next Arrow Buttons on Hover */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/20 hover:bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm cursor-pointer text-xs"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/20 hover:bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm cursor-pointer text-xs"
        aria-label="Next slide"
      >
        &#10095;
      </button>
    </div>
  );
}

function TopInteractiveSliderFallback() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const slide = HERO_SLIDES[current];
  const [imgSrc, setImgSrc] = useState(slide.image);

  useEffect(() => {
    setImgSrc(slide.image);
  }, [slide.id, slide.image]);

  const handleImageError = () => {
    if (imgSrc !== FALLBACK_HERO_IMAGES[slide.id]) {
      setImgSrc(FALLBACK_HERO_IMAGES[slide.id]);
    }
  };

  return (
    <div 
      className="relative w-full bg-slate-900 overflow-hidden shadow-inner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background slide wrapper */}
      <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[440px]">
        {HERO_SLIDES.map((s, idx) => {
          const isSelected = idx === current;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isSelected ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={isSelected ? imgSrc : s.image}
                alt={s.title}
                onError={handleImageError}
                className="w-full h-full object-cover scale-105 transition-transform duration-[4500ms] ease-out"
                style={{ transform: isSelected ? "scale(1.0)" : "scale(1.08)" }}
                referrerPolicy="no-referrer"
              />
              {/* Premium dark gradient overlays for superb legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent lg:from-blue-950/90 lg:via-blue-950/50 lg:to-blue-900/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            </div>
          );
        })}

        {/* Decorative soft glass bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50/90 to-transparent z-20 pointer-events-none"></div>

        {/* Main Banner Content Area */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
            
            {/* Left Column: Brand & Active Service Highlights */}
            <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5">
              
              <div className="inline-flex items-center gap-1.5 bg-blue-500/25 border border-blue-400/30 px-3 py-1 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[10px] sm:text-xs font-bold text-blue-200 tracking-tight">지앤지클린 실제 긴급 시공 사례 리포트</span>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <span className="text-xs sm:text-sm font-extrabold text-blue-400 tracking-wider block uppercase">
                  누수부터 배관 막힘 해결까지 완벽 처리!
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-xl leading-tight">
                  지앤지클린 <span className="text-blue-400">생생 현장 화보</span>
                </h2>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-xl font-medium drop-shadow-md">
                고객님이 의뢰해주신 <span className="text-blue-300 font-bold">{slide.title}</span> 실제 시공 기록입니다. 첨단 정밀 탐지기와 고풍압 세척 장비를 투입하여 단 한 방에 완벽하게 뚫고 보수했습니다.
              </p>

              {/* Quick Dial Call Trigger & Kakao links */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="tel:010-2699-0484"
                  className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black px-4.5 py-3 sm:px-5.5 sm:py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 fill-current animate-bounce" />
                  <span>24시 직통전화: 010-2699-0484</span>
                </a>
                <a
                  href="https://open.kakao.com/o/sWmhpq8f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-black px-4.5 py-3 sm:px-5.5 sm:py-3.5 rounded-xl transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <span className="text-base">💬</span>
                  <span>카카오톡 1:1 빠른 문의</span>
                </a>
              </div>
            </div>

            {/* Right Column: Multi-tab interactive selector synchronised with the auto-slider (Hidden on mobile) */}
            <div className="hidden lg:col-span-5 lg:flex flex-col gap-2 bg-black/40 p-4.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <span className="text-white text-[11px] font-black tracking-wider uppercase opacity-75 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                현장 시공 카테고리 (자동 롤링 및 선택 가능)
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {HERO_SLIDES.map((item, idx) => {
                  const isActive = idx === current;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrent(idx)}
                      className={`flex items-center justify-between text-left px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-400 shadow-lg font-black translate-x-1"
                          : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                          isActive ? "bg-white text-blue-600 animate-pulse" : "bg-white/10 text-white"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm block">{item.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? "text-white translate-x-0.5" : "text-gray-400"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Indicator pills for mobile */}
        <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 lg:hidden z-30">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current ? "w-6 bg-blue-500" : "w-1.5 bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

function TopMainBanner() {
  const [imgSrc, setImgSrc] = useState("/assets/gngclean_main.png");
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (imgSrc === "/assets/gngclean_main.png") {
      setImgSrc("/gngclean_main.png");
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // If the uploaded gngclean_main.png cannot be loaded, fallback to our beautiful interactive sliding presentation
    return <TopInteractiveSliderFallback />;
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 via-white to-slate-50 pt-3 pb-5 sm:pt-4 sm:pb-6 border-b border-blue-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle indicator tag */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-black text-blue-700 tracking-tight">지앤지클린 공식 메인 비주얼 배너</span>
          </div>
          <div className="text-[9px] sm:text-[11px] text-gray-500 font-bold flex items-center gap-1">
            <span>📞 24시간 긴급 접수 대기 중</span>
          </div>
        </div>

        {/* Clickable Banner Image Card */}
        <a 
          href="tel:010-2699-0484"
          className="block group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/40 hover:border-blue-400 bg-white"
        >
          {/* Main Visual Banner with graceful zoom transition */}
          <img
            src={imgSrc}
            alt="지앤지클린 누수탐지 하수구 배관 설비 전문"
            onError={handleImageError}
            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          
          {/* Elegant dark/blue glass hover interactive overlay */}
          <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-blue-600/90 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Phone className="w-4 h-4 fill-current animate-bounce" />
              <span>클릭하시면 24시 직통 상담 전화로 바로 연결됩니다!</span>
            </div>
          </div>

          {/* Floating animated callout badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-red-600 hover:bg-red-500 text-white text-[9px] sm:text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>24시 빠른 전화연결</span>
          </div>
        </a>

      </div>
    </div>
  );
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState("home");
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Monitor scroll to show mobile/desktop sticky call bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-gray-800 selection:bg-blue-100 selection:text-blue-900 antialiased">
      
      {/* 1. Header (상단 네비게이션) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-50/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current animate-bounce" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black text-blue-900 tracking-tight block">지앤지클린</span>
              <span className="text-[9px] sm:text-[10px] text-blue-500 font-extrabold tracking-wider block -mt-1">N_LEAK & DRAIN SOLUTION</span>
            </div>
          </div>

          {/* Navigation Links - Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("services-section")} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              주요 서비스
            </button>
            <button onClick={() => scrollToSection("before-after-section")} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              시공 사례
            </button>
            <button onClick={() => scrollToSection("trust-section")} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              차별화 장비
            </button>
            <button onClick={() => scrollToSection("reviews-section")} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              고객 실제 후기
            </button>
            <button onClick={() => scrollToSection("ai-diagnosis")} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 text-blue-600">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
              AI 배관 진단봇
            </button>
          </nav>

          {/* Quick CTA Button */}
          <div className="flex items-center gap-2">
            <a 
              href="https://open.kakao.com/o/sWmhpq8f"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="text-sm">💬</span>
              <span className="hidden md:inline">카톡 상담</span>
            </a>
            <a 
              href="tel:010-2699-0484" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span className="hidden sm:inline">24시간 긴급전화 : </span>
              <span className="font-extrabold">010-2699-0484</span>
            </a>
          </div>
        </div>
      </header>

      {/* Dynamic 24H Main Slider Banner of Actual Construction Images */}
      <TopMainBanner />

      {/* 2. Hero Section (메인 상단 화면) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-blue-100/30 to-white pt-8 pb-16 md:py-24" id="home">
        {/* Background visual graphics */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-300/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Copy Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/50 px-3.5 py-1.5 rounded-full shadow-inner animate-fade-in mx-auto lg:mx-0">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-bold text-blue-700 tracking-tight">서울/경기/인천 전 지역 30분 이내 긴급 출동 가능</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.15] sm:leading-[1.12]">
                <span className="text-blue-600 block sm:inline">물 새고 꽉 막힌 배관,</span>
                <br className="hidden sm:inline" />
                마음 졸이지 마세요.
                <br />
                <span className="relative inline-block mt-1">
                  지앤지클린이 확실히 해결합니다!
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-200 -z-10 opacity-60"></span>
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                누수 원인을 못 찾으면 청구비 <strong>0원</strong>! <br />
                하수구 못 뚫으면 출장비 <strong>0원</strong>! <br />
                바가지 없는 투명한 견적과 최첨단 정밀 내시경 장비로 배관 파손을 최소화하여 정직하게 원인 지점만 찾아 고칩니다.
              </p>

              {/* Badges/Trustpoints in Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
                <div className="bg-white p-3 rounded-xl border border-blue-50 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-lg">🛡️</span>
                  <span className="text-xs font-bold text-gray-900 mt-1">철저한 A/S 보장</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-50 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-lg">🔬</span>
                  <span className="text-xs font-bold text-gray-900 mt-1">첨단 배관장비</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-50 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-lg">💰</span>
                  <span className="text-xs font-bold text-gray-900 mt-1">비결정 시 무료</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-50 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-lg">⚡</span>
                  <span className="text-xs font-bold text-gray-900 mt-1">당일 긴급출동</span>
                </div>
              </div>

              {/* Massive CTA Call Trigger */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-4 justify-center lg:justify-start">
                <a
                  href="tel:010-2699-0484"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold px-6 py-4 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all text-center flex items-center justify-center gap-2.5 active:scale-95 text-sm sm:text-base"
                >
                  <Phone className="w-4.5 h-4.5 fill-current shrink-0" />
                  <span>전화 상담: 010-2699-0484</span>
                </a>
                <a
                  href="https://open.kakao.com/o/sWmhpq8f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-extrabold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2.5 active:scale-95 text-sm sm:text-base"
                >
                  <span className="text-lg">💬</span>
                  <span>실시간 카톡상담 문의</span>
                </a>
                <button
                  onClick={() => scrollToSection("ai-diagnosis")}
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-extrabold px-6 py-4 rounded-2xl shadow-md transition-all text-center flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse shrink-0" />
                  <span>AI 실시간 무료 견적 받기</span>
                </button>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-400">
                ※ 전화 연결 시 친절하고 전문적인 가견적 상담이 1분 만에 진행됩니다. 
                부위 사진을 찍어 문자로 주시면 더욱 정밀한 답변이 가능합니다.
              </p>
            </div>

            {/* Graphic Interactive Container Column */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 animate-fade-in">
              <div className="relative mx-auto max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 p-5 space-y-5">
                
                {/* Visual Plumber Badges / Interactive element */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                    👨‍🔧
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">지앤지클린 실제 시공 사례</h3>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span>실제 의뢰받아 직접 작업 완료한 생생 현장</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Auto-playing Showcase Slider of Uploaded Images */}
                <HeroSlider />

                {/* Simulated quick diagnostic check list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider text-left">이런 증상으로 고통받고 계신가요?</h4>
                  <div className="space-y-1.5 text-left">
                    {[
                      { text: "아랫집 천장에서 물방울이 떨어지거나 젖어 들 때", section: "services-section" },
                      { text: "부엌 싱크대 배수구 물이 안 내려가고 역류할 때", section: "services-section" },
                      { text: "화장실 변기 또는 하수구 배관이 꽉 막혔을 때", section: "services-section" },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => scrollToSection(item.section)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-gray-100/50 hover:border-blue-200 transition-all cursor-pointer text-xs group"
                      >
                        <div className="flex items-center gap-2 text-gray-600 group-hover:text-blue-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="font-semibold">{item.text}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center space-y-2">
                  <p className="text-xs text-gray-700 font-semibold">
                    고민하지 말고 바로 진단받아보세요!
                  </p>
                  <button 
                    onClick={() => scrollToSection("ai-diagnosis")}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>실시간 1초 무료 진단 시작하기</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Services Section (서비스 안내) */}
      <section className="py-16 md:py-24 bg-blue-50/30 border-y border-blue-50/50" id="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              지앤지클린 전문 분야
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              신속하고 완벽한 지앤지클린의 대표 설비 서비스
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
              정밀 탐지부터 정비, 시공 마감까지 하청을 주지 않고 숙련된 베테랑 본사 팀장이 직접 출동하여 정성스럽게 관리해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Service 1 */}
            <ServiceCard 
              id="leak"
              title="누수탐지 & 누수공사"
              subtitle="정확한 물 샘 위치 포착 및 긴급 보수"
              desc="수도 배관에서 물이 새어 발생되는 곰팡이와 아랫집 침수 피해를 가스 탐지기와 청음식 정밀 장비로 진단하여, 최소한의 굴착 파쇄로 원인 부위를 찾아 깔끔하게 복구해 드립니다."
              badge="정밀 진단 특화"
              icon={<Droplet className="w-6 h-6 text-white" />}
              tags={["청음식 탐지", "미세 누수 진단", "보험 대행 서류"]}
            />

            {/* Service 2 */}
            <ServiceCard 
              id="high-pressure"
              title="하수구막힘 & 배관고압세척"
              subtitle="꽉 막힌 배관을 새것처럼 완벽 배관 청소"
              desc="스프링기 작업으로도 자주 뚫리는 하수구라면 배관 내부에 기름 덩어리가 고착된 것입니다. 강력 초고압 물줄기 분사를 통한 내부 스케일링으로 배관 벽면까지 싹 털어냅니다."
              badge="자주 막히는 배관 강추"
              icon={<Wrench className="w-6 h-6 text-white animate-spin" style={{ animationDuration: "12s" }} />}
              tags={["초고압 세척", "기름 슬러지 타파", "배관 내시경"]}
            />

            {/* Service 3 */}
            <ServiceCard 
              id="clog"
              title="싱크대막힘 & 변기막힘"
              subtitle="답답하게 막힌 배관 시원하게 뚫음"
              desc="싱크대 홈통 역류부터 머리카락, 음식물, 장난감 등의 투입으로 꽉 막힌 변기와 욕실 배수구까지 맞춤 석션 흡입 장비와 플렉스 샤프트를 동원해 신속하게 통수해 드립니다."
              badge="당일 30분 출동"
              icon={<RotateCw className="w-6 h-6 text-white" />}
              tags={["싱크대 역류 해결", "변기 탈거 최소화", "이물질 흡입"]}
            />

            {/* Service 4 */}
            <ServiceCard 
              id="replacement"
              title="수전 & 양변기 & 세면대 교체"
              subtitle="낡은 수도꼭지 및 욕실 도기류 신속 교체"
              desc="물방울이 계속 새는 싱크대 수도꼭지, 샤워 수전, 녹슨 욕실 세면대 및 금 가고 노후된 양변기를 최신형 국산 정품 도기로 튼튼하고 깔끔하게 시공 및 수거 교체해 드립니다."
              badge="정품 보장 / 폐기물 처리"
              icon={<Check className="w-6 h-6 text-white" />}
              tags={["주방/샤워기 수전", "세면대/변기 교체", "꼼꼼한 실리콘 마감"]}
            />

            {/* Service 5 */}
            <ServiceCard 
              id="thawing"
              title="해빙 & 언수도녹임"
              subtitle="얼어붙어 안 나오는 배관 안전 해빙"
              desc="겨울철 한파로 꽁꽁 얼어버린 냉수/온수 배관과 노출 수도 배관을 고온의 고압 강력 스팀 세척 장비로 수도관 손상 없이 안전하고 안전하게 스팀 세척하여 녹여 드립니다."
              badge="겨울철 동파 긴급"
              icon={<Flame className="w-6 h-6 text-white" />}
              tags={["보일러 배관 해빙", "안전 스팀 해빙", "동파 방지 테이핑"]}
            />

            {/* Service 6 */}
            <ServiceCard 
              id="others"
              title="기타 모든 설비공사"
              subtitle="배관 신설, 수리 등 종합 설비 해결사"
              desc="화장실 욕실 인테리어 보수 공사, 계량기 교체, 펌프 및 가압 펌프 설치, 베란다 배수관 공사, 트랩 설치 등 배관과 관련된 까다로운 모든 기술 작업을 척척 처리해 드립니다."
              badge="종합 배관 설비사"
              icon={<Hammer className="w-6 h-6 text-white" />}
              tags={["가압펌프 시공", "악취 차단 트랩", "종합 배관 신설"]}
            />

          </div>

          {/* Prompting contact */}
          <div className="mt-12 bg-white rounded-2xl border border-blue-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold text-gray-900">
                위 서비스 외에 어떤 까다로운 설비 공사도 해결해 드립니다
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                상태가 애매하거나 비용이 궁금하시다면 사진을 첨부해 카톡이나 문자를 주시면 무상으로 가견적을 진단해 드립니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://open.kakao.com/o/sWmhpq8f"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-extrabold px-6 py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <span>💬</span>
                <span>실시간 카톡상담 문의</span>
              </a>
              <a
                href="tel:010-2699-0484"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>전화 상담 : 010-2699-0484</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Trust Factors Section (신뢰 요소 3가지 중 2개는 컴포넌트, 1개는 장비 소개) */}
      <section className="py-16 md:py-24 bg-white" id="trust-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              지앤지클린 3대 신뢰 안심 보장
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
              고객님이 지앤지클린을 믿고 찾아주시는 결정적 이유
            </h2>
          </div>

          {/* Trust Factor 1: Before / After Image Section */}
          <BeforeAfterSlider />

          {/* Trust Factor 2: Advanced Equipment Display */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
            {/* Visual background accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Text Description Column */}
              <div className="lg:col-span-5 space-y-5">
                <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  최소 파쇄 공법 / 첨단 장비 과학 수리
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  "무조건 다 파헤치지 않습니다." <br />
                  <span className="text-blue-400">최소한만 깨서 완벽하게 고칩니다</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                  경험과 추측에만 의존하는 주먹구구식 공사는 화장실 타일과 바닥을 크게 파쇄하여 엄청난 비용과 소음, 긴 복구공사 시간을 낳습니다. <br /><br />
                  지앤지클린은 고가의 수입산 특수 내시경 카메라와 미세 청음 탐지기, 열화상 감지기를 동원하여 물샘 지점과 하수구 막힘 근원 위치를 <strong>오차 범위 센티미터(cm) 수준으로 색출</strong>해 내어 딱 그 지점만 얌전하게 공사하여 고객님의 주거 자산 가치를 지킵니다.
                </p>
                <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-900/50 rounded-xl border border-blue-500/30 text-blue-300">
                    🛡️
                  </div>
                  <span className="text-xs text-blue-300 font-bold">
                    과도한 철거 요금 및 시공비 거품을 완벽하게 예방하는 과학 시공
                  </span>
                </div>
              </div>

              {/* Equipment Grid Column */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Equipment Card 1 */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all duration-200">
                  <div className="w-10 h-10 bg-blue-600/30 text-blue-400 rounded-xl flex items-center justify-center text-lg font-bold">
                    📹
                  </div>
                  <h4 className="text-sm font-bold text-white mt-3">초고화질 배관 내시경</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    배관 내부에 깊숙이 침투시켜 내부 기름막과 파손 유무를 초고화질 스크린으로 모니터링하여 원인과 시각자료를 고객께 직접 투명하게 보여 드립니다.
                  </p>
                </div>

                {/* Equipment Card 2 */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all duration-200">
                  <div className="w-10 h-10 bg-blue-600/30 text-blue-400 rounded-xl flex items-center justify-center text-lg font-bold">
                    🌡️
                  </div>
                  <h4 className="text-sm font-bold text-white mt-3">초정밀 열화상 카메라</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    바닥 타일이나 벽면에 매립된 온수 코일 배관의 온도 차이를 정밀 추적하여, 굴착 파쇄 없이도 미세 누수가 의심되는 위치를 비침습적으로 포착해 냅니다.
                  </p>
                </div>

                {/* Equipment Card 3 */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all duration-200">
                  <div className="w-10 h-10 bg-blue-600/30 text-blue-400 rounded-xl flex items-center justify-center text-lg font-bold">
                    🎧
                  </div>
                  <h4 className="text-sm font-bold text-white mt-3">다기능 청음식 누수 탐지</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    관로 내부에서 발생하는 아주 가느다란 고주파 수도 물샘 파열음 음파를 증폭하여 시공자가 정확한 굴착 포인트를 지정할 수 있게 해 주는 고주파 사운드 정밀 기기입니다.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Trust Factor 3: Customer Real Reviews (고객 실제 후기) */}
          <CustomerReviews />

        </div>
      </section>

      {/* 5. Interactive Section: AI Diagnosis (AI 실시간 배관 진단) */}
      <section className="py-16 md:py-24 bg-slate-100/50 border-t border-slate-200/50" id="diagnosis-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIDiagnosis />
        </div>
      </section>

      {/* 7. Contact Section (하단 푸터 및 문의) */}
      <section className="bg-blue-900 text-white py-16" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text contact highlight */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="bg-blue-800 text-blue-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                365일 24시간 연중무휴 무료 견적 상담
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
                당일 해결이 다급하시거나 <br className="hidden sm:inline" />
                정확한 배관 공사 비용이 궁금하십니까?
              </h2>
              <p className="text-sm text-blue-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
                수십 년 배관 경력의 숙련 베테랑 팀장이 고객님의 다급한 사정을 최우선으로 여겨 대기하고 있습니다. 
                전화 한 통이면 무상 상담 및 꼼꼼한 가견적, 즉시 방문 예약까지 일사천리로 친절히 모시겠습니다.
              </p>

              {/* High visibility contact buttons */}
              <div className="bg-blue-800/60 p-6 rounded-2xl border border-blue-700 max-w-lg mx-auto lg:mx-0 space-y-4">
                <div>
                  <p className="text-xs text-blue-300 font-bold">☎️ 가장 빠르고 원활한 긴급 상담 및 가견적</p>
                  <a 
                    href="tel:010-2699-0484" 
                    className="text-2xl sm:text-3xl font-black text-white hover:text-sky-300 transition-colors block mt-1.5 flex items-center justify-center lg:justify-start gap-2.5"
                  >
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-sky-300 shrink-0" />
                    <span>010-2699-0484</span>
                  </a>
                </div>
                
                <div className="border-t border-blue-700/60 pt-3">
                  <p className="text-xs text-blue-300 font-bold mb-2">💬 실시간 카카오톡 오픈채팅 비대면 가견적</p>
                  <a 
                    href="https://open.kakao.com/o/sWmhpq8f" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-extrabold py-3 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <span>💬</span>
                    <span>지앤지클린 실시간 카톡상담 문의</span>
                  </a>
                </div>

                <p className="text-xs text-blue-200/80 leading-relaxed">
                  ※ 증상 부위나 누수 흔적이 담긴 <strong>사진/동영상</strong>을 카톡이나 문자로 보내주시면 더욱 세심하고 신속한 견적 산출이 가능합니다.
                </p>
              </div>
            </div>

            {/* Right Simple Contact Consultation Box with Google Sheets & Mail Apps Script Integration */}
            <div className="lg:col-span-5">
              <GngCleanBookingForm />
            </div>

          </div>
        </div>
      </section>

      {/* 8. Sticky Mobile/Desktop CTA Call bar */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-2xl p-3 z-40 sm:p-4 flex items-center justify-between max-w-md mx-auto rounded-t-2xl shadow-blue-900/10">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">👨‍🔧</span>
            <div>
              <span className="text-[9px] sm:text-[10px] text-gray-400 block font-bold leading-none mb-0.5">지앤지클린 무상상담</span>
              <span className="text-[11px] sm:text-xs font-black text-gray-900 block leading-none">신속한 당일 해결</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <a
              href="https://open.kakao.com/o/sWmhpq8f"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] text-xs font-extrabold px-3 py-2.5 rounded-xl flex items-center gap-1 shadow-md active:scale-95 transition-all"
            >
              <span>💬</span>
              <span>카톡상담</span>
            </a>
            <a
              href="tel:010-2699-0484"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3 py-2.5 rounded-xl flex items-center gap-1 shadow-md shadow-blue-100 transition-all animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <Phone className="w-3 h-3 fill-current" />
              <span>전화상담</span>
            </a>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="bg-slate-900 text-gray-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-extrabold text-gray-300">주식회사 지앤지클린</p>
            <p>대표자: 박중현 | 사업자등록번호: 466-86-02876</p>
            <p>대표전화: 010-2699-0484 (365일 24시간 긴급 접수 대기)</p>
            <p>사업분야: 누수탐지, 보수공사, 하수구 고압세척, 싱크대/변기 뚫음, 수전교체, 언수도 녹임, 동파 해빙</p>
          </div>
          <div className="text-center sm:text-right text-[10px] text-gray-500">
            <p>© 2026 주식회사 지앤지클린 All Rights Reserved.</p>
            <p className="mt-1">본 사이트는 모바일 및 PC 반응형 레이아웃에 최적화되어 있습니다.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

function ServiceCard({ id, title, subtitle, desc, badge, icon, tags }: ServiceCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
      id={`service-card-${id}`}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
            {icon}
          </div>
          <span className="bg-blue-50 text-blue-600 font-extrabold px-2.5 py-1 rounded-full text-[10px] tracking-tight">
            {badge}
          </span>
        </div>

        {/* Titles */}
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none">{title}</h3>
          <span className="text-xs text-blue-600 font-bold block mt-1.5">{subtitle}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          {desc}
        </p>
      </div>

      {/* Tags and Inquiry Button */}
      <div className="pt-4 mt-4 border-t border-gray-50 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span key={i} className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-100/50">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <a 
            href="tel:010-2699-0484"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 px-1 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-all border border-blue-100/50"
          >
            <Phone className="w-3 h-3 fill-current" />
            <span>전화 문의</span>
          </a>
          <a 
            href="https://open.kakao.com/o/sWmhpq8f"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-extrabold py-2 px-1 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-all"
          >
            <span>💬</span>
            <span>카톡 문의</span>
          </a>
        </div>
      </div>
    </div>
  );
}
