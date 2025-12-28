import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import html2pdf from "html2pdf.js";

import { Base64 } from "js-base64";
import { useRecoilValue } from "recoil";
import { userToken } from "../../recoilstore/userStores";

import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BsFiletypeDoc } from "react-icons/bs";
import { FaRegIdCard } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import {
  AiOutlineFileSearch,
  AiOutlineCloudDownload,
  AiOutlineDelete,
} from "react-icons/ai";

import axios from "axios";
import { Button } from "@mui/material";

import { FormControl } from "react-bootstrap";

import Pagination from "../../component/Pagination";
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

  return `${day} ${month} ${year}`;
};

const SalepersonView_Examination_Pass = () => {
  const getstore = useRecoilValue(userToken);
  const _PerWP = Base64.decode(getstore.PerWP);

  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 25; // จำนวนรายการต่อหน้า

  const [query, setQuery] = useState(""); // ค้นหาชื่อ

  const [approval, setApproval] = useState([]); // Object to group by section ID
  const [approvaltest, setApprovaltest] = useState([]); // Object to group by section ID

  const [probationaryEmployees, setProbationaryEmployees] = useState([]); // Object to group by section ID

  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup
  const [selectedItem, setSelectedItem] = useState(""); // เก็บข้อมูลแถวที่คลิก
  const [getDataShow, setgetDataShow] = useState([]); //แสดงข้อมูลเดี่ยว
  const [description, setDescription] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [reasons, setReasons] = useState([]);

  const getEmployeeDB_Admin = async (currentPage, searchQuery) => {
    const params = {
      _page: currentPage, // หมายเลขหน้าปัจจุบัน
      limit, // จำนวนรายการต่อหน้า
      _PerWP: _PerWP,
      // query: searchQuery, // คำค้นหา
    };

    try {
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_Credit_Pass`,
        {
          params,
        }
      );

      const { status, sqlDataCustomers, totalPages } = data;
      if (status) {
        setProbationaryEmployees(sqlDataCustomers);
        setTotalPages(totalPages); // ตั้งค่าจำนวนหน้าทั้งหมด
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
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

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handleReasonChange = async (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setReasons([...reasons, value]);

      // 🚀 ถ้าเลือกเหตุผลข้อที่ 1 → ส่ง SMS อัตโนมัติ
      if (value === "คุณสมบัติไม่ผ่านตามนโยบาย") {
        await sendRejectSMS();
      }
    } else {
      setReasons(reasons.filter((r) => r !== value));
    }
  };
  //SMS
  const sendRejectSMS = async () => {
    const phone = getDataShow?.CTM_phone;

    if (!phone) {
      console.error("ไม่พบเบอร์โทรศัพท์ลูกค้า");
      return;
    }

    const message = `บริษัทฯ ไม่สามารถอนุมัติสินเชื่อให้ท่านได้ เป็นผลจากเกณฑ์พิจารณาของบริษัทเท่านั้น ไม่เกี่ยวข้องกับข้อมูลเครดิตบูโร กรุณาติดต่อสาขา ${
      getDataShow?.CTM_branch || ""
    }`;

    try {
      const res = await apiClient.post("/sms/send", {
        phone: phone,
        message: message,
        sender: "SMSMKT.COM",
        campaign_name: "ตรวจสอบข้อมูลเครดิตลูกค้า",
      });

      console.log("ส่ง SMS สำเร็จ!", res.data);
    } catch (err) {
      console.error("ส่ง SMS ไม่สำเร็จ", err);
    }
  };

  const navigate = useNavigate();

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

  const reasonTextMap = {
    1: "เนื่องจากคุณสมบัติไม่ผ่านตามนโยบายของบริษัท",
    2: "เนื่องจากลูกค้ายกเลิกการขอสินเชื่อ",
    3: "เนื่องจาก ย้ายหน่วยทำสินเชื่อ",
    4: "เนื่องจากรายงาน ERROR / รายการไม่ถูกต้อง",
  };

  const handleSubmitReport = async () => {
    const payload = {
      ctmId: selectedItem,
      approval,
      reasons,
      contractNumber,
    };

    try {
      // ⭐ ส่งข้อมูลแบบ payload = JSON string → ฝั่ง PHP รับ getVar("payload")
      const res = await apiClient.post(
        "/api/insurances/datacustomers/updateDataApprove",
        { payload: JSON.stringify(payload) }
      );

      const { status, message, updateForm } = res.data;

      // ⭐ ตรวจสอบสถานะสำเร็จ
      if (status === 200) {
        console.log("Update form:", updateForm);

        // 🟩 แจ้งเตือนสำเร็จ
        Swal.fire({
          icon: "success",
          title: "ส่งรายงานผลสำเร็จ!",
          timer: 1500,
          showConfirmButton: false,
        });

        // ==========================
        // ⭐ เฉพาะกรณีเลือกเหตุผลข้อ 1 → ส่ง SMS
        // ==========================
        if (reasons.includes("1")) {
          const phone = getDataShow?.CTM_phone;

          if (phone) {
            const smsPayload = {
              phone: phone,
              message: `บริษัทฯ ไม่สามารถอนุมัติสินเชื่อให้ท่านได้ เป็นผลจากเกณฑ์พิจารณาของบริษัทเท่านั้น ไม่เกี่ยวข้องกับข้อมูลเครดิตบูโร กรุณาติดต่อสาขา ${
                getDataShow?.CTM_branch || ""
              }`,
              sender: "SMSMKT.COM",
              campaign_name: "ตรวจสอบข้อมูลเครดิตลูกค้า",
            };

            try {
              const statusSMS = await apiClient.post(
                "https://portal-otp.smsmkt.com/api/send-message",
                smsPayload,
                {
                  headers: {
                    "Content-Type": "application/json",
                    api_key: "ac83e6cb02a5813de6eaf5f6008aa55f",
                    secret_key: "edmYozztNQuMY1BP",
                  },
                }
              );
              console.log("ส่ง SMS สำเร็จ!");
              // if (statusSMS.data.code === "000") {
              //   console.log("ส่ง SMS สำเร็จ!");
              // } else {
              //   console.log("ไม่สำเร็จ");
              //   console.log(statusSMS);
              // }
            } catch (smsErr) {
              console.error("ส่ง SMS ไม่สำเร็จ:", smsErr);
            }
          }
        }
      } else {
        console.error("Error: Response status !== 200", res.data);
      }
    } catch (err) {
      console.error("Error:", err);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งรายงานผลได้",
      });
    }
  };

  //Report DSR Page
  const handleView = (item) => {
    const id = item.CTM_form_number;

    const url = `${window.location.origin}/SAKCreditScoring/DataReportDSRs/${id}`;

    window.open(url, "_blank");
  };

  const handleViewModel = (item) => {
    const id = item;

    const url = `${window.location.origin}/SAKCreditScoring/DataReportDSRs/${id}`;

    window.open(url, "_blank");
  };

  const openFileInNewTab = (relativePath) => {
    const base = import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB;
    window.open(`${base}/${relativePath}`, "_blank");
  };

  const handleRefresh = () => {
    getEmployeeDB_Admin(); //
    // setQuery("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <div
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            ></div>

            {/* ขวาสุด: ปุ่ม action */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                onClick={handleRefresh}
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
                  <th className="text" style={{ width: "8%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  <th className="text" style={{ width: "13%" }}>
                    ชื่อ-นาม สกุลลูกค้า
                  </th>

                  <th className="text" style={{ width: "20%" }}>
                    ผู้บันทึกข้อมูล
                  </th>

                  <th className="text" style={{ width: "10%" }}>
                    วัน/เวลา ที่บันทึก
                  </th>

                  <th className="text" style={{ width: "10%" }}>
                    เอกสารประกอบ
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    รายงานผล
                  </th>
                  <th className="text" style={{ width: "11%" }}>
                    ผู้รายงานผลตรวจ
                  </th>

                  <th className="text" style={{ width: "5%" }}>
                    วัน/เวลา ที่รายงานผลตรวจ
                  </th>

                  <th className="text-center" style={{ width: "10%" }}>
                    สถานะ
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    เลขที่สัญญา
                  </th>
                </tr>
              </thead>
              <tbody>
                {probationaryEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11} // ❗ ปรับตามจำนวน <th> ทั้งหมดของตาราง
                      className="text-center"
                      style={{
                        padding: "20px",
                        color: "#6c757d",
                        fontStyle: "italic",
                      }}
                    >
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  probationaryEmployees.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{(currentPage - 1) * limit + index + 1}</td>
                      <td>{item.CTM_form_number}</td>

                      <td>
                        <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                          {item.CTM_title_name}
                          {item.CTM_firstname} {item.CTM_lastname}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          วัน/เดือน/ปี เกิด:{" "}
                          {convertToThaiDate1(item.CTM_birthdate)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เบอร์โทร : {item.CTM_phone || "-"}
                        </div>
                      </td>

                      <td>
                        <div>{item.CTM_recorder_fullname}</div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ตำแหน่ง: {item.CTM_position || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          สาขา/หน่วย: {item.CTM_business_zone || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เขต: {item.belong || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ภาค: {item.region || "-"}
                        </div>
                      </td>

                      <td>{convertToThaiDate(item.CTM_created_at)}</td>

                      <td className="text">
                        <button
                          className="doc-btn doc-consent mr-1 btn-icon"
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
                          className="doc-btn doc-application mr-1 btn-icon"
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
                          className="doc-btn doc-idcard mr-2 mt-1 btn-icon"
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
                        <button
                          className="mr-2 mt-1 btn-icon  p-1"
                          onClick={() => handleView(item)}
                          title="รายงานผล"
                        >
                          <AiOutlineFileSearch />
                        </button>
                      </td>
                      <td>{item.Form_Name_Inspector || "-"}</td>
                      <td>
                        {convertToThaiDate(item.Form_date_inspertor) ?? "-"}
                      </td>

                      <td className="text-center">
                        {item.Form_Approval_results === "approved" && (
                          <span className="status-badge status-pass">
                            02-ผ่านการอนุมัติ
                          </span>
                        )}
                      </td>

                      <td>{item.Form_Contract_number || "-"}</td>
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

      {/* 🔹 Popup แสดงข้อมูล */}
      {showPopup && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3
              className="card-title"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#0f3d78", // น้ำเงินสุภาพมาตรฐาน SAK
                marginBottom: "10px",
              }}
            >
              <FaFileSignature
                style={{ color: "#023672ff", fontSize: "18px" }}
              />
              สรุปผลการอนุมัติสินเชื่อ
            </h3>
            <div className="layout-wrapper3">
              {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}
              <div className="card recorder-card">
                <div className="card-title1" style={{ fontSize: "14px" }}>
                  ส่วนที่ 1 : รายละเอียดผู้ขอสืบค้น
                </div>

                <div className="rec-profile-row">
                  <div className="rec-info">
                    <div className="">
                      <strong>แบบฟอร์มเลขที่ : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_form_number || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>ผู้ขอสืบค้น : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_recorder_fullname || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>ตำแหน่ง : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_position || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>สาขา/หน่วย : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_branch || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>วัน/เวลาที่ ยื่นขอสืบค้น : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {convertToThaiDate(getDataShow?.CTM_created_at) || "-"}
                      </span>
                    </div>

                    <div className="pt-1">
                      <strong>เอกสารประกอบ </strong>
                      <ul
                        style={{
                          paddingLeft: "18px",
                          lineHeight: "1.8",
                        }}
                      >
                        <li>
                          <span
                            style={{
                              color: "#4a90e2",
                              cursor: "pointer",
                              fontWeight: "100",
                            }}
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
                            style={{
                              color: "#4a90e2",
                              cursor: "pointer",
                              fontWeight: "100",
                            }}
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
                            style={{
                              color: "#4a90e2",
                              cursor: "pointer",
                              fontWeight: "100",
                            }}
                            onClick={() =>
                              openImageBase64AsPDF(
                                getDataShow?.Form_idcard_photo
                              )
                            }
                          >
                            สำเนาบัตรประชาชน
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card recorder-card">
                <div className="card-title2" style={{ fontSize: "14px" }}>
                  ส่วนที่ 2 : ข้อมูลลูกค้า
                </div>

                <div className="rec-profile-row">
                  <div className="rec-info">
                    <div className="">
                      <strong>ชื่อ - นามสกุลลูกค้า : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_title_name}
                        {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname}
                      </span>
                    </div>

                    <div className="">
                      <strong>วัน/เดือน/ปีเกิด : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {convertToThaiDate1(getDataShow?.CTM_birthdate) || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>หมายเลขบัตรประชาชน : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_citizen_id || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>หมายเลขโทรศัพท์ : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_phone || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>ประเภทสินเชื่อที่ลูกค้าสมัคร : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.LTN_Name || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>วงเงินขอสินเชื่อ : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.Form_loan_amount
                          ? Number(
                              getDataShow.Form_loan_amount
                            ).toLocaleString()
                          : "-"}{" "}
                        บาท
                      </span>
                    </div>
                    <div className="">
                      <strong>ประเภทลูกค้า : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CMTN_Name || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card recorder-card">
                <div className="card-title3" style={{ fontSize: "14px" }}>
                  ส่วนที่ 3 : ผู้รายงานผลการตรวจสอบข้อมูลเครดิต (NCB)
                </div>

                <div className="rec-profile-row">
                  <div className="rec-info">
                    <div className="rec-row">
                      <strong>สรุปผลการรายงาน :</strong>

                      <center>
                        {getDataShow?.Form_verification_status === "Lv1" && (
                          <span
                            className="status-badge status-wait"
                            style={{ cursor: "pointer" }}
                          >
                            รอตรวจสอบ
                          </span>
                        )}
                        {getDataShow?.Form_verification_status === "Lv2" && (
                          <span
                            className="status-badge status-pass"
                            style={{ cursor: "pointer" }}
                          >
                            ตรวจแล้ว
                          </span>
                        )}
                        {getDataShow?.Form_verification_status === "Lv3" && (
                          <span
                            className="status-badge status-cancel"
                            style={{ cursor: "pointer" }}
                          >
                            ยกเลิก
                          </span>
                        )}
                      </center>
                    </div>

                    <div className="rec-row">
                      <strong>รายละเอียดเพิ่มเติม:</strong>
                      {getDataShow?.CMTN_Name}
                    </div>
                    <hr />
                    <div className="rec-row">
                      <strong>ผู้รายงานผล :</strong>
                      {getDataShow?.Form_Name_Inspector}
                    </div>

                    <div className="rec-row">
                      <strong>ตำแหน่ง :</strong>
                      {getDataShow?.Form_Name_Positon}
                    </div>

                    <div className="rec-row">
                      <strong>วัน/เวลาที่ รายงานผล :</strong>
                      {convertToThaiDate(getDataShow?.Form_date_inspertor)}
                    </div>

                    <div className="rec-row pt-2">
                      <strong>
                        รายงานผลการตรวจสอบข้อมูลเครดิต :{" "}
                        <button
                          className="btn-icon"
                          onClick={() =>
                            handleViewModel(getDataShow?.CTM_form_number)
                          }
                        >
                          <AiOutlineFileSearch />
                        </button>
                      </strong>
                      {/* {getDataShow?.CMTN_Name } */}
                    </div>
                  </div>
                </div>
              </div>
              {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}
              <div className="card recorder-card">
                <div className="card-title4" style={{ fontSize: "14px" }}>
                  ส่วนที่ 4 : เลือกสถานะการอนุมัติสินเชื่อ
                </div>

                <form className="approval-form">
                  <div className="form-group">
                    <label className="form-label">
                      ผลการอนุมัติสินเชื่อ <span className="required">*</span> :
                    </label>

                    <div className="radio-group">
                      <label className="radio-option mr-3">
                        <input
                          type="radio"
                          name="approval"
                          value="approved"
                          style={{ marginRight: 12 }}
                          checked={approval === "approved"}
                          onChange={() => setApproval("approved")}
                        />
                        <span className="custom-radio approved"></span>
                        ผ่านการอนุมัติ
                      </label>

                      <label className="radio-option">
                        <input
                          type="radio"
                          name="approval"
                          value="rejected"
                          style={{ marginRight: 12 }}
                          checked={approval === "rejected"}
                          onChange={() => setApproval("rejected")}
                        />
                        <span className="custom-radio rejected"></span>
                        ไม่ผ่านการอนุมัติ
                      </label>
                    </div>
                  </div>
                  {/* ✅ แสดงรายการเหตุผลเมื่อเลือก "ไม่ผ่าน" */}
                  {approval === "rejected" && (
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        background: "#f9fafc",
                        width: "fit-content",
                      }}
                    >
                      <p style={{ marginBottom: "6px", fontWeight: 600 }}>
                        โปรดเลือกเหตุผลที่ไม่ผ่าน * :
                      </p>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="1"
                          onChange={handleReasonChange}
                          checked={reasons.includes("1")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          1. เนื่องจากคุณสมบัติไม่ผ่านตามนโยบายของบริษัท
                        </span>
                      </label>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="2"
                          onChange={handleReasonChange}
                          checked={reasons.includes("2")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          2. เนื่องจากลูกค้ายกเลิกการขอสินเชื่อ
                        </span>
                      </label>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="3"
                          onChange={handleReasonChange}
                          checked={reasons.includes("3")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          3. เนื่องจาก ย้ายหน่วยทำสินเชื่อ
                        </span>
                      </label>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="4"
                          onChange={handleReasonChange}
                          checked={reasons.includes("4")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          4. เนื่องจากรายงาน ERROR / รายการไม่ถูกต้อง
                        </span>
                      </label>
                    </div>
                  )}

                  {/* ✅ ตรวจสอบผลลัพธ์ */}
                  {approval === "rejected" && reasons.length > 0 && (
                    <div style={{ marginTop: "6px" }}>
                      <strong>เหตุผลที่เลือก:</strong>
                      <ol
                        style={{
                          marginTop: "6px",
                          paddingLeft: "18px",
                          color: "#c03300ff",
                        }}
                      >
                        {reasons.map((r, i) => (
                          <li key={i} style={{ marginBottom: "4px" }}>
                            {reasonTextMap[r]}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* ✅ เลขที่สัญญา */}
                  {approval === "approved" && (
                    <div className="form-group">
                      <div className="form-sub">
                        <div className="form-group">
                          <label>เลขที่สัญญา</label>
                          <input
                            className="input-normal"
                            value={contractNumber}
                            onChange={(e) => setContractNumber(e.target.value)}
                          ></input>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* 🔹 Footer ปุ่มปิด */}
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {/* ปุ่มยกเลิก */}
              <button className="btn-cancel-modern" onClick={closePopup}>
                ยกเลิก
              </button>

              {/* ปุ่มส่งข้อมูล */}
              <button
                className="btn-submit-modern"
                style={{
                  background: "#1296a7", // เขียวเข้มสุภาพ
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 18px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onClick={handleSubmitReport}
              >
                <BsSend /> รายงานผล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalepersonView_Examination_Pass;
