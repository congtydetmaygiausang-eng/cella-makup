import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, Staff, UserAccount } from '../types';
import { CURRENT_USER } from '../data/mockData';
import {
  ChevronLeft, Camera, Phone, Mail, MapPin, Building2, Briefcase,
  Calendar, Shield, Award, Star, CheckCircle2, QrCode, Edit3, X,
  Save, Check, Lock, LogOut, Share2, Sparkles, DollarSign,
  TrendingUp, Clock, FileText, AlertCircle, Heart, Eye, Users,
  ExternalLink, Key, Smartphone, MessageCircle, ChevronRight, Copy
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser?: Staff | UserAccount;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  onBookPost?: (post: any) => void;
  bookings?: any[];
}

const STORAGE_KEY = 'cella_staff_profile_data_v2';

const ROLE_DISPLAY_NAMES: Record<string, { label: string; badgeBg: string; textColor: string }> = {
  SUPER_ADMIN: { label: 'Super Admin • Ban Quản Trị', badgeBg: 'bg-red-50 border-red-200', textColor: 'text-red-700' },
  ADMIN: { label: 'Admin • Quản lý Hệ thống', badgeBg: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
  MASTER_ARTIST: { label: 'Master Trainer • Nghệ nhân trưởng', badgeBg: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  MASTER: { label: 'Master Trainer • Nghệ nhân trưởng', badgeBg: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  ARTIST: { label: 'Senior Artist • Nghệ nhân Makeup', badgeBg: 'bg-pink-50 border-pink-200', textColor: 'text-pink-700' },
  SALES_CONSULTANT: { label: 'Senior Consultant • Chuyên viên CRM', badgeBg: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  SALES: { label: 'Sales Specialist • Chuyên viên Tư vấn', badgeBg: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  ACADEMY_TRAINER: { label: 'Giảng viên Đào tạo Chuyên sâu', badgeBg: 'bg-teal-50 border-teal-200', textColor: 'text-teal-700' },
  CUSTOMER: { label: 'Khách hàng Thành viên', badgeBg: 'bg-slate-50 border-slate-200', textColor: 'text-slate-700' },
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onNavigate,
  onBack,
  onLogout,
  onSwitchAccount,
}) => {
  const baseUser = currentUser || CURRENT_USER;

  // Profile data with local persistence
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    return {
      id: baseUser.id || 'NV-8826',
      employeeCode: baseUser.employeeCode || 'CELLA-8826',
      fullName: baseUser.fullName || 'HƯƠNG PHƯỢNG CELLA',
      role: baseUser.role || 'SUPER_ADMIN',
      title: 'Giám đốc Điều hành & Quản lý Nghệ thuật',
      phone: baseUser.phone || '0908 654 321',
      email: baseUser.email || 'lan.nguyen@cellabeaute.vn',
      avatarUrl: baseUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
      department: baseUser.department || 'Ban Điều Hành & Khối Dịch vụ',
      branch: baseUser.branch || 'Cơ sở Quận 1 - Trụ sở chính CELLA',
      joinedDate: baseUser.joinedDate || '15/03/2022',
      birthday: '18/06/1994',
      gender: 'Nữ',
      idCard: '079194008826',
      idCardDate: '20/08/2021',
      idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
      address: '18A Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM',
      emergencyContact: '0912 345 678 (Chị ruột)',
      bankName: 'Techcombank - CN Sài Gòn',
      bankAccount: '1903 8888 6666 99',
      bankHolder: (baseUser.fullName || 'HƯƠNG PHƯỢNG CELLA').toUpperCase(),
      contractType: 'Hợp đồng lao động không thời hạn',
      contractNumber: 'HĐLĐ-CELLA/2022-08',
      socialInsurance: 'Đã tham gia BHXH / BHYT đầy đủ',
      // Professional skills
      skills: [
        'Makeup Cô dâu Ngày cưới VIP',
        'Tone Thái sang chảnh & sắc nét',
        'Tone Hàn Quốc Glowy căng bóng',
        'Tone Douyin mắt ướt tự nhiên',
        'Tạo kiểu tóc cô dâu nghệ thuật',
        'Dán mi gân tơ & uốn mi Collagen',
        'Điêu khắc sợi mày 9D phong thủy',
        'Kỹ năng sư phạm & Đào tạo Pro',
      ],
      // Performance
      kpiScore: 118,
      rating: 4.95,
      totalServices: 348,
      totalStudents: 120,
      monthlyRevenue: 85000000,
      baseSalary: 15000000,
      commissionRate: 15,
      bonusAmount: 3500000,
      workDays: '26/26',
    };
  });

  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'payroll' | 'security'>('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Form edit state
  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = () => {
    setProfile(editForm);
    try {
      localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(editForm));
    } catch {}
    setIsEditModalOpen(false);
    showToast('Đã lưu thông tin hồ sơ nhân viên thành công!');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const updated = { ...profile, avatarUrl: url };
        setProfile(updated);
        try {
          localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(updated));
        } catch {}
        showToast('Đã cập nhật ảnh đại diện nhân viên!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const updated = { ...profile, coverUrl: url };
        setProfile(updated);
        try {
          localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(updated));
        } catch {}
        showToast('Đã cập nhật ảnh bìa mới!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải từ 6 ký tự trở lên!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Đổi mật khẩu tài khoản thành công!');
  };

  // Mock certifications
  const certifications = [
    {
      id: 'cert_1',
      title: 'Chứng chỉ Master Artist Quốc tế',
      issuer: 'Hiệp hội Làm đẹp Quốc tế Hàn Quốc - K-Beauty Assc.',
      year: '2023',
      grade: 'Hạng Xuất Sắc',
      badge: 'Master Quốc Tế',
    },
    {
      id: 'cert_2',
      title: 'Chứng chỉ Nghiệp vụ Sư phạm Dạy nghề Thẩm mỹ',
      issuer: 'Tổng cục Giáo dục Nghề nghiệp - Bộ LĐ-TB&XH',
      year: '2022',
      grade: 'Giảng viên Bậc 1',
      badge: 'Chuẩn Tổng Cục',
    },
    {
      id: 'cert_3',
      title: 'Giải Vàng Nghệ Thuật Trang Điểm Cô Dâu Toàn Quốc',
      issuer: 'Vietnam Makeup Championship',
      year: '2023',
      grade: 'Huy chương Vàng',
      badge: 'Giải Vàng 2023',
    },
  ];

  // Mock Portfolio Lookbook
  const portfolioItems = [
    {
      id: 'pf_1',
      title: 'Cô dâu Tone Thái Sang Chảnh',
      category: 'Bridal VIP',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      likes: 184,
      date: 'Tháng 09/2026',
    },
    {
      id: 'pf_2',
      title: 'Layout Trong Veo Glowy Hàn Quốc',
      category: 'Clean Girl',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
      likes: 246,
      date: 'Tháng 08/2026',
    },
    {
      id: 'pf_3',
      title: 'Dạ Tiệc Thảm Đỏ Douyin Sexy',
      category: 'Event Red Carpet',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
      likes: 312,
      date: 'Tháng 08/2026',
    },
    {
      id: 'pf_4',
      title: 'Áo Dài Ăn Hỏi Cổ Điển Truyền Thống',
      category: 'Dạm Ngõ & Ăn Hỏi',
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80',
      likes: 198,
      date: 'Tháng 07/2026',
    },
  ];

  // Mock Customer Reviews
  const reviews = [
    {
      id: 'rev_1',
      customer: 'Chị Mai Lan (Cô dâu tháng 9)',
      service: 'Gói Cô Dâu Ngày Cưới VIP',
      rating: 5,
      date: '15/09/2026',
      content: 'Chị makeup siêu có tâm, lớp nền mỏng mịn căng bóng suốt 14 tiếng từ sáng đến tối không mốc phấn chút nào. Khách dự tiệc ai cũng khen!',
    },
    {
      id: 'rev_2',
      customer: 'Học viên Thu Thảo (Khóa Pro Artist K24)',
      service: 'Khóa Đào Tạo Pro 3 Tháng',
      rating: 5,
      date: '02/09/2026',
      content: 'Giảng viên kèm 1:1 siêu nhiệt tình, chỉnh từng nét cọ và góc cầm mút. Học xong em tự tin mở tiệm riêng ngay tại quê luôn ạ.',
    },
    {
      id: 'rev_3',
      customer: 'Chị Doanh nhân Phương Thảo',
      service: 'Makeup Profile & Dạ Hội',
      rating: 5,
      date: '28/08/2026',
      content: 'Rất chuyên nghiệp và đúng giờ. Layout sang trọng, lên hình flash studio cực kỳ nổi bật và thanh lịch.',
    },
  ];

  const roleMeta = ROLE_DISPLAY_NAMES[profile.role] || {
    label: profile.role,
    badgeBg: 'bg-indigo-50 border-indigo-200',
    textColor: 'text-[#544CDE]',
  };

  const calculatedCommission = Math.round(profile.monthlyRevenue * (profile.commissionRate / 100));
  const estimatedTotalSalary = profile.baseSalary + calculatedCommission + profile.bonusAmount;

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-28 text-slate-800 animate-in fade-in duration-300 select-none">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-white/10 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP NAV HEADER ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors active:scale-95"
            title="Quay lại"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">Hồ Sơ Nhân Viên</h1>
            <p className="text-[11px] font-medium text-slate-400">Thông tin cá nhân, chuyên môn & đãi ngộ</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="w-9 h-9 rounded-full bg-indigo-50 text-[#544CDE] border border-indigo-100 hover:bg-indigo-100 flex items-center justify-center transition-colors active:scale-95"
            title="Mã thẻ nhân viên"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditForm({ ...profile });
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#544CDE] text-white hover:bg-[#433bc7] transition-all shadow-xs text-xs font-bold active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sửa hồ sơ</span>
          </button>
        </div>
      </div>

      {/* ── HERO BANNER & AVATAR CARD ── */}
      <div className="relative bg-white border-b border-slate-200 shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-800 overflow-hidden">
          <img
            src={profile.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Change cover button */}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Đổi ảnh bìa</span>
          </button>
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            className="hidden"
          />

          {/* Branch badge on top of cover */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white/90 text-[11px] font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <Building2 className="w-3 h-3 text-amber-300" />
            <span>{profile.branch}</span>
          </div>
        </div>

        {/* Avatar & Main Info */}
        <div className="px-5 pt-0 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-14 mb-4 gap-3">
            <div className="relative inline-block w-28 h-28 shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
              />
              {/* Online pulse status */}
              <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-400/30 animate-pulse" title="Đang trong ca trực" />

              {/* Change Avatar Button */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-indigo-600 transition-colors"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Quick Action Contact Pills */}
            <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
              <a
                href={`tel:${profile.phone}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gọi điện</span>
              </a>
              <a
                href={`https://zalo.me/${profile.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors border border-blue-200/60"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Zalo</span>
              </a>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors border border-purple-200/60"
              >
                <QrCode className="w-3.5 h-3.5 text-purple-600" />
                <span>Thẻ số</span>
              </button>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{profile.fullName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                <span>Verified Specialist</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap">
              <Briefcase className="w-4 h-4 text-[#544CDE]" />
              <span>{profile.title}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">{profile.department}</span>
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${roleMeta.badgeBg} ${roleMeta.textColor}`}>
                {roleMeta.label}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Mã NV: <strong>{profile.employeeCode}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chính thức ({profile.joinedDate})</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── METRIC STATS BAR ── */}
        <div className="grid grid-cols-4 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/60 py-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-base sm:text-lg">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{profile.rating}</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Đánh giá</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-[#544CDE]">{profile.totalServices}+</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Dịch vụ</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-emerald-600">{profile.kpiScore}%</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">KPI Tháng</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-purple-600">{profile.workDays}</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Ngày công</div>
          </div>
        </div>
      </div>

      {/* ── 4 TABS NAVIGATION ── */}
      <div className="sticky top-[61px] z-20 bg-white border-b border-slate-200 shadow-xs">
        <div className="flex px-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 min-w-[100px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lý lịch & HĐ</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 min-w-[100px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Năng lực & Tác phẩm</span>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`flex-1 min-w-[100px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'payroll'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Lương & Hoa hồng</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 min-w-[100px] py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-[#544CDE] text-[#544CDE] bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Bảo mật & Cài đặt</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: LÝ LỊCH & HỢP ĐỒNG ── */}
      {activeTab === 'info' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto">
          {/* Card: Thông tin định danh cá nhân */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#544CDE]" />
                <span>Thông tin cá nhân & Liên lạc</span>
              </h3>
              <button
                onClick={() => {
                  setEditForm({ ...profile });
                  setIsEditModalOpen(true);
                }}
                className="text-xs font-bold text-[#544CDE] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Họ và tên đầy đủ:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.fullName}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Số điện thoại liên lạc:</span>
                <span className="font-bold text-slate-800 text-sm text-[#544CDE]">{profile.phone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Email công vụ:</span>
                <span className="font-bold text-slate-800 text-sm break-all">{profile.email}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Ngày sinh & Giới tính:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.birthday} • {profile.gender}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Số CCCD / CMND:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.idCard} (Cấp: {profile.idCardDate})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Liên hệ khẩn cấp:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.emergencyContact}</span>
              </div>
              <div className="sm:col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Địa chỉ thường trú / Chỗ ở hiện tại:</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {profile.address}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Thông tin công tác & Hợp đồng */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Hợp đồng lao động & Cơ cấu tổ chức</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Mã nhân sự CELLA:</span>
                <span className="font-black text-indigo-700 text-sm">{profile.employeeCode}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Loại hợp đồng:</span>
                <span className="font-bold text-emerald-700 text-sm">{profile.contractType}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Số hợp đồng:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.contractNumber}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Ngày gia nhập chính thức:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.joinedDate}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Cơ sở công tác chính:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.branch}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Bảo hiểm xã hội / Y tế:</span>
                <span className="font-bold text-teal-700 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  {profile.socialInsurance}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Tài khoản ngân hàng nhận lương */}
          <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-black text-amber-300">Tài khoản Ngân hàng nhận lương</span>
              </div>
              <span className="text-[11px] font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                Chính thức
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-white/70">Số tài khoản Techcombank:</div>
              <div className="text-xl sm:text-2xl font-mono font-black tracking-wider text-white flex items-center gap-2">
                <span>{profile.bankAccount}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.bankAccount);
                    showToast('Đã sao chép số tài khoản!');
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white"
                  title="Sao chép"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs text-white/80 border-t border-white/10">
                <div>
                  <span className="text-white/50 block text-[10px]">CHỦ TÀI KHOẢN:</span>
                  <span className="font-bold">{profile.bankHolder}</span>
                </div>
                <div className="text-right">
                  <span className="text-white/50 block text-[10px]">NGÂN HÀNG:</span>
                  <span className="font-bold">{profile.bankName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: NĂNG LỰC & TÁC PHẨM ── */}
      {activeTab === 'skills' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto">
          {/* Card: Kỹ năng chuyên môn */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Kỹ thuật chuyên môn sở trường</span>
            </h3>
            <p className="text-xs text-slate-500">Các layout và kỹ thuật chuyên môn do Master Đặng Thuỳ Tiên sát hạch và chứng nhận:</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100 shadow-2xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Card: Bằng cấp & Chứng chỉ */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Bằng cấp & Chứng chỉ Nghề nghiệp</span>
            </h3>

            <div className="space-y-2.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{cert.issuer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">Năm: {cert.year}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {cert.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                    Đã xác minh
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Lookbook Tác phẩm */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-600" />
                <span>Lookbook tác phẩm makeup nổi bật</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">{portfolioItems.length} tác phẩm</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {portfolioItems.map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs aspect-3/4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <span className="text-[9px] font-bold bg-[#544CDE] px-1.5 py-0.5 rounded-md w-max mb-1">
                      {item.category}
                    </span>
                    <h5 className="text-xs font-bold leading-tight line-clamp-1">{item.title}</h5>
                    <div className="flex items-center justify-between text-[10px] text-white/80 mt-1">
                      <span className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-2.5 h-2.5 fill-rose-400" />
                        {item.likes}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: HIỆU SUẤT & LƯƠNG THƯỞNG ── */}
      {activeTab === 'payroll' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto">
          {/* Card: Bảng tính thu nhập tháng */}
          <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">Ước tính thu nhập</span>
                <h3 className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                  {estimatedTotalSalary.toLocaleString('vi-VN')} VNĐ
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Tháng hiện tại
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-white/60 block text-[11px]">Lương cơ bản:</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {profile.baseSalary.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-white/60 block text-[11px]">Hoa hồng doanh thu ({profile.commissionRate}%):</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">
                  +{calculatedCommission.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-white/60 block text-[11px]">Thưởng nóng & KPI 5 sao:</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">
                  +{profile.bonusAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Doanh số dịch vụ mang về tháng này:</span>
              </span>
              <strong className="text-white font-mono text-sm">{profile.monthlyRevenue.toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>

          {/* Card: Chỉ số KPI & Chấm công */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Chỉ số Chấm công & Tác phong làm việc</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-lg font-black text-emerald-700">26 / 26</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">Ngày công chuẩn</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-lg font-black text-blue-700">0 Lần</div>
                <div className="text-[11px] font-bold text-blue-600 mt-0.5">Đi trễ / Về sớm</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-lg font-black text-purple-700">12 Ca</div>
                <div className="text-[11px] font-bold text-purple-600 mt-0.5">Ca trực cuối tuần VIP</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="text-lg font-black text-amber-700">100%</div>
                <div className="text-[11px] font-bold text-amber-600 mt-0.5">Đánh giá 5 sao</div>
              </div>
            </div>
          </div>

          {/* Card: Đánh giá gần nhất của khách hàng */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Nhận xét thực tế từ khách hàng</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600">Điểm TB: 4.95 / 5.0</span>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.customer}</h4>
                      <span className="text-[10px] text-[#544CDE] font-semibold">{rev.service}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <span>{'★'.repeat(rev.rating)}</span>
                      <span className="text-[10px] text-slate-400 ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: BẢO MẬT & CÀI ĐẶT ── */}
      {activeTab === 'security' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto">
          {/* Card: Bảo mật tài khoản */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Bảo mật đăng nhập & Tài khoản</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Mật khẩu đăng nhập</h4>
                    <p className="text-[11px] text-slate-400">Đổi định kỳ 90 ngày để bảo vệ dữ liệu khách hàng</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 shadow-2xs transition-colors"
                >
                  Đổi mật khẩu
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Xác thực 2 bước (2FA OTP)</h4>
                    <p className="text-[11px] text-slate-400">Bảo vệ phiên làm việc qua SMS OTP</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(!twoFactorEnabled ? 'Đã kích hoạt xác thực 2 bước!' : 'Đã tắt xác thực 2 bước');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-[#544CDE]' : 'bg-slate-300'}`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${twoFactorEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Card: Thẻ nhân viên số */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Thẻ Nhân Viên Kỹ Thuật Số (Digital ID)</h4>
                <p className="text-[11px] text-slate-400">Dùng quét chấm công và check-in đón khách tại chi nhánh</p>
              </div>
            </div>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#544CDE] text-white font-bold text-xs hover:bg-[#433bc7] transition-colors shadow-xs"
            >
              Mở thẻ
            </button>
          </div>

          {/* Card: Đăng xuất & Chuyển tài khoản */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quản lý phiên làm việc</h4>
            <button
              onClick={onSwitchAccount || (() => onNavigate('auth'))}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Chuyển đổi tài khoản khác</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onLogout || (() => onNavigate('auth'))}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors border border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất khỏi hệ thống</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: CHỈNH SỬA HỒ SƠ ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#544CDE]" />
                <span>Chỉnh Sửa Hồ Sơ Nhân Viên</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Họ và tên nhân viên *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email công vụ</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={editForm.birthday}
                    onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số CCCD / CMND</label>
                  <input
                    type="text"
                    value={editForm.idCard}
                    onChange={(e) => setEditForm({ ...editForm, idCard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chức danh chuyên môn</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cơ sở / Chi nhánh làm việc</label>
                <input
                  type="text"
                  value={editForm.branch}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số tài khoản nhận lương</label>
                  <input
                    type="text"
                    value={editForm.bankAccount}
                    onChange={(e) => setEditForm({ ...editForm, bankAccount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên ngân hàng</label>
                  <input
                    type="text"
                    value={editForm.bankName}
                    onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE] font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2.5 rounded-xl bg-[#544CDE] hover:bg-[#433bc7] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: THẺ NHÂN VIÊN SỐ & QR CODE ── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {/* Staff Card Frame */}
            <div className="w-full bg-linear-to-b from-[#1E1B4B] via-[#312E81] to-[#0F172A] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-amber-400/30">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
                    C
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-[10px] font-black tracking-widest text-amber-300 block">CELLA BEAUTÉ</span>
                    <span className="text-[8px] text-white/60">MAKEUP & ACADEMY</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  OFFICIAL ID
                </span>
              </div>

              {/* Avatar & Info */}
              <div className="flex flex-col items-center">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-20 h-20 rounded-full object-cover ring-3 ring-amber-400 shadow-md mb-2"
                />
                <h4 className="text-base font-black text-white">{profile.fullName}</h4>
                <p className="text-[11px] font-semibold text-amber-300">{profile.title}</p>
                <div className="mt-1 text-[10px] text-white/70 font-mono tracking-wider">
                  MÃ NV: <strong className="text-white">{profile.employeeCode}</strong>
                </div>
              </div>

              {/* QR Code Canvas Mock */}
              <div className="mt-4 bg-white p-3 rounded-xl mx-auto inline-block shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=CELLA-STAFF-${profile.employeeCode}`}
                  alt="Staff QR"
                  className="w-28 h-28 mx-auto"
                />
              </div>
              <p className="text-[9px] text-white/50 mt-2 font-medium">Quét để chấm công & xác thực nhân sự</p>
            </div>

            <div className="mt-5 flex items-center gap-2 w-full">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`CELLA-STAFF-${profile.employeeCode}`);
                  showToast('Đã sao chép mã thẻ nhân viên!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Sao chép mã
              </button>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#544CDE] hover:bg-[#433bc7] text-white font-bold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ĐỔI MẬT KHẨU ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Đổi Mật Khẩu Đăng Nhập</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu cũ..."
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật khẩu mới (ít nhất 6 ký tự)</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới..."
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới..."
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#544CDE]"
                />
              </div>

              <div className="pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#544CDE] hover:bg-[#433bc7] text-white font-bold transition-colors shadow-xs"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
