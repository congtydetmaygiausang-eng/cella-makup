import React, { useState } from 'react';
import { Customer } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Check, UserPlus, Music, Facebook, Share2, Phone, UserCircle2, Calendar } from 'lucide-react';

interface CreateCustomerScreenProps {
  onBack: () => void;
  onSave: (customer: Partial<Customer>) => void;
}

export const CreateCustomerScreen: React.FC<CreateCustomerScreenProps> = ({
  onBack,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Nữ' | 'Nam' | 'Khác'>('Nữ');
  const [source, setSource] = useState<Customer['source']>('TIKTOK');
  const [status, setStatus] = useState<Customer['status']>('LEAD');
  
  const sources: { id: Customer['source']; label: string; icon?: React.ElementType }[] = [
    { id: 'TIKTOK', label: 'TikTok', icon: Music },
    { id: 'FACEBOOK', label: 'Facebook' },
    { id: 'REFERRAL', label: 'Giới thiệu' },
    { id: 'HOTLINE', label: 'Hotline' },
    { id: 'WALK_IN', label: 'Vãng lai' },
  ];

  const statuses: { id: Customer['status']; label: string; color: string }[] = [
    { id: 'LEAD', label: 'Lead mới', color: 'emerald' },
    { id: 'CONSULTING', label: 'Đang tư vấn', color: 'amber' },
    { id: 'VIP', label: 'Tiềm năng cao', color: 'purple' },
    { id: 'BOOKED', label: 'Hẹn tư vấn', color: 'blue' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại khách hàng!');
      return;
    }

    const newCust: Partial<Customer> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source,
      status,
      vipTier: status === 'VIP' ? 'VIP 1' : 'Thành viên mới',
      lastContactText: 'Vừa tạo',
      totalSpent: 0,
      contactCount: 1,
      skinProfile: {
        skinType: 'COMBINATION',
        undertone: 'WARM',
        faceShape: 'OVAL',
        notes: '',
      },
      notesHistory: [],
    };

    onSave(newCust);
  };

  return (
    <div className="min-h-full bg-[#F8F9FA] pb-24 text-slate-900 animate-in fade-in duration-300">
      <MobileHeader
        showBack
        onBack={onBack}
        title="Thêm mới khách hàng"
        subtitle="Hệ thống quản lý CELLA"
        rightAction={
          <button
            onClick={() => handleSubmit()}
            className="text-[14px] font-black text-[#544CDE] px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Lưu
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="px-4 pt-4 space-y-5">
        {/* THÔNG TIN CƠ BẢN */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-5 rounded-full bg-[#544CDE]"></div>
            <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-wider">
              THÔNG TIN CƠ BẢN
            </h3>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
              Họ và tên khách hàng <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 stroke-[2]" />
              <input
                type="text"
                placeholder="Nhập họ và tên..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE] focus:ring-1 focus:ring-[#544CDE] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 stroke-[2]" />
              <input
                type="tel"
                placeholder="090... hoặc 098..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE] focus:ring-1 focus:ring-[#544CDE] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
              Email liên hệ
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 flex items-center justify-center font-bold">@</div>
              <input
                type="email"
                placeholder="nguyenvana@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE] focus:ring-1 focus:ring-[#544CDE] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
                Ngày sinh
              </label>
              <div className="relative">
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 stroke-[2]" />
                <input
                  type="text"
                  placeholder="05/12/1998"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#544CDE]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">
                Giới tính
              </label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 h-11">
                {(['Nữ', 'Nam', 'Khác'] as const).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 rounded-lg text-[13px] font-bold transition-all ${
                      gender === g
                        ? 'bg-[#544CDE] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NGUỒN & TRẠNG THÁI LEAD */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-5 rounded-full bg-emerald-500"></div>
            <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-wider">
              NGUỒN & TRẠNG THÁI LEAD
            </h3>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2.5">
              Nguồn tiếp cận
            </label>
            <div className="flex flex-wrap gap-2.5">
              {sources.map((src) => {
                const isActive = source === src.id;
                const Icon = src.icon;
                return (
                  <button
                    type="button"
                    key={src.id}
                    onClick={() => setSource(src.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 text-[#544CDE]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#544CDE]' : 'text-slate-400'}`} />}
                    {src.label}
                    {isActive && <Check className="w-3.5 h-3.5 text-[#544CDE] ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2.5">
              Trạng thái ban đầu
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statuses.map((st) => {
                const isActive = status === st.id;
                const colorMap: Record<string, string> = {
                  emerald: 'bg-emerald-500',
                  amber: 'bg-amber-500',
                  purple: 'bg-[#544CDE]',
                  blue: 'bg-blue-500',
                };
                return (
                  <button
                    type="button"
                    key={st.id}
                    onClick={() => setStatus(st.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all border ${
                      isActive
                        ? `bg-${st.color}-50 border-${st.color}-300 text-slate-900`
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${colorMap[st.color]}`}></span>
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Bottom Button Area */}
      <div className="fixed bottom-[80px] inset-x-0 p-4 pb-2 bg-gradient-to-t from-[#F8F9FA] to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={() => handleSubmit()}
            className="w-full h-14 bg-[#544CDE] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] shadow-lg shadow-indigo-500/30 hover:bg-[#4338ca] active:scale-[0.98] transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Tạo khách hàng mới
          </button>
        </div>
      </div>
    </div>
  );
};
