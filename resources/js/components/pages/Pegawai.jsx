import React from "react";

const Pegawai = () => {
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
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus,
        nostrum? Dolorum, maxime ea facilis officia tempore culpa excepturi
        perferendis cum soluta unde quis, earum rem!
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

export default Pegawai;
