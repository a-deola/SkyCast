import { BsWater, BsWind, BsSpeedometer2, BsEye } from "react-icons/bs";

interface ConditionDisplayProps {
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
}

function ConditionDisplay(props: ConditionDisplayProps) {
  return (
    <div className=" md:grid grid-cols-2 md:col-span-2 gap-5 hidden w-full">
      <div className="p-5 flex flex-col items-center">
        <BsWater className="text-3xl font-medium" />
        <p className="font-medium ">{props.humidity} %</p>
        <p>Humidity</p>
      </div>
      <div className="p-5 flex flex-col items-center">
        <BsWind className="text-3xl font-medium" />
        <p className="font-medium ">{props.windSpeed} km/h</p>
        <p>Wind Speed</p>
      </div>
      <div className="p-5 flex flex-col items-center">
        <BsSpeedometer2 className="text-3xl font-medium" />
        <p className="font-medium ">{props.pressure} hPa</p>
        <p>Pressure</p>
      </div>
      <div className="p-5 flex flex-col items-center">
        <BsEye className="text-3xl font-medium" />
        <p className="font-medium ">{props.visibility} km</p>
        <p>Visibility</p>
      </div>
    </div>
  );
}

export default ConditionDisplay;
