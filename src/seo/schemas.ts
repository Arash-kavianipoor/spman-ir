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
