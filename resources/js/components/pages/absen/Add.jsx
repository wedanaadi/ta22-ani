import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useToken } from "../../../hook/Token";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import DatePicker from "react-datepicker";

const AbsenAdd = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [tanggal, setTanggal] = useState(new Date());
  const [keterangan, setKeterangan] = useState([]);
  const [keterangans, setKeterangans] = useState([]);
  const [pegawai_id, setIdPegawai] = useState("");
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

  const loadPegawais = async () => {
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai-absen`,
      {
        params: {
          now:ConvertToEpoch(tanggal),
          act: 'save',
          id: null
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

  const optionsKeterangan = () => {
    const data = [
      {value:'Hadir', label:'Hadir'},
      {value:'Ijin', label:'Ijin'},
      {value:'Sakit', label:'Sakit'},
      {value:'Alpa', label:'Alpa'},
    ]
    setKeterangans(data);
  }

  useEffect(() => {
    optionsKeterangan();
  }, []);

  useEffect(()=>{
    loadPegawais();
    setIdPegawai("");
  },[tanggal])

  const ConvertToEpoch = (date) => {
    let dateProps = new Date(date).setHours(0,0,0,0);
    let myDate = new Date(dateProps * 1000);
    const myEpoch = myDate.getTime() / 1000.0;
    return myEpoch;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      tanggal: tanggal,
      keterangan: keterangan.value,
      pegawai_id: pegawai_id.value,
    };

    const notifikasiSave = toast.loading("Saving....");
    setWait(true);
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/absen`,
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
      navigasi("/absen");
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
      <div className="col-xs-12 col-md-6 col-lg-6">
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Tambah Absen</h5>
            <Link to="/absen" className="btn btn-secondary float-end">
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
                  <strong>Tanggal</strong>
                </label>
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  selected={tanggal}
                  onChange={(date) => setTanggal(date)}
                  startDate={tanggal}
                  // minDate={new Date()}
                />
                {errors.tanggal?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Keterangan</strong>
                </label>
                <Select
                  value={keterangan}
                  onChange={setKeterangan}
                  options={keterangans}
                />
                {errors.keterangan?.map((msg, index) => (
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

export default AbsenAdd
