import React, { useState } from 'react';
import { MakeupLook, ScreenId } from '../types';
import {
  ChevronLeft,
  Heart,
  Share2,
  ExternalLink,
  Sparkles,
  Star,
  Clock,
  Play,
  CalendarPlus,
  Check,
  Smile,
  Zap,
} from 'lucide-react';

interface LookbookDetailScreenProps {
  look?: MakeupLook;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectLookForBooking?: (look: MakeupLook) => void;
}

export const LookbookDetailScreen: React.FC<LookbookDetailScreenProps> = ({
  look,
  onBack,
  onNavigate,
  onSelectLookForBooking,
}) => {
  const [isLiked, setIsLiked] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'technique'>('products');
  const [copied, setCopied] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  const previewPhotos = [
    look?.imageUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookNow = () => {
    if (look && onSelectLookForBooking) {
      onSelectLookForBooking(look);
    }
    onNavigate('create_booking');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F3FF]/70 via-[#FDF2F8]/60 to-[#F8F9FF] text-slate-800 pb-32">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2.5 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-xs">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-700 active:scale-95 transition-transform hover:bg-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-[#5850EC] text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Artistic Lookbook</span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href="/LookbookDetail.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center text-[#5850EC] active:scale-95 transition-transform"
            title="Mở HTML độc lập"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center active:scale-95 transition-transform"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-600 active:scale-95 transition-transform relative"
            title="Chia sẻ layout"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="px-4 pt-3.5 space-y-4 max-w-lg mx-auto">
        {/* Hero Image Card with Prism Hologram Effect */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-slate-900 h-96 flex items-end p-4 group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url('${previewPhotos[selectedPhotoIdx]}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
            <span className="px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              Look Mùa Mới • {look?.category || 'Ethereal Prism'}
            </span>
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-slate-800 text-xs font-bold border border-white/40 shadow-sm flex items-center gap-1 hover:bg-white active:scale-95 transition-transform"
            >
              <Sparkles className="w-3 h-3 text-[#5850EC]" />
              <span>AR Try-on</span>
            </button>
          </div>

          {/* Floating Thumbnail Previews & Code Badge */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              {previewPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIdx(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden shadow-md transition-all ${
                    selectedPhotoIdx === idx
                      ? 'border-2 border-white scale-105 ring-2 ring-[#5850EC]/40'
                      : 'border border-white/60 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/75 backdrop-blur-md border border-white/20 text-white text-right">
              <div className="text-[10px] text-slate-300 tracking-wider">CELLA ATELIER</div>
              <div className="text-xs font-bold">No. 017</div>
            </div>
          </div>
        </section>

        {/* Title & Price Block */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{look?.rating || '4.9'}</span>
            </span>
            <span>({look?.reviewsCount || '420'}+ lưu)</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>60 – 75 phút</span>
            </span>
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {look?.title || 'Nữ Thần Ánh Sáng & Thủy Tinh'}
            </h1>
            <p className="text-[11px] font-bold tracking-wider text-[#5850EC] uppercase mt-0.5">
              ETHEREAL PRISM HOLOGRAM FINISH
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 flex items-center justify-between shadow-xs border border-white/80">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Đơn giá tiêu chuẩn</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900">
                  {(look?.price || 1250000).toLocaleString('vi-VN')}đ
                </span>
                <span className="text-xs text-slate-400 line-through">1.450.000đ</span>
              </div>
            </div>
            <div className="text-right bg-indigo-50/80 px-3 py-2 rounded-xl border border-indigo-100/70">
              <div className="text-[10px] text-[#5850EC] font-bold uppercase">Hội viên CELLA Pass</div>
              <div className="text-sm font-bold text-indigo-700">
                {(look?.memberPrice || 1050000).toLocaleString('vi-VN')}đ
              </div>
            </div>
          </div>
        </section>

        {/* Makeup Artist Assigned */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 flex items-center justify-between shadow-xs border border-white/80">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Master Đặng Thuỳ Tiên"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {look?.artistName || 'Master Đặng Thuỳ Tiên'}
                </h4>
                <span className="text-[#5850EC] text-xs">★</span>
              </div>
              <p className="text-xs text-slate-500">CELLA Flagship Studio • Q.1, TP.HCM</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('feed')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
          >
            Xem hồ sơ
          </button>
        </section>

        {/* Breakdown / Color Swatches Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Bảng Phân Tích Layout Makeup</h3>
            <span
              onClick={() => onNavigate('lookbook')}
              className="text-xs text-[#5850EC] font-medium cursor-pointer hover:underline"
            >
              Xem Before/After
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-white/70 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs shrink-0">
                01
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">MÔI</div>
                <div className="text-xs font-semibold text-slate-800">Son bóng pha lê</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-white/70 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-[#5850EC] font-bold text-xs shrink-0">
                02
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">MẮT</div>
                <div className="text-xs font-semibold text-slate-800">Hologram Prism</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-white/70 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                03
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">MÁ</div>
                <div className="text-xs font-semibold text-slate-800">Hồng đào sương...</div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-white/70 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs shrink-0">
                04
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">BẮT SÁNG</div>
                <div className="text-xs font-semibold text-slate-800">Highlight thủy t...</div>
              </div>
            </div>
          </div>

          {/* Skin & Face Shape Badges */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 space-y-3 border border-white/70 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[#5850EC] text-xs">
                  <Smile className="w-3 h-3" />
                </span>
                Dáng mặt thích hợp
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                  Trái xoan
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                  Mặt tròn
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                  Góc cạnh
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-200/60" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 text-xs">
                  <Zap className="w-3 h-3" />
                </span>
                Tone da lý tưởng
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                  Cool Undertone
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                  Neutral Tone
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Products & Techniques Tabs */}
        <section className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-white shadow-xs text-slate-900 border border-slate-200/70'
                  : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sản phẩm sử dụng (3)
            </button>
            <button
              onClick={() => setActiveTab('technique')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'technique'
                  ? 'bg-white shadow-xs text-slate-900 border border-slate-200/70'
                  : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Kỹ thuật trang điểm
            </button>
          </div>

          {activeTab === 'products' ? (
            <div className="space-y-2">
              <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/70 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5850EC] text-lg">
                    🧴
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Kem nền CELLA Liquid Glass</h5>
                    <p className="text-[11px] text-slate-500">Tạo hiệu ứng bề mặt trong vắt mọng nước</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">
                  Tone #01
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/70 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 text-lg">
                    ✨
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Prism Starlight Highlighter</h5>
                    <p className="text-[11px] text-slate-500">Bắt sáng lăng kính quang phổ holographic</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">
                  Aura Glow
                </span>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/70 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 text-lg">
                    💄
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Son Thạch Dưỡng CELLA Dew</h5>
                    <p className="text-[11px] text-slate-500">Chiết xuất tinh chất cánh hồng tươi</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">
                  No. 04 Pink
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-xs space-y-2">
              <h5 className="text-xs font-bold text-slate-900">Kỹ thuật tạo màng nước Glass-Skin 4 bước</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ứng dụng công nghệ khóa ẩm vi hạt Micro-Dew kết hợp cọ vát lông cừu tán đa hướng giúp hạt phấn bám sát
                lỗ chân lông mà không gây bí tắc.
              </p>
              <button
                onClick={() => onNavigate('video_tutorial')}
                className="mt-2 text-xs font-bold text-[#5850EC] flex items-center gap-1 hover:underline"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Xem video hướng dẫn chi tiết Masterclass</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Fixed Action Dock */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-white/85 backdrop-blur-xl border-t border-white/60 flex items-center gap-3 z-40 shadow-lg">
        <button
          onClick={() => onNavigate('video_tutorial')}
          className="px-4 py-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-800 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
          <span>Video</span>
        </button>

        <button
          onClick={handleBookNow}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#5850EC] to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>Đặt lịch Makeup Look này</span>
          <CalendarPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
