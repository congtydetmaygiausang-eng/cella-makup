import React, { useState } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import {
  Building2, MapPin, Phone, Mail, Clock, Award, Star,
  CheckCircle2, Sparkles, GraduationCap, ChevronRight,
  ShieldCheck, Heart, Users, ExternalLink, Calendar,
  MessageCircle, Play, Image as ImageIcon
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
  const [activeSection, setActiveSection] = useState<'brand' | 'founder' | 'branches' | 'commitments'>('brand');

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-28 text-slate-800 animate-in fade-in duration-300 select-none">
      {/* ── HEADER ── */}
      <MobileHeader
        title="Về Chúng Tôi"
        subtitle="CELLA MAKEUP & ACADEMY"
        showBack={true}
        onBack={onBack}
        rightAction={
          <a
            href="tel:0908654321"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hotline</span>
          </a>
        }
      />

      {/* ── HERO BANNER ── */}
      <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0A0A0C] text-white p-6 sm:p-8 overflow-hidden shadow-md">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #C9A24B 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-xl">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-0.5 rounded-full mb-2">
            Hệ sinh thái Thẩm mỹ & Đào tạo Makeup Toàn diện
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            CELLA MAKEUP & <span className="text-amber-400">ACADEMY</span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-300 font-medium italic mt-1">
            "Better People, Better Beauty, A Brighter Tomorrow"
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
            Hơn 10 năm khẳng định vị thế thương hiệu trang điểm cô dâu VIP, dạ tiệc cao cấp và học viện đào tạo nghệ nhân makeup chuẩn quốc tế tại TP. Hồ Chí Minh.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/10 text-center">
            <div className="bg-white/5 py-2 rounded-2xl border border-white/10">
              <div className="text-base sm:text-lg font-black text-amber-400">10+</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Năm uy tín</div>
            </div>
            <div className="bg-white/5 py-2 rounded-2xl border border-white/10">
              <div className="text-base sm:text-lg font-black text-amber-400">15.000+</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Khách hàng</div>
            </div>
            <div className="bg-white/5 py-2 rounded-2xl border border-white/10">
              <div className="text-base sm:text-lg font-black text-amber-400">1.200+</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Học viên Pro</div>
            </div>
            <div className="bg-white/5 py-2 rounded-2xl border border-white/10">
              <div className="text-base sm:text-lg font-black text-amber-400">4,95★</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Đánh giá</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION TABS ── */}
      <div className="sticky top-[57px] z-20 bg-white border-b border-slate-200 shadow-2xs">
        <div className="flex px-2 overflow-x-auto scrollbar-none max-w-4xl mx-auto">
          <button
            onClick={() => setActiveSection('brand')}
            className={`flex-1 min-w-[90px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeSection === 'brand'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Thương hiệu
          </button>
          <button
            onClick={() => setActiveSection('founder')}
            className={`flex-1 min-w-[90px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeSection === 'founder'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Viện trưởng
          </button>
          <button
            onClick={() => setActiveSection('branches')}
            className={`flex-1 min-w-[90px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeSection === 'branches'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            2 Cơ sở & Hotline
          </button>
          <button
            onClick={() => setActiveSection('commitments')}
            className={`flex-1 min-w-[90px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all ${
              activeSection === 'commitments'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            4 Cam kết vàng
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 max-w-4xl mx-auto space-y-4">
        {/* ── TAB 1: THƯƠNG HIỆU & SỨ MỆNH ── */}
        {activeSection === 'brand' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#544CDE] bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Triết Lý Kiến Tạo Sắc Đẹp
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Tôn Vinh Vẻ Đẹp Độc Bản - Nâng Tầm Nghệ Nhân Việt Nam
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tại <strong>CELLA MAKEUP & ACADEMY</strong>, chúng tôi tin rằng mỗi người phụ nữ đều sở hữu một nét đẹp độc bản riêng biệt. Sứ mệnh của người nghệ nhân makeup không phải là rập khuôn gương mặt khách hàng theo một công thức cứng nhắc, mà là thấu cảm từng đường nét, làn da và phong cách cá nhân để đánh thức sự tự tin, rạng ngời nhất.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Đối với Học viện CELLA Academy, chúng tôi đặt trọng tâm vào <strong>chất lượng đào tạo thực chiến 85% trên mẫu thật</strong>, tài trợ toàn bộ mỹ phẩm High-End tại lớp, giúp học viên vững kiến thức – giỏi tay nghề – làm chủ thu nhập và tự tin mở Studio riêng sau tốt nghiệp.
              </p>
            </div>

            {/* Giá trị cốt lõi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">Tâm Huyết & Tận Tụy</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Phục vụ khách hàng bằng 100% sự ân cần, lắng nghe và chăm chút tỉ mỉ từng chi tiết nhỏ nhất.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">Chuyên Môn Đỉnh Cao</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Đội ngũ Senior Artist tu nghiệp chuẩn quốc tế, đón đầu xu hướng makeup Hàn Quốc, Thái Lan và Douyin.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">Mỹ Phẩm High-End</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Cam kết 100% mỹ phẩm chính hãng Dior, Tom Ford, Chanel, Charlotte Tilbury an toàn lành tính cho da.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: VIỆN TRƯỞNG & NGƯỜI SÁNG LẬP ── */}
        {activeSection === 'founder' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-amber-100 shrink-0 ring-4 ring-amber-400 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80"
                    alt="Master Đặng Thuỳ Tiên"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                    Người Sáng Lập & Viện Trưởng
                  </span>
                  <h2 className="text-xl font-black text-slate-900">Master Artist Đặng Thuỳ Tiên</h2>
                  <p className="text-xs font-semibold text-[#544CDE]">
                    Chuyên gia Makeup Nghệ thuật & Cố vấn Đào tạo Quốc tế
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    10+ năm kinh nghiệm · Tu nghiệp chuyên sâu tại Seoul (Hàn Quốc) & Bangkok (Thái Lan)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  ✨ <strong>Master Đặng Thuỳ Tiên</strong> là một trong những nghệ nhân trang điểm tiên phong đưa các phong cách makeup hiện đại (Bridal High-End, Glowy Clean Girl, Tone Thái sắc nét) kết hợp tinh tế cùng nét đẹp của phụ nữ Việt Nam.
                </p>
                <p>
                  🎓 Với vai trò là Viện trưởng CELLA Academy, cô đã trực tiếp xây dựng bộ giáo trình đào tạo chuẩn sư phạm, kèm 1:1 và nâng đỡ tay nghề cho hơn 1.200 học viên ra nghề, mở Studio thành công trên cả nước.
                </p>
                <blockquote className="border-l-3 border-[#544CDE] pl-3 italic text-slate-700 font-medium my-2">
                  "Học nghề trang điểm không đơn thuần là cầm cọ vẽ lên mặt, mà là cách bạn cảm nhận vẻ đẹp và truyền tải tình yêu nghề vào từng ánh nhìn của khách hàng."
                </blockquote>
              </div>

              {/* Giải thưởng & Bằng cấp */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Giải thưởng & Chứng chỉ nổi bật:</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Chứng nhận Master Artist Quốc tế – Seoul International Beauty Award (Hàn Quốc)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80">
                    <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Chứng chỉ Nghiệp vụ Sư phạm Dạy nghề chuẩn Tổng cục Giáo dục Nghề nghiệp</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
                    <Star className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Giám khảo danh dự cuộc thi Tay Cọ Vàng Toàn Quốc các mùa 2023 - 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: HỆ THỐNG CƠ SỞ & HOTLINE ── */}
        {activeSection === 'branches' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#544CDE]" />
                <span>Hệ thống Cơ sở & Chi nhánh tại TP. Hồ Chí Minh</span>
              </h3>

              <div className="space-y-3">
                {/* Cơ sở 1 */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#544CDE] uppercase tracking-wide">
                      Cơ sở 1 (Trụ sở chính & Atelier Studio)
                    </span>
                    <span className="text-[10px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                      Studio Dịch Vụ
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>18A Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh</span>
                  </p>
                  <p className="text-[11px] text-slate-500 pl-5">
                    Không gian Atelier sang trọng, phòng VIP cô dâu riêng biệt, chuẩn ánh sáng Studio flash quốc tế.
                  </p>
                </div>

                {/* Cơ sở 2 */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-700 uppercase tracking-wide">
                      Cơ sở 2 (Học viện Đào tạo Chuyên nghiệp Academy)
                    </span>
                    <span className="text-[10px] font-bold bg-white text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                      Học Viện Đào Tạo
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>245 Phan Xích Long, Phường 2, Quận Phú Nhuận, TP. Hồ Chí Minh</span>
                  </p>
                  <p className="text-[11px] text-slate-500 pl-5">
                    Phòng học hiện đại, bàn gương đèn LED chuyên dụng, phòng thực hành mẫu thật và lookbook studio.
                  </p>
                </div>
              </div>

              {/* Thông tin liên hệ & Giờ làm việc */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700"><strong>Giờ mở cửa:</strong> 07:00 – 19:30 hàng ngày (Cả Thứ 7, CN & Lễ)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#544CDE]" />
                    <span className="text-slate-700 font-medium">Hotline tư vấn & Đặt lịch:</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono font-bold text-[#544CDE]">
                    <a href="tel:0908654321" className="hover:underline">0908 654 321</a>
                    <span>/</span>
                    <a href="tel:0766311313" className="hover:underline">0766 311 313</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: 4 CAM KẾT VÀNG ── */}
        {activeSection === 'commitments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4 Cam Kết Vàng Vững Chắc Từ CELLA BEAUTÉ</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Mỹ phẩm High-End chính hãng</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Chỉ sử dụng các dòng mỹ phẩm cao cấp quốc tế: Dior, Tom Ford, Chanel, Charlotte Tilbury, Bobbi Brown, NARS. Cam kết không dùng mỹ phẩm trôi nổi, bảo vệ tối đa làn da nhạy cảm.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Thực hành 85% trên mẫu thật tại Academy</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Giảng viên kèm 1:1, chỉnh sửa từng nét cọ, tài trợ toàn bộ mỹ phẩm lớp học và tặng bộ cọ Master CELLA cao cấp 3.5 triệu cho học viên chuyên nghiệp.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Bảo trợ việc làm & Cấp chứng chỉ toàn quốc</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Bằng tốt nghiệp có giá trị toàn quốc, kết nối việc làm tại các Studio lớn hoặc cơ hội được giữ lại làm Chuyên viên chính thức tại hệ thống CELLA.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Chính sách giữ lịch & Dời lịch linh hoạt</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Khách hàng đặt cọc nhanh gọn qua mã VietQR tự động. Báo trước 24 giờ được hỗ trợ dời ngày hẹn hoàn toàn miễn phí.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CÁC NÚT ĐIỀU HƯỚNG NHANH ── */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigate('academy')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#544CDE] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#544CDE]">
              Khóa Học Academy
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Khóa Pro 3 tháng, Sư phạm 6 tháng</p>
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
            <p className="text-[11px] text-slate-500 mt-0.5">Cô dâu VIP, tone Thái, Hàn Quốc</p>
          </button>
        </div>
      </div>
    </div>
  );
};
