import axios from "axios";

export const fetchWeather = async (lat: number, lon: number) => {
  try {
    const response = await axios.post(
      "https://skycast-1t0f.onrender.com/weather",
      {
        lat: lat,
        lon: lon,
      }
    );
    return response.data.weather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const searchWeather = async (city: string) => {
  try {
    const response = await axios.get(
      "https://skycast-1t0f.onrender.com/weather",
      {
        params: { city },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
