import { RingLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <RingLoader color="#EB5E28" size={150} />
      <p>Getting your weather data........</p>
    </div>
  );
}
