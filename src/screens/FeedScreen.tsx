import React, { useState } from 'react';
import { FeedPost, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Send,
  MoreVertical,
  Award,
  ChevronRight,
  Sliders,
} from 'lucide-react';

interface FeedScreenProps {
  posts: FeedPost[];
  onNavigate: (screen: ScreenId) => void;
  onLikePost: (postId: string) => void;
  onOpenCreatePost: () => void;
  onBack?: () => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  posts,
  onNavigate,
  onLikePost,
  onOpenCreatePost,
  onBack,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'TREATMENT' | 'ACADEMY'>('ALL');
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  const stories = [
    { id: 'add', name: 'Tạo tin mới', isAdd: true },
    { id: 's1', name: 'Cơ sở Q.1', avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80' },
    { id: 's2', name: 'Khóa K24', avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&auto=format&fit=crop&q=80' },
    { id: 's3', name: 'BS. Long', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
    { id: 's4', name: 'Khách VIP', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900">
      <MobileHeader
        title="Bảng tin & Hoạt động"
        subtitle="CELLA Pro • Nhật ký Lâm sàng & Đào tạo"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button
            onClick={onOpenCreatePost}
            className="p-2 rounded-full hover:bg-slate-100 text-[#5850EC]"
            title="Đăng bài mới"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        }
      />

      <div className="px-4 pt-1 space-y-3.5">
        {/* Stories Bar (Matching screenshot 15) */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
              {story.isAdd ? (
                <div
                  onClick={onOpenCreatePost}
                  className="w-14 h-14 rounded-full border-2 border-dashed border-[#5850EC] flex items-center justify-center text-[#5850EC] bg-[#EFF4FF] hover:bg-[#E0EAFF] transition-colors"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#5850EC] via-[#EC4899] to-amber-400">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
              )}
              <span className="text-[11px] font-medium text-slate-700 truncate max-w-[60px] text-center">
                {story.name}
              </span>
            </div>
          ))}
        </div>

        {/* Post Composer Card (Matching screenshot 15) */}
        <GlassCard
          onClick={onOpenCreatePost}
          className="p-3.5 bg-white border border-slate-100 cursor-pointer hover:border-[#5850EC]/30"
        >
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-[#5850EC]/30"
            />
            <div className="flex-1 h-9 px-3.5 rounded-full bg-slate-100 text-slate-400 text-xs flex items-center">
              Bạn đang nghĩ gì hoặc muốn chia sẻ ca làm đẹp mới?
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-2.5 border-t border-slate-100 text-xs font-semibold text-slate-600">
            <button className="flex items-center gap-1.5 hover:text-[#5850EC]">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Ảnh / Video</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#5850EC]">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Gắn ca điều trị</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#5850EC]">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Trước / Sau</span>
            </button>
          </div>
        </GlassCard>

        {/* Filter Pills (Matching screenshot 15) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-[#5850EC] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('TREATMENT')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'TREATMENT'
                ? 'bg-[#5850EC] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Ca điều trị & Khách hàng
          </button>
          <button
            onClick={() => setFilter('ACADEMY')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'ACADEMY'
                ? 'bg-[#5850EC] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Đào tạo & Học viên
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-3.5">
          {posts.map((post) => (
            <GlassCard key={post.id} className="p-4 bg-white border border-slate-100 space-y-3">
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#5850EC]/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{post.authorName}</h4>
                      <AuraBadge variant="primary" size="xs">
                        {post.authorRole}
                      </AuraBadge>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {post.timestamp} • {post.privacy}
                    </p>
                  </div>
                </div>

                <AuraBadge variant="purple" size="xs">
                  {post.category}
                </AuraBadge>
              </div>

              {/* Tagged customer banner if present */}
              {post.customerTag && (
                <div className="p-2 rounded-xl bg-[#EFF4FF] border border-[#5850EC]/20 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#5850EC] truncate">
                    👤 {post.customerTag}
                  </span>
                  <button
                    onClick={() => onNavigate('customer_detail')}
                    className="text-[11px] font-bold text-[#5850EC] hover:underline shrink-0"
                  >
                    Xem hồ sơ
                  </button>
                </div>
              )}

              {/* Post Content */}
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Treatment Before / After Result Image Split (Matching screenshot 15) */}
              {post.treatmentResult && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-1">
                  <div className="grid grid-cols-2 gap-0.5 relative h-48 bg-slate-900">
                    {/* Before image */}
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={post.treatmentResult.beforeImg}
                        alt="Trước khi điều trị"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        Trước (T0)
                      </span>
                    </div>

                    {/* After image */}
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={post.treatmentResult.afterImg}
                        alt="Sau khi điều trị"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#5850EC]/90 text-white backdrop-blur-xs">
                        Sau 3 buổi (T3)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#F8F9FF] flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {post.treatmentResult.treatmentLabel}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Phục hồi 85%
                    </span>
                  </div>
                </div>
              )}

              {/* Image gallery if present */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Feed photo"
                      className="w-full h-36 object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Likes & Comments Count */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{post.likes} lượt thích</span>
                <span>{post.commentsCount} bình luận • {post.sharesCount} chia sẻ</span>
              </div>

              {/* Action Buttons: Thích, Bình luận, Tư vấn ca này */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                    post.isLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.isLiked ? 'Đã thích' : 'Thích'}</span>
                </button>

                <button
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Bình luận</span>
                </button>

                <button
                  onClick={() => onNavigate('create_booking')}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[#5850EC] bg-[#EFF4FF] hover:bg-[#E0EAFF]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tư vấn ca này</span>
                </button>
              </div>

              {/* Comments Section preview */}
              {post.comments && post.comments.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5 bg-[#F8F9FF] p-2.5 rounded-xl text-xs">
                  {post.comments.map((cm) => (
                    <div key={cm.id} className="leading-snug">
                      <strong className="text-slate-900 mr-1.5 font-bold">{cm.author}:</strong>
                      <span className="text-slate-700">{cm.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          ))}

          {/* Ban Giám Đốc Banner Vinh danh (Matching screenshot 15) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                VINH DANH ĐỘI NGŨ
              </span>
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold leading-tight">
              CHIẾN BINH XUẤT SẮC THÁNG 4
            </h3>
            <p className="text-xs text-amber-100">
              Chúc mừng Team Tư vấn 1 đã xuất sắc hoàn thành 150% KPI doanh thu dịch vụ & học viên! Thưởng nóng 15.000.000 đ cho toàn đội ngũ. 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
