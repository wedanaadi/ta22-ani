import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Laporan = () => {
  return (
    <div>
    <div className="row page-titles">
      <ol className="breadcrumb">
        <li className="breadcrumb-item active">
          <span href="javascript:void(0)">Laporan</span>
        </li>
        {/* <li className="breadcrumb-item">
          <a href="javascript:void(0)">Badge</a>
        </li> */}
      </ol>
    </div>

    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
        <h5 className="card-title">Laporan Data Pegawai</h5>
        <button className="btn btn-danger float-end" onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/pegawai/export`)}>
          <FontAwesomeIcon icon={faFileExcel} />
          &nbsp; Export
        </button>
        </div>
      </div>
    </div>

    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
        <h5 className="card-title">Laporan Data Cuti</h5>
        <button className="btn btn-danger float-end" onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/cuti/export`)}>
          <FontAwesomeIcon icon={faFileExcel} />
          &nbsp; Export
        </button>
        </div>
      </div>
    </div>

    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
        <h5 className="card-title">Laporan Absensi</h5>
        <button className="btn btn-danger float-end" onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/absensi/export`)}>
          <FontAwesomeIcon icon={faFileExcel} />
          &nbsp; Export
        </button>
        </div>
      </div>
    </div>

    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
        <h5 className="card-title">Laporan Gaji</h5>
        <button className="btn btn-danger float-end" onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}/gaji/export`)}>
          <FontAwesomeIcon icon={faFileExcel} />
          &nbsp; Export
        </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Laporan;
