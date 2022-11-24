import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  faArrowLeft,
  faCheck,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NumericFormat } from "react-number-format";
import { round } from "lodash";

const slip = () => {
  const localEditData = JSON.parse(atob(localStorage.getItem("gajiEdit")));
  const getLastDay = () => {
    let current = new Date();
    const y = current.getFullYear();
    const m = current.getMonth();
    const last = new Date(y, m + 1, 0).getDate();
    return last;
  };

  return (
    <>
      <div className="card">
        <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
          <h5 className="card-title fw-bold">SLIP GAJI</h5>
          <Link to="/gaji" className="btn btn-secondary float-end">
            <FontAwesomeIcon icon={faArrowLeft} />
            &nbsp; Kembali
          </Link>
        </div>
        <div className="card-body">
          <div className="row px-2">
            <table className="table w-50 fw-bold">
              <tbody>
                <tr>
                  <td>Nama</td>
                  <td>:</td>
                  <td>{localEditData.pegawai.nama_pegawai}</td>
                </tr>
                <tr>
                  <td>Jabatan</td>
                  <td>:</td>
                  <td>{localEditData.pegawai.jabatan.nama_jabatan}</td>
                </tr>
                <tr>
                  <td>Total Hari dalam 1 Bulan</td>
                  <td>:</td>
                  <td>{`${
                    parseInt(getLastDay()) - 4
                  } days ( ${getLastDay()} days - 4 days )`}</td>
                </tr>
                <tr>
                  <td>Total Hari Kerja</td>
                  <td>:</td>
                  <td>{`${localEditData.total_hadir} days`}</td>
                </tr>
                <tr>
                  <td>Off Day</td>
                  <td>:</td>
                  <td>{`${
                    parseInt(getLastDay()) - 4 - localEditData.total_hadir
                  } days`}</td>
                </tr>
                <tr>
                  <td>Gaji Pokok 1 Bulan</td>
                  <td>:</td>
                  <td>
                    <NumericFormat
                      displayType="text"
                      value={localEditData.gaji_pokok}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tunjangan 1 Bulan</td>
                  <td>:</td>
                  <td>
                    <NumericFormat
                      displayType="text"
                      value={localEditData.tunjangan}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="w-50 text-end">
              <span className="fw-bold mb-3">GAJI</span>
            </div>
            <div>
              <button className="btn btn-success">
                <FontAwesomeIcon icon={faCheck} />
                &nbsp; Validasi
              </button>{" "}
              <button
                className="btn btn-info"
              >
                <FontAwesomeIcon icon={faComment} />
                &nbsp; Comments
              </button>
            </div>
          </div>
          <div className="row mb-3">
            <div className="table-responsive">
              <table className="table table-striped table-bordered nowrap">
                <thead>
                  <tr>
                    <th>KETERANGAN</th>
                    <th>JUMLAH</th>
                    <th>HARI KERJA</th>
                    <th>PER HARI</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold">GAJI POKOK</td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={localEditData.gaji_pokok}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                    <td className="text-end">{localEditData.total_hadir}</td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={round(
                          localEditData.gaji_pokok /
                            (parseInt(getLastDay()) - 4)
                        )}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={
                          round(
                            localEditData.gaji_pokok /
                              (parseInt(getLastDay()) - 4)
                          ) * parseInt(localEditData.total_hadir)
                        }
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">TUNJANGAN</td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={localEditData.tunjangan}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                    <td className="text-end">{localEditData.total_hadir}</td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={round(
                          localEditData.tunjangan / (parseInt(getLastDay()) - 4)
                        )}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={
                          round(
                            localEditData.tunjangan /
                              (parseInt(getLastDay()) - 4)
                          ) * parseInt(localEditData.total_hadir)
                        }
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
                <tfoot className="fw-bold text-center">
                  <tr>
                    <td colSpan={4}>TOTAL GAJI</td>
                    <td className="text-end">
                      <NumericFormat
                        displayType="text"
                        value={
                          round(
                            localEditData.gaji_pokok /
                              (parseInt(getLastDay()) - 4)
                          ) *
                            parseInt(localEditData.total_hadir) +
                          round(
                            localEditData.tunjangan /
                              (parseInt(getLastDay()) - 4)
                          ) *
                            parseInt(localEditData.total_hadir)
                        }
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default slip;
