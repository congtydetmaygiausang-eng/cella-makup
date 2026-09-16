import React from 'react';
import { Image, Tag, MapPin, Smile } from 'lucide-react';
import { Staff } from '../../types';

interface CreatePostInputProps {
  currentUser: Staff;
}

export const CreatePostInput: React.FC<CreatePostInputProps> = ({ currentUser }) => {
  return (
    <div className="bg-white px-4 py-3 border-b border-slate-100/60 shadow-xs mb-2">
      <div className="flex items-center gap-3">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.fullName}
          className="w-10 h-10 rounded-full object-cover border border-slate-100"
        />
        <button className="flex-1 bg-slate-100 hover:bg-slate-200/80 transition-colors rounded-full px-4 py-2.5 text-left text-[14px] text-slate-500">
          Hôm nay bạn thế nào?
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3 px-1 border-t border-slate-50 pt-2">
        <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors">
          <Image className="w-5 h-5 text-emerald-500" />
          <span className="text-[13px] font-medium hidden sm:inline">Ảnh/Video</span>
        </button>
        <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors">
          <Tag className="w-5 h-5 text-sky-500" />
          <span className="text-[13px] font-medium hidden sm:inline">Gắn thẻ</span>
        </button>
        <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors">
          <Smile className="w-5 h-5 text-amber-500" />
          <span className="text-[13px] font-medium hidden sm:inline">Cảm xúc</span>
        </button>
        <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors">
          <MapPin className="w-5 h-5 text-rose-500" />
          <span className="text-[13px] font-medium hidden sm:inline">Check-in</span>
        </button>
      </div>
    </div>
  );
};
