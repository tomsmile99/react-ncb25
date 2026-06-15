import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../recoilstore/userStores";
import { Base64 } from "js-base64";
import html2pdf from "html2pdf.js";
import { useRecoilValue } from "recoil";
import { FaSyncAlt } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { MdNoteAdd } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { Row, Col, Form, Table, Modal } from "react-bootstrap";
import { TbTruckDelivery } from "react-icons/tb";
import { HiCheckCircle } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { userToken } from "../../recoilstore/userStores";
import { FaCalendarCheck } from "react-icons/fa";
import { Button } from "@mui/material";

import { NavLink } from "react-router-dom";
import Pagination from "../../component/Pagination";

import Swal from "sweetalert2";

const Adminfollow_Send_consent = () => {
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 50; // จำนวนรายการต่อหน้า

  const [probationaryEmployees, setProbationaryEmployees] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [showCustomerData, setShowCustomerData] = useState(false);

  const location = useLocation(); 
  const resultRef = useRef(null);
  const getstore = useRecoilValue(userToken);

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const PerWP_N = Base64.decode(getstore.PerWP_N);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);
  const PerRG_N = Base64.decode(getstore.PerRG_N);

  const [formData, setFormData] = useState({
    customer_code: "",
    CTM_form_number: "",
    CTM_business_zone: "",
    date_upEvidence: "",
    customer_name: "",
    CTM_recorder_fullname: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editBatchId, setEditBatchId] = useState(null);

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [IdTruck, setIdTruck] = useState("");
  const [idcusshow, setIdcusshow] = useState("");
  const [getDataShow, setgetDataShow] = useState({});
  const pdfRef = useRef();
  const [viewMode, setViewMode] = useState("current");
  const [roundFilter, setRoundFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ keyword จริงที่ใช้ค้นหา
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchType, setSearchType] = useState("form");
  // 🔷 STATE
  const [stepModal, setStepModal] = useState(1); // 1 = เพิ่มรายการ / 2 = preview

  const handleOpenModal = async (roundType) => {
    setStepModal(1);
    // 🔷 เปิด modal ก่อน
    setShowModal(true);

    // 🔷 set รอบ
    setCurrentRound(roundType);

    // 🔷 clear table กันค้าง
    setTableData([]);

    try {
      //ส่ง API โดยเลือก วันที่ปัจุบันไปค้นหาใบงาน
      const today = new Date().toISOString().split("T")[0];

      const { data } = await apiClient.get(
        `/api/insurances/consent_data?roundType=${roundType}&today=${today}`,
      );

      const { status, sqlDataCustomers } = data;

      if (status === 200) {
        // ใช้ข้อมูลจาก API ได้เลย

        // ✅ แปลงข้อมูลเพิ่ม customer_name
        const formattedData = (sqlDataCustomers || []).map((item) => ({
          ...item,

          customer_name: `${item.CTM_title_name || ""}${item.CTM_firstname || ""}  ${item.CTM_lastname || ""}`,
        }));

        setTableData(formattedData || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 🔷 STYLE
  const tdStyle = {
    padding: "14px 16px",
    fontSize: 13,
    color: "#475569",
    verticalAlign: "middle",
  };

  // 🔷 ปิด modal
  const handleCloseModal = () => {
    // reset form
    setFormData({
      customer_code: "",
      CTM_form_number: "",
      CTM_business_zone: "",
      date_upEvidence: "",
      customer_name: "",
      CTM_recorder_fullname: "",
    });

    // reset modal step
    setStepModal(1);

    // reset edit mode
    setEditMode(false);

    setEditBatchId(null);

    // reset table
    setTableData([]);

    // hide customer card
    setShowCustomerData(false);

    // close modal
    setShowModal(false);
  };

  const getEmployeeDB_Admin = async (page) => {
    const params = {
      keyword: query,
      searchType,
      _PerWP,
      statusFilter,
      roundFilter,
      _page: page,
      _limit: limit,
    };

    try {
      setLoadingSearch(true);

      // ✅ หน่วงก่อนยิง API 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data } = await apiClient.get(
        `/api/insurances/datacustomers/AdminShowconsentTruckDate`,
        {
          params,
        },
      );

      const { status, sqlDataCustomers, totalPages, currentPage } = data;

      if (status) {
        setProbationaryEmployees(sqlDataCustomers || []);
        setTotalPages(totalPages);
        // console.log(currentPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchTruck = async () => {
    try {
      // ✅ ถ้าไม่มี keyword
      if (!query || query.trim() === "") {
        setSearchKeyword("");
        getEmployeeDB_Admin();
        return;
      }

      setLoadingSearch(true);

      // ✅ เก็บ keyword ที่ค้นจริง
      setSearchKeyword(query);

      const { data } = await apiClient.get(
        `/api/insurances/searchConsentTruck`,
        {
          params: {
            keyword: query,
            searchType,
            _PerWP,
            statusFilter,
            roundFilter,
          },
        },
      );

      if (data.status === 200) {
        // setProbationaryEmployees(data.result || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleDownloadPDF = async (idTruck_id) => {
    setIdTruck(idTruck_id);

    const params = {
      idTruck_id: idTruck_id,
    };

    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers/dataPDFCon",
        {
          params,
        },
      );

      const { status, result, message } = data;

      if (status === 200) {
        // console.log(result);
        setgetDataShow(result);

        setIdcusshow(result[0]);
    
        setTimeout(async () => {
          const element = pdfRef.current;

          // 🔑 รอ font โหลดก่อน
          await document.fonts.ready;

          // แสดง element
          element.style.position = "static";
          element.style.top = "0";
          element.style.left = "0";
          element.style.visibility = "visible";

          const options = {
            margin: 10,
            filename: `form_${idTruck_id}.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          };

          html2pdf()
            .from(element)
            .set(options)
            .outputPdf("bloburl")
            .then((pdfUrl) => {
              window.open(pdfUrl, "_blank");
            })
            .finally(() => {
              element.style.position = "absolute";
              element.style.top = "-9999px";
              element.style.left = "-9999px";
              element.style.visibility = "hidden";
            });
        }, 0);
      } else {
        console.error("❌ ไม่สำเร็จ:", message);
      }

      if (!data || !data.status) {
        console.error("ไม่พบข้อมูลสำหรับ PDF");
        return;
      }
    } catch (error) {
      console.error("โหลดข้อมูลสำหรับ PDF ไม่สำเร็จ:", error);
    }
  };

  const convertToThaiDate = (dateString) => {
    const date = new Date(dateString);
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const day = new Date().getDay();

  // วันพุธ = 3
  // วันศุกร์ = 5

  // 0 = อาทิตย์
  // 1 = จันทร์
  // 2 = อังคาร
  // 3 = พุธ
  // 4 = พฤหัส
  // 5 = ศุกร์
  // 6 = เสาร์

  // รอบวันพุธ

  // รอบวันพุธ
  const canViewWednesday = day === 1 || day === 2 || day === 3;

  // รอบวันศุกร์
  const canViewFriday = day === 3 || day === 4 || day === 5;

  const disableWednesday = !canViewWednesday;

  const disableFriday = !canViewFriday;
  const convertToThaiDatemonthnumber = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;

    return `${day}/${month}/${year}`;
  };
  const handleRefresh = () => {
    // setQuery("");
    // setSearchKeyword("");
    // getEmployeeDB_Admin();
    // setRoundFilter("all");
    // setStatusFilter("all");
    // ✅ reload ทั้งหน้า
    window.location.reload();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getEmployeeDB_Admin(currentPage);
  }, [currentPage]);

  // ==============================
  // เปลี่ยน filter แล้ว reload ใหม่
  // ==============================

  useEffect(() => {
    // ✅ ถ้ามี keyword อยู่
    if (searchKeyword && searchKeyword.trim() !== "") {
      handleSearchTruck();
    } else {
      getEmployeeDB_Admin();
    }
  }, [statusFilter, roundFilter]);

  const handleSearchCustomer = async () => {
    try {
      const { data } = await apiClient.get(
        `/api/insurances/customerByCode?idForm=${formData.customer_code}`,
      );

      const { status, result } = data;

      // ✅ เจอข้อมูล
      if (status === 200 && result && result.length > 0) {
        setFormData((prev) => ({
          ...prev,

          CTM_form_number: result[0]?.CTM_form_number || "",
          CTM_business_zone: result[0]?.CTM_business_zone || "",
          date_upEvidence: result[0]?.date_upEvidence || "",

          customer_name: `${result[0]?.CTM_title_name || ""}${
            result[0]?.CTM_firstname || ""
          } ${result[0]?.CTM_lastname || ""}`.trim(),

          CTM_recorder_fullname: result[0]?.CTM_recorder_fullname || "",
        }));

        // ✅ แสดง card
        setShowCustomerData(true);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        // ❌ ไม่พบข้อมูล
        setShowCustomerData(false);

        Swal.fire({
          icon: "warning",
          title: "ไม่พบข้อมูล",
          text: "ไม่พบรายการที่ท่านค้นหา กรุณาตรวจสอบรหัสฟอร์มอีกครั้ง",
          confirmButtonColor: "#2563eb",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      setShowCustomerData(false);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อข้อมูลได้",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <>
      <div
        style={{
          padding: 24,

          background: "#f6f8fb",

          minHeight: "100vh",
        }}
      >
        {/* ====================================================== */}
        {/* SEARCH */}
        {/* ====================================================== */}

        <div
          style={{
            background: "rgba(255,255,255,0.96)",

            border: "1px solid #edf2f7",

            borderRadius: 22,

            padding: 20,

            marginBottom: 22,

            boxShadow: "0 1px 2px rgba(15,23,42,0.03)",

            backdropFilter: "blur(10px)",
          }}
        >
          {/* TOP */}
          <div
            style={{
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 22,

                fontWeight: 600,

                color: "#01277f",

                letterSpacing: "-0.4px",
              }}
            >
              ติดตามสถานะใบนำส่ง
            </div>

            <div
              style={{
                fontSize: 13,

                color: "#64748b",

                marginTop: 4,
              }}
            >
              ตรวจสอบสถานะเอกสาร เลขชุดนำส่ง และเลขพัสดุ
            </div>
          </div>

          {/* SEARCH ROW */}
          <div
            style={{
              display: "flex",

              gap: 12,

              flexWrap: "wrap",

              alignItems: "center",
            }}
          >
            {/* TYPE */}
            <Form.Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                width: 220,

                height: 46,

                borderRadius: 12,

                border: "1px solid #e5e7eb",

                fontSize: 14,

                background: "#fff",

                boxShadow: "none",
              }}
            >
              <option value="form">ค้นหารหัสฟอร์มใบงาน</option>
              <option value="batch">ค้นหาเลขชุดนำส่ง</option>
              <option value="tracking">ค้นหาเลขพัสดุ</option>
            </Form.Select>

            {/* SEARCH */}
            <Form.Control
              placeholder={
                searchType === "form"
                  ? "กรอกรหัสฟอร์มใบงาน"
                  : searchType === "batch"
                    ? "กรอกเลขชุดนำส่ง"
                    : "กรอกเลขพัสดุ"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getEmployeeDB_Admin(1);
                }
              }}
              style={{
                flex: 1,

                minWidth: 240,

                height: 46,

                borderRadius: 12,

                border: "1px solid #e5e7eb",

                fontSize: 14,

                background: "#fff",

                boxShadow: "none",

                color: "#0f172a",
              }}
            />

            {/* SEARCH BTN */}
            <Button
              onClick={() => getEmployeeDB_Admin(1)}
              style={{
                height: 46,

                minWidth: 120,

                borderRadius: 12,

                background: "#0f172a",

                color: "#fff",

                border: "none",

                fontWeight: 600,

                fontSize: 14,

                textTransform: "none",

                boxShadow: "none",

                transition: "all .2s ease",
              }}
            >
              ค้นหา
            </Button>

            {/* RESET */}
            <Button
              onClick={handleRefresh}
              style={{
                height: 46,

                minWidth: 100,

                borderRadius: 12,

                background: "#fff",

                color: "#334155",

                border: "1px solid #e5e7eb",

                fontWeight: 600,

                fontSize: 14,

                textTransform: "none",

                boxShadow: "none",
              }}
            >
              รีเซ็ต
            </Button>

            {/* ROUND */}
            <Form.Select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              style={{
                width: 180,

                height: 46,

                borderRadius: 12,

                border: "1px solid #e5e7eb",

                fontSize: 14,

                background: "#fff",

                boxShadow: "none",
              }}
            >
              <option value="all">ทุกวัน</option>
              <option value="w">รอบวันพุธ</option>
              <option value="f">รอบวันศุกร์</option>
            </Form.Select>

            {/* STATUS */}
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: 220,

                height: 46,

                borderRadius: 12,

                border: "1px solid #e5e7eb",

                fontSize: 14,

                background: "#fff",

                boxShadow: "none",
              }}
            >
              <option value="all">ทุกสถานะ</option>

              <option value="pending">รอระบุเลขพัสดุ</option>

              <option value="success">ระบุเลขพัสดุแล้ว</option>
            </Form.Select>
          </div>
        </div>

        {/* ====================================================== */}
        {/* TABLE */}
        {/* ====================================================== */}

        <div
          style={{
            background: "#fff",

            borderRadius: 20,

            border: "1px solid #edf2f7",

            overflow: "hidden",

            boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "20px 22px",

              borderBottom: "1px solid #f1f5f9",

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,

                  fontWeight: 600,

                  color: "#0f172a",
                }}
              >
                รายการติดตามสถานะ
              </div>

              <div
                style={{
                  fontSize: 13,

                  color: "#64748b",

                  marginTop: 4,
                }}
              >
                ตรวจสอบว่าเอกสารอยู่ในชุดใดและจัดส่งด้วยเลขพัสดุใด
              </div>
            </div>

            <div
              style={{
                fontSize: 13,

                color: "#64748b",
              }}
            >
              ทั้งหมด{" "}
              <span
                style={{
                  fontWeight: 700,

                  color: "#0f172a",
                }}
              >
                {probationaryEmployees.length}
              </span>{" "}
              รายการ
            </div>
          </div>

          {/* TABLE */}
          <Table
            responsive
            hover
            style={{
              marginBottom: 0,
            }}
          >
            <thead
              style={{
                background: "#fafafa",
              }}
            >
              <tr>
                {[
                  "ลำดับ",
                  "เลขชุดนำส่ง",
                  "พื้นที่ทำการ",
                  "เลขพัสดุ",
                  "ขนส่ง",
                  "รอบนำส่ง",
                  "วันที่สร้าง",
                  "สถานะ",
                  "วันที่นำส่ง",
                  "PDF",
                ].map((head, index) => (
                  <th
                    key={head}
                    style={{
                      padding: "15px 18px",

                      fontSize: 12,

                      fontWeight: 600,

                      color: "#64748b",

                      borderBottom: "1px solid #edf2f7",

                      whiteSpace: "nowrap",

                      background: "#fafafa",

                      letterSpacing: ".2px",
                      // ✅ ลำดับให้อยู่กลาง
                      textAlign: index === 0 ? "center" : "left",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            {loadingSearch ? (
              <tbody>
                <tr>
                  <td colSpan={9}>
                    <div
                      style={{
                        padding: "90px 20px",

                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 42,

                          height: 42,

                          border: "3px solid #e2e8f0",

                          borderTop: "3px solid #0f172a",

                          borderRadius: "50%",

                          margin: "0 auto 16px auto",

                          animation: "spin 0.8s linear infinite",
                        }}
                      />

                      <div
                        style={{
                          color: "#64748b",

                          fontSize: 14,

                          fontWeight: 500,
                        }}
                      >
                        กำลังค้นหาข้อมูล...
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {probationaryEmployees.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      transition: "all .18s ease",

                      cursor: "pointer",
                    }}
                  >
                    {/* INDEX */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#64748b",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      <center>{(currentPage - 1) * limit + (index + 1)}</center>
                    </td>

                    {/* BATCH */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#0f172a",

                        fontWeight: 600,

                        whiteSpace: "nowrap",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {item.consentTruck_id || "-"}
                    </td>

                    {/* workplace */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#334155",

                        whiteSpace: "nowrap",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {item.workplace || "-"}
                    </td>

                    {/* TRACK */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#0f172a",

                        fontWeight: 600,

                        whiteSpace: "nowrap",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {item.consentTruck_Number || "-"}
                    </td>

                    {/* SHIPPING */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#475569",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {item.consentTruck_Namepost_office || "-"}
                    </td>

                    {/* ROUND */}
                    <td
                      style={{
                        padding: "18px",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",

                          alignItems: "center",

                          padding: "6px 12px",

                          borderRadius: 999,

                          fontSize: 12,

                          fontWeight: 600,

                          border:
                            item.consentTruck_StatusDateKey === "w"
                              ? "1px solid #bfdbfe"
                              : "1px solid #e9d5ff",

                          background:
                            item.consentTruck_StatusDateKey === "w"
                              ? "#eff6ff"
                              : "#faf5ff",

                          color:
                            item.consentTruck_StatusDateKey === "w"
                              ? "#2563eb"
                              : "#9333ea",
                        }}
                      >
                        {item.consentTruck_StatusDateKey === "w"
                          ? "วันพุธ"
                          : "วันศุกร์"}
                      </div>
                    </td>

                    {/* DATE */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#64748b",

                        whiteSpace: "nowrap",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {convertToThaiDate(item.consentTruck_date)}
                    </td>

                    {/* STATUS */}
                    <td
                      style={{
                        padding: "18px",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",

                          alignItems: "center",

                          padding: "6px 12px",

                          borderRadius: 999,

                          fontSize: 12,

                          fontWeight: 600,

                          border:
                            item.consentTruck_LvStatus === "Lv1"
                              ? "1px solid #d1fae5"
                              : "1px solid #fed7aa",

                          background:
                            item.consentTruck_LvStatus === "Lv1"
                              ? "#ecfdf3"
                              : "#fff7ed",

                          color:
                            item.consentTruck_LvStatus === "Lv1"
                              ? "#166534"
                              : "#c2410c",
                        }}
                      >
                        {item.consentTruck_LvStatus === "Lv1"
                          ? "จัดส่งแล้ว"
                          : "รอเลขพัสดุ"}
                      </div>
                    </td>

                    {/* DATE */}
                    <td
                      style={{
                        padding: "18px",

                        fontSize: 13,

                        color: "#64748b",

                        whiteSpace: "nowrap",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      {item.consentTruck_delivery_date
                        ? convertToThaiDate(item.consentTruck_delivery_date)
                        : "-"}
                    </td>

                    {/* PDF */}
                    <td
                      style={{
                        padding: "18px",

                        textAlign: "center",

                        borderBottom: "1px solid #f8fafc",
                      }}
                    >
                      <Button
                        onClick={() => handleDownloadPDF(item.consentTruck_id)}
                        style={{
                          width: 38,

                          minWidth: 38,

                          height: 38,

                          borderRadius: 10,

                          background: "#fff",

                          color: "#475569",

                          border: "1px solid #e5e7eb",

                          boxShadow: "none",

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "center",

                          margin: "0 auto",
                        }}
                      >
                        <FaRegFilePdf size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>

          {/* PAGINATION */}
          {totalPages > 1 ? (
            <div
              style={{
                padding: 18,

                borderTop: "1px solid #f1f5f9",

                background: "#fff",
              }}
            >
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div style={{ height: 120 }} />
          )}
        </div>

        <div
          ref={pdfRef}
          style={{
            width: "100%",
            background: "#fff",

            // ✅ ซ่อนไว้ก่อน
            position: "absolute",
            top: "-99999px",
            left: "-99999px",
            visibility: "hidden",

            padding: "40px 36px",

            fontFamily: "THSarabunPSK",
            fontSize: "22px",

            color: "#000",

            margin: "0 auto",

            lineHeight: 1.3,
          }}
        >
          {/* 🔷 มุมขวาบนสุดของกระดาษ */}
          <div
            style={{
              position: "absolute",

              // 🔷 ชิดขอบบน + ขวา
              top: 8,
              right: 10,

              fontSize: 16,
              fontFamily: "THSarabunPSK, sans-serif",
              color: "#444",

              textAlign: "right",
              lineHeight: 1.4,

              zIndex: 10,
            }}
          >
            <div>เลขที่ฟอร์ม : {IdTruck}</div>

            {/* <div>พิมพ์วันที่ : {convertToThaiDatemonthnumber(new Date())}</div> */}
          </div>

          {/* 🔷 หัวเอกสาร */}
          <div
            style={{
              textAlign: "center",

              // 🔷 เว้นพื้นที่ด้านบน
              paddingTop: 25,

              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ใบนำส่ง ฝ่ายตรวจสอบข้อมูลเครดิต
            </div>

            <div
              style={{
                fontSize: 22,
                marginTop: 4,
              }}
            >
              หนังสือให้ความยินยอมเปิดเผยข้อมูล (CONSENT NCB)
            </div>

            <div
              style={{
                fontSize: 22,
              }}
            >
              สังกัด {idcusshow.CTM_business_zone} {idcusshow.CTM_branch} {idcusshow.CTM_business_region}
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0.1px solid #777",
             fontFamily: "'THSarabunPSK'",
              fontSize: 14,
              color: "#222",
            }}
          >
            <thead
              style={{
               fontFamily: "'THSarabunPSK'",
              }}
            >
              <tr>
                {[
                  "ลำดับ",
                  "ชื่อสาขา/หน่วย",
                  "วันที่ยื่นตรวจสอบ",
                  "ชื่อ-สกุล ลูกค้า",
                  "ชื่อ-สกุล\nพนักงานผู้ขอตรวจสอบ",
                ].map((head, index) => (
                  <th
                    key={index}
                    style={{
                      border: "0.1px solid #777",

                      padding: "10px 6px",

                      textAlign: "center",

                      fontWeight: 700,
                      fontSize: 20,
                      whiteSpace: "pre-line",

                      background: "#f8fafc",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              style={{
                fontFamily: "'THSarabunPSK'",
              }}
            >
              {getDataShow?.length > 0
                ? getDataShow.map((item, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "0.8px solid #555",
                          textAlign: "center",
                          height: 36,
                          fontSize: 20,
                          fontWeight: 400,
                          padding: "4px 6px",
                        }}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={{
                          border: "0.8px solid #555",
                          padding: "4px 8px",
                          fontSize: 20,
                          fontWeight: 400,
                        }}
                      >
                        {item.CTM_business_zone}
                      </td>

                      <td
                        style={{
                          border: "0.8px solid #555",
                          textAlign: "center",
                          fontSize: 20,
                          fontWeight: 400,
                          padding: "4px 6px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {convertToThaiDate(item.date_upEvidence)}
                      </td>

                      <td
                        style={{
                          border: "0.8px solid #555",
                          padding: "4px 8px",
                          fontSize: 20,
                          fontWeight: 400,
                        }}
                      >
                        {item.CTM_title_name}
                        {item.CTM_firstname} {item.CTM_lastname}
                      </td>

                      <td
                        style={{
                          border: "0.8px solid #555",
                          padding: "4px 8px",
                          fontSize: 20,
                          fontWeight: 400,
                        }}
                      >
                        {item.CTM_recorder_fullname}
                      </td>
                    </tr>
                  ))
                : [...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "0.8px solid #555",
                          textAlign: "center",
                          height: 36,
                          fontSize: 20,
                          padding: "4px 6px",
                        }}
                      >
                        {index + 1}
                      </td>

                      {[1, 2, 3, 4].map((col) => (
                        <td
                          key={col}
                          style={{
                            border: "0.8px solid #555",
                            height: 36,
                          }}
                        />
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 10,

              color: "#dc2626",

              fontSize: 20,

              fontWeight: 700,
            }}
          >
           หมายเหตุ : ส่งเฉพาะหนังสือให้ความยินยอมฯ เท่านั้น ไม่ต้องส่งสำเนา บัตร ปชช.
          กับใบสมัครขอสินเชื่อ
          </div>

          <div
            style={{
              marginTop: 180,

              width: "70%",

              // 🔷 จัดให้อยู่กลางหน้ากระดาษ
              margin: "180px auto 0 auto",

              fontSize: 24,

              // 🔷 จัดข้อความให้อยู่กึ่งกลางบล็อก
              textAlign: "center",

              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                marginBottom: 10,
                fontSize: 22,
              }}
            >
              ผู้นำส่ง............................................................
              (ชื่อ-สกุล ตัวบรรจง)
            </div>

            <div
              style={{
                marginBottom: 10,
                fontSize: 22,
              }}
            >
              ตำแหน่ง.............................................
              โทร.....................................
            </div>

            <div
              style={{
                fontSize: 22,
              }}
            >
              วันที่นำส่งเอกสาร...........................................................................
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminfollow_Send_consent;
