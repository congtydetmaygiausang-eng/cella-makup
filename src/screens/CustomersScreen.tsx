import React, { useState } from 'react';
import { Customer, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  UserCheck,
  ChevronRight,
  UserPlus,
} from 'lucide-react';

interface CustomersScreenProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onNavigate: (screen: ScreenId) => void;
  onQuickCall: (customer: Customer) => void;
  onQuickMessage: (customer: Customer) => void;
  onBack?: () => void;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  customers,
  onSelectCustomer,
  onNavigate,
  onQuickCall,
  onQuickMessage,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const filterTabs = [
    { id: 'ALL', label: 'Tất cả (128)' },
    { id: 'LEAD', label: 'Lead mới (25)' },
    { id: 'CONSULTING', label: 'Đang tư vấn (42)' },
    { id: 'BOOKED', label: 'Đặt lịch (18)' },
    { id: 'VIP', label: 'VIP (35)' },
  ];

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.source && c.source.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'ALL') return matchSearch;
    return matchSearch && c.status === activeTab;
  });

  return (
    <div className="min-h-full bg-transparent pb-32 text-slate-900 relative">
      {/* Header with Circular Floating Back Button */}
      <MobileHeader
        title="Khách hàng"
        subtitle="Quản lý phễu khách hàng CELLA"
        showBack={false}
        onMenuClick={() => onNavigate('more')}
        rightAction={
          <button
            onClick={() => onNavigate('create_customer')}
            className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-[#00A3FF] flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
            title="Thêm khách"
          >
            <UserPlus className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Capsule Search Bar with frosted white style */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Tìm tên, SĐT, nguồn khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-xs text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/40 placeholder:text-slate-400"
          />
        </div>

        {/* Segmented Filter Pills matching reference controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-[#00A3FF] text-white shadow-xs'
                    : 'bg-white/80 text-slate-600 border border-white/90 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Customer Cards List */}
        <div className="space-y-2.5 pt-1">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 card-pastel p-6">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Không tìm thấy khách hàng</p>
              <p className="text-xs text-slate-400 mt-0.5">Thử đổi từ khóa hoặc bộ lọc trạng thái</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => onSelectCustomer(customer)}
                className="card-pastel-interactive p-4 flex items-center justify-between gap-3 cursor-pointer"
              >
                {/* Avatar & Main Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#00A3FF] font-bold text-sm flex items-center justify-center shrink-0 border border-sky-100">
                    {customer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(-2)
                      .join('')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {customer.name}
                      </h3>
                      {customer.vipTier && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80">
                          {customer.vipTier}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {customer.phone}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-1">
                      <span className="text-[#00A3FF] font-bold">
                        {customer.status === 'LEAD'
                          ? 'Lead mới'
                          : customer.status === 'CONSULTING'
                          ? 'Đang tư vấn'
                          : customer.status === 'BOOKED'
                          ? 'Đặt lịch'
                          : customer.status === 'VIP'
                          ? 'VIP'
                          : 'Chăm sóc lại'}
                      </span>
                      <span>•</span>
                      <span>{customer.source}</span>
                      <span>•</span>
                      <span>{customer.lastContactText || 'Hôm nay'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action circular buttons */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onQuickCall(customer)}
                    className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-90 flex items-center justify-center transition-all border border-emerald-100"
                    title={`Gọi ${customer.name}`}
                  >
                    <Phone className="w-3.5 h-3.5 stroke-[2.4]" />
                  </button>
                  <button
                    onClick={() => onQuickMessage(customer)}
                    className="w-8 h-8 rounded-full bg-sky-50 text-[#00A3FF] hover:bg-sky-100 active:scale-90 flex items-center justify-center transition-all border border-sky-100"
                    title={`Nhắn Zalo / SMS ${customer.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 stroke-[2.4]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (+) with Cyan Gradient */}
      <button
        id="btn-create-customer-fab"
        onClick={() => onNavigate('create_customer')}
        className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-[#00A3FF] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,163,255,0.4)] hover:brightness-105 active:scale-90 transition-all z-20"
        title="Thêm khách hàng mới"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
