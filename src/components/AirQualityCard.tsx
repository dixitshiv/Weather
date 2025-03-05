import React from 'react';
import { AirQualityData } from '../types';
import { Wind } from 'lucide-react';

interface Props {
  data: AirQualityData;
}

const getAQIInfo = (aqi: number) => {
  // Based on EPA and WHO Air Quality Index standards
  const levels = [
    {
      label: 'Good',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.'
    },
    {
      label: 'Moderate',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Air quality is acceptable. However, there may be a risk for some people.'
    },
    {
      label: 'Unhealthy for Sensitive Groups',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Members of sensitive groups may experience health effects.'
    },
    {
      label: 'Unhealthy',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Everyone may begin to experience health effects.'
    },
    {
      label: 'Very Unhealthy',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Health warnings of emergency conditions. The entire population is likely to be affected.'
    }
  ];
  return levels[aqi - 1] || levels[levels.length - 1];
};

const getPollutantLevel = (value: number, pollutant: string) => {
  // WHO guidelines for air pollutants (μg/m³)
  const guidelines = {
    pm2_5: { good: 10, moderate: 25, unhealthy: 50, veryUnhealthy: 75 },
    pm10: { good: 20, moderate: 50, unhealthy: 100, veryUnhealthy: 150 },
    no2: { good: 40, moderate: 100, unhealthy: 200, veryUnhealthy: 400 },
    o3: { good: 100, moderate: 160, unhealthy: 215, veryUnhealthy: 300 },
    co: { good: 4400, moderate: 9400, unhealthy: 12400, veryUnhealthy: 15400 }
  };

  const levels = {
    good: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    unhealthy: 'bg-red-100 text-red-800',
    veryUnhealthy: 'bg-purple-100 text-purple-800'
  };

  const guide = guidelines[pollutant as keyof typeof guidelines];
  if (!guide) return levels.good;

  if (value <= guide.good) return levels.good;
  if (value <= guide.moderate) return levels.moderate;
  if (value <= guide.unhealthy) return levels.unhealthy;
  return levels.veryUnhealthy;
};

export const AirQualityCard: React.FC<Props> = ({ data }) => {
  const { aqi } = data.list[0].main;
  const { label, color, bgColor, description } = getAQIInfo(aqi);
  const { co, no2, o3, pm2_5, pm10 } = data.list[0].components;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg w-full">
      <div className="flex items-center gap-3 mb-4">
        <Wind className="text-blue-500" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Air Quality</h3>
      </div>
      
      <div className={`${bgColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-2xl font-bold ${color}`}>{label}</span>
          <span className={`${color} text-lg font-semibold`}>AQI: {aqi}</span>
        </div>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-3 ${getPollutantLevel(pm2_5, 'pm2_5')}`}>
            <p className="text-sm font-medium">PM2.5</p>
            <p className="font-semibold">{pm2_5.toFixed(1)} μg/m³</p>
          </div>
          <div className={`rounded-lg p-3 ${getPollutantLevel(pm10, 'pm10')}`}>
            <p className="text-sm font-medium">PM10</p>
            <p className="font-semibold">{pm10.toFixed(1)} μg/m³</p>
          </div>
          <div className={`rounded-lg p-3 ${getPollutantLevel(no2, 'no2')}`}>
            <p className="text-sm font-medium">NO₂</p>
            <p className="font-semibold">{no2.toFixed(1)} μg/m³</p>
          </div>
          <div className={`rounded-lg p-3 ${getPollutantLevel(o3, 'o3')}`}>
            <p className="text-sm font-medium">O₃</p>
            <p className="font-semibold">{o3.toFixed(1)} μg/m³</p>
          </div>
        </div>

        <div className={`rounded-lg p-3 ${getPollutantLevel(co, 'co')}`}>
          <p className="text-sm font-medium">CO</p>
          <p className="font-semibold">{co.toFixed(1)} μg/m³</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Based on WHO Air Quality Guidelines and EPA Air Quality Index standards
        </p>
      </div>
    </div>
  );
};