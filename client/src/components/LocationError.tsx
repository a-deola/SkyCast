import React from "react";

interface LocationErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onManualSearch: (e: React.FormEvent) => void;
}

const LocationError: React.FC<LocationErrorProps> = ({
  errorMessage,
  onRetry,
  onManualSearch,
}) => {
  return (
    <div>
      <p>{errorMessage}</p>
      <button onClick={onRetry}>Retry</button>
      <form onSubmit={onManualSearch}>
        <input type="text" placeholder="Enter a city name" />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default LocationError;
