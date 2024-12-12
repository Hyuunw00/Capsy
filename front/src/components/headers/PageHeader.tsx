import { useNavigate } from "react-router-dom";
import Left from "../../assets/Left.svg";
import logo_black from "../../assets/logo_black.svg";
import Notification from "../../assets/Notification.svg";

export default function PageHeader() {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex flex-col items-center text-white"
      >
        <img src={Left} alt="Left" style={{ width: "24px", height: "24px" }} />
      </button>
      
      <img src={logo_black} alt="Logo" style={{ width: "75px", height: "30px" }} />
      
      <img src={Notification} alt="Notification" style={{ width: "20px", height: "20px" }} />
    </nav>

  );
}
