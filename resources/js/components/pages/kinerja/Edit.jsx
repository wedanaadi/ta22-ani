import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useToken } from "../../../hook/Token";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import DatePicker from "react-datepicker";

export default function KinerjaEdit() {
  const { token, setToken, exp, setExp } = useToken();
  const [pegawai_id, setIdPegawai] = useState("");
  const [desc, setDesc] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [periode, SetPeriode] = useState(new Date());
  const [pegawais, setPegawais] = useState([]);
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const navigasi = useNavigate();

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

  const ConvertToEpoch = (date) => {
    let dateProps = new Date(date).setHours(0, 0, 0, 0);
    let myDate = new Date(dateProps * 1000);
    const myEpoch = myDate.getTime() / 1000.0;
    return myEpoch;
  };

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
  const loadPegawais = async () => {
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai-kinerja`,
      {
        params: {
          role: dataLokal.role,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const options = response.data.map((data) => {
      return { value: data.id_pegawai, label: data.nama_pegawai };
    });
    setPegawais(options);
  };

  const loadEdit = () => {
    const edit = JSON.parse(atob(localStorage.getItem("kinerjaEdit")));
    setDesc(edit.desc);
    SetPeriode(new Date(edit.periode));
    setIdEdit(edit.id_kinerjas)
  }

  useEffect(() => {
    loadEdit();
    loadPegawais();
  }, []);

  const loadSelectAwait = () => {
    const edit = JSON.parse(atob(localStorage.getItem("kinerjaEdit")));
    const selected = pegawais.filter(
      ({ value }) => value === edit.pegawai_id
    );
    setIdPegawai(selected[0]);
  };

  useEffect(() => {
    loadSelectAwait();
  }, [pegawais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      pegawai_id: pegawai_id.value,
      periode: ConvertToEpoch(periode),
      desc
    };

    console.log(formData);

    const notifikasiSave = toast.loading("Saving....");
    setWait(true);
    try {
      const { data: response } = await axiosJWT.put(
        `${import.meta.env.VITE_BASE_URL}/kinerja/${idEdit}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
            // "Content-Type": "multipart/form-data"
          },
        }
      );
      setWait(false);
      toast.update(notifikasiSave, {
        render: "Create Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      navigasi("/kinerja");
    } catch (error) {
      setErrors([]);
      setWait(false);
      if (error?.response?.status === 422) {
        toast.update(notifikasiSave, {
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
        toast.update(notifikasiSave, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else if (error?.response?.status === 401) {
        toast.update(notifikasiSave, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(notifikasiSave, {
          render: error?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="col-xs-12 col-md- col-lg-6">
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Ubah Kinerja</h5>
            <Link to="/kinerja" className="btn btn-secondary float-end">
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="mb-3">
                <strong>Pegawai</strong>
              </label>
              <Select
                value={pegawai_id}
                onChange={setIdPegawai}
                options={pegawais}
              />
              {errors.pegawai_id?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="mb-3">
                <strong>Periode</strong>
              </label>
              <DatePicker
                selected={periode}
                onChange={(date) => SetPeriode(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                className="form-control"
              />
              {errors.periode?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="mb-3">
                <strong>Deskripsi</strong>
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="form-control"
                id=""
                rows="3"
              >
                {desc}
              </textarea>
              {errors.desc?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer d-sm-flex justify-content-between align-items-center bg-white">
            <div className="card-footer-link mb-4 mb-sm-0"></div>
            <button
              type="submit"
              className={`btn btn-primary ${waiting ? "disabled" : ""}`}
            >
              <FontAwesomeIcon icon={faSave} />
              &nbsp; Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
