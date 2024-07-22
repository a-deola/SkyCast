import ConditionDisplay from "./ConditionDisplay";
import CurrentTempDisplay from "./CurrentTempDisplay";
import IconDisplay from "./IconDisplay";

interface WeatherProp {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  sunrise: number;
  sunset: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  icon: string;
}

export function capitalize(str: string) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

export default function CurrentWeatherDisplay(props: WeatherProp) {
  return (
    <aside className=" flex flex-col-reverse md:flex-row justify-center w-full rounded-2xl py-5 bg-white/30 dark:bg-[#252422]/30 backdrop-blur-xl">
      <CurrentTempDisplay
        temp={props.temp}
        feelsLike={props.feelsLike}
        tempMax={props.tempMax}
        tempMin={props.tempMin}
        sunrise={props.sunrise}
        sunset={props.sunset}
      />
      <IconDisplay icon={props.icon} description={props.description} />
      <ConditionDisplay
        humidity={props.humidity}
        windSpeed={props.windSpeed}
        pressure={props.pressure}
        visibility={props.visibility}
      />
    </aside>
  );
}
