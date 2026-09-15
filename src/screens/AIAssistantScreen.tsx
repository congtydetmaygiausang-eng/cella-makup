import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScreenId, Staff } from '../types';
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
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

interface AIAssistantScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  currentUser?: Staff;
  customerContext?: {
    name?: string;
    source?: string;
    crmStage?: string;
    contactCount?: number;
    lastContactText?: string;
    totalSpent?: number;
    notesHistory?: any[];
  };
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

const QUICK_ACTIONS = [
  {
    text: 'Hỗ trợ bán hàng',
    icon: Headphones,
    iconBg: 'bg-blue-50 border border-blue-100',
    iconColor: 'text-blue-500',
    category: 'Hỗ trợ bán hàng',
    prompt: 'Khách hàng vừa liên hệ hỏi về dịch vụ thẩm mỹ tại CELLA. Hãy phân tích và tư vấn chiến lược tiếp cận phù hợp.',
  },
  {
    text: 'Gợi ý chăm sóc khách hàng',
    icon: Lightbulb,
    iconBg: 'bg-emerald-50 border border-emerald-100',
    iconColor: 'text-emerald-500',
    category: 'Gợi ý chăm sóc khách hàng',
    prompt: 'Khách vừa hoàn thành liệu trình tại CELLA. Gợi ý cách chăm sóc và re-booking hiệu quả.',
  },
  {
    text: 'Tạo nội dung mạng xã hội',
    icon: MessageSquare,
    iconBg: 'bg-sky-50 border border-sky-100',
    iconColor: 'text-sky-500',
    category: 'Tạo nội dung mạng xã hội',
    prompt: 'Tạo kịch bản TikTok 60 giây cho dịch vụ thẩm mỹ CELLA, phong cách thu hút và tự nhiên.',
  },
  {
    text: 'Phân tích báo cáo',
    icon: BarChart2,
    iconBg: 'bg-rose-50 border border-rose-100',
    iconColor: 'text-rose-500',
    category: 'Phân tích báo cáo',
    prompt: 'Phân tích hiệu suất KPI tháng này và đề xuất cải thiện tỷ lệ chuyển đổi lead sang booking.',
  },
  {
    text: 'Hỗ trợ đào tạo',
    icon: GraduationCap,
    iconBg: 'bg-amber-50 border border-amber-100',
    iconColor: 'text-amber-500',
    category: 'Hỗ trợ đào tạo',
    prompt: 'Hỗ trợ kiến thức kỹ thuật điêu khắc 9D và cấy vi chất Meso Extra cho học viên.',
  },
  {
    text: 'Trả lời câu hỏi',
    icon: HelpCircle,
    iconBg: 'bg-purple-50 border border-purple-100',
    iconColor: 'text-purple-500',
    category: 'Trả lời câu hỏi',
    prompt: 'Tôi có một câu hỏi liên quan đến nghiệp vụ tư vấn và vận hành tại CELLA.',
  },
];

async function callCellaAI(
  message: string,
  category: string,
  customerData?: any
): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        category,
        context: 'CELLA CRM - Hệ thống quản lý thẩm mỹ & đào tạo',
        customerData: customerData || null,
      }),
    });

    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.reply || 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.';
  } catch {
    return 'Kết nối tạm thời bị gián đoạn. Vui lòng kiểm tra mạng và thử lại nhé!';
  }
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBack,
  currentUser,
  customerContext,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('Chung');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showChat = messages.length > 0;

  // Personalized greeting based on logged-in user
  const firstName = useMemo(() => {
    if (!currentUser?.fullName) return 'bạn';
    const parts = currentUser.fullName.trim().split(' ');
    return parts[parts.length - 1]; // Last word = first name in Vietnamese
  }, [currentUser]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Chào buổi sáng';
    if (hour >= 12 && hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }, []);

  const roleLabel = useMemo(() => {
    switch (currentUser?.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN': return 'Quản lý';
      case 'MASTER_ARTIST': return 'Master Artist';
      case 'ARTIST': return 'Artist';
      case 'ACADEMY_TRAINER': return 'Giảng viên';
      case 'SALES_CONSULTANT': return 'Tư vấn viên';
      default: return 'chuyên viên';
    }
  }, [currentUser]);

  // Smart suggested questions based on role
  const smartSuggestions = useMemo(() => {
    const base = [
      { label: 'Xem lương tháng này', prompt: 'Tính hoa hồng và lương tháng này của tôi dựa trên KPI hiện tại.' },
      { label: 'Báo cáo doanh thu hôm nay', prompt: 'Tổng hợp doanh thu hôm nay và so sánh với cùng kỳ.' },
      { label: 'Khách hàng cần follow-up', prompt: 'Liệt kê các khách hàng cần chăm sóc và hành động tiếp theo phù hợp.' },
    ];
    if (currentUser?.role === 'ACADEMY_TRAINER') {
      base[0] = { label: 'Xem học viên mới', prompt: 'Danh sách học viên đăng ký mới nhất và tiến độ khai giảng.' };
    }
    return base;
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text?: string, category?: string) => {
    const msg = (text ?? inputMessage).trim();
    if (!msg || isTyping) return;

    const cat = category ?? currentCategory;
    if (category) setCurrentCategory(category);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    const reply = await callCellaAI(msg, cat, customerContext);

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentCategory('Chung');
    setInputMessage('');
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

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-black text-slate-900 leading-tight">AI – Trợ lý CELLA</h2>
            <p className="text-[11px] text-emerald-500 font-semibold">● Sales Assistant · Gemini AI</p>
          </div>
        </div>

        {showChat && (
          <button
            onClick={handleReset}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
            title="Cuộc hội thoại mới"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Context banner when customer is passed */}
      {customerContext?.name && (
        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <p className="text-[11px] text-indigo-600 font-medium">
            Đang phân tích: <strong>{customerContext.name}</strong>
            {customerContext.crmStage && ` · ${customerContext.crmStage}`}
            {customerContext.totalSpent
              ? ` · Đã chi: ${customerContext.totalSpent.toLocaleString('vi-VN')}đ`
              : ''}
          </p>
        </div>
      )}

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
                  <rect x="20" y="38" width="60" height="44" rx="14" fill="#544CDE" />
                  <rect x="28" y="14" width="44" height="32" rx="14" fill="#6C63FF" />
                  <circle cx="50" cy="7" r="5" fill="#A5B4FC" />
                  <line x1="50" y1="12" x2="50" y2="18" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="38" cy="28" r="6" fill="white" />
                  <circle cx="62" cy="28" r="6" fill="white" />
                  <circle cx="38" cy="29" r="3" fill="#1E1B4B" />
                  <circle cx="62" cy="29" r="3" fill="#1E1B4B" />
                  <circle cx="39.5" cy="27.5" r="1.2" fill="white" />
                  <circle cx="63.5" cy="27.5" r="1.2" fill="white" />
                  <path d="M40 36 Q50 43 60 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <rect x="6" y="50" width="14" height="22" rx="7" fill="#544CDE" />
                  <rect x="80" y="50" width="14" height="22" rx="7" fill="#544CDE" />
                  <circle cx="40" cy="60" r="4" fill="#A5B4FC" opacity="0.6" />
                  <circle cx="50" cy="60" r="4" fill="#A5B4FC" opacity="0.6" />
                  <circle cx="60" cy="60" r="4" fill="#A5B4FC" opacity="0.6" />
                </svg>
              </div>
            </div>

            {/* Personalized Greeting */}
            <h2 className="text-[17px] font-black text-slate-900 text-center">
              {greeting}, {currentUser ? `chị ${firstName}!` : 'bạn!'}
            </h2>
            <p className="text-[13px] text-slate-500 mt-1 text-center leading-relaxed">
              Hôm nay {currentUser ? `${roleLabel} ` : ''}cần em hỗ trợ điều gì ạ?
            </p>

            {/* Smart Quick Chips based on role */}
            <div className="w-full mt-3 flex flex-col gap-1.5">
              {smartSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.prompt, 'Trả lời câu hỏi')}
                  className="flex items-center justify-between px-3.5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 active:scale-[0.98] transition-all text-left"
                >
                  <span className="text-[12px] font-semibold text-indigo-700">{s.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="w-full mt-2 border-t border-slate-100 pt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Hoặc chọn chủ đề</p>
              {QUICK_ACTIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(item.prompt, item.category)}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md active:scale-[0.98] transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <Icon className={`w-5 h-5 ${item.iconColor} stroke-[2.2]`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-slate-800">{item.text}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.prompt.substring(0, 55)}...</p>
                    </div>
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

                  <div className={`max-w-[76%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#544CDE] text-white rounded-br-md'
                          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1 mt-1">{msg.timestamp}</span>
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
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Nhập câu hỏi hoặc mô tả tình huống khách hàng..."
            className="flex-1 h-12 px-4 rounded-full bg-slate-50 border border-slate-200 text-[13.5px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE] focus:ring-2 focus:ring-indigo-200 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-[#544CDE] text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 hover:bg-[#4338ca] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
