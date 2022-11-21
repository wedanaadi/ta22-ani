import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useToken} from '../../hook/Token'
import jwt_decode from 'jwt-decode'
import axios from "axios";

const Sample = () => {
  const {token, setToken, exp, setExp} = useToken()
  const [hello, setHello] =useState('')

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (exp * 1000 < currentDate.getTime()) {
        const {data} = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/refresh`
        );

        config.headers.Authorization = `Bearer ${data.access_token}`;
        setToken(data.access_token);
        const decode = jwt_decode(data.access_token);
        setExp(decode.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getHello = async () => {
    const {data} = await axiosJWT.get(`${import.meta.env.VITE_BASE_URL}/hello`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    setHello(data)
  }

  const handleTest = () => {
    getHello()
  }

  const navigasi = useNavigate();
  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="card-title">Card title</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          {`ini api ${hello}`} <br /> bit
          longer. Some quick example text to build the bulk
        </p>
        <form action="#">
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Check me out
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div className="card-footer d-sm-flex justify-content-between align-items-center bg-white">
        <div className="card-footer-link mb-4 mb-sm-0">
          <p className="card-text text-dark d-inline">
            Last updated 3 mins ago
          </p>
        </div>
        <button className="btn btn-success" onClick={() => navigasi("/test")}>
          Go somewhere
        </button>
        <button className="btn btn-success" onClick={() => handleTest()}>
          test
        </button>
      </div>
    </div>
  );
};

export default Sample;
