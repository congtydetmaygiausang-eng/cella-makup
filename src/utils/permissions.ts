/**
 * CELLA MAKEUP ACADEMY - RBAC PERMISSION SYSTEM
 * Cấu trúc dữ liệu phân quyền: Xem (View), Thêm (Create), Sửa (Edit), Xóa (Delete)
 */

export type AppAction = 'view' | 'create' | 'edit' | 'delete';

export type AppModule =
  | 'customers'
  | 'bookings'
  | 'courses'
  | 'instructors'
  | 'students'
  | 'revenue'
  | 'hr'
  | 'lookbook'
  | 'roles'
  | 'ai';

export interface ModuleMeta {
  key: AppModule;
  label: string;
  icon: string;
  desc: string;
}

export const APP_MODULES: ModuleMeta[] = [
  { key: 'customers',   label: 'Khách hàng (CRM)',       icon: '👥', desc: 'Hồ sơ khách hàng, nguồn lead, lịch sử tư vấn' },
  { key: 'bookings',    label: 'Lịch hẹn & Dịch vụ',     icon: '📅', desc: 'Đặt lịch làm đẹp, phân công nghệ sĩ makeup' },
  { key: 'courses',     label: 'Khóa học & Học phí',     icon: '📚', desc: 'Danh sách khóa đào tạo, video bài giảng, giá học phí' },
  { key: 'instructors', label: 'Đội ngũ Giảng viên',     icon: '🎓', desc: 'Hồ sơ Master, giảng viên, trợ giảng Academy' },
  { key: 'students',    label: 'Hồ sơ Học viên',         icon: '👩‍🎓', desc: 'Học viên các khóa, học phí, điểm danh, bằng tốt nghiệp' },
  { key: 'revenue',     label: 'Doanh thu & Tài chính',  icon: '📊', desc: 'Báo cáo doanh số, hóa đơn, công nợ' },
  { key: 'hr',          label: 'Nhân sự & Chấm công',    icon: '💼', desc: 'Danh sách nhân viên, chấm công GPS, bảng lương' },
  { key: 'lookbook',    label: 'Mẫu Makeup & Bài viết',  icon: '💄', desc: 'Bảng giá mẫu makeup, lookbook, bài viết chia sẻ' },
  { key: 'roles',       label: 'Phân quyền Hệ thống',    icon: '🔐', desc: 'Cấu hình quyền hạn tài khoản và vai trò' },
  { key: 'ai',          label: 'Trợ lý AI CELLA',        icon: '🤖', desc: 'Chatbot tư vấn và phân tích thông minh' },
];

export const ACTION_LABELS: Record<AppAction, { label: string; desc: string; color: string; bg: string }> = {
  view:   { label: 'Xem',  desc: 'Được quyền truy cập và xem chi tiết dữ liệu',   color: 'text-sky-700',    bg: 'bg-sky-50 border-sky-200' },
  create: { label: 'Thêm', desc: 'Được quyền tạo mới bản ghi vào hệ thống',        color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200' },
  edit:   { label: 'Sửa',  desc: 'Được quyền chỉnh sửa và cập nhật dữ liệu',     color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  delete: { label: 'Xóa',  desc: 'Được quyền xóa bản ghi khỏi hệ thống',          color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200' },
};

export interface RoleMeta {
  id: string;
  name: string;
  badge: string;
  desc: string;
  color: string;
  textColor: string;
  bgColor: string;
  icon: string;
}

export const ROLES_LIST: RoleMeta[] = [
  {
    id: 'SUPER_ADMIN',
    name: 'Super Admin',
    badge: 'Chủ hệ thống',
    desc: 'Toàn quyền Xem, Thêm, Sửa, Xóa mọi phân hệ trong CELLA',
    color: 'from-rose-600 to-red-600',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
    icon: '👑',
  },
  {
    id: 'ADMIN',
    name: 'Admin Chi nhánh',
    badge: 'Quản lý',
    desc: 'Quản lý hoạt động chi nhánh, khách hàng, học viên & lịch hẹn',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: '🛡️',
  },
  {
    id: 'MASTER_ARTIST',
    name: 'Master Trainer',
    badge: 'Nghệ nhân Master',
    desc: 'Chuyên gia giảng dạy, phụ trách đào tạo, duyệt giáo trình & portfolio',
    color: 'from-purple-600 to-indigo-600',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: '⭐',
  },
  {
    id: 'ARTIST',
    name: 'Makeup Artist',
    badge: 'Nghệ sĩ Makeup',
    desc: 'Chuyên viên thực hiện dịch vụ trang điểm & quản lý lịch làm việc của mình',
    color: 'from-pink-500 to-rose-500',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200',
    icon: '💄',
  },
  {
    id: 'SALES_CONSULTANT',
    name: 'Sales & Tuyển sinh',
    badge: 'Tư vấn viên',
    desc: 'Tư vấn khóa học, tuyển sinh học viên mới, CSKH & tạo lịch hẹn',
    color: 'from-blue-500 to-cyan-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: '💬',
  },
  {
    id: 'ACADEMY_TRAINER',
    name: 'Giảng viên Thực hành',
    badge: 'Giảng viên',
    desc: 'Trợ giảng & giảng viên đứng lớp kèm 1-1, chấm điểm tay nghề học viên',
    color: 'from-teal-500 to-emerald-600',
    textColor: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    icon: '🎓',
  },
  {
    id: 'CUSTOMER',
    name: 'Học viên / Khách hàng',
    badge: 'Khách / Học viên',
    desc: 'Học viên xem khóa học, đặt lịch hẹn và theo dõi hồ sơ cá nhân',
    color: 'from-slate-500 to-slate-700',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-50 border-slate-200',
    icon: '👤',
  },
];

export type RolePermissionsMap = Record<string, Record<AppModule, AppAction[]>>;

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMap = {
  SUPER_ADMIN: {
    customers:   ['view', 'create', 'edit', 'delete'],
    bookings:    ['view', 'create', 'edit', 'delete'],
    courses:     ['view', 'create', 'edit', 'delete'],
    instructors: ['view', 'create', 'edit', 'delete'],
    students:    ['view', 'create', 'edit', 'delete'],
    revenue:     ['view', 'create', 'edit', 'delete'],
    hr:          ['view', 'create', 'edit', 'delete'],
    lookbook:    ['view', 'create', 'edit', 'delete'],
    roles:       ['view', 'create', 'edit', 'delete'],
    ai:          ['view', 'create', 'edit', 'delete'],
  },
  ADMIN: {
    customers:   ['view', 'create', 'edit', 'delete'],
    bookings:    ['view', 'create', 'edit', 'delete'],
    courses:     ['view', 'create', 'edit'],
    instructors: ['view', 'create', 'edit'],
    students:    ['view', 'create', 'edit', 'delete'],
    revenue:     ['view', 'create', 'edit'],
    hr:          ['view', 'create', 'edit'],
    lookbook:    ['view', 'create', 'edit', 'delete'],
    roles:       ['view'],
    ai:          ['view', 'create', 'edit'],
  },
  MASTER_ARTIST: {
    customers:   ['view', 'create', 'edit'],
    bookings:    ['view', 'create', 'edit'],
    courses:     ['view', 'create', 'edit'],
    instructors: ['view', 'create', 'edit'],
    students:    ['view', 'create', 'edit'],
    revenue:     ['view'],
    hr:          ['view'],
    lookbook:    ['view', 'create', 'edit', 'delete'],
    roles:       [],
    ai:          ['view', 'create', 'edit'],
  },
  ARTIST: {
    customers:   ['view'],
    bookings:    ['view', 'edit'],
    courses:     ['view'],
    instructors: ['view'],
    students:    ['view'],
    revenue:     [],
    hr:          ['view'],
    lookbook:    ['view', 'create', 'edit'],
    roles:       [],
    ai:          ['view', 'create', 'edit'],
  },
  SALES_CONSULTANT: {
    customers:   ['view', 'create', 'edit'],
    bookings:    ['view', 'create', 'edit'],
    courses:     ['view'],
    instructors: ['view'],
    students:    ['view', 'create', 'edit'],
    revenue:     ['view'],
    hr:          [],
    lookbook:    ['view'],
    roles:       [],
    ai:          ['view', 'create', 'edit'],
  },
  ACADEMY_TRAINER: {
    customers:   [],
    bookings:    ['view'],
    courses:     ['view'],
    instructors: ['view'],
    students:    ['view', 'edit'],
    revenue:     [],
    hr:          ['view'],
    lookbook:    ['view', 'create'],
    roles:       [],
    ai:          ['view'],
  },
  CUSTOMER: {
    customers:   ['view'],
    bookings:    ['view', 'create'],
    courses:     ['view'],
    instructors: ['view'],
    students:    [],
    revenue:     [],
    hr:          [],
    lookbook:    ['view'],
    roles:       [],
    ai:          ['view'],
  },
};

const STORAGE_KEY = 'cella_rbac_permissions_v2';

/**
 * Lấy toàn bộ bản đồ phân quyền từ localStorage (hoặc mặc định)
 */
export function getAllRolePermissions(): RolePermissionsMap {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading permissions:', e);
  }
  return DEFAULT_ROLE_PERMISSIONS;
}

/**
 * Lưu bản đồ phân quyền vào localStorage
 */
export function saveRolePermissions(permissions: RolePermissionsMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
  } catch (e) {
    console.error('Error saving permissions:', e);
  }
}

/**
 * Khôi phục phân quyền về mặc định
 */
export function resetRolePermissions(): RolePermissionsMap {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return DEFAULT_ROLE_PERMISSIONS;
}

/**
 * Kiểm tra xem một Role có quyền trên một Phân hệ và Hành động cụ thể hay không
 */
export function hasPermission(
  role: string | undefined,
  module: AppModule,
  action: AppAction
): boolean {
  if (!role) return false;
  // Super Admin luôn có toàn quyền tuyệt đối
  if (role === 'SUPER_ADMIN') return true;

  const permissions = getAllRolePermissions();
  const rolePerms = permissions[role];
  if (!rolePerms) return false;

  const modulePerms = rolePerms[module];
  if (!modulePerms) return false;

  return modulePerms.includes(action);
}

/**
 * Helpers tiện ích nhanh
 */
export function canView(role: string | undefined, module: AppModule): boolean {
  return hasPermission(role, module, 'view');
}

export function canCreate(role: string | undefined, module: AppModule): boolean {
  return hasPermission(role, module, 'create');
}

export function canEdit(role: string | undefined, module: AppModule): boolean {
  return hasPermission(role, module, 'edit');
}

export function canDelete(role: string | undefined, module: AppModule): boolean {
  return hasPermission(role, module, 'delete');
}
