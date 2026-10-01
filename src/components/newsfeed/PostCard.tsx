import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Share2, Send, Loader2, Sparkles, Check, Smile } from 'lucide-react';
import { NewsfeedPost, PostComment, Staff } from '../../types';
import { supabase } from '../../config/supabase';

interface PostCardProps {
  post: NewsfeedPost;
  currentUser?: Staff;
}

const INITIAL_MOCK_COMMENTS: Record<string, PostComment[]> = {
  'post-cella-1': [
    {
      id: 'mock-c1',
      post_id: 'post-cella-1',
      author_name: 'Nguyễn Thị Thuỳ Dung',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      author_role: 'Học viên K24',
      content: 'Chị nói đúng quá ạ! Hồi mới ra nghề e cứ sợ đắt không ai làm, giảm giá xong toàn gặp khách khó tính. Giờ làm đẹp tự tin báo giá đúng chất lượng.',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'mock-c2',
      post_id: 'post-cella-1',
      author_name: 'Hoàng Mai Anh',
      author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      author_role: 'Makeup Artist',
      content: 'Bài học đắt giá của người làm nghề. Giá trị nằm ở tay nghề và phong thái chứ không phải cuộc đua giảm giá! 🌿✨',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    }
  ],
  'post-cella-2': [
    {
      id: 'mock-c3',
      post_id: 'post-cella-2',
      author_name: 'Lê Thảo Phương',
      author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      author_role: 'Khách hàng',
      content: 'Workshop siêu hay và chi tiết, e được cô giáo chỉnh từng góc cọ đánh nền luôn, mê CELLA thực sự ❤️',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
  ]
};

const QUICK_TAGS = ['❤️ Tuyệt vời quá', '🔥 Đỉnh quá chị', '👏 Quá xịn', '🌿 Đẹp xuất sắc', '✨ Chúc mừng CELLA'];

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
  const [liked, setLiked] = useState(post.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  // Comments state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // Load comments from Supabase & Local fallback
  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      // 1. Try Supabase
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      const defaultSeeds = INITIAL_MOCK_COMMENTS[post.id] || [];
      
      // 2. Read local cached comments if any
      const localCacheKey = `local_comments_${post.id}`;
      let cached: PostComment[] = [];
      try {
        const raw = localStorage.getItem(localCacheKey);
        if (raw) cached = JSON.parse(raw);
      } catch (e) {
        // ignore
      }

      if (!error && data && data.length > 0) {
        // Merge Supabase comments with default seeds if unique
        const existingIds = new Set(data.map((c: any) => c.id));
        const merged = [...defaultSeeds.filter(s => !existingIds.has(s.id)), ...data];
        setComments(merged);
        setCommentsCount(Math.max(post.comments, merged.length));
      } else {
        // Fallback to seeds + cached
        const merged = [...defaultSeeds, ...cached.filter(c => !defaultSeeds.some(s => s.id === c.id))];
        setComments(merged);
        setCommentsCount(Math.max(post.comments, merged.length));
      }
    } catch (err) {
      console.warn('Comments fetch notice:', err);
      const defaultSeeds = INITIAL_MOCK_COMMENTS[post.id] || [];
      setComments(defaultSeeds);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Open comments and focus input
  const handleOpenCommentInput = () => {
    setIsCommentsOpen(true);
    if (comments.length === 0) {
      fetchComments();
    }
    setTimeout(() => {
      commentsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      inputRef.current?.focus();
    }, 150);
  };

  // Toggle comments expand
  const handleToggleComments = () => {
    if (!isCommentsOpen) {
      handleOpenCommentInput();
    } else {
      setIsCommentsOpen(false);
    }
  };

  // Real-time listener for comments on this post
  useEffect(() => {
    if (!isCommentsOpen) return;

    const channel = supabase
      .channel(`rt_post_comments_${post.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${post.id}`,
        },
        (payload) => {
          const incoming = payload.new as PostComment;
          if (incoming) {
            setComments((prev) => {
              if (prev.some((c) => c.id === incoming.id)) return prev;
              return [...prev, incoming];
            });
            setCommentsCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isCommentsOpen, post.id]);

  // Handle submit comment
  const handleSubmitComment = async (e?: React.FormEvent, customContent?: string) => {
    if (e) e.preventDefault();
    const content = (customContent !== undefined ? customContent : newComment).trim();
    if (!content || isSubmitting) return;

    setIsSubmitting(true);
    const authorName = currentUser?.fullName || 'Khách hàng CELLA';
    const authorAvatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
    const authorRole = currentUser?.role === 'SUPER_ADMIN' ? 'Quản trị viên' : (currentUser?.role || 'Khách hàng');
    const authorId = currentUser?.id && currentUser.id.length > 20 ? currentUser.id : undefined;

    const optimisticComment: PostComment = {
      id: `c_${Date.now()}`,
      post_id: post.id,
      author_id: authorId,
      author_name: authorName,
      author_avatar: authorAvatar,
      author_role: authorRole,
      content,
      created_at: new Date().toISOString(),
    };

    // 1. Optimistic UI update immediately
    setComments((prev) => [...prev, optimisticComment]);
    setCommentsCount((prev) => prev + 1);
    setNewComment('');
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2500);

    // 2. Cache in localStorage for durability
    try {
      const localCacheKey = `local_comments_${post.id}`;
      const raw = localStorage.getItem(localCacheKey);
      const list = raw ? JSON.parse(raw) : [];
      list.push(optimisticComment);
      localStorage.setItem(localCacheKey, JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    // 3. Save to Supabase post_comments table
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: post.id,
            author_id: authorId,
            author_name: authorName,
            author_avatar: authorAvatar,
            author_role: authorRole,
            content: content,
          }
        ])
        .select();

      if (error) {
        console.warn('Lưu bình luận lên Supabase lưu ý:', error.message);
      } else if (data && data[0]) {
        // Update optimistic id with real database id
        setComments((prev) =>
          prev.map((c) => (c.id === optimisticComment.id ? (data[0] as PostComment) : c))
        );
      }
    } catch (err) {
      console.warn('Lỗi kết nối Supabase khi bình luận:', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Vừa xong';
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return 'Vừa xong';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
      return `${Math.floor(diffSec / 86400)} ngày trước`;
    } catch (e) {
      return 'Vừa xong';
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl mb-3.5 mx-3 border border-[#264736]/10 shadow-[0_4px_20px_rgba(26,51,38,0.04)] overflow-hidden backdrop-blur-sm transition-all">
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
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={toggleLike}>
          <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-xs">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-[12px] font-medium text-slate-500">{likesCount} lượt thích</span>
        </div>
        <button 
          onClick={handleOpenCommentInput}
          className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-[#264736] font-medium transition-colors cursor-pointer"
        >
          <span>{commentsCount} bình luận</span>
        </button>
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
        <button 
          onClick={handleOpenCommentInput}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all active:scale-95 ${isCommentsOpen ? 'bg-[#EAF2EC] text-[#264736] font-bold shadow-xs' : 'text-slate-600 hover:text-[#264736] hover:bg-[#EAF2EC]/60'}`}
        >
          <MessageCircle className="w-4.5 h-4.5 text-[#264736]" />
          <span className="text-[12.5px] font-semibold text-[#1E3A2F]">Bình luận</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:text-[#264736] hover:bg-[#EAF2EC]/60 rounded-xl transition-all active:scale-95">
          <Share2 className="w-4.5 h-4.5" />
          <span className="text-[12.5px] font-semibold">Chia sẻ</span>
        </button>
      </div>

      {/* ── EXPANDABLE COMMENTS SECTION ── */}
      {isCommentsOpen && (
        <div ref={commentsContainerRef} className="px-4 py-3 bg-[#F9FAF9] border-t border-slate-100 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
            <h5 className="text-[12.5px] font-bold text-[#1E3A2F] flex items-center gap-1.5">
              <span>Bình luận</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#264736] text-[11px] font-bold">
                {comments.length}
              </span>
            </h5>
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đồng bộ Supabase Live
            </span>
          </div>

          {/* Quick Reaction Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setNewComment(tag);
                  inputRef.current?.focus();
                }}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#264736]/15 hover:border-[#264736] hover:bg-[#EAF2EC] text-[11px] font-medium text-[#264736] active:scale-95 transition-all shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Comments List */}
          <div className="space-y-3 mb-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
            {isLoadingComments ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#264736]" />
                <span className="text-[12px]">Đang tải bình luận...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="py-5 text-center text-slate-400 text-[12px]">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận! ✨
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 items-start group">
                  <img
                    src={c.author_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                    alt={c.author_name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#264736]/10 shadow-[0_1px_4px_rgba(0,0,0,0.03)] inline-block max-w-full">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[12.5px] font-bold text-[#1A2820]">
                          {c.author_name}
                        </span>
                        {c.author_role && (
                          <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {c.author_role}
                          </span>
                        )}
                      </div>
                      <p className="text-[12.5px] text-[#2D3748] leading-relaxed break-words whitespace-pre-wrap">
                        {c.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-1 text-[10.5px] text-slate-400">
                      <span>{formatTime(c.created_at)}</span>
                      <button className="font-semibold text-slate-500 hover:text-emerald-800">Thích</button>
                      <button className="font-semibold text-slate-500 hover:text-emerald-800">Trả lời</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input Box */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-200"
            />
            <div className="flex-1 relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận công khai..."
                className="w-full bg-white border border-[#264736]/25 rounded-full pl-3.5 pr-11 py-2 text-[12.5px] text-slate-800 focus:outline-none focus:border-[#264736] focus:ring-2 focus:ring-[#264736]/20 shadow-xs placeholder:text-slate-400 transition-all"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="absolute right-1.5 w-7 h-7 rounded-full bg-[#264736] text-white flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#1E3A2F] active:scale-95 transition-all shadow-xs"
                title="Gửi bình luận"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : justSubmitted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Send className="w-3.5 h-3.5 translate-x-px" />
                )}
              </button>
            </div>
          </form>

          {/* Feedback note */}
          {justSubmitted && (
            <p className="text-[11px] text-emerald-700 font-medium text-center mt-1.5 animate-in fade-in">
              🌿 Bình luận của bạn đã được đăng thành công!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
