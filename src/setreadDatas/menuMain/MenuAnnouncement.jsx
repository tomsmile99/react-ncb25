import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Button, Row, Col, Card } from "react-bootstrap";
import apiClient from "../../recoilstore/userStores";
import { NavLink } from "react-router-dom";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { MdAnnouncement } from "react-icons/md";
import logo from "../../../public/logo_sak-02.png";
import html2pdf from "html2pdf.js";
import { BsEyeFill } from "react-icons/bs";
import { SiGoogledocs } from "react-icons/si";
import { BsFillFileEarmarkTextFill, BsCalendarEvent } from "react-icons/bs";
import { MdOutlineNumbers } from "react-icons/md";
import { FcAdvertising } from "react-icons/fc";
import Lottie from "lottie-react";
// เดือนภาษาไทย
const months = [
  { label: "มกราคม", value: 1 },
  { label: "กุมภาพันธ์", value: 2 },
  { label: "มีนาคม", value: 3 },
  { label: "เมษายน", value: 4 },
  { label: "พฤษภาคม", value: 5 },
  { label: "มิถุนายน", value: 6 },
  { label: "กรกฎาคม", value: 7 },
  { label: "สิงหาคม", value: 8 },
  { label: "กันยายน", value: 9 },
  { label: "ตุลาคม", value: 10 },
  { label: "พฤศจิกายน", value: 11 },
  { label: "ธันวาคม", value: 12 },
];

// ปี พ.ศ.
const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const convertToThaiDate = (dateString) => {
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
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day} ${month} ${year}`;
};

export default function DocumentSearchMock() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filteredDocs, setFilteredDocs] = useState([]);

  const [getemployee, setGetemployee] = useState([]);
  const [getOrders, setGetOrders] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const [getOrdersId, setGetOrdersId] = useState([]);

  const getOrders_recruitment = async (date) => {
    try {
      const { data } = await apiClient.get(`/show_Announcement`);
      const { status, result } = data;
      if (status && Array.isArray(result)) {
        setGetOrders(result);
      //  console.log(result);
      } else {
        setGetOrders([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setGetOrders([]);
    }
  };

  const getOrders_recruitmentId = async (num) => {
    try {
      const { data } = await apiClient.get(`/show_AnnouncementId?num=${num}`);
      const { status, result } = data;
      if (status && Array.isArray(result)) {
        setGetOrdersId(result);
        // console.log(result);
      } else {
        setGetOrders([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setGetOrders([]);
    }
  };

  const formatDateThai = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = months[d.getMonth()].label;
    const year = d.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const handleRefresh = () => {
    // รีโหลดข้อมูลตามเดือน-ปีที่เลือก
    // const date = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
    // getOrders_recruitment(date);
    getOrders_recruitment();

  };

  const selectedMonthLabel = months.find(
    (m) => m.value === selectedMonth
  )?.label;

  const pdfRef = useRef();

  const handleOpenPDF = async (id) => {
    try {
      // รอให้ getEmployeeDB_Admin ทำเสร็จก่อน
      await getEmployeeDB_Admin(id);

      // เสร็จแล้วค่อยทำอันนี้ต่อ
      await getOrders_recruitmentId(id);

      const element = pdfRef.current;

      // 👁️ แสดง element ชั่วคราว (ก่อน capture)
      element.style.visibility = "visible";
      element.style.position = "static";

      const opt = {
        margin: [5, 5, 5, 5],
        filename: "file.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // 👇 รอ DOM render เสร็จ
      setTimeout(() => {
        html2pdf()
          .set(opt)
          .from(element)
          .outputPdf("bloburl")
          .then((pdfUrl) => {
            window.open(pdfUrl, "_blank");

            // 🔁 ซ่อน element กลับ
            element.style.visibility = "hidden";
            element.style.position = "absolute"; 
            element.style.top = "-9999px";
            element.style.left = "-9999px";
          });
      }, 100);
    } catch (error) {
      console.error("Error in handleOpenPDF:", error);
    }
  };

  //จบโมเดล
  const getEmployeeDB_Admin = async (employeeId) => {
    try {
      const { data } = await apiClient.get(
        `/show_employee_pass?getemployeeId=${employeeId}`
      );
      const { status, result } = data;

      if (status) {
        if (Array.isArray(result)) {
          setGetemployee(result);
          // console.log(result);
        } else if (result) {
          setGetemployee([result]); // แปลง object เป็น array
        } else {
          setGetemployee([]);
        }
      } else {
        setGetemployee([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setGetemployee([]);
    }
  };

  useEffect(() => {
    const selectedMonthLabel = months.find(
      (m) => m.value === selectedMonth
    )?.label;

    const mockDocuments = [
      {
        id: 1,
        title: `คำสั่งบรรจุประจำเดือน ${selectedMonthLabel}`,
        date: `${selectedYear - 543}-${String(selectedMonth).padStart(
          2,
          "0"
        )}-01`,
      },
    ];

    setFilteredDocs(mockDocuments);
    getOrders_recruitment(mockDocuments[0].date);
  }, [selectedMonth, selectedYear]);

  // --- helpers ---
  const DAYS_WINDOW = 7;

  // กันปัญหา parse 'YYYY-MM-DD' เป็น UTC ให้แปลงเองเป็น local date
  const parseYMD = (s) => {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s));
    if (!m) {
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  };

  const isNewWithinDays = (dateStr, days = DAYS_WINDOW) => {
    const d = parseYMD(dateStr);
    if (!d) return false;

    const today = new Date();
    // ตัดเวลาออกให้เทียบเป็นรายวัน
    today.setHours(0, 0, 0, 0);
    const theDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = (today - theDate) / (1000 * 60 * 60 * 24);

    // เงื่อนไข: ไม่เกินวันนี้ (diff >= 0) และไม่เกิน 7 วัน (diff <= 7)
    return diffDays >= 0 && diffDays <= days;
  };

  const [searchRef, setSearchRef] = useState(""); // เก็บค่าที่ค้นหา

  const filteredOrders = getOrders.filter((doc) => {
  const matchRef = doc.referenceNo
    .toLowerCase()
    .includes(searchRef.toLowerCase());

  const docDate = new Date(doc.effective_date);
  const docMonth = docDate.getMonth() + 1;
  const docYear = docDate.getFullYear() + 543;

  const matchMonth = selectedMonth === 0 || docMonth === selectedMonth;
  const matchYear = selectedYear === 0 || docYear === selectedYear;

  // ถ้ามีการกรอก searchRef -> ให้กรองเฉพาะ referenceNo เท่านั้น
  if (searchRef) {
    return matchRef;
  }

  // ถ้าไม่ได้ค้นหา -> ใช้กรองตามเดือนและปีตามปกติ
  return matchMonth && matchYear;
});




  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false); // ซ่อนอนิเมชันหลัง 2.5 วินาที
    }, 2500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="p-2">
      <Card
        className="p-4 border-0 "
        style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
      >
        <div className="container">
          {/* ======= Header ใหม่ ดีไซน์ ======= */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* ไอคอนกลม */}
             <img
                      src="/SAKAssessment/Data Trends-amico.png"
                      alt="employee-order"
                      style={{
                        height: "130px",
                        width: "auto",
                        marginBottom: "16px",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />

              <div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#0b3b73" }}
                >
                  ประกาศ คำสั่งบรรจุพนักงานทดลองงาน  
                </div>
                <div style={{ fontSize: 13, color: "#5b6b82", marginTop: 4 }}>
                  ค้นหาเอกสารคำสั่งตามเดือนและปี (แสดงผลเป็น พ.ศ.) &nbsp;
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FaCalendarAlt />{" "}
                    <strong>
                      {selectedMonthLabel} {selectedYear}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* ปุ่ม action ด้านขวา */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                variant="primary"
                onClick={handleRefresh}
                style={{
                  background:
                    "linear-gradient(to right,rgb(3, 130, 241), #4facfe)",
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

              {/* <Button
                 variant="primary"
                 onClick={handleDownload}
                 style={{
                   background: "linear-gradient(to right,rgb(3, 130, 241), #4facfe)",
                   border: "none",
                   borderRadius: 10,
                   display: "flex",
                   alignItems: "center",
                   gap: 8,
                   padding: "8px 12px",
                 }}
               >
                 <FaDownload /> ดาวน์โหลด PDF
               </Button> */}
            </div>
          </div>

          {/* ====== ฟอร์มเลือกเดือน/ปี ====== */}
          <Form className="mb-4">
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Control
                  type="text"
                  placeholder="ค้นหาเลขที่คำสั่ง"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  style={{
                    border: "1px solid #e3e9f0",
                    borderRadius: 10,
                    padding: "12px 15px",
                    boxShadow: "0 2px 6px rgba(11,59,115,0.03)",
                    height: "45px",
                  }}
                />
              </Col>
              <Col xs={12} md={4}>
                <Form.Select
                  className="w-100"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  style={{
                    border: "1px solid #e3e9f0",
                    borderRadius: 10,
                    padding: "10px 12px",
                    boxShadow: "0 2px 6px rgba(11,59,115,0.03)",
                    height: "45px",
                  }}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={12} md={4}>
                <Form.Select
                  className="w-100"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{
                    border: "1px solid #e3e9f0",
                    borderRadius: 10,
                    padding: "10px 12px",
                    boxShadow: "0 2px 6px rgba(11,59,115,0.03)",
                    height: "45px",
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form>

          {/* ====== ตาราง (เหมือนเดิม ปรับเล็กน้อย) ====== */}
          <div className="table-responsive container">
            <Table
              striped
              hover
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                border: "none",
              }}
            >
              <thead
                style={{
                  background:
                    "linear-gradient(135deg, #4a90e2 0%, #1867c1ff 100%)",
                  color: "#ffffff",
                }}
              >
                <tr>
                  <th className="py-3 text-center">ลำดับ</th>
                  <th className="py-3">เลขที่คำสั่ง</th>
                  <th className="py-3">เรื่อง</th>
                  <th className="py-3 text-center">วันที่มีผล</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((doc, index) => (
                    <tr key={index} style={{ backgroundColor: "#fff" } } onClick={() => handleOpenPDF(doc.order_number)} >
                      <td className="text-center">{index + 1}</td>
                      <td
                        className="fw-bold"
                        style={{ fontWeight: "bold", color: "#002d60ff" }}
                      >
                        {doc.referenceNo}
                      </td>
                      <td>
                        <a
                         
                          className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
                        >
                          <FcAdvertising style={{ fontSize: "16px" }} />{" "}
                          คำสั่งบรรจุพนักงาน
                        </a>{" "}
                        {isNewWithinDays(doc.md_approval_date) && (
                          <span
                            className="ms-2 badge blink"
                            style={{
                              backgroundColor: "#e80505ff", // แดงอ่อน
                              borderRadius: "2px",
                              padding: "2px 8px",
                              fontSize: "12px",
                            }}
                          >
                            ฉบับใหม่
                          </span>
                        )}
                      </td>

                      <td>
                        <center>{formatDateThai(doc.effective_date)}</center>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      ไม่พบข้อมูลเอกสารในเดือนและปีที่เลือก
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {/* เนื้อหาที่จะส่งออก PDF */}
            <div
              ref={pdfRef}
              style={{
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
                visibility: "hidden", // ใช้แทน display: none
                width: "794px", // A4 ขนาดความกว้าง (96 DPI)
                padding: "20px",
                backgroundColor: "white",
                color: "black",
              }}
            >
              <Card.Body style={{ fontFamily: "'TH Sarabun New', sans-serif" }}>
                {/* 🔹 เลขที่คำสั่ง ขวาบน */}
                {getemployee.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      fontSize: "12px",
                    }}
                  >
                    เลขที่แบบฟอร์ม : {getemployee[0].order_number}
                  </div>
                )}
                {/* โลโก้ตรงกลาง */}
                <div className="text-center mb-3" style={{ fontSize: "12px" }}>
                  <img src={logo} alt="Logo" width="80" />
                  <h5 className="mt-2" style={{ fontSize: "12px" }}>
                    คำสั่ง บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                  </h5>
                </div>
                {/* หัวเรื่อง */}
                <div className="text-center mb-4" style={{ fontSize: "12px" }}>
                  <h6 style={{ fontSize: "12px" }}>
                    เลขที่ {getOrdersId[0]?.referenceNo}
                  </h6>
                  <h6 style={{ fontSize: "12px" }}>เรื่อง บรรจุพนักงาน</h6>
                </div>

                {/* เนื้อหา */}
                <div className=" mb-2" style={{ fontSize: "12px" }}>
                  <p style={{ textIndent: "5em" }}>
                    ตามที่บริษัทฯ ได้รับพนักงานเข้ามาทดลองงาน
                    พบว่าพนักงานมีความกระตือรือร้นในการปฏิบัติหน้าที่
                    เรียนรู้รับผิดชอบในงาน
                    <br />
                    และสามารถดำรงตนภายใต้วัฒนธรรมขององค์กรได้เป็นอย่างดีนั้น
                  </p>
                  <p style={{ textIndent: "5em" }}>
                    เพื่อให้เป็นไปตามข้อบังคับตามกฎหมาย
                    โดยอาศัยอำนาจความเป็นบริษัท จดทะเบียนตามพระราชบัญญัติ บริษัท
                    มหาชนจำกัด <br /> เลขที่ 0107559000290 ให้บรรจุพนักงานจำนวน{" "}
                    {getemployee.length > 0 ? getemployee.length : "-"} อัตรา
                    ดังนี้
                  </p>
                </div>

                {/* ตารางรายชื่อ */}
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mb-5"
                  style={{ fontSize: "9px" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          borderWidth: "0.5px",
                        }}
                      >
                        ลำดับ
                      </th>
                      <th
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          borderWidth: "0.5px",
                        }}
                      >
                        รหัสพนักงาน
                      </th>
                      <th
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          borderWidth: "0.5px",
                        }}
                      >
                        ชื่อ - นามสกุล
                      </th>
                      <th
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          borderWidth: "0.5px",
                        }}
                      >
                        ตำแหน่ง
                      </th>
                      <th
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          borderWidth: "0.5px",
                        }}
                      >
                        สถานที่บรรจุงาน
                      </th>
                      <th
                        style={{
                          fontSize: "9px",
                          textAlign: "center",
                          borderWidth: "0.5px",
                        }}
                      >
                        สังกัด
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getemployee.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center"
                          style={{ fontSize: "9px" }}
                        >
                          ไม่มีข้อมูล
                        </td>
                      </tr>
                    ) : (
                      getemployee.map((item, index) => (
                        <tr
                          key={item.id || index}
                          style={{ fontSize: "10px", borderWidth: "0.5px" }}
                        >
                          <td
                            style={{
                              fontSize: "10px",
                              textAlign: "center",
                              borderWidth: "0.5px",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              fontSize: "10px",
                              textAlign: "center",
                              borderWidth: "0.5px",
                            }}
                          >
                            {item.employee_id || "-"}
                          </td>
                          <td
                            style={{
                              fontSize: "10px",
                              textAlign: "left",
                              borderWidth: "0.5px",
                            }}
                          >
                            {item.employee_fullname}
                          </td>
                          <td
                            style={{
                              fontSize: "10px",
                              textAlign: "left",
                              borderWidth: "0.5px",
                            }}
                          >
                            {item.employee_position}
                          </td>
                          <td
                            style={{
                              fontSize: "10px",
                              textAlign: "left",
                              borderWidth: "0.5px",
                            }}
                          >
                            {item.employee_region}
                          </td>
                          <td
                            style={{
                              fontSize: "10px",
                              textAlign: "left",
                              borderWidth: "0.5px",
                            }}
                          >
                            {item.employee_region}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>

                {/* ลายเซ็น */}
                <center style={{ fontSize: "12px" }}>
                  <div className="text-end" style={{ fontSize: "12px" }}>
                    <p>
                      ให้ได้รับค่าตอบแทนและสิทธิประโยชน์อื่น ๆ ตามที่บริษัท ฯ
                      กำหนด ตั้งแต่วันที่{" "}
                      {getOrdersId[0]?.effective_date
                        ? convertToThaiDate(getOrdersId[0].effective_date)
                        : "ยังไม่ได้ระบุ"}{" "}
                      เป็นต้นไป
                    </p>
                    <p>
                      ประกาศ ณ วันที่{" "}
                      {getOrdersId[0]?.md_approval_date
                        ? convertToThaiDate(getOrdersId[0].md_approval_date)
                        : "ยังไม่ได้ระบุ"}
                    </p>
                  </div>

                  <div
                    className="text-end mt-4"
                    style={{
                      // border: "1px solid #ccc",
                      borderRadius: "7px",
                      padding: "20px 90px",
                      display: "inline-block",
                    }}
                  >
                    <p
                      style={{
                        color:
                          getOrdersId[0]?.md_approval_status === "1"
                            ? "green"
                            : getOrdersId[0]?.md_approval_status === "2"
                            ? "red"
                            : "black",
                      }}
                    >
                      {getOrdersId[0]?.md_approval_status === "1" ? (
                        <img
                          src="/SAKAssessment/messageImage_1630316911751.png"
                          alt="ลายเซ็นอนุมัติ"
                          style={{ width: "200px", height: "auto" }} // ปรับขนาดได้ตามต้องการ
                        />
                      ) : getOrdersId[0]?.md_approval_status === "2" ? (
                        "ไม่ผ่านการอนุมัติ"
                      ) : (
                        "ยังไม่มีการอนุมัติ"
                      )}
                    </p>

                    <p>( {getOrdersId[0]?.md_fullname} )</p>
                    <p>{getOrdersId[0]?.md_position} </p>
                    <p>
                      วันที่อนุมัติ{" "}
                      {convertToThaiDate(getOrdersId[0]?.md_approval_date)}{" "}
                    </p>
                  </div>
                </center>
              </Card.Body>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
