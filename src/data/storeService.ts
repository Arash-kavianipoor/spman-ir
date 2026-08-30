import { Store, EquipmentItem, StoreRegistrationFormState } from '../types';
import { INITIAL_STORES, INITIAL_EQUIPMENT } from './defaultData';

export const ADMIN_PHONE = '09128634908';
export const ADMIN_PHONE_INTL = '989128634908';
export const SITE_DOMAIN = 'spman.ir';

/**
 * Loads stores dynamically from /data/stores.json.
 * Falls back safely to embedded INITIAL_STORES if fetch fails.
 */
export async function fetchStores(): Promise<Store[]> {
  try {
    const response = await fetch('/data/stores.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Network response was not ok');
    const data: Store[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return INITIAL_STORES;
  } catch (error) {
    console.warn('Loading stores from local fallback:', error);
    return INITIAL_STORES;
  }
}

/**
 * Loads equipment items dynamically from /data/equipment.json.
 */
export async function fetchEquipment(): Promise<EquipmentItem[]> {
  try {
    const response = await fetch('/data/equipment.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Network response was not ok');
    const data: EquipmentItem[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return INITIAL_EQUIPMENT;
  } catch (error) {
    console.warn('Loading equipment from local fallback:', error);
    return INITIAL_EQUIPMENT;
  }
}

/**
 * Formats store registration data into a neat Persian message for WhatsApp / Telegram.
 * Includes explicit numeric coordinates, notice for photos, and complete JSON code block.
 */
export function formatStoreRegistrationMessage(formData: StoreRegistrationFormState): string {
  const jsonBlock = generateStoreJsonSnippet(formData);
  const latNum = parseFloat(formData.lat) || 35.6812;
  const lngNum = parseFloat(formData.lng) || 51.3995;

  const planText = formData.plan === 'featured'
    ? '⭐ آگهی ویژه (طلایی) - ۸۰۰,۰۰۰ تومان (مدت ۱ سال) - پرداخت پس از انتشار'
    : '🔹 آگهی استاندارد - ۵۰۰,۰۰۰ تومان (مدت ۱ سال) - پرداخت پس از انتشار';

  return `🏆 درخواست ثبت فروشگاه ورزشی در سامانه SPMAN (spman.ir) 🏆

💎 نوع تعرفه درخواستی:
${planText}
(نکته: پرداخت هزینه طبق قوانین سامانه پس از انتشار رسمی آگهی انجام خواهد شد)

📌 مشخصات واحد ورزشی:
• نام فروشگاه / باشگاه: ${formData.storeName || '-'}
• مدیریت: ${formData.managerName || '-'}
• دسته‌بندی و تخصص: ${formData.category || '-'}
• ساعات کاری: ${formData.workingHours || '-'}

📍 آدرس و موقعیت مکانی:
• استان / شهر: ${formData.city || '-'}
• منطقه / محله: ${formData.area || '-'}
• آدرس دقیق: ${formData.address || '-'}

📞 شماره‌های تماس:
• موبایل اصلی: ${formData.mobile1 || '-'}
• موبایل دوم: ${formData.mobile2 || '-'}
• تلفن ثابت: ${formData.landline || '-'}

🗺️ مختصات دقیق جغرافیایی (عددی برای نقشه گوگل):
• عرض جغرافیایی (Latitude): ${latNum.toFixed(6)}
• طول جغرافیایی (Longitude): ${lngNum.toFixed(6)}
• لینک مستقیم گوگل مپ: https://maps.google.com/?q=${latNum},${lngNum}

🌐 شبکه‌های اجتماعی و وب‌سایت:
• اینستاگرام: ${formData.instagram || '-'}
• تلگرام: ${formData.telegram || '-'}
• واتساپ: ${formData.whatsapp || '-'}
• وب‌سایت: ${formData.website || '-'}

📝 توضیحات و برندهای فروشگاه:
${formData.description || '-'}

📸 تصاویر فروشگاه / باشگاه:
عکس‌های باکیفیت (شامل نمای تابلو، ویترین و فضای داخلی لوازم ورزشی/سالن تمرین) به همراه همین پیام در چت ارسال می‌گردد.

------------------------------------
📋 فایل و کد JSON آماده افزودن به سیستم:
${jsonBlock}`;
}

/**
 * Generates the JSON snippet to be added to /public/data/stores.json
 */
export function generateStoreJsonSnippet(formData: StoreRegistrationFormState): string {
  const latNum = parseFloat(formData.lat) || 35.6812;
  const lngNum = parseFloat(formData.lng) || 51.3995;

  const newStoreObject = {
    id: `store-${Date.now()}`,
    name: formData.storeName || 'فروشگاه ورزشی',
    slug: (formData.storeName || 'sport-store')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-'),
    category: formData.category || 'لوازم و تجهیزات ورزشی',
    city: formData.city || 'تهران',
    area: formData.area || 'مرکز',
    address: formData.address || '',
    phones: {
      mobile1: formData.mobile1 || '',
      mobile2: formData.mobile2 || '',
      landline: formData.landline || '',
    },
    coordinates: {
      lat: Number(latNum.toFixed(6)),
      lng: Number(lngNum.toFixed(6)),
    },
    social: {
      whatsapp: formData.whatsapp ? `https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}` : '',
      telegram: formData.telegram ? (formData.telegram.startsWith('http') ? formData.telegram : `https://t.me/${formData.telegram.replace('@', '')}`) : '',
      instagram: formData.instagram ? (formData.instagram.startsWith('http') ? formData.instagram : `https://instagram.com/${formData.instagram.replace('@', '')}`) : '',
    },
    website: formData.website || '',
    images: [
      formData.image1 || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000',
      formData.image2 || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
      formData.image3 || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000',
    ],
    description: formData.description || '',
    workingHours: formData.workingHours || '۹:۰۰ الی ۲۱:۰۰',
    featured: formData.plan === 'featured',
    rating: 5.0,
    reviewCount: 1,
  };

  return JSON.stringify(newStoreObject, null, 2);
}
