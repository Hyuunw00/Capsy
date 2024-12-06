import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <nav>
        <ul className="flex gap-2 underline text-blue-500">
          <li>
            <NavLink to="/">Main</NavLink>
          </li>
          <li>
            <NavLink to="/write">Write</NavLink>
          </li>
          <li>
            <NavLink to="/event">Event</NavLink>
          </li>
          <li>
            <NavLink to="/mypage">My Page</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
