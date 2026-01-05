import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import html2pdf from "html2pdf.js";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { FaPlus, FaCalculator, FaTrash } from "react-icons/fa";
import { BsFiletypeDoc } from "react-icons/bs";
import { FaRegIdCard } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

import { jsPDF } from "jspdf";
import { Button } from "@mui/material";
import { FormControl } from "react-bootstrap";
import Pagination from "../../component/Pagination";

import { Base64 } from "js-base64";
import { userToken } from "../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
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

  // เวลาพร้อมรูปแบบ 2 หลัก
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};
const convertToThaiDate1 = (dateString) => {
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

  return `${day} ${month} ${year} `;
};

const AdminSetData_Edit = () => {
  const getstore = useRecoilValue(userToken);
  const PerD = Base64.decode(getstore.PerD); //รหัส
  const PerFuNas = Base64.decode(getstore.PerFuNas); //ชื่อ
  const PerPST_N = Base64.decode(getstore.PerPST_N); //ชื่อตำแหน่ง

  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 50; // จำนวนรายการต่อหน้า

  const [score, setScore] = useState("");
  const [level, setLevel] = useState("");
  const [risk, setRisk] = useState("");
  const [result, setResult] = useState("");
  const [getDataShow, setgetDataShow] = useState([]); //แสดงข้อมูลเดี่ยว

  const [probabilityInput, setProbabilityInput] = useState("");
  const [probabilityPercent, setProbabilityPercent] = useState("");

  const [accounts, setAccounts] = useState([
    { status: "", amount: "", isNew: false },
  ]);
  const [reasons, setReasons] = useState([{ reason: "" }]);

  //คำนวณคะแนน

  // ✅ ฟังก์ชันแปลงคะแนนเครดิตเป็นระดับและความเสี่ยง
  const handleScoreChange = (e) => {
    const value = e.target.value;
    setScore(value);
    const num = parseInt(value);

    if (!isNaN(num)) {
      if (num >= 753 && num <= 900) {
        setLevel("AA");
        setRisk("ความเสี่ยงต่ำ");
        setResult("ผ่าน");
      } else if (num >= 725 && num <= 752) {
        setLevel("BB");
        setRisk("ความเสี่ยงต่ำ");
        setResult("ผ่าน");
      } else if (num >= 699 && num <= 724) {
        setLevel("CC");
        setRisk("ความเสี่ยงต่ำ");
        setResult("ผ่าน");
      } else if (num >= 681 && num <= 698) {
        setLevel("DD");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num >= 646 && num <= 680) {
        setLevel("EE");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num >= 616 && num <= 645) {
        setLevel("FF");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      }

      // 🔹 ตัวเลขพิเศษต้องเช็กก่อนช่วง 0–615
      else if (num === 10) {
        setLevel("TT");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      } else if (num === 20) {
        setLevel("ZZ");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      } else if (num === 30) {
        setLevel("VV");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 40) {
        setLevel("WW");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 50) {
        setLevel("XX");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 60) {
        setLevel("YY");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 0) {
        setLevel("-");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      }

      // 🔹 เงื่อนไขสุดท้าย (คะแนนทั่วไปต่ำกว่า 616)
      else if (num >= 0 && num <= 615) {
        setLevel("GG");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      } else {
        setLevel("-");
        setRisk("-");
        setResult("-");
      }
    } else {
      setLevel("");
      setRisk("");
      setResult("");
    }
  };

  // ✅ ฟังก์ชันคำนวณความน่าจะเป็นในการชำระหนี้คืน
  const handleProbabilityChange = (e) => {
    const value = e.target.value;
    setProbabilityInput(value);

    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      const percent = Math.ceil((num / 10000) * 100); // ปัดเศษขึ้น
      setProbabilityPercent(`${percent}%`);
    } else {
      setProbabilityPercent("");
    }
  };

  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup
  const [selectedItem, setSelectedItem] = useState(null); // เก็บข้อมูลแถวที่คลิก

  const [probationaryEmployees, setProbationaryEmployees] = useState([]); // Object to group by section ID

  const getEmployeeDB_Admin = async (page) => {
    const params = {
      _page: page,
      _limit: limit,
    };

    try {
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_Admin_Edit`,
        {
          params,
        }
      );

      // ❌ ห้ามใช้ currentPage ชื่อชนกับ state
      const {
        status,
        sqlDataCustomers,
        totalPages,
        currentPage: apiCurrentPage,
      } = data;

      if (status) {
        console.log(data);
        setProbationaryEmployees(sqlDataCustomers);
        setTotalPages(totalPages);

        // ถ้าอยาก sync จาก API ก็ทำแบบนี้
        // setCurrentPage(apiCurrentPage);

        // ถ้าใช้ state เป็นตัวคุม page ห้าม set currentPage จาก API
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  //เปิดไฟล์เป็น PDF

  const openImageBase64AsPDF = (base64String) => {
    if (!base64String) {
      alert("ไม่พบข้อมูลไฟล์");
      return;
    }

    // base64String = "data:image/png;base64,....."
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(base64String);

    // คำนวณขนาดรูปให้เหมาะกับ A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = imgProps.height / imgProps.width;
    const imgWidth = pageWidth - 40; // margin ซ้ายขวา 20px
    const imgHeight = imgWidth * ratio;

    pdf.addImage(base64String, imgProps.fileType, 20, 20, imgWidth, imgHeight);

    // เปิด PDF ในแท็บใหม่
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    window.open(pdfURL, "_blank");
  };

  const openFileInNewTab = (relativePath) => {
    const base = import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB;
    window.open(`${base}/${relativePath}`, "_blank");
  };

  const handleStatusClick = async (idForm) => {
    setSelectedItem(idForm);

    const params = {
      idForm: idForm,
    };
    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_AdminSingle",
        {
          params,
        }
      );

      const { status, result, message } = data;

      if (status === 200) {
        // console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        console.log("📦 result จากหลังบ้าน:", result);
        setgetDataShow(result[0]);
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

    setShowPopup(true);
  };

  //____________________________add row 1________________________________//

  // ✅ เพิ่มแถวใหม่ (input text)
  const handleAddAccount = () => {
    const newItem = {
      status: "",
      amount: "",
      isNew: true,
    };

    // เพิ่มไว้บนสุด
    setAccounts((prev) => [newItem, ...prev]);
  };

  // ✅ อัปเดตค่าช่อง
  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = value;
    setAccounts(updated);
  };

  // ✅ ลบแถว
  const handleRemoveAccount = (index) => {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  };
  //____________________________add row 1________________________________//

  //____________________________add row 2________________________________//
  // ✅ เพิ่มแถวใหม่
  const handleAddReason = () => {
    const newItem = {
      reason: "",
      isNew: true,
    };
    setReasons((prev) => [newItem, ...prev]);
  };

  const handleChangeReason = (index, value) => {
    const updated = [...reasons];
    updated[index].reason = value;
    setReasons(updated);
  };

  // ✅ ลบแถว

  const handleRemoveReason = (index) => {
    setReasons((prev) => prev.filter((_, i) => i !== index));
  };

  //____________________________add row 2________________________________//

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [approval, setApproval] = useState(""); // Object to group by section ID
  const [joinProject, setJoinProject] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [bankrupt, setBankrupt] = useState("");
  const [description, setDescription] = useState("");
  const [valueCredit, setValueCredit] = useState("");

  const handleSubmit = async () => {
    try {
      // -----------------------------
      // 1) Filter ข้อมูลก่อนส่ง
      // -----------------------------
      const filteredAccounts = accounts.filter(
        (acc) => acc.status.trim() !== "" && acc.amount.trim() !== ""
      );

      const filteredReasons = reasons.filter((r) => r.reason.trim() !== "");

      // -----------------------------
      // 2) สร้าง payload ตาม approval
      // -----------------------------
      let payload = {};

      if (approval === "approved") {
        payload = {
          ctmId: selectedItem,
          approval,
          joinProject,
          reportDate,
          bankrupt,
          valueCredit,

          score,
          level,
          probabilityInput,
          probabilityPercent,
          result,
          risk,

          accounts: filteredAccounts,
          reasons: filteredReasons,
          description,

          PerD,
          PerFuNas,
          PerPST_N,
        };
      } else if (approval === "rejected") {
        payload = {
          ctmId: selectedItem,
          approval,

          description, //คำอธิบาย การยกเลิก

          PerD,
          PerFuNas,
          PerPST_N,
        };
      } else if (approval === "pending") {
        payload = {
          ctmId: selectedItem,
          approval,

          description, //คำอธิบายแก้ไข

          PerD,
          PerFuNas,
          PerPST_N,
        };
      } else {
        alert("ค่า approval ไม่ถูกต้อง");
        return;
      }

      console.log("payload:", payload);

      // -----------------------------
      // 3) ส่งข้อมูลไป API
      // -----------------------------
      const res = await apiClient.post(
        "/api/insurances/datacustomers/addDataCreditscore",
        { payload: JSON.stringify(payload) }
      );

      if (res.data.status === 200) {
        console.log("🆔 Form:", res.data);
        alert("บันทึกสำเร็จ");
        return;
      } else {
        console.log("🆔 Form:", res.data);
        alert("บันทึกไม่สำเร็จ");
        return;
      }
    } catch (error) {
      console.error("❌ ERROR ส่งข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  useEffect(() => {
    getEmployeeDB_Admin(currentPage);
  }, [currentPage]);

  return (
    <div>
      <div className="pt-2">
        <div className="cartcustom p-3 shadow-sm">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // ดันซ้าย-ขวา
              width: "100%",
            }}
          >
            {/* ซ้าย: ไอคอน + ข้อความ */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* ไอคอนกลม */}
              {/* <img
            src="/SAKCreditScoring/Insurance-amico.png"
            alt="approval-report"
            style={{
              height: "110px",
              width: "auto",
              // marginBottom: "10px",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          /> */}
              <div>
                {/* <div style={{ fontSize: 18, fontWeight: 700, color: "#0b3b73" }}>
              กำหนดพี่เลี้ยง
            </div> */}
                <div style={{ fontSize: 13, color: "#5b6b82", marginTop: 4 }}>
                  ค้นหาข้อมูลที่ต้องการ
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="pt-1">
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        background: "white",
                        border: "1px solid #e0e0e0",
                        borderRight: "none",
                        borderRadius: "7px 0 0 7px",
                      }}
                    >
                      <FiSearch style={{ color: "#888", fontSize: "16px" }} />
                    </InputGroup.Text>
                    <FormControl
                      type="search"
                      placeholder="- เลือกประเภทการค้นหา -"
                      aria-label="Search"
                      // value={query}
                      // onChange={handleInputChange}
                      style={{
                        borderRadius: "0 7px 7px 0",
                        fontSize: "13px",
                        border: "1px solid #e0e0e0",
                        borderLeft: "none",
                        boxShadow: "none",
                      }}
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* ขวาสุด: ปุ่ม action */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                // onClick={handleRefresh}
                style={{
                  background:
                    "linear-gradient(to right,rgba(22, 60, 93, 1), #002b57)",
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
                  <th className="text-center" style={{ width: "2%" }}>
                    ลำดับ
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    ชื่อ-สกุลลูกค้า
                  </th>

                  <th className="text" style={{ width: "15%" }}>
                    ผู้ขอสืบค้น
                  </th>

                  <th className="text" style={{ width: "8%" }}>
                    วัน/เวลา ที่ยื่นเรื่อง
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    เอกสารประกอบ
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    สถานะ
                  </th>

                  <th className="text-center" style={{ width: "10%" }}>
                    ผู้แจ้งแก้ไข
                  </th>

                  {/* <th className="text-center" style={{ width: "10%" }}>
                    วัน/เวลา ที่แจ้งแก้ไข
                  </th> */}

                  <th className="text-center" style={{ width: "25%" }}>
                    รายละเอียด
                  </th>
                </tr>
              </thead>
              <tbody>
                {probationaryEmployees.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      {(currentPage - 1) * limit + (index + 1)}
                    </td>

                    <td>{item.CTM_form_number}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                        {item.CTM_title_name}
                        {item.CTM_firstname} {item.CTM_lastname}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                      </div>
                    </td>
                    {/* <td>{item.CTM_citizen_id}</td> */}
                    <td>
                      <div>{item.CTM_recorder_fullname}</div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        ตำแหน่ง: {item.CTM_position || "-"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        สาขา/หน่วย: {item.CTM_branch || "-"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        เขต: {item.CTM_branch || "-"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        ภาค: {item.CTM_business_region_id || "-"}
                      </div>
                    </td>

                    {/* <td>{item.CTM_branch}</td>
                    <td>{item.belong}</td> */}
                    {/* <td>{item.region}</td> */}
                    <td>{convertToThaiDate(item.date_upEvidence)}</td>
                    <td className="text">
                      <button
                        className="doc-btn doc-consent mr-1"
                        onClick={() =>
                          openFileInNewTab(
                            `img/consent/${item.Form_consent_document}`
                          )
                        }
                        title="หนังสือยินยอมเปิดเผยข้อมูล"
                      >
                        <BsFiletypeDoc />
                      </button>

                      <button
                        className="doc-btn doc-application mr-1"
                        onClick={() =>
                          openFileInNewTab(
                            `img/application/${item.Form_application_document}`
                          )
                        }
                        title="แบบฟอร์มคำขอ"
                      >
                        <IoDocumentTextOutline />
                      </button>

                      <button
                        className="doc-btn doc-idcard mr-2 mt-1"
                        onClick={() =>
                          openFileInNewTab(
                            `img/idcard/${item.Form_idcard_photo}`
                          )
                        }
                        title="รูปบัตรประชาชน"
                      >
                        <FaRegIdCard />
                      </button>
                    </td>

                    <td className="text">
                      <center>
                        {item.CTM_statusChk === "1" && (
                          <span
                            className="status-badge status-wait"
                            // onClick={() =>
                            //   handleStatusClick(item.CTM_form_number)
                            // }
                            style={{ cursor: "pointer" }}
                          >
                            รอแก้ไข
                          </span>
                        )}
                        {item.CTM_statusChk === "2" && (
                          <span
                            className="status-badge status-pass"
                            onClick={() =>
                              handleStatusClick(item.CTM_form_number)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            ตรวจแล้ว
                          </span>
                        )}
                        {item.CTM_statusChk === "3" && (
                          <span
                            className="status-badge status-cancel"
                            onClick={() =>
                              handleStatusClick(item.CTM_form_number)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            ยกเลิก
                          </span>
                        )}
                      </center>
                    </td>
                    <td>
                      <div>
                        {item.Form_Name_Inspector}
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          วัน/เวลา ที่แจ้งแก้ไข:{" "}
                          {convertToThaiDate(item.Form_date_inspertor)}
                        </div>
                      </div>
                    </td>
                    {/* <td>{convertToThaiDate(item.Form_date_inspertor)}</td> */}
                    <td className="cell-highlight">
                      {" "}
                      {item.SCORE_additional_fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* {totalPages > 1 ? (
            <div className="card-footer clearfix">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          ) : ( */}
          <div style={{ height: "500px" }}></div>
          {/* )} */}
        </div>
      </div>

      {/* 🔹 Popup แสดงข้อมูล */}
      {showPopup && selectedItem && (
        <div className="modal-overlay3">
          <div className="modal-content3">
            {/* 🔹 หัวเรื่อง */}
            <h3
              className="card-title"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
                fontWeight: "600",
                color: "#0f3d78",
                marginBottom: "10px",
              }}
            >
              <FaFileSignature
                style={{ color: "#023672ff", fontSize: "20px" }}
              />
              สรุปผลการอนุมัติสินเชื่อ
            </h3>

            {/* 🔹 ส่วนที่ 1 */}
            <div className="card recorder-card full-width">
              <div className="card-title1" style={{ fontSize: "18px" }}>
                รายละเอียดผู้ขอสืบค้น
              </div>

              <div className="rec-grid2">
                <div>
                  <strong>แบบฟอร์มเลขที่ :</strong>{" "}
                  {getDataShow?.CTM_form_number || "-"}
                </div>
                <div>
                  <strong>ผู้ขอสืบค้น :</strong>{" "}
                  {getDataShow?.CTM_recorder_fullname || "-"}
                </div>
                <div>
                  <strong>ตำแหน่ง :</strong> {getDataShow?.CTM_position || "-"}
                </div>
                <div>
                  <strong>สาขา/หน่วย :</strong> {getDataShow?.CTM_branch || "-"}
                </div>
                <div>
                  <strong>วัน/เวลาที่ยื่นขอสืบค้น :</strong>{" "}
                  {convertToThaiDate(getDataShow?.CTM_created_at) || "-"}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <strong>เอกสารประกอบ </strong>{" "}
                  <ul
                    style={{
                      marginTop: "6px",
                      paddingLeft: "18px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      <span
                        style={{ color: "#4a90e2", cursor: "pointer" }}
                        onClick={() =>
                          openImageBase64AsPDF(
                            getDataShow?.Form_consent_document
                          )
                        }
                      >
                        หนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                      </span>
                    </li>

                    <li>
                      <span
                        style={{ color: "#4a90e2", cursor: "pointer" }}
                        onClick={() =>
                          openImageBase64AsPDF(
                            getDataShow?.Form_application_document
                          )
                        }
                      >
                        ใบสมัครขอสินเชื่อ
                      </span>
                    </li>

                    <li>
                      <span
                        style={{ color: "#4a90e2", cursor: "pointer" }}
                        onClick={() =>
                          openImageBase64AsPDF(getDataShow?.Form_idcard_photo)
                        }
                      >
                        สำเนาบัตรประชาชน
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 🔹 ส่วนที่ 2 */}
            <div className="card recorder-card full-width">
              <div className="card-title2" style={{ fontSize: "18px" }}>
                ข้อมูลลูกค้า
              </div>

              <div className="rec-grid2">
                <div>
                  <strong>ชื่อ - นามสกุลลูกค้า :</strong>{" "}
                  {getDataShow?.CTM_title_name}
                  {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname}
                </div>
                <div>
                  <strong>วัน/เดือน/ปีเกิด :</strong>{" "}
                  {convertToThaiDate1(getDataShow?.CTM_birthdate) || "-"}
                </div>
                <div>
                  <strong>หมายเลขบัตรประชาชน :</strong>{" "}
                  {getDataShow?.CTM_citizen_id || "-"}
                </div>
                <div>
                  <strong>หมายเลขโทรศัพท์ :</strong>{" "}
                  {getDataShow?.CTM_phone || "-"}
                </div>
                <div>
                  <strong>ประเภทสินเชื่อที่ลูกค้าสมัคร :</strong>{" "}
                  {getDataShow?.LTN_Name || "-"}
                </div>
                <div>
                  <strong>วงเงินขอสินเชื่อ :</strong>{" "}
                  {getDataShow?.Form_loan_amount
                    ? Number(getDataShow.Form_loan_amount).toLocaleString()
                    : "-"}{" "}
                  บาท
                </div>

                <div>
                  <strong>ประเภทลูกค้า :</strong>{" "}
                  {getDataShow?.CMTN_Name || "-"}
                </div>
              </div>
            </div>

            {/* 🔹 Footer */}
            <div className="popup-footer">
              <button className="btn-cancel-modern" onClick={closePopup}>
                ยกเลิก
              </button>
              {/* <button
                className="btn-submit-modern"
                type="button"
                onClick={handleSubmit}
              >
                <BsSend style={{ marginRight: "6px" }} />
                รายงานผล
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSetData_Edit;
