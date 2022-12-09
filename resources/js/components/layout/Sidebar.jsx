import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometer } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
  return (
    <aside className="bg-white" id="sidebar-wrapper">
      <div className="sidebar-heading text-center py-header primary-text fs-4 fw-bold text-uppercase border-bottom">
        {/* <i className="fas fa-user-secret me-2" /> */}
        {/* <FontAwesomeIcon icon={faUserSecret} className="me-2" /> */}
        {/* Codersbite */}
        &nbsp;
      </div>
      <div className="list-group list-group-flush my-3">
        <Link
          to={`/`}
          className={`list-group-item list-group-item-action bg-transparent second-text ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTachometer} className="me-2" />
          Dashboard
        </Link>
        {dataLokal.role === 1 ? (
          <Link
            to={`/user`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/user" ||
              location.pathname === "/user/add" ||
              location.pathname === "/user/edit"
                ? "active"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            User
          </Link>
        ) : (
          <></>
        )}

        {dataLokal.role === 2 ? (
          <>
          <Link
              to={`/list`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/list" ||
                location.pathname === "/list/add" ||
                location.pathname === "/list/edit"
                  ? "active"
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              List Gaji Jabatan
            </Link>
            <Link
              to={`/jabatan`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/jabatan" ||
                location.pathname === "/jabatan/add" ||
                location.pathname === "/jabatan/edit"
                  ? "active"
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Jabatan
            </Link>
            <Link
              to={`/pegawai`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/pegawai" ||
                location.pathname === "/pegawai/add" ||
                location.pathname === "/pegawai/edit"
                  ? "active"
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Pegawai
            </Link>
            <Link
              to={`/cuti`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/cuti" ||
                location.pathname === "/cuti/add" ||
                location.pathname === "/cuti/edit"
                  ? "active"
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Cuti
            </Link>
            <Link
              to={`/absen`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/absen" ||
                location.pathname === "/absen/add" ||
                location.pathname === "/absen/edit"
                  ? "active"
                  : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Absen
            </Link>
          </>
        ) : (
          <></>
        )}

        {dataLokal.role === 2 || dataLokal.role === 4 ? (
          <>
          <Link
            to={`/kinerja`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/kinerja" ||
              location.pathname === "/kinerja/add" ||
              location.pathname === "/kinerja/slip" ||
              location.pathname === "/kinerja/edit"
                ? "active"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Kinerja
          </Link>
          <Link
            to={`/kenaikan`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/kenaikan" ||
              location.pathname === "/kenaikan/add" ||
              location.pathname === "/kenaikan/slip" ||
              location.pathname === "/kenaikan/edit"
                ? "active"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Kenaikan Gaji
          </Link>
          <Link
            to={`/gaji`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/gaji" ||
              location.pathname === "/gaji/add" ||
              location.pathname === "/gaji/slip" ||
              location.pathname === "/gaji/edit"
                ? "active"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Gaji
          </Link>
          </>
        ) : (
          <></>
        )}

        {dataLokal.role === 2 || dataLokal.role === 4 ? (
          <Link
            to={`/comment/list`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/comment/list" ||
              location.pathname === "/slip/comment"
                ? "active"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Comment
          </Link>
        ) : (
          <></>
        )}

        {dataLokal.role === 3 ? (
          <Link
            to={`cutipegawai`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/cutipegawai" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Pengajuan Cuti
          </Link>
        ) : (
          <></>
        )}

        {dataLokal.role !== 4 ? (
          <Link
            to={`rekap`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/rekap" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Rekap Absen
          </Link>
        ) : (
          <></>
        )}

        {dataLokal.role !== 4 ? (
          <Link
            to={`slip`}
            className={`list-group-item list-group-item-action bg-transparent second-text ${
              location.pathname === "/slip" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faCircle} className="me-2" />
            Slip Gaji
          </Link>
        ) : (
          <></>
        )}

        {dataLokal.role === 4 ? (
          <>
            <Link
              to={`/pegawai/laporan`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/pegawai/laporan" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Laporan Pegawai
            </Link>
            <Link
              to={`/cuti/laporan`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/cuti/laporan" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Laporan Cuti
            </Link>
            <Link
              to={`/absen/laporan`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/absen/laporan" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Laporan Absen
            </Link>
            <Link
              to={`/gaji/laporan`}
              className={`list-group-item list-group-item-action bg-transparent second-text ${
                location.pathname === "/gaji/laporan" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCircle} className="me-2" />
              Laporan Gaji
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
