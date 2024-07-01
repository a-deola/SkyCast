interface InfoProp {
  name: string;
  country: string;
  timezone: number;
}

export default function Info(prop: InfoProp) {
  const currentTime = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
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
  const dayOfWeek = daysOfWeek[currentTime.getDay()];

  function convertTimezone(timezoneOffset: number) {
    const hours = timezoneOffset / 3600;
    const sign = hours >= 0 ? "+" : "-";
    const absHours = Math.abs(hours);
    return `UTC${sign}${absHours}`;
  }

  return (
    <div className="p-5 text-center md:w-1/3 grid place-content-center gap-5">
      <h2 className="text-lg">
        {prop.name == "Orogbum" ? "Port Harcourt" : prop.name} - {prop.country}
      </h2>
      <div>
        <h2 className="text-6xl font-bold">
          {currentTime.getHours().toString().padStart(2, "0")} :{" "}
          {currentTime.getMinutes().toString().padStart(2, "0")}
        </h2>
        <p>{convertTimezone(prop.timezone)}</p>
      </div>
      <p>
        {dayOfWeek}, {currentTime.getDate()}{" "}
        {monthsOfYear[currentTime.getMonth()]}
      </p>
    </div>
  );
}
