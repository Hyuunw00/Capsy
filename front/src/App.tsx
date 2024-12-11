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
import { useLoginStore } from "./store/loginStore";
import { useEffect } from "react";
import axiosInstance from "./apis/axiosInstance";
import { tokenService } from "./utils/token";
import Private from "./layouts/Private";
import NonPrivate from "./layouts/NonPrivate";
import MyPage2 from "./pages/mypage/MyPage2";

export default function App() {
  // 새로고침할때마다 session storage에서 token 받아와서 로그인
  const login = useLoginStore((state) => state.login);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);

  console.log(isLoggedIn);

  const getUser = async () => {
    try {
      if (tokenService.getToken()) {
        login(tokenService.getToken());
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<Private />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/detail/:postId" element={<PostDetailPage />} />
            <Route path="/event" element={<Event />} />
            <Route path="/mypage2" element={<MyPage2 />} />
            <Route path="/resetpassword" element={<PasswordResetPage />} />
            <Route path="/newpassword" element={<NewPasswordPage />} />
          </Route>

          <Route element={<NonPrivate />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signupsuccess" element={<SignUpSuccessPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
