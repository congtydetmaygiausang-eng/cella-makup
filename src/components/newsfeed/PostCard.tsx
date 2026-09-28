import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { NewsfeedPost } from '../../types';

interface PostCardProps {
  post: NewsfeedPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white/95 rounded-2xl mb-3.5 mx-3 border border-[#264736]/10 shadow-[0_4px_20px_rgba(26,51,38,0.04)] overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-bold text-[#1A2820] leading-tight">
                {post.authorName}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#264736]">
                {post.authorRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {post.timestamp}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-[#264736] hover:bg-[#EAF2EC]/60 p-2 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-[13.5px] text-[#203227] leading-relaxed whitespace-pre-wrap font-normal">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mt-2 w-full aspect-[4/5] bg-slate-100 overflow-hidden">
          <img
            src={post.images[0]}
            alt="Post content"
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2.5 mt-1 border-b border-slate-100/80">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-xs">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-[12px] font-medium text-slate-500">{likesCount} lượt thích</span>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-slate-400">
          <span>{post.comments} bình luận</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center px-2 py-1 bg-slate-50/50">
        <button 
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all active:scale-95 ${liked ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-[#264736] hover:bg-[#EAF2EC]/60'}`}
        >
          <Heart className={`w-4.5 h-4.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span className="text-[12.5px]">{liked ? 'Đã thích' : 'Thích'}</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:text-[#264736] hover:bg-[#EAF2EC]/60 rounded-xl transition-all active:scale-95">
          <MessageCircle className="w-4.5 h-4.5" />
          <span className="text-[12.5px] font-semibold">Bình luận</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:text-[#264736] hover:bg-[#EAF2EC]/60 rounded-xl transition-all active:scale-95">
          <Share2 className="w-4.5 h-4.5" />
          <span className="text-[12.5px] font-semibold">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
};
