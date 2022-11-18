import React from "react";
import { useNavigate } from "react-router-dom";

const Sample = () => {
  const navigasi = useNavigate();
  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="card-title">Card title</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          This is a wider card with supporting text and below as a natural
          lead-in to the additional content. This content is a little <br /> bit
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
      </div>
    </div>
  );
};

export default Sample;
