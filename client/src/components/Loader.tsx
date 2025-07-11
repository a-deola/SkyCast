import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

const loadingMessages = [
  "Finding your location 🛰️ ...",
  "Contacting the clouds 📡 ...",
  "Checking the skies ☁️ ...",
  "Getting your weather data, please wait 🌦️ ...",
  "Fetching the latest updates 🌍 ...",
  "Putting a bow on it 🎀 ...",
];

export default function Loader() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % loadingMessages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen gap-5 flex-col text-center">
      <RingLoader color="#EB5E28" size={150} />
      <p className="text-lg">{loadingMessages[currentMessageIndex]}</p>
    </div>
  );
}
