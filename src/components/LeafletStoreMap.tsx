import React from 'react';
import { SingleStoreLeafletMap } from './SingleStoreLeafletMap';

export interface LeafletStoreMapProps {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
  zoom?: number;
  className?: string;
}

export const LeafletStoreMap: React.FC<LeafletStoreMapProps> = ({
  lat,
  lng,
  name = 'فروشگاه',
  address,
  zoom = 16,
  className = '',
}) => {
  return (
    <SingleStoreLeafletMap
      lat={lat}
      lng={lng}
      storeName={name}
      storeAddress={address}
      zoom={zoom}
      className={className}
    />
  );
};
