import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  CloudRain, 
  Cloud, 
  Sun, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset,
  ArrowLeft,
  MapPin,
  ThermometerSun,
  RefreshCw
} from 'lucide-react';

interface WeatherPageProps {
  onBack: () => void;
}

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export function WeatherPage({ onBack }: WeatherPageProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = () => {
    const mockWeather: WeatherData = {
      current: {
        temp: 18,
        feelsLike: 16,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        pressure: 1013,
        uvIndex: 4,
      },
      forecast: [
        { day: 'Today', high: 20, low: 14, condition: 'Partly Cloudy', precipitation: 20 },
        { day: 'Tomorrow', high: 22, low: 15, condition: 'Sunny', precipitation: 10 },
        { day: 'Wed', high: 19, low: 13, condition: 'Rainy', precipitation: 80 },
        { day: 'Thu', high: 17, low: 12, condition: 'Cloudy', precipitation: 40 },
        { day: 'Fri', high: 21, low: 14, condition: 'Sunny', precipitation: 5 },
      ],
      hourly: [
        { time: '12 PM', temp: 18, condition: 'Partly Cloudy' },
        { time: '1 PM', temp: 19, condition: 'Partly Cloudy' },
        { time: '2 PM', temp: 20, condition: 'Sunny' },
        { time: '3 PM', temp: 20, condition: 'Sunny' },
        { time: '4 PM', temp: 19, condition: 'Partly Cloudy' },
        { time: '5 PM', temp: 18, condition: 'Cloudy' },
        { time: '6 PM', temp: 17, condition: 'Cloudy' },
        { time: '7 PM', temp: 16, condition: 'Cloudy' },
      ],
      alerts: [
        {
          type: 'Wind Advisory',
          message: 'Strong winds expected in the afternoon. Be cautious when working with tall trees.',
          severity: 'medium',
        },
      ],
    };

    setWeather(mockWeather);
    setLastUpdated(new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
  };

  const getWeatherIcon = (condition: string, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-16 h-16' : 'w-6 h-6';
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return <CloudRain className={`${sizeClass} text-blue-600`} />;
    if (cond.includes('cloud')) return <Cloud className={`${sizeClass} text-gray-600`} />;
    if (cond.includes('sun')) return <Sun className={`${sizeClass} text-yellow-500`} />;
    return <Cloud className={`${sizeClass} text-gray-600`} />;
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default: return 'bg-blue-50 border-blue-300 text-blue-800';
    }
  };

  if (!weather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-blue-600 text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center space-x-3 mb-3">
          <button 
            onClick={onBack}
            className="p-1"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-white">Weather</h1>
            <div className="flex items-center space-x-1 text-blue-100 text-sm">
              <MapPin className="w-3 h-3" />
              <span>Portland, OR</span>
            </div>
          </div>
          <button 
            onClick={loadWeatherData}
            className="p-2 bg-blue-700 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-blue-200">
          Updated: {lastUpdated}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Weather Alerts */}
        {weather.alerts.length > 0 && (
          <div className="space-y-2">
            {weather.alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 border-2 rounded-lg ${getAlertColor(alert.severity)}`}
              >
                <p className="text-sm flex items-start space-x-2">
                  <Wind className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>{alert.type}:</strong> {alert.message}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Current Weather */}
        <Card className="border-2 border-blue-600">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {getWeatherIcon(weather.current.condition, 'lg')}
              </div>
              <div className="text-6xl mb-2">{weather.current.temp}°C</div>
              <p className="text-gray-500 mb-1">
                Feels like {weather.current.feelsLike}°C
              </p>
              <p className="text-xl text-gray-600">
                {weather.current.condition}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Humidity</p>
                  <p className="text-lg">{weather.current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Wind className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Wind</p>
                  <p className="text-lg">{weather.current.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Visibility</p>
                  <p className="text-lg">{weather.current.visibility} km</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Gauge className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Pressure</p>
                  <p className="text-lg">{weather.current.pressure} mb</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ThermometerSun className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm">UV Index: <strong>{weather.current.uvIndex}</strong></span>
                </div>
                <span className="text-xs text-gray-600">Moderate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-2">
              <div className="flex space-x-3 px-2">
                {weather.hourly.map((hour, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 text-center p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-[80px]"
                  >
                    <p className="text-xs text-gray-600 mb-2">{hour.time}</p>
                    <div className="flex justify-center my-2">
                      {getWeatherIcon(hour.condition)}
                    </div>
                    <p className="text-lg mb-1">{hour.temp}°</p>
                    <p className="text-xs text-gray-500">{hour.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weather.forecast.map((day, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <p className="w-16 text-sm">{day.day}</p>
                    <div className="flex-shrink-0">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <p className="text-sm text-gray-600 flex-1">{day.condition}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3 text-blue-600" />
                      <span className="text-xs text-blue-600">{day.precipitation}%</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="text-gray-900">{day.high}°</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-600">{day.low}°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sun Times */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Sunrise className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sunrise</p>
                  <p className="text-lg">6:42 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Sunset className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sunset</p>
                  <p className="text-lg">6:15 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Working Conditions */}
        <Card className="border-2 border-green-600">
          <CardHeader>
            <CardTitle>Field Work Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">Overall</p>
                <p className="text-lg text-green-600">Good</p>
                <p className="text-xs text-gray-500 mt-1">Safe</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">Fire Risk</p>
                <p className="text-lg text-yellow-600">Moderate</p>
                <p className="text-xs text-gray-500 mt-1">Caution</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">Moisture</p>
                <p className="text-lg text-blue-600">Adequate</p>
                <p className="text-xs text-gray-500 mt-1">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
