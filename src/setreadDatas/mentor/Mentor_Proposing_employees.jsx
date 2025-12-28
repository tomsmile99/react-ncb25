import React, { useState, useEffect } from "react";
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
import apiClient from "../../recoilstore/userStores";
import Pagination from "../../component/Pagination";
import { FcApproval } from "react-icons/fc";
const Mentor_Proposing_employees = ({
  FullnamePer,
  PerPhotoProfile_N,
  PerPST_N,
  PerWP_N,
  PerD,
  PerWP,
}) => {
  const [getemployee, setGetemployee] = useState([]);
  const [getcount, setGetcount] = useState([]);

  const getEmployeeDB = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_mentor_proposing_employees?PerWP=${PerWP}&PerD=${PerD}`
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
  //นับสถานะข้อมูลเมื่อพนักงานบันทึกผลมาแต่ยังไม่ได้ประเมิน
  const getCount_notify = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_count_mentor?PerWP=${PerWP}&PerD=${PerD}`
      );

      const { status, result } = data;

      if (status && Array.isArray(result)) {
        let employeeCount = "0";

        if (result.length === "0") {
          // ถ้าไม่มีค่า → set = 1
          employeeCount = "1";
        } else {
          // สมมติว่าคุณจะนับจำนวน employee_id
          employeeCount = result.length;
        }

        setGetcount(employeeCount);

        // console.log("API call successful. Count result:", employeeCount);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

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

  useEffect(() => {
    getEmployeeDB(); //
    getCount_notify(); // เรียกข้อมูลการแจ้งเตือน
  }, []);

  return (
    <>
      <div className="cartcustom p-3 shadow-sm">
        <div className="cartcustom bg-primary text-white">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
            รายชื่อพนักงานทดลองงาน ( รอเสนอบรรจุ )
          </h5>
        </div>
        <div className="card-body">
          {getemployee.length > 0 ? (
            <div className="row">
              {getemployee.map((employee, index) => {
                // const empId = employee.ID_personnel;
                // const count = getcount[empId]; // ดึง count ตาม ID_personnel
                return (
                  <div key={index} className="col-md-6 mb-3">
                    <NavLink
                      to={`/Mentor_Review_employees`}
                      state={{
                        idemployee: employee.ID_personnel,
                        fullname: `${employee.title_name}${employee.firstname_PSN} ${employee.lastname_PSN}`,
                        position: employee.position,
                        workplace: employee.workplace,
                        startworkdate_PSN: employee.startworkdate_PSN,
                        photo_PSN: employee.photo_PSN,
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        className="employee-card d-flex position-relative"
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
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        {/* ไอคอนผ่านทดลองงาน */}

                        {/* <div
                          style={{
                            position: "absolute",
                            top: "0.5rem",
                            right: "0.5rem",
                            backgroundColor: "#3c9065", // สีเขียว
                            color: "white",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "20px",
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                          }}
                        >
                          ผ่านการประเมิน
                        </div> */}
                        <div style={{ position: "relative" }}>
                          <Avatar
                            src={`https://apimb.sakerp.org/file_photoEMP/${employee.photo_PSN}`}
                            sx={{
                              width: 50,
                              height: 50,
                              mr: 2,
                              transition: "0.3s",
                              "&:hover": {
                                transform: "scale(1.1)",
                                boxShadow: 3,
                              },
                            }}
                            alt={employee.PerPhotoProfile_N}
                          />
                          {Number(getcount) > 0 && (
                            <span className="circle1">{getcount}</span>
                          )}
                        </div>

                        <div className="ms-3 w-100">
                          <div className="fw-bold" style={{ color: "#4285f4" }}>
                            {employee.ID_personnel} {employee.title_name}
                            {employee.firstname_PSN} {employee.lastname_PSN}
                          </div>
                          <div style={{ fontSize: "13px" }}>
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
                              style={{ fontSize: "0.70rem" }}
                            >
                              <span>{steps[currentStep - 1]}</span>
                              <span>{`ขั้นตอนที่ ${currentStep} จาก ${totalSteps}`}</span>
                            </div>
                          </div> */}
                        </div>
                        <img
                          src="/SAKAssessment/Insurance-amico.png"
                          className="brand-image pt-2"
                          style={{ height: 100, width: "auto", opacity: "0.2" }}
                          alt="loop-color"
                        />
                      </div>
                    </NavLink>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted">
              <img
                src="/SAKAssessment/Search-rafiki.png"
                className="brand-image pt-2"
                style={{ height: 350, width: "auto" }}
                alt="loop-color"
              />{" "}
              <br />
              ไม่มีข้อมูลพนักงาน...
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Mentor_Proposing_employees;
