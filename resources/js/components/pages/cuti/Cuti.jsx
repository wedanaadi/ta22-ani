import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faTrash,
  faCheck,
  faCross,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";

const Cuti = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [cutis, setCutis] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loader, showLoader, hideLoader, isLoad] = useLoading();
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

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "Pegawai", field: "nama_pegawai", sortable: false },
    { name: "Tanggal Mulai", field: "tanggal_mulai", sortable: false },
    { name: "Tanggal Selesai", field: "tanggal_selesai", sortable: false },
    { name: "Alasan", field: "alasan", sortable: false },
    { name: "Status", field: "status", sortable: false },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getCutis();
  }, []);

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
  const getCutis = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/cuti`,
      {
        params: {
          id: dataLokal.id,
          role: dataLokal.role,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCutis(response.data);
    hideLoader();
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

  const cutiData = useMemo(() => {
    let computedCutis = cutis;

    if (search) {
      computedCutis = computedCutis.filter((data) =>
        data.pegawai.nama_pegawai.toLowerCase().includes(search.toLowerCase())
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
  }, [cutis, currentPage, search, sorting]);

  const handleEdit = (row) => {
    localStorage.setItem("cutiEdit", btoa(JSON.stringify(row)));
    navigasi("edit");
    // console.log(JSON.parse(atob(localStorage.getItem('JabatanEdit'))));
  };

  const confirm = (id) => {
    confirmAlert({
      title: "Hapus Data",
      message: "Yakin melakukan ini.",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "Cancel",
          onClick: () => false,
        },
      ],
    });
  };

  const handleDelete = async (id) => {
    const notifikasiSave = toast.loading("Saving....");
    try {
      const { data: response } = await axiosJWT.delete(
        `${import.meta.env.VITE_BASE_URL}/cuti/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
          },
        }
      );
      getCutis();
      toast.update(notifikasiSave, {
        render: "Delete Successfuly",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
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

  const handleCuti = async (cuti, type) => {
    try {
      const { data: response } = await axiosJWT.put(
        `${import.meta.env.VITE_BASE_URL}/approve-reject/${cuti}`,
        {
          is_aprove: type === "approve" ? "1" : "2",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigasi(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <ToastContainer />
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Cuti</h5>
        <Link to={`add`} className="btn btn-success float-end">
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah Cuti
        </Link>
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
                  {cutiData.length > 0 ? (
                    cutiData.map((cuti, index) => (
                      <tr key={cuti.id_cuti}>
                        <th scope="row">{index + 1}</th>
                        <td>{cuti.pegawai.nama_pegawai}</td>
                        <td>{convertDate(cuti.tanggal_mulai)}</td>
                        <td>{convertDate(cuti.tanggal_selesai)}</td>
                        <td>{cuti.alasan}</td>
                        <td>
                          {cuti.is_aprove == 0 ? (
                            <>
                              <span classname="badge text-bg-info">
                                Menunggu
                              </span>
                            </>
                          ) : cuti.is_aprove == 1 ? (
                            <>
                              <span className="badge text-bg-success">
                                Diterima
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="badge text-bg-danger">
                                Ditolak
                              </span>
                            </>
                          )}
                        </td>
                        <td>
                          {parseInt(cuti.is_aprove) === 0 ? (
                            <>
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  handleCuti(cuti.id_cuti, "approve")
                                }
                              >
                                <FontAwesomeIcon icon={faCheck} />
                                &nbsp; Setujui Cuti
                              </button>{" "}
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleCuti(cuti.id_cuti, "reject")
                                }
                              >
                                <FontAwesomeIcon icon={faXmark} />
                                &nbsp; Tolak Cuti
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEdit(cuti)}
                              >
                                <FontAwesomeIcon icon={faPencil} />
                                &nbsp; Edit
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-danger"
                                onClick={() => confirm(cuti.id_cuti)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                &nbsp; Hapus
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        {cutiData.length === 0 && !isLoad
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
    </div>
  );
};

export default Cuti;
