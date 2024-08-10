import { WeatherCondition } from "./App";

export function getClosetWeatherTime(data: WeatherCondition[]) {
  const now = new Date();
  let closest = data[0];
  let closestTime = Math.abs(new Date(data[0].DtTxt).getTime() - now.getTime());
  data.forEach((weather) => {
    const time = Math.abs(new Date(weather.DtTxt).getTime() - now.getTime());
    if (time < closestTime) {
      closestTime = time;
      closest = weather;
    }
  });
  return closest;
}

export const getDailyWeather = (
  conditions: WeatherCondition[],
  getClosetWeatherTime: (data: WeatherCondition[]) => WeatherCondition
) => {
  const weatherTime = getClosetWeatherTime(conditions).DtTxt.split(" ")[1];
  const filteredDailyWeather = conditions
    .filter((condition) => condition.DtTxt.includes(weatherTime))
    .map((condition) => ({
      temp: condition.Temp,
      tempMax: condition.TempMax,
      tempMin: condition.TempMin,
      icon: condition.Icon,
      dtTxt: condition.DtTxt,
      description: condition.Description,
    }));

  return filteredDailyWeather;
};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export function getCoordinates() {
  return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by this browser."));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        resolve({ lat, lon });
      },
      (error) => {
        reject(error);
        console.log(`Error: ${error.message}`);
      },
      options
    );
  });
}
