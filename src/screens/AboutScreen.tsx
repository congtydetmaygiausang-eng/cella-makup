import React, { useState } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import {
  Building2, MapPin, Phone, Mail, Clock, Award, Star,
  CheckCircle2, Sparkles, GraduationCap, ChevronRight,
  ShieldCheck, Heart, Users, ExternalLink, Calendar,
  MessageCircle, Play, Image as ImageIcon, BookOpen,
  Gift, Trophy, Globe, Compass, Quote, ArrowRight,
  Share2, Camera, Layers, Check
} from 'lucide-react';

interface AboutScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  currentUser?: Staff;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'founder' | 'gallery' | 'commitments' | 'contact'>('story');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Gallery data directly from cellamakeup.vn
  const galleryItems = [
    {
      title: 'Cella Hương Phượng — Nhà sáng lập',
      desc: 'Bàn Tay Vàng Makeup Châu Á 2025 tại Asia Beauty Festival',
      category: 'Founder',
      url: 'https://cellamakeup.vn/blog/images/founder.jpg',
      fallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Đội ngũ Artist Cella Makeup tại Studio Thái Bình',
      desc: 'Quy tụ các Artist chuyên nghiệp, tận tâm và giàu kinh nghiệm',
      category: 'Đội ngũ',
      url: 'https://cellamakeup.vn/images/gt-doi-ngu.jpg',
      fallback: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Lớp học thực hành 1:1 tại CELLA ACADEMY',
      desc: 'Giảng viên uốn nắn từng nét cọ, sửa lỗi trực tiếp trên mẫu thật',
      category: 'Đào tạo',
      url: 'https://cellamakeup.vn/images/hero-workshop.jpg',
      fallback: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Khóa Makeup Cá Nhân — Tự làm đẹp cho mình',
      desc: 'Lớp tối đa 5 người, tự tay hoàn thiện layout rạng ngời',
      category: 'Cá nhân',
      url: 'https://cellamakeup.vn/images/gt-2.jpg',
      fallback: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Workshop Makeup trường học & doanh nghiệp',
      desc: 'Đào tạo tác phong chỉn chu, thanh lịch cho tổ chức',
      category: 'Sự kiện',
      url: 'https://cellamakeup.vn/images/gt-3.jpg',
      fallback: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Không gian Studio & Atelier Thái Bình',
      desc: '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình',
      category: 'Studio',
      url: 'https://cellamakeup.vn/images/og-share.jpg',
      fallback: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const featuredArticles = [
    {
      title: 'Ba đến năm phút chờ sau skincare quyết định lớp nền có mốc hay không',
      cat: 'Kỹ thuật & Da',
      date: 'Mẹo làm nghề',
    },
    {
      title: 'Tay nghề không nằm ở cây cọ đắt tiền',
      cat: 'Nghề Makeup & Học viên',
      date: 'Chuyện nghề',
    },
    {
      title: 'Khách khó tính dạy tôi điều mà khách dễ tính không dạy được',
      cat: 'Mối quan hệ',
      date: 'Trải nghiệm',
    },
    {
      title: 'Phong thái không phải dáng đi, mà là cách bạn phản ứng',
      cat: 'Phong thái & Tính nữ',
      date: 'Tư duy sống',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 text-slate-800 animate-in fade-in duration-300 select-none">
      {/* ── HEADER ── */}
      <MobileHeader
        title="Giới thiệu CELLA"
        subtitle="CELLA MAKEUP ACADEMY"
        showBack={true}
        onBack={onBack}
        rightAction={
          <a
            href="tel:0961161994"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30 text-xs font-bold shadow-2xs hover:bg-amber-500/20 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span>096 116 1994</span>
          </a>
        }
      />

      {/* ── HERO BANNER (Luxury Noir & Gold Theme) ── */}
      <div className="relative bg-[#0A0A0C] text-[#F2EFE9] pt-6 pb-7 px-5 sm:px-8 overflow-hidden shadow-lg border-b border-amber-500/20">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 80% 20%, #C9A24B 0%, transparent 60%), radial-gradient(circle at 10% 90%, #8A6D2F 0%, transparent 50%)'
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#E7C975] bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
              <Trophy className="w-3 h-3 text-[#E7C975]" />
              Bàn Tay Vàng Makeup Châu Á 2025
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              Học viện makeup · Thái Bình
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white leading-tight">
            CELLA MAKEUP <span className="text-[#E7C975]">ACADEMY</span>
          </h1>

          <p className="text-sm sm:text-base font-serif italic text-[#E7C975] mt-1.5">
            “Makeup your mind, makeup your life”
          </p>

          <p className="text-xs sm:text-sm text-[#C9C5BC] mt-2.5 leading-relaxed font-normal">
            Nơi một người phụ nữ học cách tự làm đẹp cho chính mình — và nếu muốn, học tiếp một cái nghề đủ nuôi sống bản thân ở bất cứ đâu. <strong>Người dạy ở đây vẫn đang cầm cọ mỗi ngày.</strong>
          </p>

          {/* Real Metrics Row from cellamakeup.vn */}
          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/10 text-center">
            <div className="bg-white/5 py-2.5 px-1 rounded-2xl border border-amber-500/20">
              <div className="text-sm sm:text-base font-extrabold text-[#E7C975]">5,0 ★</div>
              <div className="text-[9px] text-slate-300 mt-0.5">Google Maps</div>
            </div>
            <div className="bg-white/5 py-2.5 px-1 rounded-2xl border border-amber-500/20">
              <div className="text-sm sm:text-base font-extrabold text-[#E7C975]">#1</div>
              <div className="text-[9px] text-slate-300 mt-0.5">Google Thái Bình</div>
            </div>
            <div className="bg-white/5 py-2.5 px-1 rounded-2xl border border-amber-500/20">
              <div className="text-sm sm:text-base font-extrabold text-[#E7C975]">70.200+</div>
              <div className="text-[9px] text-slate-300 mt-0.5">Follower Facebook</div>
            </div>
            <div className="bg-white/5 py-2.5 px-1 rounded-2xl border border-amber-500/20">
              <div className="text-sm sm:text-base font-extrabold text-[#E7C975]">9+ Năm</div>
              <div className="text-[9px] text-slate-300 mt-0.5">Kinh nghiệm nghề</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY TABS BAR (5 TABS) ── */}
      <div className="sticky top-[57px] z-20 bg-white border-b border-slate-200 shadow-2xs">
        <div className="flex px-2 overflow-x-auto scrollbar-none max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 min-w-[85px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'story'
                ? 'border-[#C9A24B] text-[#8A6D2F] bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Câu chuyện & Triết lý
          </button>

          <button
            onClick={() => setActiveTab('founder')}
            className={`flex-1 min-w-[85px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'founder'
                ? 'border-[#C9A24B] text-[#8A6D2F] bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Founder Hương Phượng
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 min-w-[85px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'gallery'
                ? 'border-[#C9A24B] text-[#8A6D2F] bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Hình ảnh thực tế
          </button>

          <button
            onClick={() => setActiveTab('commitments')}
            className={`flex-1 min-w-[85px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'commitments'
                ? 'border-[#C9A24B] text-[#8A6D2F] bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            4 Cam kết độc quyền
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 min-w-[85px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'contact'
                ? 'border-[#C9A24B] text-[#8A6D2F] bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Liên hệ & Kênh chính thức
          </button>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="p-4 sm:p-5 max-w-4xl mx-auto space-y-4">
        {/* ── TAB 1: CÂU CHUYỆN & TRIẾT LÝ ── */}
        {activeTab === 'story' && (
          <div className="space-y-4">
            {/* Lời mở đầu tự sự của Cella Hương Phượng */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-300">
                Tôi Bắt Đầu Từ Chỗ Không Có Gì
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                “Makeup không sửa được cuộc đời ai. Nhưng người phụ nữ biết mình đẹp thì dám sống khác đi.”
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tôi không sinh ra trong một gia đình làm nghề đẹp. Tôi đến với cây cọ vì một lý do rất đời: <strong>tôi cần một cái nghề nuôi được mình</strong>, và tôi thích nhìn thấy một người phụ nữ sáng lên khi soi gương.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nhiều năm sau, cái nghề ấy trở thành <strong>CELLA MAKEUP ACADEMY</strong> — nơi tôi dạy lại đúng những gì mình đã đi qua, kể cả những đoạn vấp.
              </p>
              <blockquote className="border-l-3 border-[#C9A24B] pl-3.5 italic text-slate-800 font-serif my-2 bg-amber-50/50 py-2 rounded-r-xl text-xs sm:text-sm">
                “Giải thưởng đẹp thật. Nhưng thứ tôi giữ lại là tin nhắn của một học viên báo rằng tháng này bạn ấy tự lo được tiền học cho con.”
              </blockquote>
            </div>

            {/* Triết lý nghề - 4 Trụ cột cuộc sống */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Triết Lý 4 Trục Cốt Lõi
                </span>
                <span className="text-xs text-amber-700 font-bold italic">
                  “Make up your mind, make up your life”
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Makeup chỉ là cánh cửa. Đích đến của CELLA là mười nghìn người phụ nữ tốt hơn trên bốn trục cuộc sống:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-700 tracking-wider">01 · MỐI QUAN HỆ</span>
                    <Heart className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Ở cạnh người khác mà không mất mình</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Xây dựng phong thái giao tiếp tự tin, biết lắng nghe và kết nối chân thành với gia đình, khách hàng và xã hội.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-700 tracking-wider">02 · SỨC KHỎE & LÀN DA</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Cái đẹp bền từ cơ thể được chăm sóc</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lớp trang điểm hoàn hảo nhất bắt đầu từ nền da sạch sâu và khỏe mạnh, tôn trọng sức sống tự nhiên của gương mặt.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-700 tracking-wider">03 · NỘI TÂM TỰ TIN</span>
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Soi gương và mỉm cười</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Đó chính là chỉ số thành công thật sự và kết quả quý giá nhất sau mỗi buổi makeup hay hoàn thành khóa học.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-700 tracking-wider">04 · TỰ CHỦ TÀI CHÍNH</span>
                    <Trophy className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Một nghề trong tay không phải xin ai</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Một tay nghề vững vàng, uy tín là chiếc chìa khóa độc lập để người phụ nữ tự quyết định tương lai của mình.
                  </p>
                </div>
              </div>
            </div>

            {/* Chương trình mũi nhọn: Dự án 0 đồng */}
            <div className="bg-gradient-to-r from-[#18181B] to-[#0A0A0C] text-white p-5 rounded-3xl border border-amber-500/30 shadow-md space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#E7C975] text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chương trình mũi nhọn · 20 buổi</span>
              </div>
              <h3 className="text-base font-black text-white leading-tight">
                Dự Án 0 Đồng: Khoá Nền Tảng Makeup Chuyên Nghiệp
              </h3>
              <p className="text-xs text-[#C9C5BC] leading-relaxed">
                Học makeup 20 buổi. Dành cho người muốn học nghề nhưng còn e ngại học phí, người đã học mà kiến thức còn hổng, và người có sẵn khách nhưng lỡ cơ hội vì tay nghề chưa đủ chắc. Học xong hoàn thiện được một layout makeup chuẩn chỉ để tự tin kiếm tiền.
              </p>
              <div className="pt-1">
                <a
                  href="https://duan0dong.cellamakeup.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A24B] hover:bg-[#E7C975] text-slate-900 font-bold text-xs transition-colors shadow-xs"
                >
                  <span>Tìm hiểu Dự án 0 đồng</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: FOUNDER HƯƠNG PHƯỢNG ── */}
        {activeTab === 'founder' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 shrink-0 ring-4 ring-amber-400 shadow-md relative group">
                  <img
                    src="https://cellamakeup.vn/blog/images/founder.jpg"
                    alt="Cella Hương Phượng"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cellamakeup.vn/images/chan-dung-cella.jpg';
                    }}
                  />
                  <div className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-xs">
                    1994
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 inline-block">
                    Nhà Sáng Lập CELLA ACADEMY
                  </span>
                  <h2 className="text-xl font-black text-slate-900">Cella Hương Phượng</h2>
                  <p className="text-xs font-bold text-amber-700">
                    Trần Thị Hương Phượng · Sinh ngày 11/06/1994 tại Thái Bình
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Makeup Artist 9+ năm kinh nghiệm · Bàn Tay Vàng Makeup Châu Á 2025
                  </p>
                </div>
              </div>

              {/* Chi tiết tiểu sử */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs text-slate-700 leading-relaxed space-y-2.5">
                <p>
                  🌸 Không xuất phát từ một gia đình có sẵn điều kiện trong ngành làm đẹp, chị bắt đầu hành trình của mình bằng <strong>chính đôi tay, sự kiên trì và tinh thần không ngừng học hỏi</strong>.
                </p>
                <p>
                  ✨ Sau <strong>9 năm gắn bó với nghề makeup</strong>, chị đã trải qua nhiều vị trí: từ một người thợ trực tiếp phục vụ từng khách hàng, đến một người cô tận tâm đào tạo và đồng hành cùng hàng trăm học viên bước vào nghề.
                </p>
                <p>
                  🎓 Ở tuổi <strong>26</strong>, khi nhiều người cho rằng việc quay lại giảng đường đã muộn, chị quyết định theo học hệ chính quy ngành <strong>Quản trị Kinh doanh tại Đại học Thái Bình</strong> và tốt nghiệp năm 2024. Với chị: <em>"Học tập không có giới hạn tuổi tác, chỉ cần mình còn muốn tiến về phía trước."</em>
                </p>
                <blockquote className="border-l-3 border-[#C9A24B] pl-3 italic text-slate-800 font-serif my-2 bg-white/60 py-1.5 rounded-r-lg">
                  “Makeup có thể là điểm bắt đầu, nhưng điều tôi muốn học viên mang theo sau mỗi khoá học là sự tự tin, một nghề nghiệp vững vàng và niềm tin rằng: khi thay đổi tư duy, chúng ta có thể thay đổi cả cuộc đời.”
                </blockquote>
              </div>

              {/* Bằng cấp & Chứng nhận chuyên môn */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Học Vấn & Chứng Nhận Chuyên Môn:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Bàn Tay Vàng Makeup Châu Á 2025</span>
                      <p className="text-[11px] text-slate-500">Asia Beauty Festival vinh danh cống hiến & tay nghề nghệ thuật</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <GraduationCap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Cử nhân Quản Trị Kinh Doanh — Đại Học Thái Bình</span>
                      <p className="text-[11px] text-slate-500">Tốt nghiệp hệ chính quy năm 2024, ứng dụng quản trị vào đào tạo & xây dựng thương hiệu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Chứng chỉ Nghiệp Vụ Sư Phạm — Bộ Quốc Phòng</span>
                      <p className="text-[11px] text-slate-500">Cấp bởi Trường Cao Đẳng Nghề số 1, Bộ Quốc Phòng chuẩn phương pháp giảng dạy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Chứng chỉ Chuyên Gia Huấn Luyện Phong Thái</span>
                      <p className="text-[11px] text-slate-500">Cấp bởi Viện Phát Triển Khoa Học Công Nghệ và Giáo Dục</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Góc bài viết & Triết lý chia sẻ của Cella */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Góc Chia Sẻ Chuyện Nghề Của Cella:
                </h4>
                <div className="space-y-2">
                  {featuredArticles.map((art, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 inline-block mb-1">
                          {art.cat}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {art.title}
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">{art.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: BỘ SƯU TẬP HÌNH ẢNH THỰC TẾ ── */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Thư Viện Ảnh Thực Tế Tại CELLA
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">6 Hình ảnh nổi bật</span>
              </div>
              <p className="text-xs text-slate-500">
                Những khoảnh khắc chân thực trong công việc cầm cọ hàng ngày, các lớp đào tạo 1:1 và đội ngũ tại Studio Thái Bình:
              </p>

              {/* Lưới hình ảnh thực tế */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {galleryItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(item.url)}
                    className="group rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-800 relative">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = item.fallback;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-3 bg-white">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal phóng to ảnh */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
                onClick={() => setSelectedPhoto(null)}
              >
                <div className="relative max-w-lg w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl p-2 border border-amber-500/30">
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 hover:bg-black/90 transition-colors z-10"
                  >
                    ✕
                  </button>
                  <img
                    src={selectedPhoto}
                    alt="Chi tiết hình ảnh CELLA"
                    className="w-full max-h-[75vh] object-contain rounded-2xl"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: 4 CAM KẾT ĐỘC QUYỀN ── */}
        {activeTab === 'commitments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Bốn điều CELLA nói được mà lớp online khó nói
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Cam kết thực tế từ Studio & Học viện đang vận hành hàng ngày tại Thái Bình:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-sm">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Người dạy vẫn cầm cọ mỗi ngày</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Studio chạy khách thật mỗi ngày. Bài giảng và kỹ thuật lấy trực tiếp từ các ca khách thật, xu hướng thịnh hành nhất, không phải giáo trình chép lại sáo rỗng.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 font-black text-sm">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Lớp học tối đa 5 người</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Học viên được trực tiếp cầm cọ và được giảng viên cầm tay uốn nắn, sửa từng nét cọ, không bao giờ có chuyện ngồi xem thụ động như lớp đông người.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 font-black text-sm">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Đủ đồ và mỹ phẩm để học</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Tài trợ toàn bộ mỹ phẩm và dụng cụ cao cấp trong suốt khóa học; sau khi tốt nghiệp được hướng dẫn chi tiết cách chọn mua đồ phù hợp với phong cách và túi tiền của mình.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 font-black text-sm">
                    04
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Bảo hành 6 tháng & Học xong Studio nhận làm</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Học xong vẫn được quay lại hỏi và trau dồi. Được tham gia nhóm cộng đồng học viên trọn đời, cấp chứng nhận tốt nghiệp và đặc biệt: <strong>Học xong nếu có nguyện vọng đi làm thì Studio nhận</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: LIÊN HỆ & KÊNH CHÍNH THỨC ── */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Nói Chuyện & Kết Nối Với CELLA</span>
              </h3>
              <p className="text-xs text-slate-500">
                Nhắn cho CELLA một câu — chị em trực page sẽ hỏi bạn vài câu ngắn để chỉ đúng lộ trình, không báo giá vội khi chưa hiểu bạn đang ở đâu.
              </p>

              {/* Địa chỉ & Hotline */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Trụ sở & Học viện tại Thái Bình:</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 pl-5">
                    37–39 Phan Bội Châu, Phường Lê Hồng Phong, Thành phố Thái Bình
                  </p>
                  <p className="text-[11px] text-slate-500 pl-5">
                    Nhận khách makeup và mở lớp học theo lịch hẹn trước.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="tel:0961161994"
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 block">Khách hàng cá nhân:</span>
                      <strong className="text-xs text-slate-900 font-mono">096 116 1994</strong>
                    </div>
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </a>

                  <a
                    href="tel:0766311313"
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 block">Trường học & Doanh nghiệp:</span>
                      <strong className="text-xs text-slate-900 font-mono">0766 311 313</strong>
                    </div>
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </a>
                </div>
              </div>

              {/* Mạng xã hội & Kênh truyền thông chính thức */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Kênh Truyền Thông Chính Thức:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href="https://facebook.com/makeupthaibinh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between hover:bg-blue-100 transition-colors"
                  >
                    <div>
                      <strong className="text-blue-900 block text-[11px]">Facebook</strong>
                      <span className="text-[10px] text-blue-600">@makeupthaibinh</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </a>

                  <a
                    href="https://tiktok.com/@makeupthaibinh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between hover:bg-slate-200 transition-colors"
                  >
                    <div>
                      <strong className="text-slate-900 block text-[11px]">TikTok</strong>
                      <span className="text-[10px] text-slate-600">@makeupthaibinh</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  </a>

                  <a
                    href="https://youtube.com/@makeupthaibinh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between hover:bg-red-100 transition-colors"
                  >
                    <div>
                      <strong className="text-red-900 block text-[11px]">YouTube</strong>
                      <span className="text-[10px] text-red-600">@makeupthaibinh</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                  </a>

                  <a
                    href="https://facebook.com/groups/370733663645490"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between hover:bg-emerald-100 transition-colors"
                  >
                    <div>
                      <strong className="text-emerald-900 block text-[11px]">Nhóm Học Viên</strong>
                      <span className="text-[10px] text-emerald-600">Cộng đồng CELLA</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                </div>
              </div>

              {/* Website link */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">Website chính thức:</span>
                  <a
                    href="https://cellamakeup.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-900 hover:underline"
                  >
                    https://cellamakeup.vn
                  </a>
                </div>
                <a
                  href="https://cellamakeup.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#C9A24B] text-slate-900 font-bold text-xs hover:bg-[#E7C975] transition-colors"
                >
                  Truy cập
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── CÁC NÚT ĐIỀU HƯỚNG NHANH ── */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigate('academy')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800">
              Khóa Học Academy
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Dự án 0đ, Cá nhân, Chuyên nghiệp</p>
          </button>

          <button
            onClick={() => onNavigate('makeup_lookbook')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600">
              Mẫu Makeup Lookbook
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Cô dâu VIP, tone Thái, Glowy Clean</p>
          </button>
        </div>
      </div>
    </div>
  );
};
