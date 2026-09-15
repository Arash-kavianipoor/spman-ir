-- =========================================================================
-- SPMAN.IR (Sport Man Iran) - Cloudflare D1 Database Schema
-- Architecture: SQLite / Cloudflare Workers D1 Serverless SQL
-- =========================================================================

-- 1. Users Table (کاربران، مدیران و مالکان فروشگاه)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'store_owner', 'user')),
  is_email_verified INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Email Verification Codes (کدهای تایید ۶ رقمی ایمیل)
CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  is_used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verifications_email_code ON email_verifications(email, code);

-- 3. Stores Table (فروشگاه‌های ورزشی سراسر کشور)
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  phone_mobile1 TEXT NOT NULL,
  phone_mobile2 TEXT,
  phone_landline TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  whatsapp TEXT,
  telegram TEXT,
  instagram TEXT,
  website TEXT,
  description TEXT,
  working_hours TEXT,
  plan TEXT NOT NULL DEFAULT 'standard' CHECK(plan IN ('standard', 'featured')),
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_approved INTEGER NOT NULL DEFAULT 1,
  rating REAL NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city);
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_featured ON stores(is_featured);

-- 4. Store Images (تصاویر بهینه‌شده WebP در پارس‌پک S3)
CREATE TABLE IF NOT EXISTS store_images (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  s3_key TEXT,
  file_size_kb INTEGER,
  format TEXT NOT NULL DEFAULT 'webp',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_store_images_store_id ON store_images(store_id);

-- 5. User Favorites (فروشگاه‌های نشان‌شده کاربر)
CREATE TABLE IF NOT EXISTS user_favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, store_id)
);

-- 6. Audit & Activity Logs (گزارشات و لاگ‌های امنیتی سیستم)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
