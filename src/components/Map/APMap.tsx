import { useEffect, useRef, useState } from 'react';
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

// Andhra Pradesh capitals
const capitals = [
  { name: 'Amaravati (Capital)', lat: 16.5131, lng: 80.5167 },
  { name: 'Visakhapatnam (Judicial Capital)', lat: 17.6868, lng: 83.2185 },
  { name: 'Kurnool (Historical)', lat: 15.8281, lng: 78.0373 },
];

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
const capitalIcon = createIcon('#f59e0b');

const APMap = ({ source, destination, route, onMapClick, selectedLocation }: APMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [15.9129, 79.7400],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Add capital markers
    capitals.forEach((capital) => {
      L.marker([capital.lat, capital.lng], { icon: capitalIcon })
        .addTo(map)
        .bindPopup(`<strong>${capital.name}</strong>`);
    });

    // Handle map clicks
    map.on('click', (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onMapClick]);

  // Update markers when source/destination changes
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add source marker
    if (source) {
      const marker = L.marker([source.lat, source.lng], { icon: sourceIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong style="color: #10b981;">Start: ${source.name}</strong>`);
      markersRef.current.push(marker);
    }

    // Add destination marker
    if (destination) {
      const marker = L.marker([destination.lat, destination.lng], { icon: destinationIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong style="color: #ef4444;">End: ${destination.name}</strong>`);
      markersRef.current.push(marker);
    }

    // Add selected location marker
    if (selectedLocation && !source && !destination) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: selectedIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong>Selected Location</strong><br/>${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
      markersRef.current.push(marker);
    }

    // Fit bounds to markers
    if (source && destination) {
      const bounds = L.latLngBounds([
        [source.lat, source.lng],
        [destination.lat, destination.lng]
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (source) {
      mapRef.current.setView([source.lat, source.lng], 12);
    } else if (destination) {
      mapRef.current.setView([destination.lat, destination.lng], 12);
    }
  }, [source, destination, selectedLocation, isMapReady]);

  // Update route when it changes
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Add new route
    if (route && route.length > 0) {
      const polyline = L.polyline(route, {
        color: '#0ea5e9',
        weight: 5,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapRef.current);
      
      routeLayerRef.current = polyline;
      
      // Fit to route bounds
      const bounds = L.latLngBounds(route);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, isMapReady]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default APMap;
