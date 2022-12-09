import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useToken } from '../../../hook/Token';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import Select from "react-select";
import { useNavigate } from 'react-router-dom';

export default function StatusModal({idKinerja}) {
  const closeModal = useRef(null);
  const [status, setStatus] = useState({value:1, label:"Tercapai"});
  const { token, setToken, exp, setExp } = useToken();
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const navigasi = useNavigate()
  const optStatus = [
    {value:1, label:"Tercapai"},
    {value:2, label:"Tidak Tercapai"},
  ]

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const notifProses = toast.loading("Processing....");
    setWait(true);
    try {
      const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
      const { data: response } = await axiosJWT.put(
        `${import.meta.env.VITE_BASE_URL}/status-kinerja/${idKinerja}`,
        {
          status: status.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWait(false);
      toast.update(notifProses, {
        render: "Create Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      closeModal.current.click();
      setTimeout(() => {
        navigasi(0)
      }, 1500);
    } catch (error) {
      setWait(false);
      if (error?.response?.status === 422) {
        toast.update(notifProses, {
          render: "Error Validation",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          theme: "light",
        });
        setErrors(error.response.data.error);
      } else if (error?.response?.status === 500) {
        toast.update(auth, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(notifProses, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div
      className="modal fade"
      id="statusModal"
      tabIndex="-1"
      aria-labelledby="statusMdLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="statusMdLabel">
              Ubah Status
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <Select
                  value={status}
                  onChange={setStatus}
                  options={optStatus}
                />
                {errors.status?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
