import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToken } from "../../hook/Token";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faCommenting } from "@fortawesome/free-regular-svg-icons";

const Sample = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [countPegawai, setCountPegawai] = useState(0);
  const [countJabatan, setCountJabatan] = useState(0);
  const [countComment, setCountComment] = useState(0);

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

  const fetch = async () => {
    const pegawaiPromise = getCountPegawai();
    const commentPromise = getCountComment();
    const jabatanPromise = getCountJabatan();

    // await pegawaiPromise
    // await commentPromise
    // await jabatanPromise
  };

  useEffect(() => {
    fetch();
  }, []);

  // const navigasi = useNavigate();
  return (
    <div className="container-fluid px-4">
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
