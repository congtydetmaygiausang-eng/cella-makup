import React, { useState } from 'react';
import { Course, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  GraduationCap,
  Users,
  Award,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';

interface AcademyScreenProps {
  courses: Course[];
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
}

export const AcademyScreen: React.FC<AcademyScreenProps> = ({
  courses,
  onNavigate,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCourseDetail, setActiveCourseDetail] = useState<Course | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900 relative">
      <MobileHeader
        title="Khóa học Đào tạo"
        subtitle="Học viện Thẩm mỹ CELLA Academy"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button
            onClick={() => alert('Chức năng thêm khóa học mới cho Quản trị viên Academy.')}
            className="p-2 rounded-full hover:bg-slate-100 text-[#5850EC]"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-4 pt-1 space-y-3.5">
        {/* === GIỚI THIỆU CELLA MAKEUP ACADEMY === */}
        <div className="space-y-3">

          {/* Hero Card */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#1E1B4B] to-[#16161A] text-white p-5 space-y-3 relative">
            <div className="absolute inset-0 opacity-10" style={{background: 'radial-gradient(ellipse at 80% 20%, #C9A24B 0%, transparent 60%)'}} />
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Học viện Makeup · Thái Bình</span>
              <h2 className="text-xl font-black mt-1 leading-tight">CELLA MAKEUP<br/><span className="text-amber-400">ACADEMY</span></h2>
              <p className="text-[12px] text-slate-300 mt-1.5 italic">"Makeup your mind, makeup your life"</p>
              <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                Nơi một người phụ nữ học cách tự làm đẹp cho chính mình — và nếu muốn,
                học tiếp một cái nghề đủ nuôi sống bản thân ở bất cứ đâu.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
                <div><div className="text-sm font-black text-amber-400">5,0 ★</div><div className="text-[9px] text-slate-400">32 đánh giá Google</div></div>
                <div><div className="text-sm font-black text-amber-400">70K+</div><div className="text-[9px] text-slate-400">Follower Facebook</div></div>
                <div><div className="text-sm font-black text-amber-400">2025</div><div className="text-[9px] text-slate-400">Bàn Tay Vàng Châu Á</div></div>
              </div>
            </div>
          </div>

          {/* Nhà sáng lập */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="https://cellamakeup.vn/images/chan-dung-cella.jpg"
                alt="Cella Hương Phượng"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80'; }}
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Nhà sáng lập</p>
                <h3 className="text-[15px] font-black text-slate-900">Cella Hương Phượng</h3>
                <p className="text-[11px] text-slate-500">Trần Thị Hương Phượng · sinh 11/06/1994</p>
              </div>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Sau <strong className="text-slate-800">9 năm</strong> gắn bó với nghề makeup, chị đã từ người thợ trực tiếp phục vụ khách,
              đến người cô đào tạo hàng trăm học viên. Ở tuổi 26 chị theo học Quản trị Kinh doanh tại ĐH Thái Bình,
              tốt nghiệp <strong className="text-slate-800">2024</strong>.
            </p>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              CELLA được sáng lập với mong muốn giúp học viên không chỉ biết trang điểm mà còn
              <strong className="text-slate-800"> tạo ra thu nhập, xây dựng thương hiệu và làm chủ sự nghiệp</strong>.
            </p>
          </div>

          {/* Triết lý 4 trụ cột */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Triết lý nghề</p>
            <p className="text-[13px] font-bold text-slate-800 italic mb-3">"Lần 1 chưa đẹp, lần 200 chắc chắn sẽ đẹp."</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { idx: '01', title: 'Mối quan hệ', desc: 'Ở cạnh người khác mà không đánh mất mình.' },
                { idx: '02', title: 'Sức khoẻ', desc: 'Cái đẹp bền nhất bắt đầu từ cơ thể được chăm.' },
                { idx: '03', title: 'Nội tâm', desc: 'Soi gương và mỉm cười — chỉ số thật của makeup.' },
                { idx: '04', title: 'Tài chính', desc: 'Một cái nghề trong tay là tự do không xin ai.' },
              ].map(p => (
                <div key={p.idx} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-[10px] font-black text-amber-500">{p.idx}</span>
                  <p className="text-[12px] font-bold text-slate-800 mt-0.5">{p.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vì sao chọn CELLA */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Vì sao chọn CELLA</p>
            <div className="space-y-2.5">
              {[
                { icon: '🎯', title: 'Người dạy vẫn cầm cọ', desc: 'Studio chạy khách mỗi ngày. Bài giảng từ ca thật.' },
                { icon: '👥', title: 'Lớp tối đa 5 người', desc: 'Được cầm cọ và sửa tay, không ngồi xem người khác.' },
                { icon: '🛍', title: 'Đủ đồ để học', desc: 'Mỹ phẩm & dụng cụ dùng suốt khoá học.' },
                { icon: '🛡', title: 'Bảo hành 6 tháng', desc: 'Học xong vẫn hỏi được. Cộng đồng + chứng nhận tốt nghiệp.' },
              ].map(r => (
                <div key={r.title} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{r.icon}</span>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">{r.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liên hệ */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Liên hệ</p>
            <div className="space-y-1.5 text-[12px]">
              <p className="flex gap-2"><span>📍</span><span className="text-slate-700">37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình</span></p>
              <p className="flex gap-2"><span>📞</span><a href="tel:0961161994" className="text-amber-700 font-bold">096 116 1994</a><span className="text-slate-400">·</span><a href="tel:0766311313" className="text-amber-700 font-bold">0766 311 313</a></p>
              <p className="flex gap-2"><span>🌐</span><a href="https://cellamakeup.vn" target="_blank" rel="noreferrer" className="text-blue-600 underline">cellamakeup.vn</a></p>
              <p className="flex gap-2"><span>📘</span><a href="https://facebook.com/makeupthaibinh" target="_blank" rel="noreferrer" className="text-blue-600 underline">facebook.com/makeupthaibinh</a></p>
            </div>
          </div>
        </div>

        {/* --- DIVIDER KHÓA HỌC --- */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Các khóa học</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Banner TUYỂN SINH KHÓA K25 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#5850EC] text-white shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
              TUYỂN SINH KHÓA K25
            </span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>

          <h3 className="text-base font-extrabold leading-tight">
            Nhận học bổng 30% khi đăng ký sớm trong tuần này
          </h3>
          <p className="text-xs text-indigo-200">
            Chương trình đào tạo thực chiến 1:1 cùng Master & Bác sĩ chuyên khoa đầu ngành.
          </p>

          {/* 3 Metric counters */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div>
              <span className="text-sm font-extrabold text-white block">12</span>
              <span className="text-[10px] text-indigo-200">Khóa đào tạo</span>
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">128</span>
              <span className="text-[10px] text-indigo-200">Học viên đang học</span>
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">98%</span>
              <span className="text-[10px] text-indigo-200">Có việc ngay</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học, giảng viên, mã lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
          />
        </div>

        {/* Course Cards List (Matching screenshot 18) */}
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const progressPercent = Math.round(
              (course.registeredCount / course.maxStudents) * 100
            );

            return (
              <GlassCard
                key={course.id}
                className="p-4 bg-white border border-slate-100 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#5850EC] uppercase">
                        {course.code}
                      </span>
                      {course.isHot && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-600 uppercase">
                          Hot
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                      {course.title}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#5850EC] block">
                      {course.price.toLocaleString('vi-VN')} đ
                    </span>
                    {course.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {course.originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>
                </div>

                {/* Giảng viên & Lịch khai giảng */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {course.instructorAvatar && (
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-7 h-7 rounded-full object-cover border border-[#5850EC]/20"
                      />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">
                        {course.instructor}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {course.instructorTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {course.totalLessons} buổi học
                  </span>
                </div>

                {/* Progress bar slot enrollment */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-500">
                    <span>Đã đăng ký: <strong>{course.registeredCount}/{course.maxStudents}</strong> học viên</span>
                    <span className="text-[#5850EC] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className="h-full rounded-full bg-[#5850EC]"
                    />
                  </div>
                </div>

                {/* Action Buttons: Giáo trình & Đăng ký */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setActiveCourseDetail(course)}
                    className="py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Xem giáo trình
                  </button>
                  <button
                    onClick={() => setActiveCourseDetail(course)}
                    className="py-2 rounded-xl text-xs font-semibold text-white bg-[#5850EC] hover:bg-[#4F46E5] transition-colors"
                  >
                    Đăng ký tư vấn
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Course Detail Modal */}
      {activeCourseDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#5850EC] uppercase">
                  {activeCourseDetail.code} • {activeCourseDetail.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeCourseDetail.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveCourseDetail(null);
                  setRegisteredSuccess(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registeredSuccess ? (
              <div className="text-center py-6 space-y-3 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Đăng ký thành công!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Tư vấn viên CELLA Academy sẽ liên hệ số điện thoại của bạn trong vòng 15 phút để xác nhận hồ sơ nhập học & ưu đãi.
                </p>
                <PrimaryButton
                  fullWidth
                  onClick={() => {
                    setActiveCourseDetail(null);
                    setRegisteredSuccess(false);
                  }}
                >
                  Hoàn tất
                </PrimaryButton>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-2xl bg-[#EFF4FF] border border-[#5850EC]/20 space-y-1 text-xs">
                  <p className="font-bold text-[#5850EC]">
                    Khai giảng: {activeCourseDetail.startDate}
                  </p>
                  <p className="text-slate-600">Lịch học: {activeCourseDetail.schedule}</p>
                  <p className="text-slate-600">
                    Học phí ưu đãi: <strong className="text-slate-900">{activeCourseDetail.price.toLocaleString('vi-VN')} đ</strong>
                  </p>
                </div>

                {/* Syllabus lessons */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Lộ trình giáo trình đào tạo
                  </h4>
                  <div className="space-y-2">
                    {activeCourseDetail.syllabus.map((syl) => (
                      <div
                        key={syl.lesson}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#5850EC] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {syl.lesson}
                          </span>
                          <span className="font-semibold text-slate-800">{syl.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">{syl.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Quyền lợi độc quyền CELLA
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {activeCourseDetail.highlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <PrimaryButton
                  size="lg"
                  fullWidth
                  onClick={() => setRegisteredSuccess(true)}
                >
                  Xác nhận nộp hồ sơ đăng ký khóa học
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
