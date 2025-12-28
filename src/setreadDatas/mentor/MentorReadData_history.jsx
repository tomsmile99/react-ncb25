import React, { useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";

import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { FaHistory } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const MentorReadData_history = ({
  FullnamePer,
  PerPhotoProfile_N,
  PerPST_N,
  PerWP_N,
  PerD,
  PerWP,
}) => {
  const [getemployee, setGetemployee] = useState([]);

  const getEmployeeDB = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_employee_mentor_affter?PerWP=${PerWP}&PerD=${PerD}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);
        setGetemployee(result);

        // console.log(result);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

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

  useEffect(() => {
    getEmployeeDB();
  }, []);
  // const getemployee = [
  //   {
  //     id: 1,
  //     name: "กันนิกา ใจดี",
  //     position: "วิเคราะห์สินเชื่อ",
  //     workpaan: "สาขาอุตรดิตถ์",
  //     profilePicture:
  //       "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg",
  //     datestart: "1/12/68",
  //     progress: 100, // เพิ่ม property progress (เริ่มจาก 0)
  //     score: 78,
  //   }
  //   // ... พนักงานคนอื่นๆ
  // ];

  const [steps, setSteps] = useState([
    "ขั้นตอนที่ 1: บันทึกผลปฏิบัติงาน",
    "ขั้นตอนที่ 2: อัปโหลดเอกสาร",
    "ขั้นตอนที่ 3: ตรวจสอบและยืนยัน",
    "ขั้นตอนที่ 4: บันทึกผลปฏิบัติงาน",
    "ขั้นตอนที่ 5: อัปโหลดเอกสาร",
    "ขั้นตอนที่ 6: ตรวจสอบและยืนยัน",
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <div className="cartcustom p-3 shadow-sm">
        <div className="cartcustom bg-primary text-white">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
            <FaHistory /> ประวัติการประเมินพนักงานทดลองงาน ( ประเมินแล้ว ) 
          </h5>
        </div>

        {/* <NavLink to="/mentor/DataFormReview"> */}
        <div className="card-body">
          {getemployee.length > 0 ? (
            <div className="row">
              {getemployee.map((employee, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <NavLink
                    to={`/Mentor_ReviewHistory`}
                    state={{
                      idemployee: employee.ID_personnel,
                      fullname: `${employee.title_name}${employee.firstname_PSN} ${employee.lastname_PSN}`,
                      position: employee.position,
                      workplace: employee.workplace,
                      startworkdate_PSN: employee.startworkdate_PSN,
                      photo_PSN: employee.photo_PSN,
                      ap_month: employee.ap_month,
                    }}
                  >
                    <div
                      className="employee-card d-flex"
                      style={{
                        transition: "0.3s",
                        borderRadius: "12px",
                        cursor: "pointer",
                        background: "#ffffff",
                        boxShadow:
                          "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        padding: "1rem",
                        zIndex: 10,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fafafa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <Avatar
                        src={`https://apimb.sakerp.org/file_photoEMP/${employee.photo_PSN}`}
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          transition: "0.3s",
                          "&:hover": { transform: "scale(1.1)", boxShadow: 3 },
                        }}
                        alt={employee.PerPhotoProfile_N}
                      />
                      <div className="ms-3 w-100">
                        <div className="fw-bold">
                          {employee.title_name}
                          {employee.firstname_PSN} {employee.lastname_PSN}
                        </div>
                        <div className="text-muted small">
                          <div>ตำแหน่ง : {employee.position}</div>
                          <div>พื้นที่ปฏิบัติงาน : {employee.workplace}</div>
                          <div>สังกัด : {employee.belong}</div>
                        </div>

                        {/* <div className="mt-2">
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ width: "100%" }}
                          />
                          <div
                            className="d-flex justify-content-between mt-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            <span>{steps[currentStep - 1]}</span>
                            <span>{`ขั้นตอนที่ ${currentStep} จาก ${totalSteps}`}</span>
                          </div>
                        </div> */}
                      </div>

                       <img
                    src="/SAKAssessment/Insurance-amico.png"
                    className="brand-image pt-2"
                    style={{ height: 100, width: "auto" , opacity :'0.2' }}
                    alt="loop-color"
                  />
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
               <img
                    src="/SAKAssessment/Search-rafiki.png"
                    className="brand-image pt-2"
                    style={{ height: 350, width: "auto" }}
                    alt="loop-color"
                  /> <br/>
              ไม่มีข้อมูลพนักงาน</p>
          )}
        </div>

        {/* </NavLink> */}
      </div>
    </>
  );
};

export default MentorReadData_history;
