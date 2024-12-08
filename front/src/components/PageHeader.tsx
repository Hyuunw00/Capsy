import { NavLink } from "react-router-dom";
import Left from "../assets/Left.svg";
import logo_black from "../assets/logo_black.svg";
import Notification from "../assets/Notification.svg";

export default function PageHeader() {
  return (
    <header className="flex justify-between items-center px-[20px] py-[10px]">
      <NavLink to="/" className="no-underline text-white flex flex-col items-center">
        <img src={Left} alt="Left" style={{ width: "24px", height: "24px" }} />
      </NavLink>
      <img src={logo_black} alt="Logo" style={{ width: "75px", height: "30px" }} />
      <img src={Notification} alt="Notification" style={{ width: "20px", height: "20px" }} />
    </header>
  );
}
