import { BsSunrise, BsSunset } from "react-icons/bs";

function convertEpochToTime(epoch: number): string {
  const date = new Date(epoch * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

interface TempProp {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  sunrise: number;
  sunset: number;
}

function CurrentTempDisplay(props: TempProp) {
  return (
    <div className="w-full flex justify-around gap-2 my-2 md:flex-col md:p-5 md:gap-10">
      <div>
        <div>
          <h1 className=" text-lg md:text-4xl font-bold md:font-medium">
            {props.temp} &deg;C
          </h1>
        </div>
        <div className="flex text-xs gap-1 my-4 md:my-2 md:text-sm md:gap-5 mb-5">
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
          <BsSunrise className="text-3xl font-medium text-[#EB5E28]" />
          <div className="flex flex-col">
            <p className="font-bold text-[#CCC5B9]">Sunrise</p>
            <p>{convertEpochToTime(props.sunrise)}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <BsSunset className="text-3xl font-medium text-[#EB5E28]" />
          <div className="flex flex-col">
            <p className="font-bold text-[#CCC5B9]">Sunset</p>
            <p>{convertEpochToTime(props.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentTempDisplay;
