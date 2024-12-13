import { useNavigate } from "react-router-dom";
import Left from "../../assets/Left.svg";
import logo_black from "../../assets/logo_black.svg";
import Notification from "../../assets/Notification.svg";

export default function PageHeader() {
  const navigate = useNavigate();
  return (
    <nav className="px-8 py-4 item-between ">
      <button onClick={() => navigate(-1)} className="flex flex-col items-center text-white">
        <img src={Left} alt="Left" className="w-8 h-8" />
      </button>
      
      <button onClick={() => navigate("/")}>
        <img src={logo_black} alt="Logo" className="w-[75px] h-[30px]" />
      </button>

      <img src={Notification} alt="Notification" className="w-5 h-5" />
    </nav>
  );
}
