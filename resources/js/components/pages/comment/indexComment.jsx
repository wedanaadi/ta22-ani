import { faArrowLeft, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../../../hook/Token";
import Komentar from "../gaji/Komentar";
import jwt_decode from "jwt-decode";

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

  return (
    <div className="card">
      <Komentar />
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
          <button onClick={()=>navigasi(-1)} className="btn btn-secondary float-end">
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
                  <h5 className="fw-bold">{komentar.nama_pegawai}</h5>
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
