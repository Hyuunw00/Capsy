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
import { useEffect, useState } from "react";
import { tokenService } from "./utils/token";
import Private from "./layouts/Private";
import NonPrivate from "./layouts/NonPrivate";
import Loading from "./components/Loading";
import CapsuleListPage from "./components/CapsuleListPage";
import AlarmListPage from "./components/AlarmListPage";

export default function App() {
  // 새로고침할때마다 session storage에서 token 받아와서 로그인
  const login = useLoginStore((state) => state.login);

  // 처음에 렌더링될때 isLoggedIn이 false가 되는것을 방지
  const [isLoading, setIsLoading] = useState(true);
  const getUser = async () => {
    try {
      if (tokenService.getToken()) {
        login(tokenService.getToken());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route element={<Private />}>
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/detail/:postId" element={<PostDetailPage />} />
            <Route path="/event" element={<Event />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/resetpassword" element={<PasswordResetPage />} />
            <Route path="/newpassword" element={<NewPasswordPage />} />
            <Route path="/capsule-list" element={<CapsuleListPage />} /> {/* 추가된 경로 */}
            <Route path="/alarm-list" element={<AlarmListPage />} /> {/* 추가된 경로 */}
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
