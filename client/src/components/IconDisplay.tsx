import { capitalize } from "./CurrentWeatherDisplay";
import { ErrorHandler } from "./ErrorHandler";

function IconDisplay(props: { icon: string; description: string }) {
  function handleError() {
    const error = new Error(
      "Please check your interner connection and try again."
    );
    return <ErrorHandler error={error} />;
  }
  return (
    <div className="flex items-center flex-col w-full">
      <img
        className="w-52"
        src={`https://openweathermap.org/img/wn/${props.icon}@2x.png`}
        alt="Weather Icon"
        onError={handleError}
      />
      <p className="text-xl font-medium text-[#EB5E28]">
        {capitalize(props.description)}
      </p>
    </div>
  );
}

export default IconDisplay;
