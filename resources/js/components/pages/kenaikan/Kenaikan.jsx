import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../../hook/Token";
import useLoading from "../../Loading";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { Pagging, Search, TableHeader } from "../../datatable";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { floor } from "lodash";

export default function Kenaikan() {
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
    { name: "Tahun Kenaikan", field: "tahun", sortable: false },
    { name: "Masa Kerja", field: "masa", sortable: false },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getKenaikan();
  }, []);

  const getKenaikan = async () => {
    showLoader();
    const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/kenaikan`,
      {
        params: {
          role: dataLokal.role
        },
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


  const confirm = (id, status) => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Yakin melakukan ini ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id, status),
        },
        {
          label: "Cancel",
          onClick: () => false,
        },
      ],
    });
  };

  const handleDelete = async (data, status) => {
    const notifikasiSave = toast.loading("Saving....");
    try {
      const { data: response } = await axiosJWT.post(
        `${import.meta.env.VITE_BASE_URL}/kenaikan`,
        {
          status,
          id: data.id_pegawai,
          tahun: data.tahun
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
          },
        }
      );
      getKenaikan();
      toast.update(notifikasiSave, {
        render: "Successfuly",
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

  return (
    <div className="card">
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Rekomendasi Kenaikan Gaji Pegawai</h5>
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
                    kinerjasData.map((kenaikan, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{kenaikan.nama_pegawai}</td>
                        <td>{kenaikan.tahun}</td>
                        <td>{floor(kenaikan.masa_kerja)} Tahun</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => confirm(kenaikan, '1')}
                          >
                            <FontAwesomeIcon icon={faTrophy} />
                            &nbsp; Beri Kenaikan
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-info"
                            onClick={() => confirm(kenaikan, '0')}
                          >
                            <FontAwesomeIcon icon={faThumbsDown} />
                            &nbsp; Tolak Kenaikan
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
