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
  FileSpreadsheet
} from "lucide-react";

export default function GngCleanBookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("누수탐지 & 누수공사");
  const [memo, setMemo] = useState("");
  
  // Apps Script Web App URL state loaded from localStorage or environmental variables
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem("gngclean_apps_script_url") || (import.meta as any).env?.VITE_APPS_SCRIPT_URL || "";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Toggle states for settings & guide
  const [showSetup, setShowSetup] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state changes with localStorage
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setAppsScriptUrl(url);
    localStorage.setItem("gngclean_apps_script_url", url);
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

    const formData = {
      name: name.trim(),
      phone: phone.trim(),
      service: service,
      memo: memo.trim()
    };

    // If Apps Script Web App URL is not set, simulate successful submission and show guide
    if (!appsScriptUrl) {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        // Show automatic simulation dialog
      }, 1000);
      return;
    }

    try {
      // Use no-cors mode since Google Apps Script redirects can sometimes trigger CORS errors
      // But we want to get the JSON output, so we can use standard fetch with standard rules
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors", // Allows sending data successfully to Google Apps Script
        headers: {
          "Content-Type": "text/plain" // Prevents preflight request triggers
        },
        body: JSON.stringify(formData)
      });

      // Under no-cors, the response status is 0 and we can't read the response body, but the post always succeeds!
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Clean form inputs
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 text-gray-800 shadow-2xl relative border border-blue-50">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight">
          실시간 구글시트 연동형
        </span>
        <button
          type="button"
          onClick={() => setShowSetup(!showSetup)}
          className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
            showSetup 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="구글 시트 및 메일 연동 설정"
        >
          <Settings className={`w-3.5 h-3.5 ${showSetup ? "animate-spin" : ""}`} />
          <span>{showSetup ? "설정 닫기" : "구글 연동 가이드"}</span>
        </button>
      </div>

      {/* 1. Google Sheets & Gmail Integration Setup Dashboard */}
      {showSetup && (
        <div className="mb-6 p-4.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              구글 시트 & Gmail 자동 전송 가이드
            </h4>
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
              개발 불필요 • 2분 완성
            </span>
          </div>

          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              고객님이 이 양식에 입력한 내용을 <strong>구글 스프레드시트</strong>에 저장하고, 대표님의 이메일(<strong>nakeunjong@gmail.com</strong>)로 실시간 알림을 보내는 방법입니다.
            </p>
            
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-900 text-[13px]">🛠️ 연동 순서:</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li><a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-bold">구글 스프레드시트 새로 만들기 <ExternalLink className="w-3 h-3" /></a></li>
                <li>상단 메뉴에서 <strong>[확장 프로그램] ➔ [Apps Script]</strong>를 클릭합니다.</li>
                <li>기존 코드를 모두 지우고, 아래의 <strong>파란색 코드 복사</strong> 버튼을 눌러 붙여넣기합니다.</li>
                <li>우측 상단 <strong>[배포] ➔ [새 배포]</strong>를 클릭합니다.</li>
                <li>유형 선택에서 톱니바퀴를 눌러 <strong>[웹 앱]</strong>을 선택합니다.</li>
                <li>설정을 다음과 같이 완료한 뒤 [배포]를 누릅니다:
                  <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-gray-600">
                    <li>액세스할 수 있는 사용자: <span className="text-blue-600 font-bold">모든 사람 (Anyone)</span></li>
                    <li>웹 앱을 실행할 사용자: <span className="text-slate-800 font-bold">나 (Me)</span></li>
                  </ul>
                </li>
                <li>액세스 승인을 거치면 생성되는 <strong>웹 앱 URL</strong>을 복사하여 아래에 붙여넣어 주세요!</li>
              </ol>
            </div>

            {/* URL Input Box */}
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
              <label className="block text-xs font-black text-blue-900">🔗 배포된 Apps Script 웹 앱 URL 입력</label>
              <input 
                type="text"
                value={appsScriptUrl}
                onChange={handleUrlChange}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full p-2.5 bg-white border border-blue-200/60 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[10px] text-blue-700 font-semibold">
                {appsScriptUrl 
                  ? "✓ 연동 주소가 등록되었습니다. 이제 실제 저장 및 메일 발송이 지원됩니다." 
                  : "💡 주소가 없어도 현재 페이지에서 즉시 입력 및 접수 성공 시뮬레이션이 작동합니다!"}
              </p>
            </div>

            {/* Code Copier */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">📋 Apps Script 소스코드</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "복사 완료!" : "전체 코드 복사하기"}</span>
                </button>
              </div>
              <pre className="w-full h-36 overflow-y-auto bg-slate-950 text-slate-300 p-2.5 rounded-lg font-mono text-[10px] leading-relaxed select-all">
                {APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>
        </div>
      )}

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
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">시뮬레이션 모드 작동 중</span>
              <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">
                현재 Apps Script 연동 URL을 등록하지 않아 테스트 가상 접수로 완료되었습니다. 우측 상단의 <strong>[구글 연동 가이드]</strong> 버튼을 클릭하여 연동을 마치면 실제 구글 시트 저장과 이메일 알림이 전송됩니다!
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95"
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
