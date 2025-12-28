import React, { useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "react-router-dom";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import {
  Avatar,
  Button,
  Modal,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";
import { Base64 } from "js-base64";
import { userToken } from "../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { ImAddressBook } from "react-icons/im";

import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineLibraryBooks } from "react-icons/md";
import ViewWorkLogForumReport from "../../component/ViewWorkLogForumReport";
import ViewWorkLogHistory from "../../component/ViewWorkLogHistory";
const MentorReadData_history_Viewmain = ({
  idemployee,
  fullname,
  position,
  workplace,
  startworkdate_PSN,
  photo_PSN,
  ap_month,
}) => {
  const navigate = useNavigate();
  const PerD = idemployee;
  const getstore = useRecoilValue(userToken);
  const fullnamePer = Base64.decode(getstore.PerFuNas); //ชื่อเต็ม
  const PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N); //รูป
  const PerPST_N = Base64.decode(getstore.PerPST_N); //ตำแหน่งงาน
  const PerWP_N = Base64.decode(getstore.PerWP_N); //ตำแหน่งงาน
  const PerDs = Base64.decode(getstore.PerD); //เลขพนักงาน
  const PerWP = Base64.decode(getstore.PerWP); //พื้นที่
  const _PerST = Base64.decode(getstore.PerST);
  const _AgU = Base64.decode(getstore.AgU);
  const _PerPST = Base64.decode(getstore.PerPST);
  const _PerWP = Base64.decode(getstore.PerWP);

  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [latestApprovalRound, setLatestApprovalRound] = useState("");

  const mockData = {
    employeeName: "สมชาย ใจดี",
    position: "เจ้าหน้าที่ฝ่ายขาย",
    workArea: "กรุงเทพมหานคร",
    department: "ฝ่ายขาย",
    scores: [
      [18, 0, 0],
      [7, 0, 0],
      [6, 0, 0],
      [7, 0, 0],
      [10, 0, 0],
      [10, 0, 0],
      [11, 0, 0],
      [18, 0, 0],
    ],
    mentorComments: "พนักงานมีความตั้งใจและพัฒนาอย่างต่อเนื่อง",
    employeeComments: "ขอบคุณสำหรับคำแนะนำจากพี่เลี้ยง",
    employeeSignature: "สมชาย ใจดี",
    mentorSignature: "วิทยา กุลเจริญ",
    employeePosition: "พนักงาน",
    mentorPosition: "หัวหน้าทีม",
    date: "2024-08-30",
  };

  const [steps, setSteps] = useState([
    "ประเมินครั้งที่ 1 ",
    "ประเมินครั้งที่ 2 ",
    "ประเมินครั้งที่ 3 ",
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const [questionMain, setQuestionMain] = useState([]);
  const [scoreMain, setScoreMain] = useState([]);
  const [scoreMain2, setScoreMain2] = useState([]);
  const [scoreMain3, setScoreMain3] = useState([]);

  const [mentorMain, setMentorMain] = useState([]); //เก็บชื่อพี่เลี้ยงที่ประเมิน

  const getScoreAssesmentDB = async () => {
    try {
      const { data } = await apiClient.get(`/show_question_db`);

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);
        setQuestionMain(result); // เก็บผลลัพธ์ API ไว้ใน state

        // console.log(result);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getScore_question_db = async () => {
    // คะแนนตาราง
    try {
      const { data } = await apiClient.get(`/score_question_db?idPer=${PerD}`);

      const { status, result } = data;
      if (status) {
        // ตั้งค่าคะแนนทั้งหมดก่อน
        setScoreMain(result.month1 || null);
        setScoreMain2(result.month2 || null);
        setScoreMain3(result.month3 || null);

        // ตรวจหาล่าสุดว่ามีข้อมูลถึง month ไหน
        if (result.month3 && result.month3.length > 0) {
          setLatestApprovalRound(3);
         
        } else if (result.month2 && result.month2.length > 0) {
          setLatestApprovalRound(2);
        } else if (result.month1 && result.month1.length > 0) {
          setLatestApprovalRound(1);
        } else {
          setLatestApprovalRound(null);
        }
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //แสดงพี่เลี้ยงที่ที่ประเมิน
  const getMentor_asseeement = async () => {
    try {
      const { data } = await apiClient.get(`/show_name_mentor?idPer=${PerD}`);

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);
        setMentorMain(result[0]); // เก็บผลลัพธ์ API ไว้ใน state

        // console.log(result);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };


  

  useEffect(() => {
    const fetchData = async () => {
      await getMentor_asseeement();
      await getScoreAssesmentDB();
      await getScore_question_db();
    };

    fetchData();
  }, []);

  //พนักงานทดลองงาน
  const employee = {
    // ข้อมูลพนักงานคนเดียว
    id: idemployee,
    name: fullname,
    position: position,
    workpaan: workplace,
    profilePicture: `https://apimb.sakerp.org/file_photoEMP/${photo_PSN}`,
    datestart: startworkdate_PSN,
  };

  //พี่เลี้ยง
  const employee1 = {
    // ข้อมูลพนักงานคนเดียว
    id: mentorMain.ID_mentor_em,
    name: mentorMain.fullName_mentor,
    position: mentorMain.position,
    workpaan: mentorMain.workplace,
    profilePicture: `https://apimb.sakerp.org/file_photoEMP/${mentorMain.mentor_photo_PSN}`,
    datestart: mentorMain.mentor_startworkdate_PSN,
  };

  const handleApproval = (status) => async () => {
    if (!latestApprovalRound) {
      Swal.fire("ไม่พบข้อมูลการประเมิน", "", "warning");
      return;
    }

    if (status === 0) {
      // แสดงฟอร์มสำหรับกรอกหมายเหตุ
      const { value: remark } = await Swal.fire({
        title: "กรุณาระบุหมายเหตุ",
        input: "textarea",
        inputPlaceholder: "ใส่เหตุผลในการไม่อนุมัติ...",
        inputAttributes: {
          "aria-label": "หมายเหตุ",
        },
        showCancelButton: true,
        confirmButtonText: "ส่ง",
        cancelButtonText: "ยกเลิก",
        inputValidator: (value) => {
          if (!value) {
            return "กรุณากรอกหมายเหตุ";
          }
        },
      });

      if (remark === undefined) return;

      try {
        await apiClient.post("/approval_leader", {
          idPer: PerD, //รหัสพนักงานทดลองงาน
          idLeader: PerDs, //รหัสผู้อนุมัติ
          posit: _PerPST, //ตำแหน่ง
          ap_month: ap_month, // เดือนที่อนุมัติ
          approval_status: 0, // สถานะการอนุมัติไม่ผ่าน
          remark: remark, // หมายเหตุ
        });
        Swal.fire({
          title: "❌ ไม่อนุมัติเรียบร้อย",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = "/Leader_DataForm"; // จะ navigate + reload จริง
        });
      } catch (error) {
        console.error("Error during disapproval:", error.message);
        Swal.fire("เกิดข้อผิดพลาดในการส่งข้อมูล", "", "error");
      }
    } else {
      // อนุมัติแบบไม่ต้องใช้ remark
      Swal.fire({
        title: `ยืนยันการอนุมัติเดือนที่ ${ap_month}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "อนุมัติ",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await apiClient.post("/approval_leader", {
              idPer: PerD, //รหัสพนักงานทดลองงาน
              idLeader: PerDs, //รหัสผู้อนุมัติ
              posit: _PerPST, //ตำแหน่ง
              ap_month: ap_month, // เดือนที่อนุมัติ
              approval_status: 1, // สถานะการอนุมัติไม่ผ่าน
              remark: "", // ป้องกัน error
            });
            Swal.fire({
              title: "อนุมัติเรียบร้อย!",
              icon: "success",
              showConfirmButton: false,
              timer: 1000, // หน่วยเป็นมิลลิวินาที (2 วินาที)
              timerProgressBar: true,
            }).then(() => {
              window.location.href = "/Leader_DataForm"; // จะ navigate + reload จริง
            });
          } catch (error) {
            console.error("Error during approval:", error.message);
            Swal.fire("เกิดข้อผิดพลาดในการอนุมัติ", "", "error");
          }
        }
      });
    }
  };

  const handleRejection = () => {
    Swal.fire({
      title: "ระบุเหตุผลในการไม่อนุมัติ",
      input: "text",
      inputPlaceholder: "พิมพ์เหตุผล...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "❌ ไม่อนุมัติ",
      cancelButtonText: "ยกเลิก",
      inputValidator: (value) => {
        if (!value) {
          return "กรุณาระบุเหตุผล!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("❌ ไม่อนุมัติเรียบร้อย!", "", "error");
        console.log("ไม่อนุมัติ เหตุผล:", result.value);
      }
    });
  };

  //แสดงกราฟ
  const totalScore1 = scoreMain.reduce(
    (sum, item) => sum + Number(item.total_score),
    0
  );
  const totalScore2 = scoreMain2.reduce(
    (sum, item) => sum + Number(item.total_score),
    0
  );
  const totalScore3 = scoreMain3.reduce(
    (sum, item) => sum + Number(item.total_score),
    0
  );


  // สมมุติว่าแต่ละ score จะผ่าน step ได้ถ้าได้คะแนนอย่างน้อย 1
  let activeStep = 0;
  if (totalScore1 > 0) activeStep = 1; 
  if (totalScore2 > 0) activeStep = 2;
  if (totalScore3 > 0) activeStep = 3;


  const handleAssessmentClick = (month) => {
    setSelectedMonth(month);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMonth(null);
  };

  //คำนวนอายุงาน
  const calculateWorkDuration = (startDateString) => {
    const startDate = new Date(startDateString);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} ปี ${months} เดือน`;
  };

  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);

  const handlePerformanceClick = (month) => {
    setSelectedMonth(month);
    setOpenPerformanceModal(true);
  };

  return (
    <>
     <div className="cartcustom pt-1 pb-1">
        <div className="card-body">
          {employee ? (
            <div
              className="d-flex align-items-center"
              style={{
                transition: "0.3s",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <Avatar
                src={employee.profilePicture}
                sx={{
                  width: 70,
                  height: 70,
                  mr: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.1)", boxShadow: 3 },
                }}
                alt={employee.name}
              />
              <div className="employee-details ms-3 col-md-8">
                <div className="fw-bold" style={{ color: "#4285f4" }}>
                  {employee.name}
                </div>
                <div className="row employee-details">
                  <div className="col-md-4 text-muted">
                    ตำแหน่ง : {employee.position}
                  </div>
                  <div className="col-md-4 text-muted">
                    พื้นที่ปฏิบัติงาน : {employee.workpaan} 
                  </div>
                  {/* <div className="col-md-3 text-muted">
                    วันที่เริ่มงาน : {employee.datestart}
                  </div> */}
                </div>
              </div>
              <div style={{ width: "100%", marginTop: "10px" }}>
                <Box sx={{ width: "100%" }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel
                          sx={{
                            "& .MuiStepLabel-label": {
                              fontSize: "12px", // ปรับขนาดฟอนต์ตรงนี้
                            },
                          }}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">ไม่มีข้อมูลพนักงาน</p>
          )}
        </div>
      </div>


      <div className="pt-2 container1">
        <div className="left">
          <div className="cartcustom">
            <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
              <div className="cartcustomTag bg-primary text-white mb-2">
                <h5 className="mb-0" style={{ fontSize: "14px" }}>
                  แบบสรุปผลประเมินพนักงานทดลองงาน
                </h5>
              </div>
              <center>
                <table className="w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 rounded-tl-lg">
                        <center>ลำดับ</center>
                      </th>
                      <th className="border p-2">หัวข้อการประเมิน</th>
                      <th className="border p-2">คะแนนเต็ม</th>
                      <th className="border p-2">เดือนที่ 1</th>
                      <th className="border p-2">เดือนที่ 2</th>
                      <th className="border p-2">เดือนที่ 3</th>
                      <th className="border p-2 rounded-tr-lg"> 
                        คะแนนเต็มรวม 3 เดือน
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionMain.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td
                          className="border p-2"
                          style={{ width: "400px", maxWidth: "200px" }}
                        >
                          {item.criteria_name}
                        </td>
                        <td className="border p-2 text-center">
                          {[20, 8, 8, 8, 12, 12, 12, 20][index]}
                        </td>

                        <td className="border p-2 text-center">
                          {scoreMain[index]?.total_score ?? "-"}
                        </td>
                        <td className="border p-2 text-center">
                          {" "}
                          {scoreMain2[index]?.total_score ?? "-"}
                        </td>
                        <td className="border p-2 text-center">
                          {scoreMain3[index]?.total_score ?? "-"}
                        </td>
                        <td className="border p-2 text-center font-bold bg-yellow-100">
                          {parseInt(scoreMain[index]?.total_score || 0) +
                            parseInt(scoreMain2[index]?.total_score || 0) +
                            parseInt(scoreMain3[index]?.total_score || 0) ||
                            "-"}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b">
                      <td className="border p-2">คะแนนเต็มรวม</td>
                      <td className="border p-2"></td>
                      <td className="border p-2">
                        <center>{100}</center>
                      </td>
                      <td className="border p-2">
                        <center>
                          {scoreMain.reduce(
                            (sum, item) => sum + Number(item.total_score),
                            0
                          )}
                        </center>
                      </td>
                      <td className="border p-2">
                        <center>
                          {scoreMain2.reduce(
                            (sum, item) => sum + Number(item.total_score),
                            0
                          )}
                        </center>
                      </td>
                      <td className="border p-2">
                        <center>
                          {scoreMain3.reduce(
                            (sum, item) => sum + Number(item.total_score),
                            0
                          )}
                        </center>
                      </td>
                      <td className="border p-2">
                        <center>
                          {" "}
                          {scoreMain.reduce(
                            (sum, item) => sum + Number(item.total_score),
                            0
                          ) +
                            scoreMain2.reduce(
                              (sum, item) => sum + Number(item.total_score),
                              0
                            ) +
                            scoreMain3.reduce(
                              (sum, item) => sum + Number(item.total_score),
                              0
                            )}
                        </center>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </center>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="cartcustom">
            <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
              <div className="cartcustomTag bg-primary text-white mb-2">
                <h5 className="mb-0" style={{ fontSize: "14px" }}>
                  แบบสรุปผลประเมินพนักงานทดลองงาน
                </h5>
              </div>

              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [totalScore1, totalScore2, totalScore3],
                  },
                ]}
                series={[
                  {
                    data: [totalScore1, totalScore2, totalScore3],
                    color: "#7daaf2",
                  },
                ]}
                width={700}
                height={300}
              />
            </div>
            <center>
              <div className="grid grid-cols-3 gap-4">
                {totalScore1 > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleAssessmentClick(1)}
                    sx={{
                      borderColor: "#3056d2",
                      color: "#3056d2",
                      borderRadius: "7px",
                      "&:hover": {
                        borderColor: "#516fd2",
                        backgroundColor: "rgba(48, 86, 210, 0.1)",
                        color: "#516fd2",
                      },
                      padding: "8px 16px",
                      width: "30%",
                      marginRight: "5px",
                    }}
                  >
                    <BsFillFileEarmarkBarGraphFill className="mr-1" />{" "}
                    ผลการประเมินเดือนที่ 1
                  </Button>
                )}

                {totalScore2 > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleAssessmentClick(2)}
                    sx={{
                      borderColor: "#3056d2",
                      color: "#3056d2",
                      borderRadius: "7px",
                      "&:hover": {
                        borderColor: "#516fd2",
                        backgroundColor: "rgba(48, 86, 210, 0.1)",
                        color: "#516fd2",
                      },
                      padding: "8px 16px",
                      width: "30%",
                      marginRight: "5px",
                    }}
                  >
                    <BsFillFileEarmarkBarGraphFill className="mr-1" />{" "}
                    ผลการประเมินเดือนที่ 2
                  </Button>
                )}

                {totalScore3 > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleAssessmentClick(3)}
                    sx={{
                      borderColor: "#3056d2",
                      color: "#3056d2",
                      borderRadius: "7px",
                      "&:hover": {
                        borderColor: "#516fd2",
                        backgroundColor: "rgba(48, 86, 210, 0.1)",
                        color: "#516fd2",
                      },
                      padding: "8px 16px",
                      width: "30%",
                      marginRight: "5px",
                    }}
                  >
                    <BsFillFileEarmarkBarGraphFill className="mr-1" />{" "}
                    ผลการประเมินเดือนที่ 3
                  </Button>
                )}
              </div>

              <div className="mt-1 grid grid-cols-3 gap-4">
                {totalScore1 > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handlePerformanceClick(1)}
                    sx={{
                      borderColor: "#2e7d32",
                      color: "#2e7d32",
                      borderRadius: "7px",
                      "&:hover": {
                        borderColor: "#388e3c",
                        backgroundColor: "rgba(46, 125, 50, 0.1)",
                        color: "#388e3c",
                      },
                      padding: "8px 16px",
                      width: "30%",
                      marginRight: "5px",
                    }}
                  >
                    <ImAddressBook className="mr-1" /> ผลการปฏิบัติงานเดือนที่ 1
                  </Button>
                )}

                {totalScore2 > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handlePerformanceClick(2)}
                    sx={{
                      borderColor: "#2e7d32",
                      color: "#2e7d32",
                      borderRadius: "7px",
                      "&:hover": {
                        borderColor: "#388e3c",
                        backgroundColor: "rgba(46, 125, 50, 0.1)",
                        color: "#388e3c",
                      },
                      padding: "8px 16px",
                      width: "30%",
                      marginRight: "5px",
                    }}
                  >
                    <ImAddressBook className="mr-1" /> ผลการปฏิบัติงานเดือนที่ 2
                  </Button>
                )}

                {totalScore3 > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handlePerformanceClick(3)}
                    sx={{
                      borderColor: "#2e7d32",
                      color: "#2e7d32",
                      borderRadius: "7px",
                      "&:hover": {
                        borderColor: "#388e3c",
                        backgroundColor: "rgba(46, 125, 50, 0.1)",
                        color: "#388e3c",
                      },
                      padding: "8px 16px",
                      width: "30%",
                      marginRight: "5px",
                    }}
                  >
                    <ImAddressBook className="mr-1" /> ผลการปฏิบัติงานเดือนที่ 3
                  </Button>
                )}
              </div>
            </center>
          </div>
        </div>
      </div>

      {/* <div className="pt-2 container2">
        <div className="left">
          <div className="cartcustom">
            <div className="ml-0 p-6 bg-white shadow-md rounded-lg">
              <div className="cartcustomTag bg-primary text-white mb-2">
                <h5 className="mb-0" style={{ fontSize: "14px" }}>
                  ความคิดเห็นของพี่เลี้ยง
                  (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                </h5>
              </div>

              <p className="mt-4">{mockData.employeeComments}</p>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="cartcustom">
            <div className="ml-0 p-6 bg-white shadow-md rounded-lg">
              <div className="cartcustomTag bg-primary text-white mb-2">
                <h5 className="mb-0" style={{ fontSize: "14px" }}>
                  ความคิดเห็นของพนักงานทดลองงาน
                </h5>
              </div>
              <p className="mt-4">{mockData.employeeComments}</p>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="pt-2">
        <div className="right">
          <div className="cartcustom">
            <div className="mt-2flex justify-around">
              <center>...</center>
            </div>
          </div>
        </div>
      </div> */}

      {/* Modal */}

      <Dialog
        open={open}
        PaperProps={{
          style: {
            borderRadius: 20,
            width: "1300px", // กำหนดความกว้างของ Dialog
            maxWidth: "100%", // กำหนดความกว้างสูงสุดของ Dialog
          },
        }}
        onClose={handleClose}
      >
        <ViewWorkLogForumReport activeKey={selectedMonth} idemployee={PerD} />

        <DialogActions>
          <Button onClick={handleClose} style={{ color: "gay" }}>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPerformanceModal}
        PaperProps={{
          style: {
            borderRadius: 20,
            width: "1500px", // กำหนดความกว้างของ Dialog
            maxWidth: "100%", // กำหนดความกว้างสูงสุดของ Dialog
          },
        }}
        onClose={() => setOpenPerformanceModal(false)}
      >
        <DialogTitle></DialogTitle>
        <ViewWorkLogHistory  activeKey={selectedMonth} idemployee={PerD}/>
       
        <DialogActions>
          <Button onClick={() => setOpenPerformanceModal(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MentorReadData_history_Viewmain;
