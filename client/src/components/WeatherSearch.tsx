import { useState } from "react";
import Loader from "./Loader";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
}

const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form className="w-full max-w-2xl relative" onSubmit={handleSubmit}>
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m16.325 14.899l5.38 5.38a1.008 1.008 0 0 1-1.427 1.426l-5.38-5.38a8 8 0 1 1 1.426-1.426M10 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12"
          />
        </svg>
      </span>
      <input
        className="px-4 py-2 pl-12 pr-16 w-full border border-[#CCC5B9] rounded-3xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-none dark:bg-[#252422] dark:text-white"
        type="text"
        placeholder="Enter a city name..."
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-r-3xl"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default WeatherSearch;
