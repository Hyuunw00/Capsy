import { useEffect, useState } from "react";
import logo_black from "../../assets/logo_black.svg";
import Notification from "../../assets/Notification.svg";
import NotifyModal from "./NotifyModal";
import Button from "../Button";
import { tokenService } from "../../utils/token";
import { getNotifications } from "../../apis/apis";

export default function Header() {
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const user = tokenService.getUser;

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotifications();
      setNotifications(response);
      console.log(response);
    };
    fetchData();
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 py-4">
      <img src={logo_black} alt="Logo" className="w-[75px] h-[30px]" />
      <button onClick={() => setShowNoticeModal((prev) => !prev)} className="flex items-center justify-center w-5 h-5">
        <img src={Notification} alt="Notification" className="object-contain w-full h-full" />
      </button>
      <NotifyModal username={`@user`} content="이제부터 알아봐야지" isVisible={showNoticeModal}>
        <div className="gap-1 item-between">
          <Button className="px-2 py-0.5 h-7 items-center text-black rounded w-fit border border-black box-border text-sm">
            거절
          </Button>
          <Button className="px-2 py-0.5 h-7 items-center text-white rounded w-fit bg-black text-sm">확인</Button>
        </div>
      </NotifyModal>
    </nav>
  );
}
