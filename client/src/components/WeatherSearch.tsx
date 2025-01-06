import { useState, useEffect } from "react";
import { searchWeather } from "../lib/api";
import Loader from "./Loader";

function WeatherSearch({ setWeather }: { setWeather: (data: any) => void }) {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState(city);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchedCity(city);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [city]);
  useEffect(() => {
    setLoading(true);
    searchWeather(searchedCity)
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      });
  }, [searchedCity, setWeather]);

  return loading ? (
    <Loader />
  ) : (
    <input
      className="px-4 py-2 w-full border border-[#CCC5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EB5E28] focus:border-none dark:bg-[#252422] dark:text-white"
      type="text"
      placeholder="Enter a city name..."
      onChange={(e) => setCity(e.target.value)}
    />
  );
}

export default WeatherSearch;
