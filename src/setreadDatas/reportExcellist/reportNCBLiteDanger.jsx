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

const reportNCBLiteDanger = () => {
  const [reportData, setReportData] = useState([]);

  const [dataRegion, setDataRegion] = useState([]);
  const [loading, setLoading] = useState(false);

  //ค้นข้อมูล
  const [regions, setRegions] = useState([]);
  const [belongs, setBelongs] = useState([]);
  const [regionId, setRegionId] = useState("");

  const [filters, setFilters] = useState({
    region: "",
    zone: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [belongList, setBelongList] = useState([]);

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

  const getActionTime = (start, end) => {
    if (!start || !end) return "-";

    const startDate = new Date(start);
    const endDate = new Date(end);

    // กรณีข้อมูลผิด (เวลา end น้อยกว่า start)
    if (endDate < startDate) return "-";

    let diffMs = endDate - startDate; // ต่างกันเป็น ms

    const seconds = Math.floor(diffMs / 1000) % 60;
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const pad = (n) => String(n).padStart(2, "0");

    if (days > 0) {
      return `${days} วัน ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleShowReport = async () => {
    const hasMonth = filters.monthSMS;
    const hasYear =
      filters.yearSMS && !isNaN(filters.yearSMS)
        ? Number(filters.yearSMS) - 543
        : null; //แปลงเป็น คศ

    // 1️⃣ ตรวจภาค
    if (!filters.region && !hasMonth && !hasYear) {
      await Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณาเลือกภาคธุรกิจ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // 2️⃣ ตรวจเขต
    if (!filters.zone && !hasMonth && !hasYear) {
      await Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณาเลือกเขต",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // 3️⃣ ตรวจสถานะ
    // if (!filters.status && !hasMonth && !hasYear) {
    //   await Swal.fire({
    //     icon: "warning",
    //     title: "แจ้งเตือน",
    //     text: "กรุณาเลือกสถานะ",
    //     confirmButtonText: "ตกลง",
    //   });
    //   return;
    // }

    // 4️⃣ ตรวจวันที่เริ่ม
    // if (!filters.startDate && !hasMonth && !hasYear) {
    //   await Swal.fire({
    //     icon: "warning",
    //     title: "แจ้งเตือน",
    //     text: "กรุณาเลือกวันที่เริ่มต้น",
    //     confirmButtonText: "ตกลง",
    //   });
    //   return;
    // }

    // 5️⃣ ตรวจวันที่สิ้นสุด
    // if (!filters.endDate && !hasMonth && !hasYear) {
    //   await Swal.fire({
    //     icon: "warning",
    //     title: "แจ้งเตือน",
    //     text: "กรุณาเลือกวันที่สิ้นสุด",
    //     confirmButtonText: "ตกลง",
    //   });
    //   return;
    // }

    // 6️⃣ ตรวจช่วงวันที่ (กันเลือกสลับ)
    // if (filters.startDate > filters.endDate) {
    //   await Swal.fire({
    //     icon: "warning",
    //     title: "แจ้งเตือน",
    //     text: "วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด",
    //     confirmButtonText: "ตกลง",
    //   });
    //   return;
    // }

    // ✅ ผ่านทุกเงื่อนไข → ยิง API
    try {
      setLoading(true);

      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_AdminReportExcelDanger",
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

      const { status, sqlDataCustomers } = data;

      if (status === 200) {
        console.log(sqlDataCustomers);
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
        "/api/insurances/datacustomers_AdminReportExcelDanger",
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
      const rows = data.sqlDataCustomers.map((item, index) => {
        // แยกข้อมูลออกจาก |
        const reasons = item.credit_reason_all
          ? item.credit_reason_all.split("|")
          : [];

        return {
          ลำดับ: index + 1,

          // "วัน/เวลา ที่รับ Consent":
          //   formatThaiDateTime(item.date_upEvidence) ?? "",

          // "วัน/เวลา รายงานผล":
          //   formatThaiDateTime(item.Form_date_inspertor) ?? "",

          // "Action Time": getActionTime(
          //   item.date_upEvidence,
          //   item.Form_date_inspertor,
          // ),

          "ชื่อ-นามสกุล ลูกค้า": `${item.CTM_title_name ?? ""}${item.CTM_firstname ?? ""} ${item.CTM_lastname ?? ""}`,

          "วัน/เดือน/ปี เกิด": formatThaiDate(item.CTM_birthdate) ?? "-",

          หมายเลขโทรศัพท์: item.CTM_phone ?? "-",

          เลขที่บัตรประชาชน: item.CTM_citizen_id ?? "-",

          ผู้ขอสืบค้น: item.CTM_recorder_fullname ?? "-",

          "สาขา/หน่วย": item.CTM_business_zone ?? "-",

          เขต: item.CTM_branch,

          ภาค: item.CTM_business_region ?? "-",

          เลขที่อ้างอิง: item.CTM_form_number ?? "-",

          "ผู้สืบค้น (ผู้รายงานผล)": item.Form_Name_Inspector ?? "-",

          ประเภทลูกค้า: item.CMTN_Name ?? "-",

          ประเภทสินเชื่อ: item.LTNL_Name ?? "-",

          วงเงินขอสินเชื่อ: item.Form_loan_amount ?? "-",

          คะแนนเครดิต: item.SCORE_credit_score ?? "-",

          "คุณสู้ เราช่วย":
            item.SCORE_project_status === "y" ? "เข้าร่วม" : "ไม่เข้าร่วม",

          บุคคลล้มละลาย:
            item.SCORE_project_status === "yes" ? "เป็น" : "ไม่เป็น",

          ผลการพิจารณาการให้สินเชื่อ: renderApprovalResult(item),

          ระดับคะแนนเครดิต: item.SCORE_credit_level ?? "-",

          ความน่าจะเป็นในการชำระหนี้: item.SCORE_payment_behavior ?? "-",

          เปอร์เซ็นต์การชำระหนี้: item.SCORE_percent_behavior ?? "-",

          ผลการตรวจสอบเครดิต: item.SCORE_credit_check_result ?? "-",

          ระดับความเสี่ยง: item.SCORE_Risk ?? "-",

          เลขที่สัญญา: item.Form_Contract_number ?? "-",

          การแก้ไขข้อมูล: item.Form_status_Edit === "1" ? "มี" : "",

          รายละเอียดการแก้ไข: item.SCORE_additional_fee_Edit ?? "-",

          หมายเหตุ: item.SCORE_additional_fee ?? "-",

          หมายเหตุการขอยกเลิก: item.Form_note_approval ?? "-",

          "สถานะการส่ง SMS": item.Form_status_SMS ?? "-",

          วันที่รายงานผล:
            formatThaiDateTime(item.Form_verification_date) ?? "-",

          "เลขอ้างอิง SMS": item.Form_id_SMS ?? "-",

          เลขพัสดุ: item.consentTruck_Number ?? "-",

          ชืื่อขนส่ง: item.consentTruck_Namepost_office ?? "-",

          // ✅ แตกหลายคอลัมน์
          "สถานะบัญชี 1": reasons[0] ?? "-",
          "สถานะบัญชี 2": reasons[1] ?? "-",
          "สถานะบัญชี 3": reasons[2] ?? "-",
          "สถานะบัญชี 4": reasons[3] ?? "-",
          "สถานะบัญชี 5": reasons[4] ?? "-",
        };
      });
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
            {/* <option value="4">ภาคธุรกิจที่ 4</option>
            <option value="5">ภาคธุรกิจที่ 5</option> */}
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
{/* 
        <div className="filter-group">
          <label>
            เดือน / ปี{" "}
            <span style={{ color: "#ff8c00", fontWeight: "600" }}>
              หน้าบ้านรายงานผล
            </span>
          </label>

          <div className="date-range">
          
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
        </div> */}
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
                  <th className="text-center" style={{ width: "3%" }}>
                    ลำดับ
                  </th>

                  <th className="text" style={{ width: "8%" }}>
                    เลขที่อ้างอิง
                  </th>

                  <th className="text" style={{ width: "8%" }}>
                    วันที่สืบค้น
                  </th>

                  <th className="text" style={{ width: "14%" }}>
                    ชื่อ-นาม สกุลลูกค้า
                  </th>

                  <th className="text" style={{ width: "12%" }}>
                    ผู้ขอสืบค้น
                  </th>

                  <th className="text" style={{ width: "10%" }}>
                    สาขา/หน่วย
                  </th>

                  <th className="text-center" style={{ width: "4%" }}>
                    เขต
                  </th>

                  <th className="text-center" style={{ width: "4%" }}>
                    ภาค
                  </th>

                  <th className="text" style={{ width: "10%" }}>
                    ประเภทสินเชื่อ
                  </th>

                  <th className="text-end" style={{ width: "7%" }}>
                    วงเงินขอสินเชื่อ
                  </th>

                  <th className="text-center" style={{ width: "5%" }}>
                    คะแนนเครดิต
                  </th>

                  <th className="text-center" style={{ width: "6%" }}>
                    ระดับคะแนนเครดิต
                  </th>

                  <th className="text-center" style={{ width: "7%" }}>
                    ความน่าจะเป็น
                  </th>

                  <th className="text-center" style={{ width: "10%" }}>
                    สถานะ
                  </th>

                  {/* <th className="text" style={{ width: "10%" }}>
                    เลขที่สัญญา
                  </th> */}
                  {/* <th className="text" style={{ width: "10%" }}>
                    เลขพัสดุ
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.CTM_form_number}</td>
                    <td>{formatThaiDate(item.date_upEvidence)}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                        {item.CTM_title_name}
                        {item.CTM_firstname} {item.CTM_lastname}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                      </div>
                      {/* <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                   วัน/เดือน/ปี เกิด:{" "}
                                   {formatThaiDate(item.CTM_birthdate)}
                                 </div>
                                 <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                   เบอร์โทร : {item.CTM_phone || "-"}
                                 </div> */}
                    </td>

                    <td>
                      <div>{item.CTM_recorder_fullname}</div>
                      {/* <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        ตำแหน่ง: {item.CTM_position || "-"}
                      </div> */}
                      {/* <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        สาขา/หน่วย: {item.CTM_branch || "-"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        เขต: {item.belong || "-"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        ภาค: {item.region || "-"}
                      </div> */}
                    </td>
                    <td>{item.CTM_business_zone}</td>
                    <td>{item.CTM_branch}</td>
                    <td>{item.CTM_business_region}</td>
                    <td>{item.LTNL_Name}</td>

                    <td>
                      {item.Form_loan_amount
                        ? `${Number(item.Form_loan_amount).toLocaleString(
                            "th-TH",
                          )} บาท`
                        : "-"}
                    </td>
                    <td className="text-center">
                      {item.SCORE_credit_score || "-"}
                    </td>
                    <td className="text-center">
                      {item.SCORE_credit_level || "-"}
                    </td>
                    <td className="text-center">
                      {" "}
                      {item.SCORE_percent_behavior || "-"}
                    </td>
                    <td className="text-center">
                      <center>
                        {item.Form_Approval_results === "approved" && (
                          <span className="status-badge status-pass">
                            02Y-ผ่านการอนุมัติ
                          </span>
                        )}

                        {item.Form_Approval_results === "rejected" && (
                          <span className="status-badge status-fail">
                            02N-ไม่ผ่านการอนุมัติ
                          </span>
                        )}

                        {item.Form_verification_status === "Lv1" && (
                          <span className="status-badge status-chk">
                            01-ตรวจสอบแล้ว
                          </span>
                        )}

                        {item.Form_verification_status === "Lv1N" &&
                          item.Form_Approval_results === "Cancel" && (
                            <span className="status-badge status-cancel">
                              01N-ยกเลิกรายการ
                            </span>
                          )}
                      </center>
                    </td>

                    {/* <td className="text-center">
                      {item.Form_Contract_number || "-"}
                    </td> */}
                    {/* <td className="text-center">
                      {item.consentTruck_Number || "-"}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default reportNCBLiteDanger;
