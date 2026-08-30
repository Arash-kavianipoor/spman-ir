export interface StorePhones {
  mobile1: string;
  mobile2: string;
  landline: string;
}

export interface StoreCoordinates {
  lat: number;
  lng: number;
}

export interface StoreSocial {
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  area: string;
  address: string;
  phones: StorePhones;
  coordinates: StoreCoordinates;
  social: StoreSocial;
  website?: string;
  images: [string, string, string] | string[];
  description: string;
  workingHours: string;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface EquipmentItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  highlights: string[];
  popularity: string;
}

export interface StoreRegistrationFormState {
  storeName: string;
  managerName: string;
  category: string;
  plan: 'standard' | 'featured'; // standard: 500,000 Tomans / 1 Year, featured: 800,000 Tomans / 1 Year (Pay after publish)
  city: string;
  area: string;
  address: string;
  mobile1: string;
  mobile2: string;
  landline: string;
  lat: string;
  lng: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  website: string;
  description: string;
  workingHours: string;
  image1?: string;
  image2?: string;
  image3?: string;
}
