import React, { useEffect, useState } from "react";
import apiClient from "../../recoilstore/userStores";
import { useParams } from "react-router-dom";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { AiOutlineFileProtect } from "react-icons/ai";

const ViewReportDSR = () => {
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

  const convertToThaiDateFull = (dateString) => {
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

  const [data, setData] = useState(null);

  const { CTM_Idnumber } = useParams();

  const [getDataShow, setgetDataShow] = useState([]); //แสดงข้อมูลเดี่ยว

  const [getDataReasons, setgetDataSReasons] = useState([]); //แสดงข้อมูลเดี่ยว
  const [getDataScore, setgetDataScore] = useState([]); //แสดงข้อมูลเดี่ยว

  const handleStatusClick = async (idForm) => {
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

      const { status, result, resultReasons, resultCreditscore, message } =
        data;

      if (status === 200) {
        // console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        // console.log("📦 result จากหลังบ้าน:", result);
        setgetDataShow(result[0]);
        setgetDataSReasons(resultReasons);
        setgetDataScore(resultCreditscore);
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
  };

  useEffect(() => {
    handleStatusClick(CTM_Idnumber);
  }, [CTM_Idnumber]);

  return (
    <>
      <div className="report-container">
        {/* HEADER */}
        <div className="header-section">
          <img
            src="/logo SAK เลขเสียภาษี.png"
            className="logo-img"
          />
        </div>

        <div style={{ fontSize: "18px", fontWeight: 600 }}>
          <center>รายงานผลการตรวจสอบข้อมูลเครดิต</center>
        </div>
        <div style={{ fontSize: "16px", textAlign: "right" }}>
          เลขที่แบบฟอร์ม {getDataShow.CTM_form_number}
        </div>
        {/* INFO GRID */}
        <div className="info-table">
          <div>
            <span style={{ fontSize: "16px" }}>
              {" "}
              วันที่รายงานผล :{" "}
              {convertToThaiDateFull(getDataShow.SCORE_Date_chk)}
            </span>
          </div>
          <div className="card">
            <div className="info-grid">
              <div>
                <div className="info-label">ชื่อลูกค้า</div>
                <div className="info-value">
                  {getDataShow.CTM_title_name}
                  {getDataShow.CTM_firstname} {getDataShow.CTM_lastname}
                </div>
              </div>

              <div>
                <div className="info-label">เลขบัตรประชาชน</div>
                <div className="info-value">{getDataShow.CTM_citizen_id}</div>
              </div>

              <div>
                <div className="info-label">สาขา</div>
                <div className="info-value">{getDataShow.CTM_branch}</div>
              </div>

              <div>
                <div className="info-label">วงเงินขอสินเชื่อ</div>
                <div className="info-value">{getDataShow.Form_loan_amount}</div>
              </div>
            </div>
          </div>

          <div>
            {/* <span style={{ fontSize: "16px" }}>วงเงินขอสินเชื่อ : {getDataShow.Form_loan_amount}</span> */}
          </div>
          <div>
            <span style={{ fontSize: "16px" }}>
              ประเภทสินเชื่อ : {getDataShow.LTNL_Name}
            </span>
          </div>
        </div>
        {/* SECTION 1–2 */}
        <table className="section-table">
          <tbody>
            <tr>
              <td>
                <b>1. มีสินเชื่อส่วนบุคคลภายใต้การกำกับ จำนวน</b>{" "}
                {getDataShow.SCORE_loan_amount} แห่ง
              </td>
            </tr>
            <tr>
              <td>
                <b>2. สถานะการเป็นบุคคลล้มละลาย :</b>{" "}
                {getDataShow.SCORE_bankrupt_status === "no"
                  ? "ไม่เป็น (อ้างอิงข้อมูลบุคคลล้มละลายจากกรมบังคับคดี)"
                  : "เป็น (อ้างอิงข้อมูลบุคคลล้มละลายจากกรมบังคับคดี)"}
              </td>
            </tr>
            <tr>
              <td>
                <b>3. คะแนนเครดิต</b>
                <div className="card">
                  <div className="score-grid">
                    <div className="score-box">
                      <div className="score-value">
                        {getDataShow.SCORE_credit_score}
                      </div>
                      <div className="score-label">คะแนนเครดิต</div>
                    </div>

                    <div className="score-box">
                      <div className="score-value">
                        {getDataShow.SCORE_credit_level}
                      </div>
                      <div className="score-label">ระดับคะแนน</div>
                    </div>

                    <div className="score-box">
                      <div className="score-value">
                        {getDataShow.SCORE_percent_behavior}
                      </div>
                      <div className="score-label">โอกาสชำระคืน</div>
                    </div>

                    <div className="score-box">
                      <div
                        className={`score-value ${
                          getDataShow.SCORE_credit_check_result === "ผ่าน"
                            ? "score-pass"
                            : "score-fail"
                        }`}
                      >
                        {getDataShow.SCORE_credit_check_result}
                      </div>
                      <div className="score-label">
                        {getDataShow.SCORE_Risk}
                      </div>
                    </div>
                  </div>
                </div>

                {/* REASONS */}
                <div className="reason-block">
                  <b>3.1 เหตุผลประกอบเพิ่มเติม</b>

                  <div className="reason-content">
                    {getDataReasons.length > 0 ? (
                      getDataReasons.map((item, index) => (
                        <div key={index} className="reason-item">
                          {item.account_status}
                        </div>
                      ))
                    ) : (
                      <div className="reason-item">-</div>
                    )}
                  </div>

                  <b>3.2 เหตุผลประกอบคะแนนเครดิต</b>

                  <div className="reason-content">
                    {getDataScore.length > 0 ? (
                      getDataScore.map((item, index) => (
                        <div key={index} className="reason-item">
                          {item.credit_reason}
                        </div>
                      ))
                    ) : (
                      <div className="reason-item">-</div>
                    )}
                  </div>
                </div>
                {/* FOOT NOTE */}
                <div className="footer-date">
                  ข้อมูล ณ วันที่{" "}
                  {convertToThaiDateFull(getDataShow.SCORE_ncb_enddate)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* CREDIT SCORE TABLE */}
        <div className="notice-section">
          {/* ข้อความเตือน */}
          <div className="notice-warning">
            ห้ามเปิดเผยเอกสารฉบับนี้ให้กับผู้อื่นเพื่อวัตถุประสงค์อื่นที่ไม่เกี่ยวข้องกับการพิจารณาสินเชื่อโดยเด็ดขาด
            ตามกฎหมายว่าด้วยการคุ้มครองข้อมูลส่วนบุคคล
          </div>

          {/* หมายเหตุ */}
          <div className="notice-title">หมายเหตุ :</div>

          {/* ข้อ 1 */}
          <div className="notice-row">
            <span className="notice-no">1.</span>
            <div className="notice-text">
              {/* <span className="notice-bold"> */}
              คุณสมบัติผู้ขอสินเชื่อส่วนบุคคล รายได้ไม่เกิน 30,000 บาท/เดือน
              มีสินเชื่อส่วนบุคคลภายใต้การกำกับไม่เกิน 2 แห่ง
              {/* </span> */}
              {/* <span className="notice-bold"> */}(
              ตามเรทพิจารณาการให้สินเชื่อส่วนบุคคลภายใต้การกำกับ xw)
              {/* </span> */}
            </div>
          </div>

          {/* ข้อ 2 */}
          <div className="notice-row">
            <span className="notice-no">2.</span>
            <div className="notice-text">
              ลูกค้าใหม่ ที่มีสถานะเป็นบุคคลล้มละลาย ไม่ให้สินเชื่อ (
              ตามประกาศที่ 882/2556 )
            </div>
          </div>

          {/* ข้อ 3 */}
          <div className="notice-row">
            <span className="notice-no">3.</span>
            <div className="notice-text">
              ผลการตรวจสอบข้อมูลเครดิต เป็นไปตามประกาศ
              เรื่องหลักเกณฑ์การพิจารณาผลตรวจสอบข้อมูลเครดิต ก่อนอนุมัติสินเชื่อ
              {/* <span className="notice-dots"> ................ </span> */}
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: "TH Sarabun New",
            fontSize: "18px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {/* 🔹 คำอธิบายเพิ่มเติม */}
          <div style={{ marginBottom: "6px" }}>
            <span
              style={{
                backgroundColor: "#dbeafe",
                padding: "2px 6px",
                fontWeight: "bold",
              }}
            >
              คำอธิบายเพิ่มเติม
            </span>
          </div>

          {/* 🔹 Layout หลัก */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            {/* ⬅️ กล่องคำอธิบาย (ซ้าย / ใหญ่) */}
            <div
              style={{
                flex: 1,
                minHeight: "120px",
                border: "1px solid #d5d4d4ff",
                padding: "8px",
              }}
            >
              {getDataShow.SCORE_additional_fee}
            </div>
          </div>
          {/* ➡️ กล่องผู้รายงาน (ขวา / เล็ก) */}
          <div
            style={{
              width: "300px",
              border: "1.5px solid #000",
              padding: "10px",
              textAlign: "center",
              marginLeft: "auto", // ⭐ ดันไปขวาสุด
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
                textAlign: "left",
              }}
            >
              ผู้รายงานผลการตรวจสอบ
            </div>
            <br />
            <br />

            <div style={{ fontSize: "14px" }}>
              {" "}
              {getDataShow.Form_Name_Inspector}
            </div>
            <div style={{ fontSize: "14px" }}>
              {" "}
              {getDataShow.Form_Name_Positon}
            </div>

            <div style={{ marginTop: "10px", fontSize: "16px" }}>
              วันที่{convertToThaiDate1(getDataShow.Form_date_inspertor)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewReportDSR;
