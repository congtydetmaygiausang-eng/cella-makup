import React, { useState, useEffect, useRef } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import {
  Calendar, Clock, CreditCard, Award, ChevronRight, TrendingUp,
  DollarSign, Star, Users, Phone, MessageCircle, Search,
  Shield, MapPin, Mail, UserCog, Plus, Camera, Loader2,
  Sparkles, Grid, List, Briefcase, GraduationCap, X, Check,
  ExternalLink, UserCheck, Flame, Heart, FileText, ChevronDown, Edit2
} from 'lucide-react';
import { supabase } from '../config/supabase';

interface HRScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  onManageRoles?: () => void;
  currentUser?: Staff;
}

type TabType = 'team' | 'attendance' | 'payroll' | 'bonus';

interface StaffProfileData {
  id: string;
  name: string;
  code?: string;
  role: string;
  phone: string;
  email: string;
  branch: string;
  joinedDate: string;
  kpi: number;
  rating?: number;
  avatar: string;
  cover?: string;
  status: 'active' | 'leave' | 'probation';
  skills?: string[];
  bio?: string;
  baseSalary?: number;
  commissionRate?: number;
  monthlyRevenue?: number;
  completedJobs?: number;
  experienceYears?: number;
}

const ROLE_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  SUPER_ADMIN: { 
    label: 'CEO & Founder', 
    color: 'text-emerald-800', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200' 
  },
  ADMIN: { 
    label: 'Quản lý Điều hành', 
    color: 'text-amber-800', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200' 
  },
  MASTER_ARTIST: { 
    label: 'Master Artist', 
    color: 'text-[#1E3A2F]', 
    bg: 'bg-[#EAF2EC]', 
    border: 'border-[#264736]/25' 
  },
  ARTIST: { 
    label: 'Senior Artist', 
    color: 'text-rose-800', 
    bg: 'bg-rose-50', 
    border: 'border-rose-200' 
  },
  ACADEMY_TRAINER: { 
    label: 'Giảng viên Đào tạo', 
    color: 'text-teal-800', 
    bg: 'bg-teal-50', 
    border: 'border-teal-200' 
  },
  SALES_CONSULTANT: { 
    label: 'Tư vấn & CSKH', 
    color: 'text-sky-800', 
    bg: 'bg-sky-50', 
    border: 'border-sky-200' 
  },
  CUSTOMER: { 
    label: 'Khách hàng', 
    color: 'text-slate-700', 
    bg: 'bg-slate-50', 
    border: 'border-slate-200' 
  },
};

const INITIAL_CELLA_STAFF: StaffProfileData[] = [
  {
    id: 'NV-8826',
    code: 'CELLA-8826',
    name: 'Cella Hương Phượng',
    role: 'SUPER_ADMIN',
    phone: '0908 654 321',
    email: 'huongphuong@cellamakeup.vn',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
    joinedDate: '15/03/2021',
    kpi: 99,
    rating: 5.0,
    avatar: 'https://cellamakeup.vn/images/chan-dung-cella.jpg',
    cover: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1200',
    status: 'active',
    experienceYears: 9,
    completedJobs: 850,
    baseSalary: 25000000,
    commissionRate: 0.15,
    monthlyRevenue: 120000000,
    skills: ['Bàn Tay Vàng Châu Á 2025', 'Makeup Cô Dâu Cao Cấp', 'Đào Tạo Master 1-1', 'Định Hình Phong Cách'],
    bio: 'Nhà sáng lập CELLA MAKEUP ACADEMY với hơn 9 năm kinh nghiệm đào tạo hàng trăm nghệ sĩ trang điểm thành danh trên cả nước.',
  },
  {
    id: 'NV-9912',
    code: 'CELLA-9912',
    name: 'Trần Thị Lan Anh',
    role: 'MASTER_ARTIST',
    phone: '0912 345 678',
    email: 'lananh@cellamakeup.vn',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
    joinedDate: '01/08/2022',
    kpi: 96,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1512496015851-a1dc8a477d70?auto=format&fit=crop&w=1200',
    status: 'active',
    experienceYears: 6,
    completedJobs: 420,
    baseSalary: 12000000,
    commissionRate: 0.12,
    monthlyRevenue: 75000000,
    skills: ['Á Quân Cây Cọ Vàng 2023', 'Cô Dâu Tone Trong Trẻo', 'Bới Tóc Mùa Cưới', 'Xử Lý Nền Lâu Trôi'],
    bio: 'Chuyên gia layout cô dâu Hàn Quốc và tạo mẫu tóc cô dâu sang trọng, được hàng trăm cặp đôi tại Thái Bình tin tưởng.',
  },
  {
    id: 'NV-9915',
    code: 'CELLA-9915',
    name: 'Nguyễn Thu Trang',
    role: 'ARTIST',
    phone: '0988 776 554',
    email: 'thutrang@cellamakeup.vn',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
    joinedDate: '10/02/2023',
    kpi: 93,
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200',
    status: 'active',
    experienceYears: 4,
    completedJobs: 280,
    baseSalary: 8500000,
    commissionRate: 0.10,
    monthlyRevenue: 45000000,
    skills: ['Makeup Tiệc & Dạ Hội', 'Kỷ Yếu Ngoại Cảnh', 'Tone Thái Lan Glam', 'Tạo Khối 3D'],
    bio: 'Trẻ trung, cập nhật xu hướng makeup hot trend Douyin và thời trang sự kiện, nhiệt tình chu đáo.',
  },
  {
    id: 'NV-9918',
    code: 'CELLA-9918',
    name: 'Phạm Minh Hằng',
    role: 'ACADEMY_TRAINER',
    phone: '0977 123 999',
    email: 'minhhang@cellamakeup.vn',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
    joinedDate: '15/05/2023',
    kpi: 95,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200',
    status: 'active',
    experienceYears: 5,
    completedJobs: 310,
    baseSalary: 11000000,
    commissionRate: 0.10,
    monthlyRevenue: 60000000,
    skills: ['Giảng Dạy Thực Hành', 'Giáo Trình Khóa K28', 'Kỹ Thuật Kẻ Sợi Mày', 'Cấp Ẩm Da Nền'],
    bio: 'Phụ trách kèm 1-1 cho học viên các khóa Makeup Chuyên Nghiệp và Cá Nhân, tận tâm và sát sao tay nghề.',
  },
  {
    id: 'NV-9920',
    code: 'CELLA-9920',
    name: 'Lê Thảo Phương',
    role: 'SALES_CONSULTANT',
    phone: '0901 222 333',
    email: 'thaophuong@cellamakeup.vn',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
    joinedDate: '10/01/2024',
    kpi: 91,
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200',
    status: 'active',
    experienceYears: 3,
    completedJobs: 190,
    baseSalary: 7500000,
    commissionRate: 0.05,
    monthlyRevenue: 50000000,
    skills: ['Tư Vấn Khóa Học', 'CSKH Cô Dâu', 'Xếp Lịch Artist', 'Hỗ Trợ Hợp Đồng'],
    bio: 'Chuyên viên tư vấn tuyển sinh và hỗ trợ khách hàng đặt lịch makeup tại CELLA Studio Thái Bình.',
  },
  {
    id: 'NV-9922',
    code: 'CELLA-9922',
    name: 'Vũ Mai Linh',
    role: 'ARTIST',
    phone: '0933 444 555',
    email: 'mailinh@cellamakeup.vn',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
    joinedDate: '20/09/2024',
    kpi: 88,
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200',
    status: 'leave',
    experienceYears: 2,
    completedJobs: 95,
    baseSalary: 6500000,
    commissionRate: 0.08,
    monthlyRevenue: 28000000,
    skills: ['Makeup Kỷ Yếu', 'Layout Sinh Viên', 'Trợ Giảng Khóa K28'],
    bio: 'Tốt nghiệp xuất sắc khóa đào tạo K25 tại CELLA, hiện đang là trợ giảng và chuyên viên makeup sự kiện.',
  },
];

export const HRScreen: React.FC<HRScreenProps> = ({ onNavigate, onBack, onManageRoles, currentUser }) => {
  // Main tabs: Hồ sơ nhân sự is first & default
  const [activeTab, setActiveTab] = useState<TabType>('team');
  const [teamMembers, setTeamMembers] = useState<StaffProfileData[]>(INITIAL_CELLA_STAFF);
  const [isLoading, setIsLoading] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected staff profile modal
  const [selectedStaff, setSelectedStaff] = useState<StaffProfileData | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'kpi' | 'payroll'>('overview');

  // Modals
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isPayrollDetailOpen, setIsPayrollDetailOpen] = useState(false);
  const [isAddBonusOpen, setIsAddBonusOpen] = useState(false);

  // Edit staff profile state
  const [editingStaff, setEditingStaff] = useState<StaffProfileData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Rewards list
  const [rewards, setRewards] = useState<any[]>([]);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);

  // Check-in state
  const [checkInImg, setCheckInImg] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutImg, setCheckOutImg] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const checkInInputRef = useRef<HTMLInputElement>(null);
  const checkOutInputRef = useRef<HTMLInputElement>(null);

  // New staff form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'ARTIST',
    branch: '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình',
    bio: '',
    baseSalary: '8500000',
  });

  // Add bonus form state
  const [newBonus, setNewBonus] = useState({
    staff_id: '',
    amount: '',
    reason: '',
  });

  // Fetch staff from Supabase
  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        // Map Supabase profiles and blend with rich initial profiles
        const mappedFromDb: StaffProfileData[] = data.map((p: any) => {
          const matchInitial = INITIAL_CELLA_STAFF.find(init => 
            init.email.toLowerCase() === (p.email || '').toLowerCase() ||
            init.name.toLowerCase() === (p.full_name || '').toLowerCase()
          );

          return {
            id: p.id,
            code: matchInitial?.code || `CELLA-${p.id.slice(0, 4).toUpperCase()}`,
            name: p.full_name || matchInitial?.name || 'Nhân sự CELLA',
            role: p.role || matchInitial?.role || 'ARTIST',
            phone: p.phone || matchInitial?.phone || 'Chưa có SĐT',
            email: p.email || matchInitial?.email || `${p.id.slice(0, 6)}@cellamakeup.vn`,
            branch: p.branch_studio || matchInitial?.branch || '37–39 Phan Bội Châu, TP. Thái Bình',
            joinedDate: new Date(p.created_at || Date.now()).toLocaleDateString('vi-VN'),
            kpi: p.kpi_score ? Math.round(Number(p.kpi_score) * 20) : (matchInitial?.kpi || 92),
            rating: p.kpi_score ? Number(p.kpi_score) : (matchInitial?.rating || 4.9),
            avatar: p.avatar_url || matchInitial?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
            cover: p.cover_url || matchInitial?.cover || 'https://images.unsplash.com/photo-1512496015851-a1dc8a477d70?w=1200&auto=format&fit=crop&q=80',
            status: p.is_active ? 'active' : 'leave',
            skills: matchInitial?.skills || ['Makeup Chuyên Nghiệp', 'Tư Vấn Phong Cách', 'Chăm Sóc Khách Hàng'],
            bio: p.bio || matchInitial?.bio || 'Chuyên viên trang điểm và đào tạo trực thuộc CELLA MAKEUP ACADEMY.',
            baseSalary: Number(p.base_salary) || matchInitial?.baseSalary || 8500000,
            commissionRate: Number(p.commission_rate) || matchInitial?.commissionRate || 0.10,
            monthlyRevenue: matchInitial?.monthlyRevenue || 45000000,
            completedJobs: matchInitial?.completedJobs || 120,
            experienceYears: matchInitial?.experienceYears || 3,
          };
        });

        // Merge keeping unique
        const existingIds = new Set(mappedFromDb.map(m => m.id));
        const merged = [...mappedFromDb, ...INITIAL_CELLA_STAFF.filter(init => !existingIds.has(init.id))];
        setTeamMembers(merged);
      } else {
        setTeamMembers(INITIAL_CELLA_STAFF);
      }
    } catch (err) {
      console.warn('Lấy dữ liệu nhân sự Supabase:', err);
      setTeamMembers(INITIAL_CELLA_STAFF);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      setIsLoadingRewards(true);
      const { data, error } = await supabase
        .from('rewards_disciplines')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRewards(data);
      }
    } catch (err) {
      console.warn('Lỗi tải khen thưởng:', err);
    } finally {
      setIsLoadingRewards(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchRewards();
  }, []);

  // Handle Add Staff
  const handleAddStaff = async () => {
    if (!newStaff.name.trim() || !newStaff.phone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại nhân sự!');
      return;
    }

    const createdStaff: StaffProfileData = {
      id: `NV-${Date.now().toString().slice(-4)}`,
      code: `CELLA-${Date.now().toString().slice(-4)}`,
      name: newStaff.name.trim(),
      phone: newStaff.phone.trim(),
      email: newStaff.email.trim() || `nv${Date.now().toString().slice(-4)}@cellamakeup.vn`,
      role: newStaff.role,
      branch: newStaff.branch,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      kpi: 95,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      cover: 'https://images.unsplash.com/photo-1512496015851-a1dc8a477d70?w=1200&auto=format&fit=crop&q=80',
      status: 'active',
      bio: newStaff.bio || 'Chuyên viên gia nhập đội ngũ CELLA MAKEUP ACADEMY.',
      baseSalary: Number(newStaff.baseSalary) || 8500000,
      commissionRate: 0.10,
      skills: ['Makeup Mới', 'Tư Vấn Khách'],
      completedJobs: 0,
      experienceYears: 1,
    };

    setTeamMembers(prev => [createdStaff, ...prev]);
    setIsAddStaffModalOpen(false);
    setNewStaff({
      name: '',
      phone: '',
      email: '',
      role: 'ARTIST',
      branch: '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình',
      bio: '',
      baseSalary: '8500000',
    });
    alert('Thêm hồ sơ nhân sự mới thành công!');
  };

  // Open edit modal
  const handleOpenEdit = (staff: StaffProfileData) => {
    setEditingStaff({ ...staff });
    setIsEditModalOpen(true);
  };

  // Save edited staff
  const handleSaveEditedStaff = async () => {
    if (!editingStaff) return;
    if (!editingStaff.name.trim() || !editingStaff.phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }

    const updated: StaffProfileData = {
      ...editingStaff,
      name: editingStaff.name.trim(),
      phone: editingStaff.phone.trim(),
      email: editingStaff.email.trim(),
      baseSalary: Number(editingStaff.baseSalary) || 0,
      commissionRate: Number(editingStaff.commissionRate) || 0.10,
    };

    // Update local state
    setTeamMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    if (selectedStaff && selectedStaff.id === updated.id) {
      setSelectedStaff(updated);
    }
    setIsEditModalOpen(false);

    // Sync to Supabase
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: updated.name,
        phone: updated.phone,
        email: updated.email,
        role: updated.role,
        base_salary: updated.baseSalary,
        commission_rate: updated.commissionRate,
        branch_studio: updated.branch,
        is_active: updated.status === 'active',
        bio: updated.bio,
      }).eq('id', updated.id);

      if (error) {
        console.warn('Lỗi Supabase khi lưu hồ sơ:', error.message);
      }
    } catch (err) {
      console.warn('Supabase update profile error:', err);
    }

    alert(`Đã lưu thay đổi hồ sơ nhân sự "${updated.name}" thành công!`);
  };

  // Handle Add Bonus
  const handleAddBonus = async () => {
    if (!newBonus.staff_id || !newBonus.amount || !newBonus.reason) {
      alert('Vui lòng điền đủ nhân sự, số tiền và lý do thưởng!');
      return;
    }
    const bonusItem = {
      id: `rw-${Date.now()}`,
      staff_id: newBonus.staff_id,
      type: 'REWARD',
      amount: parseFloat(newBonus.amount),
      reason: newBonus.reason,
      created_at: new Date().toISOString(),
      profiles: { full_name: teamMembers.find(m => m.id === newBonus.staff_id)?.name || 'Nhân sự' }
    };
    setRewards(prev => [bonusItem, ...prev]);
    setIsAddBonusOpen(false);
    setNewBonus({ staff_id: '', amount: '', reason: '' });
    alert('Đã lưu khen thưởng thành công!');
  };

  // Check-in capture
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>, type: 'in' | 'out') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      if (type === 'in') {
        setCheckInImg(url);
        setCheckInTime(`Vào ca: ${timeStr}`);
      } else {
        setCheckOutImg(url);
        setCheckOutTime(`Ra ca: ${timeStr}`);
      }
    }
  };

  const tabs = [
    { id: 'team' as TabType, label: 'Hồ sơ nhân sự', icon: Users, badge: teamMembers.length },
    { id: 'attendance' as TabType, label: 'Chấm công', icon: Clock },
    { id: 'payroll' as TabType, label: 'Bảng lương', icon: CreditCard },
    { id: 'bonus' as TabType, label: 'Khen thưởng', icon: Award },
  ];

  const roleFilters = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'SUPER_ADMIN', label: 'Ban Điều Hành' },
    { id: 'MASTER_ARTIST', label: 'Master Artist' },
    { id: 'ARTIST', label: 'Senior Artist' },
    { id: 'ACADEMY_TRAINER', label: 'Giảng viên' },
    { id: 'SALES_CONSULTANT', label: 'Tư vấn / CSKH' },
  ];

  const filteredTeam = teamMembers.filter((m) => {
    const matchSearch = (m.name || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
      (m.phone || '').includes(teamSearch) ||
      (m.code || '').toLowerCase().includes(teamSearch.toLowerCase());
    const matchRole = filterRole === 'ALL' || m.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-full bg-[#F4F7F4] pb-28 text-[#1A2820]">
      {/* Mobile Header (Botanical Luxury Forest Gradient) */}
      <MobileHeader
        title="Hồ Sơ Nhân Sự & Đội Ngũ"
        onBack={onBack}
        showBack={true}
        rightAction={
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('roles')}
              className="w-9 h-9 rounded-full bg-[#EAF2EC] text-[#264736] flex items-center justify-center border border-[#264736]/20 active:scale-95 transition-transform shadow-xs"
              title="Phân quyền vai trò"
            >
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        }
      />

      {/* Navigation Sub-Tabs */}
      <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-b border-[#264736]/10 sticky top-[60px] z-20 shadow-xs">
        <div className="flex bg-[#EAF2EC]/70 p-1 rounded-2xl gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold py-2 rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#264736] text-white shadow-sm'
                    : 'text-[#3D5A48] hover:text-[#1A2820] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-[#3D5A48]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-[#264736]/10 text-[#264736]'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================================= */}
        {/* TAB 1: HỒ SƠ NHÂN SỰ (STAFF DIRECTORY & PROFILES)                        */}
        {/* ========================================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-3.5 animate-in fade-in duration-300">
            {/* Hero Stats Banner (Simple & Elegant) */}
            <div className="rounded-3xl bg-gradient-to-br from-[#264736] via-[#1E3A2F] to-[#15271E] p-4 text-white shadow-sm border border-[#3D5A48]/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> CELLA TALENT ACADEMY
                  </span>
                  <h3 className="text-[16px] font-black text-white mt-0.5">
                    Hồ Sơ Nhân Sự & Lương Cơ Bản
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddStaffModalOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-emerald-400 text-[#15271E] text-[11.5px] font-black flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Thêm hồ sơ
                </button>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2 border border-white/10">
                  <span className="text-[10px] text-white/70 block font-medium">Tổng nhân sự</span>
                  <span className="text-[15px] font-black text-white">{teamMembers.length} người</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2 border border-white/10">
                  <span className="text-[10px] text-white/70 block font-medium">Tổng quỹ lương CB</span>
                  <span className="text-[15px] font-black text-emerald-300">
                    {(teamMembers.reduce((s, m) => s + (m.baseSalary || 8500000), 0) / 1000000).toFixed(1)} tr
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2 border border-white/10">
                  <span className="text-[10px] text-white/70 block font-medium">Đang hoạt động</span>
                  <span className="text-[15px] font-black text-amber-300">
                    {teamMembers.filter(m => m.status === 'active').length} active
                  </span>
                </div>
              </div>
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#3D5A48] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, SĐT, mã nhân sự..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#264736]/20 text-[12.5px] font-medium bg-white focus:outline-none focus:border-[#264736] focus:ring-1 focus:ring-[#264736]/30 shadow-2xs placeholder:text-slate-400"
                />
              </div>

              {/* View Switcher: Grid vs List */}
              <div className="flex bg-white rounded-2xl border border-[#264736]/20 p-1 shadow-2xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#264736] text-white' : 'text-[#3D5A48]'}`}
                  title="Dạng thẻ hồ sơ"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#264736] text-white' : 'text-[#3D5A48]'}`}
                  title="Dạng danh sách"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {roleFilters.map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setFilterRole(rf.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95 ${
                    filterRole === rf.id
                      ? 'bg-[#264736] text-white shadow-xs'
                      : 'bg-white border border-[#264736]/15 text-[#3D5A48] hover:bg-[#EAF2EC]'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            {/* Staff List / Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#3D5A48]">
                <Loader2 className="w-8 h-8 animate-spin text-[#264736]" />
                <p className="text-[12px] font-medium">Đang tải hồ sơ nhân sự Supabase...</p>
              </div>
            ) : filteredTeam.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#264736]/10 text-slate-500">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-[13px] font-bold text-[#1A2820]">Không tìm thấy hồ sơ nhân sự</p>
                <p className="text-[11px] text-[#3D5A48] mt-1">Thử từ khóa khác hoặc chuyển bộ lọc vai trò</p>
              </div>
            ) : viewMode === 'grid' ? (
              /* ── GRID MODE: STREAMLINED CARDS WITH BASE SALARY & EDIT ── */
              <div className="grid grid-cols-1 gap-3">
                {filteredTeam.map((member) => {
                  const role = ROLE_META[member.role] || ROLE_META.ARTIST;
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        setSelectedStaff(member);
                        setDetailTab('overview');
                      }}
                      className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-md hover:border-[#264736]/40 transition-all cursor-pointer relative"
                    >
                      {/* Hàng 1: Avatar, Tên, Chức danh, SĐT */}
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#264736]/15 shadow-2xs"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                            title={member.status === 'active' ? 'Đang hoạt động' : 'Nghỉ phép'}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <h4 className="text-[14px] font-black text-[#1A2820] truncate">
                              {member.name}
                            </h4>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${role.border} ${role.bg} ${role.color}`}>
                              {role.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span className="font-mono text-slate-700 font-semibold">{member.phone}</span>
                            <span>•</span>
                            <span className="text-[#3D5A48] font-bold">{member.code || member.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hàng 2: LƯƠNG CĂN BẢN (Nổi bật, rõ ràng) */}
                      <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#F4F7F4] border border-[#264736]/15 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-[#264736]">💵 Lương căn bản:</span>
                          <span className="text-[13px] font-black text-[#1A2820]">
                            {(member.baseSalary || 8500000).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-[#EAF2EC] px-2 py-0.5 rounded-md border border-[#264736]/15">
                          + {((member.commissionRate || 0.10) * 100).toFixed(0)}% hoa hồng
                        </span>
                      </div>

                      {/* Hàng 3: Thao tác (Sửa hồ sơ, Chi tiết, Gọi, Zalo) */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200/80 flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
                            title="Chỉnh sửa thông tin & lương"
                          >
                            <Edit2 className="w-3 h-3 text-amber-700" /> Sửa hồ sơ
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStaff(member);
                              setDetailTab('overview');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-[#EAF2EC] hover:bg-[#DEEAE1] text-[#264736] text-[11px] font-bold border border-[#264736]/15 flex items-center gap-0.5 active:scale-95 transition-all shadow-2xs"
                          >
                            Chi tiết <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${member.phone}`}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#264736] hover:text-white text-[#264736] flex items-center justify-center transition-colors shadow-2xs"
                            title="Gọi điện"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://zalo.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 h-7 rounded-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 flex items-center justify-center text-[10px] font-bold transition-colors shadow-2xs"
                            title="Nhắn Zalo"
                          >
                            Zalo
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── LIST MODE: STREAMLINED ROWS WITH SALARY & EDIT ── */
              <div className="space-y-2">
                {filteredTeam.map((member) => {
                  const role = ROLE_META[member.role] || ROLE_META.ARTIST;
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        setSelectedStaff(member);
                        setDetailTab('overview');
                      }}
                      className="bg-white rounded-2xl border border-slate-200/90 p-3 flex items-center gap-3 cursor-pointer hover:bg-[#F9FAF9] shadow-2xs transition-colors"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-[#264736]/15"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="text-[13.5px] font-black text-[#1A2820] truncate">{member.name}</h4>
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${role.bg} ${role.color}`}>
                            {role.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#3D5A48]">
                          <span className="font-bold text-[#264736]">💵 {(member.baseSalary || 8500000).toLocaleString('vi-VN')} đ</span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">{member.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="px-2 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[10.5px] font-bold flex items-center gap-1 hover:bg-amber-100"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <a
                          href={`tel:${member.phone}`}
                          className="w-7 h-7 rounded-full bg-[#EAF2EC] text-[#264736] flex items-center justify-center hover:bg-[#264736] hover:text-white transition-colors"
                          title="Gọi điện"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedStaff(member);
                            setDetailTab('overview');
                          }}
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-[#264736] hover:text-white transition-colors"
                          title="Xem chi tiết"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHẤM CÔNG (ATTENDANCE)                                            */}
        {/* ========================================================================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Check-in Action Box */}
            <div className="bg-white p-5 rounded-3xl border border-[#264736]/15 shadow-sm">
              <div className="text-center mb-4">
                <span className="text-[11px] font-bold text-[#264736] bg-[#EAF2EC] px-3 py-1 rounded-full inline-block mb-1.5">
                  🌿 Điểm danh Studio CELLA
                </span>
                <h3 className="text-[15px] font-black text-[#1A2820]">Chấm công hôm nay</h3>
                <p className="text-[11.5px] text-[#3D5A48] flex items-center justify-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#264736]" /> 
                  <span className="font-bold text-[#1E3A2F]">Vị trí hợp lệ:</span> 37–39 Phan Bội Châu, TP. Thái Bình
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Vào ca */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={checkInInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleImageCapture(e, 'in')}
                  />
                  {checkInImg ? (
                    <div className="relative w-full h-28 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xs">
                      <img src={checkInImg} alt="Vào ca" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xs p-1.5 text-center text-white text-[11px] font-bold">
                        {checkInTime}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => checkInInputRef.current?.click()}
                      className="w-full h-28 bg-[#EAF2EC] hover:bg-[#DEEAE1] transition-colors border-2 border-[#264736]/25 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 text-[#264736]"
                    >
                      <Camera className="w-6 h-6" />
                      <span className="text-[12px] font-bold">Vào ca (Check-in)</span>
                    </button>
                  )}
                </div>

                {/* Ra ca */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={checkOutInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleImageCapture(e, 'out')}
                  />
                  {checkOutImg ? (
                    <div className="relative w-full h-28 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xs">
                      <img src={checkOutImg} alt="Ra ca" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xs p-1.5 text-center text-white text-[11px] font-bold">
                        {checkOutTime}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => checkOutInputRef.current?.click()}
                      className="w-full h-28 bg-[#EAF2EC] hover:bg-[#DEEAE1] transition-colors border-2 border-[#264736]/25 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 text-[#264736]"
                    >
                      <Clock className="w-6 h-6" />
                      <span className="text-[12px] font-bold">Tan ca (Check-out)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance history */}
            <div className="bg-white rounded-3xl border border-[#264736]/15 p-4 shadow-sm">
              <h4 className="text-[13.5px] font-black text-[#1A2820] mb-3">Lịch sử chấm công tuần này</h4>
              <div className="space-y-2.5">
                {[
                  { date: 'Hôm nay (01/10)', in: '08:15', out: '18:00', status: 'Đúng giờ', color: 'text-emerald-700 bg-emerald-50' },
                  { date: 'Hôm qua (30/09)', in: '08:20', out: '18:15', status: 'Đúng giờ', color: 'text-emerald-700 bg-emerald-50' },
                  { date: 'Thứ Hai (29/09)', in: '08:10', out: '18:30', status: 'Tăng ca', color: 'text-blue-700 bg-blue-50' },
                  { date: 'Chủ Nhật (28/09)', in: '07:30', out: '19:00', status: 'Lịch Cô dâu', color: 'text-rose-700 bg-rose-50' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F9FAF9] border border-slate-100">
                    <div>
                      <span className="text-[12.5px] font-bold text-[#1A2820] block">{item.date}</span>
                      <span className="text-[11px] text-[#3D5A48]">Vào: {item.in} · Ra: {item.out}</span>
                    </div>
                    <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BẢNG LƯƠNG & HOA HỒNG (PAYROLL)                                   */}
        {/* ========================================================================= */}
        {activeTab === 'payroll' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Payroll Hero Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#264736] via-[#1E3A2F] to-[#12241A] p-5 text-white shadow-md border border-[#3D5A48]/30">
              <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block mb-1">
                Thu nhập ước tính tháng này
              </span>
              <div className="text-3xl font-black text-white mb-2">18,500,000 đ</div>
              <div className="flex items-center justify-between text-[11px] text-white/80 pt-2 border-t border-white/10">
                <span>Lương cứng: 10,000,000 đ</span>
                <span className="text-emerald-300 font-bold">Hoa hồng: 8,500,000 đ</span>
              </div>
            </div>

            <button
              onClick={() => setIsPayrollDetailOpen(true)}
              className="w-full py-3 rounded-2xl bg-[#EAF2EC] text-[#264736] border border-[#264736]/20 font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <FileText className="w-4 h-4" />
              Xem chi tiết phiếu lương tháng 9/2026
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KHEN THƯỞNG & VINH DANH (BONUS)                                    */}
        {/* ========================================================================= */}
        {activeTab === 'bonus' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <button
              onClick={() => setIsAddBonusOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#264736] text-white text-[13.5px] font-bold shadow-md shadow-[#264736]/20 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Thêm quyết định khen thưởng
            </button>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-md">
              <h3 className="text-[12px] font-bold opacity-90 mb-1">Tổng Thưởng Nóng Cơ Sở</h3>
              <div className="text-3xl font-black mb-2">3,500,000 đ</div>
              <p className="text-[12px] font-medium opacity-90 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-white" /> Vinh danh Top 1 Artist xuất sắc mùa cưới 2025
              </p>
            </div>

            <h4 className="text-[13.5px] font-black text-[#1A2820] px-1">Lịch sử khen thưởng & vinh danh</h4>
            <div className="space-y-2.5">
              {rewards.map((item, i) => (
                <div key={item.id || i} className="bg-white p-3.5 rounded-2xl border border-[#264736]/15 flex items-start gap-3 shadow-2xs">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-[13px] font-black text-[#1A2820]">
                        {item.profiles?.full_name || 'Nhân sự CELLA'}
                      </p>
                      <span className="font-black text-emerald-600 text-[13px]">
                        +{Number(item.amount).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <p className="text-[12px] text-[#3D5A48] mt-0.5">{item.reason}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(item.created_at || Date.now()).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ── MODAL CHI TIẾT HỒ SƠ NHÂN SỰ (STREAMLINED LUXURY PROFILE DRAWER) ──    */}
      {/* ========================================================================= */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-3xl max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header Hero */}
            <div className="bg-gradient-to-br from-[#264736] via-[#1E3A2F] to-[#12241A] p-5 text-white relative shrink-0">
              <button
                onClick={() => setSelectedStaff(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="relative shrink-0">
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/30 shadow-md"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-[#1E3A2F] ${
                      selectedStaff.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[17px] font-black text-white truncate">
                      {selectedStaff.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-[#12241A]">
                      {ROLE_META[selectedStaff.role]?.label || selectedStaff.role}
                    </span>
                    <span className="text-[10.5px] font-bold text-emerald-200/90 font-mono">
                      {selectedStaff.code || selectedStaff.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Edit, Call, Zalo) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedStaff)}
                  className="py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Sửa hồ sơ
                </button>
                <a
                  href={`tel:${selectedStaff.phone}`}
                  className="py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/10"
                >
                  <Phone className="w-3.5 h-3.5" /> Gọi điện
                </a>
                <a
                  href={`https://zalo.me/${selectedStaff.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 rounded-xl bg-blue-500/90 hover:bg-blue-600 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>

            {/* Scrollable Content: Essential Info Only */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-[12.5px] no-scrollbar">
              {/* Thẻ 1: Thông tin liên hệ & Công tác */}
              <div className="bg-[#F9FAF9] p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Thông tin công tác & Liên hệ
                </h5>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-[12px]">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Số điện thoại</span>
                    <span className="font-bold text-[#1A2820] font-mono">{selectedStaff.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Email</span>
                    <span className="font-bold text-[#1A2820] truncate block">{selectedStaff.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Ngày gia nhập</span>
                    <span className="font-bold text-[#1A2820]">{selectedStaff.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Thâm niên</span>
                    <span className="font-bold text-emerald-800">{selectedStaff.experienceYears || 3} năm kinh nghiệm</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10.5px]">Cơ sở làm việc</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#264736] shrink-0" /> {selectedStaff.branch}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thẻ 2: Hiệu suất & Chuyên môn */}
              <div className="bg-[#F9FAF9] p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Hiệu suất & Thế mạnh chuyên môn
                </h5>

                {/* 3 Stats Mini */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Đánh giá</span>
                    <span className="text-[14px] font-black text-amber-600">⭐ {selectedStaff.rating || 5.0}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Điểm KPI</span>
                    <span className="text-[14px] font-black text-emerald-700">{selectedStaff.kpi}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 block font-medium">Hoàn thành</span>
                    <span className="text-[14px] font-black text-[#264736]">{selectedStaff.completedJobs || 120} ca</span>
                  </div>
                </div>

                {/* Skills tags */}
                {selectedStaff.skills && selectedStaff.skills.length > 0 && (
                  <div className="pt-1">
                    <span className="text-slate-400 block text-[10.5px] mb-1.5">Kỹ năng thế mạnh</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStaff.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#EAF2EC] text-[#264736] border border-[#264736]/20 font-bold text-[11px]"
                        >
                          ✦ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Thẻ 3: Chế độ đãi ngộ & Lương căn bản */}
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-amber-900 mb-2">
                  <span>💵 Lương căn bản & Hoa hồng</span>
                  <span className="text-amber-800 font-bold lowercase bg-amber-100 px-2 py-0.5 rounded">tháng 9/2026</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
                    <span className="text-[10.5px] text-slate-500 block font-medium">Lương căn bản</span>
                    <span className="text-[14px] font-black text-slate-900">
                      {Number(selectedStaff.baseSalary || 8500000).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
                    <span className="text-[10.5px] text-slate-500 block font-medium">Tỷ lệ hoa hồng</span>
                    <span className="text-[14px] font-black text-[#264736]">
                      {((selectedStaff.commissionRate || 0.10) * 100).toFixed(0)}% dịch vụ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedStaff)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" /> Sửa thông tin & Lương
              </button>
              <button
                type="button"
                onClick={() => onNavigate('roles')}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#264736]" /> Phân quyền
              </button>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="py-2.5 px-4 rounded-xl bg-[#264736] text-white font-bold text-[12px] active:scale-95 transition-all shadow-xs hover:bg-[#1E3A2F]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── MODAL THÊM HỒ SƠ NHÂN SỰ MỚI ──                                        */}
      {/* ========================================================================= */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-[16px] font-black text-[#1A2820]">Thêm hồ sơ nhân sự mới</h3>
                <p className="text-[11px] text-[#3D5A48]">Tạo hồ sơ chuyên viên gia nhập CELLA</p>
              </div>
              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-3.5 no-scrollbar">
              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Phương Thảo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="Ví dụ: 0987 654 321"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="phuongthao@cellamakeup.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Vai trò / Chức danh</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 font-medium focus:outline-none focus:border-[#264736]"
                >
                  <option value="ARTIST">Senior Artist (Chuyên viên trang điểm)</option>
                  <option value="MASTER_ARTIST">Master Artist (Thợ chính / Nghệ sĩ chính)</option>
                  <option value="ACADEMY_TRAINER">Giảng viên Đào tạo Học viện</option>
                  <option value="SALES_CONSULTANT">Tư vấn tuyển sinh & CSKH</option>
                  <option value="ADMIN">Quản lý cơ sở (Admin)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Lương cơ bản (VNĐ)</label>
                <input
                  type="number"
                  value={newStaff.baseSalary}
                  onChange={(e) => setNewStaff({ ...newStaff, baseSalary: e.target.value })}
                  placeholder="8500000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Chi nhánh làm việc</label>
                <input
                  type="text"
                  value={newStaff.branch}
                  onChange={(e) => setNewStaff({ ...newStaff, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Giới thiệu ngắn / Điểm mạnh</label>
                <textarea
                  value={newStaff.bio}
                  onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
                  placeholder="Chuyên môn makeup, kinh nghiệm..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-[#F9FAF9]">
              <button
                onClick={handleAddStaff}
                className="w-full py-3.5 bg-[#264736] text-white rounded-2xl text-[14px] font-bold shadow-md shadow-[#264736]/20 active:scale-95 transition-transform"
              >
                Lưu hồ sơ nhân sự
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── MODAL CHỈNH SỬA HỒ SƠ & LƯƠNG CĂN BẢN (EDIT STAFF MODAL) ──              */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-[16px] font-black text-[#1A2820] flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-600" /> Chỉnh sửa hồ sơ & Lương
                </h3>
                <p className="text-[11px] text-[#3D5A48]">Mã nhân sự: <span className="font-mono font-bold text-slate-700">{editingStaff.code || editingStaff.id}</span></p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3.5 no-scrollbar">
              {/* Họ tên */}
              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  placeholder="Họ và tên nhân sự"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white font-medium"
                />
              </div>

              {/* SĐT & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    placeholder="0987 654 321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    placeholder="email@cellamakeup.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                  />
                </div>
              </div>

              {/* Chức danh & Trạng thái */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Chức danh / Vai trò</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 font-medium focus:outline-none focus:border-[#264736]"
                  >
                    <option value="ARTIST">Senior Artist</option>
                    <option value="MASTER_ARTIST">Master Artist</option>
                    <option value="ACADEMY_TRAINER">Giảng viên Học viện</option>
                    <option value="SALES_CONSULTANT">Tư vấn tuyển sinh</option>
                    <option value="ADMIN">Quản lý cơ sở (Admin)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Trạng thái làm việc</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as 'active' | 'leave' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-50 font-medium focus:outline-none focus:border-[#264736]"
                  >
                    <option value="active">🟢 Đang làm việc</option>
                    <option value="leave">🟡 Nghỉ phép / Tạm dừng</option>
                  </select>
                </div>
              </div>

              {/* PHẦN LƯƠNG CĂN BẢN & HOA HỒNG - NỔI BẬT */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    💵 Lương căn bản & Hoa hồng
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md">
                    Chính sách đãi ngộ
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-800">
                      Lương căn bản (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editingStaff.baseSalary || 0}
                      onChange={(e) => setEditingStaff({ ...editingStaff, baseSalary: Number(e.target.value) || 0 })}
                      step="500000"
                      min="0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-[14px] font-black text-slate-900 bg-white focus:outline-none focus:border-[#264736] focus:ring-1 focus:ring-[#264736]"
                    />
                    <p className="text-[11px] font-bold text-emerald-700">
                      = {Number(editingStaff.baseSalary || 0).toLocaleString('vi-VN')} đ/tháng
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-800">
                      Tỷ lệ hoa hồng (%)
                    </label>
                    <input
                      type="number"
                      value={Math.round((editingStaff.commissionRate || 0.1) * 100)}
                      onChange={(e) => setEditingStaff({ ...editingStaff, commissionRate: (Number(e.target.value) || 0) / 100 })}
                      step="1"
                      min="0"
                      max="100"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-[14px] font-black text-[#264736] bg-white focus:outline-none focus:border-[#264736]"
                    />
                    <p className="text-[11px] font-bold text-slate-500">
                      = {((editingStaff.commissionRate || 0.1) * 100).toFixed(0)}% trên dịch vụ
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi nhánh & Kinh nghiệm */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Chi nhánh làm việc</label>
                  <input
                    type="text"
                    value={editingStaff.branch}
                    onChange={(e) => setEditingStaff({ ...editingStaff, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[12.5px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12.5px] font-bold text-slate-700">Năm kinh nghiệm</label>
                  <input
                    type="number"
                    value={editingStaff.experienceYears || 1}
                    onChange={(e) => setEditingStaff({ ...editingStaff, experienceYears: Number(e.target.value) || 1 })}
                    min="0"
                    max="40"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[12.5px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                  />
                </div>
              </div>

              {/* Kỹ năng */}
              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Kỹ năng thế mạnh (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={editingStaff.skills?.join(', ') || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="Ví dụ: Cô Dâu Tone Trong Trẻo, Bới Tóc..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[12.5px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white"
                />
              </div>

              {/* Giới thiệu ngắn */}
              <div className="space-y-1">
                <label className="text-[12.5px] font-bold text-slate-700">Giới thiệu ngắn / Tiểu sử</label>
                <textarea
                  value={editingStaff.bio || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                  placeholder="Giới thiệu về kỹ năng, phong cách makeup..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[12.5px] bg-slate-50 focus:outline-none focus:border-[#264736] focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-[#F9FAF9] flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-[13px] hover:bg-slate-100 active:scale-95 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEditedStaff}
                className="flex-1 py-3 bg-[#264736] hover:bg-[#1E3A2F] text-white rounded-xl text-[13.5px] font-bold shadow-md shadow-[#264736]/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Lưu thay đổi hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL KHEN THƯỞNG ── */}
      {isAddBonusOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl min-h-[50vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-black text-[#1A2820]">Thêm quyết định khen thưởng</h3>
              <button
                onClick={() => setIsAddBonusOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Chọn nhân sự nhận thưởng</label>
                <select
                  value={newBonus.staff_id}
                  onChange={(e) => setNewBonus({ ...newBonus, staff_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736]"
                >
                  <option value="">-- Chọn nhân sự --</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Số tiền thưởng (VNĐ)</label>
                <input
                  type="number"
                  value={newBonus.amount}
                  onChange={(e) => setNewBonus({ ...newBonus, amount: e.target.value })}
                  placeholder="Ví dụ: 1000000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Lý do khen thưởng</label>
                <textarea
                  value={newBonus.reason}
                  onChange={(e) => setNewBonus({ ...newBonus, reason: e.target.value })}
                  placeholder="Ví dụ: Đạt KPI xuất sắc mùa cưới tháng 9/2026..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] bg-slate-50 focus:outline-none focus:border-[#264736] resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-[#F9FAF9]">
              <button
                onClick={handleAddBonus}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-[14px] font-bold shadow-md shadow-amber-500/25 active:scale-95 transition-transform"
              >
                Xác nhận trao thưởng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CHI TIẾT PHIẾU LƯƠNG ── */}
      {isPayrollDetailOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <button
              onClick={() => setIsPayrollDetailOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-[16px] font-black text-[#1A2820]">Phiếu lương tháng 9/2026</h2>
            <div className="w-8" />
          </div>
          <div className="flex-1 overflow-y-auto bg-[#F4F7F4] p-4 pb-20 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#264736]/15 shadow-sm text-center">
              <p className="text-[13px] font-bold text-[#3D5A48] mb-1">Thực nhận kỳ này</p>
              <h1 className="text-3xl font-black text-emerald-700">18,500,000 đ</h1>
              <p className="text-[12px] text-slate-400 mt-1.5">Kỳ lương: 01/09 - 30/09/2026</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              <div className="p-4 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Lương cơ bản (22 ngày công)</span>
                <span className="font-black text-[#1A2820]">10,000,000 đ</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Hoa hồng dịch vụ makeup (12%)</span>
                <span className="font-black text-emerald-600">+7,500,000 đ</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Thưởng KPI vượt mục tiêu</span>
                <span className="font-black text-emerald-600">+1,500,000 đ</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Phụ cấp ăn trưa & đi lại</span>
                <span className="font-black text-slate-900">+500,000 đ</span>
              </div>
              <div className="p-4 flex justify-between items-center bg-rose-50/50">
                <span className="text-rose-700 font-medium">Đóng BHXH / BHYT</span>
                <span className="font-black text-rose-600">-1,000,000 đ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
