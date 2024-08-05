import { capitalize } from "./CurrentWeatherDisplay";

function IconDisplay(props: { icon: string; description: string }) {
  return (
    <div className="flex items-center flex-col w-full">
      <img
        className="w-52"
        src={`https://openweathermap.org/img/wn/${props.icon}@2x.png`}
        alt="Weather Icon"
      />
      <p className="text-xl font-medium text-[#EB5E28]">
        {capitalize(props.description)}
      </p>
    </div>
  );
}

export default IconDisplay;
