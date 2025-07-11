import "./App.css";
import { useEffect, useState } from "react";
import Info from "./components/Info";
import CurrentWeatherDisplay from "./components/CurrentWeatherDisplay";
import Loader from "./components/Loader";
import DailyWeatherDisplay from "./components/DailyWeatherDisplay";
import ThemeSwitcher from "./components/ThemeSwitcher";
import WeatherSearch from "./components/WeatherSearch";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchWeather } from "./lib/api";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { ErrorHandler } from "./components/ErrorHandler";
import ErrorContainer from "./components/ErrorContainer";
import RetryButton from "./components/RetryButton";
import { searchWeather } from "./lib/api";
import {
  getClosestWeatherTime,
  getDailyWeather,
  getCoordinates,
  handleGeolocationError,
} from "./lib/utils";

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
  const [geolocationError, setGeolocationError] = useState<
    string | Error | null
  >(null);
  const [weather, setWeather] = useState<Weather>({
    Name: "",
    Country: "",
    Timezone: 0,
    Sunrise: 0,
    Sunset: 0,
    Conditions: [],
  });
  const toggleDark = () => {
    setDark(!dark);
  };
  const {
    data,
    isLoading: isWeatherLoading,
    error,
    isError,
    refetch,
  }: UseQueryResult<Weather, Error> = useQuery({
    queryKey: ["Weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: false,
  });
  const isLoading = loadingCoordinates || isWeatherLoading;
  const isOffline = useNetworkStatus();

  const handleSearch = async (city: string) => {
    try {
      const result = await searchWeather(city); // from /bycity
      setLat(result.lat);
      setLon(result.lon);
      setWeather(result.weather);
      setGeolocationError(null);
    } catch (err) {
      setGeolocationError(
        `Oops! Couldn't find the weather for "${city}" 😔 Try a different location?`
      );
    }
  };

  useEffect(() => {
    console.log("Getting coordinates...");
    getCoordinates()
      .then(({ lat, lon }) => {
        console.log("Got coordinates:", lat, lon);
        setLat(lat);
        setLon(lon);
      })
      .catch((error) => {
        console.log("Error getting coordinates:", error);

        setGeolocationError(new Error(handleGeolocationError(error as Error)));
      })
      .finally(() => {
        console.log("Finished getting coordinates");
        setLoadingCoordinates(false);
      });
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      console.log("Coordinates available, refetching...");
      refetch();
    }
  }, [lat, lon, refetch]);

  useEffect(() => {
    if (data && data.Conditions) {
      setWeather(data);
      setWeatherDaily(getDailyWeather(data.Conditions, getClosestWeatherTime));
    } else if (data) {
      console.log("Unexpected data structure:", data);
      setWeatherDaily([]);
    }
  }, [data]);

  const handleRetry = async () => {
    if (isOffline) return;
    setLoadingCoordinates(true);
    setGeolocationError(null);
    try {
      const { lat, lon } = await getCoordinates();
      setLat(lat);
      setLon(lon);
    } catch (error) {
      setGeolocationError(new Error(handleGeolocationError(error as Error)));
    } finally {
      setLoadingCoordinates(false);
    }
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
  {
    geolocationError && (
      <ErrorContainer
        header={geolocationError}
        description="Unable to retrieve your location."
        message=" If you're using Chrome, click the 🔒 padlock in the
          address bar → Site settings →
      Location → Allow → then reload."
      >
        <RetryButton onRetry={handleRetry} disabled={loadingCoordinates} />
      </ErrorContainer>
    );
  }

  if (isOffline) {
    return (
      <div className="flex justify-center">
        <ErrorContainer
          header="Offline"
          description="You are currently offline. Please check your internet connection."
        />
      </div>
    );
  }

  return (
    <main className={`${dark && "dark"}`}>
      <div className="relative h-screen w-screen overflow-x-hidden bg-[#FFFCF2] dark:bg-[#252422] dark:text-white px-5">
        <div className="w-[500px] h-[500px] bg-[#EB5E28] rounded-full absolute left-[85%] -top-60 md:inline hidden animate-bounce"></div>
        <section className="flex items-center  space-x-4 w-full p-4">
          <ThemeSwitcher dark={dark} toggleDark={toggleDark} />
          <div className="w-full flex justify-center">
            <WeatherSearch onSearch={handleSearch} />
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
              {(() => {
                const current = weather.Conditions[0];
                return (
                  <CurrentWeatherDisplay
                    temp={current.Temp}
                    feelsLike={current.FeelsLike}
                    tempMin={current.TempMin}
                    tempMax={current.TempMax}
                    sunrise={weather.Sunrise}
                    sunset={weather.Sunset}
                    description={current.Description}
                    humidity={current.Humidity}
                    windSpeed={current.WindSpeed}
                    pressure={current.Pressure}
                    visibility={current.Visibility}
                    icon={current.Icon}
                  />
                );
              })()}
            </>
          ) : (
            <ErrorContainer
              header=" Unavailable"
              description="No weather data available ."
            />
          )}
        </section>
        <section>
          <DailyWeatherDisplay dailyWeather={weatherDaily.slice(1)} />
        </section>
      </div>
    </main>
  );
}

export default App;
