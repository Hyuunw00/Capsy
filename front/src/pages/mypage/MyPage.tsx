import ProfileimageForm from "./modal/ProfileImageForm";

import ProfileHeader from "../../components/ProfileHeader";
import ProfileContainer from "../../components/ProfileContainer";

export default function MyPage() {
  return (
    <>
      <ProfileimageForm />
      <ProfileHeader />
      <ProfileContainer />
    </>
  );
}
