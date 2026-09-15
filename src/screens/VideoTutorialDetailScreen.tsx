import React, { useState } from 'react';
import { ScreenId } from '../types';
import {
  ChevronLeft,
  MoreHorizontal,
  Play,
  Pause,
  Maximize2,
  Heart,
  Eye,
  MessageCircle,
  Bookmark,
  ExternalLink,
  Sparkles,
  CalendarPlus,
  Check,
} from 'lucide-react';

interface VideoTutorialDetailScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const VideoTutorialDetailScreen: React.FC<VideoTutorialDetailScreenProps> = ({
  onBack,
  onNavigate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(2819);
  const [activeStepIdx, setActiveStepIdx] = useState(1); // Step 2 active by default
  const [currentTimeStr, setCurrentTimeStr] = useState('02:45');
  const [progressPercent, setProgressPercent] = useState(42);

  const steps = [
    {
      stepNumber: '01',
      title: 'Chuẩn bị da & Tạo nền Glass Skin',
      timeRange: '00:00 - 01:45',
      desc: 'Dưỡng ẩm sâu đa tầng, mix primer bắt sáng, dặm nền mỏng mịn tạo độ bóng trong suốt tự nhiên.',
      timeVal: '01:10',
      percent: 18,
      done: true,
    },
    {
      stepNumber: '02',
      title: 'Kỹ thuật Má hồng Aura sương mờ',
      timeRange: '01:45 - 03:20',
      desc: 'Khuếch tán đốm màu cam hồng gradient bằng cọ vát mềm, tạo hiệu ứng ửng hồng tỏa sáng từ bên trong.',
      timeVal: '02:45',
      percent: 42,
      done: false,
    },
    {
      stepNumber: '03',
      title: 'Tán Mắt Nhũ Prism Holographic',
      timeRange: '03:20 - 05:10',
      desc: 'Layer nhũ lăng kính quang phổ, nhấn bọng mắt aegyo-sal tạo chiều sâu cuốn hút dưới ánh đèn studio.',
      timeVal: '04:15',
      percent: 68,
      done: false,
    },
    {
      stepNumber: '04',
      title: 'Khóa nền & Phủ Son bóng pha lê',
      timeRange: '05:10 - 06:18',
      desc: 'Xịt khóa sương vi hạt giữ ẩm 12h và hoàn thiện làn môi căng mọng 3D.',
      timeVal: '05:40',
      percent: 90,
      done: false,
    },
  ];

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setIsLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleSelectStep = (idx: number) => {
    setActiveStepIdx(idx);
    setCurrentTimeStr(steps[idx].timeVal);
    setProgressPercent(steps[idx].percent);
    setIsPlaying(true);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
    setProgressPercent(percent);

    const totalSeconds = 378; // 06:18
    const curSec = Math.round((percent / 100) * totalSeconds);
    const m = Math.floor(curSec / 60);
    const s = curSec % 60;
    setCurrentTimeStr(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F3FF]/70 via-[#FDF2F8]/60 to-[#F8F9FF] text-slate-800 pb-32">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2.5 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-xs">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-transform hover:bg-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Kỹ Thuật & Review</h2>
          <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
            CELLA MASTERCLASS
          </p>
        </div>

        <div className="flex items-center gap-1">
          <a
            href="/VideoTutorialDetail.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center text-[#5850EC] active:scale-95 transition-transform"
            title="Mở HTML độc lập"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button className="w-9 h-9 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="px-4 pt-3 space-y-4 max-w-lg mx-auto">
        {/* Video Player Frame Component */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-slate-950 aspect-[4/3] flex flex-col justify-between p-4 group">
          {/* Video Artwork */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80')",
              opacity: 0.85,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40" />

          {/* Video Top Controls */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              4K Glass Skin Master
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold">
              1080P HD
            </span>
          </div>

          {/* Center Big Play/Pause Button */}
          <div className="relative z-10 self-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl flex items-center justify-center text-[#5850EC] pl-0.5 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-[#5850EC] text-[#5850EC]" />
              ) : (
                <Play className="w-7 h-7 fill-[#5850EC] text-[#5850EC] ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Timeline Bar */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs text-white font-medium">
              <span>{currentTimeStr}</span>
              <div
                onClick={handleTimelineClick}
                className="flex-1 mx-3 h-2 bg-white/30 rounded-full overflow-hidden relative cursor-pointer group/bar"
              >
                <div
                  className="h-full bg-[#5850EC] rounded-full transition-all duration-300 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-xs" />
                </div>
              </div>
              <span>06:18</span>
              <button
                onClick={() => alert('Chế độ toàn màn hình đã sẵn sàng.')}
                className="ml-2 text-white/80 hover:text-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Video Details & Author Info */}
        <section className="space-y-3">
          <h1 className="text-base font-bold text-slate-900 leading-snug">
            Kỹ Thuật Đánh Nền Thủy Tinh & Mắt Nhũ Prism Holographic
          </h1>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Master Đặng Thuỳ Tiên"
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-200"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-slate-900">Master Đặng Thuỳ Tiên</h4>
                  <span className="text-[#5850EC] text-xs">★</span>
                </div>
                <p className="text-xs text-slate-500">28.5k người theo dõi</p>
              </div>
            </div>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-indigo-50 border border-indigo-100 text-[#5850EC] hover:bg-indigo-100'
              }`}
            >
              {isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi'}
            </button>
          </div>

          {/* Social Metrics */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 pb-2 border-b border-slate-200/60">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>14.2k</span>
            </span>
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 font-semibold transition-transform active:scale-110 ${
                isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
              <span>{(likeCount / 1000).toFixed(1)}k</span>
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>342</span>
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              <span>890</span>
            </span>
          </div>
        </section>

        {/* Products Tagged in Video */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sản phẩm trong video
            </h3>
            <span className="text-xs text-[#5850EC] font-medium">3 món</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            <div className="min-w-[190px] bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/70 space-y-1 shrink-0 shadow-xs">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-[#5850EC] text-[10px] font-bold">
                1 • BẢNG MẮT
              </span>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                CELLA Prism Glass Shadow Palette
              </h5>
              <div className="text-xs font-extrabold text-[#5850EC]">650.000đ</div>
            </div>

            <div className="min-w-[190px] bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/70 space-y-1 shrink-0 shadow-xs">
              <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-600 text-[10px] font-bold">
                2 • KEM LÓT
              </span>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                Aura Dew Glow Primer Base
              </h5>
              <div className="text-xs font-extrabold text-[#5850EC]">420.000đ</div>
            </div>

            <div className="min-w-[190px] bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/70 space-y-1 shrink-0 shadow-xs">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold">
                3 • SON DƯỠNG
              </span>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                CELLA Dew Tint Cánh Hồng
              </h5>
              <div className="text-xs font-extrabold text-[#5850EC]">350.000đ</div>
            </div>
          </div>
        </section>

        {/* Interactive Timeline Steps (Chapters) */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Các bước kỹ thuật (Timeline)
            </h3>
            <span className="text-xs text-slate-400">4 giai đoạn</span>
          </div>

          <div className="space-y-2">
            {steps.map((s, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <div
                  key={s.stepNumber}
                  onClick={() => handleSelectStep(idx)}
                  className={`p-3.5 rounded-2xl flex items-start justify-between border-l-4 cursor-pointer transition-all shadow-xs ${
                    isActive
                      ? 'border-l-[#5850EC] bg-indigo-50/70 border border-indigo-100'
                      : s.done
                      ? 'border-l-emerald-500 bg-white/80 border border-white/70 hover:bg-white'
                      : 'border-l-slate-300 bg-white/80 border border-white/70 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isActive ? 'text-indigo-900' : 'text-slate-900'
                        }`}
                      >
                        {s.stepNumber}. {s.title}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700'
                            : s.done
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.timeRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>

                  {isActive ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5850EC] animate-ping shrink-0 mt-1 ml-2" />
                  ) : s.done ? (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1 ml-2" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Pro Tip Box */}
        <section className="bg-gradient-to-r from-indigo-50/80 to-pink-50/80 p-4 rounded-2xl border border-indigo-100/80 space-y-1 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs">
            <span>✨ Mẹo độc quyền từ Master Tiên:</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sau bước kem lót, hãy xoa ấm 2 lòng bàn tay và áp nhẹ lên gò má 10 giây trước khi đánh nền để
            kem thẩm thấu sâu, tránh tình trạng mốc nền (cakey).
          </p>
        </section>
      </main>

      {/* Bottom Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-white/85 backdrop-blur-xl border-t border-white/60 flex items-center gap-3 z-40 shadow-lg">
        <button
          onClick={() => onNavigate('ai_assistant')}
          className="px-4 py-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-[#5850EC] text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-[#5850EC]" />
          <span>Thử Makeup AI</span>
        </button>

        <button
          onClick={() => onNavigate('create_booking')}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#5850EC] to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>Đặt lịch dịch vụ này</span>
          <CalendarPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
