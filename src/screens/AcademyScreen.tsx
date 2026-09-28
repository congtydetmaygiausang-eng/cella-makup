import React, { useState, useEffect, useRef } from 'react';
import { Course, ScreenId, Student } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import {
  GraduationCap,
  Users,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  Play,
  PlayCircle,
  Plus,
  Edit3,
  CreditCard,
  DollarSign,
  QrCode,
  Copy,
  Check,
  Video,
  Award,
  ShieldCheck,
  Phone,
  MessageCircle,
  AlertCircle,
  Trash2,
  Maximize2,
  FileText,
  Gift
} from 'lucide-react';
import { canCreate, canEdit, canDelete } from '../utils/permissions';
import { Staff } from '../types';

interface AcademyScreenProps {
  courses?: Course[];
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  currentUser?: Staff;
}

const COURSES_STORAGE_KEY = 'cella_academy_courses_v2';
const STUDENTS_STORAGE_KEY = 'cella_students_v2';

const INITIAL_CELLA_COURSES: Course[] = [
  {
    id: 'crs-1',
    title: 'Khóa Makeup Chuyên Nghiệp Toàn Diện PRO',
    category: 'Chuyên nghiệp',
    code: 'K28-PRO',
    instructor: 'Master Cella Hương Phượng',
    instructorTitle: 'Nhà sáng lập · Bàn Tay Vàng Châu Á 2025',
    instructorAvatar: 'https://cellamakeup.vn/blog/images/founder.jpg',
    totalLessons: 45,
    highlights: [
      'Được Master Cella Hương Phượng trực tiếp cầm tay chỉ ngón 1-1',
      'Thực hành 85% trên mẫu thật mỗi ngày tại Studio',
      'Tặng cốp đồ nghề & bộ cọ chuyên nghiệp trị giá 3.500.000đ',
      'Bảo hành tay nghề trọn đời - Tốt nghiệp có việc làm ngay',
    ],
    startDate: '15/04/2025',
    schedule: 'Thứ 2 đến Thứ 6 hàng tuần (08:30 - 17:00)',
    registeredCount: 12,
    maxStudents: 15,
    price: 25000000,
    originalPrice: 32000000,
    depositAmount: 5000000,
    isHot: true,
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoTitle: 'Kỹ thuật Tạo khối & Xử lý Nền Glass-Skin HD chuẩn Salon',
    videoDuration: '04:15',
    description: 'Chương trình đào tạo nghệ sĩ trang điểm từ con số 0 đến làm chủ Studio, bao gồm makeup cô dâu, thời trang, event và kỹ năng xây dựng thương hiệu cá nhân.',
    syllabus: [
      { lesson: 1, title: 'Tổng quan dụng cụ, vệ sinh cọ & nhận diện cấu trúc gương mặt', duration: '1 buổi' },
      { lesson: 2, title: 'Kỹ thuật dưỡng da chuẩn bị & xử lý nền mỏng mịn glass-skin', duration: '3 buổi' },
      { lesson: 3, title: 'Nghệ thuật tạo khối sáng tối (Contouring & Highlighting) 3D', duration: '4 buổi' },
      { lesson: 4, title: 'Kỹ thuật kẻ chân mày phẩy sợi tự nhiên & tán phấn mắt ombre', duration: '5 buổi' },
      { lesson: 5, title: 'Kỹ thuật gắn mi từng sợi & tạo mí mắt hai mí tự nhiên', duration: '4 buổi' },
      { lesson: 6, title: 'Makeup Cô Dâu phong cách Hàn Quốc trong veo & sang trọng', duration: '6 buổi' },
      { lesson: 7, title: 'Makeup Cô Dâu Tone Tây quyến rũ & Tone Thái Lan thời thượng', duration: '8 buổi' },
      { lesson: 8, title: 'Tạo mẫu tóc cô dâu (Bới tóc, uốn sóng nước, cài hoa, phụ kiện)', duration: '6 buổi' },
      { lesson: 9, title: 'Thi tốt nghiệp, chụp ảnh Lookbook Portfolio & Trao chứng chỉ', duration: '4 buổi' },
    ],
  },
  {
    id: 'crs-2',
    title: 'Khóa Makeup Cô Dâu Master Bridal',
    category: 'Cô dâu',
    code: 'K16-BRIDAL',
    instructor: 'Trần Thị Lan Anh',
    instructorTitle: 'Á quân Cây Cọ Vàng 2023 · 6 năm kinh nghiệm',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    totalLessons: 30,
    highlights: [
      'Chuyên sâu toàn bộ các phong cách cô dâu hot nhất mùa cưới 2025',
      'Xử lý triệt để làn da dầu mụn, thâm nám, lỗ chân lông to',
      'Kỹ thuật đánh nền bền 24h không trôi dính khẩu trang hay mồ hôi',
      'Tặng khóa bới tóc cô dâu căn bản',
    ],
    startDate: '20/04/2025',
    schedule: 'Thứ 3, 5, 7 (09:00 - 16:30)',
    registeredCount: 8,
    maxStudents: 10,
    price: 18000000,
    originalPrice: 24000000,
    depositAmount: 3000000,
    isHot: true,
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoTitle: 'Quy trình Trang điểm Cô dâu Ngày Cưới Thực tế tại Studio',
    videoDuration: '05:40',
    description: 'Dành cho các bạn muốn tập trung chuyên sâu vào phân khúc trang điểm cô dâu cưới hỏi, lễ gia tiên, tiệc tối với thu nhập cao.',
    syllabus: [
      { lesson: 1, title: 'Makeup Cô Dâu lễ Gia tiên truyền thống áo dài', duration: '3 buổi' },
      { lesson: 2, title: 'Makeup Cô Dâu tiệc tối Glamour lộng lẫy dưới ánh đèn sân khấu', duration: '5 buổi' },
      { lesson: 3, title: 'Makeup Cô Dâu chụp ảnh Pre-Wedding ngoài trời bền màu', duration: '4 buổi' },
      { lesson: 4, title: 'Kỹ thuật che khuyết điểm da nám mụn cấp độ nặng', duration: '4 buổi' },
      { lesson: 5, title: 'Bài thi tốt nghiệp trên mẫu cô dâu thật kèm váy cưới', duration: '4 buổi' },
    ],
  },
  {
    id: 'crs-3',
    title: 'Khóa Nghệ Thuật & Thời Trang Editorial',
    category: 'Nghệ thuật',
    code: 'K09-EDITORIAL',
    instructor: 'Nguyễn Thu Trang',
    instructorTitle: 'Giảng viên High Fashion · Vietnam International Fashion Week',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    totalLessons: 35,
    highlights: [
      'Kỹ thuật Cut Crease, đính đá hạt cườm và eyeliner đồ họa',
      'Định hình phong cách cho người mẫu chụp tạp chí, sàn diễn thời trang',
      'Hiểu sâu về ánh sáng studio và lens máy ảnh đối với lớp trang điểm',
    ],
    startDate: '05/05/2025',
    schedule: 'Thứ 2, 4, 6 (13:30 - 17:30)',
    registeredCount: 6,
    maxStudents: 8,
    price: 22000000,
    originalPrice: 28000000,
    depositAmount: 4000000,
    isHot: false,
    coverImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoTitle: 'Kỹ thuật Cut Crease Ánh Bạc & Phối Màu Sắc High-Fashion',
    videoDuration: '03:50',
    description: 'Đột phá tư duy sáng tạo nghệ thuật dành cho những artist muốn bước chân vào ngành thời trang, MV ca nhạc và tạp chí quốc tế.',
    syllabus: [
      { lesson: 1, title: 'Lý thuyết màu sắc nâng cao và phối sắc tương phản', duration: '2 buổi' },
      { lesson: 2, title: 'Kỹ thuật Cut Crease mí mắt sắc nét phong cách Châu Âu', duration: '5 buổi' },
      { lesson: 3, title: 'Trang điểm Graphic Liner và đính phụ kiện đá pha lê', duration: '4 buổi' },
      { lesson: 4, title: 'Makeup Beauty Shoot chuẩn ảnh bìa tạp chí', duration: '6 buổi' },
    ],
  },
  {
    id: 'crs-4',
    title: 'Khóa Makeup Cá Nhân Tự Tin',
    category: 'Cá nhân',
    code: 'K43-BASIC',
    instructor: 'Hoàng Minh Anh',
    instructorTitle: 'Top 10 Makeup Artist Miền Bắc · Chuyên gia Makeup Cá nhân',
    instructorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    totalLessons: 10,
    highlights: [
      'Tự trang điểm đẹp chỉ trong 15 phút trước khi đi làm hay đi tiệc',
      'Tư vấn mỹ phẩm phù hợp với làn da và túi tiền riêng',
      'Được tài trợ 100% mỹ phẩm trong suốt quá trình học',
    ],
    startDate: '10/04/2025',
    schedule: 'Thứ 7 & Chủ Nhật (09:00 - 11:30 hoặc 14:00 - 16:30)',
    registeredCount: 7,
    maxStudents: 8,
    price: 5500000,
    originalPrice: 7500000,
    depositAmount: 1000000,
    isHot: true,
    coverImage: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    videoTitle: 'Bí quyết Kẻ Chân Mày Phẩy Sợi & Đánh Son Ombre Tự Nhiên',
    videoDuration: '02:30',
    description: 'Khóa học được thiết kế riêng cho chị em văn phòng, nữ doanh nhân muốn làm chủ diện mạo mỗi ngày.',
    syllabus: [
      { lesson: 1, title: 'Quy trình Skincare buổi sáng và chọn kem nền hợp tone da', duration: '1 buổi' },
      { lesson: 2, title: 'Định hình cung chân mày phong thủy hợp tỷ lệ khuôn mặt', duration: '2 buổi' },
      { lesson: 3, title: 'Trang điểm mắt công sở nhẹ nhàng, tự nhiên', duration: '2 buổi' },
      { lesson: 4, title: 'Biến hóa phong cách từ công sở sang dự tiệc tối quyến rũ', duration: '2 buổi' },
    ],
  },
  {
    id: 'crs-5',
    title: 'Khóa Nâng Cao Kỹ Thuật Nền & Trend Thái',
    category: 'Nâng cao',
    code: 'K12-ADVANCED',
    instructor: 'Master Cella Hương Phượng',
    instructorTitle: 'Nhà sáng lập · Master Trainer CELLA',
    instructorAvatar: 'https://cellamakeup.vn/blog/images/founder.jpg',
    totalLessons: 15,
    highlights: [
      'Cập nhật bí quyết tone makeup Thái Lan đang gây bão',
      'Lông mi búp bê, tạo sống mũi cao tây tự nhiên',
      'Cấp tốc dành cho thợ makeup nâng cao tay nghề',
    ],
    startDate: '02/05/2025',
    schedule: 'Thứ 2 đến Thứ 4 (09:00 - 16:00)',
    registeredCount: 5,
    maxStudents: 6,
    price: 12000000,
    originalPrice: 15000000,
    depositAmount: 2000000,
    isHot: false,
    coverImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoTitle: 'Workshop: Tone Makeup Thái Glamour với Đôi Mắt Hút Hồn',
    videoDuration: '04:50',
    description: 'Khóa nâng cao ngắn hạn dành cho thợ makeup đã có nền tảng cơ bản muốn cập nhật phong cách makeup hot trend.',
    syllabus: [
      { lesson: 1, title: 'Bí kíp nền lì kiềm dầu chống mồ hôi 24h thời tiết mùa hè', duration: '2 buổi' },
      { lesson: 2, title: 'Tạo khối mũi gãy, mũi tẹt thành mũi bay kiểu Thái', duration: '3 buổi' },
      { lesson: 3, title: 'Kỹ thuật gắn mi cụm và kẻ bọng mắt baby dolly', duration: '4 buổi' },
    ],
  },
];

export const AcademyScreen: React.FC<AcademyScreenProps> = ({
  courses: propCourses,
  onNavigate,
  onBack,
  currentUser,
}) => {
  const allowCreateCourse = canCreate(currentUser?.role, 'courses');
  const allowEditCourse = canEdit(currentUser?.role, 'courses');
  const allowDeleteCourse = canDelete(currentUser?.role, 'courses');
  // Load courses from localStorage with fallback
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(COURSES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading courses:', e);
    }
    return INITIAL_CELLA_COURSES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals
  const [activeCourseDetail, setActiveCourseDetail] = useState<Course | null>(null);
  const [videoModalCourse, setVideoModalCourse] = useState<Course | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form add/edit course
  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({});

  // Checkout form state
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    phone: '',
    zalo: '',
    email: '',
    notes: '',
    payOption: 'FULL' as 'FULL' | 'DEPOSIT', // FULL (100%) or DEPOSIT (Cọc)
    payMethod: 'VIETQR' as 'VIETQR' | 'MOMO' | 'CASH',
  });

  // Receipt modal state
  const [receipt, setReceipt] = useState<{
    receiptCode: string;
    course: Course;
    customerName: string;
    phone: string;
    amountPaid: number;
    totalPrice: number;
    payType: 'FULL' | 'DEPOSIT';
    payMethod: string;
    timestamp: string;
  } | null>(null);

  // Copied bank info toast
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Save courses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error('Error saving courses:', e);
    }
  }, [courses]);

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);

    let matchCategory = true;
    if (categoryFilter !== 'ALL') {
      matchCategory = c.category === categoryFilter;
    }

    return matchSearch && matchCategory;
  });

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Add Course Handler
  const handleOpenAddCourse = () => {
    setCourseFormData({
      code: `K${courses.length + 1}-PRO`,
      title: '',
      category: 'Chuyên nghiệp',
      instructor: 'Master Cella Hương Phượng',
      instructorTitle: 'Nhà sáng lập · Master Trainer CELLA',
      instructorAvatar: 'https://cellamakeup.vn/blog/images/founder.jpg',
      price: 20000000,
      originalPrice: 26000000,
      depositAmount: 4000000,
      totalLessons: 30,
      startDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString('vi-VN'),
      schedule: 'Thứ 2 đến Thứ 6 (08:30 - 17:00)',
      registeredCount: 0,
      maxStudents: 12,
      isHot: true,
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoTitle: 'Video Giới thiệu Lộ trình Đào tạo Khóa học',
      videoDuration: '03:30',
      description: 'Khóa học đào tạo thực chiến tại Học viện CELLA Makeup Academy.',
      highlights: [
        'Cầm tay chỉ việc 1-1 với giảng viên',
        'Tặng bộ cọ & cốp trang điểm chuyên nghiệp',
        'Thực hành 80% trên mẫu thật mỗi ngày',
        'Bảo hành tay nghề trọn đời - Tốt nghiệp có việc làm',
      ],
      syllabus: [
        { lesson: 1, title: 'Kỹ thuật Skincare & Chuẩn bị nền da sạch sâu', duration: '1 buổi' },
        { lesson: 2, title: 'Kỹ thuật tạo khối Contour & Highlight 3D', duration: '3 buổi' },
        { lesson: 3, title: 'Kỹ thuật kẻ chân mày phẩy sợi & vẽ mắt', duration: '4 buổi' },
        { lesson: 4, title: 'Thực hành makeup hoàn chỉnh trên mẫu', duration: '5 buổi' },
      ],
    });
    setIsAddCourseModalOpen(true);
  };

  const handleSaveAddCourse = () => {
    if (!courseFormData.title?.trim()) {
      alert('Vui lòng nhập tên khóa học!');
      return;
    }
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      title: courseFormData.title.trim(),
      category: courseFormData.category || 'Chuyên nghiệp',
      code: courseFormData.code || `K${courses.length + 1}-PRO`,
      instructor: courseFormData.instructor || 'Master Cella Hương Phượng',
      instructorTitle: courseFormData.instructorTitle || 'Giảng viên CELLA Academy',
      instructorAvatar:
        courseFormData.instructorAvatar ||
        'https://cellamakeup.vn/blog/images/founder.jpg',
      totalLessons: Number(courseFormData.totalLessons) || 20,
      highlights: courseFormData.highlights || ['Cầm tay chỉ việc 1-1', 'Thực hành trên mẫu thật'],
      startDate: courseFormData.startDate || '15/05/2025',
      schedule: courseFormData.schedule || 'Thứ 2 - 4 - 6',
      registeredCount: 0,
      maxStudents: Number(courseFormData.maxStudents) || 12,
      price: Number(courseFormData.price) || 10000000,
      originalPrice: Number(courseFormData.originalPrice) || Number(courseFormData.price) * 1.3,
      depositAmount: Number(courseFormData.depositAmount) || 2000000,
      isHot: Boolean(courseFormData.isHot),
      coverImage: courseFormData.coverImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      videoUrl: courseFormData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoTitle: courseFormData.videoTitle || 'Video Demo Khóa học',
      videoDuration: courseFormData.videoDuration || '03:30',
      description: courseFormData.description || '',
      syllabus: courseFormData.syllabus || [],
    };

    setCourses([newCourse, ...courses]);
    setIsAddCourseModalOpen(false);
  };

  // Edit Course Price Handler
  const handleOpenEditPrice = (course: Course) => {
    setCourseFormData({ ...course });
    setIsEditPriceModalOpen(true);
  };

  const handleSaveEditPrice = () => {
    if (!courseFormData.id) return;
    setCourses(
      courses.map((c) =>
        c.id === courseFormData.id
          ? ({
              ...c,
              price: Number(courseFormData.price) || c.price,
              originalPrice: Number(courseFormData.originalPrice) || c.originalPrice,
              depositAmount: Number(courseFormData.depositAmount) || c.depositAmount,
              isHot: courseFormData.isHot,
              title: courseFormData.title || c.title,
              instructor: courseFormData.instructor || c.instructor,
              videoUrl: courseFormData.videoUrl || c.videoUrl,
              videoTitle: courseFormData.videoTitle || c.videoTitle,
            } as Course)
          : c
      )
    );
    setIsEditPriceModalOpen(false);
  };

  // Delete Course
  const handleDeleteCourse = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"?`)) {
      setCourses(courses.filter((c) => c.id !== id));
      if (activeCourseDetail?.id === id) setActiveCourseDetail(null);
    }
  };

  // Open Checkout / Buy Modal
  const handleOpenCheckout = (course: Course) => {
    setCheckoutCourse(course);
    setCheckoutData({
      fullName: '',
      phone: '',
      zalo: '',
      email: '',
      notes: '',
      payOption: 'FULL',
      payMethod: 'VIETQR',
    });
  };

  // Confirm Payment & Generate Receipt
  const handleConfirmPayment = () => {
    if (!checkoutCourse) return;
    if (!checkoutData.fullName.trim() || !checkoutData.phone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại học viên để đăng ký!');
      return;
    }

    const amountToPay =
      checkoutData.payOption === 'FULL'
        ? checkoutCourse.price
        : (checkoutCourse.depositAmount || 3000000);

    const receiptCode = `BL-CELLA-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toLocaleString('vi-VN');

    // Update course registered count
    const updatedCourses = courses.map((c) =>
      c.id === checkoutCourse.id
        ? { ...c, registeredCount: Math.min(c.maxStudents, c.registeredCount + 1) }
        : c
    );
    setCourses(updatedCourses);

    // Save as student in students list (localStorage)
    try {
      const existingStudentsStr = localStorage.getItem(STUDENTS_STORAGE_KEY);
      const existingStudents: Student[] = existingStudentsStr ? JSON.parse(existingStudentsStr) : [];
      const newStudent: Student = {
        id: `std_${Date.now()}`,
        studentCode: `HV-2025-${String(existingStudents.length + 1).padStart(2, '0')}`,
        name: checkoutData.fullName.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        phone: checkoutData.phone.trim(),
        zaloPhone: checkoutData.zalo.trim() || checkoutData.phone.trim(),
        email: checkoutData.email.trim(),
        courseName: checkoutCourse.title,
        classCode: checkoutCourse.code,
        instructorName: checkoutCourse.instructor,
        enrollmentDate: checkoutCourse.startDate,
        status: 'STUDYING',
        tuitionFee: checkoutCourse.price,
        paidAmount: amountToPay,
        paymentStatus: amountToPay >= checkoutCourse.price ? 'PAID' : 'PARTIAL',
        attendanceRate: 100,
        skillLevel: 'GIOI',
        certStatus: 'PENDING',
        notes: `Đăng ký khóa học qua cổng trực tuyến (${checkoutData.payOption === 'FULL' ? 'Đã đóng 100%' : 'Đã cọc giữ chỗ'}). Ghi chú: ${checkoutData.notes}`,
        portfolioImages: [],
      };
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify([newStudent, ...existingStudents]));
    } catch (e) {
      console.error('Error saving new student:', e);
    }

    // Set receipt and close checkout
    setReceipt({
      receiptCode,
      course: checkoutCourse,
      customerName: checkoutData.fullName.trim(),
      phone: checkoutData.phone.trim(),
      amountPaid: amountToPay,
      totalPrice: checkoutCourse.price,
      payType: checkoutData.payOption,
      payMethod:
        checkoutData.payMethod === 'VIETQR'
          ? 'Chuyển khoản Ngân hàng (VietQR)'
          : checkoutData.payMethod === 'MOMO'
          ? 'Ví điện tử MoMo'
          : 'Thanh toán trực tiếp tại Studio',
      timestamp,
    });

    setCheckoutCourse(null);
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900 relative">
      <MobileHeader
        title="Danh sách Khóa học"
        subtitle="Học viện Thẩm mỹ CELLA Academy"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          allowCreateCourse ? (
            <button
              onClick={handleOpenAddCourse}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#5850EC] to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-200 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm khóa học</span>
            </button>
          ) : undefined
        }
      />

      <div className="px-4 pt-1 space-y-3.5">
        {/* === GIỚI THIỆU CELLA MAKEUP ACADEMY HERO BANNER === */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#1E1B4B] to-[#16161A] text-white p-5 space-y-3 relative shadow-xl">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 80% 20%, #C9A24B 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Học viện Makeup · Thái Bình
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-medium">
                Founder: Master Cella
              </span>
            </div>

            <h2 className="text-xl font-black mt-1 leading-tight">
              CELLA MAKEUP <span className="text-amber-400">ACADEMY</span>
            </h2>
            <p className="text-[12px] text-slate-300 mt-1 italic">
              "Makeup your mind, makeup your life"
            </p>
            <p className="text-[12px] text-slate-400 mt-1.5 leading-relaxed">
              Đào tạo nghề trang điểm chuyên nghiệp, cô dâu, editorial và cá nhân. Học nghề vững vàng – Tự tin làm chủ thu nhập.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
              <div>
                <div className="text-sm font-black text-amber-400">5,0 ★</div>
                <div className="text-[9px] text-slate-400">32 đánh giá Google</div>
              </div>
              <div>
                <div className="text-sm font-black text-amber-400">70K+</div>
                <div className="text-[9px] text-slate-400">Follower Facebook</div>
              </div>
              <div>
                <div className="text-sm font-black text-amber-400">2025</div>
                <div className="text-[9px] text-slate-400">Bàn Tay Vàng Châu Á</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút Xem Giảng viên & Học viên CELLA */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => onNavigate('instructors')}
            className="bg-white rounded-2xl p-3 border border-indigo-100 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#544CDE] to-[#7B73F0] flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[12px] font-bold text-slate-800 block truncate group-hover:text-[#544CDE]">
                  Đội ngũ Giảng viên
                </span>
                <span className="text-[10px] text-slate-500 block truncate">5+ Master & Faculty</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('students')}
            className="bg-white rounded-2xl p-3 border border-rose-100 shadow-sm cursor-pointer hover:border-rose-300 hover:shadow-md transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[12px] font-bold text-slate-800 block truncate group-hover:text-rose-600">
                  Hồ sơ Học viên
                </span>
                <span className="text-[10px] text-slate-500 block truncate">Quản lý các khóa học</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar & Category filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, giảng viên, mã lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 shadow-sm"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'ALL', label: 'Tất cả khóa học' },
              { id: 'Chuyên nghiệp', label: 'Chuyên nghiệp PRO' },
              { id: 'Cô dâu', label: 'Cô dâu Master' },
              { id: 'Nghệ thuật', label: 'High-Fashion' },
              { id: 'Cá nhân', label: 'Cá nhân' },
              { id: 'Nâng cao', label: 'Nâng cao' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === tab.id
                    ? 'bg-[#5850EC] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* === DANH SÁCH KHÓA HỌC CARDS === */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const progressPercent = Math.round(
              (course.registeredCount / course.maxStudents) * 100
            );

            return (
              <GlassCard
                key={course.id}
                className="overflow-hidden bg-white border border-slate-100 space-y-0 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                {/* Image Cover & Video Preview Overlay */}
                <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={course.coverImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges top */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md uppercase tracking-wider">
                      {course.code}
                    </span>
                    {course.isHot && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-sm animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                  </div>

                  {/* Sửa giá nút nhỏ góc trên phải */}
                  {(allowEditCourse || allowDeleteCourse) && (
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {allowEditCourse && (
                        <button
                          onClick={() => handleOpenEditPrice(course)}
                          className="p-1.5 rounded-full bg-black/60 text-white/90 hover:text-white backdrop-blur-md hover:bg-black/80 transition-all"
                          title="Sửa giá & thông tin"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {allowDeleteCourse && (
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-1.5 rounded-full bg-black/60 text-rose-300 hover:text-rose-100 backdrop-blur-md hover:bg-black/80 transition-all"
                          title="Xóa khóa học"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Nút Xem Video Demo ở giữa hoặc góc dưới */}
                  {course.videoUrl && (
                    <button
                      onClick={() => {
                        setVideoModalCourse(course);
                        setIsPlaying(true);
                      }}
                      className="absolute left-3 bottom-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold backdrop-blur-md shadow-lg active:scale-95 transition-all group"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#5850EC] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                      </div>
                      <span>Xem video demo</span>
                      {course.videoDuration && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({course.videoDuration})
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {/* Content body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#5850EC] uppercase tracking-wider">
                        {course.category} · {course.totalLessons} buổi học
                      </span>
                      <h3
                        onClick={() => setActiveCourseDetail(course)}
                        className="text-[15px] font-black text-slate-900 mt-0.5 leading-snug cursor-pointer hover:text-[#5850EC] transition-colors"
                      >
                        {course.title}
                      </h3>
                    </div>

                    {/* Giá khóa học */}
                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#5850EC] block">
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
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full object-cover border border-[#5850EC]/20 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://cellamakeup.vn/blog/images/founder.jpg';
                        }}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight text-xs">
                          {course.instructor}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {course.instructorTitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[11px]">
                      <span className="text-slate-400 block">Khai giảng</span>
                      <span className="font-bold text-slate-800">{course.startDate}</span>
                    </div>
                  </div>

                  {/* Progress bar slot enrollment */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>
                        Đã đăng ký: <strong>{course.registeredCount}/{course.maxStudents}</strong> học viên
                      </span>
                      <span className="text-[#5850EC] font-bold">
                        Còn {course.maxStudents - course.registeredCount} chỗ
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#5850EC] to-purple-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Cọc giữ chỗ & Nút hành động MUA KHÓA HỌC */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setActiveCourseDetail(course)}
                      className="py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Xem giáo trình</span>
                    </button>

                    <button
                      onClick={() => handleOpenCheckout(course)}
                      className="py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#5850EC] to-purple-600 hover:opacity-95 shadow-md shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Mua khóa học</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MODAL 1: XEM VIDEO KHÓA HỌC (DEMO / TRAILER)
      ======================================================== */}
      {videoModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 text-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl space-y-0">
            {/* Header video */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-black truncate max-w-xs">
                    {videoModalCourse.videoTitle || 'Video Demo Khóa học'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Khóa: {videoModalCourse.title} ({videoModalCourse.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVideoModalCourse(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={videoModalCourse.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={videoModalCourse.coverImage}
              >
                Trình duyệt của bạn không hỗ trợ phát video HTML5.
              </video>
            </div>

            {/* Video info & Actions */}
            <div className="p-4 space-y-3 bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-400 font-bold block">
                    Giảng viên: {videoModalCourse.instructor}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Thời lượng video: {videoModalCourse.videoDuration || '04:15'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Học phí ưu đãi:</span>
                  <span className="text-base font-black text-amber-400">
                    {videoModalCourse.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => setVideoModalCourse(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    const c = videoModalCourse;
                    setVideoModalCourse(null);
                    handleOpenCheckout(c);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#5850EC] to-purple-600 text-white text-xs font-bold shadow-lg hover:opacity-95 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Mua khóa học này ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: MUA & THANH TOÁN KHÓA HỌC (VIETQR / MOMO / CỌC)
      ======================================================== */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#5850EC] uppercase">
                  Đăng ký & Thanh toán khóa học
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {checkoutCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thông tin khóa học tóm tắt */}
            <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 rounded-2xl p-3.5 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Mã lớp & Lịch học:</span>
                <strong className="text-slate-900">{checkoutCourse.code} · {checkoutCourse.schedule}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Giảng viên đứng lớp:</span>
                <strong className="text-[#5850EC]">{checkoutCourse.instructor}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Ngày khai giảng:</span>
                <strong className="text-amber-600">{checkoutCourse.startDate}</strong>
              </div>
            </div>

            {/* Thông tin học viên */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Thông tin học viên đăng ký
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên học viên *</label>
                  <input
                    type="text"
                    required
                    value={checkoutData.fullName}
                    onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                    placeholder="Nguyễn Thị Thanh"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-[#5850EC]/30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={checkoutData.phone}
                    onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value, zalo: e.target.value })}
                    placeholder="0988 123 456"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-[#5850EC]/30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Zalo (nếu có)</label>
                  <input
                    type="tel"
                    value={checkoutData.zalo}
                    onChange={(e) => setCheckoutData({ ...checkoutData, zalo: e.target.value })}
                    placeholder="0988 123 456"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email nhận biên lai</label>
                  <input
                    type="email"
                    value={checkoutData.email}
                    onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                    placeholder="hocvien@gmail.com"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Ghi chú thêm</label>
                  <input
                    type="text"
                    value={checkoutData.notes}
                    onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                    placeholder="Ví dụ: Đăng ký ca tối hoặc xin xếp cùng lớp bạn..."
                    className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Chọn gói thanh toán */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Chọn hình thức đóng học phí
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setCheckoutData({ ...checkoutData, payOption: 'FULL' })}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    checkoutData.payOption === 'FULL'
                      ? 'border-[#5850EC] bg-indigo-50/50 ring-2 ring-[#5850EC]/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Đóng Đủ 100%</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Tặng cọ
                    </span>
                  </div>
                  <div className="text-sm font-black text-[#5850EC] mt-1">
                    {checkoutCourse.price.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Tặng cốp đồ & bộ cọ 3.5tr
                  </p>
                </div>

                <div
                  onClick={() => setCheckoutData({ ...checkoutData, payOption: 'DEPOSIT' })}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    checkoutData.payOption === 'DEPOSIT'
                      ? 'border-[#5850EC] bg-indigo-50/50 ring-2 ring-[#5850EC]/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Cọc Giữ Chỗ</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Giữ slot
                    </span>
                  </div>
                  <div className="text-sm font-black text-emerald-600 mt-1">
                    {(checkoutCourse.depositAmount || 3000000).toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Còn lại đóng vào ngày khai giảng
                  </p>
                </div>
              </div>
            </div>

            {/* Chọn phương thức thanh toán */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                3. Phương thức thanh toán
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'VIETQR', label: 'Quét VietQR', icon: QrCode },
                  { id: 'MOMO', label: 'Ví MoMo', icon: CreditCard },
                  { id: 'CASH', label: 'Tại Studio', icon: DollarSign },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setCheckoutData({ ...checkoutData, payMethod: m.id as any })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        checkoutData.payMethod === m.id
                          ? 'border-[#5850EC] bg-indigo-50/70 text-[#5850EC] font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[11px] block">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HIỂN THỊ MÃ VIETQR HOẶC THÔNG TIN NGÂN HÀNG */}
            {checkoutData.payMethod === 'VIETQR' && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Mã Chuyển Khoản Nhanh VietQR (24/7)
                  </span>
                  <div className="text-base font-black text-emerald-600">
                    Số tiền:{' '}
                    {(checkoutData.payOption === 'FULL'
                      ? checkoutCourse.price
                      : (checkoutCourse.depositAmount || 3000000)
                    ).toLocaleString('vi-VN')}{' '}
                    đ
                  </div>
                </div>

                {/* QR Code Generated */}
                <div className="w-48 h-48 mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <img
                    src={`https://api.vietqr.io/image/970422-0984556712-compact.jpg?amount=${
                      checkoutData.payOption === 'FULL'
                        ? checkoutCourse.price
                        : (checkoutCourse.depositAmount || 3000000)
                    }&addInfo=${encodeURIComponent(
                      `CELLA ${checkoutCourse.code} ${checkoutData.phone || 'HOCVIEN'}`
                    )}&accountName=TRAN%20THI%20HUONG%20PHUONG`}
                    alt="VietQR Chuyển khoản CELLA"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-xs bg-white p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <strong className="text-slate-900">MB Bank (Quân Đội)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="font-mono text-[#5850EC] text-sm">0984556712</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('0984556712', 'stk')}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Sao chép"
                      >
                        {copiedField === 'stk' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Chủ tài khoản:</span>
                    <strong className="text-slate-900">TRAN THI HUONG PHUONG</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nội dung CK:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="font-mono text-slate-800 text-xs">
                        CELLA {checkoutCourse.code} {checkoutData.phone || 'HOCVIEN'}
                      </strong>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            `CELLA ${checkoutCourse.code} ${checkoutData.phone || 'HOCVIEN'}`,
                            'nd'
                          )
                        }
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Sao chép"
                      >
                        {copiedField === 'nd' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {checkoutData.payMethod === 'MOMO' && (
              <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-200 text-center space-y-2">
                <span className="text-xs font-bold text-pink-700">Ví điện tử MoMo</span>
                <p className="text-sm font-black text-slate-900">Số MoMo: 0984 556 712</p>
                <p className="text-xs text-slate-600">Tên người nhận: TRẦN THỊ HƯƠNG PHƯỢNG</p>
                <p className="text-[11px] text-pink-600">
                  Nội dung: CELLA {checkoutCourse.code} {checkoutData.phone || 'HOCVIEN'}
                </p>
              </div>
            )}

            {checkoutData.payMethod === 'CASH' && (
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 text-center space-y-1.5 text-xs text-slate-700">
                <span className="font-bold text-amber-800 block">Thanh toán trực tiếp tại Studio</span>
                <p>Địa chỉ: CELLA Makeup Academy - Thành phố Thái Bình</p>
                <p className="text-slate-500">
                  Bạn vui lòng hoàn tất thủ tục trước ngày khai giảng 03 ngày để đảm bảo giữ chỗ.
                </p>
              </div>
            )}

            {/* Nút hoàn tất & xác nhận thanh toán */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-200 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  Xác nhận Tôi Đã Thanh Toán (
                  {(checkoutData.payOption === 'FULL'
                    ? checkoutCourse.price
                    : (checkoutCourse.depositAmount || 3000000)
                  ).toLocaleString('vi-VN')}{' '}
                  đ)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutCourse(null)}
                className="w-full py-2 rounded-xl text-slate-500 text-xs font-medium hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: BIÊN LAI / HÓA ĐƠN ĐIỆN TỬ XÁC NHẬN THÀNH CÔNG
      ======================================================== */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Thanh toán thành công
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Biên Lai Đăng Ký Khóa Học
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Mã: {receipt.receiptCode}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Khóa học:</span>
                <strong className="text-slate-900 text-right">{receipt.course.title}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mã lớp:</span>
                <strong className="text-[#5850EC]">{receipt.course.code}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Học viên:</span>
                <strong className="text-slate-900">{receipt.customerName} ({receipt.phone})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hình thức nộp:</span>
                <strong className="text-slate-800">
                  {receipt.payType === 'FULL' ? 'Đã đóng 100% học phí' : 'Đã đóng cọc giữ slot'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phương thức:</span>
                <span className="text-slate-700">{receipt.payMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-bold text-slate-700">Số tiền thanh toán:</span>
                <strong className="font-black text-emerald-600">
                  {receipt.amountPaid.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <div className="text-[11px] text-slate-400 text-right pt-0.5">
                Thời gian: {receipt.timestamp}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl text-left text-xs text-slate-600 flex items-start gap-2">
              <Gift className="w-4 h-4 text-[#5850EC] shrink-0 mt-0.5" />
              <span>
                Hồ sơ học viên đã được tự động lưu vào hệ thống CELLA Academy. Tư vấn viên sẽ gọi xác nhận trong ít phút.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onNavigate('students');
                }}
                className="py-2.5 rounded-xl border border-indigo-200 text-[#5850EC] text-xs font-bold hover:bg-indigo-50"
              >
                Xem Hồ Sơ Học Viên
              </button>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="py-2.5 rounded-xl bg-[#5850EC] text-white text-xs font-bold hover:bg-[#4338CA] shadow-md"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: THÊM MỚI KHÓA HỌC
      ======================================================== */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Thêm Khóa Học Mới</h3>
                <p className="text-xs text-slate-500">Học viện Đào tạo CELLA Academy</p>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Tên khóa học *</label>
                <input
                  type="text"
                  value={courseFormData.title || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  placeholder="Khóa Makeup Chuyên Nghiệp Master PRO"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã khóa học</label>
                <input
                  type="text"
                  value={courseFormData.code || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                  placeholder="K29-PRO"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân loại</label>
                <select
                  value={courseFormData.category || 'Chuyên nghiệp'}
                  onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                  <option value="Cô dâu">Cô dâu</option>
                  <option value="Nghệ thuật">Nghệ thuật High-Fashion</option>
                  <option value="Cá nhân">Cá nhân</option>
                  <option value="Nâng cao">Nâng cao</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Học phí ưu đãi (VNĐ) *</label>
                <input
                  type="number"
                  value={courseFormData.price || 0}
                  onChange={(e) => setCourseFormData({ ...courseFormData, price: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-[#5850EC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá gốc gạch ngang (VNĐ)</label>
                <input
                  type="number"
                  value={courseFormData.originalPrice || 0}
                  onChange={(e) => setCourseFormData({ ...courseFormData, originalPrice: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tiền cọc giữ chỗ (VNĐ)</label>
                <input
                  type="number"
                  value={courseFormData.depositAmount || 0}
                  onChange={(e) => setCourseFormData({ ...courseFormData, depositAmount: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-emerald-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số buổi học</label>
                <input
                  type="number"
                  value={courseFormData.totalLessons || 30}
                  onChange={(e) => setCourseFormData({ ...courseFormData, totalLessons: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giảng viên đứng lớp</label>
                <select
                  value={courseFormData.instructor || 'Master Cella Hương Phượng'}
                  onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })}
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
                <label className="block font-bold text-slate-700 mb-1">Ngày khai giảng</label>
                <input
                  type="text"
                  value={courseFormData.startDate || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, startDate: e.target.value })}
                  placeholder="15/05/2025"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Link Video Demo/Trailer</label>
                <input
                  type="text"
                  value={courseFormData.videoUrl || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, videoUrl: e.target.value })}
                  placeholder="https://... mp4 hoặc link video"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Ảnh bìa khóa học (URL)</label>
                <input
                  type="text"
                  value={courseFormData.coverImage || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCourseModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveAddCourse}
                className="flex-1 py-2.5 rounded-xl bg-[#5850EC] text-white text-xs font-bold hover:bg-[#4338CA] shadow-md transition-all"
              >
                Lưu khóa học mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: CHỈNH SỬA GIÁ & THÔNG TIN KHÓA HỌC
      ======================================================== */}
      {isEditPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Chỉnh Sửa Giá & Khóa Học</h3>
                <p className="text-xs text-slate-500">{courseFormData.title} ({courseFormData.code})</p>
              </div>
              <button
                onClick={() => setIsEditPriceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên khóa học</label>
                <input
                  type="text"
                  value={courseFormData.title || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Học phí ưu đãi (VNĐ)</label>
                  <input
                    type="number"
                    value={courseFormData.price || 0}
                    onChange={(e) => setCourseFormData({ ...courseFormData, price: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-[#5850EC]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá gốc gạch ngang (VNĐ)</label>
                  <input
                    type="number"
                    value={courseFormData.originalPrice || 0}
                    onChange={(e) => setCourseFormData({ ...courseFormData, originalPrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tiền cọc giữ chỗ (VNĐ)</label>
                <input
                  type="number"
                  value={courseFormData.depositAmount || 0}
                  onChange={(e) => setCourseFormData({ ...courseFormData, depositAmount: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Video Demo/Trailer</label>
                <input
                  type="text"
                  value={courseFormData.videoUrl || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, videoUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isHotCourse"
                  checked={Boolean(courseFormData.isHot)}
                  onChange={(e) => setCourseFormData({ ...courseFormData, isHot: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5850EC]"
                />
                <label htmlFor="isHotCourse" className="font-bold text-slate-700 cursor-pointer">
                  Đánh dấu là Khóa học Nổi bật (HOT)
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditPriceModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEditPrice}
                className="flex-1 py-2.5 rounded-xl bg-[#5850EC] text-white text-xs font-bold hover:bg-[#4338CA] shadow-md transition-all"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 6: CHI TIẾT KHÓA HỌC & GIÁO TRÌNH
      ======================================================== */}
      {activeCourseDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[88vh] overflow-y-auto space-y-4 shadow-2xl">
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
                onClick={() => setActiveCourseDetail(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video preview button if available */}
            {activeCourseDetail.videoUrl && (
              <div
                onClick={() => {
                  const c = activeCourseDetail;
                  setActiveCourseDetail(null);
                  setVideoModalCourse(c);
                }}
                className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-purple-100/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5850EC] text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Xem video trailer bài giảng</span>
                    <span className="text-[10px] text-slate-500">{activeCourseDetail.videoDuration || '04:15'}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            )}

            <div className="p-3 rounded-2xl bg-[#EFF4FF] border border-[#5850EC]/20 space-y-1 text-xs">
              <p className="font-bold text-[#5850EC]">
                Khai giảng: {activeCourseDetail.startDate}
              </p>
              <p className="text-slate-600">Lịch học: {activeCourseDetail.schedule}</p>
              <p className="text-slate-600">
                Học phí: <strong className="text-slate-900">{activeCourseDetail.price.toLocaleString('vi-VN')} đ</strong>{' '}
                {activeCourseDetail.originalPrice && (
                  <span className="line-through text-slate-400 text-[11px]">
                    {activeCourseDetail.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </p>
              {activeCourseDetail.depositAmount && (
                <p className="text-emerald-700 font-medium">
                  Cọc giữ chỗ chỉ từ: <strong>{activeCourseDetail.depositAmount.toLocaleString('vi-VN')} đ</strong>
                </p>
              )}
            </div>

            {/* Syllabus lessons */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Lộ trình giáo trình đào tạo
              </h4>
              <div className="space-y-2">
                {activeCourseDetail.syllabus && activeCourseDetail.syllabus.length > 0 ? (
                  activeCourseDetail.syllabus.map((syl) => (
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
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Đang cập nhật chi tiết giáo trình...</p>
                )}
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

            {/* Nút Mua ngay */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const c = activeCourseDetail;
                  setActiveCourseDetail(null);
                  handleOpenCheckout(c);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5850EC] to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Mua khóa học & Thanh toán ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
