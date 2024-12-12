import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import Header from "../components/headers/Header";
import PageHeader from "../components/headers/PageHeader";
import Footer from "../components/Footer";

export default function RootLayout() {
  const location = useLocation();

  const renderHeader = () => {
    if (location.pathname === "/") {
      return <Header />;
    }
    return <PageHeader />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-10 bg-white w-[600px]">{renderHeader()}</header>
      <main className="flex-1 mt-[60px] mb-[55px]  h-[calc(100vh-115px)]">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 bg-black w-[600px]">
        <Footer />
      </footer>
    </div>
  );
}
