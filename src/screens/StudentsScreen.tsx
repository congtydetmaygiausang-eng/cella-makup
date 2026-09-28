import React, { useState, useEffect, useRef } from 'react';
import { Student, ScreenId, UserAccount } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import {
  GraduationCap,
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  UserCheck,
  AlertCircle,
  DollarSign,
  Camera,
  Upload,
  BookOpen,
  MapPin,
  Sparkles,
  Maximize2,
  Share2,
} from 'lucide-react';

interface StudentsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  currentUser: UserAccount;
}

const STORAGE_KEY = 'cella_students_v2';

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_01',
    studentCode: 'HV-2025-01',
    name: 'Lê Thu Thảo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    phone: '0984 556 712',
    zaloPhone: '0984556712',
    email: 'thuthao.makeup@gmail.com',
    birthday: '14/05/2002',
    hometown: 'Thành phố Thái Bình',
    courseName: 'Khóa Makeup Chuyên Nghiệp Toàn Diện PRO',
    classCode: 'K28-PRO',
    instructorName: 'Master Cella Hương Phượng',
    enrollmentDate: '15/01/2025',
    graduationDate: '15/04/2025',
    status: 'STUDYING',
    tuitionFee: 25000000,
    paidAmount: 25000000,
    paymentStatus: 'PAID',
    attendanceRate: 98,
    skillLevel: 'XUAT_SAC',
    certStatus: 'PENDING',
    notes: 'Tay cọ rất chắc chắn, cảm quan màu sắc nhạy bén. Đã hoàn thành xuất sắc bài thi Tone Tây và Tone Thái Glamour.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'std_02',
    studentCode: 'HV-2025-02',
    name: 'Hoàng Mỹ Linh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    phone: '0977 123 456',
    zaloPhone: '0977123456',
    email: 'mylinh.makeup@gmail.com',
    birthday: '22/09/2000',
    hometown: 'Ý Yên, Nam Định',
    courseName: 'Khóa Makeup Cô Dâu Master Bridal',
    classCode: 'K15-BRIDAL',
    instructorName: 'Trần Thị Lan Anh',
    enrollmentDate: '01/12/2024',
    graduationDate: '01/03/2025',
    status: 'GRADUATED',
    tuitionFee: 18000000,
    paidAmount: 18000000,
    paymentStatus: 'PAID',
    attendanceRate: 100,
    skillLevel: 'XUAT_SAC',
    certStatus: 'CERTIFIED',
    notes: 'Tốt nghiệp thủ khoa khóa K15. Đã mở Bridal Studio riêng tại Nam Định với doanh thu ổn định.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'std_03',
    studentCode: 'HV-2025-03',
    name: 'Phạm Ngọc Diệp',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    phone: '0963 888 999',
    zaloPhone: '0963888999',
    email: 'ngocdiep.p@gmail.com',
    birthday: '08/03/2003',
    hometown: 'Thủy Nguyên, Hải Phòng',
    courseName: 'Khóa Makeup Chuyên Nghiệp Toàn Diện PRO',
    classCode: 'K28-PRO',
    instructorName: 'Master Cella Hương Phượng',
    enrollmentDate: '15/01/2025',
    graduationDate: '15/04/2025',
    status: 'STUDYING',
    tuitionFee: 25000000,
    paidAmount: 15000000,
    paymentStatus: 'PARTIAL',
    attendanceRate: 94,
    skillLevel: 'GIOI',
    certStatus: 'PENDING',
    notes: 'Kỹ thuật nền mỏng mịn glass-skin rất tốt. Đang chuẩn bị hoàn thành học phí đợt 2 trước kỳ thi tốt nghiệp.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'std_04',
    studentCode: 'HV-2025-04',
    name: 'Nguyễn Thảo Vy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    phone: '0912 345 678',
    zaloPhone: '0912345678',
    birthday: '19/11/1999',
    hometown: 'Kiến Xương, Thái Bình',
    courseName: 'Khóa Makeup Cá Nhân Tự Tin',
    classCode: 'K42-BASIC',
    instructorName: 'Hoàng Minh Anh',
    enrollmentDate: '10/02/2025',
    graduationDate: '28/02/2025',
    status: 'GRADUATED',
    tuitionFee: 5500000,
    paidAmount: 5500000,
    paymentStatus: 'PAID',
    attendanceRate: 100,
    skillLevel: 'GIOI',
    certStatus: 'CERTIFIED',
    notes: 'Nắm vững kỹ năng trang điểm công sở và dự tiệc cá nhân, biết phối màu theo tone da chuẩn phong cách.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'std_05',
    studentCode: 'HV-2025-05',
    name: 'Đỗ Quỳnh Anh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    phone: '0904 999 111',
    zaloPhone: '0904999111',
    birthday: '03/07/2001',
    hometown: 'Cầu Giấy, Hà Nội',
    courseName: 'Khóa Nghệ Thuật & Thời Trang Editorial',
    classCode: 'K08-EDITORIAL',
    instructorName: 'Nguyễn Thu Trang',
    enrollmentDate: '05/11/2024',
    status: 'RESERVED',
    tuitionFee: 22000000,
    paidAmount: 22000000,
    paymentStatus: 'PAID',
    attendanceRate: 88,
    skillLevel: 'KHA',
    certStatus: 'NONE',
    notes: 'Xin bảo lưu 2 tháng vì việc gia đình. Đã đóng đủ 100% học phí, sẽ nhập học lại cùng khóa K09.',
    portfolioImages: []
  }
];

export const StudentsScreen: React.FC<StudentsScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
}) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading students:', e);
    }
    return INITIAL_STUDENTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'STUDYING' | 'GRADUATED' | 'RESERVED' | 'UNPAID'>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');

  // Modals state
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Student>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Error saving students:', e);
    }
  }, [students]);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.studentCode.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.classCode.toLowerCase().includes(q) ||
      s.courseName.toLowerCase().includes(q) ||
      s.instructorName.toLowerCase().includes(q);

    let matchStatus = true;
    if (statusFilter === 'STUDYING') matchStatus = s.status === 'STUDYING';
    else if (statusFilter === 'GRADUATED') matchStatus = s.status === 'GRADUATED';
    else if (statusFilter === 'RESERVED') matchStatus = s.status === 'RESERVED';
    else if (statusFilter === 'UNPAID') matchStatus = s.paymentStatus !== 'PAID';

    let matchCourse = true;
    if (selectedCourse !== 'ALL') {
      matchCourse = s.courseName.includes(selectedCourse);
    }

    return matchSearch && matchStatus && matchCourse;
  });

  // Metrics
  const totalCount = students.length;
  const studyingCount = students.filter((s) => s.status === 'STUDYING').length;
  const graduatedCount = students.filter((s) => s.status === 'GRADUATED').length;
  const reservedCount = students.filter((s) => s.status === 'RESERVED').length;

  // Handlers
  const handleOpenAdd = () => {
    const nextCode = `HV-2025-${String(students.length + 1).padStart(2, '0')}`;
    setFormData({
      studentCode: nextCode,
      name: '',
      phone: '',
      zaloPhone: '',
      email: '',
      birthday: '',
      hometown: 'Thái Bình',
      courseName: 'Khóa Makeup Chuyên Nghiệp Toàn Diện PRO',
      classCode: 'K29-PRO',
      instructorName: 'Master Cella Hương Phượng',
      enrollmentDate: new Date().toLocaleDateString('vi-VN'),
      status: 'STUDYING',
      tuitionFee: 25000000,
      paidAmount: 25000000,
      paymentStatus: 'PAID',
      attendanceRate: 100,
      skillLevel: 'GIOI',
      certStatus: 'PENDING',
      notes: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      portfolioImages: [],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setFormData({ ...student });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name?.trim()) {
      alert('Vui lòng nhập Họ tên học viên!');
      return;
    }
    const newStudent: Student = {
      id: `std_${Date.now()}`,
      studentCode: formData.studentCode || `HV-2025-${Date.now().toString().slice(-2)}`,
      name: formData.name.trim(),
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      phone: formData.phone || '',
      zaloPhone: formData.zaloPhone || formData.phone || '',
      email: formData.email || '',
      birthday: formData.birthday || '',
      hometown: formData.hometown || '',
      courseName: formData.courseName || 'Khóa Makeup Chuyên Nghiệp Toàn Diện PRO',
      classCode: formData.classCode || 'K29-PRO',
      instructorName: formData.instructorName || 'Master Cella Hương Phượng',
      enrollmentDate: formData.enrollmentDate || new Date().toLocaleDateString('vi-VN'),
      graduationDate: formData.graduationDate || '',
      status: (formData.status as any) || 'STUDYING',
      tuitionFee: Number(formData.tuitionFee) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      paymentStatus:
        Number(formData.paidAmount) >= Number(formData.tuitionFee)
          ? 'PAID'
          : Number(formData.paidAmount) > 0
          ? 'PARTIAL'
          : 'UNPAID',
      attendanceRate: Number(formData.attendanceRate) || 100,
      skillLevel: formData.skillLevel || 'GIOI',
      certStatus: formData.certStatus || 'PENDING',
      notes: formData.notes || '',
      portfolioImages: formData.portfolioImages || [],
    };

    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!formData.id || !formData.name?.trim()) return;

    const tuition = Number(formData.tuitionFee) || 0;
    const paid = Number(formData.paidAmount) || 0;
    const payStatus = paid >= tuition ? 'PAID' : paid > 0 ? 'PARTIAL' : 'UNPAID';

    setStudents(
      students.map((s) =>
        s.id === formData.id
          ? ({
              ...s,
              ...formData,
              tuitionFee: tuition,
              paidAmount: paid,
              paymentStatus: payStatus,
            } as Student)
          : s
      )
    );

    if (activeStudent?.id === formData.id) {
      setActiveStudent({
        ...activeStudent,
        ...formData,
        tuitionFee: tuition,
        paidAmount: paid,
        paymentStatus: payStatus,
      } as Student);
    }

    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ học viên "${name}" không?`)) {
      setStudents(students.filter((s) => s.id !== id));
      if (activeStudent?.id === id) setActiveStudent(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPayFull = (student: Student) => {
    if (window.confirm(`Xác nhận học viên ${student.name} đã hoàn tất thanh toán số tiền còn thiếu ${(student.tuitionFee - student.paidAmount).toLocaleString('vi-VN')} đ?`)) {
      const updated = {
        ...student,
        paidAmount: student.tuitionFee,
        paymentStatus: 'PAID' as const,
      };
      setStudents(students.map((s) => (s.id === student.id ? updated : s)));
      setActiveStudent(updated);
    }
  };

  const handleToggleGraduate = (student: Student) => {
    const isNowGraduated = student.status !== 'GRADUATED';
    const updated: Student = {
      ...student,
      status: isNowGraduated ? 'GRADUATED' : 'STUDYING',
      certStatus: isNowGraduated ? 'CERTIFIED' : 'PENDING',
      graduationDate: isNowGraduated
        ? new Date().toLocaleDateString('vi-VN')
        : undefined,
    };
    setStudents(students.map((s) => (s.id === student.id ? updated : s)));
    setActiveStudent(updated);
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900 relative">
      <MobileHeader
        title="Hồ sơ Học viên"
        subtitle="Học viện Đào tạo CELLA Academy"
        showBack={true}
        onBack={onBack || (() => onNavigate('academy'))}
        rightAction={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#544CDE] to-[#7B73F0] text-white text-xs font-bold shadow-md shadow-indigo-200 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học viên</span>
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Banner Số liệu Academy */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0A0A0C] text-white p-4 relative overflow-hidden shadow-lg">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Học viên Khóa Học CELLA
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                Thái Bình Academy
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 text-center border-t border-white/10">
              <div>
                <div className="text-lg font-black text-white">{totalCount}</div>
                <div className="text-[10px] text-slate-300">Tổng HV</div>
              </div>
              <div>
                <div className="text-lg font-black text-emerald-400">{studyingCount}</div>
                <div className="text-[10px] text-slate-300">Đang học</div>
              </div>
              <div>
                <div className="text-lg font-black text-amber-400">{graduatedCount}</div>
                <div className="text-[10px] text-slate-300">Tốt nghiệp</div>
              </div>
              <div>
                <div className="text-lg font-black text-rose-300">{reservedCount}</div>
                <div className="text-[10px] text-slate-300">Bảo lưu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên học viên, mã HV, SĐT, lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#544CDE]/30 shadow-sm"
          />
        </div>

        {/* Tabs Filter theo Trạng thái */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'ALL', label: `Tất cả (${totalCount})` },
            { id: 'STUDYING', label: `Đang học (${studyingCount})` },
            { id: 'GRADUATED', label: `Đã tốt nghiệp (${graduatedCount})` },
            { id: 'RESERVED', label: `Bảo lưu (${reservedCount})` },
            { id: 'UNPAID', label: 'Chưa đủ học phí' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#544CDE] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Danh sách học viên */}
        <div className="space-y-3">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">Không tìm thấy học viên nào</p>
              <p className="text-xs text-slate-400">Hãy thử tìm kiếm với từ khóa khác hoặc thêm học viên mới.</p>
            </div>
          ) : (
            filteredStudents.map((std) => {
              const remaining = std.tuitionFee - std.paidAmount;
              const payPercent = Math.min(100, Math.round((std.paidAmount / (std.tuitionFee || 1)) * 100));

              return (
                <GlassCard
                  key={std.id}
                  className="p-4 bg-white border border-slate-100 space-y-3 hover:shadow-md transition-all rounded-2xl"
                >
                  {/* Top info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      onClick={() => setActiveStudent(std)}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 cursor-pointer shadow-sm hover:opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3
                            onClick={() => setActiveStudent(std)}
                            className="text-[14px] font-black text-slate-900 cursor-pointer hover:text-[#544CDE] truncate"
                          >
                            {std.name}
                          </h3>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {std.studentCode}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {std.status === 'STUDYING' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Đang học
                          </span>
                        )}
                        {std.status === 'GRADUATED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0 flex items-center gap-0.5">
                            <Award className="w-3 h-3" />
                            Tốt nghiệp
                          </span>
                        )}
                        {std.status === 'RESERVED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                            Bảo lưu
                          </span>
                        )}
                        {std.status === 'DROPOUT' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                            Nghỉ học
                          </span>
                        )}
                      </div>

                      <div className="text-[12px] text-slate-600 font-medium mt-0.5 truncate">
                        Lớp: <span className="font-bold text-[#544CDE]">{std.classCode}</span> · {std.courseName}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>GV: {std.instructorName}</span>
                        {std.hometown && (
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <MapPin className="w-2.5 h-2.5" />
                            {std.hometown}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress học phí & Điểm chuyên cần */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Học phí: <strong className="text-slate-800">{std.paidAmount.toLocaleString('vi-VN')} đ</strong> / {std.tuitionFee.toLocaleString('vi-VN')} đ
                      </span>
                      {std.paymentStatus === 'PAID' ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Đã đóng đủ
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold">
                          Thiếu {remaining.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          std.paymentStatus === 'PAID'
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-amber-400 to-rose-400'
                        }`}
                        style={{ width: `${payPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Nhập học: {std.enrollmentDate}</span>
                      <div className="flex items-center gap-2">
                        {std.attendanceRate && (
                          <span>Chuyên cần: <strong className="text-slate-700">{std.attendanceRate}%</strong></span>
                        )}
                        {std.skillLevel && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-[#544CDE] font-bold">
                            {std.skillLevel === 'XUAT_SAC' ? 'Xuất sắc' : std.skillLevel === 'GIOI' ? 'Giỏi' : 'Khá'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thao tác nút bấm */}
                  <div className="flex items-center justify-between pt-1 gap-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${std.phone}`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors"
                        title="Gọi điện"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://zalo.me/${std.zaloPhone || std.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center gap-1 hover:bg-blue-100 transition-colors"
                        title="Nhắn Zalo"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Zalo</span>
                      </a>
                      <button
                        onClick={() => handleOpenEdit(std)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-[#544CDE] transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveStudent(std)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-[#544CDE] text-xs font-bold hover:bg-[#544CDE] hover:text-white transition-all active:scale-95"
                    >
                      <span>Xem hồ sơ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================
          MODAL 1: CHI TIẾT HỒ SƠ HỌC VIÊN
      ======================================================== */}
      {activeStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 pb-6">
            {/* Modal Header Cover */}
            <div className="relative bg-gradient-to-r from-[#1E1B4B] to-[#4338CA] p-5 text-white rounded-t-3xl">
              <button
                onClick={() => setActiveStudent(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 pt-2">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-18 h-18 w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black">{activeStudent.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 font-bold">
                      {activeStudent.studentCode}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Lớp: {activeStudent.classCode} · {activeStudent.courseName}
                  </p>
                  <p className="text-[11px] text-amber-300 mt-0.5">
                    GV: {activeStudent.instructorName}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 space-y-4">
              {/* Hành động liên hệ */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${activeStudent.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/80 hover:bg-emerald-100 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi: {activeStudent.phone}</span>
                </a>
                <a
                  href={`https://zalo.me/${activeStudent.zaloPhone || activeStudent.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200/80 hover:bg-blue-100 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Nhắn Zalo</span>
                </a>
              </div>

              {/* Thông tin học tập & Chuyên cần */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Thông tin học tập & Tay nghề
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trạng thái:</span>
                    <strong className="text-slate-800">
                      {activeStudent.status === 'STUDYING' && '🟢 Đang theo học'}
                      {activeStudent.status === 'GRADUATED' && '🎓 Đã tốt nghiệp'}
                      {activeStudent.status === 'RESERVED' && '⏸️ Đang bảo lưu'}
                      {activeStudent.status === 'DROPOUT' && '❌ Nghỉ học'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Đánh giá tay nghề:</span>
                    <strong className="text-[#544CDE]">
                      {activeStudent.skillLevel === 'XUAT_SAC' && '🌟 Xuất sắc'}
                      {activeStudent.skillLevel === 'GIOI' && '⭐ Giỏi'}
                      {activeStudent.skillLevel === 'KHA' && '👍 Khá'}
                      {activeStudent.skillLevel === 'TRUNG_BINH' && 'Cần luyện thêm'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày nhập học:</span>
                    <strong className="text-slate-800">{activeStudent.enrollmentDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày tốt nghiệp:</span>
                    <strong className="text-slate-800">{activeStudent.graduationDate || 'Chưa tốt nghiệp'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tỉ lệ chuyên cần:</span>
                    <strong className="text-emerald-600">{activeStudent.attendanceRate || 100}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Chứng chỉ Academy:</span>
                    <strong className={activeStudent.certStatus === 'CERTIFIED' ? 'text-amber-600' : 'text-slate-500'}>
                      {activeStudent.certStatus === 'CERTIFIED' ? '📜 Đã cấp bằng' : '⏳ Chưa cấp'}
                    </strong>
                  </div>
                </div>

                {/* Nút thao tác tốt nghiệp nhanh */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleToggleGraduate(activeStudent)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-indigo-200 bg-white hover:bg-indigo-50 text-[#544CDE] transition-all"
                  >
                    {activeStudent.status === 'GRADUATED' ? 'Chuyển về Đang học' : '🎓 Xác nhận Tốt nghiệp & Cấp bằng'}
                  </button>
                </div>
              </div>

              {/* Tình trạng Học phí */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Tình trạng Học phí
                  </h4>
                  {activeStudent.paymentStatus === 'PAID' ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Đã hoàn tất 100%
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Còn nợ {(activeStudent.tuitionFee - activeStudent.paidAmount).toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Tổng học phí khóa học</span>
                    <span className="text-sm font-black text-slate-800">
                      {activeStudent.tuitionFee.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Đã nộp học phí</span>
                    <span className="text-sm font-black text-emerald-600">
                      {activeStudent.paidAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {activeStudent.paymentStatus !== 'PAID' && (
                  <button
                    onClick={() => handleQuickPayFull(activeStudent)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-95 transition-all"
                  >
                    ✓ Thu nốt {(activeStudent.tuitionFee - activeStudent.paidAmount).toLocaleString('vi-VN')} đ (Đủ 100%)
                  </button>
                )}
              </div>

              {/* Nhận xét của giảng viên */}
              {activeStudent.notes && (
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Nhận xét & Đánh giá của Giảng viên
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{activeStudent.notes}"
                  </p>
                </div>
              )}

              {/* Tác phẩm thực hành / Portfolio của học viên */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Bài thực hành & Tác phẩm ({activeStudent.portfolioImages?.length || 0})
                  </h4>
                  <span className="text-[10px] text-slate-400">Bấm ảnh để phóng to</span>
                </div>

                {activeStudent.portfolioImages && activeStudent.portfolioImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {activeStudent.portfolioImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setZoomedImage(img)}
                        className="aspect-square rounded-xl overflow-hidden border border-slate-200 relative group cursor-pointer"
                      >
                        <img
                          src={img}
                          alt="Tác phẩm học viên"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-400 border border-slate-100">
                    Chưa cập nhật ảnh bài thực hành của học viên này.
                  </div>
                )}
              </div>

              {/* Nút sửa / xóa */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleDelete(activeStudent.id, activeStudent.name)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa hồ sơ</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenEdit(activeStudent);
                  }}
                  className="px-4 py-2 bg-[#544CDE] text-white rounded-xl text-xs font-bold shadow hover:bg-[#4338CA] transition-all flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Chỉnh sửa thông tin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: THÊM MỚI HỌC VIÊN
      ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Thêm Hồ Sơ Học Viên Mới</h3>
                <p className="text-xs text-slate-500">Học viện Đào tạo CELLA Makeup Academy</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar upload */}
            <div className="flex items-center gap-3">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-[#544CDE] text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Chọn ảnh từ máy</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã học viên</label>
                <input
                  type="text"
                  value={formData.studentCode || ''}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
                  placeholder="HV-2025-06"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                  placeholder="Nguyễn Thị Lan"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value, zaloPhone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  placeholder="0988 123 456"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quê quán / Địa chỉ</label>
                <input
                  type="text"
                  value={formData.hometown || ''}
                  onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  placeholder="TP. Thái Bình"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Khóa học đăng ký</label>
                <select
                  value={formData.courseName || ''}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Khóa Makeup Chuyên Nghiệp Toàn Diện PRO">Khóa Makeup Chuyên Nghiệp Toàn Diện PRO (25.000.000đ)</option>
                  <option value="Khóa Makeup Cô Dâu Master Bridal">Khóa Makeup Cô Dâu Master Bridal (18.000.000đ)</option>
                  <option value="Khóa Nghệ Thuật & Thời Trang Editorial">Khóa Nghệ Thuật & Thời Trang Editorial (22.000.000đ)</option>
                  <option value="Khóa Makeup Cá Nhân Tự Tin">Khóa Makeup Cá Nhân Tự Tin (5.500.000đ)</option>
                  <option value="Khóa Nâng Cao Kỹ Thuật Nền & Trend Thái">Khóa Nâng Cao Kỹ Thuật Nền & Trend Thái (12.000.000đ)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã lớp học</label>
                <input
                  type="text"
                  value={formData.classCode || ''}
                  onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  placeholder="K29-PRO"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giảng viên phụ trách</label>
                <select
                  value={formData.instructorName || ''}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Master Cella Hương Phượng">Master Cella Hương Phượng</option>
                  <option value="Trần Thị Lan Anh">Trần Thị Lan Anh</option>
                  <option value="Nguyễn Thu Trang">Nguyễn Thu Trang</option>
                  <option value="Hoàng Minh Anh">Hoàng Minh Anh</option>
                  <option value="Lê Mai Phương">Lê Mai Phương</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tổng học phí (VNĐ)</label>
                <input
                  type="number"
                  value={formData.tuitionFee || 0}
                  onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đã đóng ban đầu (VNĐ)</label>
                <input
                  type="number"
                  value={formData.paidAmount || 0}
                  onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái học tập</label>
                <select
                  value={formData.status || 'STUDYING'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="STUDYING">Đang theo học</option>
                  <option value="GRADUATED">Đã tốt nghiệp</option>
                  <option value="RESERVED">Bảo lưu</option>
                  <option value="DROPOUT">Nghỉ học</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đánh giá tay nghề</label>
                <select
                  value={formData.skillLevel || 'GIOI'}
                  onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="XUAT_SAC">Xuất sắc</option>
                  <option value="GIOI">Giỏi</option>
                  <option value="KHA">Khá</option>
                  <option value="TRUNG_BINH">Trung bình</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Ghi chú & Nhận xét ban đầu</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200"
                  placeholder="Ghi chú về học lực, nguyện vọng mở tiệm hoặc đi làm studio..."
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="flex-1 py-2.5 rounded-xl bg-[#544CDE] text-white text-xs font-bold hover:bg-[#4338CA] shadow-md transition-all"
              >
                Lưu học viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CHỈNH SỬA HỒ SƠ HỌC VIÊN
      ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Chỉnh Sửa Hồ Sơ Học Viên</h3>
                <p className="text-xs text-slate-500">{formData.name} · {formData.studentCode}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-3">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-[#544CDE] text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Đổi ảnh đại diện</span>
                </button>
              </div>
            </div>

            {/* Form edit fields */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã học viên</label>
                <input
                  type="text"
                  value={formData.studentCode || ''}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số Zalo</label>
                <input
                  type="tel"
                  value={formData.zaloPhone || ''}
                  onChange={(e) => setFormData({ ...formData, zaloPhone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quê quán</label>
                <input
                  type="text"
                  value={formData.hometown || ''}
                  onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã lớp</label>
                <input
                  type="text"
                  value={formData.classCode || ''}
                  onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Khóa học</label>
                <input
                  type="text"
                  value={formData.courseName || ''}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tổng học phí (VNĐ)</label>
                <input
                  type="number"
                  value={formData.tuitionFee || 0}
                  onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đã đóng (VNĐ)</label>
                <input
                  type="number"
                  value={formData.paidAmount || 0}
                  onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status || 'STUDYING'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="STUDYING">Đang theo học</option>
                  <option value="GRADUATED">Đã tốt nghiệp</option>
                  <option value="RESERVED">Bảo lưu</option>
                  <option value="DROPOUT">Nghỉ học</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đánh giá tay nghề</label>
                <select
                  value={formData.skillLevel || 'GIOI'}
                  onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="XUAT_SAC">Xuất sắc</option>
                  <option value="GIOI">Giỏi</option>
                  <option value="KHA">Khá</option>
                  <option value="TRUNG_BINH">Trung bình</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chuyên cần (%)</label>
                <input
                  type="number"
                  value={formData.attendanceRate || 100}
                  onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cấp chứng chỉ</label>
                <select
                  value={formData.certStatus || 'PENDING'}
                  onChange={(e) => setFormData({ ...formData, certStatus: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="CERTIFIED">Đã cấp chứng chỉ</option>
                  <option value="PENDING">Chờ thi tốt nghiệp</option>
                  <option value="NONE">Chưa đủ điều kiện</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Đánh giá của Giảng viên</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-2.5 rounded-xl bg-[#544CDE] text-white text-xs font-bold hover:bg-[#4338CA] shadow-md transition-all"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: PHÓNG TO HÌNH ẢNH PORTFOLIO
      ======================================================== */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomedImage}
            alt="Tác phẩm phóng to"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
