import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useToken } from "../../../hook/Token";
import jwt_decode from 'jwt-decode'

const Komentar = () => {
  const closeModal = useRef(null);
  const [comment, setComment] = useState("");
  const { token, setToken, exp, setExp } = useToken();
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);

  const navigasi = useNavigate()

  const localEditData = JSON.parse(atob(localStorage.getItem("gajiEdit")));

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
      const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/comment`,
        {
          comment,
          gaji_id: localEditData.id_gaji,
          pegawai_id: dataLokal.id
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
              Tambah Komentar
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
              <ToastContainer />
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Komentar
                </label>
                <textarea
                  value={comment}
                  className="form-control"
                  cols="30"
                  rows="10"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                {errors.comment?.map((msg, index) => (
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
  );
};

export default Komentar;
