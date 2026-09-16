import { NewsfeedPost } from '../types';

export const MOCK_POSTS: NewsfeedPost[] = [
  {
    id: 'post-1',
    authorId: 'NV-9912',
    authorName: 'Trần Minh Phúc',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Makeup Artist',
    timestamp: 'Vừa xong',
    content: 'Tác phẩm makeup kỷ yếu cô dâu sáng nay ❤️ Cảm ơn khách yêu đã tin tưởng CELLA!',
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
    ],
    likes: 12,
    comments: 4,
    isLikedByMe: false,
  },
  {
    id: 'post-2',
    authorId: 'NV-8826',
    authorName: 'Nguyễn Thị Lan',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Sales Consultant',
    timestamp: '2 giờ trước',
    content: 'Tháng này team Sales cố gắng đạt chỉ tiêu nhé mọi người ơi! 🔥 KPI đang ở mức 85% rồi, chốt nốt mấy deal học viên VIP nào!',
    likes: 24,
    comments: 8,
    isLikedByMe: true,
  },
  {
    id: 'post-3',
    authorId: 'admin',
    authorName: 'Chị Phượng',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    authorRole: 'CEO',
    timestamp: 'Hôm qua',
    content: 'Thông báo lịch họp giao ban tuần: Chiều thứ 6 lúc 14h00 tại phòng họp lớn. Các team Leader chuẩn bị báo cáo tiến độ tuần nhé.',
    likes: 45,
    comments: 0,
    isLikedByMe: false,
  },
];
