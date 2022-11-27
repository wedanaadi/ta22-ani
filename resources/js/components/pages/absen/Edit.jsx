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

const AbsenEdit = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [tanggal, setTanggal] = useState(new Date());
  const [keterangan, setKeterangan] = useState([]);
  const [keterangans, setKeterangans] = useState([]);
  const [pegawai_id, setIdPegawai] = useState("");
  const [pegawais, setPegawais] = useState([]);
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const [idEdit, setIdEdit] = useState("");
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
          if (error?.response?.status === 401) {
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

  const localEditData = JSON.parse(atob(localStorage.getItem("absenEdit")));

  const loadPegawais = async () => {
    try {
      const { data: response } = await axiosJWT.get(
        `${import.meta.env.VITE_BASE_URL}/pegawai-absen`,
        {
          params: {
            now:ConvertToEpoch(tanggal),
            act: 'edit',
            id: localEditData.pegawai_id
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const options = response.data.map((data) => {
        return { value: data.id_pegawai, label: data.nama_pegawai };
      });
      // console.log(options);
      setPegawais(options);
    } catch (error) {
      console.log(error);
    }
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
    loadEdit();
  }, []);

  const convertToDate = (dateProps) => {
    let date = new Date(dateProps);
    return date;
    // return date.toLocaleDateString('fr-CA').toString();
  };

  const loadEdit = () => {
    setTanggal(convertToDate(localEditData.tanggal))
    setIdEdit(localEditData.id_absen)
    const data = [
      {value:'Hadir', label:'Hadir'},
      {value:'Ijin', label:'Ijin'},
      {value:'Sakit', label:'Sakit'},
      {value:'Alpa', label:'Alpa'},
    ]
    const keteranganSelected = data.filter(({value})=> value === localEditData.keterangan)
    setKeterangan(keteranganSelected[0])
    setIdPegawai({ value: localEditData.pegawai_id, label: localEditData.pegawai.nama_pegawai })
  };

  const loadSelectAwait = () => {
    const selected = pegawais.filter(
      ({ value }) => value === localEditData.pegawai_id
    );
    setIdPegawai(selected[0]);
  };

  useEffect(()=>{
    loadPegawais();
    setIdPegawai("")
  },[tanggal])

  useEffect(() => {
    loadSelectAwait()
  },[pegawais])

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
      const { data: response } = await axiosJWT.put(
        `${import.meta.env.VITE_BASE_URL}/absen/${idEdit}`,
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
        render: "Update Successfuly",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        navigasi("/absen");
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
      } else {
        toast.update(notifikasiSave, {
          render: error?.response?.data?.error,
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
      <div className="col-xs-12 col-md- col-lg-6">
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Ubah Absen</h5>
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

export default AbsenEdit
