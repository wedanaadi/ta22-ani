import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";

const Pegawai = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [pegawais, setPegawai] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loader, showLoader, hideLoader, isLoading] = useLoading();
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
    { name: "NIK", field: "nik", sortable: false },
    { name: "Nama Pegawai", field: "nama_pegawai", sortable: false },
    { name: "Jabatan", field: "jabatan_id", sortable: false },
    { name: "Tempat Lahir", field: "tempat_lahir", sortable: false },
    { name: "Tanggal Lahir", field: "tanggal_lahir", sortable: false },
    { name: "Jenis Kelamin", field: "jenis_kelamin", sortable: false },
    { name: "Alamat", field: "alamat", sortable: false },
    { name: "Agama", field: "agama", sortable: false },
    { name: "Status Pernikahan", field: "status_pernikahan", sortable: false },
    { name: "Pendidikan", field: "pendidikan", sortable: false },
    { name: "Telepon", field: "no_telepon", sortable: false },
    { name: "Status Pegawai", field: "status_pegawai", sortable: false },
    { name: "Foto", field: "foto", sortable: false },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getPegawais();
  }, []);

  const getPegawais = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPegawai(response.data);
    hideLoader();
  };

  const pegawaiData = useMemo(() => {
    let computedPegawais = pegawais;

    if (search) {
      computedPegawais = computedPegawais.filter(
        (data) =>
          data.nama_pegawai.toLowerCase().includes(search.toLowerCase()) ||
          data.jabatan.nama_jabatan
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.tempat_lahir.toLowerCase().includes(search.toLowerCase()) ||
          data.tanggal_lahir.toLowerCase().includes(search.toLowerCase()) ||
          data.agama.toLowerCase().includes(search.toLowerCase()) ||
          data.pendidikan.toLowerCase().includes(search.toLowerCase()) ||
          data.no_telepon.toLowerCase().includes(search.toLowerCase()) ||
          data.nik.toString().toLowerCase().includes(search.toLowerCase()) ||
          data.alamat.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedPegawais.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedPegawais = computedPegawais.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedPegawais.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [pegawais, currentPage, search, sorting]);

  const handleEdit = async (row) => {
    localStorage.setItem("PegawaiEdit", btoa(JSON.stringify(row)));
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
        `${import.meta.env.VITE_BASE_URL}/pegawai/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
          },
        }
      );
      getPegawais();
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

  return (
    <div className="card">
      <ToastContainer />
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Pegawai</h5>
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
              <table className="table table-striped table-bordered nowrap">
                <TableHeader
                  headers={headers}
                  onSorting={(field, order) => setSorting({ field, order })}
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
                        <td>
                          <img
                            height={56}
                            width={56}
                            src={`${
                              import.meta.env.VITE_PUBLIC
                            }/images/pegawai/${pegawai.foto}`}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(pegawai)}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                            &nbsp; Edit
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-danger"
                            onClick={() => confirm(pegawai.id_pegawai)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            &nbsp; Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15}>
                        {pegawaiData.length === 0 && !isLoading
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

export default Pegawai;
