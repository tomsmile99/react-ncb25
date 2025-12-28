import React, { useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import Pagination from "../../component/Pagination";
import { Card } from "react-bootstrap";
import {
  AiOutlineFileSearch,
} from "react-icons/ai";
import { BsFiletypeDoc } from "react-icons/bs";
import { jsPDF } from "jspdf";

const limit = 50;

const convertToThaiDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const thaiMonths = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ];
  return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
};

function AdminFinal_reporttable() {
  /* ===================== STATE ===================== */
  const [probationaryEmployees, setProbationaryEmployees] = useState([]);
  const [filters, setFilters] = useState({
    region: "",
    zone: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /* ===================== HANDLE ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /* ===================== FETCH ===================== */
  const fetchData = async (page = 1, customFilters = filters) => {
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_Fanel",
        {
          params: {
            _page: page,
            _limit: limit,
            region: customFilters.region,
            zone: customFilters.zone,
            status: customFilters.status,
            startDate: customFilters.startDate,
            endDate: customFilters.endDate,
          },
        }
      );

      if (data.status) {
        setProbationaryEmployees(data.sqlDataCustomers);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("fetch error:", err);
    }
  };

  /* ===================== BUTTON ACTION ===================== */
  const handleShowData = () => {
    setCurrentPage(1);
    fetchData(1, filters);
  };

  const handleResetFilters = () => {
    const reset = {
      region: "",
      zone: "",
      status: "",
      startDate: "",
      endDate: "",
    };
    setFilters(reset);
    setCurrentPage(1);
    fetchData(1, reset);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* ===================== PAGINATION EFFECT ===================== */
  useEffect(() => {
    fetchData(currentPage, filters);
  }, [currentPage]);

  /* ===================== PDF ===================== */
  const openImageBase64AsPDF = (base64) => {
    if (!base64) return alert("ไม่พบไฟล์");
    const pdf = new jsPDF("p", "px", "a4");
    pdf.addImage(base64, "PNG", 20, 20, 400, 550);
    window.open(URL.createObjectURL(pdf.output("blob")));
  };

  const handleView = (item) => {
    window.open(
      `${window.location.origin}/DataReportDSRs/${item.CTM_form_number}`,
      "_blank"
    );
  };

  /* ===================== RENDER ===================== */
  return (
    <Card className="p-3 shadow-sm">
      {/* ================= FILTER ================= */}
      <div className="filter-row">
          <label>ค้นหาข้อมูล :</label>
          <div className="filter-group">
            {/* <label>ภาคธุรกิจ</label> */}
            <select
              name="region"
              value={filters.region}
              onChange={handleChange}
            >
              <option value="">- เลือกเขต-</option>
              <option>เหนือ</option>
              <option>กลาง</option>
              <option>ใต้</option>
              <option>อีสาน</option>
            </select>
          </div>
          <div>
            {/* <label>เขตธุรกิจ</label> */}
            <select name="zone" value={filters.zone} onChange={handleChange}>
              <option value="">- เลือกเขตธุรกิจ -</option>
              <option>เขต 1</option>
              <option>เขต 2</option>
              <option>เขต 3</option>
            </select>
          </div>
          {/* 🔹 ปุ่มแสดงข้อมูลและยกเลิก */}
          <div
            className="filter-buttons"
            style={{ display: "flex", gap: "6px", marginLeft: "8px" }}
          >
            <button
              className="btn-show"
              type="button"
              onClick={handleShowData}
              style={{
                backgroundColor: "#3056d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              แสดงข้อมูล
            </button>
            <button
              className="btn-cancel"
              type="button"
              onClick={handleResetFilters}
              style={{
                backgroundColor: "#d9d9d9",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              ยกเลิก
            </button>
          </div>
          <br />
          <label>เลือกวันที่ :</label>
          <div className="filter-group">
            {/* <label>สถานะ</label> */}
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">- เลือกสถานะ -</option>
              <option>รอตรวจสอบ</option>
              <option>ตรวจแล้ว</option>
              <option>ยกเลิก</option>
            </select>
          </div>
          <div className="filter-group">
            {/* <label>เลือกวันที่</label> */}
            <div className="date-range">
              <div className="date-input">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                />
              </div>
              <span className="date-sep">ถึง</span>
              <div className="date-input">
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

      {/* ================= TABLE ================= */}
     <div className="table-responsive pt-3">
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
                  ชื่อ-นามสกุล ลูกค้า
                </th>
                <th className="text" style={{ width: "5%" }}>
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

                <th className="text" style={{ width: "20%" }}>
                  สถานะ
                </th>
                <th className="text-center" style={{ width: "10%" }}>
                  แก้ไข / รหัสสัญญา
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
                  <td>{convertToThaiDate(item.date_upEvidence)}</td>
                  {/* <td>{item.Form_Inspector}</td> */}

                  <td>{item.Form_Name_Inspector}</td>
                  <td>{convertToThaiDate(item.Form_date_inspertor)}</td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {item.Form_Approval_results !== "Cancel" && (
                        <button
                          className="btn-icon"
                          onClick={() => handleView(item)}
                        >
                          <AiOutlineFileSearch />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="text-center">
                    <center>
                      {item.Form_Approval_results === "approved" && (
                        <span
                          className="status-badge status-pass"
                          onClick={() => handleStatusClick(item)}
                          style={{ cursor: "pointer" }}
                        >
                          2Y-ผ่านการอนุมัติสินเชื่อ
                        </span>
                      )}
                      {item.Form_Approval_results === "rejected" && (
                        <span
                          className="status-badge status-fail"
                          onClick={() => handleStatusClick(item)}
                          style={{ cursor: "pointer" }}
                        >
                          2N-ไม่ผ่านการอนุมัติสินเชื่อ
                        </span>
                      )}
                      {item.Form_Approval_results === "Cancel" && (
                        <span
                          className="status-badge status-cancel"
                          onClick={() => handleStatusClick(item)}
                          style={{ cursor: "pointer" }}
                        >
                          1N-ยกเลิกรายการ
                        </span>
                      )}
                    </center>
                  </td>
                  <td>
                    <center>{item.Form_Contract_number || "-"}</center>
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

    </Card>
  );
}

export default AdminFinal_reporttable;
