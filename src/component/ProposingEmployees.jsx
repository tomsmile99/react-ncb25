import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Paper, Divider, Button, Modal } from "@mui/material";
import apiClient from "../recoilstore/userStores";
import { FcIdea } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { Base64 } from "js-base64";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ใช้ theme "snow"
import Lottie from "lottie-react";
import loadingAnimation2 from "../../src/jsonfiles/Animation - 1739373993124.json";

import { userToken } from "../recoilstore/userStores";
import { useRecoilValue } from "recoil";

const ProposingEmployees = () => {
  const getstore = useRecoilValue(userToken);
  // console.log(getstore)
  const fullnamePer = Base64.decode(getstore.PerFuNas); //ชื่อเต็ม
  const PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N); //รูป
  const PerPST_N = Base64.decode(getstore.PerPST_N); //ตำแหน่งงาน
  const PerWP_N = Base64.decode(getstore.PerWP_N); //ตำแหน่งงาน
  const PerD = Base64.decode(getstore.PerD); //เลขพนักงาน
  const PerWP = Base64.decode(getstore.PerWP); //พื้นที่
  const _PerST = Base64.decode(getstore.PerST);

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

  const [getnameMentor, setGetnameMentor] = useState({});
  const [getnameper, setGetnameper] = useState({});

  const [selectedDate, setSelectedDate] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const [additionalTextfull, setAdditionalTextfull] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const [chk_show, setChk_show] = useState({});

  const { state } = useLocation();
  const {
    idemployee,
    fullname,
    position,
    workplace,
    startworkdate_PSN,
    photo_PSN,
  } = state || {};

  //แสดงข้อมูลพี่เลี้ยง
  const getNamementor = async () => {
    try {
      const { data } = await apiClient.get(`/getNamementor?&PerD=${PerD}`);

      const { status, result } = data;
      if (status) {
        setGetnameMentor(result[0]);
        // console.log("API call successful. Result พี่เลี้ยง:", result);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //แสดงข้อมูลพนักงาน
  const getNameEmployee = async () => {
    try {
      const { data } = await apiClient.get(
        `/getIdeaSave_message?&PerD=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        setGetnameper(result[0]);
        // console.log("API call successful. Result พนักงานทดลองงาน:", result);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //แสดงข้อมูลพนักงานบันทึกข้อความ
  const getMessage_showBook = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_book_messeger?PerD=${idemployee}`
      );

      const { status, result } = data;

      if (status && result !== 0) {
        setChk_show(result[0]);
        console.log("มีข้อมูล:", result[0]);
      } else {
        setChk_show({}); // ตั้งให้เป็น object เปล่า
        console.log("ไม่พบข้อมูล บันทึกใหม่");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error.message);
    }
  };

  // const idaeEmployees = [
  //   {
  //     office: "สำนักงานใหญ่ บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)",
  //     date: "2025-02-13",
  //     subject: "เสนอบรรจุเป็นพนักงาน",
  //     to: "กรรมการผู้จัดการ",
  //     name:fullnamePer,
  //     id: PerD,
  //     position: PerPST_N,
  //     section: PerWP_N,
  //     ref_person: {
  //       name: fullname, //ชื่อพนักงานทดลองงาน
  //       id: idemployee, //รหัสพนักงาน
  //       position: position, //ตำแหน่งพนักงานทดลองงาน
  //       section: workplace,
  //       start_date: convertToThaiDate(startworkdate_PSN),
  //     },
  //     performance_days: {
  //       morning: 2,
  //       afternoon: 1,
  //       late: 0,
  //       sick: 0,
  //       personal: 0,
  //       total: 3,
  //     },
  //     start_job_date: "1 กุมภาพันธ์ 2568",
  //     proposer: {
  //       name: "นายศรสกล สุขเกษม",
  //       position: "พนักงานฝ่ายพัฒนาระบบงานปฏิบัติการ",
  //       department: "พนักงานที่เสนอบรรจุ",
  //     },
  //     approver: {
  //       name: "นางสาวสายใจ กล้าหาญ",
  //       position: "ผู้จัดการฝ่ายพัฒนาระบบงานส่งเสริมปฏิบัติการ",
  //       date: "2025-02-13",
  //     },
  //   },
  // ];

  const data = [[2, 1, 0, 3, 0, 1]];
  const headers = ["มาสาย", "ขาดงาน", "ลากิจ", "ลาป่วย", "เวลาออกงาน", "รวม"];

  useEffect(() => {
    getNameEmployee();
    getNamementor();
    getMessage_showBook();
  }, []);

  const handleSaveClick = () => {
    const popupInfo = {
      employeeName: fullname,
      employeeId: idemployee,
      employeePosition: position,
      employeeStartDate: startworkdate_PSN,
      additionalNotes: additionalText,
      proposedAppointmentDate: selectedDate
        ? convertToThaiDate(selectedDate)
        : "ไม่ได้เลือก",
      performanceData: data[0],
    };
    setPopupData(popupInfo);
    setOpenPopup(true);
  };

  const handleConfirmSubmit = async () => {
    const fulltext = `
      ข้าพเจ้า ${getnameMentor.title_name}${getnameMentor.firstname_PSN} ${
      getnameMentor.lastname_PSN
    }
      รหัสพนักงาน ${getnameMentor.ID_personnel} ตำแหน่ง ${PerPST_N}
      สังกัด ${getnameMentor.region} ${
      getnameMentor.region !== "สำนักงานใหญ่"
        ? `เขตธุรกิจ ${getnameMentor.workplace}`
        : ""
    }
      ปฏิบัติหน้าที่เป็นพนักงานพี่เลี้ยงสอนงานบอกกล่าวเสนอแนะและกำกับงานให้กับ
      ${getnameper.title_name}${getnameper.firstname_PSN} ${
      getnameper.lastname_PSN
    }
      รหัสพนักงาน ${getnameper.ID_personnel} ตำแหน่ง ${PerPST_N}
      สังกัด ${getnameper.region} ${
      getnameper.region !== "สำนักงานใหญ่"
        ? `เขตธุรกิจ ${getnameper.workplace}`
        : ""
    }
      ตั้งแต่วันที่ ${convertToThaiDate(getnameper.startworkdate_PSN)} พบว่า
      มีคุณสมบัติเหมาะสมกับการเป็นพนักงาน ดังนี้
      ${getnameper.title_name}${getnameper.firstname_PSN} ${
      getnameper.lastname_PSN
    }
  
      ทั้งนี้ ขอเสนอให้ได้รับบรรจุเป็นพนักงาน ตั้งแต่วันที่ ${convertToThaiDate(
        selectedDate
      )} เป็นต้นไป
    `;

    const memmo_department = `${getnameper.region} บริษัท ศักดิ์สยามลิสซิ่ง จํากัด (มหาชน) `;
    const memmo_document_date = new Date().toLocaleDateString("en-CA");
    const memmo_subject = `เสนอบรรจุเป็นพนักงาน`;
    const memmo_recipient = `กรรมการผู้จัดการ`;
    const memo_IdPerEmploy = ` ${getnameper.ID_personnel}`;

    const payload = {
      memo_IdPerEmploy: memo_IdPerEmploy.trim(),
      memmo_department: memmo_department.trim(),
      memmo_document_date: memmo_document_date.trim(),
      memmo_subject: memmo_subject.trim(),
      memmo_recipient: memmo_recipient.trim(),
      fulltext: fulltext.trim(),
      additionalText,
      selectedDate,
      idMember: PerD,
      Name_nMember: fullnamePer,
      Po_idMember: PerPST_N,

    };

    try {
      const response = await apiClient.post("/insert_book_messenger", payload);
      const { data } = response;

      if (data.status) {
        setOpenPopup(false);
         getNamementor();
        Swal.fire({
          icon: "success",
          title: "ส่งข้อมูลสำเร็จ",
          text: "ข้อมูลถูกส่งเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถส่งข้อมูลได้",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setPopupData(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 4,
        fontFamily: "TH SarabunPSK, sans-serif",
      }}
    >
       
      {chk_show && Object.keys(chk_show).length === 0 ? ( 
        <Box
          sx={{
            border: "1px solid #ccc",
            p: 4,
            mb: 5,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#3056d2", fontWeight: "bold", fontSize: "20px" }}
          >
            บันทึกข้อความ
          </Typography>

          <Box sx={{ mt: 4, fontSize: "14px", lineHeight: 4 }}>
            <Typography>
              ส่วนงาน :
              <b style={{ fontSize: "14px", fontWeight: "100" }}>
                {" "}
                {getnameper.region} บริษัท ศักดิ์สยามลิสซิ่ง จํากัด (มหาชน)
              </b>
            </Typography>
            <Typography>
              วันที่ :{" "}
              <b style={{ fontSize: "14px", fontWeight: "100" }}>
                {/* {convertToThaiDate(emp.date)}{" "} */}
              </b>
              <b style={{ fontSize: "14px", fontWeight: "100" }}>
                {new Date().toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </b>
            </Typography>
            <Typography>
              เรื่อง :{" "}
              <b style={{ fontSize: "14px", fontWeight: "100" }}>
                {" "}
                เสนอบรรจุเป็นพนักงาน
              </b>
            </Typography>
            <Typography>
              เรียน :{" "}
              <b style={{ fontSize: "14px", fontWeight: "100" }}>
                กรรมการผู้จัดการ{" "}
              </b>
            </Typography>
            <Box sx={{ mt: 2, textIndent: "3em" }}>
              <Typography
                style={{
                  fontSize: "14px",
                  fontWeight: "100",
                  wordBreak: "keep-all",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  lineHeight: 1.7,
                }}
              >
                ข้าพเจ้า{" "}
                <b>
                  {getnameMentor.title_name}
                  {getnameMentor.firstname_PSN} {getnameMentor.lastname_PSN}
                </b>{" "}
                รหัสพนักงาน {getnameMentor.ID_personnel} ตำแหน่ง {PerPST_N}{" "}
                สังกัด {getnameMentor.region}{" "}
                {getnameMentor.region !== "สำนักงานใหญ่" && (
                  <>เขตธุรกิจ {getnameMentor.workplace} </>
                )}
                ปฏิบัติหน้าที่เป็นพนักงานพี่เลี้ยงสอนงานบอกกล่าวเสนอแนะและกำกับงานให้กับ{" "}
                <b>
                  {getnameper.title_name}
                  {getnameper.firstname_PSN} {getnameper.lastname_PSN}
                </b>{" "}
                รหัสพนักงาน {getnameper.ID_personnel} ตำแหน่ง {PerPST_N} สังกัด{" "}
                {getnameper.region}{" "}
                {getnameper.region !== "สำนักงานใหญ่" && (
                  <>เขตธุรกิจ {getnameper.workplace} </>
                )}
                ตั้งแต่วันที่ {convertToThaiDate(getnameper.startworkdate_PSN)}{" "}
                พบว่า มีคุณสามบัติเหมาะสมกับการเป็นพนักงาน ดังนี้
                <b>
                  {" "}
                  <br />
                  {getnameper.title_name}
                  {getnameper.firstname_PSN} {getnameper.lastname_PSN}
                </b>{" "}
              </Typography>
            </Box>{" "}
            <Box sx={{ mt: 4, fontSize: "14px", lineHeight: 4 }}>
              <div className="mt-1">
                <ReactQuill
                  theme="snow"
                  rows="6" // สูงขึ้น
                  value={additionalText}
                  onChange={setAdditionalText}
                  placeholder="พิมพ์ข้อความที่นี่ (เช่น มีความรับผิดชอบ, ตรงต่อเวลา, ฯลฯ)"
                  className="bg-white"
                  style={{ height: "200px" }} // ปรับความสูงที่ต้องการ
                />
              </div>
            </Box>
            <br /> <br />
            <center>
              {/* <div className="pt-2">
                <table
                  border="1"
                  style={{
                    borderCollapse: "collapse",
                    width: "80%",
                    textAlign: "center",
                    border: "1px solid black", // กำหนดเส้นขอบตารางโดยรวมให้ชัดเจนขึ้น
                  }}
                >
                  <thead>
                    <tr>
                      {headers.map((head, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: "1px",
                            border: "1px solid black", // เส้นขอบหัวตาราง
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((num, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              padding: "2px",
                              border: "1px solid black", // เส้นขอบทุกช่องให้ชัด
                            }}
                          >
                            {num}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </center>
          </Box>
          <div className="pt-4 flex items-center gap-2 flex-wrap">
            <span>ทั้งนี้ ขอเสนอให้ได้รับบรรจุเป็นพนักงาน ตั้งแต่วันที่</span>
            <input
              style={{ margin: 4 }}
              type="date"
              className="border rounded px-4 py-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <span>เป็นต้นไป</span>
          </div>
          <Divider sx={{ my: 3 }} />
          <center>
            <div className="custom-buttonStart2 mt-3" onClick={handleSaveClick}>
              บันทึก
            </div>
          </center>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              border: "1px solid #ccc",
              p: 4,
              mb: 5,
              backgroundColor: "#fff",
            }}
          >
            {/* ฟหกฟห{chk_show[0].memmo_subject} */}
            <Typography
              variant="h4"
              align="center"
              sx={{ color: "#3056d2", fontWeight: "bold", fontSize: "20px" }}
            >
              บันทึกข้อความ
            </Typography>
            <Box sx={{ mt: 4, fontSize: "14px", lineHeight: 4 }}>
              <Typography>
                ส่วนงาน :
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {" "}
                  {chk_show.memmo_department}
                </b>
              </Typography>
              <Typography>
                วันที่ :{" "}
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {/* {convertToThaiDate(emp.date)}{" "} */}
                </b>
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {convertToThaiDate(chk_show.memmo_date_employment)}
                </b>
              </Typography>
              <Typography>
                เรื่อง :{" "}
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {" "}
                  เสนอบรรจุเป็นพนักงาน
                </b>
              </Typography>
              <Typography>
                เรียน :{" "}
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {chk_show.memmo_recipient}
                </b>
              </Typography>
              <Box sx={{ mt: 2, textIndent: "2em" }}>
                <Typography
                  style={{
                    fontSize: "14px",
                    fontWeight: "100",
                    wordBreak: "keep-all",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    lineHeight: 1.7,
                  }}
                >
                  <b style={{ fontSize: "14px", fontWeight: "100" }}>
                    {chk_show.memmo_body_text}
                  </b>
                </Typography>
              </Box>{" "}
              {/* <b>{emp.ref_person.name}</b> */}
              <div className="pt-2">
                <Typography
                  variant="body1"
                  sx={{
                    color: "#000",
                    fontWeight: "1.3px",
                    fontSize: "14px",
                  }}
                  dangerouslySetInnerHTML={{ __html: chk_show.memmo_skills }}
                />
              </div>
              {/* <p style={{color :'#'}}>{" "}{additionalText}</p> */}
              <center>
                {/* <div className="pt-3">
                  <table
                    border="1"
                    style={{
                      borderCollapse: "collapse",
                      width: "80%",
                      textAlign: "center",
                      border: "1px solid black", // กำหนดเส้นขอบตารางโดยรวมให้ชัดเจนขึ้น
                    }}
                  >
                    <thead>
                      <tr>
                        {headers.map((head, idx) => (
                          <th
                            key={idx}
                            style={{
                              padding: "1px",
                              border: "1px solid black", // เส้นขอบหัวตาราง
                            }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((num, colIndex) => (
                            <td
                              key={colIndex}
                              style={{
                                padding: "2px",
                                border: "1px solid black", // เส้นขอบทุกช่องให้ชัด
                              }}
                            >
                              {num}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
              </center>
              <div className="pt-3 flex items-center gap-2 flex-wrap pt-2">
                <span>
                  ทั้งนี้ ขอเสนอให้ได้รับบรรจุเป็นพนักงาน ตั้งแต่วันที่
                </span>
                <b
                  style={{
                    color: "#3056d2",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {convertToThaiDate(chk_show.memmo_date_employment)}
                </b>{" "}
                <span>เป็นต้นไป</span>
              </div>
              <Divider sx={{ my: 3 }} />
            </Box>
            <div className="col-md-12">
              <div className="row container">
                <div className="col-md-6">
                  <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                    <div className="text-sm text-gray-500 text-left">
                      พี่เลี้ยง
                    </div>
                    <div className="mt-2">
                      {" "}
                      {getnameMentor.title_name}
                      {getnameMentor.firstname_PSN} {getnameMentor.lastname_PSN}
                    </div>
                    <div className="mt-2"> ({getnameMentor.position})</div>
                    <div className="text-sm text-gray-600">
                      {/* {item.ap_posit_mentor} */}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontWeight: "600",
                        color: "green",
                      }}
                    >
                      รับทราบ
                    </div>

                    <div className="text-sm mt-1">
                      {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>

          {/* <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button variant="contained" onClick={handleConfirmSubmit}>
              ยืนยัน
            </Button>
            <Button variant="outlined" onClick={handleClosePopup}>
              ยกเลิก
            </Button>
          </Box> */}
        </Box>
      )}


      {/* Popup Modal */}
      <Modal
        open={openPopup}
        onClose={handleClosePopup}
        aria-labelledby="popup-title"
        aria-describedby="popup-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "51%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 1000,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            fontFamily: "TH SarabunPSK, sans-serif",
            maxHeight: "99vh", // Set a maximum height relative to the viewport height
            overflowY: "auto", // Enable vertical scrolling when content overflows
          }}
        >
          <Box
            sx={{
              border: "1px solid #ccc",
              p: 4,
              mb: 5,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ color: "#3056d2", fontWeight: "bold", fontSize: "20px" }}
            >
              ยืนยันการบันทึกข้อความ
            </Typography>

            <Box sx={{ mt: 4, fontSize: "14px", lineHeight: 4 }}>
              <Typography>
                ส่วนงาน :
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {" "}
                  {getnameper.region} บริษัท ศักดิ์สยามลิสซิ่ง จํากัด (มหาชน)
                </b>
              </Typography>
              <Typography>
                วันที่ :{" "}
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {/* {convertToThaiDate(emp.date)}{" "} */}
                </b>
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {new Date().toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </b>
              </Typography>
              <Typography>
                เรื่อง :{" "}
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  {" "}
                  เสนอบรรจุเป็นพนักงาน
                </b>
              </Typography>
              <Typography>
                เรียน :{" "}
                <b style={{ fontSize: "14px", fontWeight: "100" }}>
                  กรรมการผู้จัดการ{" "}
                </b>
              </Typography>
              <Box sx={{ mt: 2, textIndent: "2em" }}>
                <Typography
                  style={{
                    fontSize: "14px",
                    fontWeight: "100",
                    wordBreak: "keep-all",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    lineHeight: 1.7,
                  }}
                >
                  ข้าพเจ้า{" "}
                  <b>
                    {getnameMentor.title_name}
                    {getnameMentor.firstname_PSN} {getnameMentor.lastname_PSN}
                  </b>{" "}
                  รหัสพนักงาน {getnameMentor.ID_personnel} ตำแหน่ง {PerPST_N}{" "}
                  สังกัด {getnameMentor.region}{" "}
                  {getnameMentor.region !== "สำนักงานใหญ่" && (
                    <>เขตธุรกิจ {getnameMentor.workplace} </>
                  )}
                  ปฏิบัติหน้าที่เป็นพนักงานพี่เลี้ยงสอนงานบอกกล่าวเสนอแนะและกำกับงานให้กับ{" "}
                  <b>
                    {getnameper.title_name}
                    {getnameper.firstname_PSN} {getnameper.lastname_PSN}
                  </b>{" "}
                  รหัสพนักงาน {getnameper.ID_personnel} ตำแหน่ง {PerPST_N}{" "}
                  สังกัด {getnameper.region}{" "}
                  {getnameper.region !== "สำนักงานใหญ่" && (
                    <>เขตธุรกิจ {getnameper.workplace} </>
                  )}
                  ตั้งแต่วันที่{" "}
                  {convertToThaiDate(getnameper.startworkdate_PSN)} พบว่า
                  มีคุณสามบัติเหมาะสมกับการเป็นพนักงาน ดังนี้
                  <b>
                    {" "}
                    <br />
                    {getnameper.title_name}
                    {getnameper.firstname_PSN} {getnameper.lastname_PSN}
                  </b>{" "}
                </Typography>
              </Box>{" "}
              {/* <b>{emp.ref_person.name}</b> */}
              <div className="pt-2">
                <Typography
                  variant="body1"
                  sx={{
                    color: "#000",
                    fontWeight: "1.3px",
                    fontSize: "14px",
                  }}
                  dangerouslySetInnerHTML={{ __html: additionalText }}
                />
              </div>
              {/* <p style={{color :'#'}}>{" "}{additionalText}</p> */}
              <center>
                {/* <div className="pt-3">
                  <table
                    border="1"
                    style={{
                      borderCollapse: "collapse",
                      width: "80%",
                      textAlign: "center",
                      border: "1px solid black", // กำหนดเส้นขอบตารางโดยรวมให้ชัดเจนขึ้น
                    }}
                  >
                    <thead>
                      <tr>
                        {headers.map((head, idx) => (
                          <th
                            key={idx}
                            style={{
                              padding: "1px",
                              border: "1px solid black", // เส้นขอบหัวตาราง
                            }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((num, colIndex) => (
                            <td
                              key={colIndex}
                              style={{
                                padding: "2px",
                                border: "1px solid black", // เส้นขอบทุกช่องให้ชัด
                              }}
                            >
                              {num}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
              </center>
              <div className="pt-3 flex items-center gap-2 flex-wrap pt-2">
                <span>
                  ทั้งนี้ ขอเสนอให้ได้รับบรรจุเป็นพนักงาน ตั้งแต่วันที่
                </span>
                <b
                  style={{
                    color: "#3056d2",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {convertToThaiDate(selectedDate)}
                </b>{" "}
                <span>เป็นต้นไป</span>
              </div>
              <Divider sx={{ my: 3 }} />
            </Box>

            <div className="col-md-12">
              <div className="row container">
                <div className="col-md-6">
                  <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                    <div className="text-sm text-gray-500 text-left">
                      พี่เลี้ยง
                    </div>
                    <div className="mt-2">
                      {" "}
                      {getnameMentor.title_name}
                      {getnameMentor.firstname_PSN} {getnameMentor.lastname_PSN}
                    </div>
                    <div className="mt-2"> ( {getnameMentor.position})</div>
                    <div className="text-sm text-gray-600">
                      {/* {item.ap_posit_mentor} */}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontWeight: "600",
                        color: "green",
                      }}
                    >
                      รับทราบ
                    </div>

                    <div className="text-sm mt-1">
                      {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button variant="contained" onClick={handleConfirmSubmit}>
              ยืนยัน
            </Button>
            <Button variant="outlined" onClick={handleClosePopup}>
              ยกเลิก
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProposingEmployees;
