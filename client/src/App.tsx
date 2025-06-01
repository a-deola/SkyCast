import "./App.css";
import { useEffect, useState } from "react";
import Info from "./components/Info";
import CurrentWeatherDisplay from "./components/CurrentWeatherDisplay";
import Loader from "./components/Loader";
import DailyWeatherDisplay from "./components/DailyWeatherDisplay";
import ThemeSwitcher from "./components/ThemeSwitcher";
import WeatherSearch from "./components/WeatherSearch";
import {
  getClosestWeatherTime,
  getDailyWeather,
  getCoordinates,
} from "./lib/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchWeather } from "./lib/api";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { ErrorHandler } from "./components/ErrorHandler";
import ErrorContainer from "./components/ErrorContainer";

export interface WeatherCondition {
  DtTxt: string;
  Temp: number;
  TempMax: number;
  TempMin: number;
  Icon: string;
  Description: string;
}

export interface DailyWeather {
  temp: number;
  tempMax: number;
  tempMin: number;
  icon: string;
  dtTxt: string;
  description: string;
}
interface CurrentCondition {
  CurrentCondition: string;
  Description: string;
  DtTxt: string;
  FeelsLike: number;
  Humidity: number;
  Icon: string;
  Pressure: number;
  Rain: number;
  Temp: number;
  TempMax: number;
  TempMin: number;
  Visibility: number;
  WindDeg: number;
  WindSpeed: number;
}

export interface Weather {
  Name: string;
  Country: string;
  Timezone: number;
  Sunrise: number;
  Sunset: number;
  Conditions: CurrentCondition[];
}

function App() {
  const [dark, setDark] = useState(false);
  const [lat, setLat] = useState(null as number | null);
  const [lon, setLon] = useState(null as number | null);
  const [loadingCoordinates, setLoadingCoordinates] = useState(true);
  const [weatherDaily, setWeatherDaily] = useState<DailyWeather[]>([]);
  const [weather, setWeather] = useState<Weather>({
    Name: "",
    Country: "",
    Timezone: 0,
    Sunrise: 0,
    Sunset: 0,
    Conditions: [],
  });
  const [geolocationError, setGeolocationError] = useState<
    string | Error | null
  >(null);
  const toggleDark = () => {
    setDark(!dark);
  };
  const {
    data,
    isLoading: isWeatherLoading,
    error,
    isError,
  }: UseQueryResult<Weather, Error> = useQuery({
    queryKey: ["Weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  });
  const isLoading = loadingCoordinates || isWeatherLoading;
  const isOffline = useNetworkStatus();

  useEffect(() => {
    getCoordinates()
      .then(({ lat, lon }) => {
        setLat(lat);
        setLon(lon);
      })
      .catch((error) => {
        if (error.message === "Geolocation request timed out.") {
          setGeolocationError(
            "The geolocation request timed out. Please try again."
          );
        }
      })
      .finally(() => setLoadingCoordinates(false));
  }, []);

  useEffect(() => {
    if (data && data.Conditions) {
      setWeather(data);
      setWeatherDaily(getDailyWeather(data.Conditions, getClosestWeatherTime));
    } else if (data) {
      console.log("Unexpected data structure:", data);
      setWeatherDaily([]);
    }
  }, [data]);

  const handleRetry = () => {
    setLoadingCoordinates(true);
    setGeolocationError(null);
    getCoordinates()
      .then(({ lat, lon }) => {
        setLat(lat);
        setLon(lon);
      })
      .catch((error) => {
        setGeolocationError(error.message);
      })
      .finally(() => setLoadingCoordinates(false));
  };

  if (isLoading) return <Loader />;
  if (!weather) {
    return <ErrorHandler error={new Error("Failed to fetch weather data.")} />;
  }
  if (isError || geolocationError) {
    return (
      <ErrorHandler
        error={
          geolocationError instanceof Error
            ? geolocationError
            : new Error(geolocationError || error!.message)
        }
      />
    );
  }
  if (isOffline) {
    return (
      <ErrorContainer>
        You are offline. Please check your connection and try again
        <button onClick={handleRetry}>
          <span>Retry</span>
        </button>
      </ErrorContainer>
    );
  }

  return (
    <main className={`${dark && "dark"}`}>
      <div className="relative h-screen w-screen overflow-x-hidden bg-[#FFFCF2] dark:bg-[#252422] dark:text-white px-5">
        <div className="w-[500px] h-[500px] bg-[#EB5E28] rounded-full absolute left-[85%] -top-60 md:inline hidden animate-bounce"></div>
        <section className="flex items-center  space-x-4 w-full p-4">
          <ThemeSwitcher dark={dark} toggleDark={toggleDark} />
          <div className="w-full flex justify-center">
            <WeatherSearch setWeather={setWeather} />
          </div>
        </section>
        <section className="flex flex-col lg:flex-row">
          <Info
            name={weather.Name}
            country={weather.Country}
            timezone={weather.Timezone}
          />
          {weather.Conditions.length > 0 ? (
            <>
              <CurrentWeatherDisplay
                temp={weather.Conditions[0].Temp}
                feelsLike={weather.Conditions[0].FeelsLike}
                tempMin={weather.Conditions[0].TempMin}
                tempMax={weather.Conditions[0].TempMax}
                sunrise={weather.Sunrise}
                sunset={weather.Sunset}
                description={weather.Conditions[0].Description}
                humidity={weather.Conditions[0].Humidity}
                windSpeed={weather.Conditions[0].WindSpeed}
                pressure={weather.Conditions[0].Pressure}
                visibility={weather.Conditions[0].Visibility}
                icon={weather.Conditions[0].Icon}
              />
              <section>
                <DailyWeatherDisplay dailyWeather={weatherDaily} />
              </section>
            </>
          ) : (
            <ErrorContainer>
              <p>No weather data available.</p>
            </ErrorContainer>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
