import { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileContainer from "./ProfileContainer";
import Loading from "../../components/Loading";

export default function MyPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ProfileHeader />
          <ProfileContainer />
        </>
      )}
    </>
  );
}
