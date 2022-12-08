import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useToken } from "../../../hook/Token";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import jwt_decode from "jwt-decode";

export default function EditList() {
  const { token, setToken, exp, setExp } = useToken();
  const [nama_jabatan, setJabatan] = useState("");
  const [nama_list, setList] = useState("");
  const [idList, setIdList] = useState("");
  const [gaji_pokok, setGaPok] = useState(0);
  const [gaji_pokok_U, setGaPokU] = useState(0);
  const [tunjangan, setTunjangan] = useState(0);
  const [tunjangan_U, setTunjanganU] = useState(0);
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const [jabatans, setJabatans] = useState([]);
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

  const edit = JSON.parse(atob(localStorage.getItem("listEdit")));
  const loadJabatan = async () => {
    try {

      const { data:response } = await axiosJWT.get(
        `${import.meta.env.VITE_BASE_URL}/jabatan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      const options = response.data.map((data) => {
        return { value: data.id_jabatan, label: data.nama_jabatan };
      });
      setJabatans(options);
    } catch (error) {
      console.log(error);
    }
  };

  const loadEdit = () => {
    setList(edit.nama_gaji)
    setIdList(edit.id_master_gaji)
    setGaPok(edit.gaji_pokok);
    setGaPokU(edit.gaji_pokok);
    setTunjangan(edit.tunjangan);
    setTunjanganU(edit.tunjangan);
  }

  const loadSelectAwait = () => {
    const selected = jabatans.filter(({ value }) => value === edit.jabatan_id);
    setJabatan(selected[0]);
  };

  useEffect(() => {
    loadEdit()
    loadJabatan();
  }, []);

  useEffect(() => {
    loadSelectAwait();
  }, [jabatans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const notifikasiSave = toast.loading("Saving....");
    setWait(true);
    try {
      const { data: response } = await axiosJWT.put(
        `${import.meta.env.VITE_BASE_URL}/list/${idList}`,
        {
          nama_list,
          gaji_pokok: gaji_pokok_U,
          tunjangan: tunjangan_U,
          nama_jabatan: nama_jabatan.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWait(false);
      toast.update(notifikasiSave, {
        render: "Updated Successfuly",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        navigasi("/list");
      }, 500);
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
      <ToastContainer />
      <div className="col-xs-12 col-md-6 col-lg-6">
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Ubah List Gaji</h5>
            <Link to="/list" className="btn btn-secondary float-end">
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="mb-3">
                <strong>Nama List Gaji</strong>
              </label>
              <input
                type="text"
                className="form-control"
                value={nama_list}
                onChange={(e) => setList(e.target.value)}
              />
              {errors.nama_list?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="mb-3">
                <strong>Gaji Pokok</strong>
              </label>
              <NumericFormat
                className="form-control"
                displayType="input"
                value={gaji_pokok}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                onValueChange={(values) => {
                  setGaPokU(values.value);
                  setGaPok(values.formattedValue);
                }}
              />
              {errors.gaji_pokok?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="mb-3">
                <strong>Tunjangan</strong>
              </label>
              <NumericFormat
                className="form-control"
                displayType="input"
                value={tunjangan}
                onValueChange={(values, sourceInfo) => {
                  setTunjangan(values.formattedValue);
                  setTunjanganU(values.value);
                }}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
              />
              {errors.tunjangan?.map((msg, index) => (
                <div className="invalid-feedback" key={index}>
                  {msg}
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="mb-3">
                <strong>Jabatan</strong>
              </label>
              <Select
                value={nama_jabatan}
                onChange={setJabatan}
                options={jabatans}
              />
              {errors.nama_jabatan?.map((msg, index) => (
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
  );
}
