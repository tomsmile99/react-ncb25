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
import { FaBox } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Pagination from "../../component/Pagination";

import Swal from "sweetalert2";

const SalepersonView_Send_consent = () => {
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
  const PerBL_N = Base64.decode(getstore.PerBL_N);

  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [shippingData, setShippingData] = useState({});

  const [tableData, setTableData] = useState([]);
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

  const [showExample, setShowExample] = useState(false);

  const handleAddRow = () => {
    // ✅ เช็คซ้ำ
    const isDuplicate = tableData.some(
      (item) => item.CTM_form_number === formData.CTM_form_number,
    );

    if (isDuplicate) {
      Swal.fire({
        icon: "warning",
        title: "รายการซ้ำ",
        text: "รหัสฟอร์มนี้ถูกเพิ่มในตารางแล้ว",
        confirmButtonColor: "#f59e0b",
      });

      return;
    }

    // ✅ เพิ่มข้อมูล
    const newRow = {
      CTM_form_number: formData.CTM_form_number,
      CTM_business_zone: formData.CTM_business_zone,
      date_upEvidence: formData.date_upEvidence,
      customer_name: formData.customer_name,
      CTM_recorder_fullname: formData.CTM_recorder_fullname,
    };

    setTableData((prev) => [...prev, newRow]);

    // reset form
    setFormData({
      customer_code: "",
      CTM_form_number: "",
      CTM_business_zone: "",
      date_upEvidence: "",
      customer_name: "",
      CTM_recorder_fullname: "",
    });

    setShowCustomerData(false);

    showToast("เพิ่มรายการสำเร็จ");
  };

  const handleSaveAll = async () => {
    try {
      // ✅ ปี ค.ศ. 2 หลัก
      const year = new Date().getFullYear().toString().slice(-2);

      // ✅ สุ่มเลข 5 หลัก
      const randomNumber = Math.floor(10000 + Math.random() * 90000);

      // ✅ เลข Batch
      const batchNo = `THXNCB${year}-${randomNumber}`;

      // ✅ รวมเฉพาะรหัสฟอร์ม
      const formNumbers = tableData.map((item) => item.CTM_form_number);

      // ✅ payload ใหม่
      const payload = {
        consentTruck_id: batchNo,
        consentTruck_StatusDateKey: currentRound,
        total: tableData.length,
        form_numbers: formNumbers,
        idPersend: PerD,
        WPPersend: _PerWP,

        // data: tableData,
      };

      // console.log("PAYLOAD => ", payload);

      // alert("บันทึกสำเร็จ");
      try {
        const { data } = await apiClient.post(
          "/api/insurances/datacustomers/consentTruck",
          {
            payload: JSON.stringify(payload),
          },
        );

        const { status } = data;

        if (status) {
          showToast("เพิ่มรายการสำเร็จ");
          getEmployeeDB_Admin();
          setShowModal(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const handleOpenModal = async (round) => {
  //   setSelectedRound(round);
  //   setShowModal(true);

  //   try {
  //     // 🔥 เรียก API ตามรอบวัน
  //     const { data } = await apiClient.get("/api/getConsentList", {
  //       params: { round }, // เช่น "wednesday" / "friday"
  //     });

  //     if (data.status === 200) {
  //       setTableData(data.data);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
        `/api/insurances/consent_data?roundType=${roundType}&today=${today}&_PerWP=${_PerWP}`,
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
      // _page: page,
      // _limit: limit,
      _PerWP: _PerWP,
    };

    // console.log(params);

    try {
      const { data } = await apiClient.get(
        `/api/insurances/ShowconsentTruckDate`,
        {
          params,
        },
      );

      // ❌ ห้ามใช้ currentPage ชื่อชนกับ state
      const { status, sqlDataCustomers } = data;

      if (status) {
        // console.log(sqlDataCustomers);
        setProbationaryEmployees(sqlDataCustomers);
        // setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [IdTruck, setIdTruck] = useState("");
  const [getDataShow, setgetDataShow] = useState({});
  const pdfRef = useRef();

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

  const handleTogglePreview = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const showToast = (message) => {
    const toast = document.createElement("div");

    toast.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      gap:8px;
    ">
      <span style="
        width:8px;
        height:8px;
        background:#22c55e;
        border-radius:50%;
      "></span>

      <span>${message}</span>
    </div>
  `;

    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "rgba(7, 27, 75, 0.92)",
      color: "#fff",
      padding: "12px 16px",
      borderRadius: "14px",
      fontSize: "13px",
      fontWeight: "500",
      zIndex: 9999,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      backdropFilter: "blur(10px)",
      opacity: 0,
      transform: "translateY(-10px)",
      transition: "all 0.25s ease",
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = 1;
      toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = 0;
      toast.style.transform = "translateY(-10px)";

      setTimeout(() => {
        document.body.removeChild(toast);
      }, 250);
    }, 1800);
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

  const convertToThaiDatemonthnumber = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;

    return `${day}/${month}/${year}`;
  };
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const getThaiDateParts = (dateStr) => {
    if (!dateStr) return { day: "-", month: "-", year: "-" };

    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: thaiMonths[date.getMonth()],
      year: (date.getFullYear() + 543).toString(),
    };
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
  const canViewFriday = day === 4 || day === 5 || day === 6;

  const disableWednesday = !canViewWednesday;

  const disableFriday = !canViewFriday;

  const handleRefresh = () => {
    getEmployeeDB_Admin(); //
    setQuery("");
  };

  useEffect(() => {
    getEmployeeDB_Admin();
  }, []);

  const [highlightId, setHighlightId] = useState(null);

  const handleDel = async (tableId) => {
    // if (!tableId || !idNumber) return;

    // ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "ต้องการลบข้อมูลนี้หรือไม่?",
      text: "ลบแล้วไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      background: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiClient.post(
        "/api/insurances/datacustomers/deleteTHx",
        {
          tableId,
          PerD,
        },
      );

      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ",
          text: "ข้อมูลถูกลบเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#ffffff",
        });

        getEmployeeDB_Admin();
        // window.location.assign("/Salesperson");
        // fetchData(); // โหลดข้อมูลใหม่
      } else {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: res.data.message || "เกิดข้อผิดพลาด",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบข้อมูลได้",
        confirmButtonColor: "#d33",
      });
    }
  };

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

  const handleEditBatch = async (item) => {
    try {
      setEditMode(true);

      setEditBatchId(item.consentTruck_id);

      setCurrentRound(
        item.consentTruck_StatusDateKey === "w" ? "wednesday" : "friday",
      );

      setShowModal(true);

      setStepModal(1);

      const { data } = await apiClient.get(
        `/api/insurances/getConsentTruckDetail`,
        {
          params: {
            consentTruck_id: item.consentTruck_id,
          },
        },
      );

      if (data.status === 200) {
        // console.log(data.result);
        const formattedData = (data.result || []).map((row) => ({
          ...row,

          customer_name: `${row.CTM_title_name || ""}${
            row.CTM_firstname || ""
          } ${row.CTM_lastname || ""}`,
        }));

        setTableData(formattedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBatch = async () => {
    try {
      const formNumbers = tableData.map((item) => item.CTM_form_number);

      const payload = {
        consentTruck_id: editBatchId,
        form_numbers: formNumbers,
      };

      const { data } = await apiClient.post(
        "/api/insurances/updateConsentTruck",
        {
          payload: JSON.stringify(payload),
        },
      );

      if (data.status === 200) {
        showToast("แก้ไขรายการสำเร็จ");

        setShowModal(false);

        getEmployeeDB_Admin();

        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveShipping = async (item) => {
    try {
      const shipping = shippingData[item.consentTruck_id];

      const postOffice =
        shipping?.consentTruck_Namepost_office ||
        item.consentTruck_Namepost_office ||
        "";

      const trackingNumber =
        shipping?.consentTruck_Number || item.consentTruck_Number || "";

      // ✅ วันที่นำส่ง
      const sendDate =
        shipping?.consentTruck_delivery_date ||
        item.consentTruck_delivery_date ||
        "";

      // ✅ validate
      if (!postOffice || !trackingNumber || !sendDate) {
        Swal.fire({
          icon: "warning",
          title: "กรอกข้อมูลไม่ครบ",
          text: "กรุณากรอกวันที่นำส่ง เลือกขนส่ง และกรอกเลขพัสดุ",
          confirmButtonColor: "#2563eb",
        });

        return;
      }

      const payload = {
        consentTruck_id: item.consentTruck_id,

        consentTruck_Namepost_office: postOffice,

        consentTruck_Number: trackingNumber,

        // ✅ เพิ่มวันที่นำส่ง
        consentTruck_delivery_date: sendDate,

        PerD,
      };

      // console.log(payload);

      const { data } = await apiClient.post(
        "/api/insurances/updateShippingTruck",
        {
          payload: JSON.stringify(payload),
        },
      );

      if (data.status === 200) {
        showToast("บันทึกเลขพัสดุสำเร็จ");

        getEmployeeDB_Admin();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  };

  const [viewMode, setViewMode] = useState("current");

  return (
    <>
      <div className="pt-2">
        <div className="cartcustom p-3 shadow-xl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* ซ้าย */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",

                paddingBottom: 12,
              }}
            >
              {/* TITLE */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",

                  paddingRight: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",

                    letterSpacing: "-0.2px",
                  }}
                >
                  สร้างใบนำส่งต้นฉบับหนังสือให้ความยินยอม
                </span>
              </div>

              {/* WEDNESDAY */}
              <Button
                // disabled={disableWednesday}
                onClick={() => handleOpenModal("wednesday")}
                style={{
                  height: 38,

                  borderRadius: 10,

                  background: disableWednesday ? "#f1f5f9" : "#ffffff",

                  color: disableWednesday ? "#94a3b8" : "#0f172a",

                  border: "1px solid #e2e8f0",

                  padding: "0 14px",

                  fontWeight: 500,
                  fontSize: 13,

                  display: "flex",
                  alignItems: "center",
                  gap: 7,

                  boxShadow: "none",

                  textTransform: "none",

                  minWidth: "unset",
                }}
              >
                <MdNoteAdd size={15} />
                รอบวันพุธ
              </Button>

              {/* FRIDAY */}
              <Button
                // disabled={disableFriday}
                onClick={() => handleOpenModal("friday")}
                style={{
                  height: 38,

                  borderRadius: 10,

                  background: disableFriday ? "#f1f5f9" : "#ffffff",

                  color: disableFriday ? "#94a3b8" : "#0f172a",

                  border: "1px solid #e2e8f0",

                  padding: "0 14px",

                  fontWeight: 500,
                  fontSize: 13,

                  display: "flex",
                  alignItems: "center",
                  gap: 7,

                  boxShadow: "none",

                  textTransform: "none",

                  minWidth: "unset",
                }}
              >
                <MdNoteAdd size={15} />
                รอบวันศุกร์
              </Button>

              {/* CURRENT */}
              <Button
                onClick={() => setViewMode("current")}
                style={{
                  height: 38,

                  borderRadius: 10,

                  border:
                    viewMode === "current"
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",

                  background: viewMode === "current" ? "#eff6ff" : "#ffffff",

                  color: viewMode === "current" ? "#1d4ed8" : "#475569",

                  fontWeight: 500,
                  fontSize: 13,

                  padding: "0 14px",

                  display: "flex",
                  alignItems: "center",
                  gap: 7,

                  boxShadow: "none",

                  textTransform: "none",

                  minWidth: "unset",
                }}
              >
                <FaCalendarAlt size={13} />
                รายการปัจจุบัน
              </Button>

              {/* HISTORY */}
              <Button
                onClick={() => setViewMode("history")}
                style={{
                  height: 38,

                  borderRadius: 10,

                  border:
                    viewMode === "history"
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",

                  background: viewMode === "history" ? "#eff6ff" : "#ffffff",

                  color: viewMode === "history" ? "#1d4ed8" : "#475569",

                  fontWeight: 500,
                  fontSize: 13,

                  padding: "0 14px",

                  display: "flex",
                  alignItems: "center",
                  gap: 7,

                  boxShadow: "none",

                  textTransform: "none",

                  minWidth: "unset",
                }}
              >
                <FaCalendarCheck size={13} />
                ประวัติการส่ง
              </Button>
            </div>

            {/* ขวา */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                onClick={handleRefresh}
                style={{
                  background:
                    "linear-gradient(to right,rgba(4, 40, 72, 1), #002b57)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                }}
              >
                <FaSyncAlt /> รีเฟรช
              </Button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              paddingTop: 10,
            }}
          >
            {(viewMode === "current"
              ? probationaryEmployees.filter(
                  (item) => item.consentTruck_LvStatus !== "Lv1",
                )
              : probationaryEmployees.filter(
                  (item) => item.consentTruck_LvStatus === "Lv1",
                )
            ).map((item, index) => (
              <div
                key={item.id}
                // onClick={() => handleEditBatch(item)}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid #e2e8f0",
                  padding: "16px 18px",
                  boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  gap: 18,
                }}
              >
                {/* LEFT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,

                    flex: 1,
                  }}
                >
                  {/* INDEX */}
                  <div
                    style={{
                      width: 42,
                      height: 42,

                      borderRadius: 14,

                      background: "#eff6ff",

                      color: "#2563eb",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* INFO */}
                  {/* INFO */}
                  <div style={{ flex: 1 }}>
                    {/* TOP */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,

                        flexWrap: "wrap",
                      }}
                    >
                      {/* REF */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,

                            fontSize: 11,
                            fontWeight: 500,
                            color: "#94a3b8",

                            letterSpacing: 0.3,
                          }}
                        >
                          <span>รหัสอ้างอิง</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#0f172a",
                              letterSpacing: 0.2,
                            }}
                          >
                            {item.consentTruck_id}
                          </div>

                          {/* TAG ใหม่ */}
                          {(() => {
                            const createdDate = new Date(
                              item.consentTruck_date,
                            );
                            const now = new Date();

                            const diffTime = now - createdDate;
                            const diffDays = diffTime / (1000 * 60 * 60 * 24);

                            return diffDays < 1 ? (
                              <div
                                style={{
                                  padding: "2px 10px",

                                  borderRadius: 999,

                                  background: "#dc2626",
                                  border: "1px solid #dc2626",

                                  color: "#ffffff",

                                  fontSize: 10,
                                  fontWeight: 800,

                                  display: "flex",
                                  alignItems: "center",

                                  height: 22,

                                  boxShadow: "0 1px 2px rgba(220,38,38,0.15)",
                                }}
                              >
                                รายการใหม่
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* META */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 24,

                        marginTop: 12,

                        flexWrap: "wrap",
                      }}
                    >
                      {/* DATE */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            fontWeight: 500,
                            letterSpacing: 0.2,
                          }}
                        >
                          วันที่สร้าง
                        </span>

                        <span
                          style={{
                            fontSize: 13,
                            color: "#334155",
                            fontWeight: 600,

                            marginTop: 2,
                          }}
                        >
                          {convertToThaiDate(item.consentTruck_date)}
                        </span>
                      </div>

                      {/* STATUS */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            fontWeight: 500,
                            letterSpacing: 0.2,
                          }}
                        >
                          รอบการส่ง
                        </span>

                        {/* TAG */}
                        <div
                          style={{
                            padding: "2px 12px",
                            borderRadius: 999,

                            fontSize: 11,
                            fontWeight: 600,

                            background:
                              item.consentTruck_StatusDateKey === "w"
                                ? "#eff6ff"
                                : "#faf5ff",

                            color:
                              item.consentTruck_StatusDateKey === "w"
                                ? "#2563eb"
                                : "#9333ea",

                            border:
                              item.consentTruck_StatusDateKey === "w"
                                ? "1px solid #bfdbfe"
                                : "1px solid #e9d5ff",

                            display: "flex",
                            alignItems: "center",

                            height: "fit-content",
                          }}
                        >
                          {item.consentTruck_StatusDateKey === "w"
                            ? "รอบส่งวันพุธ"
                            : "รอบส่งวันศุกร์"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* STATUS */}
                  <div
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,

                      fontSize: 11,
                      fontWeight: 600,

                      background:
                        item.consentTruck_LvStatus === "Lv1"
                          ? "#ecfdf3"
                          : "#fff7ed",

                      color:
                        item.consentTruck_LvStatus === "Lv1"
                          ? "#166534"
                          : "#c2410c",

                      border:
                        item.consentTruck_LvStatus === "Lv1"
                          ? "1px solid #bbf7d0"
                          : "1px solid #fed7aa",

                      display: "flex",
                      alignItems: "center",
                      gap: 6,

                      width: "fit-content",

                      letterSpacing: 0.2,
                    }}
                  >
                    {item.consentTruck_LvStatus === "Lv1" ? (
                      <>
                        <HiCheckCircle size={14} />
                        ระบุเลขพัสดุแล้ว
                      </>
                    ) : (
                      <>
                        <TbTruckDelivery size={14} />
                        รอระบุผู้ให้บริการขนส่ง
                      </>
                    )}
                  </div>
                  {/* TRACKING */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    {/* เลือกบริษัทขนส่ง */}
                    <Form.Select
                      value={
                        shippingData[item.consentTruck_id]
                          ?.consentTruck_Namepost_office ||
                        item.consentTruck_Namepost_office ||
                        ""
                      }
                      onChange={(e) => {
                        setShippingData((prev) => ({
                          ...prev,

                          [item.consentTruck_id]: {
                            ...prev[item.consentTruck_id],

                            consentTruck_Namepost_office: e.target.value,
                          },
                        }));
                      }}
                      style={{
                        width: 180,
                        height: 42,

                        borderRadius: 12,

                        border: "1px solid #dbe2ea",

                        fontSize: 13,

                        color: "#0f172a",

                        backgroundColor: "#fff",

                        boxShadow: "none",

                        fontWeight: 500,
                      }}
                    >
                      <option value="">เลือกขนส่ง</option>
                      <option value="ไปรษณีย์ไทย">ไปรษณีย์ไทย</option>
                      {/* <option value="ems">EMS</option> */}

                      <option value="flash">Flash Express</option>

                      <option value="kerry">Kerry Express</option>

                      <option value="best">BEST Express</option>

                      <option value="jt">J&T Express</option>

                      <option value="scg">SCG Express</option>

                      <option value="nim">NIM Express</option>

                      <option value="dhl">DHL</option>

                      <option value="fedex">FedEx</option>

                      <option value="ups">UPS</option>

                      <option value="grab">GrabExpress</option>

                      <option value="lalamove">Lalamove</option>

                      <option value="lineman">LINE MAN Messenger</option>

                      <option value="shopee">Shopee Express</option>

                      <option value="lazada">LEX TH (Lazada)</option>

                      <option value="other">อื่นๆ</option>
                    </Form.Select>

                    {/* เลขพัสดุ */}

                    <div
                      style={{
                        position: "relative",
                        width: 200,
                      }}
                    >
                      <span
                        onClick={() => setShowExample(true)}
                        style={{
                          position: "absolute",
                          top: -18,
                          right: 0,
                          fontSize: 11,
                          color: "rgb(3, 58, 168)",
                          cursor: "pointer",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <FaBox /> ตัวอย่างการดูเลขพัสดุ
                      </span>

                      <Form.Control
                        placeholder="กรอกเลขพัสดุ"
                        value={
                          shippingData[item.consentTruck_id]
                            ?.consentTruck_Number !== undefined
                            ? shippingData[item.consentTruck_id]
                                .consentTruck_Number
                            : item.consentTruck_Number || ""
                        }
                        onChange={(e) => {
                          setShippingData((prev) => ({
                            ...prev,
                            [item.consentTruck_id]: {
                              ...prev[item.consentTruck_id],
                              consentTruck_Number: e.target.value,
                            },
                          }));
                        }}
                        style={{
                          width: "100%",
                          height: 42,
                          borderRadius: 12,
                          border: "1px solid #dbe2ea",
                          fontSize: 13,
                          color: "#0f172a",
                          fontWeight: 500,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 500,
                      }}
                    >
                      วันที่นำส่ง
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <Form.Control
                        type="date"
                        value={
                          shippingData[item.consentTruck_id]
                            ?.consentTruck_delivery_date ||
                          item.consentTruck_delivery_date ||
                          ""
                        }
                        onChange={(e) => {
                          setShippingData((prev) => ({
                            ...prev,

                            [item.consentTruck_id]: {
                              ...prev[item.consentTruck_id],

                              consentTruck_delivery_date: e.target.value,
                            },
                          }));
                        }}
                        style={{
                          width: 170,
                          height: 42,

                          borderRadius: 12,

                          border: "1px solid #dbe2ea",

                          fontSize: 13,

                          color: "#0f172a",

                          backgroundColor: "#fff",

                          boxShadow: "none",

                          fontWeight: 500,
                        }}
                      />
                    </div>

                    {/* SEND */}
                    <Button
                      onClick={() => handleSaveShipping(item)}
                      style={{
                        height: 38,

                        borderRadius: 10,

                        background: "#0f172a",

                        color: "#ffffff",

                        border: "1px solid #0f172a",

                        padding: "0 16px",

                        fontSize: 13,
                        fontWeight: 500,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        boxShadow: "none",

                        textTransform: "none",

                        minWidth: 82,
                      }}
                    >
                      ส่ง
                    </Button>

                    {/* PDF */}
                    <Button
                      onClick={() => handleDownloadPDF(item.consentTruck_id)}
                      style={{
                        width: 38,
                        height: 38,

                        minWidth: 38,

                        borderRadius: 10,

                        background: "#ffffff",

                        border: "1px solid #e2e8f0",

                        color: "#dc2626",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        boxShadow: "none",

                        textTransform: "none",
                      }}
                    >
                      <FaRegFilePdf size={15} />
                    </Button>

                    {/* EDIT */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBatch(item);
                      }}
                      disabled={item.consentTruck_LvStatus === "Lv1"}
                      style={{
                        width: 38,
                        height: 38,

                        minWidth: 38,

                        borderRadius: 10,

                        background:
                          item.consentTruck_LvStatus === "Lv1"
                            ? "#f1f5f9"
                            : "#ffffff",

                        border: "1px solid #e2e8f0",

                        color:
                          item.consentTruck_LvStatus === "Lv1"
                            ? "#94a3b8"
                            : "#ca8a04",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        boxShadow: "none",

                        textTransform: "none",

                        cursor:
                          item.consentTruck_LvStatus === "Lv1"
                            ? "not-allowed"
                            : "pointer",

                        opacity: item.consentTruck_LvStatus === "Lv1" ? 0.7 : 1,
                      }}
                    >
                      <FiEdit2 size={15} />
                    </Button>

                    {/* DELETE */}
                    <Button
                      onClick={() => handleDel(item.consentTruck_id)}
                      disabled={item.consentTruck_LvStatus === "Lv1"}
                      style={{
                        width: 38,
                        height: 38,

                        minWidth: 38,

                        borderRadius: 10,

                        background:
                          item.consentTruck_LvStatus === "Lv1"
                            ? "#f1f5f9"
                            : "#ffffff",

                        border: "1px solid #e2e8f0",

                        color:
                          item.consentTruck_LvStatus === "Lv1"
                            ? "#94a3b8"
                            : "#dc2626",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        boxShadow: "none",

                        textTransform: "none",

                        cursor:
                          item.consentTruck_LvStatus === "Lv1"
                            ? "not-allowed"
                            : "pointer",

                        opacity: item.consentTruck_LvStatus === "Lv1" ? 0.7 : 1,
                      }}
                    >
                      <MdOutlineDelete size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-wide"
      >
        <Modal.Header
          style={{
            borderBottom: "0px solid #e5e7eb",
            paddingBottom: 10,
          }}
        >
          <Modal.Title
            style={{
              width: "100%",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ใบนำส่ง ฝ่ายตรวจสอบข้อมูลเครดิต
            </div>

            <div
              style={{
                fontSize: 14,
                color: "#64748b",
                marginTop: 4,
              }}
            >
              หนังสือให้ความยินยอมเปิดเผยข้อมูล (CONSENT NCB)
            </div>
            <div
              style={{
                marginTop: 7,
                fontSize: 14,
              }}
            >
              สังกัด {PerWP_N} {PerBL_N} {PerRG_N}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                marginTop: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: stepModal === 1 ? "#2563eb" : "#dbeafe",
                    color: stepModal === 1 ? "#fff" : "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  1
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                  }}
                >
                  เตรียมรายการ
                </div>
              </div>

              <div
                style={{
                  width: 60,
                  height: 2,
                  background: "#e2e8f0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: stepModal === 2 ? "#2563eb" : "#dbeafe",
                    color: stepModal === 2 ? "#fff" : "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  2
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                  }}
                >
                  พรีวิวก่อนส่ง
                </div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        {/* BODY */}
        <Modal.Body
          style={{
            background: "#f8fafc",
            padding: 20,
          }}
        >
          {/* ========================================================= */}
          {/* STEP 1 */}
          {/* ========================================================= */}

          {stepModal === 1 && (
            <>
              {/* TABLE */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    padding: "18px 22px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    รายการใบนำส่ง
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748b",
                      marginTop: 4,
                    }}
                  >
                    รายการที่เตรียมส่งเข้าระบบตรวจสอบข้อมูลเครดิต
                  </div>
                </div>

                <Table hover responsive style={{ marginBottom: 0 }}>
                  <thead
                    style={{
                      background: "#0f172a",
                    }}
                  >
                    <tr>
                      {[
                        "ลำดับ",
                        "รหัสฟอร์ม",
                        "สาขา",
                        "วันที่ยื่นตรวจ",
                        "ชื่อ-สกุล ลูกค้า",
                        "ชื่อพนักงาน",
                        "จัดการ",
                      ].map((head) => (
                        <th
                          key={head}
                          style={{
                            padding: "14px",
                            fontSize: 12,
                            color: "#fff",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr key={index}>
                          <td style={tdStyle}>{index + 1}</td>

                          <td
                            style={{
                              ...tdStyle,
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            {item.CTM_form_number}
                          </td>

                          <td style={tdStyle}>{item.CTM_business_zone}</td>

                          <td style={tdStyle}>
                            {convertToThaiDate(item.date_upEvidence)}
                          </td>

                          <td style={tdStyle}>{item.customer_name}</td>

                          <td style={tdStyle}>{item.CTM_recorder_fullname}</td>

                          <td style={tdStyle}>
                            <Button
                              size="sm"
                              style={{
                                background: "#fff",
                                color: "#ef4444",
                                border: "1px solid #fecaca",
                                borderRadius: 10,
                                fontSize: 12,
                              }}
                              onClick={() => {
                                const newData = tableData.filter(
                                  (_, i) => i !== index,
                                );

                                setTableData(newData);
                              }}
                            >
                              ลบ
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: 40,
                            color: "#94a3b8",
                          }}
                        >
                          ยังไม่มีรายการ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* FORM */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 22,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  {/* LEFT */}
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      เพิ่มรายการนอกรอบ
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      กรอกรหัสฟอร์มเพื่อค้นหาและดึงข้อมูลอัตโนมัติ
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* INPUT */}
                    <div>
                      <Form.Label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        รหัสฟอร์ม
                      </Form.Label>

                      <Form.Control
                        placeholder="กรอกรหัสฟอร์ม NCB2xxxx"
                        value={formData.customer_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer_code: e.target.value,
                          })
                        }
                        style={{
                          width: 240,
                          height: 46,
                          borderRadius: 12,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    {/* SEARCH */}
                    <Button
                      onClick={handleSearchCustomer}
                      disabled={!formData.customer_code}
                      style={{
                        height: 46,
                        borderRadius: 12,
                        border: "none",
                        fontWeight: 600,
                        color: "#fff",

                        padding: "0 20px",

                        background: !formData.customer_code
                          ? "#cbd5e1"
                          : "linear-gradient(135deg,#2563eb,#3b82f6)",
                      }}
                    >
                      ค้นหา
                    </Button>

                    {/* CLEAR */}
                    <Button
                      onClick={() => {
                        setFormData({
                          customer_code: "",
                          CTM_form_number: "",
                          CTM_business_zone: "",
                          date_upEvidence: "",
                          customer_name: "",
                          CTM_recorder_fullname: "",
                        });

                        setShowCustomerData(false);
                      }}
                      style={{
                        height: 46,
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        color: "#64748b",
                        fontWeight: 500,

                        padding: "0 18px",
                      }}
                    >
                      ล้าง
                    </Button>
                  </div>
                </div>

                {/* RESULT */}
                {showCustomerData && (
                  <div
                    ref={resultRef}
                    style={{
                      marginTop: 20,
                      background: "#f8fafc",
                      borderRadius: 16,
                      padding: 18,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Row className="g-3">
                      <Col md={3}>
                        <div className="info-box">
                          <div className="info-label">รหัสฟอร์ม</div>
                          <div className="info-value">
                            {formData.CTM_form_number}
                          </div>
                        </div>
                      </Col>

                      <Col md={3}>
                        <div className="info-box">
                          <div className="info-label">สาขา</div>
                          <div className="info-value">
                            {formData.CTM_business_zone}
                          </div>
                        </div>
                      </Col>

                      <Col md={3}>
                        <div className="info-box">
                          <div className="info-label">วันที่ส่ง</div>
                          <div className="info-value">
                            {convertToThaiDate(formData.date_upEvidence)}
                          </div>
                        </div>
                      </Col>

                      <Col md={3}>
                        <div className="info-box">
                          <div className="info-label">พนักงาน</div>
                          <div className="info-value">
                            {formData.CTM_recorder_fullname}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Button
                      className="mt-4"
                      onClick={handleAddRow}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 14,
                        border: "none",
                        color: "#ffff",
                        background: "linear-gradient(135deg,#2563eb,#3b82f6)",

                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      + เพิ่มรายการ
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* STEP 2 PREVIEW */}
          {/* ========================================================= */}

          {stepModal === 2 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 24,
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  พรีวิวรายการใบนำส่ง
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    marginTop: 6,
                  }}
                >
                  กรุณาตรวจสอบข้อมูลก่อนส่งรายการเข้าระบบ
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Table
                  responsive
                  style={{
                    marginBottom: 0,
                    verticalAlign: "middle",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {[
                        { label: "ลำดับ", width: "5%" },
                        { label: "รหัสฟอร์ม", width: "20%" }, // 👈 เพิ่มตรงนี้
                        { label: "สาขา", width: "15%" },
                        { label: "วันที่ยื่นตรวจ", width: "10%" },
                        { label: "ชื่อลูกค้า", width: "25%" },
                        { label: "พนักงาน", width: "25%" },
                      ].map((head) => (
                        <th
                          key={head.label}
                          style={{
                            width: head.width,
                            minWidth: head.width,

                            padding: "16px 18px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#64748b",

                            border: "none",
                            whiteSpace: "nowrap",
                            background: "#f8fafc",
                          }}
                        >
                          {head.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          transition: "0.2s",
                        }}
                      >
                        {/* ลำดับ */}
                        <td
                          style={{
                            padding: "18px",
                            border: "none",
                            width: 70,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: "#eff6ff",
                              color: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {index + 1}
                          </div>
                        </td>

                        {/* รหัสฟอร์ม */}
                        <td
                          style={{
                            border: "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {item.CTM_form_number}
                          </div>
                        </td>

                        {/* สาขา */}
                        <td
                          style={{
                            border: "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              color: "#334155",
                              fontWeight: 500,
                            }}
                          >
                            {item.CTM_business_zone}
                          </div>
                        </td>

                        {/* วันที่ */}
                        <td
                          style={{
                            border: "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              color: "#475569",
                            }}
                          >
                            {convertToThaiDate(item.date_upEvidence)}
                          </div>
                        </td>

                        {/* ลูกค้า */}
                        <td
                          style={{
                            border: "none",
                            // minWidth: 170,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                              lineHeight: 1.5,
                            }}
                          >
                            {item.customer_name}
                          </div>
                        </td>

                        {/* พนักงาน */}
                        <td
                          style={{
                            border: "none",
                            //  minWidth: 210,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              color: "#64748b",
                              lineHeight: 1.5,
                            }}
                          >
                            {item.CTM_recorder_fullname}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div
                style={{
                  marginTop: 20,

                  background: "#f8fafc",

                  borderRadius: 16,

                  padding: "16px 20px",

                  border: "1px solid #e2e8f0",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  flexWrap: "wrap",

                  gap: 14,
                }}
              >
                {/* LEFT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  {/* TOTAL */}
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 2,
                      }}
                    >
                      จำนวนรายการ
                    </div>

                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {tableData.length}
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginLeft: 6,
                          color: "#64748b",
                        }}
                      >
                        รายการ
                      </span>
                    </div>
                  </div>

                  {/* ROUND */}
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 2,
                      }}
                    >
                      รอบนำส่ง
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",

                        padding: "6px 14px",

                        borderRadius: 999,

                        background:
                          currentRound === "wednesday" ? "#eff6ff" : "#fef3c7",

                        color:
                          currentRound === "wednesday" ? "#1d4ed8" : "#b45309",

                        border:
                          currentRound === "wednesday"
                            ? "1px solid #bfdbfe"
                            : "1px solid #fde68a",

                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {currentRound === "wednesday"
                        ? "รอบวันพุธ"
                        : "รอบวันศุกร์"}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    วันเวลาปัจจุบัน
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0f172a",
                      marginTop: 2,
                    }}
                  >
                    {new Date().toLocaleString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",

                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer
          style={{
            borderTop: "1px solid #f1f5f9",
            padding: 18,
            background: "#fff",
          }}
        >
          {/* STEP 1 */}
          {stepModal === 1 && (
            <>
              <Button
                variant="light"
                onClick={handleCloseModal}
                style={{
                  borderRadius: 12,
                  height: 44,
                  padding: "0 18px",
                }}
              >
                ปิด
              </Button>

              <Button
                disabled={tableData.length === 0}
                onClick={() => setStepModal(2)}
                style={{
                  color: "#ffff",
                  background:
                    tableData.length === 0
                      ? "#cbd5e1"
                      : "linear-gradient(135deg,#2563eb,#3b82f6)",

                  border: "none",
                  borderRadius: 12,
                  height: 46,
                  minWidth: 170,
                  fontWeight: 600,
                }}
              >
                ถัดไป
              </Button>
            </>
          )}

          {/* STEP 2 */}
          {stepModal === 2 && (
            <>
              <Button
                variant="light"
                onClick={() => setStepModal(1)}
                style={{
                  color: "#676767",
                  borderRadius: 12,
                  height: 46,
                  padding: "0 18px",
                }}
              >
                ← ย้อนกลับแก้ไข
              </Button>

              <Button
                onClick={editMode ? handleUpdateBatch : handleSaveAll}
                style={{
                  background: "linear-gradient(135deg,#16a34a,#22c55e)",
                  color: "#ffff",
                  border: "none",
                  borderRadius: 12,
                  height: 46,
                  minWidth: 180,
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: "0 8px 20px rgba(34,197,94,0.25)",
                }}
              >
                {editMode ? "บันทึกการแก้ไข" : "ยืนยันส่งรายการ"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* ✅ ส่วนนี้จะถูกนำไปสร้าง PDF */}

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
            สังกัด {PerWP_N} {PerBL_N} {PerRG_N}
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",

            // 🔷 เส้นรอบตารางบางลง
            border: "0.1px solid #777",

            fontFamily: "THSarabunPSK, sans-serif",

            // 🔷 ฟอร์มเอกสารทางการ
            fontSize: 13,
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
          หมายเหตุ : ส่งเฉพาะหนังสือให้ความยินยอมฯ เท่านั้น ไม่ต้องส่งสำเนา บัตร
          ปชช. กับใบสมัครขอสินเชื่อ
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

      <Modal
        show={showExample}
        onHide={() => setShowExample(false)}
        centered
        size="xl"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>
            <FaBox className="me-2" />
            ตัวอย่างการดูเลขพัสดุ
          </Modal.Title>
        </Modal.Header> */}

        <Modal.Body className="text-center">
          <img
            src="/178123333840411122.png"
            alt="ตัวอย่างเลขพัสดุ"
            style={{
              width: "100%",
              maxWidth: "800px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          />

          <div
            style={{
              marginTop: "12px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            กรุณานำเลขพัสดุจากใบเสร็จหรือหน้าติดตามสถานะพัสดุมาใส่ในช่องกรอกข้อมูล
          </div>
        </Modal.Body>

        {/* <Modal.Footer> */}
        <Button variant="secondary" onClick={() => setShowExample(false)}>
          ปิด
        </Button>
        {/* </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default SalepersonView_Send_consent;
