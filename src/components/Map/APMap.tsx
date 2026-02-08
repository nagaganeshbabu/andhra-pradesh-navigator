import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface APMapProps {
  source: Location | null;
  destination: Location | null;
  route: [number, number][] | null;
  onMapClick: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
}

// Custom marker icons
const createIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const sourceIcon = createIcon('#10b981');
const destinationIcon = createIcon('#ef4444');
const selectedIcon = createIcon('#0ea5e9');

// Andhra Pradesh capitals
const capitals = [
  { name: 'Amaravati (Capital)', lat: 16.5131, lng: 80.5167 },
  { name: 'Visakhapatnam (Judicial Capital)', lat: 17.6868, lng: 83.2185 },
  { name: 'Kurnool (Historical)', lat: 15.8281, lng: 78.0373 },
];

const capitalIcon = createIcon('#f59e0b');

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Auto-fit bounds when route changes
function FitBounds({ source, destination, route }: { 
  source: Location | null; 
  destination: Location | null;
  route: [number, number][] | null;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (source && destination) {
      const bounds = L.latLngBounds([
        [source.lat, source.lng],
        [destination.lat, destination.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (source) {
      map.setView([source.lat, source.lng], 12);
    } else if (destination) {
      map.setView([destination.lat, destination.lng], 12);
    }
  }, [source, destination, route, map]);
  
  return null;
}

const APMap = ({ source, destination, route, onMapClick, selectedLocation }: APMapProps) => {
  // Center on Andhra Pradesh
  const apCenter: [number, number] = [15.9129, 79.7400];
  const defaultZoom = 7;

  return (
    <MapContainer
      center={apCenter}
      zoom={defaultZoom}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      <MapClickHandler onMapClick={onMapClick} />
      <FitBounds source={source} destination={destination} route={route} />
      
      {/* Capital markers */}
      {capitals.map((capital) => (
        <Marker key={capital.name} position={[capital.lat, capital.lng]} icon={capitalIcon}>
          <Popup>
            <div className="font-medium">{capital.name}</div>
          </Popup>
        </Marker>
      ))}
      
      {/* Source marker */}
      {source && (
        <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
          <Popup>
            <div className="font-medium text-emerald-600">Start: {source.name}</div>
          </Popup>
        </Marker>
      )}
      
      {/* Destination marker */}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>
            <div className="font-medium text-red-600">End: {destination.name}</div>
          </Popup>
        </Marker>
      )}
      
      {/* Selected location marker */}
      {selectedLocation && !source && !destination && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={selectedIcon}>
          <Popup>
            <div className="text-sm">
              <div className="font-medium">Selected Location</div>
              <div className="text-muted-foreground">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Route polyline */}
      {route && route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: '#0ea5e9',
            weight: 5,
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
    </MapContainer>
  );
};

export default APMap;
