import React, { useState } from 'react';
import { Customer, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  UserCheck,
  UserPlus,
  Users,
  Crown,
  TrendingUp,
  Sparkles,
  Filter,
  ChevronDown,
} from 'lucide-react';

interface CustomersScreenProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onNavigate: (screen: ScreenId) => void;
  onQuickCall: (customer: Customer) => void;
  onQuickMessage: (customer: Customer) => void;
  onBack?: () => void;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  TIKTOK: { label: 'TikTok', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  FACEBOOK: { label: 'Facebook', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  ZALO: { label: 'Zalo', color: 'bg-sky-50 text-sky-600 border-sky-100' },
  REFERRAL: { label: 'Giới thiệu', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  HOTLINE: { label: 'Hotline', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  WALK_IN: { label: 'Walk-in', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  WEBSITE: { label: 'Website', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
};

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  customers,
  onSelectCustomer,
  onNavigate,
  onQuickCall,
  onQuickMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [activeSource, setActiveSource] = useState<string>('ALL');
  const [showSourceFilter, setShowSourceFilter] = useState(false);

  const statusTabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'LEAD', label: '🔥 Lead mới' },
    { id: 'CONSULTING', label: '💬 Tư vấn' },
    { id: 'BOOKED', label: '📅 Đặt lịch' },
    { id: 'VIP', label: '👑 VIP' },
    { id: 'RE_CARE', label: '🔄 Chăm sóc lại' },
  ];

  const sourceTabs = [
    { id: 'ALL', label: 'Tất cả nguồn' },
    { id: 'TIKTOK', label: 'TikTok' },
    { id: 'FACEBOOK', label: 'Facebook' },
    { id: 'ZALO', label: 'Zalo' },
    { id: 'REFERRAL', label: 'Giới thiệu' },
    { id: 'HOTLINE', label: 'Hotline' },
    { id: 'WALK_IN', label: 'Walk-in' },
  ];

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.source && c.source.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = activeStatus === 'ALL' || c.status === activeStatus;
    const matchSource = activeSource === 'ALL' || c.source === activeSource;
    return matchSearch && matchStatus && matchSource;
  });

  // Stats
  const totalVIP = customers.filter((c) => c.status === 'VIP').length;
  const totalLead = customers.filter((c) => c.status === 'LEAD').length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
    return `${n}đ`;
  };

  return (
    <div className="min-h-full bg-transparent pb-32 text-slate-900 relative">
      <MobileHeader
        title="Khách hàng"
        subtitle="Quản lý phễu CRM CELLA"
        showBack={false}
        onMenuClick={() => onNavigate('more')}
        rightAction={
          <button
            onClick={() => onNavigate('create_customer')}
            className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-[#00A3FF] flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
            title="Thêm khách"
          >
            <UserPlus className="w-4 h-4 stroke-[2.2]" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3">
        {/* Stats mini bar */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Users className="w-3.5 h-3.5" />, label: 'Tổng KH', value: `${customers.length}`, color: 'text-[#00A3FF] bg-sky-50 border-sky-100' },
            { icon: <Crown className="w-3.5 h-3.5" />, label: 'VIP', value: `${totalVIP}`, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Doanh thu', value: formatCurrency(totalRevenue), color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl border p-2.5 flex flex-col gap-0.5 ${stat.color}`}>
              <div className="flex items-center gap-1 opacity-70">
                {stat.icon}
                <span className="text-[9px] font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-base font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Tìm tên, SĐT, nguồn khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-xs text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/40 placeholder:text-slate-400"
          />
          <button
            onClick={() => setShowSourceFilter((p) => !p)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${showSourceFilter ? 'bg-[#00A3FF] text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Filter className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Source filter (collapsible) */}
        {showSourceFilter && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 animate-fade-in">
            {sourceTabs.map((tab) => {
              const isActive = activeSource === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSource(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all select-none ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-white/80 text-slate-500 border border-white/90 hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
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

        {/* Result count */}
        <p className="text-[11px] font-semibold text-slate-400 px-1">
          {filteredCustomers.length} khách hàng
          {activeSource !== 'ALL' && <span className="text-violet-500 ml-1">• {sourceTabs.find(s => s.id === activeSource)?.label}</span>}
        </p>

        {/* Customer Cards List */}
        <div className="space-y-2 pt-0.5">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 card-pastel p-6">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Không tìm thấy khách hàng</p>
              <p className="text-xs text-slate-400 mt-0.5">Thử đổi từ khóa hoặc bộ lọc trạng thái</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => {
              const srcInfo = SOURCE_LABELS[customer.source] || { label: customer.source, color: 'bg-slate-50 text-slate-500 border-slate-200' };
              return (
                <div
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="card-pastel-interactive p-3.5 flex items-center justify-between gap-3 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-[#00A3FF] font-black text-sm flex items-center justify-center shrink-0 border border-sky-100">
                    {customer.name.split(' ').map((n) => n[0]).slice(-2).join('')}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 truncate">{customer.name}</h3>
                      {customer.vipTier && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80 shrink-0">
                          {customer.vipTier}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{customer.phone}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${srcInfo.color}`}>
                        {srcInfo.label}
                      </span>
                      {customer.totalSpent && customer.totalSpent > 0 && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{customer.lastContactText || 'Hôm nay'}</span>
                    </div>
                  </div>

                  {/* CRM Stage dot */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                      customer.status === 'VIP' ? 'bg-amber-100 text-amber-700' :
                      customer.status === 'BOOKED' ? 'bg-emerald-100 text-emerald-700' :
                      customer.status === 'CONSULTING' ? 'bg-blue-100 text-blue-700' :
                      customer.status === 'LEAD' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status === 'LEAD' ? 'Lead' :
                       customer.status === 'CONSULTING' ? 'Tư vấn' :
                       customer.status === 'BOOKED' ? 'Đặt lịch' :
                       customer.status === 'VIP' ? 'VIP' : 'Re-care'}
                    </span>
                    {/* Quick Actions */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onQuickCall(customer)}
                        className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 active:scale-90 flex items-center justify-center transition-all border border-emerald-100"
                      >
                        <Phone className="w-3 h-3 stroke-[2.4]" />
                      </button>
                      <button
                        onClick={() => onQuickMessage(customer)}
                        className="w-7 h-7 rounded-full bg-sky-50 text-[#00A3FF] hover:bg-sky-100 active:scale-90 flex items-center justify-center transition-all border border-sky-100"
                      >
                        <MessageCircle className="w-3 h-3 stroke-[2.4]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button */}
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
