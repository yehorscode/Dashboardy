import {
    Sun,
    Cloud,
    // Moon,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    // CloudMoon,
    // CloudMoonRain,
    CloudRain,
    // CloudRainWind,
    CloudSnow,
    CloudSun,
    // CloudSunRain,
    Cloudy,
    // Droplet,
    // Droplets,
    Sunrise,
    Sunset,
    // Thermometer,
    // Tornado,
    Wind,
    // Rainbow,
    // Star,
} from "lucide-react";
import { useEffect, useState, type JSX } from "react";

// Define interfaces for type safety
interface Coordinates {
    lat: string;
    lon: string;
}

interface WeatherData {
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    weatherDescription: string;
    humidity: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
    icon: JSX.Element;
}

// Weather code to Lucide icon mapping
const weatherCodeToIcon: { [key: number]: JSX.Element } = {
    0: <Sun size={80} />, // Clear sky
    1: <CloudSun size={80} />, // Mainly clear
    2: <Cloudy size={80} />, // Partly cloudy
    3: <Cloud size={80} />, // Overcast
    45: <CloudFog size={80} />, // Fog
    48: <CloudFog size={80} />, // Depositing rime fog
    51: <CloudDrizzle size={80} />, // Light drizzle
    53: <CloudDrizzle size={80} />, // Moderate drizzle
    55: <CloudDrizzle size={80} />, // Dense drizzle
    61: <CloudRain size={80} />, // Light rain
    63: <CloudRain size={80} />, // Moderate rain
    65: <CloudRain size={80} />, // Heavy rain
    71: <CloudSnow size={80} />, // Light snow
    73: <CloudSnow size={80} />, // Moderate snow
    75: <CloudSnow size={80} />, // Heavy snow
    95: <CloudLightning size={80} />, // Thunderstorm
};

// Weather code to description mapping
const weatherCodeToDescription: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
};

export default function WeatherBlock() {
    const [location] = useState<string>(
        localStorage.getItem("newTabWeatherLocation") || "please set location"
    );
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    function getLocation() {
        try {
            const parsedLocation = JSON.parse(location);
            setCoordinates({
                lat: parsedLocation.lat,
                lon: parsedLocation.lon,
            });
        } catch (err) {
            setError("Invalid location data");
        }
    }

    async function fetchWeatherData(lat: string, lon: string) {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`
            );
            if (!response.ok) throw new Error("Failed to fetch weather data");

            const data = await response.json();
            const weatherData: WeatherData = {
                temperature: data.current.temperature_2m,
                apparentTemperature: data.current.apparent_temperature,
                weatherCode: data.current.weather_code,
                weatherDescription:
                    weatherCodeToDescription[data.current.weather_code] ||
                    "Unknown",
                humidity: data.current.relative_humidity_2m,
                windSpeed: data.current.wind_speed_10m,
                sunrise: data.daily.sunrise[0],
                sunset: data.daily.sunset[0],
                icon: weatherCodeToIcon[data.current.weather_code] || (
                    <Cloud size={80} />
                ),
            };
            setWeather(weatherData);
        } catch (err) {
            setError("Error fetching weather data");
        }
    }

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        if (coordinates) {
            fetchWeatherData(coordinates.lat, coordinates.lon);
        }
    }, [coordinates]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!weather) {
        return <div>Loading weather...</div>;
    }

    return (
        <div className="flex-col text-left p-4 rounded-md shadow bg-blue-700/20">
            {/* <h1 className="text-xl font-bold">
                Weather in {JSON.parse(location).name.split(",")[0]}
            </h1> */}
            <div className="flex-col items-center gap-4">
                <div className="mb-1">{weather.icon}</div>
                <div className="flex gap-3">
                    <div>
                        <p className="text-lg font-bold">
                            Feels like: {weather.apparentTemperature}°C
                        </p>
                        <p>{weather.weatherDescription}</p>
                        
                        <p className="flex">
                            <Wind className="mr-1" />
                            Wind Speed: {weather.windSpeed} km/h
                        </p>
                        <p className="text-sm opacity-80">Humidity: {weather.humidity}%</p>
                    </div>
                    <div className="">
                        <p className="text-sm">
                            Temperature: {weather.temperature}°C
                        </p>
                        <p>
                            <Sunrise size={16} className="inline" /> Sunrise:{" "}
                            {new Date(weather.sunrise).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}
                        </p>
                        <p>
                            <Sunset size={16} className="inline" /> Sunset:{" "}
                            {new Date(weather.sunset).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
