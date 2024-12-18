import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tokenService } from "../../utils/token";
import ProfileHeader from "./ProfileHeader";
import ProfileContainer from "./ProfileContainer";
import { searchUsersByFullName, getUserProfile } from "../../apis/apis";
import Loading from "../../components/Loading";
interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  image: string;
}
export default function UserInfoPage() {
  const { fullname } = useParams<{ fullname: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const user = tokenService.getUser();
    if (user && fullname === user.fullName) {
      navigate("/mypage");
      return;
    }
    const fetchUserData = async () => {
      if (!fullname) return;

      setIsLoading(true);
      try {
        const users = await searchUsersByFullName(fullname);
        if (users && users.length > 0) {
          const userProfile = await getUserProfile(users[0]._id);
          setUserData(userProfile);
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [fullname, navigate]);
  if (isLoading) return <Loading />;
  if (!userData) return null;
  return (
    <>
      <ProfileHeader />
      <ProfileContainer userId={userData._id} fullName={fullname} />
    </>
  );
}
