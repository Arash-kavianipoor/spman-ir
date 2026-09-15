import { User, UserRole, EmailVerificationRecord } from '../types';

const USERS_STORAGE_KEY = 'spman_users_v1';
const CURRENT_USER_KEY = 'spman_current_user_v1';
const VERIFICATIONS_KEY = 'spman_verifications_v1';

// Initial pre-seeded users
const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    fullName: 'مدیر کل سامانه اسپرت من',
    email: 'admin@spman.ir',
    phone: '09121234567',
    role: 'admin',
    isEmailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-01T10:00:00Z',
    storesCount: 0,
  },
  {
    id: 'usr_owner_01',
    fullName: 'علی رضایی (فروشگاه اسپرت لند)',
    email: 'ali@spman.ir',
    phone: '09351234567',
    role: 'store_owner',
    isEmailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-02-15T14:30:00Z',
    storesCount: 2,
  },
  {
    id: 'usr_member_01',
    fullName: 'سارا احمدی',
    email: 'sara@spman.ir',
    phone: '09198765432',
    role: 'user',
    isEmailVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-03-01T09:15:00Z',
    storesCount: 0,
  },
];

// In-memory passwords for demo accounts
const PASSWORDS_STORAGE_KEY = 'spman_passwords_v1';
const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin@spman.ir': 'admin123456',
  'ali@spman.ir': 'user123456',
  'sara@spman.ir': 'user123456',
};

// Event listeners for reactive session updates
type AuthListener = (user: User | null) => void;
const listeners: Set<AuthListener> = new Set();

export function subscribeToAuth(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyAuthChange(user: User | null): void {
  listeners.forEach((l) => l(user));
}

export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(DEFAULT_PASSWORDS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getStoredPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PASSWORDS;
  } catch {
    return DEFAULT_PASSWORDS;
  }
}

function saveStoredPasswords(passwords: Record<string, string>): void {
  localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passwords));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  notifyAuthChange(user);
}

// -----------------------------------------------------------------------------
// Email Verification Code Engine
// -----------------------------------------------------------------------------
function getVerifications(): EmailVerificationRecord[] {
  try {
    const raw = localStorage.getItem(VERIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVerifications(records: EmailVerificationRecord[]): void {
  localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(records));
}

export function generateVerificationCode(email: string): string {
  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  const records = getVerifications().filter((r) => r.email !== email);
  records.push({
    email,
    code,
    expiresAt,
    isUsed: false,
    createdAt: new Date().toISOString(),
  });
  saveVerifications(records);

  console.log(`%c[SPMAN Email Service] Verification code for ${email} is: %c${code}`, 'color: #f59e0b; font-weight: bold;', 'color: #10b981; font-weight: bold; font-size: 16px;');
  return code;
}

export function verifyEmailCode(email: string, code: string): boolean {
  const records = getVerifications();
  const record = records.find(
    (r) => r.email.toLowerCase() === email.toLowerCase() && r.code === code && !r.isUsed
  );

  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;

  // Mark code as used
  record.isUsed = true;
  saveVerifications(records);

  // Update user verification status in all users
  const users = getAllUsers();
  const updatedUsers = users.map((u) => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      return { ...u, isEmailVerified: true, updatedAt: new Date().toISOString() };
    }
    return u;
  });
  saveUsers(updatedUsers);

  // Update current session if logged in
  const current = getCurrentUser();
  if (current && current.email.toLowerCase() === email.toLowerCase()) {
    const updated = { ...current, isEmailVerified: true };
    setCurrentUser(updated);
  }

  return true;
}

// -----------------------------------------------------------------------------
// Authentication Operations (Register, Login, Logout)
// -----------------------------------------------------------------------------
export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}): Promise<{ user: User; verificationCode: string }> {
  const users = getAllUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('این ایمیل قبلاً در سامانه ثبت شده است. لطفاً وارد شوید.');
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    role: data.role || 'user',
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    storesCount: 0,
  };

  // Save user & password
  users.push(newUser);
  saveUsers(users);

  const passwords = getStoredPasswords();
  passwords[normalizedEmail] = data.password;
  saveStoredPasswords(passwords);

  // Generate verification code
  const verificationCode = generateVerificationCode(normalizedEmail);

  // Auto-login session
  setCurrentUser(newUser);

  return { user: newUser, verificationCode };
}

export async function loginUser(email: string, password: string): Promise<User> {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error('کاربری با این ایمیل یافت نشد.');
  }

  const passwords = getStoredPasswords();
  const storedPassword = passwords[normalizedEmail];

  if (storedPassword && storedPassword !== password) {
    throw new Error('رمز عبور وارد شده نادرست است.');
  }

  const updatedUser: User = {
    ...user,
    lastLogin: new Date().toISOString(),
  };

  // Update in users list
  const updatedList = users.map((u) => (u.id === user.id ? updatedUser : u));
  saveUsers(updatedList);

  setCurrentUser(updatedUser);
  return updatedUser;
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// -----------------------------------------------------------------------------
// Admin & User Management Operations (CRUD)
// -----------------------------------------------------------------------------
export function adminAddUser(data: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
}): User {
  const users = getAllUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('این ایمیل قبلاً در سامانه ثبت شده است.');
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    role: data.role,
    isEmailVerified: data.isEmailVerified,
    createdAt: new Date().toISOString(),
    storesCount: 0,
  };

  users.push(newUser);
  saveUsers(users);

  const passwords = getStoredPasswords();
  passwords[normalizedEmail] = data.password;
  saveStoredPasswords(passwords);

  return newUser;
}

export function adminUpdateUser(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt'>> & { password?: string }
): User {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error('کاربر مورد نظر یافت نشد.');
  }

  const current = users[index];
  const updatedUser: User = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updatedUser;
  saveUsers(users);

  if (updates.password && updates.email) {
    const passwords = getStoredPasswords();
    passwords[updates.email.toLowerCase()] = updates.password;
    saveStoredPasswords(passwords);
  }

  // If updating current logged in user, refresh session
  const active = getCurrentUser();
  if (active && active.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
}

export function adminDeleteUser(userId: string): void {
  const users = getAllUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return;

  if (target.email === 'admin@spman.ir') {
    throw new Error('حذف مدیر ارشد اصلی سامانه مجاز نمی‌باشد.');
  }

  const filtered = users.filter((u) => u.id !== userId);
  saveUsers(filtered);

  // If deleted user was active
  const active = getCurrentUser();
  if (active && active.id === userId) {
    logoutUser();
  }
}

export function toggleUserEmailVerification(userId: string): User {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('کاربر یافت نشد.');

  const updated = {
    ...user,
    isEmailVerified: !user.isEmailVerified,
    updatedAt: new Date().toISOString(),
  };

  const updatedList = users.map((u) => (u.id === userId ? updated : u));
  saveUsers(updatedList);

  const active = getCurrentUser();
  if (active && active.id === userId) {
    setCurrentUser(updated);
  }

  return updated;
}
