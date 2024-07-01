import axios from "axios";
import { useEffect, useState } from "react";
import Info from "./Info";

import CurrentWeatherDisplay from "./CurrentWeatherDisplay";

export default function MainDisplay() {
  const [lat, setLat] = useState(null as number | null);
  const [lon, setLon] = useState(null as number | null);
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
          setWeather(response.data.weather);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lat, lon]);

  return (
    <div className="">
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
    </div>
  );
}
