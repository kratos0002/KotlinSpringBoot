import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Store } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Fix for default marker icon in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
}

interface Provider {
  id: string;
  name: string;
  category: number;
  address: string;
  location: Location;
  rating: number;
}

interface MapViewProps {
  providers: Provider[];
  center: Location;
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({
  providers,
  center,
  zoom = 13
}) => {
  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.location.lat, provider.location.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-sm text-muted-foreground">{provider.address}</p>
                <div className="flex items-center mt-2">
                  <Store className="w-4 h-4 mr-1" />
                  <span className="text-sm">Rating: {provider.rating}/5</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

export default MapView; 