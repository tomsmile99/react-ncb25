import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import html2pdf from "html2pdf.js";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BsFiletypeDoc } from "react-icons/bs";
import { jsPDF } from "jspdf";
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

const AdminSetData_Refuse = () => {
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 50; // จำนวนรายการต่อหน้า

  const [query, setQuery] = useState(""); // ค้นหาชื่อ

  const [approval, setApproval] = useState([]); // Object to group by section ID
  const [approvaltest, setApprovaltest] = useState([]); // Object to group by section ID

  const [probationaryEmployees, setProbationaryEmployees] = useState([]); // Object to group by section ID

  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup
  const [selectedItem, setSelectedItem] = useState(""); // เก็บข้อมูลแถวที่คลิก

  const getEmployeeDB_Admin = async (currentPage, searchQuery) => {
    const params = {
      page: currentPage, // หมายเลขหน้าปัจจุบัน
      limit, // จำนวนรายการต่อหน้า
      // query: searchQuery, // คำค้นหา
    };

    try { 
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_Admin`,
        {
          params,
        }
      );

      const { status, sqlDataCustomers, totalPages } = data;
      if (status) {
        setProbationaryEmployees(sqlDataCustomers);
        console.log(sqlDataCustomers);
        setTotalPages(totalPages); // ตั้งค่าจำนวนหน้าทั้งหมด
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleStatusClick = (item) => { 
    setSelectedItem(item);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handleReasonChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setReasons([...reasons, value]);
    } else {
      setReasons(reasons.filter((r) => r !== value));
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

  // useEffect(() => {
  //   getEmployeeDB_Admin(currentPage, query);
  //   // Attendance();
  // }, [currentPage, query]);

  useEffect(() => {
    getEmployeeDB_Admin(currentPage);

    // apiClient
    //   .get("/api/insurances/datacustomers")
    //   .then((response) => {
    //     console.log(response.data);
    //     setApprovaltest(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("API Error:", error);
    //   });
  }, [currentPage]);

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-4 col-sm-12">
          <div
            className="card-dashboard p-3 shadow-sm d-flex align-items-center"
            style={{ backgroundColor: "#F5F7FF" }}
          >
            <img
              src="/Checklist-amico.png"
              className="brand-image"
              style={{ height: 80, width: "auto" }}
            />
            <div style={{ marginLeft: "12px" }}>
              {" "}
              {/* 👈 เพิ่มตรงนี้ */}
              <p className="title">รอตรวจสอบ</p>
              <p className="value">ทั้งหมด 12 รายการ</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-12">
          <div
            className="card-dashboard p-3 shadow-sm d-flex align-items-center"
            style={{ backgroundColor: "#F5F7FF" }}
          >
            <img
              src="/Insurance-amico (1).png"
              className="brand-image"
              style={{ height: 80, width: "auto" }}
            />
            <div style={{ marginLeft: "12px" }}>
              {" "}
              {/* 👈 เพิ่มตรงนี้ */}
              <p className="title">ตรวจสอบแล้ว</p>
              <p className="value">ทั้งหมด 40 รายการ</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-12">
          <div
            className="card-dashboard p-3 shadow-sm d-flex align-items-center"
            style={{ backgroundColor: "#F5F7FF" }}
          >
            <img
              src="/Cancel-bro.png"
              className="brand-image"
              style={{ height: 80, width: "auto" }}
            />
            <div style={{ marginLeft: "12px" }}>
              {" "}
              {/* 👈 เพิ่มตรงนี้ */}
              <p className="title">ยกเลิกรายการตรวจสอบ</p>
              <p className="value">ทั้งหมด 180 รายการ</p>
            </div>
          </div>
        </div>
      </div>
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
              <div>
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
                  <th className="text" style={{ width: "10%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    ชื่อ-สกุลลูกค้า
                  </th>
                  <th className="text" style={{ width: "8%" }}>
                    เลขบัตรประชาชน
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    ผู้ขอสืบค้น
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    ตำแหน่ง
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    สาขา/หน่วย
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    เขต
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    ภาค
                  </th>
                  
                  <th className="text" style={{ width: "10%" }}>
                    เอกสารประกอบ
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    วันที่/เวลา ที่ยื่นเรื่อง
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    ผู้ตรวจสอบ
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    วัน/เวลา ที่ตรวจสอบ
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    DSR
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    ออกหนังสือ
                  </th>
                  <th className="text" style={{ width: "20%" }}>
                    สถานะ
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    แก้ไข
                  </th>
                </tr>
              </thead>
              <tbody>
                {probationaryEmployees.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.CTM_form_number}</td>
                    <td>
                      {item.CTM_title_name}
                      {item.CTM_firstname} {item.CTM_lastname}
                    </td>
                    <td>{item.CTM_citizen_id}</td>
                    <td>{item.CTM_recorder_fullname}</td>
                    <td>{item.CTM_position}</td>
                    <td>{item.CTM_branch}</td>
                    <td>{item.belong}</td>

                    <td>{item.region}</td>
                    {/* <td>{item.CTM_business_region}</td> */}
                    <td className="text-center">
                      <button
                        className="btn-icon"
                        onClick={() =>
                          openImageBase64AsPDF(item.Form_consent_document)
                        }
                        title="หนังสือยินยอมเปิดเผยข้อมูล"
                      >
                        <BsFiletypeDoc />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() =>
                          openImageBase64AsPDF(item.Form_application_document)
                        }
                        title="แบบฟอร์มคำขอ"
                      >
                        <BsFiletypeDoc />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() =>
                          openImageBase64AsPDF(item.Form_idcard_photo)
                        }
                        title="รูปบัตรประชาชน"
                      >
                        <BsFiletypeDoc />
                      </button>
                    </td>
                      <td>{convertToThaiDate(item.Form_date_inspertor)}</td>
                    {/* <td>{item.Form_Inspector}</td> */}
                       <td>-</td>
                         <td>{item.Form_Name_Inspector}</td>
                  
                 
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn-icon"
                          onClick={() => handleView(item)}
                        >
                          <AiOutlineFileSearch />
                        </button>
                      </div>
                    </td>
                    

                    <td>
                      <center>-</center>
                    </td>
                    <td className="text-center">
                      <center>
                        {item.status === "รอตรวจสอบ" && (
                          <span
                            className="status-badge status-wait"
                            onClick={() => handleStatusClick(item)}
                            style={{ cursor: "pointer" }}
                          >
                            รอตรวจสอบ
                          </span>
                        )}
                        {item.status === "ตรวจแล้ว" && (
                          <span
                            className="status-badge status-pass"
                            onClick={() => handleStatusClick(item)}
                            style={{ cursor: "pointer" }}
                          >
                            ตรวจแล้ว
                          </span>
                        )}
                        {item.status === "ยกเลิก" && (
                          <span
                            className="status-badge status-cancel"
                            onClick={() => handleStatusClick(item)}
                            style={{ cursor: "pointer" }}
                          >
                            ยกเลิก
                          </span>
                        )}
                      </center>
                    </td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 ? (
            <div className="card-footer clearfix">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                // onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div style={{ height: "500px" }}></div>
          )}
        </div>
      </div>

      {/* 🔹 Popup แสดงข้อมูล */}
      {showPopup && selectedItem && (
        <div className="modal-overlay1">
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
                    <div className="rec-row">
                      <strong>แบบฟอร์มเลขที่ :</strong>
                      {/* <span>{recorder.fullname}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>ผู้ขอสืบค้น :</strong>
                      {/* <span>{recorder.position}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>ตำแหน่ง :</strong>
                      {/* <span>{recorder.branch}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>สาขา/หน่วย :</strong>
                      {/* <span>{recorder.zone}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>วัน/เวลาที่ ยื่นขอสืบค้น :</strong>
                      {/* <span>{recorder.region}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>เอกสารประกอบ :</strong>
                      {/* <span>{recorder.date}</span> */}
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
                    <div className="rec-row">
                      <strong>ชื่อ - นามสกุลลูกค้า :</strong>
                      {/* <span>{recorder.fullname}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>วัน/เดือน/ปีเกิด :</strong>
                      {/* <span>{recorder.position}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>หมายเลขบัตรประชาชน :</strong>
                      {/* <span>{recorder.branch}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>หมายเลขโทรศัพท์ :</strong>
                      {/* <span>{recorder.zone}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>ประเภทสินเชื่อที่ลูกค้าสมัคร :</strong>
                      {/* <span>{recorder.region}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>วงเงินขอสินเชื่อ :</strong>
                      {/* <span>{recorder.date}</span> */}
                    </div>
                    <div className="rec-row">
                      <strong>ประเภทลูกค้า :</strong>
                      {/* <span>{recorder.date}</span> */}
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
                      {/* <span>{recorder.fullname}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>รายละเอียดเพิ่มเติม:</strong>
                      {/* <span>{recorder.position}</span> */}
                    </div>
                    <hr />
                    <div className="rec-row">
                      <strong>ผู้รายงานผล :</strong>
                      {/* <span>{recorder.branch}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>ตำแหน่ง :</strong>
                      {/* <span>{recorder.zone}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>วัน/เวลาที่ รายงานผล :</strong>
                      {/* <span>{recorder.region}</span> */}
                    </div>

                    <div className="rec-row">
                      <strong>รายงานผลการตรวจสอบข้อมูลเครดิต :</strong>
                      {/* <span>{recorder.date}</span> */}
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
                        โปรดเลือกเหตุผลที่ไม่ผ่าน:
                      </p>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="คุณสมบัติไม่ผ่านตามนโยบาย"
                          onChange={handleReasonChange}
                          checked={reasons.includes(
                            "คุณสมบัติไม่ผ่านตามนโยบาย"
                          )}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          1. เนื่องจากคุณสมบัติไม่ผ่านตามนโยบายของบริษัท
                        </span>
                      </label>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="ลูกค้ายกเลิกการขอสินเชื่อ"
                          onChange={handleReasonChange}
                          checked={reasons.includes(
                            "ลูกค้ายกเลิกการขอสินเชื่อ"
                          )}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          2. เนื่องจากลูกค้ายกเลิกการขอสินเชื่อ
                        </span>
                      </label>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="ข้อมูลผิดพลาดหรือ ERROR"
                          onChange={handleReasonChange}
                          checked={reasons.includes("ข้อมูลผิดพลาดหรือ ERROR")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          3. เนื่องจากรายงาน ERROR / รายการไม่ถูกต้อง
                        </span>
                      </label>
                    </div>
                  )}

                  {/* ✅ ตรวจสอบผลลัพธ์ */}
                  {approval && (
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "14px",
                        color: "#333",
                      }}
                    >
                      <strong>สถานะ: </strong>
                      <span
                        style={{
                          color: approval === "approved" ? "green" : "red",
                          fontWeight: "600",
                        }}
                      >
                        {approval === "approved" ? "ผ่าน" : "ไม่ผ่านการอนุมัติ"}
                      </span>

                      {approval === "rejected" && reasons.length > 0 && (
                        <div style={{ marginTop: "4px" }}>
                          <strong>เหตุผลที่เลือก:</strong>{" "}
                          {reasons.map((r, i) => (
                            <span style={{ color: "#c03300ff" }} key={i}>
                              {r}
                              {i < reasons.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ✅ เลขที่สัญญา */}
                  <div className="form-group">
                    <label className="form-label">
                      เลขที่สัญญา <span className="required">*</span> :
                    </label>
                    <input
                      type="text"
                      className="input-box"
                      placeholder="กรอกเลขที่สัญญา"
                      // value={contractNo}
                      // onChange={(e) => setContractNo(e.target.value)}
                    />
                  </div>
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
                // onClick={handleSubmit}
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

export default AdminSetData_Refuse;
