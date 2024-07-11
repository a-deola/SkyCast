import { RingLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <RingLoader color="#EB5E28" size={150} />
    </div>
  );
}
