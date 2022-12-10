import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToken } from "../../hook/Token";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faCommenting } from "@fortawesome/free-regular-svg-icons";

const Sample = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [countPegawai, setCountPegawai] = useState(0);
  const [countJabatan, setCountJabatan] = useState(0);
  const [countComment, setCountComment] = useState(0);
  const [profile, setProfile] = useState([]);

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (exp * 1000 < currentDate.getTime()) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/refresh`
        );

        config.headers.Authorization = `Bearer ${data.access_token}`;
        setToken(data.access_token);
        const decode = jwt_decode(data.access_token);
        setExp(decode.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getCountPegawai = async () => {
    const { data } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCountPegawai(data.data.length);
  };
  const getCountJabatan = async () => {
    const { data } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/jabatan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCountJabatan(data.data.length);
  };

  const getCountComment = async () => {
    const { data } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/comment`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCountComment(data.data.length);
  };

  const getProfile = async () => {
    const { data } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/profile/${dataLokal.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProfile(data.data);
  };

  const convertDate = (dateProps) => {
    let date = new Date(dateProps);
    return date
      .toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .toString();
  };

  const fetch = async () => {
    getCountPegawai();
    getCountComment();
    getCountJabatan();
    getProfile();

    // await pegawaiPromise
    // await commentPromise
    // await jabatanPromise
  };

  useEffect(() => {
    fetch();
  }, []);

  const [collapse, setCollapse] = useState(false);
  const [collapseWaiting, setCollapseWait] = useState(false);

  const handleCollapse = () => {
    setCollapseWait(true);
    setCollapse(!collapse);
    setCollapseWait(false);
  };

  // const navigasi = useNavigate();
  return (
    <div className="container-fluid px-4">
      <div className="card">
        <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
          <h5 className="card-title">Profile</h5>
          <button
            className={`btn ${collapse ? "btn-info" : "btn-primary"}`}
            data-bs-toggle="collapse"
            onClick={handleCollapse}
          >
            {collapse ? (
              <FontAwesomeIcon icon={faMinus} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
          </button>
        </div>
        <div
          className={`card-body collapse ${
            collapseWaiting ? "collapsing" : collapse ? "show" : ""
          }`}
          id="collapseExample"
        >
          <table className="w-75">
            <tbody>
              <tr>
                <td>Nama</td>
                <td>:</td>
                <td>{profile?.nama_pegawai}</td>
              </tr>
              <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>{profile?.jabatan?.nama_jabatan}</td>
              </tr>
              <tr>
                <td>Tanggal Lahir</td>
                <td>:</td>
                <td>{convertDate(profile?.tanggal_lahir)}</td>
              </tr>
              <tr>
                <td>Tanggal Bergabung</td>
                <td>:</td>
                <td>{convertDate(profile?.tanggal_bergabung)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>{profile?.alamat}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row g-3 my-2">
        <div className="col-md-3">
          <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
            <div>
              <h3 className="fs-2">{countPegawai}</h3>
              <p className="fs-5">Jumlah Pegawai</p>
            </div>
            <FontAwesomeIcon
              icon={faUsers}
              className="fs-1 primary-text border rounded-full secondary-bg p-3"
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
            <div>
              <h3 className="fs-2">{countJabatan}</h3>
              <p className="fs-5">Jumlah Jabatan</p>
            </div>
            <FontAwesomeIcon
              icon={faUserPlus}
              className="fs-1 primary-text border rounded-full secondary-bg p-3"
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{countComment}</h3>
                <p className="fs-5">Comment</p>
              </div>
              <FontAwesomeIcon
                icon={faCommenting}
                className="fs-1 primary-text border rounded-full secondary-bg p-3"
              />
            </div>
            {dataLokal.role === 2 || dataLokal.role === 4 ? (
              <>
                <hr />
                <Link to={"/comment/list"}>Comment</Link>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* <div className="col-md-3">
          <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
            <div>
              <h3 className="fs-2">%25</h3>
              <p className="fs-5">Increase</p>
            </div>
            <FontAwesomeIcon icon={faChartLine} className="fs-1 primary-text border rounded-full secondary-bg p-3" />
          </div>
        </div> */}
      </div>

      {/* end */}
    </div>
  );
};

export default Sample;
