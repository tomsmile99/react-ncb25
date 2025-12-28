import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Modal, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import { Table } from "react-bootstrap";
import { IoMdCloseCircle } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import logo from "../../../public/logo_sak-02.png";
import { BsSendCheckFill } from "react-icons/bs";
import { MdDoneAll } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";
import LinearProgress from "@mui/material/LinearProgress";
import apiClient from "../../recoilstore/userStores";
import Pagination from "../../component/Pagination";
import loadingAnimation2 from "../../jsonfiles/Animation - 1739373993124.json";
import { useRecoilValue } from "recoil";
import Lottie from "lottie-react";
import { userToken } from "../../recoilstore/userStores";
import { Base64 } from "js-base64";
import { TbClockHour4, TbCircleCheckFilled } from "react-icons/tb";
import { FiFileText } from "react-icons/fi";
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

const Approver_President = ({}) => {
  let location = useLocation();

  const getstore = useRecoilValue(userToken);
  const _AgU = Base64.decode(getstore.AgU);
  const _PerPST = Base64.decode(getstore.PerPST);
  const PerDs = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST_N = Base64.decode(getstore.PerPST_N);
  const PerFuNas = Base64.decode(getstore.PerFuNas);

  const [getemployee, setGetemployee] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [approvedKeys, setApprovedKeys] = useState(false);

  const getEmployeeDB = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_Recruitment_approval_boss?PerWP=${_PerWP}&PerD=${PerDs}`
      );

      const { status, result } = data;
      if (status) {
        setGetemployee(result);

        // console.log(result);
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

  const [approvals, setApprovals] = useState([]); // ✅ ต้องเริ่มเป็น array
  const [approvals2, setApprovals2] = useState([]); // ✅ ต้องเริ่มเป็น array

  // ฟังก์ชันจัดการการเลือกอนุมัติ
  const handleApprovalChange = async (index, value, orderNumber) => {
    const confirmAction = await Swal.fire({
      title: value
        ? `ยืนยันการอนุมัติ? <br> เลขที่ฟอร์ม : ${orderNumber}`
        : `ยืนยันการไม่อนุมัติ? <br> เลขที่ฟอร์ม : ${orderNumber}`,
      icon: "question",
      input: "text", // ✅ เพิ่มช่องกรอกหมายเหตุ
      inputPlaceholder: value
        ? "กรอกหมายเหตุ (ถ้ามี)"
        : "กรุณากรอกเหตุผลการไม่อนุมัติ",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
      inputValidator: (remark) => {
        if (!value && !remark) {
          return "กรุณากรอกเหตุผลเมื่อไม่อนุมัติ"; // ✅ บังคับกรอกถ้าเลือก "ไม่อนุมัติ"
        }
        return null;
      },
    });

    if (!confirmAction.isConfirmed) return;

    // อัปเดต state
    const newApprovals = [...approvals];
    newApprovals[index] = [value, orderNumber, confirmAction.value || ""]; // ✅ เก็บ remark ด้วย
    setApprovals(newApprovals);

    try {
      // ส่ง API
      const payload = {
        order_number: orderNumber,
        approval: value,
        remark: confirmAction.value || "",
        Idpersss: PerDs,
        Idboss: "EXE002",
        fullnameboss: "นายศิวพงศ์ บุญสาลี",
        positionboss: "กรรมการผู้จัดการ",
        referenceNo: approvals2[index]?.[2] || "", // ✅ แปลงเป็น string เลย
      };

      console.log(payload);
      const response = await apiClient.post("/DataApprovals_boss", payload);

      // รีโหลดข้อมูลใหม่
      getEmployeeDB();

      // แสดง Swal success
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: response.data.message || "บันทึกการอนุมัติสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error sending approval:", error);
      // แสดง Swal error
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: "ไม่สามารถบันทึกการอนุมัติได้",
      });
    }
  };

  //   const handleApproveAll = () => {
  //     setApprovals(getemployee.map(() => true));
  //   };

  // สมมติ approvals เป็น array ของ [value, key] เช่น [[true, 123], [false, 124], ...]
  //   const handleApproveAll = () => {
  //     const newApprovals = getemployee.map((employee) => [
  //       true,
  //       employee.order_number,
  //     ]);
  //     setApprovals(newApprovals);

  //     // เก็บเฉพาะ key ของพนักงานที่ถูกอนุมัติ
  //     const newApprovedKeys = getemployee.map(
  //       (employee) => employee.order_number
  //     );
  //     setApprovedKeys(newApprovedKeys);

  //     console.log("Approvals after approve all:", newApprovals);
  //   };

  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleResetAll = () => {
    setApprovals(getemployee.map(() => null));
  };

  const [docData, setDocData] = useState([]); // เก็บข้อมูลที่ได้จาก API

  const handleViewDocument = async (data2) => {
    try {
      const { data } = await apiClient.get(
        `/show_getData_approval_gm?key=${data2}`
      );

      const { status, result } = data;
      if (status) {
        setDocData(result);

        // เปิด Modal
        setOpenModal(true);
        console.log(docData);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // ฟังก์ชันส่งข้อมูลการอนุมัติ
  const handleSubmitApprovals = async (approvalsData) => {
    try {
      console.log("Received Approvals Data:", approvalsData);

      // ถ้า approvalsData = newApprovals (เช่น [[true, 101], [true, 102]])
      const payload = approvalsData.map(([value, key]) => ({
        order_number: key,
      }));

      console.log("Payload:", payload);

      // ตัวอย่างเรียก API
      // const { data } = await apiClient.post("/DataApprovals_gm", payload);
      // const { status, result } = data;

      // if (status) {
      //   setOpenModal(true);
      // } else {
      //   console.error("Error: Status is not true. Received data:", data);
      // }
    } catch (error) {
      console.error("Error sending approvals:", error);
    }
  };

  useEffect(() => {
    getEmployeeDB();
  }, []);

  // เมื่อคำนวณเสร็จแล้ว เรียกใช้ฟังก์ชัน updateEmployeeCount
  // เรียกใช้ updateEmployeeCount เมื่อคำนวณเสร็จ

  return (
    <>
      <div className="cartcustom p-3 shadow-sm">
        <div className="cartcustom bg-primary text-white">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
            รายชื่อพนักงานทดลองงาน ( เสนอบรรจุ )
          </h5>
        </div>
        <div className="card-body">
          {getemployee.length > 0 ? (
            <div
              className="mb-3"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                transition: "0.3s",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center p-2"
                style={{
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                }}
              >
                <div className="col-md-1">
                  <center>ลำดับ</center>
                </div>
                <div className="col-md-3">ชื่อเอกสาร</div>
                <div className="col-md-2">เลขที่แบบฟอร์ม</div>
                <div className="col-md-2">
                  <center>วันที่มีผล</center>
                </div>

                <div className="col-md-2">
                  <center>เลขที่คำสั่ง</center>
                </div>
                <div className="col-md-2">
                  <center>การอนุมัติ</center>
                </div>
                <div className="col-md-1 text-center">อนุมัติ</div>
              </div>

              {/* Body */}
              {getemployee.map((employee, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center p-2 border-bottom"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div className="col-md-1 text-center">{index + 1}</div>

                  <div className="col-md-3 d-flex align-items-center">
                    รายการแจ้งขออนุมัติเสนอบรรจุพนักงาน
                  </div>

                  <div
                    className="col-md-2 text-muted d-flex align-items-center"
                    onClick={() => handleViewDocument(employee.order_number)}
                  >
                    <FiFileText
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      size={18}
                      title="ดูเอกสาร"
                    />
                    <span>{employee.order_number}</span>
                  </div>

                  <div className="col-md-2 text-muted">
                    <center>
                      {convertToThaiDate(employee.effective_date)}
                    </center>
                  </div>

                  <div className="col-md-2">
                    <input
                      type="text"
                      placeholder="เลขที่คำสั่ง"
                      value={approvals2[index]?.[2] || ""}
                      maxLength={9}
                     onChange={(e) => {
  const value = e.target.value.replace(/[^0-9/]/g, ""); // รับได้เฉพาะตัวเลขและ "/"
  const newApprovals = [...approvals2];
  if (!newApprovals[index]) newApprovals[index] = [];
  newApprovals[index][2] = value;
  setApprovals2(newApprovals);
}}
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                  <div
                    className="col-md-2"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <input
                        type="radio"
                        name={`approve-${index}`}
                        checked={approvals2[index]?.[0] === true}
                        disabled={!(approvals2[index]?.[2]?.length === 9)} // ถ้ายังไม่ครบ 9 หลัก จะ disable
                        onChange={() =>
                          handleApprovalChange(
                            index,
                            true,
                            employee.order_number
                          )
                        }
                      />
                      อนุมัติ
                    </label>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <input
                        type="radio"
                        name={`approve-${index}`}
                        checked={approvals2[index]?.[0] === false}
                        disabled={!(approvals2[index]?.[2]?.length === 9)} // ถ้ายังไม่ครบ 9 หลัก จะ disable
                        onChange={() =>
                          handleApprovalChange(
                            index,
                            false,
                            employee.order_number
                          )
                        }
                      />
                      ไม่อนุมัติ
                    </label>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="d-flex justify-content-end p-2 gap-2">
                {/* แสดงปุ่มส่งข้อมูลเฉพาะเมื่อมีรายการอนุมัติ */}

                {/* {approvals.some((approved) => approved) && (
                  <Button
                    onClick={handleSubmitApprovals}
                    variant="outlined"
                    color="success"
                    sx={{ borderRadius: "8px", mr: 1 }}
                  >
                    <BsSendCheckFill style={{ marginRight: "4px" }} />{" "}
                    ยืนยันการอนุมัติ
                  </Button>
                )} */}

                {/* <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleApproveAll}
                  sx={{ borderRadius: "8px" }}
                >
                  <MdDoneAll style={{ marginRight: "4px" }} /> อนุมัติทั้งหมด
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetAll}
                  sx={{ borderRadius: "8px", ml: 1 }}
                >
                  <RiResetLeftFill style={{ marginRight: "4px" }} />{" "}
                  รีเซ็ตทั้งหมด
                </Button> */}
              </div>
            </div>
          ) : (
            <center>
              <Lottie
                animationData={loadingAnimation2}
                loop={true}
                style={{ width: 900, height: 400 }}
              />
              <p style={{ color: "gray" }}>ไม่มีข้อมูลการเสนอบรรจุ..</p>
            </center>
          )}
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="document-modal-title"
        aria-describedby="document-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* ปุ่มกากบาท */}
          <div
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              right: "17px",
              top: "12px",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#d8d8d8",
            }}
          >
            <IoMdCloseCircle />
          </div>
          <div style={{ color: "#5e5e5eff" }}>
            เลขที่แบบฟอร์ม :{" "}
            {docData[0]?.order_number ? docData[0].order_number : "null"}
          </div>
          <Typography id="document-modal-title" variant="h6" component="h2">
            {/* โลโก้ตรงกลาง */}
            <div className="text-center mb-3">
              <img src={logo} alt="Logo" width="80" />
              <div className="mt-2">รายการแจ้งขออนุมัติเสนอบรรจุพนักงาน</div>
            </div>

            {/* หัวเรื่อง */}
            <div className="text-center mb-4">
              <h6>
                วันที่ออกรายงาน{" "}
                {docData[0]?.report_date
                  ? convertToThaiDate(docData[0].report_date)
                  : "null"}
              </h6>
              <h6>เรื่อง บรรจุพนักงาน</h6>
            </div>
            {/* หัวเรื่อง */}
            <div
              className="mb-2"
              style={{
                fontSize: "15px",
                lineHeight: "1", // ปรับตรงนี้ (ค่า default ~1.6)
                fontWeight: "1",
              }}
            >
              <center>
                <p>
                  ตามที่บริษัทฯ ได้รับพนักงานเข้ามาทดลองงาน
                  พบว่าพนักงานมีความกระตือรือร้นในการปฏิบัติหน้าที่ เรียนรู้
                  รับผิดชอบในงานและสามารถดำรงตนภายใต้วัฒนธรรมขององค์กรได้เป็นอย่างดีนั้น
                </p>
                <p>
                  เพื่อให้เป็นไปตามข้อบังคับตามกฎหมาย
                  โดยอาศัยอำนาจความเป็นบริษัท จดทะเบียนตามพระราชบัญญัติ บริษัท
                  มหาชนจำกัด เลขที่ 0107559000290 ให้บรรจุพนักงานจำนวน{" "}
                  {getemployee.length > 0 ? getemployee.length : "-"} อัตรา
                  ดังนี้
                </p>
              </center>
            </div>

            {/* ตารางรายชื่อ */}
            <Table striped bordered hover size="sm" className="mb-5">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>ลำดับ</th>
                  <th style={{ textAlign: "center" }}>รหัส</th>
                  <th style={{ textAlign: "center" }}>ชื่อ - นามสกุล</th>
                  <th style={{ textAlign: "center" }}>ตำแหน่ง</th>
                  <th style={{ textAlign: "center" }}>ความคิดเห็นของหัวหน้า</th>

                  <th style={{ textAlign: "center" }}>สถานที่บรรจุงาน</th>
                  <th style={{ textAlign: "center" }}>สังกัด</th>
                </tr>
              </thead>
              <tbody>
                {docData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  docData.map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.employee_id || "-"}
                      </td>
                      <td>{item.employee_fullname}</td>
                      <td>{item.employee_position}</td>
                      <td> {item.comment_leader}</td>
                      <td>{item.placement_location}</td>
                      <td>{item.employee_region}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="text-end">
              <center>
                <p style={{ fontSize: "14px" }}>
                  ให้ได้รับค่าตอบแทนและสิทธิประโยชน์อื่น ๆ ตามที่บริษัท ฯ กำหนด
                  ตั้งแต่วันที่{" "}
                  {docData[0]?.effective_date &&
                  !isNaN(new Date(docData[0].effective_date).getTime()) ? (
                    convertToThaiDate(docData[0].effective_date)
                  ) : (
                    <span className="text-danger">ยังไม่ได้ระบุ</span>
                  )}{" "}
                  เป็นต้นไป
                </p>
              </center>
              {/* <p>
                      ประกาศ ณ วันที่{" "}
                      {getOrders?.date_out_issuing && !isNaN(new Date(getOrders.date_out_issuing).getTime())
                        ? convertToThaiDate(getOrders.date_out_issuing)
                        : <span style={{ color: "red" }}>ยังไม่ได้ระบุ</span>}
                    </p> */}
            </div>

            <div className="text-end pt-3">
              {/* <p>การอนุมัติ</p>
            <p>
              {fullname} ยื่นแบบฟอร์มเมื่อ{" " 
              <span style={{ color: "red" }}>
                วันที่ {convertToThaiDate(new Date())}
              </span>
            </p> */}
              <div className="text-end pt-3">
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    margin: 0,
                  }}
                >
                  <FcApproval /> การอนุมัติ
                </p>
                <p style={{ fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                  {docData[0]?.hr_fullname} ผู้จัดทำ{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {convertToThaiDate(docData[0]?.report_date)}
                  </span>
                </p>
                <p style={{ fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                  {docData[0]?.manager_fullname} เสนอพิจารณา{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {convertToThaiDate(docData[0]?.manager_approval_date)}
                  </span>
                </p>
                <p style={{ fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                  {docData[0]?.executive_fullname} เสนออนุมัติ{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {convertToThaiDate(docData[0]?.executive_approv_date)}
                  </span>
                </p>
              </div>
            </div>
          </Typography>

          {getemployee.map((emp, index) => (
            <Typography key={index} sx={{ mt: 1 }}>
              {emp.firstname_PSN} {emp.lastname_PSN}
            </Typography>
          ))}
        </Box>
      </Modal>
    </>
  );
};

export default Approver_President;
