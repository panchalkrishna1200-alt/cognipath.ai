import { useState } from "react";
import { useStudent } from "../App.jsx";

const PRESET_QUERIES = [
  {
    en: "Explain my survey design gap.",
    hi: "मेरे सर्वेक्षण डिजाइन गैप को समझाइए।",
  },
  {
    en: "Explain this in Hindi.",
    hi: "इसे हिंदी में समझाइए।",
  },
  {
    en: "What course should I take next on iGOT?",
    hi: "मुझे iGOT पर अगला कौन सा कोर्स करना चाहिए?",
  },
  {
    en: "Why is Data Governance marked as a Critical Gap?",
    hi: "डेटा गवर्नेंस को क्रिटिकल गैप क्यों माना गया है?",
  },
];

const KNOWLEDGE_BASE = {
  survey_design: {
    en: "Your baseline score in Survey Design is 50% against the required 80% benchmark (a 30% Critical Gap). The assessment detected struggles with questionnaire structure, cognitive pre-testing, sample frame boundaries, and non-sampling error reduction. We recommend completing the 'Survey Design Fundamentals' module on iGOT Karmayogi before retaking the assessment.",
    hi: "सर्वेक्षण डिजाइन (Survey Design) में आपका वर्तमान स्कोर 50% है, जबकि आवश्यक मानक 80% है (30% का क्रिटिकल गैप)। मूल्यांकन में यह पाया गया कि प्रश्नावली संरचना, सैंपलिंग फ्रेम का चयन और गैर-सैंपलिंग त्रुटि निवारण में कठिनाई है। हम अनुशंसा करते हैं कि आप iGOT कर्मयोगी पर 'Survey Design Fundamentals' मॉड्यूल पूरा करें।",
    citation: "Source: MoSPI National Sample Survey Architecture Manual (2024), Chapter 4: Questionnaire Pre-Testing, Page 42",
  },
  data_governance: {
    en: "Data Governance is at 55% against a 75% requirement (20% Critical Gap). As a Statistical Officer, adherence to the Digital Personal Data Protection (DPDP) Act and NDSAP standards is critical for microdata anonymization and public record safety.",
    hi: "डेटा गवर्नेंस में आपका स्कोर 55% है (आवश्यक: 75%, 20% का अंतर)। एक सांख्यिकीय अधिकारी के रूप में, डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम और राष्ट्रीय डेटा साझाकरण नीति (NDSAP) का ज्ञान सार्वजनिक डेटा सुरक्षा और एनोनिमाइजेशन के लिए अत्यंत आवश्यक है।",
    citation: "Source: Digital Personal Data Protection (DPDP) Act 2023 Guidelines, Ministry of Electronics & IT, Section 8(4)",
  },
  general_hi: {
    en: "CogniPath AI analyzes your competency assessments and guides your skill development according to official government competency frameworks.",
    hi: "कॉग्निपाथ एआई (CogniPath AI) आपके मूल्यांकन परिणामों का विश्लेषण करके यह बताता है कि किन कौशलों में सुधार की आवश्यकता है और iGOT कर्मयोगी के माध्यम से व्यक्तिगत शिक्षण पथ तैयार करता है।",
    citation: "Source: Mission Karmayogi National Competency Framework for Public Service Officials (2024)",
  },
  course_rec: {
    en: "Based on your 30% gap in Survey Design, your #1 priority course is 'Survey Design & Sampling Methodologies' (NSSTA / iGOT Karmayogi, 12 hours), followed by 'Data Privacy & DPDP Compliance' (6 hours).",
    hi: "सर्वेक्षण डिजाइन में 30% गैप को देखते हुए आपकी पहली प्राथमिकता 'Survey Design & Sampling Methodologies' (NSSTA / iGOT कर्मयोगी, 12 घंटे) कोर्स है, जिसके बाद 'Data Privacy & DPDP Compliance' कोर्स करना चाहिए।",
    citation: "Source: iGOT Karmayogi Official Course Catalog 2024-25, Course Code: MOSPI-SURV-101 & MEITY-DPDP-202",
  },
};

export default function AiAssistantModal({ isOpen, onClose }) {
  const { student } = useStudent();
  const [lang, setLang] = useState("en"); // "en" | "hi"
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        lang === "hi"
          ? `नमस्ते ${student?.name || "अधिकारी महोदय"}, मैं कॉग्निपाथ एआई सहायक हूँ। मैं आपकी क्षमता विकास और स्किल गैप में कैसे सहायता कर सकता हूँ?`
          : `Hello ${student?.name || "Officer"}, I am CogniPath AI Assistant. How can I assist you with your competency gaps and learning path today?`,
      citation: "Source: Official MoSPI National Statistical Training Architecture",
      time: "Just now",
    },
  ]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    // Simulate AI response grounded in retrieved source material
    setTimeout(() => {
      let replyText = "";
      let citationText = "";
      const lower = query.toLowerCase();

      if (lower.includes("hindi") || lower.includes("हिंदी") || lang === "hi") {
        if (lower.includes("survey") || lower.includes("सर्वेक्षण")) {
          replyText = KNOWLEDGE_BASE.survey_design.hi;
          citationText = KNOWLEDGE_BASE.survey_design.citation;
        } else if (lower.includes("governance") || lower.includes("गवर्नेंस") || lower.includes("privacy")) {
          replyText = KNOWLEDGE_BASE.data_governance.hi;
          citationText = KNOWLEDGE_BASE.data_governance.citation;
        } else if (lower.includes("course") || lower.includes("कोर्स") || lower.includes("igot")) {
          replyText = KNOWLEDGE_BASE.course_rec.hi;
          citationText = KNOWLEDGE_BASE.course_rec.citation;
        } else {
          replyText = KNOWLEDGE_BASE.general_hi.hi;
          citationText = KNOWLEDGE_BASE.general_hi.citation;
        }
      } else {
        if (lower.includes("survey") || lower.includes("design")) {
          replyText = KNOWLEDGE_BASE.survey_design.en;
          citationText = KNOWLEDGE_BASE.survey_design.citation;
        } else if (lower.includes("governance") || lower.includes("privacy") || lower.includes("dpdp")) {
          replyText = KNOWLEDGE_BASE.data_governance.en;
          citationText = KNOWLEDGE_BASE.data_governance.citation;
        } else if (lower.includes("course") || lower.includes("igot") || lower.includes("recommend")) {
          replyText = KNOWLEDGE_BASE.course_rec.en;
          citationText = KNOWLEDGE_BASE.course_rec.citation;
        } else {
          replyText =
            "CogniPath AI diagnosed your primary gaps in Survey Design (30% gap) and Data Governance (20% gap). You have achieved strong mastery in Data Collection (90%) and Data Visualization (85%). Your prioritized next step is completing the 'Survey Design Fundamentals' module on iGOT Karmayogi.";
          citationText = "Source: CogniPath Diagnostic Engine & MoSPI Cadre Rubric (2024)";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: replyText,
          citation: citationText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 sm:w-[440px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F2F64] to-[#1E3A8A] text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500/30 flex items-center justify-center border border-blue-400/40 text-white font-bold text-sm shadow-inner">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">AI Multilingual Assistant</h3>
            <p className="text-[11px] text-blue-200">Grounded Source Intelligence (English + हिंदी)</p>
          </div>
        </div>

        {/* Language selector & Close button */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-white/10 p-0.5 border border-white/20">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                lang === "en" ? "bg-white text-[#0F2F64]" : "text-blue-200 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                setLang("hi");
                handleSend("मेरे सर्वेक्षण डिजाइन गैप को समझाइए।");
              }}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                lang === "hi" ? "bg-white text-[#0F2F64]" : "text-blue-200 hover:text-white"
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 p-2.5 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        {PRESET_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(lang === "hi" ? q.hi : q.en)}
            className="shrink-0 text-[11px] font-medium bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border border-slate-200 rounded-full px-2.5 py-1 transition-all shadow-xs"
          >
            {lang === "hi" ? q.hi : q.en}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="p-4 flex-1 h-80 overflow-y-auto space-y-3 bg-slate-50/40">
        {messages.map((m) => {
          const isAi = m.sender === "ai";
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-full bg-[#0F2F64] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                  isAi
                    ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm space-y-2"
                    : "bg-[#0F2F64] text-white rounded-tr-sm font-normal"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {/* Grounded Citation Footer */}
                {isAi && m.citation && (
                  <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[10px] text-blue-700 font-medium">
                    <span>📖</span>
                    <span className="truncate">{m.citation}</span>
                  </div>
                )}
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    isAi ? "text-slate-400" : "text-blue-200"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            lang === "hi"
              ? "स्किल गैप या कोर्स के बारे में पूछें..."
              : "Ask about your skill gaps, courses, or citations..."
          }
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="bg-[#0F2F64] hover:bg-[#173E80] disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}
