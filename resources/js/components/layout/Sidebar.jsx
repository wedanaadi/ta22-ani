import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTachometer} from '@fortawesome/free-solid-svg-icons'
import {faCircle} from '@fortawesome/free-regular-svg-icons'

const Sidebar = () => {
  return (
    <aside className="bg-white" id="sidebar-wrapper">
      <div className="sidebar-heading text-center py-header primary-text fs-4 fw-bold text-uppercase border-bottom">
        {/* <i className="fas fa-user-secret me-2" /> */}
        {/* <FontAwesomeIcon icon={faUserSecret} className="me-2" /> */}
        {/* Codersbite */}
        &nbsp;
      </div>
      <div className="list-group list-group-flush my-3">
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text active"
        >
          <FontAwesomeIcon icon={faTachometer} className="me-2" />
          Dashboard
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Projects
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Analytics
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Reports
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Store Mng
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Products
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Chat
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent second-text fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Outlet
        </a>
        <a
          href="#"
          className="list-group-item list-group-item-action bg-transparent text-danger fw-bold"
        >
          <FontAwesomeIcon icon={faCircle} className="me-2" />
          Logout
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
