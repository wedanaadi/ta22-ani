import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { NumericFormat } from "react-number-format";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Gaji = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [gajis, setGajis] = useState([]);
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
    { name: "Periode", field: "periode", sortable: true },
    { name: "NIK", field: "nik", sortable: true },
    { name: "Nama", field: "nama_pegawai", sortable: true },
    { name: "Jabatan", field: "nama_jabatan", sortable: true },
    { name: "Status", field: "status_pegawai", sortable: true },
    { name: "Gaji Pokok", field: "gaji_pokok", sortable: true },
    { name: "Tunjangan", field: "tunjangan", sortable: true },
    { name: "Bonus", field: "bonus", sortable: true },
    { name: "Gaji per Hari", field: "gaji_harian", sortable: true },
    { name: "Tunjangan per Hari", field: "tunjangan_harian", sortable: true },
    { name: "Total Hadir", field: "total_hadir", sortable: true },
    { name: "Potongan", field: "potongan", sortable: true },
    { name: "Total Gaji", field: "total", sortable: true },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getGajis();
  }, []);

  const getGajis = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/gaji`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setGajis(response.data);
    hideLoader();
  };

  const gajisData = useMemo(() => {
    let computedGajis = gajis;

    if (search) {
      computedGajis = computedGajis.filter(
        (data) =>
          data.nama_jabatan.toLowerCase().includes(search.toLowerCase()) ||
          String(data.gaji_pokok)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(data.tunjangan).toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedGajis.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedGajis = computedGajis.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedGajis.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [gajis, currentPage, search, sorting]);

  const handleEdit = async (row) => {
    localStorage.setItem("gajiEdit", btoa(JSON.stringify(row)));
    navigasi("edit");
    // console.log(JSON.parse(atob(localStorage.getItem('JabatanEdit'))));
  };

  const convertDate = (dateProps) => {
    let date = new Date(dateProps);
    return date
    .toLocaleDateString("id-ID", { year: "numeric", month: "long" })
    .toString();
  };

  const handleValidasi = (row) => {
    localStorage.setItem("gajiEdit", btoa(JSON.stringify(row)));
    navigasi("slip");
  }

  return (
    <div className="card">
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Gaji</h5>
        <Link to="add" className="btn btn-success float-end">
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah Gaji
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
                  {gajisData.length > 0 &&
                    gajisData.map((gaji, index) => (
                      <tr key={gaji.id_gaji}>
                        <th scope="row">{index + 1}</th>
                        <td>{convertDate(parseInt(gaji.periode))}</td>
                        <td>{gaji.pegawai.nik}</td>
                        <td>{gaji.pegawai.nama_pegawai}</td>
                        <td>{gaji.pegawai.jabatan.nama_jabatan}</td>
                        <td>{gaji.pegawai.status_pegawai === 0 ? 'Pegawai Kontrak' : 'Pegawai Tetap'}</td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.gaji_pokok}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.tunjangan}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.bonus}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.gaji_harian}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.tunjangan_harian}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td>{gaji.total_hadir}</td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.potongan}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td className="text-end">
                          <NumericFormat
                            displayType="text"
                            value={gaji.total}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                          />
                        </td>
                        <td>
                          {gaji.is_valid === 0 ? (
                            <>
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEdit(gaji)}
                              >
                                <FontAwesomeIcon icon={faPencil} />
                                &nbsp; Edit
                              </button>{" "}
                              <button
                                className="btn btn-success"
                                onClick={() => handleValidasi(gaji)}
                              >
                                <FontAwesomeIcon icon={faCheck} />
                                &nbsp; Validasi
                              </button>
                            </>
                          ) : (
                            <span className="badge text-bg-success">
                              Tervalidasi
                            </span>
                          )}
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

export default Gaji;