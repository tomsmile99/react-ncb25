import React, { useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import Pagination from "../../component/Pagination";
import { Card } from "react-bootstrap";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BsFiletypeDoc } from "react-icons/bs";
import { jsPDF } from "jspdf";

const limit = 50;

const convertToThaiDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
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
  return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${
    date.getFullYear() + 543
  }`;
};

function AdminFinal_reporttable() {
  /* ===================== STATE ===================== */
  const [probationaryEmployees, setProbationaryEmployees] = useState([]);

  //ค้นหา
  const [searchType, setSearchType] = useState("");
  const [keyword, setKeyword] = useState("");
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
  const fetchData = async (
    page = 1,
    customFilters = filters,
    customSearchType = searchType,
    customKeyword = keyword
  ) => {
    try {
      const params = {
        _page: page,
        _limit: limit,

        // 🔍 search
        ...(customSearchType &&
          customKeyword && {
            searchType: customSearchType,
            keyword: customKeyword,
          }),

        // 📅 วันที่
        ...(customFilters.startDate && {
          startDate: customFilters.startDate,
        }),
        ...(customFilters.endDate && {
          endDate: customFilters.endDate,
        }),

        // 📌 สถานะ
        ...(customFilters.status && {
          status: customFilters.status,
        }),
      };

      // console.log("📤 params ส่งไป API:", params);

      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_Fanel",
        { params }
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
    // 🔍 บังคับกรอก keyword เฉพาะบางประเภท
    if (
      (searchType === "fullname" || searchType === "citizen_id") &&
      !keyword.trim()
    ) {
      alert("กรุณากรอกข้อมูลค้นหา");
      return;
    }

    // ✅ กรณีอื่น ๆ (region / date / status)
    // ไม่ต้องเช็ค keyword

    console.log("🔍 ค้นหา:", {
      searchType,
      keyword,
      filters,
    });

    setCurrentPage(1);
    fetchData(1, filters, searchType, keyword);
  };

  const handleResetFilters = () => {
    const reset = {
      region: "",
      zone: "",
      status: "",
      startDate: "",
      endDate: "",
    };

    setSearchType(""); //เซตช่องค้นหาเป็นค่าว่าง
    setFilters(reset);
    setCurrentPage(1);
    fetchData(1, reset);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* ===================== PAGINATION EFFECT ===================== */
  useEffect(() => {
    fetchData(currentPage, filters, searchType, keyword);
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
            className="form-select"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setKeyword(""); // รีค่าเมื่อเปลี่ยนประเภท
            }}
          >
            <option value="">-- เลือกประเภทการค้นหา --</option>
            <option value="fullname">ชื่อ - นามสกุลลูกค้า</option>
            <option value="citizen_id">หมายเลขบัตรประชาชนลูกค้า</option>
            <option value="branch">สาขา / หน่วย</option>
            <option value="zone">เขต</option>
            <option value="region">ภาค</option>
          </select>
        </div>
        <div>
          {/* <label>เขตธุรกิจ</label> */}
          {searchType === "fullname" && (
            <input
              type="text"
              className="form-control"
              placeholder="- กรอกชื่อ - นามสกุล ลูกค้า -"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          )}

          {searchType === "citizen_id" && (
            <input
              type="text"
              className="form-control"
              placeholder="- กรอกหมายเลขบัตรประชาชนลูกค้า -"
              maxLength={13}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          )}
          {searchType === "branch" && (
            <select
              className="form-select"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            >
              <option value="">- เลือก สาขา / หน่วย -</option>
              <option value="A01">สาขา A01</option>
              <option value="A02">สาขา A02</option>
            </select>
          )}

          {searchType === "zone" && (
            <select
              className="form-select"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            >
              <option value="">- เลือก เขต -</option>
              <option value="Z1">เขต 1</option>
              <option value="Z2">เขต 2</option>
            </select>
          )}

          {searchType === "region" && (
            <select
              className="form-select"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            >
              <option value="">- เลือก ภาคธุรกิจ -</option>
              <option value="1">ภาคธุรกิจที่ 1</option>
              <option value="2">ภาคธุรกิจที่ 2</option>
              <option value="3">ภาคธุรกิจที่ 3</option>
              <option value="4">ภาคธุรกิจที่ 4</option>
              <option value="5">ภาคธุรกิจที่ 5</option>
            </select>
          )}
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

        {searchType !== "fullname" && searchType !== "citizen_id" && (
          <>
            <label>เลือกวันที่ :</label>
            <div className="filter-group">
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

            <div className="filter-group">
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
              >
                <option value="">- เลือกสถานะ -</option>
                <option value="approved">2Y ผ่านการอนุมัติสินเชื่อ</option>
                <option value="rejected">2N ไม่ผ่านการอนุมัติสินเชื่อ</option>
                <option value="Cancel">1N ยกเลิกรายการตรวจสอบ</option>
              </select>
            </div>
          </>
        )}
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
                    onClick={() => openImageBase64AsPDF(item.Form_idcard_photo)}
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
