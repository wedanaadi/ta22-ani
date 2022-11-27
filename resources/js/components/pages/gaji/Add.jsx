import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../../../hook/Token";
import { toast, ToastContainer } from "react-toastify";
import { faArrowLeft, faSave, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { round } from "lodash";

const AddGaji = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [pegawai_id, setIdPegawai] = useState("");
  const [pegawais, setPegawais] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [errors, setErrors] = useState([]);
  const [waiting, setWait] = useState(false);
  // gaji
  const [visible, setVisible] = useState(false);
  const [gaji_pokok_harian, setPokokHarian] = useState(0);
  const [tunjangan_harian, setTunjanganHarian] = useState(0);
  const [totalGajiPokok, setTotalPokok] = useState(0);
  const [totalTunjangan, setTotalTunjangan] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [bonusU, setBonusU] = useState(0);
  const [potongan, setPotongan] = useState(0);
  const [potonganU, setPotonganU] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [getHitung, setHitung] = useState([]);
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

  const convertToEpoch = (propsDate) => {
    let props = new Date(propsDate);
    return props.setHours(0, 0, 0, 0);
  };

  const getMonthDate = (bulan = false, type = "f") => {
    let date = bulan ? month : new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    if (type === "f") {
      return first;
    } else if (type === "l") {
      return last;
    } else {
      return { awal: convertToEpoch(first), akhir: convertToEpoch(last) };
    }
  };

  const loadPegawais = async () => {
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai-gaji`,
      {
        params: {
          act: "save",
          id: pegawai_id?.value,
          periode: convertToEpoch(getMonthDate(true, "f")),
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

  useEffect(() => {
    setMonth(getMonthDate());
  }, []);

  useEffect(() => {
    loadPegawais();
    setVisible(false)
  }, [month]);

  const handleChangeRaw = (date) => {
    const newRaw = new Date(date.currentTarget.value);
    if (newRaw instanceof Date && !isNaN(newRaw)) {
      setMonth(newRaw);
    }
  };

  const handleGenerateGaji = async (e) => {
    e.preventDefault();
    setErrors([]);
    const notifProses = toast.loading("Processing....");
    setWait(true);
    try {
      const { data: hitungGaji } = await axiosJWT.get(
        `${import.meta.env.VITE_BASE_URL}/hitung-gaji`,
        {
          params: {
            month: JSON.stringify(getMonthDate(true, "full")),
            pegawai_id: pegawai_id?.value,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const {data} = hitungGaji
      setHitung(data);
      setPokokHarian(round(data?.bawah?.gaji_pokok_harian));
      setTunjanganHarian(round(data?.bawah?.tunjangan_harian))
      setTotalPokok(round(data?.bawah?.total_pokok_harian))
      setTotalTunjangan(round(data?.bawah?.total_tunjangan_harian))

      setWait(false);
      toast.update(notifProses, {
        render: "Generate Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setVisible(true);
    } catch (error) {
      setWait(false);
      if (error?.response?.status === 422) {
        toast.update(notifProses, {
          render: "Error Validation",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          theme: "light",
        });
        setErrors(error.response.data.error);
      } else if (error?.response?.status === 500) {
        toast.update(auth, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(notifProses, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
    // setVisible(!visible)
  };

  useEffect(()=>{
    setTotalFinal(parseInt(totalGajiPokok)+parseInt(totalTunjangan)+parseInt(bonusU) - parseInt(potonganU))
  },[bonus,potongan, getHitung])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([]);
    const notifSave = toast.loading("Saving....");
    setWait(true);
    const formData = {
      pegawai_id: pegawai_id.value,
      bonus: bonusU,
      potongan: potonganU,
      totalFinal,
      periode: convertToEpoch(getMonthDate(true, "f")),
      total_hadir: getHitung.atas.kehadiran,
      gaji_pokok: getHitung.atas.gaji_pokok,
      tunjangan: getHitung.atas.tunjangan,
      gaji_pokok_harian: totalGajiPokok,
      tunjangan_harian: totalTunjangan,
    }

    console.log(formData);
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/gaji`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWait(false);
      toast.update(notifSave, {
        render: "Create Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setVisible(false);
      setTimeout(() => {
        navigasi("/gaji");
      }, 500);
    } catch (error) {
      setWait(false);
      if (error?.response?.status === 422) {
        toast.update(notifSave, {
          render: "Error Validation",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          theme: "light",
        });
        setErrors(error.response.data.error);
      } else if (error?.response?.status === 500) {
        toast.update(auth, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      } else {
        toast.update(notifSave, {
          render: error?.response?.data?.error,
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleGenerateGaji}>
        <ToastContainer />
        <div className="card">
          <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
            <h5 className="card-title">Tambah Gaji</h5>
            <Link to="/gaji" className="btn btn-secondary float-end">
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-xs-12 col-md-6 col-lg-6">
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
              </div>
              <div className="col-xs-12 col-md-6 col-lg-6">
                <div className="mb-3">
                  <label className="mb-3">
                    <strong>Periode</strong>
                  </label>
                  <DatePicker
                    className="form-control"
                    selected={month}
                    onChange={(date) => setMonth(date)}
                    dateFormat="yyyy-MM"
                    showMonthYearPicker
                    onChangeRaw={(e) => handleChangeRaw(e)}
                  />
                  {errors.month?.map((msg, index) => (
                    <div className="invalid-feedback" key={index}>
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer d-sm-flex justify-content-between align-items-center bg-white">
            <div className="card-footer-link mb-4 mb-sm-0"></div>
            <button
              type="submit"
              className={`btn btn-success ${waiting ? "" : ""}`}
            >
              <FontAwesomeIcon icon={faSync} />
              &nbsp; Proses
            </button>
          </div>
        </div>
      </form>
      <div className="py-3"></div>
      {/* save gaji */}
      <form onSubmit={handleSubmit}>
        {visible ? (
          <div className="card">
            <div className="card-body">
              <div className="row px-2">
                <table className="table w-50 fw-bold">
                  <tbody>
                    <tr>
                      <td>Nama</td>
                      <td>:</td>
                      <td>{getHitung?.atas?.nama}</td>
                    </tr>
                    <tr>
                      <td>Jabatan</td>
                      <td>:</td>
                      <td>{getHitung?.atas?.jabatan}</td>
                    </tr>
                    <tr>
                      <td>Total Hari dalam 1 Bulan</td>
                      <td>:</td>
                      <td>{`${getHitung?.atas?.dayofmonth - 4} days ( ${
                        getHitung?.atas?.dayofmonth
                      } days - 4 days )`}</td>
                    </tr>
                    <tr>
                      <td>Total Hari Kerja</td>
                      <td>:</td>
                      <td>{`${getHitung?.atas?.kehadiran} days`}</td>
                    </tr>
                    <tr>
                      <td>Off Day</td>
                      <td>:</td>
                      <td>{`${getHitung?.atas?.offday} days`}</td>
                    </tr>
                    <tr>
                      <td>Gaji Pokok 1 Bulan</td>
                      <td>:</td>
                      <td>
                        <NumericFormat
                          displayType="text"
                          value={getHitung?.atas?.gaji_pokok}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Tunjangan 1 Bulan</td>
                      <td>:</td>
                      <td>
                        <NumericFormat
                          displayType="text"
                          value={getHitung?.atas?.tunjangan}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <hr />
              <div className="row">
                <div className="col-xs-12 col-md-4 col-lg-4">
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Gaji Pokok Harian</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      value={gaji_pokok_harian}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Tunjangan Harian</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      value={tunjangan_harian}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-1 col-lg-1"></div>

                <div className="col-xs-12 col-md-4 col-lg-4">
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Total Gaji Pokok</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      value={totalGajiPokok}
                      thousandSeparator="."
                      decimalSeparator=","
                      disabled
                      allowNegative={false}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Total Tunjangan</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      value={totalTunjangan}
                      thousandSeparator="."
                      decimalSeparator=","
                      disabled
                      allowNegative={false}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Bonus</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      value={bonus}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      onValueChange={(values) => {
                        setBonusU(values.value);
                        setBonus(values.formattedValue);
                      }}
                    />
                    {errors.bonus?.map((msg, index) => (
                      <div className="invalid-feedback" key={index}>
                        {msg}
                      </div>
                    ))}
                  </div>
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Potongan</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      value={potongan}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      onValueChange={(values) => {
                        setPotonganU(values.value);
                        setPotongan(values.formattedValue);
                      }}
                    />
                    {errors.potongan?.map((msg, index) => (
                      <div className="invalid-feedback" key={index}>
                        {msg}
                      </div>
                    ))}
                  </div>
                  <div className="mb-3">
                    <label className="mb-3">
                      <strong>Total Gaji</strong>
                    </label>
                    <NumericFormat
                      className="form-control"
                      displayType="input"
                      disabled
                      value={totalFinal}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                    />
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
        ) : (
          <></>
        )}
      </form>
    </>
  );
};

export default AddGaji;
