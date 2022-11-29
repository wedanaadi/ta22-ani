import {
  faArrowLeft,
  faComment,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../../../hook/Token";
import Komentar from "../gaji/Komentar";
import jwt_decode from "jwt-decode";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";

const indexComment = () => {
  const navigasi = useNavigate();
  const { token, setToken, exp, setExp } = useToken();
  const dataGaji = JSON.parse(atob(localStorage.getItem("gajiEdit")));
  const axiosJWT = axios.create();
  const [comment, setComment] = useState([]);

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

  const getCommentGaji = async () => {
    try {
      const { data: response } = await axiosJWT.get(
        `${import.meta.env.VITE_BASE_URL}/comment-by/${dataGaji.id_gaji}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommentGaji();
  }, []);

  const convertToDate = (dateProps) => {
    let date = new Date(dateProps);
    return date
      .toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
      .toString();
  };

  const confirm = (id) => {
    confirmAlert({
      title: "Hapus Data",
      message: "Yakin melakukan ini.",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "Cancel",
          onClick: () => false,
        },
      ],
    });
  };

  const handleDelete = async (id) => {
    const notifDelete = toast.loading("Saving....");
    try {
      await axiosJWT.delete(
        `${import.meta.env.VITE_BASE_URL}/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
          },
        }
      );
      await getCommentGaji();
      toast.update(notifDelete, {
        render: "Delete Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      if (error?.response?.status === 422) {
        toast.update(notifDelete, {
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
        toast.update(notifDelete, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else if (error?.response?.status === 401) {
        toast.update(notifDelete, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(notifDelete, {
          render: error?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div className="card">
      <Komentar />
      <ToastContainer />
      <div className="card-header bg-white d-sm-flex justify-content-between align-items-center">
        <h5 className="card-title">Comment</h5>
        <div>
          <Link
            to={`/slip/comment`}
            className="btn btn-info"
            data-bs-toggle="modal"
            data-bs-target="#commentModal"
          >
            <FontAwesomeIcon icon={faComment} />
            &nbsp; Buat Comments
          </Link>
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
        <section className="py-2">
          <ul className="timeline">
            {comment.length == 0 ? (
              <>No Commment</>
            ) : (
              comment.map((komentar) => (
                <li className="timeline-item mb-5" key={komentar.id_comment}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold">{komentar.nama_pegawai}</h5>
                    <button
                      className="btn btn-danger"
                      onClick={() => confirm(komentar.id_comment)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      &nbsp; Hapus
                    </button>
                  </div>
                  <p className="text-muted mb-2 fw-bold">
                    {convertToDate(komentar.created_at)}
                  </p>
                  <p className="text-muted">{komentar.comment}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default indexComment;
