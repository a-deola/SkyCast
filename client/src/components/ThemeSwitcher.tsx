import { BsSun } from "react-icons/bs";
import { BsMoon } from "react-icons/bs";

interface ThemeSwitcherProps {
  dark: boolean;
  toggleDark: () => void;
}

export default function ThemeSwitcher(props: ThemeSwitcherProps) {
  return (
    <div>
      {props.dark ? (
        <BsSun className="text-2xl" onClick={props.toggleDark} />
      ) : (
        <BsMoon
          className="text-2xl text-[#252422]"
          onClick={props.toggleDark}
        />
      )}
    </div>
  );
}
