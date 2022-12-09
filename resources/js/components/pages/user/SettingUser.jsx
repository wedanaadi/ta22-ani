import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useToken } from "../../../hook/Token";
import jwt_decode from "jwt-decode";

const SettingUser = () => {
  const closeModal = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken, exp, setExp } = useToken();
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);

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
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/setting`,
        {
          id_pegawai: dataLokal.id,
          username,
          password
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
      setUsername("");
      setPassword("");
      setTimeout(()=>{
        closeModal.current.click();
      },1550)
    } catch (error) {
      if (error?.response?.status === 422) {
        toast.update(notifProses, {
          render: "Error Validation",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          theme: "light",
        });
        setErrors(error.response.data.error);
      } else if (
        error?.response?.status === 405 ||
        error?.response?.status === 500
      ) {
        toast.update(notifProses, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else if (error?.response?.status === 401) {
        toast.update(notifProses, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(notifProses, {
          render: error?.message,
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
      id="settingModal"
      tabIndex="-1"
      aria-labelledby="settingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="settingModalLabel">
              Setting User
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Username
                </label>
                <input type="text" value={username} className="form-control" onChange={(e)=>setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Password
                </label>
                <input type="text" value={password} className="form-control" onChange={(e)=>setPassword(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingUser;
