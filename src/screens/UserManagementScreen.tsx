import React, { useState, useEffect } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import { supabase } from '../config/supabase';
import {
  Users, UserCheck, Shield, ShieldAlert, Award, Search,
  Filter, Plus, RefreshCw, Key, MoreVertical, CheckCircle2,
  XCircle, Crown, Sparkles, Mail, Phone, Calendar,
  Lock, Unlock, Edit3, Trash2, ChevronRight, UserPlus
} from 'lucide-react';

interface UserManagementScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  currentUser?: Staff;
}

export interface UserAccountProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  branch_studio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
}) => {
  const [users, setUsers] = useState<UserAccountProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserAccountProfile | null>(null);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>('CUSTOMER');
  const [newAccount, setNewAccount] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    branch: '37–39 Phan Bội Châu, TP. Thái Bình',
  });
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch all user accounts from Supabase profiles
  const fetchUsers = async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) setIsLoading(true);
      else setIsRefreshing(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles from Supabase:', error);
      } else if (data) {
        setUsers(data as UserAccountProfile[]);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);

    // Kích hoạt Realtime Channel lắng nghe tài khoản vừa đăng ký mới
    const channel = supabase
      .channel('realtime:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as UserAccountProfile;
            setUsers((prev) => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
            setStatusMessage({
              text: `Tài khoản mới vừa đăng ký: ${newUser.full_name || newUser.email || 'Người dùng mới'}`,
              type: 'success',
            });
            setTimeout(() => setStatusMessage(null), 5000);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as UserAccountProfile;
            setUsers((prev) => prev.map(u => (u.id === updated.id ? updated : u)));
          } else if (payload.eventType === 'DELETE') {
            const oldUser = payload.old as { id: string };
            setUsers((prev) => prev.filter(u => u.id !== oldUser.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update role in Supabase
  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', selectedUser.id);

      if (error) throw error;

      setUsers((prev) =>
        prev.map(u => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
      );
      setIsChangeRoleModalOpen(false);
      setStatusMessage({ text: `Đã cập nhật vai trò thành công cho ${selectedUser.full_name}!`, type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Update role error:', err);
      alert('Không thể cập nhật vai trò: ' + err.message);
    }
  };

  // Toggle active / lock status
  const handleToggleActive = async (user: UserAccountProfile) => {
    const nextStatus = !user.is_active;
    const confirmText = nextStatus
      ? `Mở khóa tài khoản cho ${user.full_name}?`
      : `Bạn có chắc chắn muốn TẠM KHÓA tài khoản ${user.full_name}?`;

    if (!window.confirm(confirmText)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setUsers((prev) =>
        prev.map(u => (u.id === user.id ? { ...u, is_active: nextStatus } : u))
      );
      setStatusMessage({
        text: `Đã ${nextStatus ? 'mở khóa' : 'tạm khóa'} tài khoản ${user.full_name}!`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Toggle active error:', err);
      alert('Lỗi cập nhật trạng thái: ' + err.message);
    }
  };

  // Quick create new user
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.fullName.trim()) {
      alert('Vui lòng nhập họ và tên');
      return;
    }

    try {
      const newId = crypto.randomUUID();
      const newRecord: UserAccountProfile = {
        id: newId,
        full_name: newAccount.fullName.trim(),
        email: newAccount.email.trim() || null,
        phone: newAccount.phone.trim() || null,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: newAccount.role,
        branch_studio: newAccount.branch,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').insert([newRecord]);
      if (error) throw error;

      setUsers((prev) => [newRecord, ...prev]);
      setIsCreateModalOpen(false);
      setNewAccount({
        fullName: '',
        email: '',
        phone: '',
        role: 'CUSTOMER',
        branch: '37–39 Phan Bội Châu, TP. Thái Bình',
      });
      setStatusMessage({ text: 'Đã thêm tài khoản mới vào hệ thống thành công!', type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Create account error:', err);
      alert('Lỗi khi thêm tài khoản: ' + err.message);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q));

    const matchRole =
      selectedRoleFilter === 'ALL' ||
      (selectedRoleFilter === 'ADMINS' && ['SUPER_ADMIN', 'ADMIN'].includes(u.role)) ||
      (selectedRoleFilter === 'ARTISTS' && ['MASTER_ARTIST', 'ARTIST', 'ACADEMY_TRAINER'].includes(u.role)) ||
      (selectedRoleFilter === 'CUSTOMERS' && u.role === 'CUSTOMER');

    return matchSearch && matchRole;
  });

  // Calculate metrics
  const totalUsers = users.length;
  const adminCount = users.filter(u => ['SUPER_ADMIN', 'ADMIN'].includes(u.role)).length;
  const artistCount = users.filter(u => ['MASTER_ARTIST', 'ARTIST', 'ACADEMY_TRAINER'].includes(u.role)).length;
  const customerCount = users.filter(u => u.role === 'CUSTOMER').length;

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-900 border border-amber-400">
            <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
            SUPER ADMIN
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300">
            <Shield className="w-3 h-3 text-purple-600" />
            ADMIN
          </span>
        );
      case 'MASTER_ARTIST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            MASTER ARTIST
          </span>
        );
      case 'ARTIST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <Award className="w-3 h-3 text-rose-600" />
            ARTIST
          </span>
        );
      case 'ACADEMY_TRAINER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            TRAINER
          </span>
        );
      case 'SALES_CONSULTANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            SALES
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200">
            HỘI VIÊN / KHÁCH
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 text-slate-800 animate-in fade-in duration-300 select-none">
      {/* ── HEADER ── */}
      <MobileHeader
        title="Quản lý tài khoản"
        subtitle="HỆ THỐNG SUPABASE REALTIME"
        showBack={true}
        onBack={onBack}
        rightAction={
          <button
            onClick={() => fetchUsers(false)}
            disabled={isRefreshing}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 hover:text-amber-700 hover:border-amber-400 transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-5 space-y-4">
        {/* ── REALTIME STATUS NOTIFICATION ── */}
        {statusMessage && (
          <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-2">✕</button>
          </div>
        )}

        {/* ── LIVE CONNECTION BANNER ── */}
        <div className="bg-gradient-to-r from-slate-900 to-[#18181B] text-white p-4 sm:p-5 rounded-3xl border border-amber-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Supabase Realtime Live
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Tài Khoản Đăng Ký Tự Động Lưu Về Đây
            </h2>
            <p className="text-xs text-slate-300">
              Bất kỳ khi nào có thành viên hoặc khách hàng đăng ký trên ứng dụng, tài khoản sẽ lập tức xuất hiện ngay lập tức trong bảng này.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#C9A24B] hover:bg-[#E7C975] text-slate-950 font-black text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </div>

        {/* ── 4 STAT METRICS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tổng tài khoản</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {totalUsers}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tất cả tài khoản</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Quản trị viên</span>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
              {adminCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Super Admin & Admin</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Chuyên viên</span>
              <Award className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-700 mt-1">
              {artistCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Artist & Giảng viên</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Hội viên / Khách</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              {customerCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Thành viên đăng ký</div>
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, số điện thoại hoặc vai trò..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {[
                { id: 'ALL', label: `Tất cả (${users.length})` },
                { id: 'ADMINS', label: `Quản trị (${adminCount})` },
                { id: 'ARTISTS', label: `Artist (${artistCount})` },
                { id: 'CUSTOMERS', label: `Khách hàng (${customerCount})` },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedRoleFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedRoleFilter === f.id
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACCOUNTS LIST ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Danh sách tài khoản ({filteredUsers.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Đồng bộ Supabase Database
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Đang tải danh sách tài khoản từ Supabase...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Chưa có tài khoản phù hợp</h4>
              <p className="text-xs text-slate-400">Thử tìm kiếm với từ khóa khác hoặc bấm nút thêm tài khoản.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isSuper = u.role === 'SUPER_ADMIN';
                const createdDateStr = u.created_at
                  ? new Date(u.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Chưa rõ';

                return (
                  <div
                    key={u.id}
                    className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="relative">
                        <img
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={u.full_name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            u.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          title={u.is_active ? 'Đang hoạt động' : 'Tài khoản bị khóa'}
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {u.full_name || 'Chưa cập nhật tên'}
                          </h4>
                          {renderRoleBadge(u.role)}
                          {!u.is_active && (
                            <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                              ĐÃ KHÓA
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                          {u.email && (
                            <span className="flex items-center gap-1 font-mono">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {u.email}
                            </span>
                          )}
                          {u.phone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {u.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3 text-slate-300" />
                            Đăng ký: {createdDateStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewRole(u.role);
                          setIsChangeRoleModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Đổi vai trò / phân quyền"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-600" />
                        <span>Phân quyền</span>
                      </button>

                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          u.is_active
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                        }`}
                        title={u.is_active ? 'Khóa tài khoản này' : 'Mở khóa tài khoản'}
                      >
                        {u.is_active ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: PHÂN QUYỀN VAI TRÒ (CHANGE ROLE MODAL) ── */}
      {isChangeRoleModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsChangeRoleModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Phân Quyền Vai Trò Tài Khoản
                </h3>
              </div>
              <button
                onClick={() => setIsChangeRoleModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">
                Đang thay đổi quyền cho:
              </span>
              <h4 className="text-sm font-black text-slate-900">{selectedUser.full_name}</h4>
              <p className="text-xs text-slate-600 font-mono">{selectedUser.email || selectedUser.phone || 'Không có email'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Chọn vai trò mới:
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'SUPER_ADMIN', label: 'SUPER ADMIN (Quản trị viên tối cao)', desc: 'Toàn quyền cấu hình, xóa sửa database' },
                  { id: 'ADMIN', label: 'ADMIN (Quản trị viên cơ sở)', desc: 'Quản lý lịch hẹn, nhân sự, doanh thu' },
                  { id: 'MASTER_ARTIST', label: 'MASTER ARTIST (Nghệ sĩ trưởng)', desc: 'Phụ trách chuyên môn makeup và layout VIP' },
                  { id: 'ARTIST', label: 'ARTIST (Kỹ thuật viên trang điểm)', desc: 'Thực hiện dịch vụ khách hàng' },
                  { id: 'ACADEMY_TRAINER', label: 'ACADEMY TRAINER (Giảng viên)', desc: 'Đào tạo học viên, chấm điểm tay nghề' },
                  { id: 'SALES_CONSULTANT', label: 'SALES CONSULTANT (Tư vấn viên)', desc: 'Chăm sóc khách hàng, chốt lịch hẹn' },
                  { id: 'CUSTOMER', label: 'CUSTOMER (Hội viên / Khách hàng)', desc: 'Xem lookbook, đặt lịch hẹn, đăng ký học' },
                ].map(r => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      newRole === r.id
                        ? 'border-amber-500 bg-amber-50/80 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value={r.id}
                      checked={newRole === r.id}
                      onChange={() => setNewRole(r.id)}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{r.label}</span>
                      <span className="text-[11px] text-slate-500">{r.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsChangeRoleModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="flex-1 py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#E7C975] text-slate-950 font-black text-xs transition-colors shadow-xs"
              >
                Lưu quyền mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: THÊM TÀI KHOẢN MỚI ── */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <form
            onSubmit={handleCreateAccount}
            className="relative max-w-md w-full bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Thêm Tài Khoản Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  value={newAccount.fullName}
                  onChange={(e) => setNewAccount({ ...newAccount, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email đăng nhập
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="096 116 1994"
                  value={newAccount.phone}
                  onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Vai trò phân quyền
                </label>
                <select
                  value={newAccount.role}
                  onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value="CUSTOMER">CUSTOMER (Hội viên / Khách hàng)</option>
                  <option value="ARTIST">ARTIST (Kỹ thuật viên Makeup)</option>
                  <option value="MASTER_ARTIST">MASTER ARTIST (Nghệ sĩ trưởng)</option>
                  <option value="ACADEMY_TRAINER">ACADEMY TRAINER (Giảng viên)</option>
                  <option value="SALES_CONSULTANT">SALES CONSULTANT (Tư vấn viên)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Quản trị tối cao)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Chi nhánh / Cơ sở
                </label>
                <input
                  type="text"
                  value={newAccount.branch}
                  onChange={(e) => setNewAccount({ ...newAccount, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#E7C975] text-slate-950 font-black text-xs transition-colors shadow-xs"
              >
                Thêm tài khoản
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
