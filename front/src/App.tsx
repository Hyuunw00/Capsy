import { Route, Routes } from "react-router";
import RootLayout from "./layouts/RootLayout";
import MainPage from "./pages/main/MainPage";
import EditorPage from "./pages/editor/EditorPage";
import PostDetailPage from "./pages/post/PostDetailPage";
import Event from "./pages/event/Event";
import Login from "./pages/login/LoginPage";
import MyPage from "./pages/mypage/MyPage";
import SignUpPage from "./pages/signup/SignUpPage";
import SignUpSuccessPage from "./pages/signup/SignUpSuccessPage";
import PasswordResetPage from "./pages/password/PasswordResetPage";
import NewPasswordPage from "./pages/password/NewPasswordPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/detail/:postId" element={<PostDetailPage />} />
          <Route path="/event" element={<Event />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signupsuccess" element={<SignUpSuccessPage />} />
          <Route path="/resetpassword" element={<PasswordResetPage />} />
          <Route path="/newpassword" element={<NewPasswordPage />} />
        </Route>
      </Routes>
    </>
  );
}
