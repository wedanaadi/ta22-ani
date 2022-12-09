import axios from "axios";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../../../hook/Token";
import useLoading from "../../Loading";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faTrash,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { Pagging, Search, TableHeader } from "../../datatable";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import StatusModal from "./StatusModal";

export default function Kinerja() {
  const { token, setToken, exp, setExp } = useToken();
  const [kinerjas, setKinerja] = useState([]);
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
    { name: "Nama Pegawai", field: "nama_jabatan", sortable: false },
    { name: "Periode", field: "bulan", sortable: false },
    { name: "Deskripsi", field: "desc", sortable: false },
    { name: "Status", field: "status", sortable: false },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getKinerja();
  }, []);

  const getKinerja = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/kinerja`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setKinerja(response.data);
    hideLoader();
  };

  const kinerjasData = useMemo(() => {
    let computedkinerjas = kinerjas;

    if (search) {
      computedkinerjas = computedkinerjas.filter(
        (data) =>
          data.nama_pegawai.toLowerCase().includes(search.toLowerCase()) ||
          data.desc.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedkinerjas.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedkinerjas = computedkinerjas.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedkinerjas.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [kinerjas, currentPage, search, sorting]);

  const handleEdit = async (row) => {
    localStorage.setItem("kinerjaEdit", btoa(JSON.stringify(row)));
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
        `${import.meta.env.VITE_BASE_URL}/kinerja/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
          },
        }
      );
      getKinerja();
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

  const convertDate = (dateProps) => {
    let date = new Date(dateProps);
    return date
      .toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        // day: "numeric",
      })
      .toString();
  };

  const [modal, setModal] = useState(null);
  const handleStatus = (id) => {
    setModal(id);
  }

  return (
    <div className="card">
      <Suspense fallbasck={""}>
        <StatusModal idKinerja={modal} />
      </Suspense>
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Kinerja</h5>
        <Link to="add" className="btn btn-success float-end">
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah Data
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
              <table className="table table-striped table-bordered">
                <TableHeader
                  headers={headers}
                  onSorting={(field, order) => setSorting({ field, order })}
                />
                <tbody>
                  {kinerjasData.length > 0 ? (
                    kinerjasData.map((kinerja, index) => (
                      <tr key={kinerja.id_kinerjas}>
                        <th scope="row">{index + 1}</th>
                        <td>{kinerja.nama_pegawai}</td>
                        <td>{convertDate(kinerja.periode)}</td>
                        <td>{kinerja.desc}</td>
                        <td>
                          {kinerja.status == "0" ? (
                            <>On Process</>
                          ) : kinerja.status == "1" ? (
                            <>Tercapai</>
                          ) : (
                            <>Tidak Tercapai</>
                          )}
                        </td>
                        <td>
                          {kinerja.status == "0" ? (
                            <>
                              <button
                                className="btn btn-primary"
                                onClick={()=> handleStatus(kinerja.id_kinerjas)}
                                data-bs-toggle="modal"
                                data-bs-target="#statusModal"
                              >
                                <FontAwesomeIcon icon={faCheckDouble} />
                                &nbsp; Ubah Status
                              </button>
                              &nbsp;
                            </>
                          ) : (
                            false
                          )}
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(kinerja)}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                            &nbsp; Edit
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-danger"
                            onClick={() => confirm(kinerja.id_kinerjas)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            &nbsp; Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        {kinerjasData.length === 0 && !isLoad
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
}
