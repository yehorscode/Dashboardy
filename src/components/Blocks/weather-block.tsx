import {
    Sun,
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    CloudSun,
    Cloudy,
    Sunrise,
    Sunset,
    Wind,
} from "lucide-react";
import { useEffect, useState, type JSX } from "react";

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

const weatherCodeToIcon: { [key: number]: JSX.Element } = {
    0: <Sun size={80} />,
    1: <CloudSun size={80} />,
    2: <Cloudy size={80} />,
    3: <Cloud size={80} />,
    45: <CloudFog size={80} />,
    48: <CloudFog size={80} />,
    51: <CloudDrizzle size={80} />,
    53: <CloudDrizzle size={80} />,
    55: <CloudDrizzle size={80} />,
    61: <CloudRain size={80} />,
    63: <CloudRain size={80} />,
    65: <CloudRain size={80} />,
    71: <CloudSnow size={80} />,
    73: <CloudSnow size={80} />,
    75: <CloudSnow size={80} />,
    95: <CloudLightning size={80} />,
};

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

const weatherCodeToGradient: { [key: number]: string } = {
    0: "from-cyan-400/100 to-blue-400/100",
    1: "from-cyan-400/100 to-blue-400/100",
    2: "from-cyan-500/100 to-sky-600/100",
    3: "from-cyan-500/100 to-sky-700/100",
    45: "from-sky-600/100 to-sky-800/100",
    48: "from-sky-600/100 to-sky-900/100",
    51: "from-sky-700/100 to-blue-800/100",
    53: "from-sky-700/100 to-blue-900/100",
    55: "from-sky-700/100 to-blue-900/100",
    61: "from-sky-600/100 to-sky-700/100",
    63: "from-sky-800/100 to-sky-800/100",
    65: "from-sky-900/100 to-sky-950/100",
    71: "from-cyan-600/100 to-cyan-700/100",
    73: "from-cyan-700/100 to-cyan-800/100",
    75: "from-cyan-800/100 to-cyan-900/100",
    95: "from-blue-950/100 to-sky-950/100",
};

export default function WeatherBlock() {
    const [location] = useState<string>(
        localStorage.getItem("newTabWeatherLocation") || "please set location"
    );
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [demoMode] = useState(false); // demo mode flag
    const weatherCodes = Object.keys(weatherCodeToGradient).map(Number);
    const [demoIndex, setDemoIndex] = useState(0);

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

    // useEffect(() => {
    //     if (weather && demoMode) {
    //         if (demoIndex < weatherCodes.length) {
    //             const timer = setTimeout(() => {
    //                 setWeather(w => w && { ...w, weatherCode: weatherCodes[demoIndex] });
    //                 setDemoIndex(i => i + 1);
    //             }, 800); // zmiana co 0.8s
    //             return () => clearTimeout(timer);
    //         } else {
    //             setDemoMode(false); // zakończ demo
    //         }
    //     }
    // }, [weather, demoMode, demoIndex]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = Number(e.target.value);
        setDemoIndex(idx);
        setWeather((w) => w && { ...w, weatherCode: weatherCodes[idx] });
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!weather) {
        return <div>Loading weather...</div>;
    }

    const gradientClass =
        weatherCodeToGradient[weather.weatherCode] ||
        "from-cyan-500/100 to-blue-500/100";

    return (
        <div
            className={`flex-col text-left p-4 rounded-md shadow bg-gradient-to-br ${gradientClass}`}
        >
            {demoMode && (
                <>
                    <div className="text-xs text-white mb-2">
                        DEMO: {weather.weatherCode}
                    </div>
                    <div className="mb-2">
                        {weatherCodeToIcon[weather.weatherCode]}
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={weatherCodes.length - 1}
                        value={demoIndex}
                        onChange={handleSliderChange}
                        className="w-full mb-2 accent-cyan-500"
                    />
                </>
            )}
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
                        <p className="text-sm opacity-80">
                            Humidity: {weather.humidity}%
                        </p>
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
