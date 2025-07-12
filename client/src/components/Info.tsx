import { useState, useEffect } from "react";

interface InfoProps {
  name: string;
  country: string;
  timezone: number;
}
export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const monthsOfYear = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
];

const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours} : ${minutes}`;
};
function convertTimezone(timezoneOffset: number) {
  const hours = timezoneOffset / 3600;
  const sign = hours >= 0 ? "+" : "-";
  const absHours = Math.abs(hours);
  return `UTC${sign}${absHours}`;
}

export default function Info({ name, country, timezone }: InfoProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const local = new Date(utc + timezone * 1000);
      setTime(local);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  const dayOfWeek = daysOfWeek[time.getDay()];
  const month = monthsOfYear[time.getMonth()];
  const day = time.getDate();

  return (
    <aside className="p-5 text-center w-full lg:w-1/3 grid place-content-center gap-5">
      <h2 className="text-lg">
        {name === "Orogbum" ? "Port Harcourt" : name} - {country}
      </h2>
      <div>
        <h2 className="text-6xl font-bold text-[#EB5E28]">
          {formatTime(time)}
        </h2>
        <p className="mt-2 text-muted font-semibold">
          Timezone : {""} {convertTimezone(timezone)}
        </p>
        <p>
          {dayOfWeek}, {day} {month}
        </p>
      </div>
    </aside>
  );
}
