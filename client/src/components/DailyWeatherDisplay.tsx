import { daysOfWeek, monthsOfYear } from "./Info";
import { DailyWeather } from "../App.tsx";
import { capitalize } from "./CurrentWeatherDisplay.tsx";

interface MainDisplayProps {
  dailyWeather: DailyWeather[];
}

function getDateString(dt: string) {
  const date = new Date(dt.split(" ")[0]);
  return date;
}

const DailyWeatherDisplay: React.FC<MainDisplayProps> = ({ dailyWeather }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold">4 Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-3 place-items-center gap-4">
        {dailyWeather.map((weather, index) => (
          <div
            key={index}
            className="w-48 h-48 rounded-md bg-white/30 dark:bg-[#252422]/30 backdrop-blur-sm shadow-inner items-center flex flex-col p-2 justify-center"
          >
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold">{weather.temp} &deg;C</h2>
              <img
                className="w-16"
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="Weather Icon"
              />
            </div>
            <p className="text-xs mb-2 text-[#EB5E28]">
              {capitalize(weather.description)}
            </p>
            <div className="flex gap-5 text-xs dark:text-[#CCC5B9]">
              <p>
                <span className="font-semibold">H </span>: {weather.tempMax}
                &deg;C
              </p>
              <p>
                <span className="font-semibold">L </span>: {weather.tempMin}
                &deg;C
              </p>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <p>{daysOfWeek[getDateString(weather.dtTxt).getDay()]}, </p>
              <p>
                {getDateString(weather.dtTxt).getDate()}{" "}
                {monthsOfYear[getDateString(weather.dtTxt).getMonth()]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DailyWeatherDisplay;
