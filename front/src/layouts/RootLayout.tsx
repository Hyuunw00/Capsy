import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";

export default function RootLayout() {
  const location = useLocation();

  const renderHeader = () => {
    if (location.pathname === "/editor" || location.pathname.startsWith("/detail/")) {
      return <PageHeader />;
    }

    return <Header />;
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ width: "600px", margin: "0 auto" }}>
      {/* 헤더를 fixed로 변경 */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-white w-[600px]">{renderHeader()}</header>

      {/* 헤더와 푸터 높이만큼 패딩 추가 */}
      <main className="flex-1 mt-[60px] mb-[55px] overflow-y-auto">
        <Outlet />
      </main>

      {/* 푸터도 fixed로 변경 */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 bg-black w-[600px]">
        <Footer />
      </footer>
    </div>
  );
}
