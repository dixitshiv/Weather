import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, Sunrise, Sunset } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types';

interface Props {
  data: WeatherData;
  unit: TemperatureUnit;
  onUnitToggle: () => void;
}

export const WeatherCard: React.FC<Props> = ({ data, unit, onUnitToggle }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-lg w-full max-w-md">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{data.name}</h2>
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
          className="w-20 h-20"
        />
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-6xl font-bold text-gray-800">
            {Math.round(data.main.temp)}°{unit === 'celsius' ? 'C' : 'F'}
          </div>
          <button
            onClick={onUnitToggle}
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
          >
            Switch to °{unit === 'celsius' ? 'F' : 'C'}
          </button>
        </div>
        <p className="text-gray-600 text-xl capitalize">{data.weather[0].description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Thermometer className="text-blue-500" />
          <div>
            <p className="text-gray-500">Feels like</p>
            <p className="font-semibold">{Math.round(data.main.feels_like)}°{unit === 'celsius' ? 'C' : 'F'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-500" />
          <div>
            <p className="text-gray-500">Humidity</p>
            <p className="font-semibold">{data.main.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="text-blue-500" />
          <div>
            <p className="text-gray-500">Wind Speed</p>
            <p className="font-semibold">{data.wind.speed} {unit === 'celsius' ? 'm/s' : 'mph'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="text-blue-500" />
          <div>
            <p className="text-gray-500">Pressure</p>
            <p className="font-semibold">{data.main.pressure} hPa</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Sunrise className="text-orange-500" />
          <div>
            <p className="text-gray-500">Sunrise</p>
            <p className="font-semibold">{formatTime(data.sys.sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="text-purple-500" />
          <div>
            <p className="text-gray-500">Sunset</p>
            <p className="font-semibold">{formatTime(data.sys.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};