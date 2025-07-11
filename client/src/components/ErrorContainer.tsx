import { ReactNode } from "react";
import RetryButton from "./RetryButton";

type MyComponentProps = {
  header: string;
  description?: string;
  message?: string;
  children?: ReactNode;
};

const ErrorContainer = ({
  header,
  description,
  message,
  children,
}: MyComponentProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center py-4 text-red-500 bg-red-100 border border-red-300 rounded-lg shadow-md w-4/5 mx-2">
        <h2 className="text-xl font-bold mb-4">{header}</h2>
        {description && <p className="m-4">{description}</p>}
        <p className="text-gray-600 w-1/2 text-center dark:text-gray-300">
          {message}
        </p>
        {!children && <RetryButton onRetry={() => window.location.reload()} />}
      </div>
    </div>
  );
};

export default ErrorContainer;
