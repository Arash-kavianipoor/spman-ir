import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, ArrowDown, Loader2 } from 'lucide-react';
import { optimizeImageToWebP, formatBytes } from '../utils/imageOptimizer';
import { uploadToParsPackS3 } from '../services/parspackS3Service';
import { OptimizedImage, S3UploadResult } from '../types';

interface WebPUploadWidgetProps {
  onUploadSuccess: (url: string, uploadMeta?: S3UploadResult) => void;
  label?: string;
  folder?: string;
  maxDimension?: number;
  quality?: number;
  className?: string;
}

export const WebPUploadWidget: React.FC<WebPUploadWidgetProps> = ({
  onUploadSuccess,
  label = 'بارگذاری تصویر با بهینه‌سازی خودکار WebP',
  folder = 'stores',
  maxDimension = 1400,
  quality = 0.82,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedImage | null>(null);
  const [s3Result, setS3Result] = useState<S3UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('لطفاً یک فایل تصویری معتبر (JPG, PNG, WebP) انتخاب کنید.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // 1. Optimize and compress to modern WebP format
      const optimized = await optimizeImageToWebP(file, file.name, {
        maxWidth: maxDimension,
        maxHeight: maxDimension,
        quality,
      });
      setOptimizedResult(optimized);

      // 2. Upload to ParsPack S3 Object Storage
      const uploaded = await uploadToParsPackS3(optimized.file, file.name, folder);
      setS3Result(uploaded);

      // 3. Callback with final image URL
      onUploadSuccess(uploaded.url, uploaded);
    } catch (err: any) {
      setError(err?.message || 'خطا در بهینه‌سازی یا بارگذاری تصویر.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span className="font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {label}
          </span>
          <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Auto WebP + ParsPack S3
          </span>
        </div>
      )}

      {/* Drag & Drop Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-white/15 hover:border-amber-500/50 bg-[#0d0f17] hover:bg-[#121520]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {isProcessing ? (
          <div className="py-4 space-y-2 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-bold text-white">در حال تبدیل به WebP و بارگذاری در استورج پارس‌پک...</span>
            <span className="text-[11px] text-zinc-400">کاهش حجم هوشمند و فشرده‌سازی لایه‌ای</span>
          </div>
        ) : optimizedResult && s3Result ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
            {/* Thumbnail Preview */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-400/40 bg-black shrink-0 relative">
                <img
                  src={optimizedResult.dataUrl}
                  alt="پیش‌نمایش"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-center text-amber-400 font-mono">
                  WEBP
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تصویر با موفقیت در پارس‌پک ذخیره شد</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {optimizedResult.width}×{optimizedResult.height} پیکسل
                </div>
              </div>
            </div>

            {/* Compression Efficiency Card */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
              <div className="text-center">
                <div className="text-[10px] text-zinc-400">حجم اولیه</div>
                <div className="font-mono text-red-400 line-through">
                  {formatBytes(optimizedResult.originalSize)}
                </div>
              </div>
              <ArrowDown className="w-4 h-4 text-amber-400" />
              <div className="text-center">
                <div className="text-[10px] text-zinc-400">حجم نهایی WebP</div>
                <div className="font-mono text-emerald-400 font-bold">
                  {formatBytes(optimizedResult.optimizedSize)}
                </div>
              </div>
              <div className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-1 rounded-lg text-xs font-mono">
                {optimizedResult.savingsPercent}%- کاهش
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 space-y-2 flex flex-col items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-white">
              کلیک کنید یا فایل عکس را به اینجا بکشید
            </div>
            <p className="text-[11px] text-zinc-400">
              تبدیل خودکار به فرمت کم‌حجم WebP و ذخیره در کلاود استورج ParsPack S3
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
