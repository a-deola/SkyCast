import {
  BsWater,
  BsWind,
  BsSpeedometer2,
  BsSunrise,
  BsSunset,
  BsEye,
} from "react-icons/bs";

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

export default function CurrentWeatherDisplay(props: WeatherProp) {
  function convertEpochToTime(epoch: number): string {
    const date = new Date(epoch * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  function capitalize(str: string) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  return (
    <div className="border flex items-center justify-between md:w-2/3 rounded-2xl p-5">
      <div className="flex flex-col p-5 gap-10">
        <div>
          <div>
            <h1 className="text-4xl font-medium">{props.temp} &deg;C</h1>
            <p className="text-xs">
              Feels like :{" "}
              <span className="font-bold text-lg">
                {" "}
                {props.feelsLike} &deg;C{" "}
              </span>
            </p>
          </div>
          <div className="flex gap-5 mb-5">
            <p>
              <span className="font-bold">H</span> : {props.tempMax} &deg;C
            </p>
            <p>
              <span className="font-bold">L</span> : {props.tempMin} &deg;C
            </p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-5">
            <BsSunrise className="text-3xl font-medium" />
            <div className="flex flex-col">
              <p className="font-bold">Sunrise</p>
              <p>{convertEpochToTime(props.sunrise)}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <BsSunset className="text-3xl font-medium" />
            <div className="flex flex-col">
              <p className="font-bold">Sunset</p>
              <p>{convertEpochToTime(props.sunset)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-col">
        <img
          className="w-60"
          src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`}
          alt="Weather Icon"
        />
        <p className="text-xl font-medium">{capitalize(props.description)}</p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="p-5 flex flex-col items-center">
          <BsWater className="text-3xl font-medium" />
          <p className="font-medium">{props.humidity} %</p>
          <p>Humidity</p>
        </div>
        <div className="p-5 flex flex-col items-center">
          <BsWind className="text-3xl font-medium" />
          <p className="font-medium">
            {props.windSpeed}
            {/* {Math.round(weather.Conditions[0].WindSpeed * 3.6 * 100) / 100} km/h */}
          </p>
          <p>Wind Speed</p>
        </div>
        <div className="p-5 flex flex-col items-center">
          <BsSpeedometer2 className="text-3xl font-medium" />
          <p className="font-medium">{props.pressure} hPa</p>
          <p>Pressure</p>
        </div>
        <div className="p-5 flex flex-col items-center">
          <BsEye className="text-3xl font-medium" />
          <p className="font-medium">{props.visibility} km</p>
          <p>Visibility</p>
        </div>
      </div>
    </div>
  );
}
