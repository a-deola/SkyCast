import axios from "axios";

export const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.post(
    "https://skycast-1t0f.onrender.com/weather",
    {
      lat: lat,
      lon: lon,
    }
  );
  return response.data.weather;
};
