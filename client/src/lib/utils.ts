import { WeatherCondition } from "../App";

export function getClosestWeatherTime(data: WeatherCondition[]) {
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
  getClosestWeatherTime: (data: WeatherCondition[]) => WeatherCondition
) => {
  const weatherTime = getClosestWeatherTime(conditions).DtTxt.split(" ")[1];
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
  timeout: 10000,
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
        switch (error.code) {
          case 1:
            reject(
              new Error(
                "Location access was denied. Please enable it in your browser or device settings."
              )
            );
            break;
          case 2:
            reject(
              new Error(
                "Location information is unavailable. Please check your device's location services."
              )
            );
            break;
          case 3:
            reject(new Error("Geolocation request timed out."));
            break;
          default:
            reject(
              new Error(
                "An unknown error occurred while retrieving your location."
              )
            );
        }
      },
      options
    );
  });
}
