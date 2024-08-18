import "./App.css";
import { useEffect, useState } from "react";
import Info from "./components/Info";
import CurrentWeatherDisplay from "./components/CurrentWeatherDisplay";
import Loader from "./components/Loader";
import DailyWeatherDisplay from "./components/DailyWeatherDisplay";
import ThemeSwitcher from "./components/ThemeSwitcher";
import WeatherSearch from "./components/WeatherSearch";
import { getClosetWeatherTime, getDailyWeather, getCoordinates } from "./utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchWeather } from "./api";
import { ErrorHandler } from "./components/ErrorHandler";

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
    Conditions: [
      {
        CurrentCondition: "",
        Description: "",
        DtTxt: "",
        FeelsLike: 0,
        Humidity: 0,
        Icon: "",
        Pressure: 0,
        Rain: 0,
        Temp: 0,
        TempMax: 0,
        TempMin: 0,
        Visibility: 0,
        WindDeg: 0,
        WindSpeed: 0,
      },
    ],
  });

  const toggleDark = () => {
    setDark(!dark);
  };

  useEffect(() => {
    getCoordinates()
      .then(({ lat, lon }) => {
        setLat(lat);
        setLon(lon);
        setLoadingCoordinates(false);
      })
      .catch((error) => {
        setLoadingCoordinates(false);
        return <ErrorHandler error={error} />;
      });
  }, []);

  const { data, isLoading, error, isError }: UseQueryResult<Weather, Error> =
    useQuery({
      queryKey: ["Weather", lat, lon],
      queryFn: () => fetchWeather(lat!, lon!),
      enabled: !loadingCoordinates && lat !== null && lon !== null,
    });

  useEffect(() => {
    if (data && data.Conditions) {
      setWeather(data);
      setWeatherDaily(getDailyWeather(data.Conditions, getClosetWeatherTime));
    } else if (data) {
      console.log("Unexpected data structure:", data);
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (isError && error) {
    return <ErrorHandler error={error} />;
  }

  return (
    <main className={`${dark && "dark"}`}>
      <div className="relative h-screen w-screen overflow-x-hidden bg-[#FFFCF2] dark:bg-[#252422] dark:text-white px-5">
        <div className="w-[500px] h-[500px] bg-[#EB5E28] rounded-full absolute left-[80%] -top-60 md:inline hidden animate-bounce"></div>
        <section className="flex gap-10 items-center m-4 w-full">
          <div className=" w-1/6 md:w-1/5 flex justify-center">
            <ThemeSwitcher dark={dark} toggleDark={toggleDark} />
          </div>
          <div className="w-5/6 md:w-4/5">
            <WeatherSearch />
          </div>
        </section>
        <section className="flex flex-col lg:flex-row">
          <Info
            name={weather.Name}
            country={weather.Country}
            timezone={weather.Timezone}
          />
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
            pressure={weather.Conditions[0].WindSpeed}
            visibility={weather.Conditions[0].Visibility}
            icon={weather.Conditions[0].Icon}
          />
        </section>
        <section>
          <DailyWeatherDisplay dailyWeather={weatherDaily} />
        </section>
      </div>
    </main>
  );
}

export default App;
