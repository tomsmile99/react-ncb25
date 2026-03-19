import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../recoilstore/userStores";
import { Base64 } from "js-base64";
import html2pdf from "html2pdf.js";
import { useRecoilValue } from "recoil";
import { FaSyncAlt } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { MdNoteAdd } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { BiMessageRoundedDetail } from "react-icons/bi";
import {
  AiOutlineFileSearch,
  AiOutlineCloudDownload,
  AiOutlineDelete,
} from "react-icons/ai";
import { userToken } from "../../recoilstore/userStores";

import { Button } from "@mui/material";

import { NavLink } from "react-router-dom";
import Pagination from "../../component/Pagination";

import { FaPlusCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const SalepersonView_Litemain = () => {
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 50; // จำนวนรายการต่อหน้า

  const [probationaryEmployees, setProbationaryEmployees] = useState([]);
  const location = useLocation();

  const getstore = useRecoilValue(userToken);

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const PerWP_N = Base64.decode(getstore.PerWP_N);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);

  const getEmployeeDB_Admin = async (page) => {
    const params = {
      _page: page,
      _limit: limit,
      _PerWP: _PerWP,
    };

    // console.log(params);

    try {
      const { data } = await apiClient.get(`/api/insurances/datacustomers`, {
        params,
      });

      // ❌ ห้ามใช้ currentPage ชื่อชนกับ state
      const {
        status,
        sqlDataCustomers,
        totalPages,
        currentPage: apiCurrentPage,
      } = data;

      if (status) {
        setProbationaryEmployees(sqlDataCustomers);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [getDataShow, setgetDataShow] = useState({});
  const pdfRef = useRef();

  const handleDownloadPDF = async (idForm) => {
    const params = {
      idForm: idForm,
    };
    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers/dataPDF",
        {
          params,
        },
      );

      const { status, result, message } = data;

      if (status === 200) {
        setgetDataShow(result[0]);

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
            filename: `form_${idForm}.pdf`,
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
  const getThaiFullDate = () => {
    const date = new Date();
    const months = [
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

    return `วันที่ ${date.getDate()} เดือน ${months[date.getMonth()]} พ.ศ. ${
      date.getFullYear() + 543
    }`;
  };

  const indexInPage = (index, currentPage, limit) => {
    return (currentPage - 1) * limit + (index + 1);
  };

  // คำนวณ start index
  const startIndex = (currentPage - 1) * limit;
  // ตัดข้อมูลเฉพาะหน้าปัจจุบัน
  const currentData = probationaryEmployees.slice(
    startIndex,
    startIndex + limit,
  );

  const handleRefresh = () => {
    getEmployeeDB_Admin(); //
    setQuery("");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getEmployeeDB_Admin(currentPage);
  }, [currentPage]);

  const [highlightId, setHighlightId] = useState(null);

  const handleDel = async (tableId, idNumber) => {
    //  if (!tableId || !idNumber) return;

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
      const res = await apiClient.post("api/insurances/datacustomers/delete", {
        tableId,
        idNumber,
      });

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
        window.location.assign("/Salesperson");
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

  const formatPhoneFront = (phone = "") => {
    const digits = phone.replace(/\D/g, ""); // เอาเฉพาะตัวเลข

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const dateNow = new Date();

  useEffect(() => {
    if (location.state?.highlightId) {
      setHighlightId(location.state.highlightId);

      // ✅ ให้กระพริบ 5 วิ แล้วหาย
      setTimeout(() => {
        setHighlightId(null);
      }, 5000);
    }
  }, [location.state]);
  return (
    <>
      <div className="pt-2">
        <div className="cartcustom p-3 shadow-xl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // ดันซ้าย-ขวา
              width: "100%",
            }}
          >
            {/* ขวาสุด: ปุ่ม action */}

            {/* ซ้าย: ไอคอน + ข้อความ */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <NavLink
                to="/Sale_inputDataCredit"
                style={{ textDecoration: "none" }}
              >
                <Button
                  className="glow-button"
                  style={{
                    background: "#f1f5f9",
                    color: "#022d58",
                    border: "none",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    fontWeight: 500,
                  }}
                >
                  <FaPlusCircle /> เพิ่มหนังสือให้ความยินยอมในการเปิดเผยข้อมูล
                </Button>
              </NavLink>
            </div>

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

          <div className="table-responsive pt-2">
            <table className="table table-hover table-sm">
              <thead className="custom-buttonTBs">
                <tr>
                  <th className="text-center" style={{ width: "5%" }}>
                    ลำดับ
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  {/* <th className="text" style={{ width: "10%" }}>
                    รหัสลูกค้า
                  </th> */}
                  <th className="text" style={{ width: "15%" }}>
                    ชื่อ-นามสกุล ลูกค้า
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    เลขบัตรประชาชน
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    เบอร์โทร
                  </th>
                  <th className="text" style={{ width: "15%" }}>
                    ผู้บันทึกข้อมูล
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    วัน/เวลา ที่บันทึก
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    พิมพ์หนังสือยินยอม
                  </th>
                  {/* <th className="text" style={{ width: "5%" }}>
                    เอกสารประกอบ
                  </th> */}
                  <th className="text-center" style={{ width: "15%" }}>
                    สถานะ ( อัปโหลดหลักฐาน )
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {probationaryEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted py-4">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "40px 0",
                          color: "#6c757d",
                          fontSize: "18px",
                        }}
                      >
                        <img
                          src="/Documents-amico.png"
                          className="brand-image pt-2"
                          style={{ height: 250, width: "auto" }}
                          alt="loop-color"
                        />{" "}
                        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                          ไม่พบข้อมูลในระบบ
                        </div>
                        <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                          ยังไม่มีรายการที่แสดงในขณะนี้
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  probationaryEmployees.map((item, index) => (
                    <tr
                      key={item.CTM_Idnumber}
                      className={`text${
                        highlightId === item.CTM_Idnumber ? " blink-row" : ""
                      }`}
                    >
                      <td className="text-center">
                        {(currentPage - 1) * limit + (index + 1)}
                      </td>

                      <td className="text-center">
                        {item?.CTM_form_number || "-"}
                      </td>

                      <td>
                        {item.CTM_title_name}
                        {item.CTM_firstname} {item.CTM_lastname}
                      </td>

                      <td>{item.CTM_citizen_id}</td>
                      <td>{item.CTM_phone}</td>
                      <td>{item.CTM_recorder_fullname}</td>
                      <td>{convertToThaiDate(item.CTM_created_at)}</td>

                      {/* PDF */}
                      <td className="text-center">
                        {item.CTM_Idnumber && (
                          <button
                            className="btn-icon"
                            onClick={() => handleDownloadPDF(item.CTM_Idnumber)}
                            title="ฟอร์มหนังสือยินยอม"
                          >
                            <FaRegFilePdf />
                          </button>
                        )}
                      </td>

                      {/* สถานะเอกสาร */}
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          {item.CTM_Idnumber ? (
                            <NavLink
                              to={`/Sale_uploadphotoDataCredit/${item.CTM_Idnumber}`}
                              style={{ textDecoration: "none" }}
                            >
                              {item.Form_verification_status === "Lv0N" && (
                                <span className="status-badge status-waitUb">
                                  01 - รออัปโหลดหลักฐาน
                                </span>
                              )}
                            </NavLink>
                          ) : (
                            <span
                              className="status-badge status-error"
                              title="ไม่พบเลขฟอร์ม (CTM_Idnumber)"
                            >
                              ⚠️ รายการนี้เกิดข้อผิดพลาด
                              กรุณาลบและกดเพิ่มลูกค้าใหม่
                            </span>
                          )}

                          {item.Form_verification_status === "Lv0" && (
                            <span
                              className="status-badge status-wait"
                              onClick={() =>
                                handleStatusClick(item.CTM_table_id)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              0W - รอการตรวจสอบ
                            </span>
                          )}

                          {item.Form_verification_status === "Lv1E" && (
                            <NavLink
                              to={`/Sale_EditDataCustomer/${item.CTM_Idnumber}`}
                              style={{ textDecoration: "none" }}
                            >
                              <span className="status-badge-edit">
                                <span className="icon-circle">
                                  <BiMessageRoundedDetail size={13} />
                                </span>
                                <span className="text">0E - รายการขอแก้ไข</span>
                              </span>
                            </NavLink>
                          )}
                        </div>
                      </td>

                      {/* ปุ่มจัดการ */}
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          {item.CTM_Idnumber &&
                            ["Lv0N", "Lv1E"].includes(
                              item.Form_verification_status,
                            ) && (
                              <NavLink
                                to={`/Sale_EditDataCustomer/${item.CTM_Idnumber}`}
                              >
                                <button
                                  className="btn-icon"
                                  title="แก้ไขข้อมูล"
                                >
                                  <FiEdit />
                                </button>
                              </NavLink>
                            )}
                          {["Lv0N", ""].includes(
                            item.Form_verification_status,
                          ) && (
                            <button
                              className="btn-icon"
                              title="ลบรายการ"
                              onClick={() =>
                                handleDel(item.CTM_table_id, item.CTM_Idnumber)
                              }
                            >
                              <AiOutlineDelete />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 ? (
            <div className="card-footer clearfix">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div style={{ height: "500px" }}></div>
          )}
        </div>
      </div>

      {/* ✅ ส่วนนี้จะถูกนำไปสร้าง PDF */}

      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden",

          width: "730px",
          minHeight: "1000px",
          padding: "20px 32px",
          background: "#ffffff",

          fontFamily: "THSarabunPSK",
          fontSize: "22px", // ✅ ใช้ px
          fontWeight: 400, // ✅ น้ำหนักจริง
          lineHeight: "1.4",
          color: "#4d4d4d",
        }}
      >
        {/* โลโก้ + หัว */}
        <div style={{ textAlign: "left", marginBottom: "8px" }}>
          <img
            src="/logo SAK เลขเสียภาษี.png"
            alt="logo"
            style={{ width: "350px", height: "auto" }} // ✅ ปรับขนาดใหญ่ขึ้น
          />
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "22px",

            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          หนังสือให้ความยินยอมในการเปิดเผยข้อมูล
        </div>

        <div
          style={{
            marginTop: "10px",
            fontSize: "14px",
            textAlign: "right",
            width: "100%",
            marginBottom: "15px",
          }}
        >
          {/* ทำที่ */}

          <div>
            {/* ✅ วันที่ */}
            {(() => {
              // const { day, month, year } = getThaiDateParts(
              //   getDataShow?.CTM_created_at
              // );
              const { day, month, year } = getThaiDateParts(dateNow);

              return (
                <div style={{ fontSize: "22px" }}>
                  {/* ✅ ทำที่ (ความยาวรวม = วันที่ทั้งหมด) */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px auto", // ⭐ ล็อกความกว้างคำ
                      rowGap: "6px",

                      lineHeight: "1.6",
                      justifyContent: "end",
                    }}
                  >
                    {/* แถวทำที่ */}
                    <div className="mt-1" style={{ textAlign: "right" }}>
                      ทำที่
                    </div>
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          width: "279px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",

                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {PerWP_N}
                      </span>
                    </div>

                    {/* แถววันที่ */}
                    <div className="mt-1" style={{ textAlign: "right" }}>
                      วันที่
                    </div>
                    <div>
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          width: "40px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",
                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {day}
                      </div>
                      &nbsp;เดือน&nbsp;
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          width: "110px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",
                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {month}
                      </div>
                      &nbsp;พ.ศ.&nbsp;
                      <div
                        className="mt-1"
                        style={{
                          display: "inline-block",
                          width: "60px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",
                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {year}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #000",
          }}
        >
          {/* 🔷 แถบหัวข้อ */}
          <div
            style={{
              borderBottom: "1px solid #000",
              padding: "6px 12px",
              fontWeight: 400, // ✅ ตัวบาง
            }}
          >
            บุคคลธรรมดา
          </div>

          {/* 🔷 เนื้อหา */}
          <div style={{ padding: "9px" }} className="mt-1">
            <div style={{ marginBottom: "4px" }}>
              ข้าพเจ้า นาย/นาง/นางสาว{" "}
              <div
                className="mt-1"
                style={{
                  display: "inline-block",
                  minWidth: "200px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {getDataShow?.CTM_firstname || ""}
              </div>{" "}
              นามสกุล{" "}
              <div
                className="mt-1"
                style={{
                  display: "inline-block",
                  minWidth: "220px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {getDataShow?.CTM_lastname || ""}
              </div>
            </div>

            <div className="mt-1" style={{ marginBottom: "8px" }}>
              วัน/เดือน/ปี พ.ศ.เกิด{" "}
              <div
                style={{
                  display: "inline-block",
                  minWidth: "233px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {convertToThaiDate(getDataShow?.CTM_birthdate) || ""}
              </div>{" "}
              หมายเลขโทรศัพท์{" "}
              <div
                className="mt-1"
                style={{
                  display: "inline-block",
                  minWidth: "163px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {formatPhoneFront(getDataShow?.CTM_phone)}
              </div>
            </div>

            {/* 🔷 เลขบัตรประชาชน */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "6px" }}>
                บัตรประจำตัวประชาชนเลขที่ :
              </span>

              {getDataShow?.CTM_citizen_id?.replaceAll("-", "")
                .split("")
                .map((digit, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* ช่องตัวเลข */}
                    <span
                      style={{
                        width: "16px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        lineHeight: "1",

                        border: "1px solid #000",
                        marginLeft: index === 0 ? "0" : "-1px", // 🔑 ซ้อนเส้น
                      }}
                    >
                      {digit}
                    </span>

                    {/* ขีดคั่น เฉพาะตำแหน่งที่กำหนด */}
                    {[0, 4, 9, 11].includes(index) && (
                      <span
                        style={{
                          margin: "0 6px", // ✅ เว้นเฉพาะตรง -
                          fontSize: "20px",
                          lineHeight: "1",
                        }}
                      >
                        -
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div
          className="row mb-2 pt-4 print-text"
          style={{
            fontFamily: "THSarabunPSK",
            textAlign: "justify", // ✅ Justify
            textAlignLast: "left", // ✅ บรรทัดสุดท้ายไม่ยืด
            fontWeight: 400, // ✅ น้ำหนักจริง
            lineHeight: "1.35",
            wordBreak: "normal",
            overflowWrap: "normal",
          }}
        >
          <div style={{ paddingLeft: "100px", letterSpacing: "0.4px" }}>
            ข้าพเจ้าตกลงยินยอมให้ บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด (“บริษัท”)
            เปิดเผยหรือให้ข้อมูลของ
          </div>

          <div style={{ letterSpacing: "0.5px" }}>
            ข้าพเจ้าแก่ บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
            ซึ่งเป็นสมาชิกหรือผู้ใช้บริการของบริษัท เพื่อประโยชน์ในการ
          </div>

          <div style={{ letterSpacing: "0.81px" }}>
            วิเคราะห์สินเชื่อ
            ตามคำขอสินเชื่อ/ขอออกบัตรเครดิตของข้าพเจ้าที่ให้ไว้กับบริษัทดังกล่าวข้างต้น
            รวมทั้งเพื่อ
          </div>

          <div style={{ letterSpacing: "0.4px" }}>
            ประโยชน์ในการทบทวนสินเชื่อ ต่ออายุสัญญาสินเชื่อ/บัตรเครดิต
            การบริหารและป้องกันความเสี่ยงตามข้อกำหนด
          </div>

          <div style={{ letterSpacing: "0.3px" }}>
            ของธนาคารแห่งประเทศไทย และให้ถือว่าคู่ฉบับ และบรรดาสำเนา ภาพถ่าย
            ข้อมูลอิเล็กทรอนิกส์ หรือโทรสารที่ทำ
          </div>

          <div style={{ letterSpacing: "0.7px" }}>
            สำเนาขึ้นจากหนังสือให้ความยินยอมฉบับนี้ โดยการถ่ายสำเนา
            ถ่ายภาพหรือบันทึกไว้ไม่ว่าในรูปแบบใดๆ เป็น
          </div>

          <div style={{ letterSpacing: "0.4px" }}>
            หลักฐานในการให้ความยินยอมของข้าพเจ้าเช่นเดียวกัน
          </div>
        </div>

        <div style={{ paddingLeft: "100px", letterSpacing: "0.4px" }}>
          ข้าพเจ้าจึงได้ลงลายมือชื่อไว้เป็นสำคัญ
        </div>

        {/* ✅ โซนลายเซ็นทั้งหมด */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginTop: "18px",
          }}
        >
          {/* ✅ โซนพยาน (จัดซ้าย–ขวา) */}
          <div
            style={{
              display: "flex",
              gap: "16px", // ✅ ระยะห่างซ้าย-ขวา
            }}
          >
            {/* ✅ พยานคนที่ 2 (แสดงเฉพาะตอนมีค่า) */}
            {getDataShow?.Form_witness2_name && (
              <div
                style={{
                  marginTop: "18px",
                  fontSize: "18px",
                  fontWeight: "bold", // ✅ ตัวหนา
                }}
              >
                <div
                  style={{
                    whiteSpace: "nowrap", // ✅ ไม่ให้ขึ้นบรรทัดใหม่
                  }}
                >
                  ข้าพเจ้าขอรับรองว่าเป็นลายพิมพ์นิ้วหัวแม่มือข้าง.........
                </div>

                <div>
                  ของ {getDataShow?.CTM_title_name}
                  {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname} จริง
                </div>
              </div>
            )}

            {/* ✅ กล่องผู้ให้ความยินยอม */}
            <div
              style={{
                border: "1px solid #000",
                borderRadius: "22px",
                width: "400px",
                padding: "6px 10px", // 🔻 จาก 10px → 6px
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="pt-2"
              >
                {/* ไอคอนติ๊ก */}
                <img src="/5290982.png" width={20} alt="signature-icon" />

                {/* ข้อความ + เส้น */}
                <div style={{ textAlign: "left", fontSize: "20px" }}>
                  &nbsp;&nbsp;ลงชื่อ&nbsp;
                  ..........................................................................
                  <br />
                </div>
              </div>
              <div
                style={{
                  // marginLeft: "56px",
                  marginTop: "6px",
                  width: "430px",
                  position: "relative",
                  fontSize: "20px",
                }}
              >
                {/* วงเล็บ + เส้น */}(
                ..........................................................................
                )
                <span style={{ fontSize: "20px", marginLeft: "8px" }}>
                  ตัวบรรจง
                </span>
                {/* ชื่อ (ลอยบนเส้น) */}
                <div
                  style={{
                    position: "absolute",
                    top: "-10px", // 🔑 ปรับระดับความลอย
                    left: "45%",
                    transform: "translateX(-50%)",
                    background: "#fff", // 🔑 กันเส้นทับตัวอักษร
                    padding: "0 8px",
                    whiteSpace: "nowrap",
                    fontWeight: "normal",
                  }}
                >
                  {getDataShow?.CTM_title_name}
                  {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname}
                </div>
              </div>

              <div style={{ fontSize: "20px", fontWeight: 800 }}>
                ผู้ให้ความยินยอม
              </div>
            </div>
          </div>
          {/* ✅ โซนพยาน (จัดซ้าย–ขวา) */}
          <div
            style={{
              display: "flex",
              gap: "16px", // ✅ ระยะห่างซ้าย-ขวา
            }}
          >
            {/* ✅ พยานคนที่ 2 (แสดงเฉพาะตอนมีค่า) */}
            {getDataShow?.Form_witness2_name && (
              <>
                <div
                  style={{
                    borderRadius: "10px",
                    width: "360px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div>( {getDataShow?.Form_witness2_name} )</div>
                  <div>พยาน</div>
                </div>
              </>
            )}

            {/* ✅ พยานคนที่ 1 (แสดงตลอด) */}
            <div
              style={{
                border: "1px solid #000",
                borderRadius: "22px",
                width: "400px",
                padding: "6px 10px", // 🔻 จาก 10px → 6px
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="pt-2"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{ textAlign: "left", fontSize: "20px" }}>
                  &nbsp;&nbsp;ลงชื่อ&nbsp;
                  ..........................................................................
                  <br />
                </div>
              </div>

              <div
                style={{
                  // marginLeft: "56px",
                  marginTop: "6px",
                  width: "430px",
                  position: "relative",
                  fontSize: "20px",
                }}
              >
                (
                ..........................................................................
                )
                <span style={{ fontSize: "20px", marginLeft: "8px" }}>
                  ตัวบรรจง
                </span>
                <div
                  style={{
                    position: "absolute",
                    top: "-10px", // 🔑 ปรับระดับความลอย
                    left: "45%",
                    transform: "translateX(-50%)",
                    background: "#fff", // 🔑 กันเส้นทับตัวอักษร
                    padding: "0 8px",
                    whiteSpace: "nowrap",
                    fontWeight: "normal",
                  }}
                >
                  {getDataShow?.Form_witness1_name}
                </div>
              </div>

              <div style={{ fontSize: "20px", fontWeight: 800 }}>พยาน</div>
            </div>
          </div>
        </div>

        {/* ✅ กรอบหมายเหตุ */}
        <div
          style={{
            border: "1px solid #000",
            padding: "6px 10px",

            fontSize: "20px",
            lineHeight: "1.4",
            textAlign: "justify",
          }}
        >
          <strong>หมายเหตุ :</strong>{" "}
          ข้อมูลที่เปิดเผยให้แก่สมาชิกหรือผู้ใช้บริการเป็นองค์ประกอบหนึ่งในการพิจารณาสินเชื่อของสถาบันการเงิน
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
          <span>
            {" "}
            &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
            &nbsp;แต่การเปิดเผยข้อมูลดังกล่าวเป็นสิทธิของเจ้าของข้อมูลที่จะให้ความยินยอมหรือไม่ก็ได้
          </span>
        </div>
      </div>
    </>
  );
};

export default SalepersonView_Litemain;
