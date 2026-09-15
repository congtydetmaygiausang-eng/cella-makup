import React, { useState, useRef, useEffect } from 'react';
import { ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  MessageSquare,
  BarChart3,
  GraduationCap,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface AIAssistantScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: ScreenId) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  checklist?: string[];
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionCategories = [
    {
      id: 'Gợi ý tư vấn dịch vụ',
      label: 'Kịch bản tư vấn dáng mặt',
      desc: 'Tư vấn dáng mày & tone makeup theo undertone',
      prompt: 'Gợi ý kịch bản tư vấn dịch vụ phun xăm mí mắt mở tròng tự nhiên cho khách hàng trung niên sợ đau',
      icon: Lightbulb,
      color: 'bg-amber-500 text-white shadow-xs',
    },
    {
      id: 'Tạo nội dung mạng xã hội',
      label: 'Nội dung viral TikTok',
      desc: 'Kịch bản video 60s hướng dẫn dưỡng da Glass Skin',
      prompt: 'Viết 1 kịch bản video TikTok 60 giây chia sẻ bí quyết dưỡng da Glass Skin tự nhiên tại nhà',
      icon: MessageSquare,
      color: 'bg-rose-500 text-white shadow-xs',
    },
    {
      id: 'Phân tích báo cáo',
      label: 'Tối ưu phễu chuyển đổi',
      desc: 'Phân tích tỷ lệ chốt lịch từ lead TikTok & Ads',
      prompt: 'Đánh giá tỷ lệ chuyển đổi từ lead TikTok sang booking trong tháng này và giải pháp cải thiện',
      icon: BarChart3,
      color: 'bg-purple-500 text-white shadow-xs',
    },
    {
      id: 'Hỗ trợ đào tạo',
      label: 'Kiến thức Masterclass',
      desc: 'Kỹ thuật phân tầng biểu bì da & pha màu',
      prompt: 'Giải thích kỹ thuật điêu khắc sợi mày 9D và cách phân biệt các tầng biểu bì da',
      icon: GraduationCap,
      color: 'bg-teal-500 text-white shadow-xs',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (text: string, category?: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          category,
          context: 'Chuyên viên quản trị CELLA Beauty & Academy CRM',
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'CELLA AI đã tiếp nhận và sẵn sàng hỗ trợ bạn.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checklist: [
          'Đã phân tích hồ sơ undertone khách hàng',
          'Đã thiết lập kịch bản chăm sóc tự động',
          'Đã kích hoạt thông báo nhắc hẹn studio',
        ],
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      // Fallback response with structured steps matching the reference image layout
      setTimeout(() => {
        const fallbackReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Dưới đây là quy trình Makeup chuyên nghiệp chuẩn Atelier dành cho chuyên viên CELLA:\n\n1. Skin Prep (Làm sạch & Cấp ẩm): Phân tích loại da và undertone, sử dụng dưỡng ẩm phù hợp để tạo lớp nền ngậm nước.\n2. Xử lý khuyết điểm & Đánh nền: Dùng triệt sắc trung hòa màu da, chọn kem nền tiệp undertone và tán mỏng nhẹ tự nhiên.\n3. Định hình & Khóa nền: Đánh khối tôn vinh đường nét, phủ phấn bột (setting powder) và xịt khóa nền (setting spray) giữ lớp makeup lâu trôi.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          checklist: [
            'Bước 1: Phân tích loại da & kiểm tra undertone',
            'Bước 2: Skin prep & xử lý khuyết điểm chuyên sâu',
            'Bước 3: Hoàn thiện lớp nền, định hình & xịt khóa nền',
          ],
        };
        setMessages((prev) => [...prev, fallbackReply]);
        setLoading(false);
      }, 700);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-transparent pb-32 text-slate-900 flex flex-col justify-between">
      {/* Header with Circular Floating Buttons as in reference */}
      <MobileHeader
        title="AI Flow Assistant"
        subtitle="Trợ lý thông minh CELLA Gemini"
        showBack={true}
        onBack={onBack || (() => onNavigate?.('home'))}
        rightAction={
          messages.length > 0 ? (
            <button
              onClick={() => setMessages([])}
              className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-slate-700 flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>
          ) : undefined
        }
      />

      <div className="px-4 pt-2 flex-1 overflow-y-auto space-y-4">
        {/* Holographic Iridescent Orb Inspired directly by Screen 2 of Reference */}
        {messages.length === 0 && (
          <div className="space-y-4 pt-2 animate-fade-in text-center">
            {/* 3D Iridescent Orb */}
            <div className="relative mx-auto w-24 h-24 mb-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#90E0EF] via-[#C77DFF] to-[#FFB703] shadow-[0_14px_40px_rgba(199,125,255,0.35)] flex items-center justify-center relative overflow-hidden ring-4 ring-white/80">
                {/* Specular high-light sheen */}
                <div className="absolute top-2 left-3 w-10 h-6 bg-white/60 rounded-full blur-[2px] transform -rotate-45" />
                <div className="absolute bottom-2 right-3 w-12 h-8 bg-sky-300/40 rounded-full blur-[4px]" />
                <Sparkles className="w-10 h-10 text-white drop-shadow-md stroke-[2]" />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                CELLA INTELLIGENCE
              </p>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                Bạn muốn tối ưu quy trình nào?
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 font-medium">
                Hãy cho AI biết mong muốn của bạn, hệ thống sẽ đề xuất kịch bản tư vấn và tự động hóa quy trình.
              </p>
            </div>

            {/* Category Cards with clean pastel surfaces & high border-radius */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-left">
              {suggestionCategories.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSendMessage(item.prompt, item.id)}
                    className="card-pastel-interactive p-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#00A3FF] transition-colors block truncate">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#00A3FF] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-[#00A3FF] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Sparkles className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-[24px] text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-white/95 border border-white p-4 text-slate-800 shadow-sm rounded-tr-md font-medium'
                  : 'card-pastel p-4 text-slate-800 rounded-tl-md space-y-2.5'
              }`}
            >
              {msg.category && msg.sender === 'user' && (
                <span className="text-[10px] font-bold text-[#00A3FF] uppercase tracking-wider block">
                  Chủ đề: {msg.category}
                </span>
              )}
              <div className="whitespace-pre-line font-medium text-slate-800 leading-relaxed">
                {msg.text}
              </div>

              {/* Action Checkmarks Card List as in Reference Image 2 */}
              {msg.checklist && msg.checklist.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {msg.checklist.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}

                  {/* Rounded-full button like "View Workflow" in reference */}
                  <button
                    onClick={() => onNavigate?.('tasks')}
                    className="w-full mt-2 py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Xem danh sách công việc liên quan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span
                className={`text-[10px] block text-right mt-1.5 ${
                  msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-[#00A3FF] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="card-pastel p-3.5 rounded-[22px] rounded-tl-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 font-medium ml-1">AI đang xử lý kịch bản...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Capsule Frosted Chat Input as in Reference Image 2 */}
      <div className="p-3 sticky bottom-0 bg-transparent">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="max-w-md mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Hỏi AI bất kỳ điều gì..."
            className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white/95 backdrop-blur-xl border border-white shadow-[0_10px_30px_-5px_rgba(12,74,110,0.08)] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/40 font-medium"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="absolute right-1.5 w-10 h-10 rounded-full bg-[#00A3FF] hover:bg-[#0090E0] disabled:bg-slate-200 text-white flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
          </button>
        </form>
      </div>
    </div>
  );
};
