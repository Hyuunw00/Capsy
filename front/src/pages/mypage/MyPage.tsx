import ProfileimageForm from "./modal/ProfileImageForm";
import ProfileForm from "./modal/ProfileForm";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileContainer from "../../components/ProfileContainer";

export default function MyPage() {
  return (
    <>
      <ProfileimageForm />
      <ProfileForm />
      <ProfileHeader />
      <ProfileContainer />
    </>
  );
}
