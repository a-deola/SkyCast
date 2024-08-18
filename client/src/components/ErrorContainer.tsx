import { ReactNode } from "react";

type MyComponentProps = {
  children: ReactNode;
};

const ErrorContainer = ({ children }: MyComponentProps) => {
  return <div className="flex justify-center items-center">{children}</div>;
};

export default ErrorContainer;
