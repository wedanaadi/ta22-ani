import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useToken } from "../../../hook/Token";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import useLoading from "../../Loading";
import { Pagging, Search, TableHeader } from "../../datatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileExcel } from "@fortawesome/free-solid-svg-icons";

const LapAbsen = () => {
  const [pegawai, setPegawai] = useState({
    value: "all",
    label: "Semua Pegawai",
  });
  const [pegawais, setPegawais] = useState([]);
  const [absens, setAbsens] = useState([]);
  const [loader, showLoader, hideLoader, isLoad] = useLoading();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [visible, setVisible] = useState(false);

  // token
  const { token, setToken, exp, setExp } = useToken();
  // JWT
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
          console.log(error);
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
    options.push({ value: "all", label: "Semua Pegawai" });
    setPegawais(options.reverse());
  };

  useEffect(() => {
    loadPegawais();
    getAbsens();
  }, []);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const ConvertToEpoch = (date) => {
    let dateProps = new Date(date).setHours(0, 0, 0, 0);
    let myDate = new Date(dateProps * 1000);
    const myEpoch = myDate.getTime() / 1000.0;
    return myEpoch;
  };

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "NIK", field: "nik", sortable: true },
    { name: "Nama Pegawai", field: "nama_pegawai", sortable: true },
    { name: "Jabatan", field: "nama_jabatan", sortable: true },
    { name: "Tanggal Absen", field: "tanggal_absen", sortable: true },
    { name: "Keterangan", field: "keterangan", sortable: true },
  ];

  const ITEMS_PER_PAGE = 10;

  const getAbsens = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/laporan-absen`,
      {
        params: {
          pegawai_id: pegawai.value,
          periode: JSON.stringify({
            awal: ConvertToEpoch(startDate),
            akhir: ConvertToEpoch(endDate),
          }),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAbsens(response.data);
    hideLoader();
  };

  useEffect(() => {
    setVisible(false);
    setAbsens([]);
  }, [pegawai, startDate, endDate]);

  const handleView = () => {
    getAbsens();
    setVisible(true);
  };

  const absensData = useMemo(() => {
    let computedCutis = absens;

    if (search) {
      computedCutis = computedCutis.filter(
        (data) =>
          data.nama_pegawai.toLowerCase().includes(search.toLowerCase()) ||
          data.nama_jabatan.toLowerCase().includes(search.toLowerCase()) ||
          data.nik.toString().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedCutis.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedCutis = computedCutis.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedCutis.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [absens, currentPage, search, sorting]);

  const handleEdit = (row) => {
    localStorage.setItem("cutiEdit", btoa(JSON.stringify(row)));
    navigasi("edit");
    // console.log(JSON.parse(atob(localStorage.getItem('JabatanEdit'))));
  };

  const convertDate = (dateProps) => {
    let date = new Date(dateProps);
    return date
      .toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .toString();
  };

  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="card-title">Laporan Absensi</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="mb-3">Pegawai</label>
              <Select
                value={pegawai}
                onChange={setPegawai}
                options={pegawais}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="mb-3">
              <label className="mb-3">Periode</label>
              <div className="d-flex justify-content-between">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-5">
              <label className="mb-4"></label>
              <div className="mb-1"></div>
              <button className="btn btn-info" onClick={handleView}>
                <FontAwesomeIcon icon={faEye} />
                &nbsp; Lihat
              </button>
              &nbsp;
              <button
                className="btn btn-danger"
                onClick={() =>
                  window.open(
                    `${import.meta.env.VITE_BASE_URL}/absen/export?pegawai_id=${
                      pegawai.value
                    }&periode=${JSON.stringify({
                      awal: ConvertToEpoch(startDate),
                      akhir: ConvertToEpoch(endDate),
                    })}`
                  )
                }
              >
                <FontAwesomeIcon icon={faFileExcel} />
                &nbsp; Cetak
              </button>
            </div>
          </div>
        </div>
        {!visible ? (
          <></>
        ) : (
          <>
            <hr />
            <div className="row">
              {/* datatable */}
              <div className="row w-100">
                <div className="col col-12 mb-3 text-center">
                  <div className="row mb-3">
                    <div className="col-md-6"></div>
                    <div className="col-md-6 d-flex flex-row-reverse">
                      <Search
                        onSearch={(value) => {
                          setSearch(value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped table-bordered nowrap">
                      <TableHeader
                        headers={headers}
                        onSorting={(field, order) =>
                          setSorting({ field, order })
                        }
                      />
                      <tbody>
                        {absensData.length > 0 ? (
                          absensData.map((absen, index) => (
                            <tr key={absen.id_absen}>
                              <th scope="row">{index + 1}</th>
                              <td>{absen.nik}</td>
                              <td>{absen.nama_pegawai}</td>
                              <td>{absen.nama_jabatan}</td>
                              <td>{convertDate(absen.tanggal)}</td>
                              <td>{absen.keterangan}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6}>
                              {absensData.length === 0 && !isLoad
                                ? "Tidak Ada Data"
                                : loader}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-12 d-flex flex-row-reverse">
                      <Pagging
                        total={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* end datatable */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LapAbsen;
