import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Navigation as NavigationIcon, MapPin, AlertTriangle, CheckCircle, CloudSun, X, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface Tree {
  id: number;
  lat: number;
  lng: number;
  species: string;
  health: 'healthy' | 'at-risk' | 'critical';
  lastInspection: string;
}

interface HomePageProps {
  currentUser: any;
  onNavigate?: (page: string) => void;
}

export function HomePage({ currentUser, onNavigate }: HomePageProps) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [routeActive, setRouteActive] = useState(false);
  const [currentTemp, setCurrentTemp] = useState<number>(18);
  const [showTreeList, setShowTreeList] = useState(false);

  useEffect(() => {
    // Load or initialize tree data
    const savedTrees = localStorage.getItem('trees');
    if (savedTrees) {
      setTrees(JSON.parse(savedTrees));
    } else {
      // Initialize with sample data
      const sampleTrees: Tree[] = [
        { id: 1, lat: 45.5231, lng: -122.6765, species: 'Douglas Fir', health: 'healthy', lastInspection: '2025-10-10' },
        { id: 2, lat: 45.5251, lng: -122.6785, species: 'Western Red Cedar', health: 'at-risk', lastInspection: '2025-10-08' },
        { id: 3, lat: 45.5271, lng: -122.6805, species: 'Sitka Spruce', health: 'healthy', lastInspection: '2025-10-12' },
        { id: 4, lat: 45.5291, lng: -122.6825, species: 'Hemlock', health: 'critical', lastInspection: '2025-10-05' },
        { id: 5, lat: 45.5311, lng: -122.6845, species: 'Noble Fir', health: 'healthy', lastInspection: '2025-10-14' },
        { id: 6, lat: 45.5331, lng: -122.6865, species: 'Douglas Fir', health: 'at-risk', lastInspection: '2025-10-09' },
      ];
      setTrees(sampleTrees);
      localStorage.setItem('trees', JSON.stringify(sampleTrees));
    }

    // Load current weather temperature
    loadCurrentWeather();
    
    // Update weather every 10 minutes
    const weatherInterval = setInterval(loadCurrentWeather, 600000);
    return () => clearInterval(weatherInterval);
  }, []);

  const loadCurrentWeather = () => {
    // In a real app, this would fetch from a weather API
    // For now, simulate with slight variations
    const temp = 14 + Math.floor(Math.random() * 8); // Random temp between 14-21°C
    setCurrentTemp(temp);
  };

  const startNavigation = () => {
    setRouteActive(true);
    alert('Navigation started! Follow the route to visit all marked trees.');
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'at-risk': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white">Forest Map</h1>
            <p className="text-green-100 text-sm">{trees.length} trees tracked</p>
          </div>
          <Button 
            onClick={() => onNavigate?.('weather')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CloudSun className="w-4 h-4 mr-1" />
            {currentTemp}°C
          </Button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative w-full h-[50vh] bg-gray-100">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1511497584788-876760111969?w=800"
          alt="Forest aerial view"
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Tree markers overlay */}
        <div className="absolute inset-0">
          {trees.map((tree, index) => (
            <div
              key={tree.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all active:scale-95"
              style={{
                left: `${20 + (index % 3) * 25}%`,
                top: `${20 + Math.floor(index / 3) * 30}%`,
              }}
              onClick={() => setSelectedTree(tree)}
            >
              <div className={`relative ${routeActive ? 'animate-pulse' : ''}`}>
                <MapPin 
                  className={`w-10 h-10 ${ 
                    tree.health === 'healthy' ? 'text-green-600' :
                    tree.health === 'at-risk' ? 'text-yellow-600' :
                    'text-red-600'
                  } drop-shadow-lg`}
                  fill="currentColor"
                />
                <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs border-2 border-gray-300">
                  {tree.id}
                </div>
              </div>
            </div>
          ))}
          
          {/* Route path visualization */}
          {routeActive && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 20% 20% Q 35% 30%, 45% 20% T 70% 50% T 45% 80%"
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button size="sm" className="bg-white text-gray-900 shadow-lg w-10 h-10 p-0 hover:bg-gray-100">+</Button>
          <Button size="sm" className="bg-white text-gray-900 shadow-lg w-10 h-10 p-0 hover:bg-gray-100">-</Button>
        </div>

        {/* Tree list toggle button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button 
            onClick={() => setShowTreeList(!showTreeList)}
            className="bg-white text-gray-900 shadow-lg hover:bg-gray-100 rounded-full"
          >
            <ChevronUp className={`w-5 h-5 mr-2 transition-transform ${showTreeList ? 'rotate-180' : ''}`} />
            Tree List ({trees.length})
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-b border-gray-200">
        <Button 
          onClick={startNavigation}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
        >
          <NavigationIcon className="w-5 h-5 mr-2" />
          Start Route Navigation
        </Button>
      </div>

      {/* Tree List Sheet */}
      {showTreeList && (
        <div className="bg-white border-t border-gray-200 max-h-[35vh] overflow-y-auto">
          <div className="p-4 space-y-3">
            {trees.map((tree) => (
              <div
                key={tree.id}
                onClick={() => {
                  setSelectedTree(tree);
                  setShowTreeList(false);
                }}
                className={`p-4 border rounded-lg active:bg-gray-50 transition-colors ${
                  selectedTree?.id === tree.id ? 'border-green-600 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        #{tree.id}
                      </span>
                      <span className={`flex items-center space-x-1 ${getHealthColor(tree.health)}`}>
                        {getHealthIcon(tree.health)}
                        <span className="text-xs capitalize">{tree.health}</span>
                      </span>
                    </div>
                    <p className="font-medium">{tree.species}</p>
                    <p className="text-sm text-gray-500">
                      {tree.lat.toFixed(4)}, {tree.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last: {tree.lastInspection}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tree Details */}
      {selectedTree && !showTreeList && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-green-700">Tree #{selectedTree.id}</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedTree(null)}
              className="h-8 w-8 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-xs text-gray-500">Species</p>
              <p className="font-medium">{selectedTree.species}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Health Status</p>
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded ${getHealthBadgeColor(selectedTree.health)}`}>
                {getHealthIcon(selectedTree.health)}
                <span className="capitalize text-sm">{selectedTree.health}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Coordinates</p>
              <p className="text-sm">{selectedTree.lat.toFixed(4)}, {selectedTree.lng.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Inspection</p>
              <p className="text-sm">{selectedTree.lastInspection}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <NavigationIcon className="w-4 h-4 mr-2" />
              Navigate Here
            </Button>
            <Button variant="outline" className="w-full">
              View History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}