import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import html2pdf from "html2pdf.js";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";

import { FaFileSignature } from "react-icons/fa";
import { Button } from "@mui/material";
import { BsSend } from "react-icons/bs";
import Pagination from "../../component/Pagination";

const SalepersonView_Examination = () => { 
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 50; // จำนวนรายการต่อหน้า

  const [query, setQuery] = useState(""); // ค้นหาชื่อ
  const [probationaryEmployees, setProbationaryEmployees] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // เก็บข้อมูลแถวที่คลิก
  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup

  const [approval, setApproval] = useState("");
  const [reasons, setReasons] = useState([]);

  const pdfRef = useRef();

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // ตั้งค่าหน้าปัจจุบัน
    getEmployeeDB_Admin(newPage); // ส่งค่าที่กรองทั้งหมดไปยัง ReadData
  };

  // คำนวณ start index
  const startIndex = (currentPage - 1) * limit;
  // ตัดข้อมูลเฉพาะหน้าปัจจุบัน
  const currentData = probationaryEmployees.slice(
    startIndex,
    startIndex + limit
  );

  const handleRefresh = () => {
    getEmployeeDB_Admin(); //
    setQuery("");
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

  // useEffect(() => {
  //   getEmployeeDB_Admin(currentPage, query);
  //   // Attendance();
  // }, [currentPage, query]);

  return (
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
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}></div>

          {/* ขวาสุด: ปุ่ม action */}
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
                <th className="text" style={{ width: "10%" }}>
                  เลขที่แบบฟอร์ม
                </th>
                <th className="text" style={{ width: "10%" }}>
                  ชื่อ-สกุลลูกค้า
                </th>
                <th className="text" style={{ width: "10%" }}>
                  เลขบัตรประชาชน
                </th>
                <th className="text" style={{ width: "10%" }}>
                  ผู้ขอสืบค้น
                </th>
                <th className="text" style={{ width: "10%" }}>
                  ตำแหน่ง
                </th>
                <th className="text" style={{ width: "10%" }}>
                  เบอร์โทร
                </th>
                {/* <th className="text" style={{ width: "10%" }}>
                  เขต
                </th>
                <th className="text" style={{ width: "5%" }}>
                  ภาค
                </th>  */}
                <th className="text" style={{ width: "10%" }}>
                  เอกสารประกอบ
                </th>
                <th className="text" style={{ width: "20%" }}>
                  วันที่/เวลา ที่ยื่นเรื่อง
                </th>
                <th className="text-center" style={{ width: "10%" }}>
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  formNo: "NCB-0001",
                  fullname: "สมชาย ใจดี",
                  cid: "1234567890123",
                  requester: "กมลชนก สุขดี",
                  position: "พนักงานสินเชื่อ",
                  tell: "0932283772",
                  branch: "สาขาอุตรดิตถ์",
                  zone: "เขตเหนือบน",
                  region: "ภาคเหนือ",
                  files: "2 รายการ",
                  datetime: "14/02/2025 09:41",
                  status: "รอตรวจสอบ",
                },
                {
                  formNo: "NCB-0002",
                  fullname: "วรรณา มากมี",
                  cid: "9876543210987",
                  requester: "พัชรี ทองแท้",
                  position: "ผู้จัดการสาขา",
                  tell: "0932283772",
                  branch: "สาขาพิษณุโลก",
                  zone: "เขตเหนือล่าง",
                  region: "ภาคเหนือ",
                  files: "1 รายการ",
                  datetime: "14/02/2025 09:50",
                  status: "ตรวจแล้ว",
                },
                {
                  formNo: "NCB-0003",
                  fullname: "ณัฐพล ตั้งใจ",
                  cid: "1101700199332",
                  requester: "ชุติมา อินทร",
                  position: "เจ้าหน้าที่สินเชื่อ",
                  tell: "0932283772",
                  branch: "สาขาเด่นชัย",
                  zone: "เขตเหนือบน",
                  region: "ภาคเหนือ",
                  files: "3 รายการ",
                  datetime: "14/02/2025 10:12",
                  status: "ยกเลิก",
                },

                ...Array.from({ length: 17 }).map((_, i) => ({
                  formNo: `NCB-${(i + 4).toString().padStart(4, "0")}`,
                  fullname: `ลูกค้าทดสอบ ${i + 1}`,
                  cid: `11017000000${i}`,
                  requester: `เจ้าหน้าที่ ${i + 1}`,
                  position: "เจ้าหน้าที่สินเชื่อ",
                  tell: "0932283772",
                  branch: `สาขา ${i + 1}`,
                  zone: "เขตกลาง",
                  region: "ภาคกลาง",
                  files: `${(i % 3) + 1} รายการ`,
                  datetime: `14/02/2025 1${i}:30`,
                  status:
                    i % 3 === 0
                      ? "รอตรวจสอบ"
                      : i % 3 === 1
                      ? "ตรวจแล้ว"
                      : "ยกเลิก",
                })),
              ].map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item.formNo}</td>
                  <td>{item.fullname}</td>
                  <td>{item.cid}</td>
                  <td>{item.requester}</td>
                  <td>{item.position}</td>
                  <td>{item.tell}</td>
                  {/* <td>{item.zone}</td>
                  <td>{item.region}</td>  */}
                  <td className="text">
                    <div className="gap-2">
                      <button
                        className="btn-icon"
                        onClick={() => handleView(item)}
                        title="หนังสือยินยอมเปิดเผยข้อมูล"
                      >
                        <AiOutlineFileSearch />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => handleDownload(item)}
                        title="ใบสมัครขอสินเชื่อ"
                      >
                        <LuNotebookPen />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(item)}
                        title="สำเนาหลักฐาน"
                      >
                        <FaRegAddressCard />
                      </button>
                    </div>
                  </td>

                  <td>{item.datetime}</td>
                  <td className="text-center">
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
                  </td>
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
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div style={{ height: "500px" }}></div>
        )}
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

export default SalepersonView_Examination;
