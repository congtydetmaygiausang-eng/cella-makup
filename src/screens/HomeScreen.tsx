import React from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { MOCK_POSTS } from '../data/mockPosts';
import { CreatePostInput } from '../components/newsfeed/CreatePostInput';
import { PostCard } from '../components/newsfeed/PostCard';
import { Search, Sparkles, UserPlus, CalendarPlus, Share2, Facebook, Instagram, Youtube, X, Plus, CalendarClock, PlaySquare, Gift, MessageCircle, Image, Info } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: Staff;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
  onQuickMessage?: (customer: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  currentUser,
  onToggleMenu,
  isMenuOpen = false,
  onQuickMessage,
}) => {
  const user = currentUser || CURRENT_USER;
  const [isPostMenuOpen, setIsPostMenuOpen] = React.useState(false);
  const [isMultiPlatformOpen, setIsMultiPlatformOpen] = React.useState(false);

  return (
    <div className="min-h-full bg-[#F3F4F6] pb-28 text-slate-900">
      {/* Top Header */}
      <MobileHeader
        title="Bảng tin"
        subtitle="CELLA MAKEUP ACADEMY"
        showBack={false}
        onMenuClick={onToggleMenu || (() => onNavigate('more'))}
        isMenuOpen={isMenuOpen}
        rightAction={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('customers')}
              className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-slate-700 flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        }
      />

      <div className="pt-[72px]">
        {/* Quick Actions Bar (Zalo style stories / quick actions) */}
        <div className="bg-white px-4 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar border-b border-slate-100">
          <div className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => onNavigate('ai_assistant')}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-[#544CDE] p-[2px] cursor-pointer active:scale-95 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                <Sparkles className="w-6 h-6 text-[#544CDE] fill-[#544CDE]/20" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-700">Trợ lý AI</span>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => onNavigate('create_customer')}>
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <UserPlus className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Thêm khách</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => onNavigate('create_booking')}>
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <CalendarPlus className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Đặt lịch</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => setIsPostMenuOpen(true)}>
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <Share2 className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Đăng bài</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => onNavigate('makeup_lookbook')}>
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <Image className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Mẫu makeup</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => onNavigate('academy')}>
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <Info className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-700">Giới thiệu</span>
          </div>
        </div>

        {/* Birthday Notification Banner (Zalo style) */}
        <div className="px-4 py-3 bg-white mb-2">
          <div className="w-full rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-3.5 flex items-center gap-3 border border-pink-100/50 shadow-[0_2px_10px_-4px_rgba(236,72,153,0.3)]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex flex-col items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-slate-800">Sinh nhật khách hàng</h4>
              <p className="text-[11px] text-slate-500 truncate">
                Hôm nay là sinh nhật của <span className="font-bold text-pink-600">Nguyễn Thị Hương</span>
              </p>
            </div>
            <button 
              onClick={() => onQuickMessage && onQuickMessage({
                id: 'CUST-5056',
                name: 'Nguyễn Thị Hương',
                phone: '0766311313',
                lastContactText: 'Sinh nhật'
              })}
              className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold active:scale-95 transition-transform shrink-0 flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Chúc ngay
            </button>
          </div>
        </div>

        {/* Feed Posts */}
        <div className="flex flex-col">
          {MOCK_POSTS.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {/* End of feed message */}
          <div className="py-8 text-center text-slate-400">
            <p className="text-[13px]">Bạn đã xem hết tin mới</p>
          </div>
        </div>
      </div>

      {/* ── POST ACTION MENU ── */}
      {isPostMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl pb-8 pt-2 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
            <div className="px-5 space-y-4">
              <h3 className="text-[18px] font-black text-slate-900 mb-2">Tạo bài viết mới</h3>
              <button 
                onClick={() => { setIsPostMenuOpen(false); /* Focus on normal post */ }}
                className="w-full flex items-center gap-4 bg-slate-50 p-4 rounded-2xl active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-[#544CDE]">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-[15px] font-bold text-slate-900">Đăng lên bảng tin CELLA</h4>
                  <p className="text-[12px] text-slate-500">Chia sẻ với cộng đồng và nhân viên nội bộ</p>
                </div>
              </button>

              <button 
                onClick={() => {
                  setIsPostMenuOpen(false);
                  setIsMultiPlatformOpen(true);
                }}
                className="w-full flex items-center gap-4 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-2xl active:scale-95 transition-transform border border-indigo-100"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#544CDE] to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Share2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-[15px] font-bold text-[#544CDE]">Đăng đa nền tảng (API)</h4>
                  <p className="text-[12px] text-slate-600">Đồng bộ lên Facebook, Tiktok, Instagram...</p>
                </div>
              </button>
            </div>
          </div>
          {/* Click outside to close */}
          <div className="absolute inset-0 z-[-1]" onClick={() => setIsPostMenuOpen(false)} />
        </div>
      )}

      {/* ── MULTI-PLATFORM (API UPLOADS) MODAL ── */}
      {isMultiPlatformOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-slate-900 to-[#1e1b4b] px-4 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMultiPlatformOpen(false)} className="w-8 h-8 flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-[16px] font-bold">Quản lý đăng bài (Uploads.bot)</h2>
            </div>
            <button 
              onClick={() => {
                alert('Đang gọi API Uploads.bot...');
                setIsMultiPlatformOpen(false);
              }}
              className="bg-indigo-500 hover:bg-indigo-600 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors"
            >
              Đăng ngay
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#0f172a] text-slate-300 p-4 space-y-6 pb-24">
            {/* Platforms */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
              <h3 className="text-white font-bold mb-3 text-[15px]">Chọn nền tảng đăng bài</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-blue-500" />
                    <span className="text-[13px] font-medium text-white">FB Fanpage</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-indigo-500" defaultChecked />
                </label>
                <label className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-2">
                    <PlaySquare className="w-5 h-5 text-blue-400" />
                    <span className="text-[13px] font-medium text-white">FB Reels</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-indigo-500" defaultChecked />
                </label>
                <label className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <span className="text-[13px] font-medium text-white">Instagram</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-indigo-500" defaultChecked />
                </label>
                <label className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.69 4.46-2.15 6.24-1.46 1.78-3.55 2.89-5.89 3.15-2.33.26-4.71-.25-6.57-1.57-1.85-1.32-3-3.41-3.32-5.69-.32-2.28.14-4.64 1.34-6.52 1.2-1.89 3.19-3.23 5.37-3.72 2.18-.49 4.51-.23 6.44.88v4.19c-1.35-.91-3.08-1.21-4.66-.78-1.58.43-2.9 1.57-3.6 3.03-.7 1.46-.74 3.17-.07 4.67.67 1.5 1.95 2.65 3.49 3.13 1.54.49 3.26.23 4.58-.69 1.32-.93 2.15-2.43 2.3-4.04.05-1.43.05-2.86.04-4.29-1.54 1.15-3.41 1.66-5.32 1.83V5.55c1.47-.07 2.93-.41 4.28-1.04.6-.28 1.17-.61 1.72-.98.01-1.17.02-2.34 0-3.51z"/>
                    </svg>
                    <span className="text-[13px] font-medium text-white">TikTok</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-indigo-500" />
                </label>
                <label className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors col-span-2">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="text-[13px] font-medium text-white">YouTube Shorts</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-indigo-500" />
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
              <h3 className="text-white font-bold mb-3 text-[15px]">Nội dung bài viết</h3>
              <textarea 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[100px]"
                placeholder="Nhập nội dung bài viết, hashtag..."
              ></textarea>
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button className="w-24 h-24 shrink-0 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[11px] text-center px-1">Ảnh / Video</span>
                </button>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-bold text-[15px]">Hẹn lịch đăng</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-slate-400 mb-1.5 block">Ngày đăng</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-slate-400 mb-1.5 block">Giờ đăng</label>
                  <input 
                    type="time"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
