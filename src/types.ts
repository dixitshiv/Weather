export interface WeatherData {
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  timezone: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      main: string;
      icon: string;
    }[];
  }[];
}

export interface AirQualityData {
  list: [{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
    };
  }];
}

export interface WeatherAlertData {
  alerts?: {
    event: string;
    description: string;
    start: number;
    end: number;
  }[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';