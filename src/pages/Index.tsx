import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layers, Maximize, Crosshair, Info } from 'lucide-react';
import APMap from '@/components/Map/APMap';
import AppSidebar from '@/components/Sidebar/AppSidebar';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

const Index = () => {
  const [source, setSource] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const handleRouteCalculate = useCallback((newRoute: [number, number][]) => {
    setRoute(newRoute);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  }, []);

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Sidebar */}
      <AppSidebar
        source={source}
        destination={destination}
        onSourceChange={setSource}
        onDestinationChange={setDestination}
        onRouteCalculate={handleRouteCalculate}
      />
      
      {/* Main Map Area */}
      <main className="flex-1 relative">
        {/* Map */}
        <div className="h-screen w-full">
          <APMap
            source={source}
            destination={destination}
            route={route}
            onMapClick={handleMapClick}
            selectedLocation={selectedLocation}
          />
        </div>
        
        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 bg-card rounded-lg shadow-card hover:shadow-elevated transition-all"
            title="Layers"
          >
            <Layers className="h-5 w-5 text-foreground" />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-card rounded-lg shadow-card hover:shadow-elevated transition-all"
            title="Fullscreen"
          >
            <Maximize className="h-5 w-5 text-foreground" />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 bg-card rounded-lg shadow-card hover:shadow-elevated transition-all"
            title="My Location"
          >
            <Crosshair className="h-5 w-5 text-foreground" />
          </motion.button>
        </div>
        
        {/* Bottom Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-card/95 backdrop-blur-lg rounded-full shadow-elevated flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-foreground">Start</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-foreground">End</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ocean" />
            <span className="text-sm text-foreground">Route</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-foreground">Capital</span>
          </div>
        </motion.div>
        
        {/* Welcome Overlay (shows briefly) */}
        {!source && !destination && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-card/95 backdrop-blur-xl rounded-2xl p-8 shadow-elevated max-w-md text-center pointer-events-auto"
            >
              <div className="w-16 h-16 rounded-2xl gradient-accent mx-auto mb-4 flex items-center justify-center shadow-glow">
                <svg className="h-8 w-8 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Welcome to AP Navigator
              </h2>
              <p className="text-muted-foreground mb-4">
                Your smart spatial analysis companion for Andhra Pradesh.
                Enter a source and destination to get started with route planning,
                weather insights, and AI-powered travel recommendations.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Use the sidebar to search locations</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
