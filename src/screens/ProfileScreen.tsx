import React, { useState, useRef } from 'react';
import { ScreenId, Staff } from '../types';
import { CURRENT_USER, SAMPLE_ACCOUNTS } from '../data/mockData';
import {
  LogOut, ChevronRight, Shield, Lock, Camera,
  Phone, Mail, Calendar, Building2, Briefcase,
  CheckCircle2, Edit3, X, Check, Bell, QrCode,
  Users, Star, Clock, Image as ImageIcon, Video,
  MessageCircle, Heart, Share2, MoreHorizontal,
  Send, UserPlus, Smile, Search, HelpCircle, Edit2, Plus, ChevronLeft
} from 'lucide-react';
import { supabase } from '../config/supabase';

interface ProfileScreenProps {
  currentUser?: Staff;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  onBookPost?: (post: any) => void;
  bookings?: any[];
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MASTER_ARTIST: 'Master Trainer',
  MASTER: 'Master Trainer',
  ARTIST: 'Makeup Artist',
  SALES_CONSULTANT: 'Sales & CRM',
  SALES: 'Sales Specialist',
  ACADEMY_TRAINER: 'Giảng viên Academy',
  CUSTOMER: 'Khách hàng',
  TRAINER: 'Giảng viên',
  STUDENT: 'Học viên',
};

const MOCK_REVIEWS = [
  { id: 1, customerName: 'Chị Lan Trương', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', rating: 5, date: '10/09/2026', content: 'Bạn makeup rất ưng ý, lớp nền mỏng nhẹ và tự nhiên đúng style mình thích. Tư vấn nhiệt tình nữa!' },
  { id: 2, customerName: 'Nguyễn Ngọc Diệp', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80', rating: 5, date: '02/09/2026', content: 'Dịch vụ tuyệt vời. Mình đặt lịch chụp ảnh cưới mà được team support hết mình từ 5h sáng.' }
];

const COMMON_EMOJIS = ['😀','😂','🥰','😍','😎','😢','😡','👍','🙏','❤️','✨','🎉','💄','🌸','🔥'];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Nguyễn Thị Mai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 'f2', name: 'Hoàng Bảo Châu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'f3', name: 'Trần Minh Phúc', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80' },
  { id: 'f4', name: 'Lê Yến Nhi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onNavigate,
  onBack,
  onLogout,
  onBookPost,
  bookings = [],
}) => {
  const user = currentUser || CURRENT_USER;
  const [twoFA, setTwoFA] = useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editName, setEditName] = useState(user.fullName);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editEmail, setEditEmail] = useState(user.email || '');

  // Profile Image state
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [avatarImg, setAvatarImg] = useState<string | null>(user.avatarUrl || null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Zalo Tabs State
  const [activeTab, setActiveTab] = useState<'feed' | 'reviews'>('feed');

  // Posts Feed State
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'feed') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        image_url,
        created_at,
        profiles(full_name, avatar_url),
        post_likes(id)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const mapped = data.map(p => ({
        id: p.id,
        time: new Date(p.created_at).toLocaleString('vi-VN'),
        content: p.content,
        images: p.image_url ? [p.image_url] : [],
        likes: p.post_likes?.length || 0,
        isLiked: p.post_likes?.some((l: any) => l.user_id === session?.user?.id),
        comments: [],
        tagged: [],
        authorName: p.profiles?.full_name || 'Người dùng',
        authorAvatar: p.profiles?.avatar_url || ''
      }));
      setPosts(mapped);
    }
  };

  // Dummy initial state to keep types happy before fetch
  // End Fetch Posts
  // Post Creation & Editing State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostTagged, setNewPostTagged] = useState<string[]>([]);
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const postImageInputRef = useRef<HTMLInputElement>(null);
  
  // Commenting State
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [postMenuOpenId, setPostMenuOpenId] = useState<number | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, text?: string, image?: string, booking?: any, time: string}[]>([
    { sender: 'them', text: 'Chào bạn, mình có thể tư vấn gì cho bạn về mẫu này?', time: 'Vừa xong' }
  ]);
  const chatImageInputRef = useRef<HTMLInputElement>(null);

  // Create Booking Modal State
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    service: 'Makeup dự tiệc',
    date: '',
    time: ''
  });

  // Post Menu State

  // Handle Profile Image Changes
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void, field: 'avatar_url' | 'cover_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Str = ev.target?.result as string;
      setter(base64Str);
      
      // Save to Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          await supabase.from('profiles').update({ [field]: base64Str }).eq('id', session.user.id);
        } catch (err) {
          console.error('Error saving image to Supabase:', err);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Post Images
  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewPostImages(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePostImage = (index: number) => {
    setNewPostImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Tags
  const toggleTag = (name: string) => {
    setNewPostTagged(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  // Open Edit Post Modal
  const handleEditClick = (post: any) => {
    setEditingPostId(post.id);
    setNewPostText(post.content);
    setNewPostImages([...post.images]);
    setNewPostTagged([...post.tagged]);
    setPostMenuOpenId(null);
    setIsCreatePostOpen(true);
  };

  // Open Create Post Modal
  const handleCreateClick = () => {
    setEditingPostId(null);
    setNewPostText('');
    setNewPostImages([]);
    setNewPostTagged([]);
    setIsCreatePostOpen(true);
  };

  // Handle Post Submit (Create or Update)
  const handleSubmitPost = async () => {
    if (!newPostText.trim() && newPostImages.length === 0) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert('Vui lòng đăng nhập để đăng bài!');
      return;
    }

    if (editingPostId) {
      // Update existing (mocking update here for simplicity)
      await supabase.from('posts').update({
        content: newPostText,
        image_url: newPostImages[0] || null
      }).eq('id', editingPostId);
    } else {
      // Create new
      await supabase.from('posts').insert({
        author_id: session.user.id,
        content: newPostText,
        image_url: newPostImages[0] || null
      });
    }
    
    fetchPosts(); // Reload
    
    // Reset state
    setNewPostText('');
    setNewPostImages([]);
    setNewPostTagged([]);
    setEditingPostId(null);
    setIsCreatePostOpen(false);
    setShowEmojiPicker(false);
  };

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleConsultClick = (postId: number) => {
    setIsChatOpen(true);
  };

  const handleBookingClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (onBookPost && post) {
      onBookPost(post);
    }
    setToastMessage('Đã tạo lịch Booking mẫu này thành công! Lịch hẹn nằm trong Danh sách Booking.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmitComment = (postId: number) => {
    if (!commentText.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { 
            id: Date.now(), 
            author: user.fullName, 
            text: commentText,
            avatar: avatarImg || user.avatarUrl
          }]
        };
      }
      return p;
    }));
    setCommentText('');
    setCommentingPostId(null);
  };

  const roleLabel = ROLE_LABEL[user.role] || user.role;
  const filteredFriends = MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(tagSearch.toLowerCase()));

  return (
    <div className="min-h-full bg-[#F0F2F5] pb-28 text-slate-900 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 text-xs font-bold w-[90%] max-w-sm text-center animate-in slide-in-from-top duration-300">
          ✨ {toastMessage}
        </div>
      )}

      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleProfileImageChange(e, setCoverImg, 'cover_url')} />
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleProfileImageChange(e, setAvatarImg, 'avatar_url')} />

      {/* ── COVER + AVATAR ── */}
      <div className="relative bg-white pb-4 border-b border-slate-200">
        <div className="w-full h-56 relative overflow-hidden">
          {coverImg ? (
            <img src={coverImg} alt="Ảnh bìa" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #544CDE 0%, #7C3AED 40%, #EC4899 100%)' }} />
          )}

          <button onClick={onBack || (() => onNavigate('home'))} className="absolute top-10 left-4 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm text-white flex items-center justify-center active:scale-90 transition-all">
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button onClick={() => coverInputRef.current?.click()} className="absolute top-10 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-black/40">
            <Camera className="w-3.5 h-3.5" />
            Đổi ảnh bìa
          </button>

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="relative -mt-14 flex justify-center z-10">
          <div className="relative">
            <img src={avatarImg || user.avatarUrl} alt={user.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg" />
            <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center border-2 border-white shadow-md hover:bg-slate-200">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── NAME + ROLE ── */}
        <div className="pt-3 pb-4 text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900">{editName}</h1>
            <CheckCircle2 className="w-5 h-5 text-[#544CDE] shrink-0" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#544CDE] font-bold text-xs">{roleLabel}</span>
            <span className="text-slate-400 text-xs font-medium">{user.employeeCode || user.id}</span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="flex">
          <button onClick={() => setActiveTab('feed')} className={`flex-1 py-3 text-[14px] font-bold border-b-2 transition-all ${activeTab === 'feed' ? 'border-[#544CDE] text-[#544CDE]' : 'border-transparent text-slate-500'}`}>
            Nhật ký
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 text-[14px] font-bold border-b-2 transition-all ${activeTab === 'reviews' ? 'border-[#544CDE] text-[#544CDE]' : 'border-transparent text-slate-500'}`}>
            Đánh giá & Review
          </button>
        </div>
      </div>

      {/* ── FEED TAB ── */}
      {activeTab === 'feed' && (
        <>
          {/* Action Cards (Edit Profile) */}
          <div className="mx-4 mt-4 flex gap-2">
            <button onClick={() => setIsEditSheetOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 shadow-sm border border-slate-200 transition-colors">
              <Edit3 className="w-4 h-4" /> Chỉnh sửa
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 shadow-sm border border-slate-200 transition-colors">
              <QrCode className="w-4 h-4" /> Mã QR
            </button>
          </div>

          {/* Create Post Input Row */}
          <div className="mt-4 bg-white border-y border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 p-4">
              <img src={avatarImg || user.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
              <button 
                onClick={handleCreateClick}
                className="flex-1 bg-[#F0F2F5] hover:bg-slate-200 rounded-full px-4 py-2.5 text-left transition-colors"
              >
                <span className="text-[14px] text-slate-500 font-medium">Bạn đang nghĩ gì?</span>
              </button>
            </div>
            <div className="flex items-center divide-x divide-slate-100 border-t border-slate-100">
              <button onClick={() => { handleCreateClick(); setTimeout(() => postImageInputRef.current?.click(), 300); }} className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                <span className="text-[13px] font-bold text-slate-600">Ảnh</span>
              </button>
              <button onClick={() => { handleCreateClick(); setShowTagModal(true); }} className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50">
                <UserPlus className="w-5 h-5 text-blue-500" />
                <span className="text-[13px] font-bold text-slate-600">Gắn thẻ</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-3 mt-3">
            {posts.map(post => (
              <div key={post.id} className="bg-white border-y border-slate-200 shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img src={avatarImg || user.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                      <div>
                        <h4 className="text-[14px] font-bold text-slate-900 leading-tight">
                          {editName}
                          {post.tagged && post.tagged.length > 0 && (
                            <span className="font-normal text-slate-600">
                              {' cùng với '}
                              <strong className="text-slate-900 font-bold">{post.tagged.join(', ')}</strong>
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{post.time}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setPostMenuOpenId(postMenuOpenId === post.id ? null : post.id)} 
                        className="text-slate-400 p-1 hover:bg-slate-100 rounded-full"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu for Post */}
                      {postMenuOpenId === post.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in duration-200">
                          <button 
                            onClick={() => handleEditClick(post)} 
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50 text-left"
                          >
                            <Edit2 className="w-4 h-4" /> Chỉnh sửa bài viết
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {post.content && <p className="text-[14px] text-slate-800 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>}
                </div>
                
                {post.images.length > 0 && (
                  <div className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {post.images.map((img, idx) => (
                      <img key={idx} src={img} className={`w-full object-cover ${post.images.length === 1 ? 'h-72' : 'h-48'}`} alt="Post img" />
                    ))}
                  </div>
                )}
                
                {/* Likes/Comments count */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                    <span className="text-[12px] font-medium text-slate-500">{post.likes}</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-500">{post.comments.length} bình luận</span>
                </div>
                
                {/* Actions */}
                <div className="flex items-center px-1 py-1 divide-x divide-slate-100">
                  <button onClick={() => handleLike(post.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors ${post.isLiked ? 'text-red-500' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Heart className={`w-[16px] h-[16px] ${post.isLiked ? 'fill-red-500' : ''}`} />
                    <span className="text-[11px] font-bold">Thích</span>
                  </button>
                  <button onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl">
                    <MessageCircle className="w-[16px] h-[16px]" />
                    <span className="text-[11px] font-bold">Bình luận</span>
                  </button>
                  <button onClick={() => handleConsultClick(post.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#544CDE] hover:bg-indigo-50 rounded-xl">
                    <HelpCircle className="w-[16px] h-[16px]" />
                    <span className="text-[11px] font-bold">Tư vấn</span>
                  </button>
                  <button onClick={() => handleBookingClick(post.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl">
                    <Calendar className="w-[16px] h-[16px]" />
                    <span className="text-[11px] font-bold">Booking</span>
                  </button>
                </div>

                {/* Comments Section */}
                {(post.comments.length > 0 || commentingPostId === post.id) && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-50 bg-slate-50/50">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2 mb-3">
                        <img src={c.avatar} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200" alt={c.author} />
                        <div className="bg-white border border-slate-100 px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                          <p className="text-[12px] font-bold text-slate-900">{c.author}</p>
                          <p className="text-[13px] text-slate-800 leading-snug">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    
                    {commentingPostId === post.id && (
                      <div className="flex gap-2 items-center mt-3">
                        <img src={avatarImg || user.avatarUrl} className="w-8 h-8 rounded-full object-cover shrink-0" alt="Avatar" />
                        <div className="flex-1 relative">
                          <input
                            autoFocus
                            type="text"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Viết bình luận..."
                            className="w-full bg-white border border-slate-200 rounded-full pl-4 pr-10 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#544CDE]"
                            onKeyDown={(e) => {
                              if(e.key === 'Enter') handleSubmitComment(post.id);
                            }}
                          />
                          <button onClick={() => handleSubmitComment(post.id)} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${commentText.trim() ? 'text-white bg-[#544CDE]' : 'text-slate-400 bg-slate-100'}`}>
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── REVIEWS TAB ── */}
      {activeTab === 'reviews' && (
        <div className="mt-4 bg-white border-y border-slate-200 shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1">4.9 <Star className="w-6 h-6 text-amber-400 fill-amber-400" /></h3>
              <p className="text-[12px] text-slate-500 font-medium">Dựa trên 45 đánh giá</p>
            </div>
            <div className="flex gap-1 text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_REVIEWS.map(review => (
              <div key={review.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.customerName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900">{review.customerName}</h4>
                      <p className="text-[11px] text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS (Always below tabs) ── */}
      <div className="mt-4 mx-4 mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="text-[13px] font-black text-slate-800">Cài đặt & Quản lý</h3>
        </div>
        <button onClick={() => onNavigate('roles')} className="w-full flex items-center gap-3 px-4 py-4 border-b border-slate-100 hover:bg-slate-50">
          <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0"><Shield className="w-4 h-4 text-violet-500" /></div>
          <div className="flex-1 text-left"><p className="text-[14px] font-bold text-slate-900">Phân quyền & Vai trò</p></div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
        <button onClick={() => { if (onLogout) onLogout(); else onNavigate('auth'); }} className="w-full flex items-center justify-center gap-2 px-4 py-4 text-rose-500 hover:bg-rose-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-[14px] font-bold">Đăng xuất tài khoản</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-300 font-medium pb-4 pt-2">
        CELLA Beauty & Academy v2.5 · ISO Certified
      </p>

      {/* ── CREATE/EDIT POST MODAL ── */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
            <button onClick={() => {setIsCreatePostOpen(false); setEditingPostId(null);}} className="text-[15px] text-slate-500 font-medium">Hủy</button>
            <h3 className="text-[16px] font-black text-slate-900">{editingPostId ? 'Sửa bài viết' : 'Tạo bài viết'}</h3>
            <button 
              onClick={handleSubmitPost}
              className={`text-[15px] font-bold px-3 py-1 rounded-full ${(newPostText.trim() || newPostImages.length > 0) ? 'bg-[#544CDE] text-white' : 'bg-slate-100 text-slate-400 pointer-events-none'}`}
            >
              {editingPostId ? 'Lưu' : 'Đăng'}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
            <div className="flex items-center gap-3 p-4">
              <img src={avatarImg || user.avatarUrl} className="w-11 h-11 rounded-full object-cover" alt="Avatar" />
              <div>
                <p className="text-[15px] font-bold text-slate-900">
                  {editName}
                  {newPostTagged.length > 0 && (
                    <span className="font-normal text-slate-600">
                      {' cùng với '}
                      <strong className="text-slate-900 font-bold" onClick={() => setShowTagModal(true)}>{newPostTagged.length} người khác</strong>
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-slate-100 rounded-md w-max border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-600">🌍 Công khai</span>
                </div>
              </div>
            </div>
            
            <div className="px-4">
              <textarea
                autoFocus
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className="w-full min-h-[120px] resize-none text-[16px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Selected Images Preview */}
            {newPostImages.length > 0 && (
              <div className="px-4 grid grid-cols-2 gap-2 mt-2">
                {newPostImages.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200">
                    <img src={img} className="w-full h-32 object-cover" alt="preview" />
                    <button onClick={() => removePostImage(i)} className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="px-4 py-3 mt-4 border-t border-slate-100 bg-slate-50">
                <div className="flex flex-wrap gap-3">
                  {COMMON_EMOJIS.map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => setNewPostText(prev => prev + emoji)}
                      className="text-2xl hover:scale-110 transition-transform active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Toolbar for Create Post */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white shadow-lg">
            <input 
              ref={postImageInputRef} 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handlePostImageChange} 
            />
            <div className="flex items-center p-3 gap-2">
              <button onClick={() => postImageInputRef.current?.click()} className="flex-1 py-3 rounded-xl bg-[#F0F2F5] flex items-center justify-center gap-2 text-slate-700 font-bold text-[13px] hover:bg-slate-200 transition-colors">
                <ImageIcon className="w-5 h-5 text-emerald-500" /> Ảnh/Video
              </button>
              <button onClick={() => setShowTagModal(true)} className="flex-1 py-3 rounded-xl bg-[#F0F2F5] flex items-center justify-center gap-2 text-slate-700 font-bold text-[13px] hover:bg-slate-200 transition-colors">
                <UserPlus className="w-5 h-5 text-blue-500" /> Gắn thẻ
              </button>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-12 h-12 rounded-xl bg-[#F0F2F5] flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0">
                <Smile className="w-6 h-6 text-amber-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAG FRIEND MODAL ── */}
      {showTagModal && (
        <div className="fixed inset-0 z-[110] bg-white animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
            <button onClick={() => setShowTagModal(false)} className="text-[14px] text-slate-500 font-medium flex items-center"><ChevronRight className="w-5 h-5 rotate-180" /> Trở lại</button>
            <h3 className="text-[16px] font-black text-slate-900">Gắn thẻ bạn bè</h3>
            <button onClick={() => setShowTagModal(false)} className="text-[15px] font-bold text-[#544CDE]">Xong</button>
          </div>
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm bạn bè..." 
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full bg-[#F0F2F5] rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium focus:outline-none" 
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredFriends.map(friend => {
              const isSelected = newPostTagged.includes(friend.name);
              return (
                <div key={friend.id} onClick={() => toggleTag(friend.name)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-50">
                  <img src={friend.avatar} className="w-10 h-10 rounded-full object-cover" alt={friend.name} />
                  <span className="flex-1 text-[15px] font-bold text-slate-900">{friend.name}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-[#544CDE] border-[#544CDE]' : 'border-slate-300'}`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CHAT MODAL ── */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[200] bg-[#e5e7eb] flex flex-col animate-in slide-in-from-bottom-full duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#544CDE] to-[#7C3AED] px-4 py-3 flex items-center gap-3 text-white sticky top-0 z-10">
            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center -ml-2">
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <img src={avatarImg || user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full border border-white/50 object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold truncate">{user.fullName}</h3>
              <p className="text-[11px] opacity-80">Vừa mới truy cập</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsCreateBookingModalOpen(true)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Booking
              </button>
              <button className="w-8 h-8 flex items-center justify-center">
                <Phone className="w-5 h-5 fill-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {msg.booking ? (
                    <div className="w-[85%] bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mt-2 mb-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Calendar className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[14px] font-black text-slate-900">Xác nhận Lịch Hẹn</h4>
                          <p className="text-[11px] text-emerald-600 font-bold">Đã lưu vào hệ thống</p>
                          {msg.booking.conflict && (
                            <p className="text-[11px] text-rose-500 font-bold mt-1 bg-rose-50 px-2 py-0.5 rounded w-max">
                              ⚠️ Đã trùng ngày với lịch booking khác
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-500 font-medium">Khách hàng:</span>
                          <span className="font-bold text-slate-800">{msg.booking.customerName}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-500 font-medium">Dịch vụ:</span>
                          <span className="font-bold text-slate-800">{msg.booking.serviceTitle}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-500 font-medium">Thời gian:</span>
                          <span className="font-bold text-[#544CDE]">{msg.booking.appointmentTime} - {msg.booking.appointmentDate}</span>
                        </div>
                      </div>
                      <button className="w-full mt-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[13px] font-bold hover:bg-emerald-100 transition-colors">
                        Xem chi tiết lịch
                      </button>
                    </div>
                  ) : (
                    <div className={`max-w-[80%] ${msg.image ? 'p-1 rounded-2xl bg-white shadow-sm' : `px-4 py-2.5 rounded-2xl ${isMe ? 'bg-[#544CDE] text-white rounded-tr-sm' : 'bg-white text-slate-800 rounded-tl-sm shadow-sm'}`}`}>
                      {msg.image ? (
                        <img src={msg.image} alt="Chat img" className="w-full max-w-[200px] rounded-xl object-cover" />
                      ) : (
                        <p className="text-[14px]">{msg.text}</p>
                      )}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="bg-white px-3 py-3 border-t border-slate-200 flex items-center gap-2">
            <input 
              type="file"
              accept="image/*"
              ref={chatImageInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setChatHistory(prev => [...prev, { sender: 'me', image: ev.target?.result as string, time: 'Vừa xong' }]);
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = '';
              }}
            />
            <button 
              onClick={() => chatImageInputRef.current?.click()}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Tin nhắn..."
                className="w-full bg-slate-100 rounded-full pl-4 pr-10 py-2.5 text-[14px] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    setChatHistory(prev => [...prev, { sender: 'me', text: chatMessage.trim(), time: 'Vừa xong' }]);
                    setChatMessage('');
                  }
                }}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={() => {
                if (chatMessage.trim()) {
                  setChatHistory(prev => [...prev, { sender: 'me', text: chatMessage.trim(), time: 'Vừa xong' }]);
                  setChatMessage('');
                }
              }}
              className="w-9 h-9 flex items-center justify-center text-[#544CDE]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── CREATE BOOKING MODAL (MANUAL INPUT) ── */}
      {isCreateBookingModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
          <div className="bg-white rounded-t-3xl min-h-[50vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-black text-slate-900">Tạo lịch Booking</h3>
              <button 
                onClick={() => setIsCreateBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Tên khách hàng</label>
                <input 
                  type="text"
                  value={bookingForm.customerName}
                  onChange={e => setBookingForm({...bookingForm, customerName: e.target.value})}
                  placeholder="Nhập tên khách hàng..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#544CDE]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Dịch vụ</label>
                <input 
                  type="text"
                  value={bookingForm.service}
                  onChange={e => setBookingForm({...bookingForm, service: e.target.value})}
                  placeholder="Ví dụ: Makeup cô dâu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#544CDE]/50"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Ngày</label>
                  <input 
                    type="date"
                    value={bookingForm.date}
                    onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#544CDE]/50"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700">Giờ</label>
                  <input 
                    type="time"
                    value={bookingForm.time}
                    onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#544CDE]/50"
                  />
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100">
              <button 
                onClick={() => {
                  const formatDate = (dateString: string) => {
                    if (!dateString) return 'Hôm nay';
                    const parts = dateString.split('-');
                    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                    return dateString;
                  };
                  const formattedDate = formatDate(bookingForm.date);
                  const isConflict = bookings.some(b => b.appointmentDate === formattedDate);

                  if (onBookPost) {
                    onBookPost({
                      customerName: bookingForm.customerName || 'Khách hàng ẩn danh',
                      serviceTitle: bookingForm.service || 'Makeup',
                      appointmentDate: formattedDate,
                      appointmentTime: bookingForm.time || 'Chưa rõ',
                      artistName: user.fullName,
                      status: 'PENDING'
                    });
                  }
                  setChatHistory(prev => [...prev, {
                    sender: 'me',
                    text: `Dạ em đã tạo lịch booking ${bookingForm.service} cho chị lúc ${bookingForm.time} ngày ${formattedDate} rồi ạ.`,
                    time: 'Vừa xong',
                    booking: {
                      customerName: bookingForm.customerName || 'Khách hàng ẩn danh',
                      serviceTitle: bookingForm.service || 'Makeup',
                      appointmentDate: formattedDate,
                      appointmentTime: bookingForm.time || 'Chưa rõ',
                      conflict: isConflict
                    }
                  }]);
                  setIsCreateBookingModalOpen(false);
                  setToastMessage('Đã tạo lịch Booking thành công!');
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#544CDE] to-[#7C3AED] text-white rounded-xl text-[15px] font-bold shadow-md shadow-indigo-500/30 active:scale-95 transition-all"
              >
                Xác nhận tạo Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
