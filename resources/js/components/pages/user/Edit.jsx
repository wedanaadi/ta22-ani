import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useToken } from "../../../hook/Token";
import jwt_decode from "jwt-decode";
import Select from "react-select";

const EditUser = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pegawai_id, setIdPegawai] = useState("");
  const [pegawais, setPegawais] = useState([]);
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const [idEdit, setIdEdit] = useState("")
  const [hak_akses, setHakAkses] = useState("");
  const navigasi = useNavigate();

  const optionHK = [
    { value: 1, label: "Admin" },
    { value: 2, label: "HRD" },
    { value: 3, label: "Pegawai" },
    { value: 4, label: "Pimpinan" },
  ];

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
          if (error.response.status === 401) {
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

  const localEditData = JSON.parse(atob(localStorage.getItem('UserEdit')));
  const loadPegawais = async () => {
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai-user`,
      {
        params: {
          act: 'update',
          id: localEditData.pegawai_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const options = response.data.map((data) => {
      return { value: data.id_pegawai, label: data.nama_pegawai };
    });
    setPegawais(options);
  };

  const loadEdit = () => {
    setUsername(localEditData.username)
    setIdEdit(localEditData.id)
    const selected = optionHK.filter(({value})=> value === localEditData.hak_akses)
    setHakAkses(selected[0])
  }

  const loadSelectAwait = () => {
    const selected = pegawais.filter(({value})=> value === localEditData.pegawai_id)
    setIdPegawai(selected[0])
  }

  useEffect(() => {
    loadPegawais();
    loadEdit()
  }, []);

  useEffect(() => {
    loadSelectAwait()
  }, [pegawais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: username.toLowerCase().split(" ").join(""),
      password,
      pegawai_id: pegawai_id.value,
      hak_akses: hak_akses.value,
      _method:'PUT'
    };

    const notifikasiSave = toast.loading("Saving....");
    setWait(true);
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/user/${idEdit}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
            // "Content-Type": "multipart/form-data"
          },
        }
      );
      setWait(false);
      toast.update(notifikasiSave, {
        render: "Create Successfuly",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        navigasi("/user");
      }, 500);
    } catch (error) {
      setErrors([]);
      setWait(false);
      if (error?.response?.status === 422) {
        toast.update(notifikasiSave, {
          render: "Error Validation",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          theme: "light",
        });
        setErrors(error.response.data.error);
      } else {
        toast.update(notifikasiSave, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="col-xs-12 col-md- col-lg-6">
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Tambah User</h5>
            <Link to="/user" className="btn btn-secondary float-end">
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
          <div className="card-body">
          <div className="mb-3">
                <label className="mb-3">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
          <div className="mb-3">
                <label className="mb-3">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Pegawai</strong>
                </label>
                <Select
                  value={pegawai_id}
                  onChange={setIdPegawai}
                  options={pegawais}
                />
                {errors.pegawai_id?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
              <div className="mb-3">
              <label className="mb-3">
                <strong>Hak Akses</strong>
              </label>
              <Select
                value={hak_akses}
                onChange={setHakAkses}
                options={optionHK}
              />
              {errors.hak_akses?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer d-sm-flex justify-content-between align-items-center bg-white">
            <div className="card-footer-link mb-4 mb-sm-0"></div>
            <button
              type="submit"
              className={`btn btn-primary ${waiting ? "disabled" : ""}`}
            >
              <FontAwesomeIcon icon={faSave} />
              &nbsp; Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditUser
