import React, { useState, useEffect } from 'react';
import { User, UserRole, S3UploadResult } from '../types';
import { 
  getAllUsers, adminAddUser, adminUpdateUser, adminDeleteUser, 
  toggleUserEmailVerification, getCurrentUser 
} from '../services/authService';
import { PARSPACK_CONFIG, testParsPackS3Connection, getLocalUploadHistory } from '../services/parspackS3Service';
import { generateD1SchemaSQL, getD1Config, saveD1Config } from '../services/d1DatabaseService';
import { WebPUploadWidget } from './WebPUploadWidget';
import { 
  ShieldAlert, Users, Plus, Trash2, Edit, Check, X, 
  Mail, Phone, ShieldCheck, Database, HardDrive, 
  Sparkles, CheckCircle2, AlertCircle, Copy, Search,
  ArrowLeft, RefreshCw, Layers, ExternalLink, Zap
} from 'lucide-react';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToHome }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 's3' | 'd1'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  // Modal states for Adding and Editing Users
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [newVerified, setNewVerified] = useState(true);

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('user');
  const [editVerified, setEditVerified] = useState(false);
  const [editPassword, setEditPassword] = useState('');

  // Notification states
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ParsPack S3 Test State
  const [s3Testing, setS3Testing] = useState(false);
  const [s3TestResult, setS3TestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);
  const [uploadedS3History, setUploadedS3History] = useState<S3UploadResult[]>([]);

  // D1 Database Config State
  const [d1Config, setD1ConfigState] = useState(getD1Config());
  const [copiedSQL, setCopiedSQL] = useState(false);

  const loadUsers = () => {
    setUsers(getAllUsers());
  };

  useEffect(() => {
    loadUsers();
    setUploadedS3History(getLocalUploadHistory());
  }, []);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  // Add User Handler
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      showNotice('error', 'لطفاً نام، ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    try {
      adminAddUser({
        fullName: newName,
        email: newEmail,
        password: newPassword,
        phone: newPhone,
        role: newRole,
        isEmailVerified: newVerified,
      });

      showNotice('success', `کاربر ${newName} با موفقیت اضافه شد.`);
      setIsAddUserOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      loadUsers();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در افزودن کاربر');
    }
  };

  // Edit User Handler
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditVerified(user.isEmailVerified);
    setEditPassword('');
    setIsEditUserOpen(true);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      adminUpdateUser(editingUser.id, {
        fullName: editName,
        phone: editPhone,
        role: editRole,
        isEmailVerified: editVerified,
        ...(editPassword ? { password: editPassword, email: editingUser.email } : {}),
      });

      showNotice('success', `اطلاعات کاربر ${editName} بروزرسانی شد.`);
      setIsEditUserOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در ویرایش کاربر');
    }
  };

  // Delete User Handler
  const handleDeleteUser = (user: User) => {
    if (window.confirm(`آیا از حذف کامل حساب کاربر "${user.fullName}" (${user.email}) اطمینان دارید؟`)) {
      try {
        adminDeleteUser(user.id);
        showNotice('success', `کاربر ${user.fullName} با موفقیت حذف شد.`);
        loadUsers();
      } catch (err: any) {
        showNotice('error', err?.message || 'خطا در حذف کاربر');
      }
    }
  };

  // Toggle Email Verification
  const handleToggleVerification = (user: User) => {
    try {
      const updated = toggleUserEmailVerification(user.id);
      showNotice(
        'success',
        `وضعیت تایید ایمیل برای ${user.fullName} به ${updated.isEmailVerified ? 'تایید شده' : 'تایید نشده'} تغییر یافت.`
      );
      loadUsers();
    } catch (err: any) {
      showNotice('error', err?.message || 'خطا در تغییر وضعیت');
    }
  };

  // Test S3 Connection
  const handleTestS3 = async () => {
    setS3Testing(true);
    setS3TestResult(null);
    const result = await testParsPackS3Connection();
    setS3TestResult(result);
    setS3Testing(false);
  };

  // Copy D1 Schema SQL
  const handleCopySQL = () => {
    const sql = generateD1SchemaSQL();
    navigator.clipboard.writeText(sql);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 3000);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && u.isEmailVerified) ||
      (verifiedFilter === 'unverified' && !u.isEmailVerified);

    return matchesQuery && matchesRole && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#0c0d14] border border-white/10 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">پنل مدیریت یکپارچه اسپرت من</h1>
                <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black">ADMIN PRO</span>
              </div>
              <p className="text-xs text-zinc-400">مدیریت کاربران، کلاود استورج ParsPack S3 و پایگاه‌داده Cloudflare D1</p>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>بازگشت به سایت</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className={`flex items-center gap-2 p-3.5 rounded-2xl border text-xs font-medium ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>مدیریت کاربران و دسترسی‌ها ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('s3')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 's3'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>پارس‌پک S3 و تبدیل WebP</span>
          </button>

          <button
            onClick={() => setActiveTab('d1')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'd1'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>پایگاه داده Cloudflare D1</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: USERS MANAGEMENT (حذف، اضافه، ویرایش و مدیریت کاربران) */}
        {/* ================================================================= */}
        {activeTab === 'users' && (
          <div className="bg-[#0c0d14] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
            
            {/* Action Bar: Search, Filters & Add User Button */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام، ایمیل یا موبایل..."
                  className="w-full bg-[#141724] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Filters & Add User */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">همه نقش‌ها</option>
                  <option value="admin">مدیران (Admin)</option>
                  <option value="store_owner">مالکان فروشگاه</option>
                  <option value="user">کاربران عادی</option>
                </select>

                {/* Verification Filter */}
                <select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  className="bg-[#141724] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">همه وضعیت‌های ایمیل</option>
                  <option value="verified">ایمیل تایید شده</option>
                  <option value="unverified">ایمیل تایید نشده</option>
                </select>

                {/* Add User Button */}
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن کاربر جدید</span>
                </button>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#090b10]">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#141724] text-zinc-300 border-b border-white/10 font-bold">
                  <tr>
                    <th className="p-4">کاربر</th>
                    <th className="p-4">نقش کاربری</th>
                    <th className="p-4">تایید ایمیل</th>
                    <th className="p-4">اطلاعات تماس</th>
                    <th className="p-4">تاریخ عضویت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-zinc-500">
                        کاربری با این مشخصات یافت نشد.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        
                        {/* User info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-amber-500/10 border border-white/10 flex items-center justify-center shrink-0 text-amber-400 font-bold">
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                u.fullName.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                                {u.email === 'admin@spman.ir' && (
                                  <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-black">
                                    ROOT
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-500 font-mono dir-ltr text-right">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                            u.role === 'admin'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : u.role === 'store_owner'
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              : 'bg-white/5 text-zinc-400 border-white/10'
                          }`}>
                            {u.role === 'admin' && '👑 مدیر (Admin)'}
                            {u.role === 'store_owner' && '🏪 فروشگاه‌دار'}
                            {u.role === 'user' && '👤 کاربر عادی'}
                          </span>
                        </td>

                        {/* Email Verification Toggle */}
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleVerification(u)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              u.isEmailVerified
                                ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30'
                            }`}
                            title="برای تغییر وضعیت تایید کلیک کنید"
                          >
                            {u.isEmailVerified ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>تایید شده</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5" />
                                <span>تایید نشده</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Phone */}
                        <td className="p-4 font-mono dir-ltr text-right text-zinc-400">
                          {u.phone || '-'}
                        </td>

                        {/* Created Date */}
                        <td className="p-4 text-[11px] text-zinc-400 font-mono">
                          {new Date(u.createdAt).toLocaleDateString('fa-IR')}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                              title="ویرایش کاربر"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {u.email !== 'admin@spman.ir' && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="حذف کاربر"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PARSPACK S3 & WEBP COMPRESSION */}
        {/* ================================================================= */}
        {activeTab === 's3' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* S3 Credentials & Connection Box */}
            <div className="lg:col-span-6 bg-[#0c0d14] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-amber-400" />
                  <span>تنظیمات کلاود استورج ParsPack S3</span>
                </h3>
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                  S3 COMPATIBLE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#141724] rounded-xl border border-white/10 flex items-center justify-between font-mono">
                  <span className="text-zinc-400">Endpoint URL:</span>
                  <span className="text-amber-400 font-bold">{PARSPACK_CONFIG.endpoint}</span>
                </div>

                <div className="p-3 bg-[#141724] rounded-xl border border-white/10 flex items-center justify-between font-mono">
                  <span className="text-zinc-400">Access Key:</span>
                  <span className="text-white">{PARSPACK_CONFIG.accessKeyId}</span>
                </div>

                <div className="p-3 bg-[#141724] rounded-xl border border-white/10 flex items-center justify-between font-mono">
                  <span className="text-zinc-400">Secret Key:</span>
                  <span className="text-zinc-500">••••••••••••••••••••••••••••••••</span>
                </div>

                <div className="p-3 bg-[#141724] rounded-xl border border-white/10 flex items-center justify-between font-mono">
                  <span className="text-zinc-400">Bucket Name:</span>
                  <span className="text-emerald-400">{PARSPACK_CONFIG.bucketName}</span>
                </div>
              </div>

              {/* Live Test Connection Button */}
              <button
                onClick={handleTestS3}
                disabled={s3Testing}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${s3Testing ? 'animate-spin' : ''}`} />
                <span>{s3Testing ? 'در حال برقراری ارتباط با پارس‌پک...' : 'تست آنلاین اتصال به ParsPack S3'}</span>
              </button>

              {s3TestResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{s3TestResult.message}</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 font-mono">
                    سرعت پاسخ سرور: <strong className="text-amber-400">{s3TestResult.latencyMs} میلی‌ثانیه</strong>
                  </div>
                </div>
              )}
            </div>

            {/* WebP Upload Sandbox */}
            <div className="lg:col-span-6 bg-[#0c0d14] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>آزمایشگاه فشرده‌سازی WebP و ذخیره در S3</span>
              </h3>

              <WebPUploadWidget
                folder="admin-test"
                maxDimension={1600}
                quality={0.82}
                label="بارگذاری تصویر تستی"
                onUploadSuccess={(url, meta) => {
                  showNotice('success', `تصویر با حجم ${meta?.sizeKb} KB در پارس‌پک ذخیره شد.`);
                  setUploadedS3History(getLocalUploadHistory());
                }}
              />

              {/* Uploaded History List */}
              {uploadedS3History.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-zinc-300">آخرین تصاویر ذخیره‌شده در پارس‌پک:</div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {uploadedS3History.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <img src={item.url} alt="" className="w-8 h-8 rounded-lg object-cover bg-black shrink-0" />
                          <span className="font-mono text-[11px] text-zinc-300 truncate dir-ltr">{item.key}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                          {item.sizeKb} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CLOUDFLARE D1 DATABASE */}
        {/* ================================================================= */}
        {activeTab === 'd1' && (
          <div className="bg-[#0c0d14] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">طراحی دیتابیس Cloudflare D1 (Serverless SQLite)</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold">SQLITE D1</span>
                </div>
                <p className="text-xs text-zinc-400">اسکریپت کامل Migration و جداول کاربران، تایید ایمیل، فروشگاه‌ها و لاگ‌ها</p>
              </div>

              <button
                onClick={handleCopySQL}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {copiedSQL ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSQL ? 'کد SQL کپی شد!' : 'کپی کامل اسکریپت SQL'}</span>
              </button>
            </div>

            {/* SQL Code Box */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#06070a] p-4 text-xs font-mono text-amber-300 dir-ltr text-left max-h-96 overflow-y-auto leading-relaxed">
              <pre>{generateD1SchemaSQL()}</pre>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>نحوه اتصال به دیتابیس کلودفلر D1 در پروداکشن:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400 leading-relaxed">
                <li>وارد پنل کلودفلر (Cloudflare Dashboard) شوید و به بخش <strong>Workers & D1</strong> بروید.</li>
                <li>دیتابیس جدیدی با نام <code className="text-amber-400">spman-db</code> ایجاد کنید.</li>
                <li>اسکریپت SQL بالا را در کنسول D1 اجرا کنید یا دستور <code className="text-amber-400 font-mono">npx wrangler d1 execute spman-db --file=src/db/schema-d1.sql</code> را در ترمینال بزنید.</li>
                <li>کلیدهای اتصال را در متغیرهای محیطی <code className="text-amber-400 font-mono">.env.example</code> قرار دهید.</li>
              </ol>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: ADD USER (افزودن کاربر جدید) */}
        {/* ================================================================= */}
        {isAddUserOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0c0d14] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl text-right">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  <span>افزودن کاربر جدید به سامانه</span>
                </h3>
                <button
                  onClick={() => setIsAddUserOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: مهدی کاظمی"
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">آدرس ایمیل</label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono dir-ltr text-left focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">شماره موبایل</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="09123456789"
                      className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono dir-ltr text-left focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">رمز عبور اولیه</label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono dir-ltr text-left focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">نقش کاربری:</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="user">کاربر عادی</option>
                      <option value="store_owner">مالک فروشگاه ورزشی</option>
                      <option value="admin">مدیر سامانه (Admin)</option>
                    </select>
                  </div>

                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newVerified}
                        onChange={(e) => setNewVerified(e.target.checked)}
                        className="rounded accent-amber-500 w-4 h-4"
                      />
                      <span className="text-xs font-medium text-zinc-200">ایمیل به صورت پیش‌فرض تایید شود</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
                  >
                    ایجاد کاربر
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: EDIT USER (ویرایش کاربر) */}
        {/* ================================================================= */}
        {isEditUserOpen && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0c0d14] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl text-right">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <span>ویرایش مشخصات کاربر: {editingUser.fullName}</span>
                </h3>
                <button
                  onClick={() => setIsEditUserOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditUserSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">ایمیل</label>
                    <input
                      type="email"
                      disabled
                      value={editingUser.email}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 font-mono dir-ltr text-left cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">شماره موبایل</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono dir-ltr text-left focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">تغییر رمز عبور (در صورت خالی بودن تغییر نمی‌کند)</label>
                  <input
                    type="password"
                    dir="ltr"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="رمز جدید..."
                    className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono dir-ltr text-left focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">نقش کاربری:</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="w-full bg-[#141724] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="user">کاربر عادی</option>
                      <option value="store_owner">مالک فروشگاه ورزشی</option>
                      <option value="admin">مدیر سامانه (Admin)</option>
                    </select>
                  </div>

                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editVerified}
                        onChange={(e) => setEditVerified(e.target.checked)}
                        className="rounded accent-amber-500 w-4 h-4"
                      />
                      <span className="text-xs font-medium text-zinc-200">وضعیت ایمیل: تایید شده</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditUserOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
