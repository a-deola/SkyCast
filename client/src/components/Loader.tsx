import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

const loadingMessages = [
  "Getting your weather data, please wait 🌦️ ...",
  "Contacting the clouds 📡 ...",
  "Locating you and fetching forecast 🛰️ ...",
  "Gathering weather insight ☁️ ...",
  "Checking the skies above you 🌍 ...",
];

export default function Loader() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % loadingMessages.length
      );
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex justify-center items-center h-screen gap-5 flex-col text-center">
      <RingLoader color="#EB5E28" size={150} />
      <p className="text-lg">{loadingMessages[currentMessageIndex]}</p>
    </div>
  );
}
