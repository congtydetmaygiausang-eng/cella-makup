import { NewsfeedPost } from '../types';

// Logo & Images từ cellamakeup.vn
export const CELLA_LOGO = 'https://cellamakeup.vn/images/logo-white.png';
export const CELLA_LOGO_DARK = 'https://cellamakeup.vn/images/logo.png';
export const CELLA_OG_IMAGE = 'https://cellamakeup.vn/images/og-share.jpg';
export const CELLA_FOUNDER_IMG = 'https://cellamakeup.vn/images/chan-dung-cella.jpg';
export const CELLA_WORKSHOP_IMG = 'https://cellamakeup.vn/images/hero-workshop.jpg';
export const CELLA_TEAM_IMG = 'https://cellamakeup.vn/images/gt-doi-ngu.jpg';

// Bài viết blog thực tế từ cellamakeup.vn
export const CELLA_BLOG_POSTS = [
  {
    id: 'blog-1',
    category: 'Kinh Doanh & Khởi Nghiệp Makeup',
    title: 'Định giá thấp không giúp bạn có nhiều khách hơn',
    image: 'https://cellamakeup.vn/blog/images/gt-2.jpg',
    link: 'https://cellamakeup.vn/blog/bai-viet/dinh-gia-thap-khong-giup-ban-co-nhieu-khach-hon',
  },
  {
    id: 'blog-2',
    category: 'Nghề Makeup & Học Viên',
    title: 'Tay nghề không nằm ở cây cọ đắt tiền',
    image: 'https://cellamakeup.vn/blog/images/gt-1.jpg',
    link: 'https://cellamakeup.vn/blog/bai-viet/tay-nghe-khong-nam-o-cay-co-dat-tien',
  },
  {
    id: 'blog-3',
    category: 'Mối Quan Hệ',
    title: 'Khách khó tính dạy tôi điều mà khách dễ tính không dạy được',
    image: 'https://cellamakeup.vn/blog/images/gt-3.jpg',
    link: 'https://cellamakeup.vn/blog/bai-viet/khach-kho-tinh-day-toi-dieu-gi',
  },
  {
    id: 'blog-4',
    category: 'Phong Thái & Tính Nữ',
    title: 'Phong thái không phải dáng đi, mà là cách bạn phản ứng',
    image: 'https://cellamakeup.vn/blog/images/gt-4.jpg',
    link: 'https://cellamakeup.vn/blog/bai-viet/phong-thai-la-cach-ban-phan-ung',
  },
  {
    id: 'blog-5',
    category: 'Nghề Makeup & Học Viên',
    title: 'Bao lâu thì con làm được nghề hả cô?',
    image: 'https://cellamakeup.vn/images/hero-workshop.jpg',
    link: 'https://cellamakeup.vn/blog/bai-viet/bao-lau-thi-con-lam-duoc-nghe',
  },
  {
    id: 'blog-6',
    category: 'Kinh Doanh & Khởi Nghiệp Makeup',
    title: 'Ba con số mà người làm nghề makeup nào cũng phải biết',
    image: 'https://cellamakeup.vn/images/og-share.jpg',
    link: 'https://cellamakeup.vn/blog/bai-viet/ba-con-so-nguoi-lam-nghe-phai-biet',
  },
];

export const MOCK_POSTS: NewsfeedPost[] = [
  {
    id: 'post-cella-1',
    authorId: 'admin',
    authorName: 'Cella Hương Phượng',
    authorAvatar: 'https://cellamakeup.vn/images/chan-dung-cella.jpg',
    authorRole: 'CEO & Nhà sáng lập',
    timestamp: 'Vừa xong',
    content: '✨ Định giá thấp không giúp bạn có nhiều khách hơn.\n\nNhiều bạn nghĩ: "Hạ giá xuống thì khách sẽ đến nhiều hơn" — nhưng thực tế hoàn toàn ngược lại. Giá thấp không mang lại khách tốt, chỉ thu hút người mặc cả.\n\n#CellaMakeupAcademy #makeup #ThaiBindh #MakeupYourMind',
    images: ['https://cellamakeup.vn/blog/images/gt-2.jpg'],
    likes: 87,
    comments: 23,
    isLikedByMe: false,
  },
  {
    id: 'post-cella-2',
    authorId: 'admin',
    authorName: 'Cella Hương Phượng',
    authorAvatar: 'https://cellamakeup.vn/images/chan-dung-cella.jpg',
    authorRole: 'CEO & Nhà sáng lập',
    timestamp: '1 ngày trước',
    content: '🎓 Workshop makeup cho các bạn học sinh tại Thái Bình hôm nay!\n\nMỗi người tự làm được một lớp nền sạch và một gương mặt chỉn chu chỉ trong 1 buổi. Rất tự hào về các em! 💪\n\n#Workshop #CellaMakeup #HọcViện',
    images: ['https://cellamakeup.vn/images/hero-workshop.jpg'],
    likes: 124,
    comments: 41,
    isLikedByMe: true,
  },
  {
    id: 'post-cella-3',
    authorId: 'admin',
    authorName: 'Cella Hương Phượng',
    authorAvatar: 'https://cellamakeup.vn/images/chan-dung-cella.jpg',
    authorRole: 'CEO & Nhà sáng lập',
    timestamp: '2 ngày trước',
    content: '💛 Tay nghề không nằm ở cây cọ đắt tiền.\n\nSau 9 năm trong nghề, điều chị học được là: kỹ thuật và sự kiên nhẫn mới là tài sản thật. Còn dụng cụ chỉ là phương tiện.\n\n"Makeup your mind, makeup your life." ✨',
    images: ['https://cellamakeup.vn/blog/images/gt-1.jpg'],
    likes: 213,
    comments: 56,
    isLikedByMe: false,
  },
  {
    id: 'post-cella-4',
    authorId: 'admin',
    authorName: 'Cella Hương Phượng',
    authorAvatar: 'https://cellamakeup.vn/images/chan-dung-cella.jpg',
    authorRole: 'CEO & Nhà sáng lập',
    timestamp: '3 ngày trước',
    content: '🏆 CELLA MAKEUP ACADEMY vừa nhận danh hiệu BÀN TAY VÀNG MAKEUP CHÂU Á 2025 tại Asia Beauty Festival!\n\nĐây là thành quả của cả một hành trình dài — của đội ngũ, của học viên và của tất cả mọi người đã tin tưởng CELLA. Cảm ơn rất nhiều! 🙏',
    images: ['https://cellamakeup.vn/images/gt-doi-ngu.jpg'],
    likes: 512,
    comments: 98,
    isLikedByMe: false,
  },
];
