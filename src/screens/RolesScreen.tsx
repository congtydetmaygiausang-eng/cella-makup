import React, { useState } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId } from '../types';
import {
  Shield, ChevronDown, ChevronUp, Check, X,
  Users, Eye, Edit3, Trash2, Crown, UserCog,
  Lock, Unlock, Info,
} from 'lucide-react';

interface RolesScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
}

type Permission = 'view' | 'edit' | 'delete';
type Module =
  | 'customers'
  | 'bookings'
  | 'tasks'
  | 'revenue'
  | 'hr'
  | 'academy'
  | 'roles'
  | 'ai';

const MODULE_META: Record<Module, { label: string; icon: string; desc: string }> = {
  customers: { label: 'Khách hàng (CRM)', icon: '👥', desc: 'Danh sách, chi tiết, lịch sử khách' },
  bookings:  { label: 'Lịch hẹn & Dịch vụ', icon: '📅', desc: 'Tạo, sửa, hủy lịch hẹn' },
  tasks:     { label: 'Công việc & Nhắc nhở', icon: '✅', desc: 'Giao việc và theo dõi trạng thái' },
  revenue:   { label: 'Doanh thu & Báo cáo', icon: '📊', desc: 'Số liệu tài chính, KPI' },
  hr:        { label: 'Nhân sự & Lương', icon: '💼', desc: 'Chấm công, lương, thưởng' },
  academy:   { label: 'Học viện CELLA', icon: '🎓', desc: 'Khoá học, học viên, giảng viên' },
  roles:     { label: 'Phân quyền hệ thống', icon: '🔐', desc: 'Quản lý vai trò & tài khoản' },
  ai:        { label: 'Trợ lý AI CELLA', icon: '🤖', desc: 'CELLA AI chat & phân tích' },
};

const ROLES = [
  {
    id: 'SUPER_ADMIN',
    label: 'Super Admin',
    desc: 'Toàn quyền hệ thống CELLA',
    color: 'from-red-500 to-rose-600',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    icon: '👑',
    count: 1,
    permissions: {
      customers: ['view', 'edit', 'delete'],
      bookings:  ['view', 'edit', 'delete'],
      tasks:     ['view', 'edit', 'delete'],
      revenue:   ['view', 'edit', 'delete'],
      hr:        ['view', 'edit', 'delete'],
      academy:   ['view', 'edit', 'delete'],
      roles:     ['view', 'edit', 'delete'],
      ai:        ['view', 'edit', 'delete'],
    } as Record<Module, Permission[]>,
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    desc: 'Quản trị viên chi nhánh',
    color: 'from-orange-400 to-amber-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: '🛡️',
    count: 2,
    permissions: {
      customers: ['view', 'edit', 'delete'],
      bookings:  ['view', 'edit', 'delete'],
      tasks:     ['view', 'edit', 'delete'],
      revenue:   ['view', 'edit'],
      hr:        ['view', 'edit'],
      academy:   ['view', 'edit'],
      roles:     ['view'],
      ai:        ['view', 'edit'],
    } as Record<Module, Permission[]>,
  },
  {
    id: 'MASTER_ARTIST',
    label: 'Master Trainer',
    desc: 'Nghệ nhân cấp cao & đào tạo',
    color: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-700',
    bgColor: 'bg-violet-50 border-violet-200',
    icon: '⭐',
    count: 3,
    permissions: {
      customers: ['view', 'edit'],
      bookings:  ['view', 'edit'],
      tasks:     ['view', 'edit'],
      revenue:   ['view'],
      hr:        ['view'],
      academy:   ['view', 'edit'],
      roles:     [],
      ai:        ['view', 'edit'],
    } as Record<Module, Permission[]>,
  },
  {
    id: 'ARTIST',
    label: 'Makeup Artist',
    desc: 'Chuyên viên trang điểm',
    color: 'from-pink-500 to-rose-500',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200',
    icon: '💄',
    count: 8,
    permissions: {
      customers: ['view'],
      bookings:  ['view', 'edit'],
      tasks:     ['view', 'edit'],
      revenue:   [],
      hr:        ['view'],
      academy:   ['view'],
      roles:     [],
      ai:        ['view', 'edit'],
    } as Record<Module, Permission[]>,
  },
  {
    id: 'SALES_CONSULTANT',
    label: 'Sales & CRM',
    desc: 'Tư vấn viên tuyển sinh & CSKH',
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: '💬',
    count: 5,
    permissions: {
      customers: ['view', 'edit'],
      bookings:  ['view', 'edit'],
      tasks:     ['view', 'edit'],
      revenue:   ['view'],
      hr:        [],
      academy:   ['view'],
      roles:     [],
      ai:        ['view', 'edit'],
    } as Record<Module, Permission[]>,
  },
  {
    id: 'ACADEMY_TRAINER',
    label: 'Giảng viên TH',
    desc: 'Giảng viên thực hành Academy',
    color: 'from-teal-500 to-cyan-600',
    textColor: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    icon: '🎓',
    count: 4,
    permissions: {
      customers: [],
      bookings:  ['view'],
      tasks:     ['view', 'edit'],
      revenue:   [],
      hr:        ['view'],
      academy:   ['view', 'edit'],
      roles:     [],
      ai:        ['view'],
    } as Record<Module, Permission[]>,
  },
];

const PERM_META: Record<Permission, { label: string; icon: React.ReactNode; color: string }> = {
  view:   { label: 'Xem',    icon: <Eye className="w-3 h-3" />,    color: 'text-sky-600 bg-sky-50 border-sky-200' },
  edit:   { label: 'Sửa',    icon: <Edit3 className="w-3 h-3" />,  color: 'text-amber-600 bg-amber-50 border-amber-200' },
  delete: { label: 'Xoá',    icon: <Trash2 className="w-3 h-3" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
};

export const RolesScreen: React.FC<RolesScreenProps> = ({ onNavigate, onBack }) => {
  const [expandedRole, setExpandedRole] = useState<string | null>('SUPER_ADMIN');
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<string>('ARTIST');
  const [activeView, setActiveView] = useState<'cards' | 'matrix'>('cards');

  const matrixRole = ROLES.find((r) => r.id === selectedRoleForMatrix)!;
  const modules = Object.keys(MODULE_META) as Module[];

  return (
    <div className="min-h-full bg-slate-50 pb-28 text-slate-900">
      <MobileHeader
        title="Phân quyền Tài khoản"
        subtitle="Quản lý vai trò & quyền hạn"
        onBack={onBack}
        showBack={true}
      />

      {/* View switcher */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-[60px] z-20 shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('cards')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
              activeView === 'cards' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            🛡️ Vai trò
          </button>
          <button
            onClick={() => setActiveView('matrix')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
              activeView === 'matrix' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            🔐 Ma trận quyền
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* ── ROLES CARDS VIEW ── */}
        {activeView === 'cards' && (
          <div className="space-y-3 animate-fade-in">
            {/* Summary banner */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-violet-500/25">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black">Hệ thống phân quyền CELLA</h3>
                  <p className="text-[11px] opacity-80 mt-0.5">{ROLES.length} vai trò · {ROLES.reduce((s, r) => s + r.count, 0)} tài khoản</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {ROLES.map((r) => (
                  <div key={r.id} className="bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <span>{r.icon}</span><span>{r.count} NV</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Role cards */}
            {ROLES.map((role) => {
              const isOpen = expandedRole === role.id;
              const totalPerms = Object.values(role.permissions).flat().length;
              return (
                <div key={role.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${role.bgColor}`}>
                  {/* Role header */}
                  <button
                    onClick={() => setExpandedRole(isOpen ? null : role.id)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-lg shadow-sm`}>
                        {role.icon}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-black ${role.textColor}`}>{role.label}</p>
                          <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.5 rounded-full border border-current opacity-60">
                            {role.count} NV
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{role.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">{totalPerms} quyền</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded permissions */}
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3 animate-fade-in">
                      {modules.map((mod) => {
                        const perms = role.permissions[mod] || [];
                        const modMeta = MODULE_META[mod];
                        return (
                          <div key={mod} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm">{modMeta.icon}</span>
                              <div>
                                <p className="text-[11px] font-bold text-slate-800">{modMeta.label}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {perms.length === 0 ? (
                                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-0.5">
                                  <Lock className="w-3 h-3" /> Không có quyền
                                </span>
                              ) : (
                                (['view', 'edit', 'delete'] as Permission[]).map((p) => {
                                  const hasPerm = perms.includes(p);
                                  const meta = PERM_META[p];
                                  return (
                                    <span
                                      key={p}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex items-center gap-0.5 transition-all ${
                                        hasPerm ? meta.color : 'text-slate-300 bg-slate-50 border-slate-200 opacity-40'
                                      }`}
                                    >
                                      {meta.icon}
                                      {meta.label}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PERMISSION MATRIX VIEW ── */}
        {activeView === 'matrix' && (
          <div className="space-y-3 animate-fade-in">
            {/* Role selector */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Chọn vai trò để xem quyền hạn:</p>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleForMatrix(r.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-[11px] font-bold border transition-all shrink-0 ${
                      selectedRoleForMatrix === r.id
                        ? `${r.bgColor} ${r.textColor} shadow-sm`
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix title */}
            <div className={`rounded-2xl border p-4 ${matrixRole.bgColor}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${matrixRole.color} flex items-center justify-center text-lg shadow-sm`}>
                  {matrixRole.icon}
                </div>
                <div>
                  <p className={`text-sm font-black ${matrixRole.textColor}`}>{matrixRole.label}</p>
                  <p className="text-[11px] text-slate-500">{matrixRole.desc}</p>
                </div>
              </div>
            </div>

            {/* Permission matrix table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
                <div className="col-span-2 px-3 py-2.5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Module</p>
                </div>
                {(['view', 'edit', 'delete'] as Permission[]).map((p) => (
                  <div key={p} className="px-2 py-2.5 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{PERM_META[p].label}</p>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {modules.map((mod, i) => {
                const perms = matrixRole.permissions[mod] || [];
                const modMeta = MODULE_META[mod];
                return (
                  <div
                    key={mod}
                    className={`grid grid-cols-4 border-b border-slate-100 last:border-0 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <div className="col-span-2 px-3 py-3 flex items-center gap-2">
                      <span className="text-base">{modMeta.icon}</span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-tight">{modMeta.label}</p>
                        <p className="text-[9px] text-slate-400 leading-tight">{modMeta.desc}</p>
                      </div>
                    </div>
                    {(['view', 'edit', 'delete'] as Permission[]).map((p) => {
                      const hasPerm = perms.includes(p);
                      return (
                        <div key={p} className="flex items-center justify-center py-3">
                          {hasPerm ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                              <X className="w-3 h-3 text-slate-300 stroke-[2.5]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Có quyền</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <X className="w-2.5 h-2.5 text-slate-300 stroke-[2.5]" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Không có quyền</span>
              </div>
            </div>

            {/* Admin note */}
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 font-medium">
                Chỉ <strong>Super Admin</strong> mới có thể thay đổi cấu hình phân quyền. Liên hệ IT CELLA để điều chỉnh.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
