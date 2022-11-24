import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ExcelAbsen from "./ExcelAbsen";

const Absen = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [absens, setAbsens] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loader, showLoader, hideLoader] = useLoading();
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
          } else if (error?.response?.status === 500) {
            toast.update(auth, {
              render: error?.response?.data?.message,
              type: "error",
              isLoading: false,
              autoClose: 1500,
            });
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "NIK", field: "nik", sortable: true },
    { name: "Nama Pegawai", field: "nama_pegawai", sortable: true },
    { name: "Jabatan", field: "nama_jabatan", sortable: true },
    { name: "Tanggal Absen", field: "tanggal_absen", sortable: true },
    { name: "Keterangan", field: "keterangan", sortable: true },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getAbsens();
  }, []);

  const getAbsens = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/absen`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAbsens(response.data);
    hideLoader();
  };

  const absensData = useMemo(() => {
    let computedAbsens = absens;

    if (search) {
      computedAbsens = computedAbsens.filter(
        (data) =>
          data.pegawai.nik.toLowerCase().includes(search.toLowerCase()) ||
          data.pegawai.nama_pegawai
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.pegawai.jabatan.nama_jabatan
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.keterangan.toLowerCase().includes(search.toLowerCase()) ||
          data.pegawai.nama_pegawai.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedAbsens.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedAbsens = computedAbsens.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedAbsens.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [absens, currentPage, search, sorting]);

  const handleEdit = (row) => {
    localStorage.setItem("absenEdit", btoa(JSON.stringify(row)));
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
      <ExcelAbsen />
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Absen</h5>
        <div>
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#commentModal"
          >
            <FontAwesomeIcon icon={faFileExcel} />
            &nbsp; Import Absen
          </button>
          &nbsp;
          <Link to="add" className="btn btn-success float-end">
            <FontAwesomeIcon icon={faPlus} />
            &nbsp; Tambah Absen
          </Link>
        </div>
      </div>
      <div className="card-body">
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
                  onSorting={(field, order) => setSorting({ field, order })}
                />
                <tbody>
                  {absensData.length > 0 &&
                    absensData.map((absen, index) => (
                      <tr key={absen.id_absen}>
                        <th scope="row">{index + 1}</th>
                        <td>{absen.pegawai.nik}</td>
                        <td>{absen.pegawai.nama_pegawai}</td>
                        <td>{absen.pegawai.jabatan.nama_jabatan}</td>
                        <td>{convertDate(absen.tanggal)}</td>
                        <td>{absen.keterangan}</td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(absen)}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                            &nbsp; Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {loader}
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
    </div>
  );
};

export default Absen;
