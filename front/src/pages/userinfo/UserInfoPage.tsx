import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tokenService } from "../../utils/token";
import ProfileHeader from "./ProfileHeader";
import ProfileContainer from "./ProfileContainer";

export default function UserInfoPage() {
  const { fullname } = useParams<{ fullname: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const user = tokenService.getUser();
    if (user && fullname === user.fullName) {
      navigate("/mypage");
    }
  }, [fullname, navigate]);

  return (
    <>
      <ProfileHeader />
      <ProfileContainer />
    </>
  );
}
