import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Info from "./components/Info";
import CurrentWeatherDisplay from "./components/CurrentWeatherDisplay";
import Loader from "./components/Loader";
import DailyWeatherDisplay from "./components/DailyWeatherDisplay";
import ThemeSwitcher from "./components/ThemeSwitcher";

interface WeatherCondition {
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

function App() {
  const [dark, setDark] = useState(false);
  const [lat, setLat] = useState(null as number | null);
  const [lon, setLon] = useState(null as number | null);
  const [loading, setLoading] = useState(true);
  const [weatherDaily, setWeatherDaily] = useState<DailyWeather[]>([]);

  const [weather, setWeather] = useState({
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

  function locationCallback(position: GeolocationPosition) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    setLat(lat);
    setLon(lon);
  }

  function getError(error: GeolocationPositionError) {
    console.log(`Error: ${error.message}`);
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        locationCallback,
        getError,
        options
      );
      console.log("Geolocation is supported!");
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    getCoordinates();
  }, []);

  useEffect(() => {
    if (lat !== null || lon !== null) {
      axios
        .post("http://localhost:3000/weather", {
          lat: lat,
          lon: lon,
        })
        .then((response) => {
          if (
            response.data &&
            response.data.weather &&
            response.data.weather.Conditions
          ) {
            setWeather(response.data.weather);
            setLoading(false);
            const weatherTime = String(
              response.data.weather.Conditions[0].DtTxt.split(" ")[1]
            );
            console.log(weatherTime);
            const filteredDailyWeather =
              response.data.weather.Conditions.filter(
                (condition: WeatherCondition) => {
                  return condition.DtTxt.includes(weatherTime);
                }
              ).map((condition: WeatherCondition) => ({
                temp: condition.Temp,
                tempMax: condition.TempMax,
                tempMin: condition.TempMin,
                icon: condition.Icon,
                dtTxt: condition.DtTxt,
                description: condition.Description,
              }));
            console.log(filteredDailyWeather);
            setWeatherDaily(filteredDailyWeather);
          } else {
            console.log("Unexpected data structure:", response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lat, lon]);

  return (
    <div className={`${dark && "dark"}`}>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative h-screen w-screen overflow-x-hidden bg-[#FFFCF2] dark:bg-[#252422] dark:text-white px-5">
          <div className="w-[500px] h-[500px] bg-[#EB5E28] rounded-full absolute left-[80%] -top-60"></div>
          {/* <div className="w-[500px] h-[500px] bg-[#252422] rounded-full absolute right-[80%] -bottom-60"></div>
          <div className="w-40 h-40 bg-[#CCC5B9] rounded-full absolute left-[30%] top-[40%]"></div> */}
          <div className="flex z-10 my-3">
            <ThemeSwitcher dark={dark} toggleDark={toggleDark} />
          </div>
          <section className="flex flex-col md:flex-row">
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
      )}
    </div>
  );
}

export default App;
