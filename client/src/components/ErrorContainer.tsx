import { ReactNode } from "react";

type MyComponentProps = {
  children: ReactNode;
};

const ErrorContainer = ({ children }: MyComponentProps) => {
  return (
    <div className="flex justify-center items-center p-8 text-red-500 bg-red-100 border border-red-300 rounded-lg shadow-md w-full">
      {children}
    </div>
  );
};

export default ErrorContainer;
