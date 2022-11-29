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

const LapPeg = () => {
  const [pegawais, setPegawais] = useState([]);
  const [loader, showLoader, hideLoader] = useLoading();
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

  useEffect(() => {
    getPegawais();
  }, []);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const ConvertToEpoch = (date) => {
    let dateProps = new Date(date).setHours(0, 0, 0, 0);
    let myDate = new Date(dateProps * 1000);
    const myEpoch = myDate.getTime() / 1000.0;
    return myEpoch;
  };

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "Pegawai", field: "nama_pegawai", sortable: true },
    { name: "Tanggal Mulai", field: "tanggal_mulai", sortable: false },
    { name: "Tanggal Selesai", field: "tanggal_selesai", sortable: false },
    { name: "Alasan", field: "alasan", sortable: true },
  ];

  const ITEMS_PER_PAGE = 10;

  const getPegawais = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/laporan-pegawai`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPegawais(response.data);
    hideLoader();
  };

  const handleView = () => {
    getPegawais();
    setVisible(true);
  };

  const pegawaiData = useMemo(() => {
    let computedCutis = pegawais;

    if (search) {
      computedCutis = computedCutis.filter((data) =>
        // data.username.toLowerCase().includes(search.toLowerCase()) ||
        data.nama_pegawai.toLowerCase().includes(search.toLowerCase())
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
  }, [pegawais, currentPage, search, sorting]);

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
        <h5 className="card-title">Laporan Pegawai</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="mb-3"></label>
              <button className="btn btn-info" onClick={handleView}>
                <FontAwesomeIcon icon={faEye} />
                &nbsp; Lihat
              </button>
              &nbsp;
              <button
                className="btn btn-danger"
                onClick={() =>
                  window.open(`${import.meta.env.VITE_BASE_URL}/pegawai/export`)
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
                        {pegawaiData.length > 0 ? (
                          pegawaiData.map((pegawai, index) => (
                            <tr key={pegawai.id_pegawai}>
                              <th scope="row">{index + 1}</th>
                              <td>{pegawai.nik}</td>
                              <td>{pegawai.nama_pegawai}</td>
                              <td>{pegawai.jabatan.nama_jabatan}</td>
                              <td>{pegawai.tempat_lahir}</td>
                              <td>{pegawai.tanggal_lahir}</td>
                              <td>
                                {pegawai.jenis_kelamin == "L"
                                  ? "Laki-Laki"
                                  : "Perempuan"}
                              </td>
                              <td>{pegawai.alamat}</td>
                              <td>{pegawai.agama}</td>
                              <td>
                                {pegawai.status == 0
                                  ? "Belum Menikah"
                                  : "Sudah Menikah"}
                              </td>
                              <td>{pegawai.pendidikan}</td>
                              <td>{pegawai.no_telepon}</td>
                              <td>
                                {pegawai.status_pegawai == 0
                                  ? "Pegawai Kontrak"
                                  : "Pegawai Tetap"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={13}>{loader}</td>
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

export default LapPeg;
