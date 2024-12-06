import { Route, Routes } from "react-router";
import Main from "./pages/Main";
import Write from "./pages/Write";
import Event from "./pages/Event";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import RootLayout from "./layouts/RootLayout";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/write" element={<Write />} />
          <Route path="/event" element={<Event />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}
