import React, { useEffect } from 'react';
import { getOrganizationSchema, getWebSiteSchema, getBreadcrumbSchema } from '../seo/schemas';
import { Store, EquipmentItem } from '../types';

interface SEOHeadProps {
  stores?: Store[];
  equipment?: EquipmentItem[];
  activeStore?: Store | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeStore }) => {
  useEffect(() => {
    // Dynamic page title
    if (activeStore) {
      document.title = `${activeStore.name} | معرفی فروشگاه ورزشی در spman.ir`;
    } else {
      document.title = 'اس پی من (spman.ir) | مرجع معرفی فروشگاه‌های لوازم ورزشی';
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

    const schemas = [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getBreadcrumbSchema(),
    ];

    scriptTag.textContent = JSON.stringify(schemas);
  }, [activeStore]);

  return null;
};
