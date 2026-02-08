import { useState, useCallback } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  icon?: React.ReactNode;
  iconColor?: string;
}

// Popular locations in Andhra Pradesh for suggestions
const popularLocations: Location[] = [
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
  { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
  { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
  { name: 'Rajahmundry', lat: 17.0005, lng: 81.8040 },
  { name: 'Kakinada', lat: 16.9891, lng: 82.2475 },
  { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
  { name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
  { name: 'Anantapur', lat: 14.6819, lng: 77.6006 },
  { name: 'Kadapa', lat: 14.4674, lng: 78.8241 },
  { name: 'Amaravati', lat: 16.5131, lng: 80.5167 },
  { name: 'Eluru', lat: 16.7107, lng: 81.0952 },
  { name: 'Ongole', lat: 15.5057, lng: 80.0499 },
  { name: 'Srikakulam', lat: 18.2949, lng: 83.8935 },
  { name: 'Chittoor', lat: 13.2172, lng: 79.1003 },
];

const LocationSearch = ({ placeholder, value, onChange, icon, iconColor }: LocationSearchProps) => {
  const [query, setQuery] = useState(value?.name || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredLocations = popularLocations.filter(loc =>
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((location: Location) => {
    setQuery(location.name);
    onChange(location);
    setIsOpen(false);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(newQuery.length > 0);
    if (newQuery === '') {
      onChange(null);
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5",
          iconColor || "text-muted-foreground"
        )}>
          {icon || <Search className="h-5 w-5" />}
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-10 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        )}
      </div>
      
      {isOpen && filteredLocations.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-elevated border border-border/50 overflow-hidden z-50 animate-slide-up">
          <div className="max-h-60 overflow-y-auto">
            {filteredLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleSelect(location)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left"
              >
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <div className="font-medium text-foreground">{location.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && filteredLocations.length === 0 && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-elevated border border-border/50 p-4 z-50 animate-slide-up">
          <p className="text-sm text-muted-foreground text-center">No locations found</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
