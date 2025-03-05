import axios from 'axios';
import { WeatherData, ForecastData, AirQualityData, TemperatureUnit, WeatherAlertData } from './types';

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city: string, unit: TemperatureUnit): Promise<WeatherData> => {
  const units = unit === 'celsius' ? 'metric' : 'imperial';
  const response = await axios.get(
    `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
  );
  return response.data;
};

export const getWeatherByCoords = async (lat: number, lon: number, unit: TemperatureUnit): Promise<WeatherData> => {
  const units = unit === 'celsius' ? 'metric' : 'imperial';
  const response = await axios.get(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
  return response.data;
};

export const getForecast = async (city: string, unit: TemperatureUnit): Promise<ForecastData> => {
  const units = unit === 'celsius' ? 'metric' : 'imperial';
  const response = await axios.get(
    `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
  );
  return response.data;
};

export const getForecastByCoords = async (lat: number, lon: number, unit: TemperatureUnit): Promise<ForecastData> => {
  const units = unit === 'celsius' ? 'metric' : 'imperial';
  const response = await axios.get(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
  return response.data;
};

export const getAirQuality = async (lat: number, lon: number): Promise<AirQualityData> => {
  const response = await axios.get(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  return response.data;
};

export const getWeatherAlerts = async (lat: number, lon: number): Promise<WeatherAlertData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    // If the OneCall API fails, return an empty alerts array
    return { alerts: [] };
  }
};