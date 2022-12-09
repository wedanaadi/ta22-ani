import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../../hook/Token';
import jwt_decode from 'jwt-decode'
import { toast, ToastContainer } from "react-toastify";

const ExcelAbsen = () => {
  const closeModal = useRef(null);
  const [file, setFile] = useState(null);
  const { token, setToken, exp, setExp } = useToken();
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const navigasi = useNavigate()

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

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("save");
    setErrors([]);
    const notifProses = toast.loading("Processing....");
    setWait(true);
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/absen/import`,
        {
          file,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      setWait(false);
      toast.update(notifProses, {
        render: "Import Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setTimeout(() => {
        closeModal.current.click();
        navigasi(0)
      }, 2100);
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
      id="commentModal"
      tabIndex="-1"
      aria-labelledby="commentMdLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="commentMdLabel">
              Import Absen
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeModal}
            ></button>
          </div>
          <form onSubmit={handleLogin}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  File
                </label>
                <input type="file" className='form-control' onChange={(e) => setFile(e.target.files[0])} />
                {errors.file?.map((msg, index) => (
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

export default ExcelAbsen
