import React, { useState, useEffect } from 'react';
import { Search, History, MapPin } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { AirQualityCard } from './components/AirQualityCard';
import { WeatherAlertCard } from './components/WeatherAlertCard';
import { TimeCard } from './components/TimeCard';
import { getWeather, getForecast, getAirQuality, getWeatherAlerts, getWeatherByCoords, getForecastByCoords } from './api';
import { WeatherData, ForecastData, AirQualityData, WeatherAlertData, TemperatureUnit } from './types';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlertData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError('');
      const [weatherData, forecastData] = await Promise.all([
        getWeather(cityName, unit),
        getForecast(cityName, unit)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);

      const [airQualityData, alertsData] = await Promise.all([
        getAirQuality(weatherData.coord.lat, weatherData.coord.lon),
        getWeatherAlerts(weatherData.coord.lat, weatherData.coord.lon)
      ]);
      
      setAirQuality(airQualityData);
      setWeatherAlerts(alertsData);

      setRecentSearches(prev => {
        const newSearches = [cityName, ...prev.filter(s => s !== cityName)].slice(0, 5);
        return newSearches;
      });
    } catch (err) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const fetchWeatherByLocation = async (position: GeolocationPosition) => {
    try {
      setLoading(true);
      setError('');
      const { latitude: lat, longitude: lon } = position.coords;
      
      const [weatherData, forecastData, airQualityData, alertsData] = await Promise.all([
        getWeatherByCoords(lat, lon, unit),
        getForecastByCoords(lat, lon, unit),
        getAirQuality(lat, lon),
        getWeatherAlerts(lat, lon)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(airQualityData);
      setWeatherAlerts(alertsData);
      setCity(weatherData.name);

      setRecentSearches(prev => {
        const newSearches = [weatherData.name, ...prev.filter(s => s !== weatherData.name)].slice(0, 5);
        return newSearches;
      });
    } catch (err) {
      setError('Failed to get weather data for your location.');
    } finally {
      setLoading(false);
      setGettingLocation(false);
      setInitialLoad(false);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        fetchWeatherByLocation,
        (error) => {
          setError('Unable to get your location. Please allow location access or enter a city manually.');
          setGettingLocation(false);
          setInitialLoad(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setGettingLocation(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (weather && !loading) {
      fetchWeatherData(weather.name);
    }
  }, [unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getBackgroundImage = () => {
    if (!weather) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80';
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes('clear')) {
      return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80';
    } else if (condition.includes('cloud')) {
      return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80';
    } else if (condition.includes('rain')) {
      return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80';
    }
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80';
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
            <p className="text-white/80">Real-time weather and local information at your fingertips</p>
          </div>

          {initialLoad && !error ? (
            <div className="flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md rounded-lg p-8 shadow-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-800">Detecting your location...</p>
                <p className="text-gray-600 text-sm mt-2">Please allow location access when prompted</p>
              </div>
            </div>
          ) : (
            <>
              {/* Search Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 max-w-md mx-auto mb-4">
                  <form onSubmit={handleSubmit} className="relative flex-1">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city name..."
                      className="w-full px-4 py-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </form>
                  <button
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg text-blue-500 hover:bg-white/100 transition-colors disabled:opacity-50"
                    title="Use my location"
                  >
                    <MapPin className="w-6 h-6" />
                  </button>
                </div>

                {recentSearches.length > 0 && (
                  <div className="flex items-center gap-2 justify-center flex-wrap">
                    <History className="w-4 h-4 text-white/80" />
                    {recentSearches.map(search => (
                      <button
                        key={search}
                        onClick={() => {
                          setCity(search);
                          fetchWeatherData(search);
                        }}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="text-red-500 text-center bg-white/90 backdrop-blur-md rounded-lg p-4 max-w-md mx-auto mb-8">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md rounded-lg p-8 shadow-lg text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-800">Loading weather data...</p>
                  </div>
                </div>
              ) : (
                weather && forecast && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <WeatherCard 
                        data={weather} 
                        unit={unit} 
                        onUnitToggle={toggleUnit}
                      />
                    </div>
                    <div>
                      <TimeCard 
                        timezone={weather.timezone} 
                        cityName={`${weather.name}, ${weather.sys.country}`}
                      />
                    </div>
                    <div className="xl:col-span-2">
                      <ForecastCard 
                        data={forecast}
                        unit={unit}
                      />
                    </div>
                    <div>
                      {airQuality && <AirQualityCard data={airQuality} />}
                    </div>
                    <div className="xl:col-span-3">
                      <WeatherAlertCard 
                        location={weather.name} 
                        alerts={weatherAlerts?.alerts}
                      />
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;