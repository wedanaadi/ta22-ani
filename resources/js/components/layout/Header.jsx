import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";

const Header = ({ sidebarOpen, setSidebar }) => {
  const hamburger = () => {
    setSidebar(!sidebarOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 border-bottom">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={faAlignLeft}
          className="primary-text fs-4 me-3"
          id="menu-toggle"
          onClick={() => hamburger()}
        />
        <h2 className="fs-2 m-0">Felis Ponsel</h2>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link second-text fw-bold"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/images/pic4.jpg"
                width={52}
                height={52}
                alt="logo"
                className="rounded-circle me-2"
              />
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a className="dropdown-item" href="#">
                  <span className="ms-2">Logout</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
