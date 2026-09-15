# Cloudflare Pages & Workers Build Guidelines for AI Coding Agent

این سند به عنوان دستورالعمل جامع و فنی برای عامل هوش مصنوعی (AI Agent) در تمام پروژه‌های مبتنی بر Vite / React جهت استقرار بدون خطا در پلتفرم **Cloudflare Pages** و **Cloudflare Workers (Static Assets)** تدوین شده است.

---

## ۱. اصول مدیریت پکیج‌ها و هماهنگی Lockfile (قانون حیاتی `npm ci`)

محیط‌های CI/CD کلودفلر از دستور `npm clean-install` یا `npm ci` استفاده می‌کنند. کوچک‌ترین عدم انطباق بین `package.json` و `package-lock.json` فرآیند بیلد را متوقف می‌کند (`npm error EUSAGE / Missing: ... from lock file`).

### قوانین اجرایی:
1. **همگام‌سازی اجباری Lockfile:** هرگز نباید دستی پکیجی به `package.json` اضافه یا حذف شود بدون اینکه `package-lock.json` نیز دقیقاً همگام شده باشد.
2. **عدم آلودگی به قفل‌های متفرقه (Bun / Yarn / Pnpm):** 
   - فایل‌های `bun.lock` یا `bun.lockb` نباید در ریپازیتوری ایجاد شوند چون محیط CI کلودفلر ممکن است بین پکیج‌منیجرها سردرگم شود.
   - در فایل `.gitignore` همواره این موارد قید شود:
     ```gitignore
     bun.lock
     bun.lockb
     .wrangler/
     ```
3. **سازگاری نسخه‌های Node.js (Engine Compatibility):**
   - محیط پیش‌فرض CI کلودفلر معمولاً روی `Node.js 20.x` است. از افزودن پکیج‌ها یا نسخه‌هایی از Wrangler/Miniflare که اجباراً به `Node >= 22` نیاز دارند خودداری شود مگر اینکه با فایل `.nvmrc` یا `.node-version` نسخه Node صراحتاً ست شده باشد.

---

## ۲. ساختار ریدایرکت‌ها و روتینگ SPA (جلوگیری از Infinite Loop)

یکی از رایج‌ترین خطاهای کلودفلر کد `100324: Infinite loop detected in this rule` است.

### قوانین اجرایی:
1. **عدم ایجاد فایل `_redirects` تداخل‌دار:**
   - اگر از Cloudflare Pages یا `wrangler.jsonc` با حالت `single-page-application` استفاده می‌شود، کلودفلر به صورت خودکار تمام روت‌های SPA را به `index.html` هدایت می‌کند.
   - قرار دادن قانون دستی `/* /index.html 200` درون `public/_redirects` باعث لوپ ریدایرکت داخلی می‌شود و **ممنوع است**.
2. **فایل `public/_headers` مجاز:**
   - برای تنظیم کش دارایی‌های استاتیک و هدرهای امنیتی، فایل `public/_headers` با ساختار زیر کاملاً استاندارد و مجاز است:
     ```http
     /assets/*
       Cache-Control: public, max-age=31536000, immutable

     /*
       X-Frame-Options: SAMEORIGIN
       X-Content-Type-Options: nosniff
       Referrer-Policy: strict-origin-when-cross-origin
     ```

---

## ۳. پیکربندی استاندارد `wrangler.jsonc`

برای پروژه‌های استاتیک SPA، فایل `wrangler.jsonc` در ریشه پروژه باید به شکل زیر تعریف شود:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "spman",
  "compatibility_date": "2026-09-15",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application",
    "html_handling": "auto-trailing-slash"
  }
}
```

---

## ۴. پیکربندی بهینه Vite (`vite.config.ts`)

برای جلوگیری از هشدارهای حجم چانک (`Some chunks are larger than 500 kB`) و بالا بردن نرخ کش‌پذیری در CDN کلودفلر:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-leaflet': ['leaflet'],
          'vendor-motion': ['motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});
```

---

## ۵. تنظیمات استاندارد در داشبورد Cloudflare Pages

هنگام اتصال گیت‌هاب به Cloudflare Pages، تنظیمات زیر باید به عنوان استاندارد در نظر گرفته شوند:
- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (یا خالی)
- **Environment variables:**
  - `NODE_VERSION`: `20.20.2` (در صورت نیاز به پین کردن نسخه)

---

## ۶. چک‌لیست قبل از تحویل کد به کاربر (Self-Check Checklist)

قبل از پایان هر تسک که هدف آن بیلد یا استقرار در کلودفلر است، عامل باید موارد زیر را بررسی کند:
- [ ] اجرای `compile_applet` و اطمینان از خروجی موفق در پوشه `dist`.
- [ ] بررسی عدم وجود پکیج‌های ثبت‌نشده در `package-lock.json`.
- [ ] بررسی عدم وجود فایل `_redirects` با محتوای `/* /index.html 200`.
- [ ] عدم وجود فایل‌های قفل متفرقه مانند `bun.lock`.
- [ ] تست دستور `npm run lint` بدون خطا.
