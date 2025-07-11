import axios from "axios";
import ErrorContainer from "./ErrorContainer";

interface ErrorHandlerProps {
  error: Error;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error }) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        <ErrorContainer
          header="Server Error"
          message={
            error.response.data?.message ||
            "Something went wrong on the server."
          }
        />
      );
    } else if (error.request) {
      return (
        <ErrorContainer
          header="Network Error"
          message={
            error.message ||
            "Network request failed. Please check your connection."
          }
        />
      );
    } else {
      return (
        <ErrorContainer
          header="Unexpected Request Error"
          message={error.message}
        />
      );
    }
  } else {
    return <ErrorContainer header="Location Error" message={error.message} />;
  }
};
