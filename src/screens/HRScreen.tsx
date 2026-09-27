import React, { useState, useRef } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import {
  Calendar, Clock, CreditCard, Award, ChevronRight, TrendingUp,
  DollarSign, Star, Users, Phone, MessageCircle, Search,
  Shield, MapPin, Mail, UserCog, Plus, Camera,
} from 'lucide-react';

interface HRScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  onManageRoles?: () => void;
  currentUser?: Staff;
}

type TabType = 'attendance' | 'payroll' | 'bonus' | 'team';

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  SUPER_ADMIN:    { label: 'Super Admin',       color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
  ADMIN:          { label: 'Admin',             color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  MASTER_ARTIST:  { label: 'Master Trainer',    color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  ARTIST:         { label: 'Makeup Artist',     color: 'text-pink-700',   bg: 'bg-pink-50 border-pink-200' },
  SALES_CONSULTANT: { label: 'Sales & CRM',     color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  ACADEMY_TRAINER: { label: 'Giảng viên TH',   color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200' },
  CUSTOMER:       { label: 'Khách hàng',        color: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200' },
  // Legacy keys
  MASTER:         { label: 'Master Trainer',    color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  SALES:          { label: 'Sales & CRM',       color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
};

const INITIAL_TEAM_MEMBERS = [
  {
    id: 'NV-001', name: 'Nguyễn Thị Lan Anh', role: 'MASTER_ARTIST',
    phone: '0908 654 321', email: 'lananh@cellabeaute.vn',
    branch: 'Quận 1 (Trụ sở)', joinedDate: '15/03/2022', kpi: 98,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'NV-002', name: 'Trần Minh Phúc', role: 'ARTIST',
    phone: '0912 345 678', email: 'phuc.tran@cellabeaute.vn',
    branch: 'Quận 3 (Atelier)', joinedDate: '01/08/2023', kpi: 86,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'NV-003', name: 'Lê Hương Trà', role: 'SALES_CONSULTANT',
    phone: '0901 222 333', email: 'tra.le@cellabeaute.vn',
    branch: 'Quận 1 (Trụ sở)', joinedDate: '10/01/2024', kpi: 91,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'NV-004', name: 'Phạm Đức Minh', role: 'ACADEMY_TRAINER',
    phone: '0909 777 888', email: 'minh.pham@cellabeaute.vn',
    branch: 'Thủ Đức (Academy)', joinedDate: '05/06/2023', kpi: 94,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'NV-005', name: 'Hoàng Bảo Châu', role: 'ARTIST',
    phone: '0933 444 555', email: 'chau.hoang@cellabeaute.vn',
    branch: 'Quận 3 (Atelier)', joinedDate: '20/09/2024', kpi: 78,
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=80',
    status: 'leave',
  },
  {
    id: 'NV-006', name: 'Vũ Thanh Hà', role: 'ADMIN',
    phone: '0911 000 111', email: 'ha.vu@cellabeaute.vn',
    branch: 'Quận 1 (Trụ sở)', joinedDate: '01/02/2021', kpi: 100,
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
    status: 'active',
  },
];

export const HRScreen: React.FC<HRScreenProps> = ({ onNavigate, onBack, onManageRoles, currentUser }) => {
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('cella_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // Add effect to persist team members
  React.useEffect(() => {
    localStorage.setItem('cella_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const [activeTab, setActiveTab] = useState<TabType>('attendance');
  const [teamSearch, setTeamSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [isPayrollDetailOpen, setIsPayrollDetailOpen] = useState(false);
  const [isAddBonusOpen, setIsAddBonusOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // Add staff form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'ARTIST',
    branch: 'Quận 1 (Trụ sở)',
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.phone) {
      alert('Vui lòng nhập tên và số điện thoại');
      return;
    }
    const newId = `NV-00${teamMembers.length + 1}`;
    const staffToAdd = {
      id: newId,
      name: newStaff.name,
      phone: newStaff.phone,
      email: newStaff.email,
      role: newStaff.role,
      branch: newStaff.branch,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      kpi: 100,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'active',
    };
    setTeamMembers([...teamMembers, staffToAdd]);
    setIsAddStaffModalOpen(false);
    setNewStaff({ name: '', phone: '', email: '', role: 'ARTIST', branch: 'Quận 1 (Trụ sở)' });
  };

  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  // Check-in / Check-out states
  const [checkInImg, setCheckInImg] = useState<string | null>(null);
  const [checkOutImg, setCheckOutImg] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const checkInInputRef = useRef<HTMLInputElement>(null);
  const checkOutInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>, type: 'in' | 'out') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgUrl = ev.target?.result as string;
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      if (type === 'in') {
        setCheckInImg(imgUrl);
        setCheckInTime(now);
      } else {
        setCheckOutImg(imgUrl);
        setCheckOutTime(now);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const tabs = [
    { id: 'attendance' as TabType, label: 'Chấm công' },
    { id: 'payroll' as TabType, label: 'Bảng lương' },
    { id: 'bonus' as TabType, label: 'Khen thưởng' },
    { id: 'team' as TabType, label: '👥 Nhân sự' },
  ];

  const roleFilters = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'MASTER_ARTIST', label: 'Master' },
    { id: 'ARTIST', label: 'Artist' },
    { id: 'SALES_CONSULTANT', label: 'Sales' },
    { id: 'ACADEMY_TRAINER', label: 'Giảng viên' },
    { id: 'ADMIN', label: 'Admin' },
  ];

  const filteredTeam = teamMembers.filter((m: any) => {
    const matchSearch = m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.phone.includes(teamSearch);
    const matchRole = filterRole === 'ALL' || m.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-full bg-slate-50 pb-28 text-slate-900">
      <MobileHeader
        title="Nhân sự & Lương"
        onBack={onBack}
        showBack={true}
        rightAction={
          <button
            onClick={() => onNavigate('roles' as ScreenId)}
            className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center"
            title="Phân quyền"
          >
            <Shield className="w-4 h-4 stroke-[2.5]" />
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-[60px] z-20 shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ── ATTENDANCE TAB ── */}
        {activeTab === 'attendance' && (
          <div className="space-y-4 animate-fade-in">
            {/* Check-in Action Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-center mb-4">
                <h3 className="text-[14px] font-black text-slate-900 mb-1.5">Chấm công hôm nay</h3>
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                  <span className="text-emerald-600 font-semibold">Vị trí hợp lệ:</span> Cơ sở Quận 1
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Bắt đầu ca (Check-in) */}
                <div className="flex flex-col gap-2">
                  <input 
                    ref={checkInInputRef} type="file" accept="image/*" capture="environment" 
                    className="hidden" onChange={(e) => handleImageCapture(e, 'in')} 
                  />
                  {checkInImg ? (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-emerald-400">
                      <img src={checkInImg} alt="Check-in" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1 text-center">
                        <span className="text-[10px] font-bold text-white">{checkInTime}</span>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => checkInInputRef.current?.click()}
                      className="w-full h-24 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-1"
                    >
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-emerald-700">Vào ca</span>
                    </button>
                  )}
                </div>

                {/* Kết thúc ca (Check-out) */}
                <div className="flex flex-col gap-2">
                  <input 
                    ref={checkOutInputRef} type="file" accept="image/*" capture="environment" 
                    className="hidden" onChange={(e) => handleImageCapture(e, 'out')} 
                  />
                  {checkOutImg ? (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-amber-400">
                      <img src={checkOutImg} alt="Check-out" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1 text-center">
                        <span className="text-[10px] font-bold text-white">{checkOutTime}</span>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => checkOutInputRef.current?.click()}
                      className="w-full h-24 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200 border-dashed rounded-xl flex flex-col items-center justify-center gap-1"
                    >
                      <Camera className="w-5 h-5 text-amber-600" />
                      <span className="text-[11px] font-bold text-amber-700">Ra ca</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-md">
              <h3 className="text-sm font-semibold opacity-90 mb-1">Tháng 9/2026</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-black">22</span>
                <span className="text-sm font-medium opacity-90 pb-1">/ 26 ngày công</span>
              </div>
              <div className="flex gap-4 border-t border-white/20 pt-3">
                {[
                  { label: 'Đi trễ', value: '2 lần', color: 'text-rose-200' },
                  { label: 'Nghỉ phép', value: '1 ngày', color: 'text-amber-200' },
                  { label: 'Tăng ca', value: '4.5 giờ', color: 'text-emerald-200' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[11px] opacity-80 uppercase tracking-wider font-bold mb-0.5">{item.label}</p>
                    <p className={`font-semibold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-2 px-1">Lịch sử Check-in (Tuần này)</h4>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {[
                  { 
                    date: 'T6, 26/09', in: '08:45', out: '18:10', status: 'Đúng giờ', color: 'text-emerald-600 bg-emerald-50', 
                    inImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                    outImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  },
                  { 
                    date: 'T5, 25/09', in: '09:10', out: '18:05', status: 'Trễ 10p', color: 'text-rose-600 bg-rose-50', 
                    inImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
                    outImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                  },
                  { 
                    date: 'T4, 24/09', in: '08:55', out: '18:00', status: 'Đúng giờ', color: 'text-emerald-600 bg-emerald-50',
                    inImg: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80',
                    outImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 border-b border-slate-100 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-800">{item.date}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 mt-0.5 inline-block rounded-md ${item.color}`}>{item.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Thumbnail In */}
                        <div className="flex flex-col items-center gap-0.5">
                          <img src={item.inImg} className="w-10 h-10 rounded-lg border border-slate-200 object-cover" alt="in" />
                          <span className="text-[9px] font-bold text-emerald-600">{item.in}</span>
                        </div>
                        {/* Thumbnail Out */}
                        <div className="flex flex-col items-center gap-0.5">
                          <img src={item.outImg} className="w-10 h-10 rounded-lg border border-slate-200 object-cover" alt="out" />
                          <span className="text-[9px] font-bold text-amber-600">{item.out}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PAYROLL TAB ── */}
        {activeTab === 'payroll' && (
          <div className="space-y-4 animate-fade-in">
            {isAdmin ? (
              <>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
                  <h3 className="text-sm font-semibold opacity-90 mb-1">Tổng quỹ lương toàn hệ thống (T9/2026)</h3>
                  <div className="text-3xl font-black mb-4">450,500,000đ</div>
                  <button 
                    className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    onClick={() => alert('Đang xuất file Excel Bảng lương toàn hệ thống...')}
                  >
                    Xuất báo cáo (Excel) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-800 mb-2 px-1">Bảng lương chi tiết từng nhân sự</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Nguyễn Thị Lan Anh', role: 'MASTER_ARTIST', val: '45,000,000đ', status: 'Chưa thanh toán' },
                    { name: 'Trần Minh Phúc', role: 'ARTIST', val: '28,500,000đ', status: 'Đã thanh toán' },
                    { name: 'Lê Hương Trà', role: 'SALES_CONSULTANT', val: '18,500,000đ', status: 'Chưa thanh toán' },
                    { name: 'Phạm Đức Minh', role: 'ACADEMY_TRAINER', val: '22,000,000đ', status: 'Chưa thanh toán' },
                    { name: 'Vũ Thanh Hà', role: 'ADMIN', val: '15,000,000đ', status: 'Đã thanh toán' },
                  ].map((item, i) => {
                    const rMeta = ROLE_META[item.role] || { label: item.role, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' };
                    const isPaid = item.status === 'Đã thanh toán';
                    return (
                      <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[14px] font-bold text-slate-800">{item.name}</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 mt-1 inline-block rounded border ${rMeta.bg} ${rMeta.color}`}>
                              {rMeta.label}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-600 block">{item.val}</span>
                            <span className={`text-[10px] font-bold ${isPaid ? 'text-slate-400' : 'text-amber-500'}`}>{item.status}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={() => setIsPayrollDetailOpen(true)}
                            className="flex-1 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[11px] font-bold hover:bg-slate-100 transition-colors"
                          >
                            Xem phiếu
                          </button>
                          {!isPaid && (
                            <button 
                              onClick={() => alert(`Đã thanh toán lương cho ${item.name}`)}
                              className="flex-1 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors"
                            >
                              Thanh toán
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
                  <h3 className="text-sm font-semibold opacity-90 mb-1">Thu nhập tạm tính (T9/2026)</h3>
                  <div className="text-3xl font-black mb-4">18,500,000đ</div>
                  <button 
                    onClick={() => setIsPayrollDetailOpen(true)}
                    className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    Xem phiếu lương chi tiết <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-800 mb-2 px-1">Chi tiết thu nhập</h4>
                <div className="space-y-2">
                  {[
                    { icon: <CreditCard className="w-5 h-5" />, bg: 'bg-sky-50 text-sky-500', title: 'Lương cơ bản', sub: '22 ngày công', val: '10,000,000đ', valColor: 'text-slate-900' },
                    { icon: <TrendingUp className="w-5 h-5" />, bg: 'bg-indigo-50 text-indigo-500', title: 'Hoa hồng dịch vụ', sub: 'Tỷ lệ 10%', val: '7,500,000đ', valColor: 'text-slate-900' },
                    { icon: <Award className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-500', title: 'Thưởng nóng', sub: 'KPI xuất sắc', val: '1,500,000đ', valColor: 'text-slate-900' },
                    { icon: <Clock className="w-5 h-5" />, bg: 'bg-rose-50 text-rose-500', title: 'Giảm trừ', sub: 'Đi trễ, Thuế', val: '-500,000đ', valColor: 'text-rose-500' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>{item.icon}</div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-800">{item.title}</p>
                          <p className="text-[12px] text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${item.valColor}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── BONUS TAB ── */}
        {activeTab === 'bonus' && (
          <div className="space-y-4 animate-fade-in">
            {isAdmin && (
              <button 
                onClick={() => setIsAddBonusOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 text-[14px] font-bold shadow-sm"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Thêm khen thưởng mới
              </button>
            )}

            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-md">
              <h3 className="text-sm font-semibold opacity-90 mb-1">Tổng Thưởng Nóng (Tháng này)</h3>
              <div className="text-3xl font-black mb-4">1,500,000đ</div>
              <p className="text-sm font-medium opacity-90 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-white" /> Xếp hạng: #2 toàn chi nhánh
              </p>
            </div>

            <h4 className="text-sm font-bold text-slate-800 mb-2 px-1">Lịch sử nhận thưởng</h4>
            <div className="space-y-2">
              {[
                {
                  icon: <Award className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-500',
                  title: 'Thưởng 5 Sao Khách Hàng', val: '+500,000đ',
                  desc: 'Khách hàng Nguyễn Thị Mai đánh giá dịch vụ Makeup Cô dâu xuất sắc.', date: '14/09/2026',
                },
                {
                  icon: <DollarSign className="w-5 h-5" />, bg: 'bg-emerald-50 text-emerald-500',
                  title: 'Vượt Doanh Số Ngày', val: '+1,000,000đ',
                  desc: 'Chốt thành công gói Masterclass K25 (Trị giá 35tr).', date: '10/09/2026',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.bg}`}>{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[14px] font-bold text-slate-800">{item.title}</p>
                      <span className="font-bold text-emerald-500">{item.val}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 mt-1">{item.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TEAM DIRECTORY TAB ── */}
        {activeTab === 'team' && (
          <div className="space-y-3 animate-fade-in">
            {/* Header stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Tổng NV', value: `${TEAM_MEMBERS.length}`, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                { label: 'Đang làm', value: `${TEAM_MEMBERS.filter(m => m.status === 'active').length}`, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { label: 'Nghỉ phép', value: `${TEAM_MEMBERS.filter(m => m.status === 'leave').length}`, color: 'text-amber-600 bg-amber-50 border-amber-100' },
              ].map((stat, i) => (
                <div key={i} className={`rounded-2xl border p-2.5 ${stat.color}`}>
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
                  <p className="text-lg font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[2]" />
              <input
                type="text"
                placeholder="Tìm nhân viên..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            {/* Role filter */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {roleFilters.map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setFilterRole(rf.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filterRole === rf.id ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            {/* Phân quyền shortcut */}
            <button
              onClick={() => onNavigate('roles' as ScreenId)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs font-bold">Phân quyền Vai trò & Tài khoản</p>
                  <p className="text-[10px] opacity-80">Quản lý quyền hạn từng role</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            {/* Team member cards */}
            <div className="space-y-2">
              {filteredTeam.map((member) => {
                const roleMeta = ROLE_META[member.role] || { label: member.role, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' };
                return (
                  <div 
                    key={member.id} 
                    onClick={() => onNavigate('profile' as ScreenId)}
                    className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-[13px] font-bold text-slate-900 truncate">{member.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${roleMeta.bg} ${roleMeta.color}`}>
                          {roleMeta.label}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />{member.branch}
                        </span>
                      </div>
                      {/* KPI bar */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-slate-100 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${member.kpi >= 90 ? 'bg-emerald-400' : member.kpi >= 75 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            style={{ width: `${member.kpi}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500">KPI {member.kpi}%</span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-col gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 hover:bg-emerald-100 transition-colors">
                        <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 hover:bg-sky-100 transition-colors">
                        <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add staff button */}
            <button 
              onClick={() => setIsAddStaffModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-500 text-sm font-bold hover:bg-indigo-50 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Thêm nhân viên mới
            </button>
          </div>
        )}
      </div>

      {/* ── PAYROLL DETAIL MODAL ── */}
      {isPayrollDetailOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <button onClick={() => setIsPayrollDetailOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 rotate-180 text-slate-600" />
            </button>
            <h2 className="text-[16px] font-black text-slate-900">Phiếu lương tháng 9/2026</h2>
            <div className="w-8" /> {/* Placeholder for balance */}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-20 space-y-4">
            {/* Header / Summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[13px] font-bold text-slate-500 mb-1">Thực nhận</p>
              <h1 className="text-3xl font-black text-emerald-600">18,500,000 đ</h1>
              <p className="text-[12px] text-slate-400 mt-2">Kỳ lương: 01/09 - 30/09/2026</p>
            </div>

            {/* Breakdowns */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="text-[13px] font-bold text-slate-800">LƯƠNG & PHỤ CẤP</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="flex justify-between items-center p-4">
                  <span className="text-[14px] text-slate-600 font-medium">Lương cơ bản (22 ngày)</span>
                  <span className="text-[14px] font-bold text-slate-900">10,000,000 đ</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-[14px] text-slate-600 font-medium">Phụ cấp ăn trưa</span>
                  <span className="text-[14px] font-bold text-slate-900">500,000 đ</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-[14px] text-slate-600 font-medium">Phụ cấp gửi xe</span>
                  <span className="text-[14px] font-bold text-slate-900">200,000 đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-emerald-50/50">
                <h3 className="text-[13px] font-bold text-emerald-700">HOA HỒNG & THƯỞNG</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] text-slate-600 font-medium">Hoa hồng dịch vụ (10%)</span>
                    <span className="text-[14px] font-bold text-emerald-600">7,500,000 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Từ doanh thu: 75,000,000 đ</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] text-slate-600 font-medium">Thưởng KPIs xuất sắc</span>
                    <span className="text-[14px] font-bold text-emerald-600">1,500,000 đ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-rose-50/50">
                <h3 className="text-[13px] font-bold text-rose-700">GIẢM TRỪ</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] text-slate-600 font-medium">Đi trễ (2 lần)</span>
                    <span className="text-[14px] font-bold text-rose-600">-200,000 đ</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] text-slate-600 font-medium">Đóng BHXH/BHYT</span>
                    <span className="text-[14px] font-bold text-rose-600">-1,000,000 đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD BONUS MODAL ── */}
      {isAddBonusOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
          <div className="bg-white rounded-t-3xl min-h-[50vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-black text-slate-900">Thêm khen thưởng mới</h3>
              <button 
                onClick={() => setIsAddBonusOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Chọn nhân sự nhận thưởng</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50">
                  <option value="">-- Chọn nhân sự --</option>
                  {teamMembers.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Số tiền thưởng (VNĐ)</label>
                <input 
                  type="number"
                  placeholder="Ví dụ: 500000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Lý do khen thưởng</label>
                <textarea 
                  placeholder="Nhập lý do khen thưởng..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100">
              <button 
                onClick={() => {
                  alert('Đã thêm khen thưởng thành công!');
                  setIsAddBonusOpen(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-[15px] font-bold shadow-md shadow-amber-500/30"
              >
                Xác nhận khen thưởng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── ADD STAFF MODAL ── */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
          <div className="bg-white rounded-t-3xl flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-black text-slate-900">Thêm nhân sự mới</h3>
              <button 
                onClick={() => setIsAddStaffModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Họ & Tên <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  placeholder="Nhập tên nhân viên..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                <input 
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  placeholder="Nhập số điện thoại..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Email</label>
                <input 
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  placeholder="Nhập email..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Vai trò</label>
                  <select 
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-[13px] font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  >
                    <option value="ARTIST">Artist</option>
                    <option value="MASTER_ARTIST">Master Artist</option>
                    <option value="SALES_CONSULTANT">Sales / CSKH</option>
                    <option value="ACADEMY_TRAINER">Trainer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Chi nhánh</label>
                  <select 
                    value={newStaff.branch}
                    onChange={(e) => setNewStaff({...newStaff, branch: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-[13px] font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  >
                    <option value="Quận 1 (Trụ sở)">Quận 1 (Trụ sở)</option>
                    <option value="Quận 3 (Atelier)">Quận 3 (Atelier)</option>
                    <option value="Thủ Đức (Academy)">Thủ Đức</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100">
              <button 
                onClick={handleAddStaff}
                className="w-full py-3.5 bg-gradient-to-r from-[#544CDE] to-[#7C3AED] text-white rounded-xl text-[15px] font-bold shadow-md shadow-indigo-500/30 active:scale-[0.98] transition-transform"
              >
                Lưu nhân sự
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
