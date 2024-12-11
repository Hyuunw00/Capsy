import { useEffect, useState } from "react";
import { useLoginStore } from "../store/loginStore";
import { Outlet, useNavigate } from "react-router";

export default function NonPrivate() {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      return;
    }
    setShow(true);
  }, []);
  return <div>{show && <Outlet />}</div>;
}
