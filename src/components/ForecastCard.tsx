import React from 'react';
import { ForecastData, TemperatureUnit } from '../types';

interface Props {
  data: ForecastData;
  unit: TemperatureUnit;
}

export const ForecastCard: React.FC<Props> = ({ data, unit }) => {
  const dailyForecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg w-full max-w-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-5 gap-4">
        {dailyForecast.map((day) => (
          <div key={day.dt} className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].main}
              className="w-10 h-10 mx-auto"
            />
            <p className="font-semibold text-sm">
              {Math.round(day.main.temp)}°{unit === 'celsius' ? 'C' : 'F'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};