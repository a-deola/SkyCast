import axios from "axios";
import { useEffect, useState } from "react";

export default function MainDisplay() {
  const [lat, setLat] = useState(null as number | null);
  const [lon, setLon] = useState(null as number | null);
  const [city, setCity] = useState({
    Name: "",
    Country: "",
    Coord: {
      Lat: 0,
      Lon: 0,
    },
    Timezone: 0,
    Sunrise: 0,
    Sunset: 0,
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
          setCity(response.data.weather.City);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lat, lon]);

  return (
    <div className="border p-5">
      <h1>Current Weather</h1>
      <h2>City: {city.Name}</h2>
      <h2>Country: {city.Country}</h2>
      <p>Timezone: {city.Timezone}</p>
      <p>Latitude: {city.Coord.Lat}</p>
      <p>Longitude: {city.Coord.Lon}</p>
      {/* <img
        src={`http://openweathermap.org/img/wn/${weather.Weather[0].Icon}.png`}
        alt="Weather Icon"
      /> */}
    </div>
  );
}
