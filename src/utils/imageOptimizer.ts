import { OptimizedImage } from '../types';

interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.82)
}

/**
 * Optimizes an image: resizes to max bounds and encodes to modern WebP format
 * significantly reducing bandwidth and storage usage (up to 75-90% savings).
 */
export async function optimizeImageToWebP(
  file: File | Blob,
  fileName: string = 'image.webp',
  options: OptimizeOptions = {}
): Promise<OptimizedImage> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw to HTML5 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        const dataUrl = canvas.toDataURL('image/webp', quality);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create WebP blob'));
              return;
            }

            const optimizedSize = blob.size;
            const savingsPercent = Math.max(
              0,
              Math.round(((originalSize - optimizedSize) / originalSize) * 100)
            );

            // Create WebP file name
            const cleanName = fileName.replace(/\.[^/.]+$/, '') + '.webp';
            const optimizedFile = new File([blob], cleanName, { type: 'image/webp' });

            resolve({
              file: optimizedFile,
              dataUrl,
              originalName: fileName,
              originalSize,
              optimizedSize,
              width,
              height,
              savingsPercent,
              format: 'webp',
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Could not load image for optimization'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Batch processes an array of image files to WebP format concurrently
 */
export async function batchOptimizeImages(
  files: File[],
  options?: OptimizeOptions
): Promise<OptimizedImage[]> {
  const promises = files.map((file) =>
    optimizeImageToWebP(file, file.name, options)
  );
  return Promise.all(promises);
}

/**
 * Format bytes to readable string (e.g., 240 KB, 1.4 MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
