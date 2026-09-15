import React, { useState } from 'react';
import { ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  Headphones,
  Lightbulb,
  MessageSquare,
  BarChart2,
  GraduationCap,
  HelpCircle,
  Send,
  Bot,
} from 'lucide-react';

interface AIAssistantScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBack,
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const suggestions = [
    { text: 'Hỗ trợ bán hàng', icon: Headphones, color: 'blue' },
    { text: 'Gợi ý chăm sóc khách hàng', icon: Lightbulb, color: 'emerald' },
    { text: 'Tạo nội dung mạng xã hội', icon: MessageSquare, color: 'sky' },
    { text: 'Phân tích báo cáo', icon: BarChart2, color: 'rose' },
    { text: 'Hỗ trợ đào tạo', icon: GraduationCap, color: 'amber' },
    { text: 'Trả lời câu hỏi', icon: HelpCircle, color: 'purple' },
  ];

  return (
    <div className="min-h-full bg-[#F8F9FA] pb-[140px] text-slate-900 animate-in fade-in duration-300 flex flex-col relative">
      <div className="pt-10 pb-4 px-4 flex items-center justify-center relative">
        <h2 className="text-[18px] font-black text-slate-900">AI - Trợ lý CELLA</h2>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-4 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-[#544CDE]/20 rounded-full blur-2xl"></div>
            <div className="w-full h-full relative z-10 flex items-center justify-center drop-shadow-xl text-[#544CDE]">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a5 5 0 0 1 5 5v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5a5 5 0 0 1 5-5h1V5.73A2 2 0 0 1 12 2zm3.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-[16px] font-black text-slate-900 text-center">
            Xin chào! Tôi là trợ lý AI của CELLA
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Tôi có thể giúp gì cho bạn hôm nay?
          </p>
        </div>

        <div className="space-y-3">
          {suggestions.map((item, index) => {
            const Icon = item.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-500',
              emerald: 'bg-emerald-50 text-emerald-500',
              sky: 'bg-sky-50 text-sky-500',
              rose: 'bg-rose-50 text-rose-500',
              amber: 'bg-amber-50 text-amber-500',
              purple: 'bg-purple-50 text-purple-500',
            }[item.color];

            return (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-200/50 hover:border-[#544CDE]/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses}`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[14px] font-bold text-slate-700">
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Chat Input */}
      <div className="fixed bottom-[80px] inset-x-0 p-4 bg-white border-t border-slate-100">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 h-12 px-4 rounded-full bg-slate-50 border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE]"
          />
          <button className="w-12 h-12 rounded-full bg-[#544CDE] text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 hover:bg-[#4338ca] active:scale-95 transition-all">
            <Send className="w-5 h-5 -ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
