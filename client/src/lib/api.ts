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

    throw error;
  }
};

export const searchWeather = async (city: string) => {
  try {
    const response = await axios.get(
      "https://skycast-1t0f.onrender.com/bycity",
      {
        params: { city },
      }
    );

    // Extract and return just the weather info
    return {
      city: response.data.city,
      lat: response.data.latitude,
      lon: response.data.longitude,
      weather: response.data.weather,
    };
  } catch (error) {
    throw error;
  }
};
