import React, { useState } from 'react';
import { ScreenId, Staff, FeedPost } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  ChevronLeft,
  Search,
  MoreVertical,
  Lock,
  MapPin,
  MessageCircle,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Heart,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser?: Staff;
  posts?: FeedPost[];
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onLikePost?: (postId: string) => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  posts = [],
  onNavigate,
  onBack,
  onLikePost,
}) => {
  const user = currentUser || CURRENT_USER;
  const [activeTab, setActiveTab] = useState<'ALL' | 'MEDIA' | 'STORY'>('ALL');

  // Filter posts created by the current user (mocked to all for demo if empty, or just show the first few)
  const userPosts = posts;

  return (
    <div className="min-h-full bg-[#F8F9FA] pb-28 text-slate-900 animate-in fade-in duration-300">
      {/* Cover Photo & Transparent Header */}
      <div className="relative h-48 bg-linear-to-tr from-[#1E1B4B] via-[#4338CA] to-[#818CF8]">
        {/* Header Actions */}
        <div className="absolute top-0 inset-x-0 pt-10 pb-4 px-5 flex items-center justify-between text-white z-10">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/30 transition-colors">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/30 transition-colors">
              <MoreVertical className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 relative z-20">
        {/* Profile Info Card */}
        <div className="bg-white rounded-[32px] p-5 shadow-sm shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative -mt-16 mb-3">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Name & Title */}
            <div className="flex items-center gap-1.5 justify-center mb-1">
              <h2 className="text-xl font-black text-slate-900">{user.fullName}</h2>
              <CheckCircle2 className="w-5 h-5 text-[#00A3FF] fill-[#00A3FF]/10 stroke-[2.5]" />
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {user.title || 'Chuyên viên CELLA'} • {user.role === 'MASTER' ? 'Master Trainer' : 'Makeup Artist'}
            </p>
            <p className="text-[13px] text-slate-600 font-medium text-center mt-2 px-4 leading-relaxed">
              "Lan truyền cảm hứng làm đẹp chuẩn Hàn. Nhận đào tạo học viên 1 kèm 1."
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 mt-4 w-full">
              <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold text-[13px] hover:bg-slate-200 transition-colors">
                Chỉnh sửa hồ sơ
              </button>
              <button className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Lock className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Tags / Info Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full">
              <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-600">Đang hoạt động</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                <span className="text-[11px] font-bold text-slate-600">Quận 1, HCM</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#00A3FF] stroke-[2.5]" />
                <span className="text-[11px] font-bold text-[#00A3FF]">{user.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Composer */}
        <div className="mt-4 bg-white rounded-3xl p-4 shadow-sm shadow-slate-200/50 border border-slate-100 cursor-text">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-100"
            />
            <div className="flex-1 bg-slate-50 rounded-2xl h-10 px-4 flex items-center text-[13px] font-medium text-slate-400">
              Bạn đang nghĩ gì hoặc muốn chia sẻ ca làm đẹp?
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-[12px] font-bold text-slate-600">
              <ImageIcon className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
              <span>Ảnh / Video</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-[12px] font-bold text-slate-600">
              <Sparkles className="w-4 h-4 text-purple-500 stroke-[2.5]" />
              <span>Gắn ca điều trị</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-[12px] font-bold text-slate-600">
              <Sliders className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
              <span>Trước / Sau</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all ${
              activeTab === 'ALL'
                ? 'bg-[#00A3FF] text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả bài viết
          </button>
          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all ${
              activeTab === 'MEDIA'
                ? 'bg-[#00A3FF] text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Hình ảnh & Video
          </button>
          <button
            onClick={() => setActiveTab('STORY')}
            className={`px-5 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all ${
              activeTab === 'STORY'
                ? 'bg-[#00A3FF] text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Story (24h)
          </button>
        </div>

        {/* User Posts Feed */}
        <div className="mt-4 space-y-4">
          {userPosts.map((post) => (
            <GlassCard key={post.id} className="p-4 bg-white border border-slate-100 space-y-3 shadow-sm shadow-slate-200/50">
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[14px] font-black text-slate-900">{post.authorName}</h4>
                      {post.authorName === user.fullName && (
                         <CheckCircle2 className="w-4 h-4 text-[#00A3FF] fill-[#00A3FF]/10 stroke-[2.5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {post.timestamp} • {post.privacy}
                    </p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                  <MoreVertical className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Tagged customer banner if present */}
              {post.customerTag && (
                <div className="p-2.5 rounded-2xl bg-[#00A3FF]/5 border border-[#00A3FF]/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#00A3FF] stroke-[2.5]" />
                    <span className="text-[12px] font-bold text-[#00A3FF] truncate">
                      Cùng với {post.customerTag}
                    </span>
                  </div>
                </div>
              )}

              {/* Post Content */}
              <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {post.content}
              </p>

              {/* Treatment Before / After Result Image Split */}
              {post.treatmentResult && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 space-y-1">
                  <div className="grid grid-cols-2 gap-1 relative h-48 bg-slate-100">
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={post.treatmentResult.beforeImg}
                        alt="Trước"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                        Trước
                      </span>
                    </div>
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={post.treatmentResult.afterImg}
                        alt="Sau"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#00A3FF]/90 text-white backdrop-blur-md">
                        Sau 3 buổi
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-800">
                      {post.treatmentResult.treatmentLabel}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 px-2 py-0.5 rounded-lg bg-emerald-100/50">
                      Hiệu quả 90%
                    </span>
                  </div>
                </div>
              )}

              {/* Image gallery if present */}
              {post.images && post.images.length > 0 && !post.treatmentResult && (
                <div className={`grid gap-1 rounded-2xl overflow-hidden ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Feed photo"
                      className={`w-full object-cover ${post.images?.length === 1 ? 'h-64' : 'h-40'}`}
                    />
                  ))}
                </div>
              )}

              {/* Likes & Comments Count */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-1 px-1">
                <div className="flex items-center gap-1.5">
                   <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                     <Heart className="w-3 h-3 fill-white" />
                   </div>
                   <span>{post.likes} lượt thích</span>
                </div>
                <span>{post.commentsCount} bình luận • {post.sharesCount} chia sẻ</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => onLikePost?.(post.id)}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-xl transition-colors ${
                    post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 stroke-[2.5] ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-[12px] font-bold">{post.isLiked ? 'Đã thích' : 'Thích'}</span>
                </button>

                <button className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-xl text-slate-500 hover:bg-slate-50">
                  <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[12px] font-bold">Bình luận</span>
                </button>

                <button className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-xl text-slate-500 hover:bg-slate-50">
                  <Share2 className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[12px] font-bold">Chia sẻ</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
