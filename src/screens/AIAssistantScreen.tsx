import React, { useState, useRef, useEffect } from 'react';
import { ScreenId } from '../types';
import {
  Headphones,
  Lightbulb,
  MessageSquare,
  BarChart2,
  GraduationCap,
  HelpCircle,
  Send,
  ArrowLeft,
  Sparkles,
  User,
} from 'lucide-react';

interface AIAssistantScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_ACTIONS = [
  {
    text: 'Hỗ trợ bán hàng',
    icon: Headphones,
    iconBg: 'bg-blue-50 border border-blue-100',
    iconColor: 'text-blue-500',
    prompt: 'Hãy giúp tôi tư vấn bán hàng và chốt deal hiệu quả hơn.',
  },
  {
    text: 'Gợi ý chăm sóc khách hàng',
    icon: Lightbulb,
    iconBg: 'bg-emerald-50 border border-emerald-100',
    iconColor: 'text-emerald-500',
    prompt: 'Gợi ý cách chăm sóc khách hàng sau liệu trình.',
  },
  {
    text: 'Tạo nội dung mạng xã hội',
    icon: MessageSquare,
    iconBg: 'bg-sky-50 border border-sky-100',
    iconColor: 'text-sky-500',
    prompt: 'Tạo nội dung đăng Facebook/TikTok cho dịch vụ thẩm mỹ.',
  },
  {
    text: 'Phân tích báo cáo',
    icon: BarChart2,
    iconBg: 'bg-rose-50 border border-rose-100',
    iconColor: 'text-rose-500',
    prompt: 'Phân tích số liệu doanh thu và đưa ra nhận xét.',
  },
  {
    text: 'Hỗ trợ đào tạo',
    icon: GraduationCap,
    iconBg: 'bg-amber-50 border border-amber-100',
    iconColor: 'text-amber-500',
    prompt: 'Hỗ trợ giáo trình và kiến thức đào tạo cho học viên.',
  },
  {
    text: 'Trả lời câu hỏi',
    icon: HelpCircle,
    iconBg: 'bg-purple-50 border border-purple-100',
    iconColor: 'text-purple-500',
    prompt: 'Tôi có một câu hỏi cần giải đáp.',
  },
];

const AI_RESPONSES: Record<string, string> = {
  default:
    'Xin chào! Tôi là trợ lý AI CELLA. Tôi sẵn sàng hỗ trợ bạn về bán hàng, chăm sóc khách hàng, tạo nội dung và nhiều hơn nữa. Bạn cần tôi giúp gì hôm nay?',
  sales:
    'Để chốt deal hiệu quả, bạn có thể:\n\n1. **Lắng nghe nhu cầu** – Hỏi khách muốn cải thiện điều gì trên gương mặt.\n2. **Đề xuất lộ trình** – Gợi ý 2-3 dịch vụ phù hợp, ưu tiên lộ trình ngắn hạn.\n3. **Tạo sự khan hiếm** – Nhắc về ưu đãi có thời hạn hoặc suất còn ít.\n4. **Đề nghị đặt cọc** – Xác nhận lịch hẹn với khoản đặt cọc nhỏ để giữ chỗ.',
  content:
    'Đây là mẫu caption TikTok cho bạn:\n\n✨ **Bí quyết da căng bóng không cần makeup**\n\nMeso Extra tại CELLA – Liệu trình chỉ 60 phút, hiệu quả duy trì 3-6 tháng.\n\n✅ Cấy dưỡng chất trực tiếp dưới da\n✅ Không đau, không nghỉ dưỡng\n✅ Bác sĩ thực hiện trực tiếp\n\n📍 CELLA Beauty – [Địa chỉ]\n📞 Đặt lịch: [SĐT]\n\n#CELLA #mesotherapy #skincare',
};

function getAIResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('bán hàng') || lower.includes('chốt')) return AI_RESPONSES.sales;
  if (lower.includes('nội dung') || lower.includes('tiktok') || lower.includes('facebook'))
    return AI_RESPONSES.content;
  return AI_RESPONSES.default;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({ onBack }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showChat = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = (text ?? inputMessage).trim();
    if (!msg) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: getAIResponse(msg),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-full bg-[#F5F6FF] flex flex-col relative" style={{ height: '100%' }}>
      {/* ─── Header ─── */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white border-b border-slate-100">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          {/* Mini avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-slate-900 leading-tight">AI – Trợ lý CELLA</h2>
            <p className="text-[11px] text-emerald-500 font-semibold">● Đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* ─── Chat / Welcome Area ─── */}
      <div className="flex-1 overflow-y-auto pb-[100px] no-scrollbar">
        {!showChat ? (
          /* ── Welcome State ── */
          <div className="flex flex-col items-center px-5 pt-8 pb-4">
            {/* Robot Avatar */}
            <div className="relative w-[100px] h-[100px] mb-5">
              <div className="absolute inset-0 rounded-full bg-indigo-100 blur-2xl opacity-80" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* body */}
                  <rect x="20" y="38" width="60" height="44" rx="14" fill="#544CDE" />
                  {/* head */}
                  <rect x="28" y="14" width="44" height="32" rx="14" fill="#6C63FF" />
                  {/* antenna */}
                  <circle cx="50" cy="7" r="5" fill="#A5B4FC" />
                  <line x1="50" y1="12" x2="50" y2="18" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
                  {/* eyes */}
                  <circle cx="38" cy="28" r="6" fill="white" />
                  <circle cx="62" cy="28" r="6" fill="white" />
                  <circle cx="38" cy="29" r="3" fill="#1E1B4B" />
                  <circle cx="62" cy="29" r="3" fill="#1E1B4B" />
                  {/* shine */}
                  <circle cx="39.5" cy="27.5" r="1.2" fill="white" />
                  <circle cx="63.5" cy="27.5" r="1.2" fill="white" />
                  {/* smile */}
                  <path d="M40 36 Q50 43 60 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* arms */}
                  <rect x="6" y="50" width="14" height="22" rx="7" fill="#544CDE" />
                  <rect x="80" y="50" width="14" height="22" rx="7" fill="#544CDE" />
                  {/* buttons */}
                  <circle cx="40" cy="60" r="4" fill="#A5B4FC" opacity="0.6" />
                  <circle cx="50" cy="60" r="4" fill="#A5B4FC" opacity="0.6" />
                  <circle cx="60" cy="60" r="4" fill="#A5B4FC" opacity="0.6" />
                </svg>
              </div>
            </div>

            <h2 className="text-[17px] font-black text-slate-900 text-center">
              Xin chào! Tôi là trợ lý AI của CELLA
            </h2>
            <p className="text-[13px] text-slate-500 mt-1 text-center">
              Tôi có thể giúp gì cho bạn hôm nay?
            </p>

            {/* Quick Action Cards – vertical list */}
            <div className="w-full mt-6 space-y-2.5">
              {QUICK_ACTIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(item.prompt)}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md active:scale-[0.98] transition-all text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                    >
                      <Icon className={`w-5 h-5 ${item.iconColor} stroke-[2.2]`} />
                    </div>
                    <span className="text-[14px] font-semibold text-slate-800">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Chat Messages ── */
          <div className="px-4 pt-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mb-1">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                  )}

                  <div className={`max-w-[72%] space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#544CDE] text-white rounded-br-md'
                          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ─── Bottom Input ─── */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 h-12 px-4 rounded-full bg-slate-50 border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE] focus:ring-2 focus:ring-indigo-200 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim()}
            className="w-12 h-12 rounded-full bg-[#544CDE] text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 hover:bg-[#4338ca] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
