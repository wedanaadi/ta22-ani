import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthConsumer from "../../hook/Auth";
import { useToken } from "../../hook/Token";
import jwt_decode from 'jwt-decode'

const Login = () => {
  const [username, setUsername ] = useState("");
  const [password, setPassword ] = useState("");
  const [authed, dispatch] = AuthConsumer()
  const navigasi = useNavigate();
  const {setToken, setExp} = useToken()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {data} = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`,{username, password})
    const me = await axios.get("http://127.0.0.1:8000/api/me",{
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    })
    dispatch({type:'login'})
    setToken(data.access_token)
    const decodeToken = jwt_decode(data.access_token)
    setExp(decodeToken.exp)
    localStorage.setItem('isLogin',true)
    navigasi("/")
  };

  return (
    <div className="vh-100">
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
              <div className="authincation-content py-3 px-5">
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
                            onChange={(e)=>setUsername(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong>Password</strong>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                          />
                        </div>
                        <div className="text-end">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            // onClick={()=>navigasi("/",{replace:true})}
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
