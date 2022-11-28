import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { NumericFormat } from "react-number-format";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Jabatan = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [jabatans, setJabatan] = useState([]);
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
    { name: "Nama jabatan", field: "nama_jabatan", sortable: true },
    { name: "Gaji Pokok", field: "gaji_pokok", sortable: true },
    { name: "Tunjangan", field: "tunjangan", sortable: true },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getComment();
  }, []);

  const getComment = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/jabatan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setJabatan(response.data);
    hideLoader();
  };

  const jabatansData = useMemo(() => {
    let computedJabatans = jabatans;

    if (search) {
      computedJabatans = computedJabatans.filter(
        (data) =>
          data.nama_jabatan.toLowerCase().includes(search.toLowerCase()) ||
          String(data.gaji_pokok)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(data.tunjangan).toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedJabatans.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedJabatans = computedJabatans.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedJabatans.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [jabatans, currentPage, search, sorting]);

  const handleEdit = async (row) => {
    localStorage.setItem("JabatanEdit", btoa(JSON.stringify(row)));
    navigasi("edit");
    // console.log(JSON.parse(atob(localStorage.getItem('JabatanEdit'))));
  };

  return (
    <div className="card">
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Jabatan</h5>
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
                  {jabatansData.length > 0 &&
                    jabatansData.map((jabatan, index) => (
                      <tr key={jabatan.id_jabatan}>
                        <th scope="row">{index + 1}</th>
                        <td>{jabatan.nama_jabatan}</td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={jabatan.gaji_pokok}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={jabatan.tunjangan}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(jabatan)}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                            &nbsp; Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan={5}>
                      {jabatansData.length === 0 && !isLoad ? "Tidak Ada Data" : loader}
                    </td>
                  </tr>
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

export default Jabatan;
