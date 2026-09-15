import React, { useEffect } from 'react';
import { 
  getOrganizationSchema, 
  getWebSiteSchema, 
  getBreadcrumbSchema, 
  getFAQSchema,
  getStoresItemListSchema,
  getStoreLocalBusinessSchema 
} from '../seo/schemas';
import { Store, EquipmentItem } from '../types';

interface SEOHeadProps {
  stores?: Store[];
  equipment?: EquipmentItem[];
  activeStore?: Store | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ stores = [], activeStore }) => {
  useEffect(() => {
    // Dynamic page title
    if (activeStore) {
      document.title = `${activeStore.name} | معرفی فروشگاه ورزشی در spman.ir`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${activeStore.name} - ${activeStore.description.slice(0, 150)}... آدرس: ${activeStore.address}، تماس: ${activeStore.phones.mobile1 || activeStore.phones.landline}`);
      }
    } else {
      document.title = 'اس پی من (spman.ir) | مرجع معرفی فروشگاه‌های لوازم ورزشی';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'سامانه تخصصی معرفی برترین فروشگاه‌های لوازم و تجهیزات ورزشی ایران (Sport Man). آدرس، نقشه زنده، شماره تماس و گالری تصاویر فروشگاه‌های دوچرخه، بدنسازی، کوهنوردی و...');
      }
    }

    // Inject / Update JSON-LD Script
    const scriptId = 'spman-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: any[] = [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getBreadcrumbSchema(),
      getFAQSchema(),
    ];

    if (stores && stores.length > 0) {
      schemas.push(getStoresItemListSchema(stores));
    }

    if (activeStore) {
      schemas.push(getStoreLocalBusinessSchema(activeStore));
    }

    scriptTag.textContent = JSON.stringify(schemas);
  }, [activeStore, stores]);

  return null;
};

