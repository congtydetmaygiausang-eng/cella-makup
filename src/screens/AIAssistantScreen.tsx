import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScreenId, Staff } from '../types';
import {
  Sparkles,
  ArrowLeft,
  Send,
  User,
  RefreshCw,
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  CalendarCheck,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  Wand2,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Zap,
  Bot,
  RotateCcw,
} from 'lucide-react';
import {
  askCellaAI,
  getMinimaxApiKey,
  setMinimaxApiKey,
  getGeminiApiKey,
  setGeminiApiKey,
  testAiConnection,
  detectApiKeyType,
  getPreferredAiProvider,
  setPreferredAiProvider,
} from '../services/minimaxService';

interface AIAssistantScreenProps {
  onNavigate?: (screen: ScreenId) => void;
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
  provider?: 'minimax' | 'gemini' | 'cella_engine';
  model?: string;
}

const SYSTEM_TOPICS = [
  {
    title: 'Bảng giá Makeup Cô dâu & Dự tiệc',
    category: 'Hỗ trợ bán hàng',
    icon: DollarSign,
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    prompt: 'Hãy cho tôi biết chi tiết bảng giá các dịch vụ makeup cô dâu ngày cưới VIP, ăn hỏi, thử makeup và dự tiệc tại CELLA Studio?',
    followUp: 'Gói VIP bao gồm dịch vụ gì thêm?',
  },
  {
    title: 'Học phí & Khóa học Pro Artist',
    category: 'Hỗ trợ đào tạo',
    icon: BookOpen,
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    prompt: 'Khóa học Makeup Chuyên Nghiệp Toàn Diện (Pro Artist) và Master Trainer tại CELLA Academy có học phí bao nhiêu, quyền lợi và bằng cấp thế nào?',
    followUp: 'Thời gian đào tạo bao lâu và có hỗ trợ dụng cụ không?',
  },
  {
    title: 'Quy trình Đặt cọc & Dời lịch hẹn',
    category: 'Quy trình vận hành',
    icon: CalendarCheck,
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    prompt: 'Quy định đặt cọc giữ slot giờ đẹp và chính sách đổi, dời hoặc hủy lịch hẹn makeup tại CELLA như thế nào?',
    followUp: 'Nếu khách dời lịch gấp trong 24h thì xử lý sao?',
  },
  {
    title: 'Kịch bản Chốt Sales khách hỏi giá',
    category: 'Hỗ trợ bán hàng',
    icon: HeartHandshake,
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    prompt: 'Khách hàng vừa nhắn tin hỏi: "Gói cô dâu ngày cưới giá bao nhiêu vậy em?". Hãy phân tích tâm lý và gợi ý câu trả lời chốt hẹn tự nhiên, không ép khách.',
    followUp: 'Nếu khách chê giá cao hơn chỗ khác thì xử lý thế nào?',
  },
  {
    title: 'Xử lý lớp nền bị mốc (cakey)',
    category: 'Kiến thức chuyên môn',
    icon: Wand2,
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    prompt: 'Chia sẻ các bước skin-prep và kỹ thuật đánh nền không bị mốc, kiềm dầu bền màu suốt 12 tiếng của Master CELLA?',
    followUp: 'Cách cấp ẩm cho da khô tróc vảy trước khi đánh nền?',
  },
  {
    title: 'Phân quyền hệ thống CELLA (RBAC)',
    category: 'Hệ thống phần mềm',
    icon: ShieldCheck,
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    prompt: 'Phân quyền trong hệ thống CELLA quy định ai được Xem, ai được Thêm, Sửa và Xóa các dữ liệu Khách hàng, Lịch hẹn, Khóa học và Doanh thu?',
    followUp: 'Vai trò ARTIST và SALES khác nhau chỗ nào?',
  },
];

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBack,
  currentUser,
  customerContext,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('Chung');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Provider & Key Settings State
  const [geminiKey, setGeminiKeyState] = useState(() => getGeminiApiKey());
  const [minimaxKey, setMinimaxKeyState] = useState(() => getMinimaxApiKey());
  const [preferredProvider, setPreferredState] = useState<'gemini' | 'minimax' | 'auto'>(() => getPreferredAiProvider());

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gemini' | 'minimax'>('gemini');
  const [inputKey, setInputKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showChat = messages.length > 0;

  // Active AI connection name and status (Luôn kết nối sẵn cho người dùng)
  const currentProviderInfo = useMemo(() => {
    if (preferredProvider === 'minimax' && minimaxKey) {
      return {
        name: 'MiniMax-Text-01 (LLM)',
        badge: 'MiniMax API 🤖',
        desc: 'Đã kích hoạt MiniMax LLM',
        icon: Bot,
        isOnline: true,
      };
    }
    // Mặc định kết nối sẵn Gemini 2.5 Flash siêu tốc độ & thông minh
    return {
      name: 'Gemini 2.5 Flash',
      badge: 'MiniMax & Gemini AI ⚡',
      desc: 'Đã kết nối AI thông minh · Sẵn sàng 24/7',
      icon: Zap,
      isOnline: true,
    };
  }, [geminiKey, minimaxKey, preferredProvider]);

  // Name calculation
  const firstName = useMemo(() => {
    if (!currentUser?.fullName) return 'bạn';
    const parts = currentUser.fullName.trim().split(' ');
    return parts[parts.length - 1];
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Open settings with current key
  const handleOpenSettings = () => {
    if (activeTab === 'gemini') {
      setInputKey(geminiKey);
    } else {
      setInputKey(minimaxKey);
    }
    setTestResult(null);
    setIsSettingsOpen(true);
  };

  // Switch tab in settings modal
  const handleSwitchTab = (tab: 'gemini' | 'minimax') => {
    setActiveTab(tab);
    setTestResult(null);
    if (tab === 'gemini') {
      setInputKey(geminiKey);
    } else {
      setInputKey(minimaxKey);
    }
  };

  // Restore built-in verified Gemini key
  const handleRestoreBuiltinKey = () => {
    const defaultKey = getGeminiApiKey();
    setInputKey(defaultKey);
    setTestResult(null);
  };

  // Handle Save API Key
  const handleSaveApiKey = () => {
    const trimmed = inputKey.trim();
    if (activeTab === 'gemini') {
      setGeminiApiKey(trimmed);
      setGeminiKeyState(trimmed || getGeminiApiKey());
      setPreferredAiProvider('gemini');
      setPreferredState('gemini');
    } else {
      setMinimaxApiKey(trimmed);
      setMinimaxKeyState(trimmed);
      if (trimmed) {
        setPreferredAiProvider('minimax');
        setPreferredState('minimax');
      }
    }
    setIsSettingsOpen(false);
    setTestResult(null);
  };

  // Handle Test Connection
  const handleTestKey = async () => {
    const keyToTest = inputKey.trim();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: `Vui lòng nhập API Key ${activeTab === 'gemini' ? 'Google Gemini' : 'MiniMax'} trước khi kiểm tra`,
      });
      return;
    }
    setTestingKey(true);
    setTestResult(null);
    const res = await testAiConnection(keyToTest, activeTab);
    setTestingKey(false);
    setTestResult(res);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

    try {
      const response = await askCellaAI({
        message: msg,
        category: cat,
        customerData: customerContext,
        history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        provider: response.provider,
        model: response.model,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: 'ai',
        text: 'Dạ đường truyền mạng đang bận một chút, em đã tra cứu thông tin theo chuẩn vận hành CELLA Studio & Academy cho bạn nhé 💕',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        provider: 'cella_engine',
        model: 'CELLA Expert Knowledge 2.0',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentCategory('Chung');
    setInputMessage('');
  };

  // Render markdown bold and bullets nicely
  const formatAiMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-[#14261C]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
      return (
        <span key={idx} className={`block ${isBullet ? 'pl-2.5 my-0.5' : ''}`}>
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="min-h-full bg-[#F4F7F4] bg-botanical-mesh flex flex-col relative" style={{ height: '100%' }}>
      {/* ─── Top Header (CELLA Brand Forest Aesthetics) ─── */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3.5 bg-white/95 backdrop-blur-xl border-b border-[#264736]/10 shadow-xs z-20">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#EAF2EC] text-[#264736] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2D503E] to-[#1A3326] flex items-center justify-center shadow-md">
                <Sparkles className="w-4.5 h-4.5 text-emerald-300" />
              </div>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${currentProviderInfo.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[14.5px] font-bold text-[#1A2820] leading-tight">CELLA AI Assistant</h2>
                <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                  {currentProviderInfo.badge}
                </span>
              </div>
              <p className="text-[10.5px] text-[#426953] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {currentProviderInfo.desc}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Key Settings Button */}
          <button
            onClick={handleOpenSettings}
            className="px-2.5 py-1.5 rounded-xl border border-[#264736]/20 bg-[#EAF2EC] text-[#1E3A2F] hover:bg-[#DFECE2] text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
            title="Cài đặt kết nối AI API (Gemini / MiniMax)"
          >
            <Key className="w-3.5 h-3.5 text-[#264736]" />
            <span>API Key</span>
          </button>

          {showChat && (
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EAF2EC] text-slate-500 transition-colors"
              title="Làm mới cuộc trò chuyện"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Context banner when customer is passed */}
      {customerContext?.name && (
        <div className="px-4 py-2 bg-[#EAF2EC] border-b border-[#264736]/10 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-[#264736] shrink-0" />
          <p className="text-[11px] text-[#1E3A2F] font-medium truncate">
            Đang tư vấn khách: <strong>{customerContext.name}</strong>
            {customerContext.crmStage && ` · ${customerContext.crmStage}`}
            {customerContext.totalSpent
              ? ` · Đã chi: ${customerContext.totalSpent.toLocaleString('vi-VN')}đ`
              : ''}
          </p>
        </div>
      )}

      {/* ─── Chat / Welcome Area ─── */}
      <div className="flex-1 overflow-y-auto pb-[105px] no-scrollbar px-3.5 pt-4">
        {!showChat ? (
          /* ── Welcome & System Training Guide ── */
          <div className="flex flex-col items-center pt-3 pb-4">
            {/* Robot Avatar */}
            <div className="relative w-20 h-20 mb-3">
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#2D503E] to-[#1A3326] flex items-center justify-center shadow-lg shadow-[#1A3326]/20 ring-4 ring-white">
                <Sparkles className="w-10 h-10 text-emerald-300 stroke-[1.8]" />
              </div>
            </div>

            {/* Personalized Greeting */}
            <h2 className="text-[17px] font-black text-[#1A2820] text-center">
              Chào {firstName}, em là CELLA AI! 🌿
            </h2>
            <p className="text-[12.5px] text-[#426953] mt-1 text-center max-w-xs leading-relaxed">
              Em đã được học toàn bộ kiến thức về Bảng giá dịch vụ, Khóa học Academy, Lịch hẹn và Kỹ thuật Makeup.
            </p>

            {/* Connection Status Pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#264736]/15 shadow-2xs text-[11.5px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-[#1E3A2F]">
                Đang kết nối: {currentProviderInfo.name}
              </span>
              <button
                onClick={handleOpenSettings}
                className="text-[10px] text-[#264736] underline font-bold ml-1 hover:text-[#173022]"
              >
                Đổi Key
              </button>
            </div>

            {/* System Knowledge Quick Prompts */}
            <div className="w-full mt-5 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#264736]">
                  Hỏi đáp nhanh về hệ thống CELLA:
                </span>
                <span className="text-[10px] text-slate-400">Chạm để hỏi</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {SYSTEM_TOPICS.map((topic, i) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(topic.prompt, topic.category)}
                      className="w-full flex items-center gap-3 p-3 bg-white/90 hover:bg-white rounded-2xl border border-[#264736]/10 shadow-xs hover:border-[#264736]/30 active:scale-[0.98] transition-all text-left group cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${topic.iconBg}`}>
                        <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#1A2820] group-hover:text-[#1E3A2F] truncate">
                          {topic.title}
                        </p>
                        <p className="text-[11px] text-[#557864] truncate">
                          {topic.category}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#264736] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── Chat Messages ── */
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2D503E] to-[#1A3326] flex items-center justify-center shrink-0 shadow-xs mb-1">
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                    </div>
                  )}
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#EAF2EC] border border-[#264736]/20 flex items-center justify-center shrink-0 mb-1">
                      <User className="w-4 h-4 text-[#264736]" />
                    </div>
                  )}

                  <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed relative group ${
                        isUser
                          ? 'btn-forest rounded-br-xs shadow-sm font-medium text-white'
                          : 'bg-white/95 border border-[#264736]/10 text-[#1A2820] rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {isUser ? msg.text : formatAiMessage(msg.text)}

                      {/* Copy action for AI messages */}
                      {!isUser && (
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-50 hover:bg-[#EAF2EC] text-slate-400 hover:text-[#264736] opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200/60 shadow-2xs"
                          title="Sao chép câu trả lời để gửi khách"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 px-1 mt-1">
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      {!isUser && msg.model && (
                        <span className="text-[9.5px] font-semibold text-[#426953] bg-[#EAF2EC] px-1.5 py-0.2 rounded-md">
                          {msg.model}
                        </span>
                      )}
                      {!isUser && copiedId === msg.id && (
                        <span className="text-[9.5px] text-emerald-700 font-bold">
                          ✓ Đã chép
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2D503E] to-[#1A3326] flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="bg-white/95 border border-[#264736]/10 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="text-xs text-[#264736] font-medium mr-1">CELLA AI đang suy nghĩ</span>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
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

      {/* ─── Bottom Input Bar ─── */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-xl border-t border-[#264736]/10 shadow-[0_-4px_20px_rgba(26,51,38,0.05)] z-20">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Hỏi về bảng giá, khóa học, lịch hẹn, makeup..."
            className="flex-1 h-12 px-4 rounded-full bg-[#F4F7F4] border border-[#264736]/15 text-[13.5px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#264736] focus:ring-2 focus:ring-[#264736]/20 transition-all text-[#1A2820]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isTyping}
            className="w-12 h-12 rounded-full btn-forest flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-5 h-5 -ml-0.5 text-white" />
          </button>
        </div>
      </div>

      {/* ─── MODAL CÀI ĐẶT API KEY (GOOGLE GEMINI & MINIMAX) ─── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF2EC] flex items-center justify-center text-[#264736]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1A2820]">Kết nối Trí tuệ AI CELLA</h3>
                  <p className="text-[11px] text-slate-500">Google Gemini 2.5 Flash & MiniMax LLM</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Switch Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleSwitchTab('gemini')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'gemini'
                    ? 'bg-white text-[#264736] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Gemini (Khuyên dùng)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchTab('minimax')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'minimax'
                    ? 'bg-white text-[#264736] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#264736]" />
                <span>MiniMax API</span>
              </button>
            </div>

            {/* Key Input */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {activeTab === 'gemini' ? 'Google Gemini API Key:' : 'MiniMax API Key:'}
                  </label>
                  {activeTab === 'gemini' && (
                    <button
                      type="button"
                      onClick={handleRestoreBuiltinKey}
                      className="text-[10.5px] text-[#264736] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Key sẵn có của hệ thống
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder={
                      activeTab === 'gemini'
                        ? 'Dán Gemini API Key (AQ... hoặc AIzaSy...)'
                        : 'Dán MiniMax API Key (sk-... hoặc ey...)'
                    }
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-xs font-mono focus:border-[#264736] focus:outline-none focus:ring-2 focus:ring-[#264736]/20 bg-[#F8FAF8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Guide card */}
              <div className="text-[11.5px] text-slate-600 bg-[#EAF2EC]/60 p-3 rounded-2xl border border-[#264736]/10 space-y-1">
                {activeTab === 'gemini' ? (
                  <>
                    <p className="font-bold text-[#1E3A2F]">⚡ Google Gemini 2.5 Flash:</p>
                    <p>• Phản hồi siêu tốc độ (0.5s - 1s), tiếng Việt tự nhiên, am hiểu tâm lý khách hàng.</p>
                    <p>• Hệ thống đã được tích hợp sẵn Key chuẩn của CELLA. Bạn có thể bấm <strong>"Kiểm tra kết nối"</strong> để xác thực ngay.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#1E3A2F]">🤖 MiniMax API (abab6.5s / MiniMax-Text-01):</p>
                    <p>• Đăng ký tại <a href="https://platform.minimaxi.com" target="_blank" rel="noreferrer" className="text-[#264736] font-bold underline inline-flex items-center gap-0.5">platform.minimaxi.com <ExternalLink className="w-3 h-3" /></a></p>
                    <p>• Tạo key trong mục API Keys và dán vào ô bên trên.</p>
                  </>
                )}
              </div>

              {/* Test Connection Result */}
              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testingKey}
                className="flex-1 py-2.5 rounded-xl border border-[#264736]/20 bg-[#EAF2EC] text-[#1E3A2F] text-xs font-bold hover:bg-[#DFECE2] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {testingKey ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 rounded-xl btn-forest text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Lưu & Kích hoạt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
