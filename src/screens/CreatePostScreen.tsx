import React, { useState } from 'react';
import { FeedPost } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  X,
  Globe,
  Lock,
  Tag,
  Camera,
  Image as ImageIcon,
  UserCheck,
  Sparkles,
  Check,
  Plus,
} from 'lucide-react';

interface CreatePostScreenProps {
  onClose: () => void;
  onSubmitPost: (newPost: Partial<FeedPost>) => void;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({
  onClose,
  onSubmitPost,
}) => {
  const [content, setContent] = useState(
    'Hôm nay hoàn thành ca phục hồi da cho chị Mai sau liệu trình Glass Skin Pro. Độ căng bóng tự nhiên và sắc tố da sáng bừng sau 45 phút! Khách rất ưng ý và đã đăng ký gói liệu trình tiếp theo. ✨'
  );
  const [privacy, setPrivacy] = useState('Công khai nội bộ');
  const [category, setCategory] = useState('✨ Kết quả liệu trình');
  const [customerTag, setCustomerTag] = useState('Nguyễn Thị Mai (VIP 1) #KH-9842');
  const [serviceTag, setServiceTag] = useState('Liệu trình: CELLA Glass Skin Pro');

  const handlePost = () => {
    if (!content.trim()) return;

    const post: Partial<FeedPost> = {
      authorName: 'Nguyễn Thị Lan',
      authorRole: 'Master Trainer & Sales Lead',
      authorAvatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      timestamp: 'Vừa xong',
      privacy,
      category,
      content,
      customerTag,
      treatmentResult: {
        beforeImg:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        afterImg:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        treatmentLabel: serviceTag,
        customerName: 'Nguyễn Thị Mai',
        customerId: 'CUST-001',
      },
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
    };

    onSubmitPost(post);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-10 flex flex-col text-slate-900 animate-slide-up">
      {/* Header (Matching screenshot 16) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Tạo bài viết mới</h2>
            <p className="text-[11px] text-slate-400">Nhật ký làm đẹp & Đào tạo CELLA</p>
          </div>
        </div>

        <PrimaryButton size="sm" onClick={handlePost}>
          Đăng bài
        </PrimaryButton>
      </div>

      <div className="p-4 space-y-3.5 flex-1">
        {/* Author info & privacy row (Matching screenshot 16) */}
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
            alt="Nguyễn Thị Lan"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#5850EC]/20"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Nguyễn Thị Lan</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border-0 focus:ring-1 focus:ring-[#5850EC]"
              >
                <option value="Công khai nội bộ">🌐 Công khai nội bộ</option>
                <option value="Chỉ Ban Giám Đốc">🔒 Chỉ Ban Giám Đốc</option>
                <option value="Toàn bộ học viên">🎓 Toàn bộ học viên</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border-0 focus:ring-1 focus:ring-purple-500"
              >
                <option value="✨ Kết quả liệu trình">✨ Kết quả liệu trình</option>
                <option value="🎓 Đào tạo học viên">🎓 Đào tạo học viên</option>
                <option value="🔥 Tin tức & Sự kiện">🔥 Tin tức & Sự kiện</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text Area Input */}
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Mô tả ca liệu trình, cảm nhận của khách hàng hoặc kinh nghiệm thực hành..."
          className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
        />

        {/* Selected Tags Display */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFF4FF] border border-[#5850EC]/20 text-xs">
            <span className="font-semibold text-[#5850EC]">👤 {customerTag}</span>
            <button
              onClick={() => setCustomerTag('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50 border border-purple-200 text-xs">
            <span className="font-semibold text-purple-700">💆‍♀️ {serviceTag}</span>
            <button
              onClick={() => setServiceTag('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Upload previews (Matching screenshot 16) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Ảnh minh chứng trước & sau
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
                alt="Before"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white">
                Mặt mộc
              </span>
            </div>

            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="After"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#5850EC] text-white">
                Sau liệu trình
              </span>
            </div>

            <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#5850EC] hover:text-[#5850EC] cursor-pointer transition-colors bg-slate-50">
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">+ Thêm ảnh</span>
            </div>
          </div>
        </div>

        {/* Shortcut attachment pills */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Ảnh / Video thực tế từ thư viện</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400" />
          </button>

          <button className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#5850EC]" />
              <span>Gắn thẻ Khách hàng / Học viên</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400" />
          </button>

          <button className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Dịch vụ thẩm mỹ / Khóa học</span>
            </div>
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
