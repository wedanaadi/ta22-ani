import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthConsumer from "../../hook/Auth";
import { useToken } from "../../hook/Token";
import jwt_decode from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authed, dispatch] = AuthConsumer();
  const navigasi = useNavigate();
  const { setToken, setExp } = useToken();
  const [error, setError] = useState([]);
  const [waiting, setWait] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = toast.loading("Authentication...");
    setWait(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/login`,
        { username: username.toLowerCase(), password }
      );
      const { data: me } = await axios.get("http://127.0.0.1:8000/api/me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          Accept: `application/json`,
        },
      });
      const userLocal = {
        id:me.pegawai_id,
        nama: me.pegawai.nama_pegawai,
        role: me.hak_akses,
        foto: me.pegawai.foto,
      };
      dispatch({ type: "login" });
      setToken(data.access_token);
      const decodeToken = jwt_decode(data.access_token);
      setExp(decodeToken.exp);
      localStorage.setItem("isLogin", true);
      localStorage.setItem("userLocal", btoa(JSON.stringify(userLocal)));
      setWait(false);
      toast.update(auth, {
        render: "Authentication Successfuly",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        navigasi("/");
      }, 300);
    } catch (error) {
      console.log(error);
      setError([]);
      setWait(false);
      if (error?.response?.status === 422) {
        toast.update(auth, {
          render: "Error Validation",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          theme: "light",
        });
        setError(error.response.data.error);
      } else if(error?.response?.status === 500) {
        toast.update(auth, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(auth, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div className="vh-100">
      <ToastContainer />
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <h1 className="text-center mb-2">FELIS PONSEL</h1>
              <h4 className="text-center mb-4 text-gray">
                Jl. Raya Asia No.2,
                <br />
                Desa Delod Peken, Kecamatan Tabanan,
                <br />
                Kabupaten Tabanan, Bali
              </h4>
              <div className="authincation-content py-5 px-5">
                <div className="row no-gutters mb-2">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong>Id</strong>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          {error.username?.map((msg, index) => (
                            <div className="invalid-feedback" key={index}>
                              {msg}
                            </div>
                          ))}
                        </div>
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong>Password</strong>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {error.password?.map((msg, index) => (
                            <div className="invalid-feedback" key={index}>
                              {msg}
                            </div>
                          ))}
                        </div>
                        <div className="text-end">
                          <button
                            type="submit"
                            className={`btn btn-primary btn-block ${
                              waiting ? "disabled" : ""
                            }`}
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
