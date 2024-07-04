import styled from "styled-components";
import { FaUserAlt, FaHome } from "react-icons/fa";
import { HiArrowLeftEndOnRectangle } from "react-icons/hi2";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
  curseor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;

  .log-out {
    color: tomato !important;
  }

  svg {
    color: white;
    font-size: 20px;
  }
`;

export default function Layout() {
  const navigate = useNavigate();
  const onLogout = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>
            <FaHome />
          </MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>
            <FaUserAlt />
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogout}>
          <HiArrowLeftEndOnRectangle className="log-out" />
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
}
