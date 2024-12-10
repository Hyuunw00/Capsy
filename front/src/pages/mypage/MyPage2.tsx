import { Link, useNavigate } from "react-router";
import { useLoginStore } from "../../store/loginStore";
import { useEffect } from "react";

export default function MyPage2() {
  const navigate = useNavigate();
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <h1>My Page</h1>

      {/*  실험용으로 만들어본 비밀번호 수정 페이지 */}
      <Link to="/resetpassword">비밀번호 수정</Link>
    </>
  );
}
