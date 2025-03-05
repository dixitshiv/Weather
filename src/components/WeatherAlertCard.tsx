import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  location: string;
  alerts?: {
    event: string;
    description: string;
    start: number;
    end: number;
  }[];
}

export const WeatherAlertCard: React.FC<Props> = ({ location, alerts }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg w-full">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-orange-500" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Weather Alerts</h3>
      </div>
      
      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{alert.event}</h4>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(alert.start)} - {formatTime(alert.end)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">No active weather alerts for {location}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Alerts for {location} are updated in real-time
        </p>
      </div>
    </div>
  );
};