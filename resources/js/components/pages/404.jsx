import React from "react";
import {useNavigate} from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="vh-100">
    <div className="authincation h-100">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-7">
            <div className="form-input-content text-center error-page">
              <h1 className="error-text fw-bold">404</h1>
              <h4>
                <i className="fa fa-exclamation-triangle text-warning" /> The
                page you were looking for is not found!
              </h4>
              <p>
                You may have mistyped the address or the page may have moved.
              </p>
              <div>
                <button className="btn btn-primary" onClick={() => navigate("/", {replace:true}) }>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFound;
