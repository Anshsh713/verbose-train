import React from "react";
import { Link, NavLink } from "react-router-dom";
function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/Profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/Home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/planner">Day Planner</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
