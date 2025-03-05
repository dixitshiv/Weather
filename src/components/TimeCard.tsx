import React, { useState, useEffect } from 'react';
import { Clock, Globe, Calendar } from 'lucide-react';

interface Props {
  timezone: number;
  cityName: string;
}

export const TimeCard: React.FC<Props> = ({ timezone, cityName }) => {
  const [localTime, setLocalTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState('local');

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeInTimezone = (date: Date, offsetSeconds: number) => {
    const localOffset = date.getTimezoneOffset() * 60;
    const targetTime = new Date(date.getTime() + (offsetSeconds + localOffset) * 1000);
    return targetTime;
  };

  const cityTime = getTimeInTimezone(localTime, timezone);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg w-full">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-blue-500" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Local Time</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="text-gray-500 w-4 h-4" />
              <p className="text-gray-600">{cityName}</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatTime(cityTime)}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Calendar className="text-gray-500 w-4 h-4" />
              <p className="text-gray-600">Local</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatTime(localTime)}</p>
          </div>
        </div>

        <div className="text-center border-t pt-4">
          <p className="text-gray-600">{formatDate(cityTime)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">Time Difference</p>
            <p className="font-semibold text-gray-800">
              {Math.round(timezone / 3600)} hours from local
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">UTC Offset</p>
            <p className="font-semibold text-gray-800">
              UTC {timezone >= 0 ? '+' : ''}{Math.round(timezone / 3600)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};