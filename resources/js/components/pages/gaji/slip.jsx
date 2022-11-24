import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faArrowLeft,
  faCheck,
  faComment,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NumericFormat } from "react-number-format";
import { round } from "lodash";
import Komentar from "./Komentar";
import axios from "axios";
import { useToken } from "../../../hook/Token";

const slip = () => {
  const navigasi = useNavigate();
  const { token, setToken, exp, setExp } = useToken();
  const localEditData = JSON.parse(atob(localStorage.getItem("gajiEdit")));
  const [countComment, setCountComment] = useState(0);
  const getLastDay = () => {
    let current = new Date();
    const y = current.getFullYear();
    const m = current.getMonth();
    const last = new Date(y, m + 1, 0).getDate();
    return last;
  };

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (exp * 1000 < currentDate.getTime()) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/refresh`
          );

          config.headers.Authorization = `Bearer ${data.access_token}`;
          setToken(data.access_token);
          const decode = jwt_decode(data.access_token);
          setExp(decode.exp);
        } catch (error) {
          if (error?.response?.status === 401) {
            localStorage.clear("isLogin");
            localStorage.clear("auth_user");
            navigasi("/login");
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const checkComment = async () => {
    const editlocal = JSON.parse(atob(localStorage.getItem("gajiEdit")));
    try {
      const { data: response } = await axiosJWT.get(
        `${import.meta.env.VITE_BASE_URL}/check/${editlocal.id_gaji}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountComment(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkComment();
  }, []);

  const handleValidasi = async () => {
    try {
      const { data: response } = await axiosJWT.put(
        `${import.meta.env.VITE_BASE_URL}/validasi/${localEditData.id_gaji}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigasi("/gaji");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSlip = async () => {
    window.open(`${import.meta.env.VITE_BASE_URL}/slip/export/${dataLokal.id}`)
  };

  return (
    <>
      <Komentar />
      <div className="card">
        <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
          <h5 className="card-title fw-bold">SLIP GAJI</h5>
          <div>
            <button className="btn btn-danger" onClick={()=>handleSlip()}>
              <FontAwesomeIcon icon={faFileExcel} />
              &nbsp; Laporan
            </button>
            &nbsp;
            <button
              onClick={() => navigasi(-1)}
              className="btn btn-secondary float-end"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </button>
          </div>
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
              {dataLokal.role === 4 ? (
                <button className="btn btn-success" onClick={handleValidasi}>
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp; Validasi
                </button>
              ) : (
                <></>
              )}{" "}
              {countComment > 0 && dataLokal.role !== 4 ? (
                <></>
              ) : (
                <button
                  className="btn btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#commentModal"
                >
                  <FontAwesomeIcon icon={faComment} />
                  &nbsp; Comments
                </button>
              )}
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
