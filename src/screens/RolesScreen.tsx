import React, { useState, useEffect } from 'react';
import { MobileHeader } from '../components/common/MobileHeader';
import { ScreenId, Staff } from '../types';
import {
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Eye,
  Edit3,
  Trash2,
  Plus,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Sliders,
  UserCheck,
  Crown,
  Info
} from 'lucide-react';
import {
  AppAction,
  AppModule,
  APP_MODULES,
  ACTION_LABELS,
  ROLES_LIST,
  RoleMeta,
  RolePermissionsMap,
  getAllRolePermissions,
  saveRolePermissions,
  resetRolePermissions,
} from '../utils/permissions';

interface RolesScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  currentUser?: Staff;
  onSwitchRole?: (role: string) => void;
}

export const RolesScreen: React.FC<RolesScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
  onSwitchRole,
}) => {
  const [permissions, setPermissions] = useState<RolePermissionsMap>(getAllRolePermissions);
  const [activeTab, setActiveTab] = useState<'matrix' | 'roles' | 'simulator'>('matrix');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('SUPER_ADMIN');
  const [selectedActionFilter, setSelectedActionFilter] = useState<'ALL' | AppAction>('ALL');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Toggle a single permission cell
  const handleTogglePermission = (roleId: string, moduleKey: AppModule, action: AppAction) => {
    // Super Admin cannot be restricted
    if (roleId === 'SUPER_ADMIN') {
      alert('Tài khoản Super Admin (Chủ hệ thống) có toàn quyền vĩnh viễn và không thể hạn chế.');
      return;
    }

    const currentRolePerms = permissions[roleId] || {};
    const currentModuleActions = currentRolePerms[moduleKey] || [];

    const isCurrentlyAllowed = currentModuleActions.includes(action);
    const updatedActions = isCurrentlyAllowed
      ? currentModuleActions.filter((a) => a !== action)
      : [...currentModuleActions, action];

    const updatedPermissions: RolePermissionsMap = {
      ...permissions,
      [roleId]: {
        ...currentRolePerms,
        [moduleKey]: updatedActions,
      },
    };

    setPermissions(updatedPermissions);
    saveRolePermissions(updatedPermissions);
    setHasChanges(true);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục phân quyền Xem / Thêm / Sửa / Xóa về mặc định ban đầu?')) {
      const def = resetRolePermissions();
      setPermissions(def);
      setHasChanges(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    }
  };

  const selectedRole = ROLES_LIST.find((r) => r.id === selectedRoleId) || ROLES_LIST[0];

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-28 text-slate-900">
      <MobileHeader
        title="Phân Quyền Hệ Thống"
        subtitle="Quyền Xem • Thêm • Sửa • Xóa dữ liệu"
        onBack={onBack}
        showBack={true}
        rightAction={
          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        }
      />

      {/* View Switcher Tabs */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 sticky top-[56px] z-20 shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
              activeTab === 'matrix' ? 'bg-white text-[#544CDE] shadow-sm' : 'text-slate-500'
            }`}
          >
            🔐 Ma Trận Quyền
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
              activeTab === 'roles' ? 'bg-white text-[#544CDE] shadow-sm' : 'text-slate-500'
            }`}
          >
            🛡️ Danh Sách Vai Trò
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
              activeTab === 'simulator' ? 'bg-white text-[#544CDE] shadow-sm' : 'text-slate-500'
            }`}
          >
            🎭 Thử Nghiệm Vai Trò
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Toast thông báo lưu thay đổi */}
        {saveToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 z-50 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã lưu phân quyền Xem / Thêm / Sửa / Xóa thành công!</span>
          </div>
        )}

        {/* ========================================================
            TAB 1: MA TRẬN PHÂN QUYỀN (MATRIX) - AI ĐƯỢC XEM/SỬA/XÓA
        ======================================================== */}
        {activeTab === 'matrix' && (
          <div className="space-y-4 animate-fade-in">
            {/* Banner giới thiệu phân quyền */}
            <div className="bg-gradient-to-r from-[#1E1B4B] via-[#2E1065] to-[#4338CA] text-white rounded-2xl p-4 shadow-lg space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Quy Tắc Phân Quyền CELLA (RBAC)
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                  {ROLES_LIST.length} vai trò · 10 phân hệ
                </span>
              </div>
              <h3 className="text-sm font-black">
                Kiểm soát: Ai được Xem, Ai được Thêm, Ai được Sửa, Ai được Xóa
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chạm vào các ô kiểm tra bên dưới để cấp hoặc thu hồi quyền tức thì. Hệ thống sẽ tự động đồng bộ ngay trên ứng dụng và bảo vệ cơ sở dữ liệu.
              </p>
            </div>

            {/* Chọn vai trò để cấu hình chi tiết */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                1. Chọn vai trò tài khoản muốn cấu hình quyền:
              </label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {ROLES_LIST.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                      selectedRoleId === role.id
                        ? 'bg-[#544CDE] text-white shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{role.icon}</span>
                    <span>{role.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card thông tin vai trò đang chọn */}
            <div className={`p-4 rounded-2xl border ${selectedRole.bgColor} space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedRole.icon}</span>
                  <div>
                    <h4 className={`text-sm font-black ${selectedRole.textColor}`}>
                      {selectedRole.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-current opacity-80">
                      {selectedRole.badge}
                    </span>
                  </div>
                </div>
                {selectedRole.id === 'SUPER_ADMIN' ? (
                  <span className="text-[10px] font-bold text-rose-700 bg-white px-2 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-500" /> Toàn quyền hệ thống
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
                    <Sliders className="w-3 h-3" /> Chạm ô để bật/tắt quyền
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 italic">"{selectedRole.desc}"</p>
            </div>

            {/* Bảng Ma trận 4 quyền: Xem (View), Thêm (Create), Sửa (Edit), Xóa (Delete) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-600">
                  Phân Hệ Dữ Liệu
                </span>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-600 pr-2">
                  <span className="w-7 text-center text-sky-700">Xem</span>
                  <span className="w-7 text-center text-emerald-700">Thêm</span>
                  <span className="w-7 text-center text-amber-700">Sửa</span>
                  <span className="w-7 text-center text-rose-700">Xóa</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {APP_MODULES.map((mod) => {
                  const rolePerms = permissions[selectedRole.id] || {};
                  const modActions = rolePerms[mod.key] || [];

                  const hasView = modActions.includes('view');
                  const hasCreate = modActions.includes('create');
                  const hasEdit = modActions.includes('edit');
                  const hasDelete = modActions.includes('delete');

                  return (
                    <div
                      key={mod.key}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{mod.icon}</span>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {mod.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                          {mod.desc}
                        </p>
                      </div>

                      {/* 4 Nút Toggle Xem, Thêm, Sửa, Xóa */}
                      <div className="flex items-center gap-4 pr-1 shrink-0">
                        {/* 1. XEM (VIEW) */}
                        <button
                          type="button"
                          disabled={selectedRole.id === 'SUPER_ADMIN'}
                          onClick={() => handleTogglePermission(selectedRole.id, mod.key, 'view')}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            hasView
                              ? 'bg-sky-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                          title="Quyền Xem"
                        >
                          {hasView ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>

                        {/* 2. THÊM (CREATE) */}
                        <button
                          type="button"
                          disabled={selectedRole.id === 'SUPER_ADMIN'}
                          onClick={() => handleTogglePermission(selectedRole.id, mod.key, 'create')}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            hasCreate
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                          title="Quyền Thêm"
                        >
                          {hasCreate ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>

                        {/* 3. SỬA (EDIT) */}
                        <button
                          type="button"
                          disabled={selectedRole.id === 'SUPER_ADMIN'}
                          onClick={() => handleTogglePermission(selectedRole.id, mod.key, 'edit')}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            hasEdit
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                          title="Quyền Sửa"
                        >
                          {hasEdit ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>

                        {/* 4. XÓA (DELETE) */}
                        <button
                          type="button"
                          disabled={selectedRole.id === 'SUPER_ADMIN'}
                          onClick={() => handleTogglePermission(selectedRole.id, mod.key, 'delete')}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            hasDelete
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                          title="Quyền Xóa"
                        >
                          {hasDelete ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chú thích màu sắc */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Ý nghĩa 4 mức quyền:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-sky-800 block text-[11px]">Xem (View)</strong>
                    <span className="text-[10px] text-slate-400">Xem danh sách & chi tiết</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-emerald-800 block text-[11px]">Thêm (Create)</strong>
                    <span className="text-[10px] text-slate-400">Tạo mới bản ghi</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-amber-800 block text-[11px]">Sửa (Edit)</strong>
                    <span className="text-[10px] text-slate-400">Cập nhật, sửa giá, đổi trạng thái</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-rose-800 block text-[11px]">Xóa (Delete)</strong>
                    <span className="text-[10px] text-slate-400">Xóa dữ liệu vĩnh viễn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: DANH SÁCH CHI TIẾT TỪNG VAI TRÒ (ROLES)
        ======================================================== */}
        {activeTab === 'roles' && (
          <div className="space-y-3 animate-fade-in">
            {ROLES_LIST.map((role) => {
              const rolePerms = permissions[role.id] || {};
              const totalView = Object.values(rolePerms).filter((actions) => actions.includes('view')).length;
              const totalCreate = Object.values(rolePerms).filter((actions) => actions.includes('create')).length;
              const totalEdit = Object.values(rolePerms).filter((actions) => actions.includes('edit')).length;
              const totalDelete = Object.values(rolePerms).filter((actions) => actions.includes('delete')).length;

              return (
                <div
                  key={role.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-lg text-white shadow-sm`}>
                        {role.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-900">{role.name}</h4>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${role.bgColor} ${role.textColor}`}>
                            {role.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{role.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Thống kê quyền hạn của role */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                    <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
                      <span className="text-sky-700 block font-bold text-[10px]">Được Xem</span>
                      <strong className="text-sky-900 text-sm font-black">{totalView}/10</strong>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                      <span className="text-emerald-700 block font-bold text-[10px]">Được Thêm</span>
                      <strong className="text-emerald-900 text-sm font-black">{totalCreate}/10</strong>
                    </div>
                    <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                      <span className="text-amber-700 block font-bold text-[10px]">Được Sửa</span>
                      <strong className="text-amber-900 text-sm font-black">{totalEdit}/10</strong>
                    </div>
                    <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-100">
                      <span className="text-rose-700 block font-bold text-[10px]">Được Xóa</span>
                      <strong className="text-rose-900 text-sm font-black">{totalDelete}/10</strong>
                    </div>
                  </div>

                  {/* Nút cấu hình */}
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setActiveTab('matrix');
                      }}
                      className="text-xs font-bold text-[#544CDE] hover:underline flex items-center gap-1"
                    >
                      <span>Tùy chỉnh ma trận quyền cho vai trò này</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            TAB 3: THỬ NGHIỆM VAI TRÒ (SWITCH ROLE SIMULATOR)
        ======================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎭</span>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Mô Phỏng Trải Nghiệm Theo Vai Trò
                  </h4>
                  <p className="text-xs text-slate-500">
                    Chọn một vai trò để kiểm tra tài khoản thực tế sẽ thấy những gì trên app CELLA
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {ROLES_LIST.map((r) => {
                  const isCurrent = currentUser?.role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        if (onSwitchRole) {
                          onSwitchRole(r.id);
                          alert(`Đã chuyển phiên đăng nhập mô phỏng sang vai trò: ${r.name} (${r.badge})`);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'border-[#544CDE] bg-indigo-50/60 ring-2 ring-[#544CDE]/20 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{r.icon}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#544CDE] bg-indigo-100 px-1.5 py-0.5 rounded-full">
                            Đang đóng vai
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-800 mt-1">{r.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{r.badge}</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Ghi chú phân quyền thực tế:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Khi đăng nhập với vai trò <strong>Artist</strong> hoặc <strong>Customer</strong>, các nút "Thêm khóa học", "Sửa giá", "Xóa học viên", "Xóa khách hàng" sẽ tự động được ẩn hoặc vô hiệu hóa để bảo vệ dữ liệu.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
