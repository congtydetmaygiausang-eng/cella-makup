import React from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { MOCK_POSTS } from '../data/mockPosts';
import { CreatePostInput } from '../components/newsfeed/CreatePostInput';
import { PostCard } from '../components/newsfeed/PostCard';
import { Search, Sparkles, UserPlus, CalendarPlus } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: Staff;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  currentUser,
  onToggleMenu,
  isMenuOpen = false,
}) => {
  const user = currentUser || CURRENT_USER;

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
        </div>

        {/* Create Post Input */}
        <CreatePostInput currentUser={user} />

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
    </div>
  );
};
