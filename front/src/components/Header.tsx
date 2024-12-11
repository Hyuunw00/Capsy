import logo_black from "../assets/logo_black.svg";
import Notification from "../assets/Notification.svg";

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <img src={logo_black} alt="Logo" style={{ width: "75px", height: "30px" }} />
      <img src={Notification} alt="Notification" style={{ width: "50px", height: "20px" }} />
    </nav>
  );
}
