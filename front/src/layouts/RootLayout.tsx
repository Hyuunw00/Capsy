import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";

export default function RootLayout() {
  const location = useLocation();

  const renderHeader = () => {
    if (location.pathname === "/editor") {
      return <PageHeader />;
    }

    return <Header />;
  };

  return (
    <div className="relative" style={{ width: "600px", height: "100vh", margin: "0 auto" }}>
      {renderHeader()}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
