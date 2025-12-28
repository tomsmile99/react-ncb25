import React, { useState, useEffect } from "react";
import apiClient from "../../../recoilstore/userStores";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { ImAddressBook } from "react-icons/im";

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
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";

import ViewWorkLogForumReport from "../../../component/ViewWorkLogForumReport";
import ViewWorkLogHistory from "../../../component/ViewWorkLogHistory";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const DashboardMain = ({
  FullnamePer,
  PerPhotoProfile_N,
  PerPST_N,
  PerWP_N,
  PerD,
}) => {


  

  const [steps, setSteps] = useState([
    "ประเมินครั้งที่ 1 ",
    "ประเมินครั้งที่ 2 ",
    "ประเมินครั้งที่ 3 ",
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const employee = {
    // ข้อมูลพนักงานคนเดียว
    id: 1,
    name: FullnamePer,
    position: PerPST_N,
    workpaan: PerWP_N,
    profilePicture:
      `https://apimb.sakerp.org/file_photoEMP/` + PerPhotoProfile_N,
    datestart: "2568-11-01",
  };

  const [questionMain, setQuestionMain] = useState([]);
  const [scoreMain, setScoreMain] = useState([]);
  const [scoreMain2, setScoreMain2] = useState([]);
  const [scoreMain3, setScoreMain3] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);


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


  const show_approval_mentor = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_approval_mentor?activeKey=${activeKey}&idemployee=${PerD}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);
        setApproval(result);
        const fetchedComment = result[0]?.ap_comment_emp ?? ""; // ถ้าไม่มี comment ให้ใส่ค่าว่าง
        setComment(fetchedComment);

        const status_approval = result[0]?.ap_status_head ?? ""; // ถ้าไม่มี comment ให้ใส่ค่าว่าง
        setStatus_app(status_approval);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };


  const mockData = {
  
    employeeComments: "ขอบคุณสำหรับคำแนะนำจากพี่เลี้ยง",
   
  };




  const getScore_question_db = async () => {
    // คะแนนตาราง
    try {
      const { data } = await apiClient.get(`/score_question_db?idPer=${PerD}`);

      const { status, result } = data;
      if (status) {
        setScoreMain(result.month1);
        setScoreMain2(result.month2);
        setScoreMain3(result.month3);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
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

  const handlePerformanceClick = (month) => {
    setSelectedMonth(month);
    setOpenPerformanceModal(true);
  };

  useEffect(() => {
    getScoreAssesmentDB();
    getScore_question_db(); // คะแนนรวม
  }, []);

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
            </div>
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
      <div className="pt-2">
        <div
          className="cartcustom"
          style={{ color: "#f51000", whiteSpace: "nowrap", fontWeight: "bold" }}
        >
          <span className="text-black font-bold">
            หมายเหตุ : คะแนนประเมินครั้งที่ 3 ต้องไม่ต่ำกว่า 90 คะแนน
            กรณีคะแนนต่ำกว่า 90 คะแนน มีผลทำให้ต้องเพิ่มระยะเวลาทดลองงาน
            ไม่ผ่านการทดลองงาน และหรือไม่มีสิทธิ์บรรจุงาน
          </span>
        </div>
      </div>

      {/* Modal */}

      <Dialog
        open={open}
        PaperProps={{
          style: {
            borderRadius: 20,
            width: "1000px", // กำหนดความกว้างของ Dialog
            maxWidth: "100%", // กำหนดความกว้างสูงสุดของ Dialog
          },
        }}
        onClose={handleClose}
      >
        {" "}
        {/* ส่วนหัวของ Modal */}
        <DialogTitle
          style={{ fontWeight: "bold", fontSize: "14px", padding: "16px 24px" }}
        >
          แบบประเมินพนักงานทดลองงาน
        </DialogTitle>
        <DialogContent
          dividers
          style={{
            maxHeight: "100vh", // ความสูงสูงสุดของเนื้อหา (ปรับได้ตามต้องการ)
            overflowY: "auto",
          }}
        >
          <ViewWorkLogForumReport activeKey={selectedMonth} idemployee={PerD} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "gay" }}>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal  */}
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
        <ViewWorkLogHistory activeKey={selectedMonth} idemployee={PerD} />

        <DialogActions>
          <Button onClick={() => setOpenPerformanceModal(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardMain;
