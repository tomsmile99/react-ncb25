import React, { useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaCalendarAlt,
  FaFileExcel,
  FaSyncAlt,
  FaChartBar,
} from "react-icons/fa";

import { 
  FaCheckCircle, 
  FaClock, 
  FaSearch, 

} from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";


const reportNCBLiteDSR = () => {
  const [reportData, setReportData] = useState([]);

  const [dataRegion, setDataRegion] = useState([]);
  const [loading, setLoading] = useState(false);

  //ค้นข้อมูล
  const [regions, setRegions] = useState([]);
  const [belongs, setBelongs] = useState([]);
  const [regionId, setRegionId] = useState("");

  const [probationaryEmployees, setProbationaryEmployees] = useState([]);
  const [belongList, setBelongList] = useState([]);

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
  const [filters, setFilters] = useState({
    region: "",
    zone: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ เลือกภาค → ยิง API เขต
    if (name === "region") {
      setBelongList([]); // reset เขต

      if (!value) return;

      try {
        const { data } = await apiClient.get("/api/insurances/location", {
          params: { region_id: value },
        });

        const { status, sqlDataBelong } = data;

        if (status === 200) {
          setBelongList(sqlDataBelong);
          // console.log("belongList:", sqlDataBelong);
        }
        if (status === 400) {
          alert("เลือกภาค");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClear = () => {
    setReportData([]); // ✅ สำคัญมาก

    setFilters({
      region: "",
      zone: "",
      status: "",
      startDate: "",
      endDate: "",
    });

    // ล้างข้อมูลตาราง
  };

  const steps = ["ผู้รับรอง", "อนุมัติ", "รับทราบ"];

  const getActiveStep = (status) => {
    switch (status) {
      case "Lv0":
        return 0;
      case "Lv1":
        return 1;
      case "Lv2":
        return 2;
      case "Lv3":
        return 3;
      default:
        return 0;
    }
  };

  const formatThaiDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
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

  const formatThaiDateTime = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

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

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds} น.`;
  };

  const handleShowReport = async () => {
    try {
      setLoading(true);

      const { data } = await apiClient.get(
        "/api/insurances/exportExcelOutsideNcb",
        {
          params: {
            region_id: filters.region || "all",
            belong_id: filters.zone || "all",
            status: filters.status || "all",
            start_date: filters.startDate,
            end_date: filters.endDate,
            // monthSMS: hasMonth || null,
            // yearSMS: hasYear || null,
          },
        },
      );

      const { status, sqlDataCustomers } = data;

      if (status === 200) {
        // console.log(sqlDataCustomers);
        setReportData(sqlDataCustomers);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลรายงานได้",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderApprovalResult = (item) => {
    // 1️⃣ ถ้า Form_Approval_results ว่าง
    if (!item.Form_Approval_results) {
      if (item.Form_verification_status === "Lv0") {
        return "รอพิจารณา";
      }
      return "รอพิจารณา";
    }

    // 2️⃣ ถ้า Form_Approval_results มีค่า
    switch (item.Form_Approval_results) {
      case "approved":
        return "อนุมัติ";
      case "rejected":
        return "ไม่อนุมัติ";
      case "Cancel":
        return "ยกเลิกรายการ";
      default:
        return "รอพิจารณา";
    }
  };

  const handleExportExcel = async () => {
    const hasMonth = filters.monthSMS;
    const hasYear =
      filters.yearSMS && !isNaN(filters.yearSMS)
        ? Number(filters.yearSMS) - 543
        : null; //แปลงเป็น คศ
    try {
      const { data } = await apiClient.get(
        "/api/insurances/exportExcelOutsideNcb",
        {
          params: {
            region_id: filters.region || "all",
            belong_id: filters.zone || "all",
            status: filters.status || "all",
            start_date: filters.startDate,
            end_date: filters.endDate,
            monthSMS: hasMonth || null,
            yearSMS: hasYear || null,
          },
        },
      );

      if (data.status !== 200 || data.sqlDataCustomers.length === 0) {
        Swal.fire("แจ้งเตือน", "ไม่มีข้อมูลสำหรับ Export", "warning");
        return;
      }

      // 🔹 เพิ่มคอลัมน์ลำดับ
      const rows = data.sqlDataCustomers.map((item, index) => ({
        ลำดับ: index + 1,
        รหัสฟอร์มยื่นขอนอก: item.FormOutside_form_number ?? "-",
        ชื่อลูกค้า: item.FormOutside_customer_name ?? "-",
        วงเงินขอสินเชื่อ: item.FormOutside_credit_limit ?? "-",
        ประเภทลูกค้า: item.CMTN_Name ?? "-",
        ประเภทสินเชื่อ: item.LTNL_Name ?? "-",
        ผู้ขอสืบค้น: item.FormOutside_requester_name ?? "-",
        ตำแหน่ง: item.FormOutside_requester_position ?? "-",
        "สาขา/หน่วย": item.FormOutside_requester_branch ?? "-",
        เขต: item.FormOutside_requester_department,
        ภาค: item.FormOutside_requester_region ?? "-",
        "วัน/เวลาที่ยื่นแบบฟอร์ม":
          formatThaiDateTime(item.FormOutside_request_datetime) ?? "",

        "ชื่อ-นามสกุลผู้รับรอง": item.FormOutside_reviewer_name ?? "-",
        ตำแหน่งผู้รับรอง: item.FormOutside_reviewer_position ?? "-",
        สถานะการรับทราบ: item.FormOutside_review_status ?? "-",
        "วัน/เวลาการรับทราบ":
          formatThaiDateTime(item.FormOutside_review_datetime) ?? "",

        "ชื่อ-นามสกุลผู้อนุมัติ": item.FormOutside_approver_name ?? "-",
        ตำแหน่งผู้อนุมัติ: item.FormOutside_approver_position ?? "-",
        สถานะการอนุมัติ: item.FormOutside_approve_status ?? "-",
        "วัน/เวลาการอนุมัติ":
          formatThaiDateTime(item.FormOutside_approve_datetime) ?? "",

        "ชื่อ-นามสกุลผู้ตรวจสอบ": item.FormOutside_Ncb_name ?? "-",
        ตำแหน่งผู้ตรวจสอบ: item.FormOutside_Ncb_position ?? "-",
        สถานะการตรวจสอบ: item.FormOutside_Ncb_status ?? "-",
        "วัน/เวลาการตรวจสอบ":
          formatThaiDateTime(item.FormOutside_Ncb_datetime) ?? "",

        สถานะใบงาน: item.FormOutside_lv_status ?? "-",
        "ผู้สืบค้น (ผู้รายงานผล)": item.Form_Name_Inspector ?? "-",
        วันที่สร้างรายการ:
          formatThaiDateTime(item.FormOutside_created_at) ?? "",
        วันที่แก้ไข: formatThaiDateTime(item.FormOutside_updated_at) ?? "",
      }));

      // 🔹 สร้าง worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // 🔹 กำหนด style หัวตาราง (แถวที่ 1)
      const headerStyle = {
        font: { bold: true },
        fill: {
          fgColor: { rgb: "E9ECEF" }, // เทาอ่อน มาตรฐาน
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
        },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };

      // 🔹 apply style ให้ทุก cell ในแถว header
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // r:0 = แถวหัวตาราง
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = headerStyle;
        }
      }

      // 🔹 ปรับความกว้างคอลัมน์ (ดูเป็นมาตรฐาน)
      worksheet["!cols"] = [
        { wch: 6 }, // ลำดับ
        { wch: 24 }, // ชื่อ-นามสกุล
        { wch: 14 }, // ภาค
        { wch: 18 }, // เขต
        { wch: 16 }, // สถานะ
      ];

      // 🔹 สร้าง workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "รายงาน");

      // 🔹 export
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      saveAs(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `(RP) - รายงานทะเบียนขอสืบค้นข้อมูลเครดิต (วันที่ ${formatThaiDate(filters.startDate)}ถึงวันที่${formatThaiDate(filters.endDate)}).xlsx`,
      );
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถ Export Excel ได้", "error");
    }
  };

  const getYearOptions = () => {
    const currentYearBE = new Date().getFullYear() + 543;

    return Array.from({ length: 4 }, (_, i) => currentYearBE - i);
  };

  // useEffect(() => {
  //   handleShowReport();

  //   // Attendance();
  // }, []);

  return (
    <div className="filter-card">
      <div className="filter-row">
        <div className="filter-group">
          <label>ภาคธุรกิจ</label>
          <select name="region" value={filters.region} onChange={handleChange}>
            <option value="">- เลือกภาคธุรกิจ -</option>
            <option value="all">ทั้งหมด</option>
            <option value="1">ภาคธุรกิจที่ 1</option>
            <option value="2">ภาคธุรกิจที่ 2</option>
            <option value="3">ภาคธุรกิจที่ 3</option>
          </select>
        </div>

        <div className="filter-group">
          <label>เขต</label>
          <select
            name="zone"
            value={filters.zone}
            onChange={handleChange}
            disabled={!filters.region}
          >
            <option value="">- เลือกเขต -</option>
            <option value="all">ทั้งหมด</option>
            {belongList.map((item) => (
              <option key={item.belong_id} value={item.belong_id}>
                {item.belong}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="filter-group">
          <label>สถานะ</label>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">- เลือกสถานะ -</option>
            <option value="all">ทุกสถานะ</option>
            <option value="Lv1N">0N - ยกเลิกรายการ</option>
            <option value="Lv1">01 - ตรวจสอบแล้ว</option>
            <option value="rejected">2N - ไม่ผ่านการอนุมัติ</option>
            <option value="approved">2Y - ผ่านการอนุมัติ</option>
          </select>
        </div> */}

        <div className="filter-group">
          <label>เลือกวันที่</label>
          <div className="date-range">
            <div className="date-input">
              {/* <FaCalendarAlt className="icon" /> */}
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
              />
            </div>
            <span className="date-sep">ถึง</span>
            <div className="date-input">
              {/* <FaCalendarAlt className="icon" /> */}
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
          <label>
            เดือน / ปี{" "}
            <span style={{ color: "#ff8c00", fontWeight: "600" }}>
              หน้าบ้านรายงานผล
            </span>
          </label>

          <div className="date-range">
            {/* เดือน */}
            <select
              name="monthSMS"
              value={filters.monthSMS}
              onChange={handleChange}
            >
              <option value="">เลือกเดือน</option>
              {[
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
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            {/* ปี พ.ศ. */}
            <select
              name="yearSMS"
              value={filters.yearSMS}
              onChange={handleChange}
            >
              <option value="">เลือกปี</option>
              {getYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ปุ่มคำสั่ง */}
      <div className="filter-actions">
        <button
          className="btn"
          style={{
            backgroundColor: "#3056d2",
            color: "#fff",
            border: "none",
            borderRadius: "px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
          onClick={handleShowReport}
        >
          <FaChartBar /> แสดงรายงาน
        </button>
        <button
          className="btn"
          onClick={handleExportExcel}
          style={{
            backgroundColor: "#2f6b40ff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          <FaFileExcel /> Excel
        </button>
        <button
          className="btn"
          onClick={handleClear}
          style={{
            backgroundColor: "#ee4a3eff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          <FaSyncAlt /> Clear
        </button>
      </div>

      {/* แสดงข้อมูลตาราง */}

      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <div>กำลังโหลดข้อมูล...</div>
        ) : reportData.length === 0 ? (
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
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#f1f3f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
                fontSize: "22px",
              }}
            >
              📄
            </div>

            <div style={{ fontWeight: 600, marginBottom: "4px" }}>
              ไม่พบข้อมูล
            </div>

            <div style={{ fontSize: "14px", color: "#adb5bd" }}>
              กรุณาปรับเงื่อนไขการค้นหาแล้วลองใหม่อีกครั้ง
            </div>
          </div>
        ) : (
          <>
            {filters.startDate && filters.endDate && (
              <div className="report-title">
                รายงานสรุปผลการตรวจสอบเครดิตลูกค้า ตั้งแต่วันที่{" "}
                {formatThaiDate(filters.startDate)} ถึง{" "}
                {formatThaiDate(filters.endDate)}
              </div>
            )}

            <table className="table table-hover table-sm">
              <thead className="custom-buttonTBs">
                <tr>
                  <th className="text-center" style={{ width: "1%" }}>
                    ลำดับ
                  </th>
                  <th className="text-center" style={{ width: "12%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  {/* <th className="text" style={{ width: "10%" }}>
                    รหัสลูกค้า
                  </th> */}
                  <th className="text" style={{ width: "15%" }}>
                    ชื่อ-นามสกุล ลูกค้า
                  </th>

                  <th className="text" style={{ width: "15%" }}>
                    ชื่อ-นามสกุล พนักงาน
                  </th>
                  <th className="text" style={{ width: "13%" }}>
                    ตำแหน่ง
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    พื้นที่ปฏิบัติงาน
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    เขต
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    ภาคธุรกิจ
                  </th>

                  <th className="text" style={{ width: "5%" }}>
                    วัน / เวลา ที่ยื่นแบบฟอร์ม
                  </th>
                  {/* <th className="text" style={{ width: "5%" }}>
                    เอกสารประกอบ
                  </th> */}

                  {/* <th className="text-center" style={{ width: "5%" }}>
                    หนังสือรับรอง
                  </th> */}
                  <th className="text-center" style={{ width: "20%" }}>
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
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
                  reportData.map((item, index) => (
                    <tr
                      key={item.FormOutsideTable_id}
                      // className={`text${
                      //   item.FormOutsideTable_id ? " blink-row" : ""
                      // }`}
                    >
                      <td className="text-center">{index + 1}</td>

                      <td className="text-center">
                        {item.FormOutside_form_number || "-"}
                      </td>

                      <td>{item.FormOutside_customer_name}</td>

                      <td>{item.FormOutside_requester_name}</td>
                      <td>{item.FormOutside_requester_position}</td>
                      <td>{item.FormOutside_requester_branch}</td>
                      {/* PDF */}

                      <td>{item.FormOutside_requester_department}</td>
                      <td>ภาค {item.FormOutside_requester_region}</td>

                      <td>
                        <center>
                          {convertToThaiDate(item.FormOutside_created_at)}
                        </center>
                      </td>
                      {/* ปุ่มจัดการ */}
                      {/* <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          {item.FormOutside_form_number && (
                            <button
                              className="btn-icon"
                              onClick={() => handleView(item)}
                              title="บันทึกข้อความ"
                            >
                              <HiClipboardDocumentList />
                            </button>
                          )}
                        </div>
                      </td> */}
                      {/* สถานะเอกสาร */}
                      <td className="text-center">
                        <div
                          onClick={() => handleOpenModal(item)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            cursor: "pointer",
                            fontWeight: 500,
                            color:
                              item.FormOutside_lv_status === "Lv0"
                                ? "#6c757d" // เทา
                                : item.FormOutside_lv_status === "Lv1"
                                  ? "#eead3d" // เหลือง
                                  : item.FormOutside_lv_status === "Lv2"
                                    ? "#17a2b8" // ฟ้า
                                    : item.FormOutside_lv_status === "Lv3"
                                      ? "green" // เขียว
                                      : "black",
                          }}
                        >
                          {/* Lv0 */}
                          {item.FormOutside_lv_status === "Lv0" && (
                            <>
                              <FaRegCircleQuestion />
                              <span>รอการรับทราบ</span>
                            </>
                          )}

                          {/* Lv1 */}
                          {item.FormOutside_lv_status === "Lv1" && (
                            <>
                              <FaClock />
                              <span>รอการอนุมัติ</span>
                            </>
                          )}

                          {/* Lv2 */}
                          {item.FormOutside_lv_status === "Lv2" && (
                            <>
                              <FaSearch />
                              <span>รอการตรวจสอบ</span>
                            </>
                          )}

                          {/* Lv3 */}
                          {item.FormOutside_lv_status === "Lv3" && (
                            <>
                              <FaCheckCircle />
                              <span>ตรวจสอบแล้ว</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default reportNCBLiteDSR;
