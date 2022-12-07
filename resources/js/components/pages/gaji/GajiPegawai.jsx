import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faCheck,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import { TableHeader, Search, Pagging } from "../../datatable";
import useLoading from "../../Loading";
import { useToken } from "../../../hook/Token";
import { NumericFormat } from "react-number-format";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const GajiPegawai = () => {
  const { token, setToken, exp, setExp } = useToken();
  const [gajis, setGajis] = useState([]);
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
    { name: "Periode", field: "periode", sortable: false },
    { name: "NIK", field: "nik", sortable: false },
    { name: "Nama", field: "nama_pegawai", sortable: false },
    { name: "Jabatan", field: "nama_jabatan", sortable: false },
    { name: "Status", field: "status_pegawai", sortable: false },
    { name: "Gaji Pokok", field: "gaji_pokok", sortable: false },
    { name: "Tunjangan", field: "tunjangan", sortable: false },
    { name: "Bonus", field: "bonus", sortable: false },
    { name: "Gaji per Hari", field: "gaji_harian", sortable: false },
    { name: "Tunjangan per Hari", field: "tunjangan_harian", sortable: false },
    { name: "Total Hadir", field: "total_hadir", sortable: false },
    { name: "Potongan", field: "potongan", sortable: false },
    { name: "Total Gaji", field: "total", sortable: false },
    { name: "Aksi", field: "aksi", sortable: false },
  ];

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    getGajis();
  }, []);

  const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
  const getGajis = async () => {
    showLoader();
    const { data: response } = await axiosJWT.get(
      `${import.meta.env.VITE_BASE_URL}/pegawai-slip`,
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
    setGajis(response.data);
    hideLoader();
  };

  const gajisData = useMemo(() => {
    let computedGajis = gajis;

    if (search) {
      computedGajis = computedGajis.filter(
        (data) =>
          data.pegawai.nama_pegawai
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.gaji_pokok.toString().includes(search.toLowerCase()) ||
          data.total_hadir.toString().includes(search.toLowerCase()) ||
          data.tunjangan.toString().includes(search.toLowerCase())
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
    navigasi("/gaji/slip");
  };

  return (
    <div className="card">
      <div className="card-header d-sm-flex justify-content-between align-items-center bg-white">
        <h5 className="card-title">Data Gaji</h5>
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
                  {gajisData.length > 0 ? (
                    gajisData.map((gaji, index) => (
                      <tr key={gaji.id_gaji}>
                        <th scope="row">{index + 1}</th>
                        <td>{convertDate(parseInt(gaji.periode))}</td>
                        <td>{gaji.pegawai.nik}</td>
                        <td>{gaji.pegawai.nama_pegawai}</td>
                        <td>{gaji.pegawai.jabatan.nama_jabatan}</td>
                        <td>
                          {gaji.pegawai.status_pegawai === 0
                            ? "Pegawai Kontrak"
                            : "Pegawai Tetap"}
                        </td>
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
                          <button
                            className="btn btn-success"
                            onClick={() => handleValidasi(gaji)}
                          >
                            <FontAwesomeIcon icon={faSearch} />
                            &nbsp; Slip Gaji
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15}>
                        {gajisData.length === 0 && !isLoad
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

export default GajiPegawai;
