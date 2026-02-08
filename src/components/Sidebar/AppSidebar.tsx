import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation2, 
  MapPin, 
  Route, 
  Clock, 
  Zap,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationSearch from './LocationSearch';
import { cn } from '@/lib/utils';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface AppSidebarProps {
  source: Location | null;
  destination: Location | null;
  onSourceChange: (location: Location | null) => void;
  onDestinationChange: (location: Location | null) => void;
  onRouteCalculate: (route: [number, number][]) => void;
}

const AppSidebar = ({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onRouteCalculate,
}: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const calculateRoute = async () => {
    if (!source || !destination) return;
    
    setIsCalculating(true);
    
    // Simulate route calculation with a simple straight-line path
    // In production, you'd use a routing API like OSRM or GraphHopper
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate intermediate points for a curved route
    const points: [number, number][] = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Add slight curve for visual interest
      const curve = Math.sin(t * Math.PI) * 0.2;
      const lat = source.lat + (destination.lat - source.lat) * t + curve;
      const lng = source.lng + (destination.lng - source.lng) * t;
      points.push([lat, lng]);
    }
    
    // Calculate approximate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (destination.lat - source.lat) * Math.PI / 180;
    const dLon = (destination.lng - source.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(source.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimate duration (assuming average speed of 60 km/h)
    const durationHours = distance / 60;
    const hours = Math.floor(durationHours);
    const minutes = Math.round((durationHours - hours) * 60);
    
    setRouteInfo({
      distance: `${distance.toFixed(1)} km`,
      duration: hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`
    });
    
    onRouteCalculate(points);
    setIsCalculating(false);
  };

  const swapLocations = () => {
    const tempSource = source;
    onSourceChange(destination);
    onDestinationChange(tempSource);
    setRouteInfo(null);
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isCollapsed ? -320 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-80 bg-card border-r border-border z-40 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
              <Navigation2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">AP Navigator</h1>
              <p className="text-xs text-muted-foreground">Spatial Analysis Tool</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Start Location
              </label>
              <LocationSearch
                placeholder="Enter start location..."
                value={source}
                onChange={onSourceChange}
                icon={<MapPin className="h-5 w-5" />}
                iconColor="text-emerald-500"
              />
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={swapLocations}
                disabled={!source && !destination}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-coral" />
                Destination
              </label>
              <LocationSearch
                placeholder="Enter destination..."
                value={destination}
                onChange={onDestinationChange}
                icon={<MapPin className="h-5 w-5" />}
                iconColor="text-coral"
              />
            </div>

            {/* Calculate Route Button */}
            <Button
              onClick={calculateRoute}
              disabled={!source || !destination || isCalculating}
              className="w-full h-12 gradient-ocean text-primary-foreground font-medium shadow-glow hover:opacity-90 transition-opacity"
            >
              {isCalculating ? (
                <>
                  <Zap className="h-5 w-5 mr-2 animate-pulse" />
                  Calculating...
                </>
              ) : (
                <>
                  <Route className="h-5 w-5 mr-2" />
                  Calculate Route
                </>
              )}
            </Button>

            {/* Route Info */}
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/50 rounded-xl p-4 space-y-3"
              >
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Route Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Distance</div>
                    <div className="font-display text-lg font-bold text-foreground">{routeInfo.distance}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Est. Time</div>
                    <div className="font-display text-lg font-bold text-foreground">{routeInfo.duration}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Tips</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Click on the map to select a location</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Route className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Enter both locations to calculate routes</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Route times are estimates based on average speeds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2024 AP Navigator • Andhra Pradesh
          </div>
        </div>
      </motion.aside>

      {/* Collapse/Expand Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-card rounded-r-lg shadow-elevated border border-l-0 border-border transition-all",
          isCollapsed ? "left-0" : "left-80"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5 text-foreground" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-foreground" />
        )}
      </motion.button>
    </>
  );
};

export default AppSidebar;
