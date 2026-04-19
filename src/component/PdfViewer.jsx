import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import apiClient from "../recoilstore/userStores";

const PdfViewer = () => {
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

  const statusConfig = {
    pending: { text: "รอการรับรอง", color: "#facc15" }, // เหลือง
    approved: { text: "รับรองแล้ว", color: "#16a34a" }, // เขียว
    rejected: { text: "ไม่รับรอง", color: "#dc2626" }, // แดง
  };
  const { FormOutside_form_number } = useParams();
  const [data, setData] = useState(null);
  const pdfRef = useRef();

  const [probationaryEmployees, setProbationaryEmployees] = useState([]);

  const fetchData = async (FormOutside_form_number) => {
    const params = {
      idFormOut: FormOutside_form_number,
    };

    // console.log(params);

    try {
      const { data } = await apiClient.get(
        `/api/insurances/GetDataOutsidePDF`,
        {
          params,
        },
      );

      // ❌ ห้ามใช้ currentPage ชื่อชนกับ state
      const { status, sqlDataCustomers } = data;

      if (status) {
        // console.log(sqlDataCustomers[0]);
        setProbationaryEmployees(sqlDataCustomers[0]);
        // setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }

   
  };

  useEffect(() => {
    fetchData(FormOutside_form_number);
  }, []);

 
  if (!probationaryEmployees) return <div>Loading...</div>;

  return (
    <div
      style={{
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        paddingLeft: "5%",
        minHeight: "100%", // ✅ ใช้ % ได้แล้ว
        background: "#fff",
      }}
    >
      {/* 🔥 A4 จริง */}
      <div
        ref={pdfRef}
        style={{
          width: "310mm",
          minHeight: "297mm",
          padding: "25mm",
          fontFamily: "THSarabunNew",
          fontSize: "13pt",
          lineHeight: 1.8,
          color: "#000",
        }}
      >
        {/* 🔥 หัวเรื่อง */}
        {/* 🔥 โลโก้ซ้าย */}
        {/* <div>
          <center>
          <img
            src="/LOGO SAK.png" 
            alt="logo"
            style={{ width: "80px" , margin :"10px"}}
          /></center>
        </div> */}

        {/* 🔥 ลายน้ำ */}
        <img
          src="/LOGO SAK.png"
          alt="watermark"
          style={{
            position: "absolute",
            top: "40%",
            left: "52%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            opacity: 0.03, // 🔥 ความจาง (ปรับได้)
            zIndex: 0,
          }}
        />

        <div
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "22pt" }}
        >
          บันทึกข้อความ
        </div>

        {/* 🔥 ส่วนหัว */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>ส่วนงาน</div>
            <div>{probationaryEmployees.FormOutside_requester_branch}</div>
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>วันที่</div>
            <div>
              {convertToThaiDate(probationaryEmployees.FormOutside_created_at)}
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>เรื่อง</div>
            <div>ขอตรวจสอบข้อมูลเครดิตนอกหลักเกณฑ์ฯ</div>
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>เรียน</div>
            <div>ฝ่ายตรวจสอบข้อมูลเครดิต</div>
          </div>
        </div>

        {/* 🔥 เนื้อหา */}
        <div
          style={{ marginTop: "30px", textAlign: "justify", marginLeft: "12%" }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ขอตรวจสอบข้อมูลเครดิตลูกค้า ที่ไม่เข้าตามเกณฑ์การตรวจสอบข้อมูลเครดิต
          เลขที่ {probationaryEmployees.FormOutside_number} ลงวันที่{" "}
          {convertToThaiDate(probationaryEmployees.FormOutside_created_at)}
          โดยมีรายละเอียดดังนี้
        </div>

        {/* 🔥 รายละเอียดลูกค้า */}
        <div style={{ marginTop: "20px", marginLeft: "12%" }}>
          <div>
            ชื่อ - นามสกุล : {probationaryEmployees.FormOutside_customer_name}
          </div>
          <div>ประเภทลูกค้า : {probationaryEmployees.CMTN_Name}</div>
          <div>ประเภทสินเชื่อ :{probationaryEmployees.LTNL_Name}</div>
          <div>
            วงเงินขอสินเชื่อ :{" "}
            {Number(
              probationaryEmployees.FormOutside_credit_limit,
            ).toLocaleString("th-TH", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            บาท
          </div>
        </div>

        {/* 🔥 เนื้อหาต่อ */}
        <div style={{ marginTop: "20px", textAlign: "justify" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          เพื่อให้มีข้อมูลที่เพียงพอต่อการประกอบการวิเคราะห์การให้สินเชื่อ
          และป้องกันความเสี่ยงในการให้สินเชื่อต่อลูกค้า
          จึงขอตรวจสอบข้อมูลเครดิตของลูกค้ารายนี้ เป็นกรณีพิเศษ
        </div>

        <div style={{ marginTop: "20px", marginLeft: "12%" }}>
          จึงเรียนมาเพื่อโปรดพิจารณา
        </div>

        {/* 🔥 ลายเซ็น */}
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <center>
            <div
              style={{
                textAlign: "center",
                width: "45%",
                fontWeight: "bold",
                color: "green",
              }}
            >
              ผู้ยื่นขอตรวจสอบ
            </div>
          </center>
          <div>{probationaryEmployees.FormOutside_requester_name}</div>
          <div>{probationaryEmployees.FormOutside_requester_position}</div>
          <div style={{ fontSize: "16px" }}>
            {" "}
            {convertToThaiDate(probationaryEmployees.FormOutside_created_at)}
          </div>
        </div>

        {/* 🔥 ล่างซ้าย-ขวา */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "80px",
          }}
        >
          <div style={{ textAlign: "center", width: "45%" }}>
            <div
              style={{
                fontWeight: "bold",
                color:
                  probationaryEmployees.FormOutside_review_status === "pending"
                    ? "#eead3d" // 🟡 เหลือง
                    : probationaryEmployees.FormOutside_review_status === "Y"
                      ? "green" // 🟢
                      : probationaryEmployees.FormOutside_review_status ===
                          "rejected"
                        ? "red" // 🔴
                        : "black",
              }}
            >
              {probationaryEmployees.FormOutside_review_status === "pending"
                ? "รอการรับรอง"
                : probationaryEmployees.FormOutside_review_status === "Y"
                  ? "รับรองแล้ว"
                  : probationaryEmployees.FormOutside_review_status ===
                      "rejected"
                    ? "ไม่รับรอง"
                    : "-"}
            </div>

            <div>{probationaryEmployees.FormOutside_reviewer_name}</div>
            <div>{probationaryEmployees.FormOutside_reviewer_position}</div>

            <div style={{ fontSize: "16px" }}>
              {convertToThaiDate(
                probationaryEmployees.FormOutside_request_datetime,
              )}
            </div>
          </div>

          <div style={{ textAlign: "center", width: "45%" }}>
            <div
              style={{
                fontWeight: "bold",
                color:
                  probationaryEmployees.FormOutside_approve_status === "pending"
                    ? "#eead3d" // 🟡 เหลือง
                    : probationaryEmployees.FormOutside_approve_status === "Y"
                      ? "green" // 🟢
                      : probationaryEmployees.FormOutside_approve_status ===
                          "rejected"
                        ? "red" // 🔴
                        : "black",
              }}
            >
              {probationaryEmployees.FormOutside_approve_status === "pending"
                ? "รอการอนุมัติ"
                : probationaryEmployees.FormOutside_approve_status === "Y"
                  ? "อนุมัติแล้ว"
                  : probationaryEmployees.FormOutside_approve_status ===
                      "rejected"
                    ? "ไม่ไม่อนุมัติ"
                    : "-"}
            </div>

            <div>{probationaryEmployees.FormOutside_approver_name}</div>
            <div>{probationaryEmployees.FormOutside_approver_position}</div>
            <div style={{ fontSize: "16px" }}>
              {convertToThaiDate(
                probationaryEmployees.FormOutside_approve_datetime,
              )}
            </div>
          </div>

            {/* 🔥 เจ้หน้าที่  */}
        {probationaryEmployees?.FormOutside_Ncb_status && (
  <div style={{ textAlign: "center", width: "45%" }}>
    <div
      style={{
        fontWeight: "bold",
        color:
          probationaryEmployees.FormOutside_Ncb_status === "pending"
            ? "#eead3d"
            : probationaryEmployees.FormOutside_Ncb_status === "Y"
            ? "green"
            : probationaryEmployees.FormOutside_Ncb_status === "rejected"
            ? "red"
            : "black",
      }}
    >
      {probationaryEmployees.FormOutside_Ncb_status === "pending"
        ? "รอการอนุมัติ"
        : probationaryEmployees.FormOutside_Ncb_status === "Y"
        ? "รับทราบ"
        : probationaryEmployees.FormOutside_Ncb_status === "rejected"
        ? "ไม่อนุมัติ"
        : "-"}
    </div>

    <div>{probationaryEmployees.FormOutside_Ncb_name}</div>
    <div>{probationaryEmployees.FormOutside_Ncb_position}</div>
    <div style={{ fontSize: "16px" }}>
      {convertToThaiDate(
        probationaryEmployees.FormOutside_Ncb_datetime
      )}
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
