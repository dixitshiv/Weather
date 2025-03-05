import React from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  lat: number;
  lon: number;
  cityName: string;
}

export const WeatherMapCard: React.FC<Props> = ({ lat, lon, cityName }) => {
  // Using MapTiler's static map API
  const mapUrl = `https://api.maptiler.com/maps/streets/static/${lon},${lat},10/800x400.png?key=get8PQGuAFmqrYj9TlEH`;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg w-full">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="text-blue-500" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Location Map - {cityName}</h3>
      </div>
      
      <div className="relative w-full rounded-xl overflow-hidden" style={{ height: '400px' }}>
        <img
          src={mapUrl}
          alt={`Map of ${cityName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-gray-600">
          <a 
            href={`https://www.openstreetmap.org/#map=12/${lat}/${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            View Interactive Map
          </a>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Coordinates: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E</p>
      </div>
    </div>
  );
};