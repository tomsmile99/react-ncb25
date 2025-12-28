import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import apiClient from "../recoilstore/userStores";
import { FcIdea } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
const ReviewIdeaAndfeelingShowheadPdf = ({ idperset }) => {
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

  const [idaeEmployees, setIdaeEmployees] = useState([]); // เก็บข้อมูลเดิม
  const [chk_show, setChk_show] = useState({});

  // const { state } = useLocation();
  // const {
  //   idperset,
  //   fullname,
  //   position,
  //   workplace,
  //   startworkdate_PSN,
  //   photo_PSN,
  //   ap_month,
  // } = state || {};

  const getScoreAssesment = async () => {
    try {
      const { data } = await apiClient.get(
        `/getIdeaEmployees?&PerD=${idperset}`
      );

      const { status, result } = data;
      if (status) {
        setIdaeEmployees(result); // เก็บผลลัพธ์ API ไว้ใน state
        // console.log("ข้อมูลใน prop", result);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // const getMessage_showBook = async () => {
  //   try {
  //     const { data } = await apiClient.get(
  //       `/show_book_messeger?PerD=${idperset}`
  //     );

  //     const { status, result } = data;

  //     if (status && result !== 0) {
  //       setChk_show(result[0]);
  //       console.log("มีข้อมูล:", result[0]);
  //     } else {
  //       setChk_show({}); // ตั้งให้เป็น object เปล่า
  //       console.log("ไม่พบข้อมูล บันทึกใหม่");
  //     }
  //   } catch (error) {
  //     console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error.message);
  //   }
  // };

  useEffect(() => {
    getScoreAssesment();
  }, []);

  return (
    <Box sx={{ maxWidth: 1550, mx: "auto", p: 4 }}>
      <div className="container4">
        รหัสพนักงาน : {idperset}
        {idaeEmployees.map((emp, idx) => (
          <Box key={idx}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="right"
              sx={{ mt: 2 }}
            >
              วันที่เสนอแนวคิด: {convertToThaiDate(emp.date_created)}
            </Typography>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "#3056d2" }}
            >
              <FcIdea /> แบบเสนอแนวคิด
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{
                fontWeight: "bold",
                mt: 2,
                fontSize: "16px",
                color: "#3056d2",
              }}
            >
              แนวคิดเรื่อง
            </Typography>
            <Typography
              variant="body1"
              sx={{ ml: 2, fontSize: "14px", fontWeight: "100" }}
            >
              {emp.ideaTopic}
            </Typography>

            <Typography
              sx={{
                fontWeight: "bold",
                mt: 2,
                fontSize: "16px",
                color: "#3056d2",
              }}
            >
              ประโยชน์ของแนวคิด
            </Typography>
            {emp.ideaBenefit &&
              emp.ideaBenefit.split(",").map((item, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{ ml: 2, fontSize: "14px", fontWeight: "100" }}
                >
                  {index + 1}. {item.trim()}
                </Typography>
              ))}
            <Typography
              sx={{
                fontWeight: "bold",
                mt: 3,
                fontSize: "16px",
                color: "#3056d2",
              }}
            >
              หลักการและเหตุผล
            </Typography>
            <Typography
              variant="body1"
              sx={{ ml: 2, fontSize: "14px", fontWeight: "100" }}
            >
              {emp.ideaRationale}
            </Typography>

            <Typography
              sx={{
                fontWeight: "bold",
                mt: 3,
                fontSize: "16px",
                color: "#3056d2",
              }}
            >
              วิธีดำเนินการ
            </Typography>
            {emp.actionPlan &&
              emp.actionPlan
                .split(/(?=\d+\.\s)/) // แยกโดยใช้ regex: มองหาจุดที่ขึ้นต้นด้วยเลขตามด้วยจุดและช่องว่าง เช่น 1.
                .map((item, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{ ml: 2, fontSize: "14px", fontWeight: "100" }}
                  >
                    {item.trim()}
                  </Typography>
                ))}

            <Typography
              sx={{
                fontWeight: "bold",
                mt: 3,
                fontSize: "14px",
                color: "#3056d2",
              }}
            >
              ผลที่คาดว่าจะได้รับ
            </Typography>

            {emp.expectedOutcome &&
              emp.expectedOutcome
                .split(/(?=\d+\.\s)/) // แยกโดยมองหาตัวเลขลำดับ เช่น 1. 2. 3.
                .map((item, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{ ml: 2, fontSize: "14px", fontWeight: "100" }}
                  >
                    {item.trim()}
                  </Typography>
                ))}

            <Typography
              sx={{
                fontWeight: "bold",
                mt: 3,
                fontSize: "14px",
                color: "#3056d2",
              }}
            >
              งบประมาณ
            </Typography>

            <Typography
              variant="body1"
              sx={{ ml: 2, fontSize: "14px", fontWeight: "100" }}
            >
              {emp.budgetAmount}
            </Typography>

            <Divider sx={{ mt: 4 }} />

            <Typography
              variant="body2"
              color="text.secondary"
              align="right"
              sx={{ mt: 2 }}
            >
              วันที่แสดงความรู้สึก: {convertToThaiDate(emp.date_created)}
            </Typography>

            <Box sx={{ px: 4, py: 2 }}>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: "#3056d2" }}
              >
                <FaHandHoldingHeart /> แสดงความรู้สึก
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: "16px",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  textIndent: "2em",
                  maxWidth: "900px",
                  margin: "0 auto",
                  backgroundColor: "#f9f9f9",
                  padding: "16px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  fontWeight: "100",
                }}
                dangerouslySetInnerHTML={{ __html: emp.details_feeling }}
              />
            </Box>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default ReviewIdeaAndfeelingShowheadPdf;
