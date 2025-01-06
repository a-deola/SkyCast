import axios from "axios";
import ErrorContainer from "./ErrorContainer";

interface ErrorHandlerProps {
  error: Error;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error }) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        <ErrorContainer>
          <h2>Server Error</h2>
          <p>Status: {error.response.status}</p>
          <p>
            {error.response.data?.message ||
              "Something went wrong on the server."}
          </p>
        </ErrorContainer>
      );
    } else if (error.request) {
      return (
        <ErrorContainer>
          <h2>Network Error</h2>
          <p>{error.message}</p>
          <p>Please check your internet connection and try again.</p>
        </ErrorContainer>
      );
    } else {
      return (
        <ErrorContainer>
          <h2>Request Error</h2>
          <p>{error.message}</p>
          <p>An error occurred while making the request.</p>
        </ErrorContainer>
      );
    }
  } else {
    return (
      <ErrorContainer>
        <h2>Unexpected Error</h2>
        <p>{(error as Error).message}</p>
      </ErrorContainer>
    );
  }
};
