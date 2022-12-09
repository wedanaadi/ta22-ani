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

const CutiAdd = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [tanggal_mulai, setTM] = useState(new Date());
  const [tanggal_selesai, setTS] = useState(new Date());
  const [alasan, setAlasan] = useState("");
  const [pegawai_id, setIdPegawai] = useState("");
  const [pegawais, setPegawais] = useState([]);
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  const [isAllow, setAllow] = useState(false);
  const [aksi, setAksi] = useState({
    value: "tanggal",
    label: "Tanggal",
  });
  const [keterangan, setKet] = useState({
    value: "lainnya",
    label: "Cuti Lainnya",
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startBulan, endBulan] = dateRange;
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
      `${import.meta.env.VITE_BASE_URL}/pegawai`,
      {
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

  useEffect(() => {
    loadPegawais();
  }, []);

  const cekAllow = async () => {
    if (pegawai_id) {
      const { data: response } = await axiosJWT.get(
        `${import.meta.env.VITE_BASE_URL}/cek-masakerja`,
        {
          params: {
            id: pegawai_id.value,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data === "allow") {
        setAllow(true);
      } else {
        setAllow(false);
      }
      // const options = response.data.map((data) => {
      //   return { value: data.id_pegawai, label: data.nama_pegawai };
      // });
      // setPegawais(options);
    }
  };

  useEffect(() => {
    cekAllow();
  }, [pegawai_id]);

  const ConvertToEpoch = (date) => {
    let dateProps = new Date(date).setHours(0, 0, 0, 0);
    let myDate = new Date(dateProps * 1000);
    const myEpoch = myDate.getTime() / 1000.0;
    return myEpoch;
  };

  useEffect(() => {
    setTM(new Date());
    setTS(new Date());
    setDateRange([null, null]);
  }, [aksi]);

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      tanggal_mulai: aksi.value === "tanggal" ? tanggal_mulai : dateRange[0],
      tanggal_selesai:
        aksi.value === "tanggal" ? tanggal_selesai : dateRange[1],
      alasan,
      pegawai_id: pegawai_id.value,
      is_aprove: dataLokal.role == 2 ? "1" : "0",
      type: aksi.value,
      keterangan: keterangan.value,
      role: dataLokal.role,
    };

    const notifikasiSave = toast.loading("Saving....");
    setWait(true);
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/cuti`,
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
      navigasi("/cuti");
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

  const hitungBulan = (start, end) => {
    const epochBergabung = ConvertToEpoch(start);
    const epochNow = ConvertToEpoch(end);
    const second = (epochNow - epochBergabung) / 1000;
    const minute = second / 60;
    const hour = minute / 60;
    let day = hour / 24;
    let month = day / 30;
    const year = month / 12;
    return month;
  };

  const onChangeBulanan = (dates) => {
    setDateRange(dates);
    const [start, end] = dates;
    const jumlahBulan = hitungBulan(start, end);
    if (jumlahBulan > 3) {
      setDateRange([new Date(), new Date()]);
      alert("Maksimal 3 Bulan");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="col-xs-12 col-md-6 col-lg-6">
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Tambah Cuti</h5>
            <Link to="/cuti" className="btn btn-secondary float-end">
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
            {pegawai_id && isAllow ? (
              <>
                <label className="mb-3">
                  <strong>Keterangan Cuti</strong>
                </label>
                <Select
                  className="mb-3"
                  value={keterangan}
                  onChange={setKet}
                  options={[
                    {
                      value: "lahiran",
                      label: "Cuti Lahiran",
                    },
                    {
                      value: "Sakit",
                      label: "Cuti Sakit",
                    },
                    {
                      value: "lainnya",
                      label: "Cuti Lainnya",
                    },
                  ]}
                />
                {errors.keterangan?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
                <label className="mb-3">
                  <strong>Tipe Cuti</strong>
                </label>
                <Select
                  value={aksi}
                  onChange={setAksi}
                  options={[
                    { value: "bulan", label: "Bulanan" },
                    { value: "tanggal", label: "Tanggal" },
                  ]}
                />
                {errors.type?.map((msg, index) => (
                  <div className="invalid-feedback" key={index}>
                    {msg}
                  </div>
                ))}
                <hr />
                {aksi.value === "tanggal" ? (
                  <>
                    <div className="mb-3">
                      <label className="mb-3">
                        <strong>Tanggal Mulai</strong>
                      </label>
                      <DatePicker
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        selected={tanggal_mulai}
                        onChange={(date) => setTM(date)}
                        selectsStart
                        startDate={tanggal_mulai}
                        endDate={tanggal_selesai}
                      />
                      {errors.tanggal_mulai?.map((msg, index) => (
                        <div className="invalid-feedback" key={index}>
                          {msg}
                        </div>
                      ))}
                    </div>
                    <div className="mb-3">
                      <label className="mb-3">
                        <strong>Tanggal Selesai</strong>
                      </label>
                      <DatePicker
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        selected={tanggal_selesai}
                        onChange={(date) => setTS(date)}
                        selectsEnd
                        startDate={tanggal_mulai}
                        endDate={tanggal_selesai}
                        minDate={tanggal_mulai}
                      />
                      {errors.tanggal_selesai?.map((msg, index) => (
                        <div className="invalid-feedback" key={index}>
                          {msg}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Periode</strong>
                    </label>
                    <DatePicker
                      selectsRange={true}
                      startDate={startBulan}
                      endDate={endBulan}
                      className="form-control"
                      onChange={(update) => onChangeBulanan(update)}
                      withPortal
                    />
                    {errors.tanggal_mulai || errors.tanggal_selesai ? (
                      <div className="invalid-feedback">
                        Periode tanggal harus diisi
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <label className="mb-3">
                    <strong>Alasan</strong>
                  </label>
                  <textarea
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    className="form-control"
                    id=""
                    rows="3"
                  >
                    {alasan}
                  </textarea>
                  {errors.alasan?.map((msg, index) => (
                    <div className="invalid-feedback" key={index}>
                      {msg}
                    </div>
                  ))}
                </div>
              </>
            ) : pegawai_id ? (
              <>Masa Kerja Belum 1 Tahun</>
            ) : (
              false
            )}
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
};

export default CutiAdd;
