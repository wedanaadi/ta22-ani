import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigasi = useNavigate()
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
                      <form action="index.html">
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong>Id</strong>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="hello@example.com"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong>Password</strong>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            defaultValue="Password"
                          />
                        </div>
                        <div className="text-end">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            onClick={()=>navigasi("/",{replace:true})}
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
