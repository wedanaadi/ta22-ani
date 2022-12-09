import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { useToken } from "../../../hook/Token";
import useLoading from "../../Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Rekap = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [periode, setPeriode] = useState(new Date());
  const [rekaps, setRekaps] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loader, showLoader, hideLoader, isLoad] = useLoading();
  const [visible, setVisible] = useState(false);
  const navigasi = useNavigate();

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
          console.log(error);
          if (error?.response?.status === 401) {
            localStorage.clear("isLogin");
            localStorage.clear("auth_user");
            navigasi("/login");
          } else if (error?.response?.status === 500) {
            toast.update(auth, {
              render: error?.response?.data?.message,
              type: "error",
              isLoading: false,
              autoClose: 1500,
            });
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
  const getRekap = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/rekap-absen`,
      {
        params: {
          id: dataLokal.id,
          role: dataLokal.role,
          date: periode,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let dataPivot = [];
    for (let key in response.data[0]) {
      if (response.data[0].hasOwnProperty(key)) {
        console.log(key + " -> " + response.data[0][key]);
        if (key.indexOf("tgl_") === 0) {
          let tgls = key.split("_");
          dataPivot.push({
            tgl: tgls[1],
            value: response.data[0][key],
          });
        }
      }
    }
    setRekaps(dataPivot);
    setVisible(true)
    hideLoader();
  };

  const handleView = () => {
    setVisible(false)
    getRekap();
  };

  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="card-title">Rekap Absen</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="mb-3">Periode</label>
              <div className="d-flex justify-content-between">
                <DatePicker
                  selected={periode}
                  onChange={(date) => setPeriode(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-5">
              <label className="mb-4"></label>
              <div className="mb-1"></div>
              <button className="btn btn-info" onClick={handleView}>
                <FontAwesomeIcon icon={faEye} />
                &nbsp; Lihat
              </button>
            </div>
          </div>
        </div>
        {visible ? (
          <>
            <hr />
            <div className="table-responsive">
              <table className="table table-striped table-bordered nowrap">
                <thead>
                  <tr>
                    {/* <th>&nbsp;</th> */}
                    <th colSpan={rekaps.length + 1} className="text-center">
                      T &nbsp;&nbsp; A &nbsp;&nbsp; N &nbsp;&nbsp; G
                      &nbsp;&nbsp; G &nbsp;&nbsp; A &nbsp;&nbsp; L
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">&nbsp;</th>
                    {rekaps.length &&
                      rekaps.map((rekap) => <th>{rekap.tgl}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Keterangan</th>
                    {rekaps.length &&
                      rekaps.map((rekap) => <td>{rekap.value}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          false
        )}
      </div>
    </div>
  );
};

export default Rekap;
