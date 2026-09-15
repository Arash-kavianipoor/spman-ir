import { SEO_CONFIG } from './config';
import { Store, EquipmentItem } from '../types';

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.organization.name,
    "alternateName": "Sport Man Iran",
    "url": SEO_CONFIG.siteUrl,
    "logo": SEO_CONFIG.organization.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SEO_CONFIG.organization.contactPoint.telephone,
      "contactType": "customer service",
      "areaServed": "IR",
      "availableLanguage": "fa"
    }
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.siteUrl,
    "description": SEO_CONFIG.defaultDescription,
    "inLanguage": "fa-IR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SEO_CONFIG.siteUrl}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function getStoreLocalBusinessSchema(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    "name": store.name,
    "description": store.description,
    "image": store.images,
    "telephone": [store.phones.mobile1, store.phones.mobile2, store.phones.landline].filter(Boolean),
    "url": store.website || `${SEO_CONFIG.siteUrl}/#store-${store.id}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": store.address,
      "addressLocality": store.city,
      "addressRegion": store.city,
      "addressCountry": "IR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": store.coordinates.lat,
      "longitude": store.coordinates.lng
    },
    "aggregateRating": store.rating ? {
      "@type": "AggregateRating",
      "ratingValue": store.rating.toString(),
      "reviewCount": (store.reviewCount || 10).toString()
    } : undefined
  };
}

export function getStoresItemListSchema(stores: Store[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "فروشگاه‌های معتبر لوازم ورزشی ایران",
    "description": "فهرست برترین فروشگاه‌های تجهیزات و لوازم ورزشی در منیریه تهران و سراسر کشور",
    "itemListElement": stores.map((store, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SportingGoodsStore",
        "name": store.name,
        "description": store.description,
        "image": Array.isArray(store.images) && store.images.length > 0 ? store.images[0] : undefined,
        "telephone": store.phones?.mobile1 || store.phones?.landline,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": store.address,
          "addressLocality": store.city,
          "addressCountry": "IR"
        }
      }
    }))
  };
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "چگونه می‌توانم فروشگاه لوازم ورزشی خود را در سامانه SPMAN ثبت کنم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "از طریق فرم ثبت فروشگاه در سایت یا تماس مستقیم با واحد پشتیبانی، مشخصات فروشگاه به همراه ۳ عکس اختصاصی و لوکیشن دقیق ثبت و پس از تایید مدیر منتشر می‌شود."
        }
      },
      {
        "@type": "Question",
        "name": "آیا دسترسی به اطلاعات تماس و نقشه فروشگاه‌ها رایگان است؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بله، تمام اطلاعات تماس مستقیم (موبایل و تلفن ثابت)، مسیریابی زنده روی نقشه و گالری تصاویر فروشگاه‌ها برای عموم کاربران کاملاً رایگان است."
        }
      },
      {
        "@type": "Question",
        "name": "آیا تصاویر فروشگاه‌ها قبل از بارگذاری بهینه می‌شوند؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بله، سیستم خودکار کاهش حجم و تبدیل تصاویر به فرمت مدرن WebP موجب بارگذاری فوق‌سریع و صرفه‌جویی در مصرف اینترنت کاربران می‌گردد."
        }
      }
    ]
  };
}

export function getEquipmentProductSchema(equipment: EquipmentItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": equipment.title,
    "image": equipment.image,
    "description": equipment.description,
    "category": equipment.category,
    "brand": {
      "@type": "Brand",
      "name": "SPMAN Featured Gear"
    }
  };
}

export function getBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "صفحه اصلی",
        "item": `${SEO_CONFIG.siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "فهرست فروشگاه‌های ورزشی",
        "item": `${SEO_CONFIG.siteUrl}/#stores`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "گالری لوازم ورزشی",
        "item": `${SEO_CONFIG.siteUrl}/#equipment`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "ثبت فروشگاه جدید",
        "item": `${SEO_CONFIG.siteUrl}/#register`
      }
    ]
  };
}

