import logo_black from "../assets/logo_black.svg";
import Notification_disabled from "../assets/Notification-disabled.svg";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-[20px] py-[10px]">
      <img src={logo_black} alt="Logo" style={{ width: "75px", height: "30px" }} />
      <img src={Notification_disabled} alt="Notification" style={{ width: "50px", height: "20px" }} />
    </header>
  );
}
