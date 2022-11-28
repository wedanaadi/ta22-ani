import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useToken } from "../../../hook/Token";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import DatePicker from "react-datepicker";

const PegawaiEdit = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [nama_pegawai, setPegawai] = useState("");
  const [jabatan_id, setJabatan] = useState("");
  const [tempat_lahir, setTempat] = useState("");
  const [tanggal_lahir, setTL] = useState(new Date());
  const [jenis_kelamin, setJK] = useState("");
  const [alamat, setAlamat] = useState("");
  const [agama, setAgama] = useState("");
  const [status, setStatus] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [no_telepon, setTelp] = useState("");
  const [nik, setNIK] = useState("");
  const [status_pegawai, setSP] = useState(0);
  const [foto, setFoto] = useState(null);
  const [jabatans, setJabatans] = useState([]);
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const [idEdit, setId] = useState("")
  const [oldFoto, setOldFoto] = useState("")
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

  const loadEdit = () => {
    const edit = JSON.parse(atob(localStorage.getItem('PegawaiEdit')));
    setPegawai(edit.nama_pegawai)
    setAgama(edit.agama)
    setAlamat(edit.alamat)
    setTL(new Date(edit.tanggal_lahir))
    setTempat(edit.tempat_lahir)
    const jk = edit.jenis_kelamin === 'L' ? {value:'L', label:'Laki-Laki'} :  {value:'P', label:'Perempuan'}
    setJK(jk)
    const agamaOption = [
      { value: "Hindu", label: "Hindu" },
      { value: "Islam", label: "Islam" },
      { value: "Budha", label: "Budha" },
      { value: "Katolik", label: "Katolik" },
      { value: "Protestan", label: "Protestan" },
      { value: "Konghuchu", label: "Konghuchu" },
    ];
    const agamaSelected = agamaOption.filter(({value})=> value === edit.agama)
    setAgama(agamaSelected[0])
    const statusKawin = edit.status === 0 ? {value:0, label:'Belum Menikah'} :  {value:1, label:'Sudah Menikah'}
    setStatus(statusKawin)
    const statusPegawai = edit.status_pegawai === 0 ? {value:0, label:'Pegawai Kontrak'} :  {value:1, label:'Pegawai Tetap'}
    setSP(statusPegawai)
    setTelp(edit.no_telepon)
    setPendidikan(edit.pendidikan)
    setId(edit.id_pegawai)
    setOldFoto(edit.foto)
    setNIK(edit.nik)
  }

  const loadJabatan = async () => {
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/jabatan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const options = response.data.map((data) => {
      return { value: data.id_jabatan, label: data.nama_jabatan };
    });
    setJabatans(options);
  };

  const loadSelectAwait = () => {
    const edit = JSON.parse(atob(localStorage.getItem('PegawaiEdit')));
    const selected = jabatans.filter(({value})=> value === edit.jabatan_id)
    setJabatan(selected[0])
  }

  useEffect(() => {
    loadSelectAwait()
  }, [jabatans]);

  useEffect(() => {
    loadJabatan()
    loadEdit()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      nama_pegawai,
      nik,
      jabatan_id: jabatan_id.value,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin: jenis_kelamin.value,
      alamat,
      agama:agama.value,
      status:status.value,
      status_pegawai:status_pegawai.value,
      pendidikan,
      no_telepon,
      foto,
      oldFoto,
      _method:'PUT'
    }
    const notifikasiSave = toast.loading("Saving....");
    setWait(true);
    setErrors([]);
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/pegawai/${idEdit}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      setWait(false);
      toast.update(notifikasiSave, {
        render: "Create Successfuly",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        navigasi("/pegawai");
      }, 500);
    } catch (error) {
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

  const handleFoto = (event) => {
    const file = event.target.files[0];
    setFoto(file);
  }

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="card">
        <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
          <h5 className="card-title">Ubah Pegawai</h5>
          <Link to="/pegawai" className="btn btn-secondary float-end">
            <FontAwesomeIcon icon={faArrowLeft} />
            &nbsp; Kembali
          </Link>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-xs-12 col-md-6 col-lg-6">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Nama Pegawai</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={nama_pegawai}
                  onChange={(e) => setPegawai(e.target.value)}
                />
                {errors.nama_pegawai?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-6 col-lg-6">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>NIK</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={nik}
                  onChange={(e) => setNIK(e.target.value)}
                />
                {errors.nik?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Jabatan</strong>
                </label>
                <Select
                  value={jabatan_id}
                  onChange={setJabatan}
                  options={jabatans}
                />
                {errors.jabatan_id?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Tempat Lahir</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={tempat_lahir}
                  onChange={(e) => setTempat(e.target.value)}
                />
                {errors.tempat_lahir?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Tanggal Lahir</strong>
                </label>
                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  selected={tanggal_lahir}
                  onChange={(date) => setTL(date)}
                />
                {errors.tanggal_lahir?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Jenis Kelamin</strong>
                </label>
                <Select
                  value={jenis_kelamin}
                  onChange={setJK}
                  options={[
                    { value: "L", label: "Laki-Laki" },
                    { value: "P", label: "Perempuan" },
                  ]}
                />
                {errors.jenis_kelamin?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Agama</strong>
                </label>
                <Select
                  value={agama}
                  onChange={setAgama}
                  options={[
                    { value: "Hindu", label: "Hindu" },
                    { value: "Islam", label: "Islam" },
                    { value: "Budha", label: "Budha" },
                    { value: "Katolik", label: "Katolik" },
                    { value: "Protestan", label: "Protestan" },
                    { value: "Konghuchu", label: "Konghuchu" },
                  ]}
                />
                {errors.agama?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Status Pernikahan</strong>
                </label>
                <Select
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: 0, label: "Belum Menikah" },
                    { value: 1, label: "Sudah Menikah" },
                  ]}
                />
                {errors.status?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Telepon</strong>
                </label>
                <input className="form-control" value={no_telepon} onChange={(e) =>setTelp(e.target.value)} />
                {errors.no_telepon?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Pendidikan</strong>
                </label>
                <input className="form-control" value={pendidikan} onChange={(e) =>setPendidikan(e.target.value)} />
                {errors.pendidikan?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Status Pegawai</strong>
                </label>
                <Select
                  value={status_pegawai}
                  onChange={setSP}
                  options={[
                    { value: 0, label: "Pegawai Kontrak" },
                    { value: 1, label: "Pegawai Tetap" },
                  ]}
                />
                {errors.status_pegawai?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-3 col-lg-3">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Foto</strong>
                </label>
                <input type="file" onChange={handleFoto} className="form-control" />
                {errors.foto?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-6 col-lg-6">
              <div className="mb-3">
                <label className="mb-3">
                  <strong>Alamat</strong>
                </label>
                <textarea value={alamat} onChange={(e)=> setAlamat(e.target.value)} className="form-control" id="" rows="3">{alamat}</textarea>
                {errors.alamat?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-md-6 col-lg-6">
              <div className="foto-content col-md-3 col-lg-3 float-end">
              <img width={100} height={100} src={`${import.meta.env.VITE_PUBLIC}/images/pegawai/${oldFoto}`} alt={`${oldFoto}`} />
              </div>
            </div>
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
    </form>
  )
}

export default PegawaiEdit
