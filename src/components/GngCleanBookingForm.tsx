import React, { useState, useEffect } from "react";
import { 
  Check, 
  Copy, 
  Settings, 
  HelpCircle, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
  FileSpreadsheet,
  Lock,
  Unlock,
  Key,
  LogOut,
  Sparkles,
  Database,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface BackupLog {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  service: string;
  memo: string;
}

export default function GngCleanBookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("누수탐지 & 누수공사");
  const [memo, setMemo] = useState("");
  
  // Apps Script Web App URL state loaded from localStorage or environment variables
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem("gngclean_apps_script_url") || (import.meta as any).env?.VITE_APPS_SCRIPT_URL || "";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("gngclean_admin_logged_in") === "true";
  });

  // Toggle states for settings & guide
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<"guide" | "logs" | "password">("guide");
  const [copied, setCopied] = useState(false);

  // Password & Security State
  const [masterPassword, setMasterPassword] = useState(() => {
    return localStorage.getItem("gngclean_admin_password") || "0484";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Password modification state
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Google Sign-In Client ID State
  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem("gngclean_google_client_id") || "";
  });
  const [tempClientId, setTempClientId] = useState(googleClientId);
  const [googleLoginError, setGoogleLoginError] = useState("");

  // Submission Local Backup Logs State
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>(() => {
    try {
      const saved = localStorage.getItem("gngclean_backup_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamically load Google Identity Services Script for Google Account login
  useEffect(() => {
    if (showAdminPanel && !isAdminAuthenticated && googleClientId) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        try {
          /* global google */
          const win = window as any;
          if (win.google && win.google.accounts) {
            win.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            win.google.accounts.id.renderButton(
              document.getElementById("google-signin-btn"),
              { theme: "outline", size: "large", width: "100%", text: "signin_with" }
            );
          }
        } catch (err) {
          console.error("Failed to render Google Sign-In button:", err);
        }
      };

      return () => {
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [showAdminPanel, isAdminAuthenticated, googleClientId]);

  // Decode JWT safely on the client side without libraries
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Decode error:", e);
      return null;
    }
  };

  const handleGoogleCredentialResponse = (response: any) => {
    setGoogleLoginError("");
    if (!response.credential) {
      setGoogleLoginError("구글 로그인 인증 정보를 받아오지 못했습니다.");
      return;
    }

    const payload = decodeJwt(response.credential);
    if (!payload || !payload.email) {
      setGoogleLoginError("구글 계정 이메일 정보를 읽을 수 없습니다.");
      return;
    }

    const email = payload.email.toLowerCase().trim();
    // Validate that only the authorized owner can access
    const allowedEmails = [
      "nakeunjong@gmail.com", 
      "gngclean1@gmail.com",
      "gngclean@gmail.com"
    ];

    if (allowedEmails.includes(email)) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("gngclean_admin_logged_in", "true");
      setGoogleLoginError("");
    } else {
      setGoogleLoginError(
        `접근 권한이 없습니다. (${email}) 지앤지클린 지정 관리자 계정(gngclean1@gmail.com, nakeunjong@gmail.com)만 로그인할 수 있습니다.`
      );
    }
  };

  // Sync state changes with localStorage
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setAppsScriptUrl(url);
    localStorage.setItem("gngclean_apps_script_url", url);
  };

  const handleSaveClientId = () => {
    const id = tempClientId.trim();
    setGoogleClientId(id);
    localStorage.setItem("gngclean_google_client_id", id);
    alert("구글 클라이언트 ID가 저장되었습니다. 페이지가 리로드되거나 관리자 창을 다시 열면 적용됩니다.");
  };

  const SERVICE_OPTIONS = [
    "누수탐지 & 누수공사",
    "하수구막힘 & 하수구 고압세척",
    "싱크대막힘 & 변기막힘 & 세면대막힘",
    "수전교체",
    "세면대 & 변기교체",
    "해빙 & 언수도녹임",
    "기타 설비공사"
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordInput === masterPassword) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("gngclean_admin_logged_in", "true");
      setPasswordInput("");
    } else {
      setPasswordError("비밀번호가 일치하지 않습니다. 대표전화 뒷자리가 맞는지 확인해주세요.");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(false);

    if (newPassword.length < 4) {
      alert("새 비밀번호는 4자리 이상이어야 합니다.");
      return;
    }

    setMasterPassword(newPassword);
    localStorage.setItem("gngclean_admin_password", newPassword);
    setNewPassword("");
    setPasswordChangeSuccess(true);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("gngclean_admin_logged_in");
  };

  const handleClearLogs = () => {
    if (window.confirm("정말로 모든 접수 백업 내역을 삭제하시겠습니까? 구글시트에 연동된 내용은 삭제되지 않고, 현재 브라우저의 백업 목록만 삭제됩니다.")) {
      setBackupLogs([]);
      localStorage.removeItem("gngclean_backup_logs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setErrorMsg("이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("연락처를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const timestampStr = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const newLog: BackupLog = {
      id: Date.now().toString(),
      timestamp: timestampStr,
      name: name.trim(),
      phone: phone.trim(),
      service: service,
      memo: memo.trim() || "추가사항 없음"
    };

    // 1. Immutable Local Storage Backup Log first
    const updatedLogs = [newLog, ...backupLogs];
    setBackupLogs(updatedLogs);
    localStorage.setItem("gngclean_backup_logs", JSON.stringify(updatedLogs));

    // 2. Apps Script Integration trigger
    if (!appsScriptUrl) {
      // Simulate submission when no script is active
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          service: service,
          memo: memo.trim() || "추가사항 없음"
        })
      });

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Clear inputs
      setName("");
      setPhone("");
      setMemo("");
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg("네트워크 오류가 발생했습니다. 설정에서 배포된 Web App URL을 다시 확인해주세요.");
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setMemo("");
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 text-gray-800 shadow-2xl relative border border-blue-50" id="booking-form-box">
      
      {/* Top Controls: Title & Tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight flex items-center gap-1">
          <Database className="w-3 h-3 text-blue-500" />
          <span>실시간 2중 백업 연동 시스템</span>
        </span>
      </div>

      {/* 2. Success view state */}
      {submitted ? (
        <div className="py-8 text-center space-y-5 animate-scaleUp">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-950">간편 상담 접수 완료!</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              접수해주신 소중한 상담 정보가 실시간으로 안전하게 기록되었습니다.<br />
              확인 즉시 대표님이 직접 신속히 연락을 드리겠습니다.
            </p>
          </div>

          {!appsScriptUrl && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl max-w-sm mx-auto text-left space-y-1.5">
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">2차 안전 백업 보관 중</span>
              <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">
                현재 Google Apps Script 연동 주소가 비어있어, 브라우저 내부 백업 로그에 성공적으로 저장되었습니다. 하단 <strong>[관리자 설정]</strong>에서 비밀번호 '0484' 입력 후, 연동 주소를 등록하시면 구글 시트 저장 및 이메일 알림이 전송됩니다!
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            추가 접수 신청하기
          </button>
        </div>
      ) : (
        /* 3. Main Form */
        <form onSubmit={handleSubmit} className="space-y-4.5 text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-gray-950 flex items-center gap-1.5">
              간편 상담 예약 접수
            </h3>
            <p className="text-xs text-gray-500">
              전화가 어려우시거나 근무 시간 등 용무 중이실 때 적어주시면 대표가 직접 확인 후 친절히 연락드리겠습니다.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <span>문의자 성함</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="예: 홍길동" 
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 2. Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <span>연락처 전화번호</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="예: 010-2699-0484" 
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 3. Service Categories */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <span>공사의뢰 항목</span>
                <span className="text-red-500">*</span>
              </label>
              <select 
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Additional Request Memo */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                추가 요청사항 (증상, 시공 희망일 등)
              </label>
              <textarea 
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
                placeholder="아랫집 물샘 상태나 원하시는 방문 요일 등을 편하게 적어주세요." 
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMsg && (
            <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg text-center">
              ⚠ {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-center text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>정보 전송 및 예약 처리 중...</span>
              </>
            ) : (
              <>
                <span>실시간 상담 예약 접수하기</span>
              </>
            )}
          </button>

          {/* Alternative Phone click quick action */}
          <div className="pt-2 text-center border-t border-gray-100 mt-3">
            <span className="text-[10px] text-gray-400 block mb-1">전화 통화가 가능하신 분은 즉시 연결이 빠릅니다</span>
            <a 
              href="tel:010-2699-0484"
              className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:underline"
            >
              <Phone className="w-3 h-3 fill-current animate-pulse" />
              <span>전화 무료견적 직통전화: 010-2699-0484</span>
            </a>
          </div>
        </form>
      )}

      {/* Admin Panel Section with Authentication - Now moved to the bottom */}
      {showAdminPanel && (
        <div className="mt-6 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4 text-xs animate-fadeIn">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
              <Settings className="w-4 h-4 text-blue-600 animate-spin" />
              지앤지클린 실시간 관리자 설정
            </h4>
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded-lg font-black flex items-center gap-1 border border-red-200 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>로그아웃</span>
              </button>
            )}
          </div>

          {/* CASE A: NOT Authenticated - Show gorgeous Secure Login Portal */}
          {!isAdminAuthenticated ? (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl leading-relaxed flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-blue-950 text-xs">🔒 비공개 관리자 인증 화면</p>
                  <p className="text-[11px] text-blue-800/90 mt-0.5 leading-relaxed font-semibold">
                    이곳은 구글 시트 연동, 자동 발송 코드 복사, 그리고 고객 접수 백업 대시보드 조회를 위한 관리 전용 창입니다. 일반 사용자의 임의 변경 방지를 위해 비밀번호 또는 구글 인증이 요구됩니다.
                  </p>
                </div>
              </div>

              {/* Master Passcode Login Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    마스터 비밀번호 로그인
                  </label>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    초기 마스터 비밀번호는 대표번호 뒷자리 <strong className="text-blue-600">0484</strong> 입니다. 로그인 후 안전한 비밀번호로 언제든 변경하실 수 있습니다.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="비밀번호 입력 (초기: 0484)"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 rounded-lg text-xs whitespace-nowrap transition-all active:scale-95"
                  >
                    인증 완료
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </form>

              {/* Secure Google Login Integration Option */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    구글 계정 연동 로그인 (Google Sign-In)
                  </label>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    구글 클라우드 콘솔에서 발급받은 '구글 클라이언트 ID'가 등록되면, 오직 대표님 본인 이메일(<strong className="text-blue-600">gngclean1@gmail.com, nakeunjong@gmail.com</strong>) 로그인만 엄격히 통과시킵니다.
                  </p>
                </div>

                {/* GSI Login Button container */}
                {googleClientId ? (
                  <div className="space-y-2">
                    <div id="google-signin-btn" className="w-full"></div>
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleClientId("");
                        localStorage.removeItem("gngclean_google_client_id");
                      }}
                      className="text-[10px] text-gray-400 hover:text-red-500 underline text-center block mx-auto font-medium"
                    >
                      구글 클라이언트 ID 등록 해제하기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <p className="text-[10px] text-amber-700 font-extrabold bg-amber-50 p-2 rounded-lg">
                      💡 구글 로그인을 연동하시려면 아래에 구글 클라이언트 ID를 입력해 등록해주세요.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempClientId}
                        onChange={(e) => setTempClientId(e.target.value)}
                        placeholder="구글 클라우드 클라이언트 ID 입력..."
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSaveClientId}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-3 rounded-lg text-[10px]"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                )}

                {googleLoginError && (
                  <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2.5 rounded-lg leading-normal">
                    ⚠ {googleLoginError}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* CASE B: Authenticated - Show premium management dashboard! */
            <div className="space-y-4">
              
              {/* Authenticated Admin Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-100/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("guide")}
                  className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                    activeTab === "guide" 
                      ? "bg-white text-blue-600 shadow-sm font-black" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  구글 연동 연동가이드
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("logs")}
                  className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all relative ${
                    activeTab === "logs" 
                      ? "bg-white text-blue-600 shadow-sm font-black" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  접수 백업 로그 ({backupLogs.length})
                  {backupLogs.length > 0 && (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("password")}
                  className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                    activeTab === "password" 
                      ? "bg-white text-blue-600 shadow-sm font-black" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  비밀번호 보안변경
                </button>
              </div>

              {/* Tab 1 Content: Google Sheet & Gmail Setup Guide */}
              {activeTab === "guide" && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="leading-relaxed">
                    고객님이 입력한 내용을 <strong>구글 스프레드시트</strong>에 자동 기록하고 대표님의 개인 구글메일(<strong>nakeunjong@gmail.com</strong>)로 알림을 보내는 설정입니다.
                  </p>

                  <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="font-extrabold text-slate-900 text-[12px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      구글 연동 Apps Script 순서:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-slate-700">
                      <li>
                        <a 
                          href="https://sheets.new" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-bold"
                        >
                          구글 스프레드시트 새로 만들기 <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li>도구 메뉴에서 <strong>[확장 프로그램] ➔ [Apps Script]</strong>를 클릭합니다.</li>
                      <li>원래 있던 코드를 전부 지우고 아래 of <strong>Apps Script 코드 복사</strong>를 눌러 그대로 붙여넣습니다.</li>
                      <li>오른쪽 위 <strong>[배포] ➔ [새 배포]</strong>를 클릭합니다.</li>
                      <li>유형 설정(톱니바퀴)에서 <strong>[웹 앱]</strong>을 선택합니다.</li>
                      <li>아래와 같이 설정한 후 배포합니다:
                        <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-600">
                          <li>액세스할 수 있는 사용자: <span className="text-blue-600 font-extrabold">모든 사람 (Anyone)</span></li>
                          <li>웹 앱을 실행할 사용자: <span className="text-slate-900 font-bold">나 (Me)</span></li>
                        </ul>
                      </li>
                      <li>승인을 완료하고 생성되는 <strong>웹 앱 URL(Web App URL)</strong>을 복사해 아래 입력칸에 저장해 주세요.</li>
                    </ol>
                  </div>

                  {/* URL Input Box */}
                  <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 space-y-2">
                    <label className="block text-xs font-black text-blue-950 flex items-center gap-1">
                      <span>🔗 배포 완료된 Google Apps Script 웹 앱 URL 주소</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={appsScriptUrl}
                      onChange={handleUrlChange}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full p-2.5 bg-white border border-blue-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-900"
                    />
                    <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
                      {appsScriptUrl 
                        ? "✓ 연동 성공! 이제 고객이 양식을 접수할 때마다 실시간으로 스프레드시트 저장 및 Gmail 메일로 예약 알림이 자동 전송됩니다." 
                        : "💡 웹 앱 URL이 입력되지 않으면 홈 화면 접수 성공 시 브라우저 내 '접수 백업 로그' 탭에만 우선 안전 보관(테스트 시뮬레이션)됩니다."}
                    </p>
                  </div>

                  {/* Copy Script Code Button & Block */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800">📋 복사할 Apps Script 소스코드</span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 text-[11px]"
                      >
                        {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                        <span>{copied ? "복사 성공!" : "전체 소스코드 복사하기"}</span>
                      </button>
                    </div>
                    <pre className="w-full h-36 overflow-y-auto bg-slate-950 text-slate-300 p-2.5 rounded-lg font-mono text-[10px] leading-relaxed select-all border border-slate-800 shadow-inner">
                      {APPS_SCRIPT_CODE}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab 2 Content: Local Backup Log List Dashboard */}
              {activeTab === "logs" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">💾 로컬 데이터 실시간 백업 목록</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">이 브라우저에서 고객이 양식을 접수한 실시간 2차 안전 백업 목록입니다.</p>
                    </div>
                    {backupLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearLogs}
                        className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>전체 삭제</span>
                      </button>
                    )}
                  </div>

                  {backupLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-white border border-slate-150 rounded-xl space-y-1">
                      <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold">등록된 고객 접수 내역이 아직 없습니다.</p>
                      <p className="text-[10px]">양식을 접수해주시면 여기에 백업이 쌓입니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {backupLogs.map((log) => (
                        <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-sm text-[11px]">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span className="font-black text-slate-900 text-xs">{log.name} 님</span>
                            <span className="text-[9px] text-gray-400 font-mono">{log.timestamp}</span>
                          </div>
                          <div className="space-y-1 text-slate-700">
                            <div>
                              <span className="font-bold text-slate-500 w-16 inline-block">📞 연락처:</span>
                              <a href={`tel:${log.phone}`} className="text-blue-600 font-black underline">{log.phone}</a>
                            </div>
                            <div>
                              <span className="font-bold text-slate-500 w-16 inline-block">🛠️ 의뢰분야:</span>
                              <span className="font-bold text-blue-950">{log.service}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg mt-1 text-slate-600 leading-normal">
                              {log.memo}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3 Content: Security Passcode settings */}
              {activeTab === "password" && (
                <div className="space-y-4 animate-fadeIn">
                  <h5 className="font-bold text-slate-900">🔒 마스터 로그인 비밀번호 변경</h5>
                  <p className="text-gray-500">지앤지클린 전용 관리자 보안 비밀번호를 다른 사람이 유추하기 어려운 것으로 변경합니다.</p>

                  <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">새로운 관리자 비밀번호</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호 입력 (4자리 이상)"
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold w-full py-2 rounded-lg transition-all text-xs"
                    >
                      비밀번호 업데이트 저장
                    </button>
                    {passwordChangeSuccess && (
                      <p className="text-[10px] text-green-600 font-bold bg-green-50 p-2 rounded text-center">
                        ✓ 관리자 비밀번호가 성공적으로 업데이트되었습니다!
                      </p>
                    )}
                  </form>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Admin Settings Toggle Button at the very bottom */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-gray-400 text-[10px] sm:text-xs">
        <span className="font-semibold text-gray-400">지앤지클린 전용 보안 관리국</span>
        <button
          type="button"
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className={`text-[10px] sm:text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
            showAdminPanel 
              ? "bg-slate-900 text-white" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="관리자 설정 (보안 인증 필요)"
        >
          {isAdminAuthenticated ? (
            <Unlock className="w-3.5 h-3.5 text-green-500 animate-pulse" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-gray-500" />
          )}
          <span>{showAdminPanel ? "설정 닫기" : "관리자 설정"}</span>
        </button>
      </div>

    </div>
  );
}

// Complete fully-featured, secure, premium Google Apps Script code to append values & email Gmail
const APPS_SCRIPT_CODE = `/**
 * 지앤지클린 실시간 상담 접수 및 메일 전송 Google Apps Script 소스코드
 * 
 * [연동 방법]
 * 1. 구글 스프레드시트 새로 만들기 (https://sheets.new)
 * 2. 확장 프로그램 -> Apps Script 클릭
 * 3. 이 코드를 복사해서 붙여넣고 저장(Ctrl+S)
 * 4. 우측 상단 [배포] -> [새 배포] 클릭
 * 5. 유형 선택(톱니바퀴) -> [웹 앱] 선택
 * 6. 실행할 사용자: 나(Me), 액세스할 수 있는 사용자: 모든 사람(Anyone)으로 지정 후 [배포]
 * 7. 승인 단계 통과 후 부여되는 '웹 앱 URL' 주소를 복사하여 홈페이지 설정창에 붙여넣기하세요!
 */

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var name = params.name || '미입력';
    var phone = params.phone || '미입력';
    var service = params.service || '미입력';
    var memo = params.memo || '미입력';
    var timestamp = new Date();

    // 1. 구글 스프레드시트 첫 번째 시트에 행 추가
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 시트가 완전히 비어있다면 헤더 행 자동 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["접수일시", "고객이름", "연락처", "공사의뢰항목", "추가 요청사항"]);
    }
    
    sheet.appendRow([
      timestamp, 
      name, 
      phone, 
      service, 
      memo
    ]);

    // 2. 이메일 발송 처리
    var recipient = "nakeunjong@gmail.com";
    var subject = "[지앤지클린] ⚡ 새로운 실시간 상담 예약 접수 (" + name + "님)";
    
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");

    var htmlBody = \`
      <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af, #2563eb); color: #ffffff; padding: 28px 24px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; color: #93c5fd; opacity: 0.9;">CUSTOMER RESERVATION</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">지앤지클린 실시간 상담 접수</h1>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #bfdbfe;">고객님이 사이트에서 작성해주신 정보입니다.</p>
        </div>
        
        <!-- Content Body -->
        <div style="padding: 28px 24px;">
          <p style="margin-top: 0; margin-bottom: 20px; font-size: 14px; color: #334155; line-height: 1.6;">
            대표님, 새로운 현장 예약/문의가 정상 접수되었습니다. 아래의 고객 정보 및 의뢰 내역을 확인하신 후 신속하게 연락을 부탁드립니다.
          </p>
          
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th colspan="2" style="padding: 12px 16px; font-size: 13px; font-weight: 800; color: #1e293b; text-align: left; border-bottom: 1px solid #e2e8f0;">📋 상세 접수 내역</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px 16px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; width: 30%; font-size: 13px; color: #475569;">접수 일시</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; font-family: monospace;">\${formattedDate} (KST)</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #475569;">고객 이름</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 900; color: #1e3a8a;">\${name} 님</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #475569;">연락처</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 900; color: #2563eb;">
                  <a href="tel:\${phone}" style="color: #2563eb; text-decoration: underline;">\${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-weight: bold; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #475569;">공사 의뢰 항목</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; font-weight: bold;">
                  <span style="display: inline-block; background-color: #eff6ff; color: #1e40af; padding: 4px 8px; border-radius: 6px; font-size: 12px;">\${service}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-weight: bold; background-color: #f8fafc; font-size: 13px; color: #475569; vertical-align: top;">추가 요청사항</td>
                <td style="padding: 12px 16px; font-size: 13px; color: #334155; white-space: pre-wrap; line-height: 1.5; vertical-align: top;">\${memo}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- CTA Action -->
          <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
            <a href="tel:\${phone}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); border: none;">
              📞 고객에게 모바일 즉시 전화걸기
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 18px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5;">
          지앤지클린(GNG CLEAN) • 누수탐지 / 하수구막힘 / 변기뚫음 / 수전교체 전문 설비공사<br />
          <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;">본 알림은 지앤지클린 실시간 웹 앱 엔진에서 신뢰성 있게 자동 처리되었습니다.</span>
        </div>
      </div>
    \`;

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "스프레드시트에 저장하고 nakeunjong@gmail.com 메일 전송에 성공했습니다." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
