import React, { useState } from 'react';
import { MakeupLook, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  Sparkles,
  Star,
  Clock,
  Palette,
  Play,
  CheckCircle2,
  CalendarPlus,
  Sliders,
  ChevronRight,
  Filter,
  LayoutGrid,
  Eye,
  Heart,
  ExternalLink,
  Search,
} from 'lucide-react';

interface LookbookScreenProps {
  looks: MakeupLook[];
  onSelectLookForBooking: (look: MakeupLook) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectLookForDetail?: (look: MakeupLook) => void;
  onBack?: () => void;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  looks,
  onSelectLookForBooking,
  onNavigate,
  onSelectLookForDetail,
  onBack,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLook, setSelectedLook] = useState<MakeupLook>(looks[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // for before/after comparison
  const [activeStepTab, setActiveStepTab] = useState<number>(0);
  const [likedLooks, setLikedLooks] = useState<Record<string, boolean>>({
    'look-1': true,
    'look-3': true,
  });

  const categories = [
    { id: 'ALL', label: '✦ Tất cả (96)' },
    { id: 'BRIDAL', label: 'Glass Skin & Glowy' },
    { id: 'Y2K', label: 'Sunset Blush' },
    { id: 'EDITORIAL', label: 'Ethereal Violet' },
  ];

  const filteredLooks = looks.filter((l) =>
    selectedCategory === 'ALL' ? true : l.category === selectedCategory
  );

  const toggleLike = (lookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedLooks(prev => ({
      ...prev,
      [lookId]: !prev[lookId],
    }));
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-[#F0F3FF]/80 via-[#FDF2F8]/60 to-[#F8F9FF] pb-24 text-slate-900">
      <MobileHeader
        title="Mẫu Makeup Nghệ Thuật"
        subtitle="CELLA BEAUTÉ ✦ L'Art de l'Aura"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('video_tutorial')}
              className="p-2 rounded-full hover:bg-white/80 text-rose-500 transition-colors"
              title="Xem Video Masterclass"
            >
              <Play className="w-4 h-4 fill-rose-500" />
            </button>
            <a
              href="/LookbookDetail.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/80 text-[#5850EC] transition-colors"
              title="Mở Chi Tiết HTML độc lập"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => onNavigate('create_booking')}
              className="p-2 rounded-full hover:bg-white/80 text-[#5850EC]"
              title="Đặt lịch"
            >
              <CalendarPlus className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="px-4 pt-2 space-y-4">
        {/* View Mode Toggle Switch */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-md p-1 rounded-2xl border border-white/60 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#5850EC] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Bộ Sưu Tập Grid</span>
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'detail'
                ? 'bg-[#5850EC] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>So sánh Before / After</span>
          </button>
        </div>

        {/* Sub-header Badge & Tagline */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            Bộ Sưu Tập Xu Hướng Sáng Tạo 2025
          </span>
          <span className="font-serif italic text-[#5850EC] text-xs tracking-wider">L'Art de l'Aura</span>
        </div>

        {/* Category Filter Pills (Aura Color Filter Chips) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#5850EC] text-white shadow-xs'
                  : 'bg-white/80 backdrop-blur-md text-slate-700 border border-white/60 hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {viewMode === 'grid' ? (
          /* ========================================================================= */
          /* 1. GRID NGHỆ THUẬT (CELLA GLASSMORPHISM & AURA GRID) */
          /* ========================================================================= */
          <div className="space-y-4">
            {/* 1. Hero Showcase Spotlight Card */}
            <section className="relative rounded-3xl overflow-hidden shadow-xl border border-white/60 aspect-[4/5] flex flex-col justify-between p-4 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-slate-950/20" />

              {/* Top Badges Inside Hero */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5">
                  <span className="text-amber-300">✦</span>
                  LOOK CỦA MÙA: PRISM GLASS
                </span>
                <button
                  onClick={() => setLikedLooks(p => ({ ...p, hero: !p.hero }))}
                  className={`w-9 h-9 rounded-full backdrop-blur-md border border-white/40 flex items-center justify-center transition-transform active:scale-90 ${
                    likedLooks.hero ? 'bg-pink-500 text-white' : 'bg-white/30 text-white'
                  }`}
                >
                  <span className="text-sm">✧</span>
                </button>
              </div>

              {/* Bottom Details Inside Hero Card */}
              <div className="relative z-10 bg-slate-950/75 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    Tone Cool Blue & Rose Dewy
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    ★ 4.9 <span className="text-slate-400 font-normal">(420+ lượt lưu)</span>
                  </span>
                </div>

                <h2 className="text-base font-bold text-white leading-snug">
                  Nữ Thần Ánh Sáng & Thủy Tinh (Ethereal Prism)
                </h2>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                      BẢNG MÀU:
                    </span>
                    <div className="flex -space-x-1.5 items-center">
                      <span className="w-4 h-4 rounded-full bg-indigo-300 border border-white/70" />
                      <span className="w-4 h-4 rounded-full bg-pink-300 border border-white/70" />
                      <span className="w-4 h-4 rounded-full bg-sky-200 border border-white/70" />
                      <span className="text-[10px] text-slate-300 pl-2">+2</span>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-white">1.250.000đ</div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onSelectLookForDetail) {
                        onSelectLookForDetail(looks[0]);
                      } else {
                        onNavigate('lookbook_detail');
                      }
                    }}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                  >
                    <span>Xem Chi Tiết Look</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLook(looks[0]);
                      setViewMode('detail');
                    }}
                    className="py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/30"
                  >
                    <span>Before / After</span>
                    <span>✧</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. 2-Column Curated Artistic Grid Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bộ Sưu Tập Nghệ Thuật Chọn Lọc</h3>
                  <p className="text-[11px] text-slate-500">Thiết kế bởi Master Stylist CELLA Signature</p>
                </div>
                <span className="text-xs font-semibold text-[#5850EC]">
                  {filteredLooks.length} mẫu
                </span>
              </div>

              {/* 2-Column Grid matching LookbookGalleryGrid.html */}
              <div className="grid grid-cols-2 gap-3.5">
                {filteredLooks.map((look) => {
                  const isLiked = likedLooks[look.id] || false;
                  return (
                    <div
                      key={look.id}
                      onClick={() => {
                        if (onSelectLookForDetail) {
                          onSelectLookForDetail(look);
                        } else {
                          setSelectedLook(look);
                          setViewMode('detail');
                        }
                      }}
                      className="bg-white/75 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden p-2 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={look.imageUrl}
                          alt={look.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                        {/* Badges */}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-md text-[10px] font-bold text-pink-300">
                          {look.category}
                        </span>

                        <button
                          onClick={(e) => toggleLike(look.id, e)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-xs"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate">{look.artistName}</span>
                          <span className="text-amber-500 font-bold flex items-center gap-0.5">
                            ★ {look.rating}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {look.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {look.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-xs font-extrabold text-[#5850EC]">
                            {look.price.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {look.reviewsCount || 420}+ lưu
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Smart Diagnosis Banner Card */}
            <section className="bg-gradient-to-r from-indigo-50/70 via-white/85 to-purple-50/70 backdrop-blur-md rounded-3xl p-4 border border-[#5850EC]/20 flex items-center justify-between shadow-xs">
              <div className="space-y-1 max-w-[70%]">
                <div className="text-[10px] font-bold tracking-wider text-[#5850EC] uppercase flex items-center gap-1">
                  <span>✦ SMART DIAGNOSIS ✦</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  Khám Phá Sắc Độ Aura Cá Nhân Của Bạn
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Quét quang phổ khuôn mặt để tìm gam màu má, phấn mắt và độ bóng phù hợp nhất.
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  Đã có hơn 12.000+ lượt test thành công
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('ai_assistant')}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md active:scale-95 transition-transform flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Bắt Đầu Test</span>
                  <span>✦</span>
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. CHẾ ĐỘ CHI TIẾT & SO SÁNH BEFORE / AFTER */
          /* ========================================================================= */
          <div className="space-y-4">
            {/* Look Carousel Selector */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {filteredLooks.map((look) => {
                const isSelected = selectedLook.id === look.id;
                return (
                  <div
                    key={look.id}
                    onClick={() => setSelectedLook(look)}
                    className={`min-w-[170px] rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-[#5850EC] shadow-md scale-102 ring-2 ring-[#5850EC]/30'
                        : 'border-white bg-white opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="h-28 w-full relative">
                      <img
                        src={look.imageUrl}
                        alt={look.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{look.rating}</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {look.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#5850EC] mt-0.5">
                        {look.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Look Spotlight Card */}
            <GlassCard className="p-4 bg-white/90 backdrop-blur-md space-y-3.5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <AuraBadge variant="purple" size="xs">
                    {selectedLook.category}
                  </AuraBadge>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedLook.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chuyên gia: <strong className="text-slate-800">{selectedLook.artistName}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#5850EC] block">
                    {selectedLook.price.toLocaleString('vi-VN')} đ
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    VIP: {selectedLook.memberPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedLook.description}
              </p>

              {/* Interactive Before / After Comparison Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>So sánh Trước (Before) / Sau (After)</span>
                  <span className="text-[11px] font-medium text-[#5850EC]">Kéo thanh trượt</span>
                </div>

                <div className="relative h-60 w-full rounded-2xl overflow-hidden select-none border border-slate-200 shadow-inner">
                  {/* After image */}
                  <img
                    src={selectedLook.afterImageUrl || selectedLook.imageUrl}
                    alt="After Makeup"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <span className="absolute bottom-2 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    SAU MAKEUP (GLAM)
                  </span>

                  {/* Before image (clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={selectedLook.beforeImageUrl || selectedLook.imageUrl}
                      alt="Before Makeup"
                      className="w-full h-full object-cover"
                      style={{ width: '100%', maxWidth: 'none' }}
                    />
                    <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      MẶT MỘC (BEFORE)
                    </span>
                  </div>

                  {/* Slider divider line and drag handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-md border-2 border-[#5850EC] flex items-center justify-center text-[#5850EC]">
                      <Sliders className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Hidden range input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                  />
                </div>
              </div>

              {/* Dải Swatch màu phối hợp */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#5850EC]" />
                  <span>BẢNG SWATCH PHỐI MÀU GỢI Ý</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLook.swatches.map((swatch, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#F8F9FF] border border-slate-100 flex items-center gap-2"
                    >
                      <div
                        className="w-6 h-6 rounded-full shrink-0 shadow-xs border border-white"
                        style={{ backgroundColor: swatch.colorCode }}
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block leading-none">
                          {swatch.type}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate block mt-0.5">
                          {swatch.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dáng mặt & Tone da phù hợp */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-purple-50">
                  <span className="text-[10px] font-bold text-purple-700 block uppercase">
                    Dáng mặt tối ưu
                  </span>
                  <span className="text-xs font-semibold text-purple-900 mt-0.5 block">
                    {selectedLook.faceShapeFit.join(', ')}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">
                    Sắc tố da (Undertone)
                  </span>
                  <span className="text-xs font-semibold text-amber-900 mt-0.5 block">
                    {selectedLook.undertoneFit.join(', ')}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              {selectedLook.steps && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 text-rose-500" />
                    <span>CÁC BƯỚC THỰC HIỆN & BÍ QUYẾT MASTER</span>
                  </h4>

                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {selectedLook.steps.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStepTab(idx)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          activeStepTab === idx
                            ? 'bg-[#5850EC] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Bước {idx + 1}
                      </button>
                    ))}
                  </div>

                  {selectedLook.steps[activeStepTab] && (
                    <div className="p-3 rounded-xl bg-[#EFF4FF] border border-[#5850EC]/20 space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-[#5850EC]">
                        <span>{selectedLook.steps[activeStepTab].title}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          {selectedLook.steps[activeStepTab].duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedLook.steps[activeStepTab].description}
                      </p>
                      <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/80">
                        💡 <strong>Pro Tip:</strong> {selectedLook.steps[activeStepTab].proTip}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (onSelectLookForDetail) {
                      onSelectLookForDetail(selectedLook);
                    } else {
                      onNavigate('lookbook_detail');
                    }
                  }}
                  className="py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5850EC]" />
                  <span>Chi tiết Atelier 3D</span>
                </button>
                <button
                  onClick={() => onNavigate('video_tutorial')}
                  className="py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-rose-600 hover:bg-rose-100 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-rose-600" />
                  <span>Video Masterclass</span>
                </button>
              </div>

              {/* Booking CTA Button */}
              <PrimaryButton
                size="lg"
                fullWidth
                onClick={() => {
                  onSelectLookForBooking(selectedLook);
                  onNavigate('create_booking');
                }}
                icon={<CalendarPlus className="w-5 h-5" />}
              >
                Đặt lịch hẹn với layout này
              </PrimaryButton>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
