import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { NumericFormat } from "react-number-format";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";

export default function List() {
  const { token, setToken, exp, setExp } = useToken();
  const [lists, setLists] = useState([]);
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
    { name: "Gaji List", field: "nama_jabatan", sortable: false },
    { name: "Gaji Pokok", field: "gaji_pokok", sortable: false },
    { name: "Tunjangan", field: "tunjangan", sortable: false },
    { name: "Jabatan", field: "nama_jabatan", sortable: false },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getListGajis();
  }, []);

  const getListGajis = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/list-gaji`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLists(response.data);
    hideLoader();
  };

  const listGajisData = useMemo(() => {
    let computedListGajis = lists;

    if (search) {
      computedListGajis = computedListGajis.filter(
        (data) =>
          data.nama_jabatan.toLowerCase().includes(search.toLowerCase()) ||
          String(data.gaji_pokok)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(data.tunjangan).toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedListGajis.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedListGajis = computedListGajis.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedListGajis.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [lists, currentPage, search, sorting]);

  const handleEdit = async (row) => {
    localStorage.setItem("listEdit", btoa(JSON.stringify(row)));
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
        `${import.meta.env.VITE_BASE_URL}/list/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: `application/json`,
          },
        }
      );
      getListGajis();
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
        <h5 className="card-title">List Master Gaji</h5>
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
                  {listGajisData.length > 0 ? (
                    listGajisData.map((list, index) => (
                      <tr key={list.id_master_gaji}>
                        <th scope="row">{index + 1}</th>
                        <td>{list.nama_gaji}</td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={list.gaji_pokok}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={list.tunjangan}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td>{list.jabatan.nama_jabatan}</td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(list)}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                            &nbsp; Edit
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-danger"
                            onClick={() => confirm(list.id_master_gaji)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            &nbsp; Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        {listGajisData.length === 0 && !isLoad
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
  )
}
