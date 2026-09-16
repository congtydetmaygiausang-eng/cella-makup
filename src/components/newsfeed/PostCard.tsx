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
    <div className="bg-white mb-2 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
          />
          <div>
            <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
              {post.authorName}
            </h4>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {post.timestamp} • {post.authorRole}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-[14px] text-slate-800 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mt-2 w-full max-h-[400px] bg-slate-100 overflow-hidden">
          <img
            src={post.images[0]}
            alt="Post content"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-[13px] text-slate-500">{likesCount}</span>
        </div>
        <div className="flex items-center gap-3 text-[13px] text-slate-500">
          <span>{post.comments} bình luận</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-slate-100 mx-3 mt-1 pt-1">
        <button 
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${liked ? 'text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-sky-500 text-sky-500' : ''}`} />
          <span className="text-[13px] font-semibold">{liked ? 'Đã thích' : 'Thích'}</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-[13px] font-semibold">Bình luận</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-[13px] font-semibold">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
};
