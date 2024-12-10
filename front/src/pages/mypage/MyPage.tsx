import ProfileimageForm from "./modal/ProfileImageForm";
import ProfileForm from "./modal/ProfileForm";
import ProfileHeader from "../../components/ProfileHeader";

export default function MyPage() {
  return (
    <>
      <h1>My Page</h1>
      <ProfileimageForm />
      <ProfileForm />
      <ProfileHeader />
    </>
  );
}
