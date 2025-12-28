import { useState, useEffect } from "react";
import apiClient from "../../../recoilstore/userStores";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import loadingAnimation2 from "../../../jsonfiles/Animation - 1738920187381.json";
import loadingAnimation1 from "../../../jsonfiles/Animation - 1746696323972.json";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ใช้ theme "snow"

// import Lottie from "react-lottie-player";
import Lottie from "lottie-react";

import Swal from "sweetalert2";

import { Tab, Tabs } from "react-bootstrap";
import WorkLogForum from "../../../component/WorkLogForum";
import { HiCheckCircle } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { FcTimeline, FcBullish, FcOvertime } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaCircleArrowRight } from "react-icons/fa6";

import { useRecoilValue } from "recoil";
import { userToken } from "../../../recoilstore/userStores";

const ProposeIdea = () => {
  const userDetails = useRecoilValue(userToken);

  const [isEdit, setIsEdit] = useState(false); // <-- state ใหม่

  const [statustast, setStatustast] = useState(1); // <-- state ใหม่

  // Function to decode Base64
  const decodeBase64 = (encodedString) => {
    //แปลง Base 64 จาก token
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("Error decoding Base64 string", error);
      return encodedString;
    }
  };

  const decodedPerD = decodeBase64(userDetails.PerD); // รหัสผู้บันทึก
  const [step, setStep] = useState(1); // 1 = form แนวคิด, 2 = บทความแสดงความรู้สึก
  const [stepchk, setStepchk] = useState(1); // 1 = form แนวคิด, 2 = บทความแสดงความรู้สึก

  const goNextStep = () => setStep((prev) => prev + 1);
  const goPrevStep = () => setStep((prev) => prev - 1);
  const [feelingText, setFeelingText] = useState("");
  const [getemployee, setGetemployee] = useState([]);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
      mode: "onBlur",
    },
    { validateHiddenInputs: true }
  );

  //ส่งข้อมูล

  const sendForm = (data) => {
    const dataSet = {
      ideaTopic: data.ideaTopic || "",
      ideaBenefit: Array.isArray(data.ideaBenefit)
        ? data.ideaBenefit
        : [data.ideaBenefit].filter(Boolean),
      ideaRationale: data.ideaRationale || "",
      actionPlan: data.actionPlan || "",
      expectedOutcome: data.expectedOutcome || "",
      budgetAmount: data.budgetAmount || "",
      ID_personnel_em: decodedPerD,
    };

    // const newDataSend = {
    //   ...dataSet,
    // };

    // console.log(newDataSend);

    const apiUrl = isEdit ? `/idea_update` : `/idea_inseart`; // <-- เลือก endpoint

    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: isEdit
        ? "ต้องการแก้ไขรายการนี้ใช่หรือไม่?"
        : "ต้องการบันทึกรายการนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ดำเนินการ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .post(apiUrl, dataSet)
          .then((response) => {
            Swal.fire({
              title: "สำเร็จ!",
              text: isEdit ? "แก้ไขข้อมูลสำเร็จ" : "บันทึกข้อมูลสำเร็จ",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            ReadDataedit();
            setStep(2); // ไปยัง step ถัดไปเมื่อส่งสำเร็จ
            // setIsEdit(false); //เมื่อมีข้อมูล
          })
          .catch((error) => {
            console.error("เกิดข้อผิดพลาด!", error);
            Swal.fire({
              title: "เกิดข้อผิดพลาด!",
              text: isEdit
                ? "ไม่สามารถแก้ไขข้อมูลได้"
                : "ไม่สามารถบันทึกข้อมูลได้",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "ยกเลิก",
          text: "ยกเลิกรายการ",
          icon: "info",
          confirmButtonText: "ตกลง",
        });
      }
    });
  };

  const ReadDataedit = async () => {
    apiClient
      .get(`/idea_ReadDate?id=${decodedPerD}`) // ถ้าเป็นฟังชันอื่นที่ไม่ใช่ index  .get(`/otherFunction?id=${ids}`)
      .then((response) => {
        const result = response.data;

        if (
          result.status === true &&
          Array.isArray(result.result) &&
          result.result.length > 0
        ) {
          const data = result.result[0];

          // ตรวจสอบว่ามีค่า ideaTopic ก่อน setValue
          setValue("ideaTopic", data.ideaTopic || "");

          // แปลง string เป็น array ด้วย .split(', ') (ต้องตรงกับ backend ที่ใช้ implode(', '))
          const benefitArray = data.ideaBenefit
            ? data.ideaBenefit.split(", ")
            : [];
          setValue("ideaBenefit", benefitArray);

          setValue("ideaRationale", data.ideaRationale || "");
          setValue("actionPlan", data.actionPlan || "");
          setValue("expectedOutcome", data.expectedOutcome || "");
          setValue("budgetAmount", data.budgetAmount || "");

          setIsEdit(true);
          setStep(2); // ไปยัง step ถัดไปเมื่อส่งสำเร็จ
          setStepchk(1); //ถ้ามีค่าไปแสดงว่าเสร็จแล้ว
        } else {
          setValue("ideaTopic", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("ideaBenefit", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("ideaRationale", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("actionPlan", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("expectedOutcome", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("budgetAmount", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setIsEdit(false);
          setStep(1); // ไปยัง step ถัดไปเมื่อส่งสำเร็จ
          setStepchk(0); //ถ้ามีค่าไปแสดงว่าเสร็จแล้ว
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  //แสดงความรู้สึก
  const ReadDatfeelings = async () => {
    try {
      const { data } = await apiClient.get(
        `/feelings_ReadDate?id=${decodedPerD}`
      );

      const { status, result } = data;
      if (status) {
        const hasFeeling =
          Array.isArray(result) &&
          result.length > 0 &&
          result[0].details_feeling;

        if (hasFeeling) {
          setFeelingText(result[0].details_feeling || "");
          setStep(3);
          setStepchk(2);
        } else {
          setFeelingText("");
          setStep(1);
        }
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error?.message || error);
    }
  };

  // ฟังก์ชันบันทึกความรู้สึก (สร้างหรือแก้ไข)
  const SaveFeeling = async (feelingMessage) => {
    try {
      // สมมติ API รับ POST เพื่อบันทึกข้อมูล
      const payload = {
        ids: decodedPerD,
        details_feeling: feelingMessage,
      };

      const { data } = await apiClient.put("/feelings_update", payload);
      const { status, result } = data;
      if (status) {
        Swal.fire({
          title: "สำเร็จ!",
          text: "แก้ไขข้อมูลสำเร็จ",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setFeelingText(feelingMessage); // อัพเดต state ถ้าบันทึกสำเร็จ
        setStep(3);
        setStatustast(3);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // ฟังก์ชันบันทึกความรู้สึก (สร้างหรือแก้ไข)
  const [statusTast, setStatusTast] = useState(0); // 🔹 ค่าเริ่มต้น 0 = ยังไม่ผ่าน
  const Chk_statusFeeling = async (decodedPerD) => {
    try {
      const { data } = await apiClient.get(
        `/chk_status_feelings?PerD=${decodedPerD}`
      );
      const { status, result } = data;
      if (status && result && result.length > 0) {
        setStatusTast(1); // 🔹 ถ้ามีข้อมูล -> ตั้งค่าเป็น 1 (ผ่านแล้ว)
      } else {
        setStatusTast(0); // 🔹 ถ้าไม่มีข้อมูล -> ยังไม่ผ่าน
        console.log("ไม่มีข้อมูล:", result);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await ReadDataedit(); // รอให้ทำงานเสร็จก่อน
      await ReadDatfeelings(); // แล้วค่อยเรียกอันนี้
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // หน่วง 2 วินาที
      await Chk_statusFeeling(decodedPerD); // แล้วค่อยเรียกอันนี้

      return () => clearTimeout(timer); // เคลียร์ timer ถ้า component ถูก unmount
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (decodedPerD) {
  //     Chk_statusFeeling(decodedPerD);
  //   }
  // }, [decodedPerD]);

  const steps = [
    "เสนอแนวคิด",
    "เขียนความรู้สึกตลอดระยะเวลาในการปฏิบัติงาน",
    "รอการประเมินผล",
  ];

  const [open, setOpen] = useState(false);
  const handleAssessmentClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {" "}
      <div className="container">
        <div className="cartcustom mb-2">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={stepchk} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontSize: "13px", // ปรับขนาดฟอนต์ตรงนี้
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
        <>
          {loading ? (
            <div className="cartcustom">
              <div className="container4">
                <div className="mt-2 row ">
                  <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <Lottie
                      animationData={loadingAnimation1}
                      loop={true}
                      style={{ width: 900, height: 400 }}
                    />
                    <p>กำลังโหลดข้อมูล...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {(step === 0 || step === 1) && (
                <>
                  <div className="cartcustom">
                    <div className="container4">
                      <div className="mt-2 row ">
                        <div className="col-md-12">
                          <div className="cartcustom3 mb-2 mt-2">
                            <div className="d-flex align-items-center">
                              <div className="text-content">
                                <span
                                  className="welcome-text"
                                  style={{ fontSize: "14px" }}
                                >
                                  คำชี้แจง :
                                  แนวคิดของท่านต้องบอกถึงแนวปฏิบัติและวิธีการแบบละเอียดเป็นรูปธรรมหรือนวัตกรรม
                                  ที่สามารถส่งเสริมสร้างประโยชน์ทางเศรษฐกิจ
                                  สังคม และ/หรือสิ่งแวดล้อมให้มีความหลากหลาย
                                  สามารถศึกษาจากแนวคิดที่นำเสนอมาได้เพื่อนำมาปรับใช้และปฏิบัติได้จริง
                                </span>

                                <button
                                  className="custom-buttonStartcont"
                                  onClick={handleAssessmentClick}
                                >
                                  ตัวอย่างการเขียนแนวคิด
                                </button>
                              </div>
                            </div>
                          </div>

                          <form
                            className="pt-3 "
                            onSubmit={handleSubmit(sendForm)}
                          >
                            <label>แนวคิดเรื่อง </label>
                            <br />
                            <input
                              {...register("ideaTopic")}
                              id="ideaTopic"
                              name="ideaTopic"
                              type="text"
                              className="form-control"
                              placeholder="พิมพ์ข้อความของคุณที่นี่..."
                              style={{ fontSize: "14px" }}
                            />
                            <br />

                            <label>ประโยชน์ของแนวคิด </label>
                            <br />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                fontSize: "14px",
                              }}
                            >
                              <div className="form-check">
                                <div>
                                  <FcTimeline
                                    style={{
                                      fontSize: "60px",
                                      display: "block",
                                      margin: "0 auto 10px",
                                    }}
                                  />
                                </div>
                                <input
                                  {...register("ideaBenefit")}
                                  className="form-check-input"
                                  type="checkbox"
                                  value="ลดขั้นตอนการทำงาน"
                                  id="benefit1"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="benefit1"
                                  style={{
                                    color: "#0247b5",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {/* <FcTimeline style={{ fontSize: "16px" }} />{" "} */}
                                  ลดขั้นตอนการทำงาน
                                </label>
                              </div>

                              <div className="form-check">
                                <div>
                                  <FcBullish
                                    style={{
                                      fontSize: "60px",
                                      display: "block",
                                      margin: "0 auto 10px",
                                    }}
                                  />
                                </div>
                                <input
                                  {...register("ideaBenefit")}
                                  className="form-check-input"
                                  type="checkbox"
                                  value="พัฒนาการทำงาน"
                                  id="benefit2"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="benefit2"
                                  style={{
                                    color: "#0247b5",
                                    fontWeight: "bold",
                                  }}
                                >
                                  พัฒนาการทำงาน
                                </label>
                              </div>

                              <div className="form-check">
                                <div>
                                  <FcOvertime
                                    style={{
                                      fontSize: "60px",
                                      display: "block",
                                      margin: "0 auto 10px",
                                    }}
                                  />
                                </div>
                                <input
                                  {...register("ideaBenefit")}
                                  className="form-check-input"
                                  type="checkbox"
                                  value="ประหยัดหรือลดความสูญเสีย"
                                  id="benefit3"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="benefit3"
                                  style={{
                                    color: "#0247b5",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ประหยัดหรือลดความสูญเสีย
                                </label>
                              </div>
                            </div>

                            <br />

                            <label>หลักการและเหตุผล </label>
                            <br />

                            <textarea
                              {...register("ideaRationale")}
                              id="ideaRationale"
                              className="form-control"
                              rows="5"
                              placeholder="พิมพ์ข้อความของคุณที่นี่..."
                              style={{ fontSize: "14px" }}
                            ></textarea>
                            <br />

                            <label>
                              วิธีดำเนินการ (อธิบายเป็นข้อ ๆ อย่างละเอียด){" "}
                            </label>
                            <br />
                            <textarea
                              {...register("actionPlan")}
                              id="actionPlan"
                              className="form-control"
                              rows="5"
                              placeholder="พิมพ์ข้อความของคุณที่นี่..."
                              style={{ fontSize: "14px" }}
                            ></textarea>
                            <br />

                            <label>ผลที่คาดว่าจะได้รับ </label>
                            <textarea
                              {...register("expectedOutcome")}
                              id="expectedOutcome"
                              className="form-control"
                              rows="4"
                              placeholder="พิมพ์ข้อความของคุณที่นี่..."
                              style={{ fontSize: "14px" }}
                            ></textarea>
                            <br />

                            <label>งบประมาณ </label>
                            <br />
                            <textarea
                              {...register("budgetAmount")}
                              id="budgetAmount"
                              className="form-control"
                              rows="1"
                              placeholder="พิมพ์ข้อความของคุณที่นี่..."
                              style={{ fontSize: "14px" }}
                            ></textarea>
                            <br />
                            <div className="col-md-12 text-right mt-3">
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                  "&:hover": { backgroundColor: "#5a94f2" },
                                  padding: "8px 16px",
                                  borderRadius: "20px",
                                }}
                                type="submit"
                                fullWidth
                              >
                                <IoIosSend className="mr-2" />{" "}
                                {isEdit ? "แก้ไขแนวคิด" : "เสนอแนวคิด"}
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>{" "}
                      <br />
                    </div>
                    {isEdit && (
                      <div
                        className="mt-4"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <button
                          onClick={() => goNextStep()}
                          className="custom-buttonNext"
                          style={{
                            width: "10%",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          หน้าถัดไป <FaCircleArrowRight />
                        </button>
                      </div>
                    )}
                  </div>{" "}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="cartcustom mt-2">
                    <div className="container4">
                      <div className="cartcustom3 mb-2 mt-1">
                        <div className="d-flex align-items-center">
                          <div className="text-content">
                            <span
                              className="welcome-text"
                              style={{ fontSize: "14px" }}
                            >
                              บทความแสดงความรู้สึกตลอดระยะเวลาการทำงาน
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 row">
                        <div className="col-md-12">
                          <div className="">
                            {/* <label htmlFor="details_feeling" className="form-label">ความรู้สึก/ข้อเสนอแนะ</label> */}
                            <ReactQuill
                              id="details_feeling"
                              theme="snow"
                              value={feelingText}
                              onChange={setFeelingText}
                              style={{ height: "500px", fontSize: "14px" }}
                            />
                          </div>
                        </div>

                        <div className="col-md-12 text-right mt-3">
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#4285f4",
                              color: "white",
                              "&:hover": { backgroundColor: "#5a94f2" },
                              padding: "8px 16px",
                              borderRadius: "20px",
                            }}
                            onClick={() => SaveFeeling(feelingText)} // ส่งค่าที่แก้ไขไป
                            fullWidth
                          >
                            <IoIosSend className="mr-2" />{" "}
                            บันทึกข้อมูลการแสดงความรู้สึก
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "left" }} className="mt-4">
                      <button
                        onClick={() => goPrevStep()}
                        className="custom-buttonNext"
                        style={{ width: "10%", padding: "5px" }}
                      >
                        <FaCircleArrowLeft className="mr-2 align-middle" />{" "}
                        ก่อนหน้านี้
                      </button>
                    </div>
                  </div>{" "}
                </>
              )}

              {step === 3 && (
                <>
                  <div className="cartcustom">
                    <div className="container4">
                      <div className="mt-2 row ">
                        <div className="col-md-12">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {statusTast === 1 ? (
                              // 🔹 ถ้าผ่านแล้ว
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "24px",
                                  // background: "linear-gradient(135deg, #1c3effff, #aab4f5ff)",

                                  maxWidth: "500px",
                                  margin: "40px auto",
                                  textAlign: "center",
                                  fontFamily: "'Prompt', sans-serif",
                                  position: "relative",
                                }}
                              >
                                {/* 🎉 ภาพประกอบ */}
                                <img
                                  src="/SAKAssessment/Insurance-amico.png"
                                  className="brand-image pt-2"
                                  style={{ height: 350, width: "auto" }}
                                  alt="loop-color"
                                />

                                {/* 🎉 ข้อความ */}
                                <h2
                                  style={{
                                    color: "#4285f4",
                                    fontSize: "22px",
                                    fontWeight: "700",
                                    marginBottom: "8px", 
                                  }}
                                >
                                  🎉 ขอแสดงความยินดี
                                </h2>
                                <p
                                  style={{
                                    color: "#333",
                                    fontSize: "16px",
                                    lineHeight: "1.8",
                                    maxWidth: "380px",
                                  }}
                                >
                                  ท่านผ่านการทดลองงานเรียบร้อยแล้ว
                                  และได้รับการบรรจุเป็นพนักงานประจำ
                                </p>

                                {/* แถบตกแต่งล่าง */}
                                <div
                                  style={{
                                    width: "80px",
                                    height: "5px",
                                    borderRadius: "5px",
                                    background:
                                      "linear-gradient(to right, #4285f4, #1f58d4ff)",
                                    marginTop: "16px",
                                  }}
                                ></div>
                              </div>
                            ) : (
                              // 🔹 ถ้ายังอยู่ระหว่างการประเมิน
                              <>
                                <Lottie
                                  animationData={loadingAnimation2}
                                  loop={true}
                                  style={{ width: 900, height: 400 }}
                                />
                                <p
                                  style={{
                                    marginTop: "12px",
                                    color: "#555",
                                    fontSize: "16px",
                                  }}
                                >
                                  ข้อมูลของท่านกำลังอยู่ระหว่างขั้นตอนการประเมินผลโดยพี่เลี้ยงและหัวหน้า
                                  กรุณากลับเข้ามาตรวจสอบผลอีกครั้งในภายหลัง
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <br />
                    </div>
                    {isEdit && (
                      <div
                        className="mt-4"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <button
                          onClick={() => goPrevStep()}
                          className="custom-buttonNext"
                          style={{ width: "10%", padding: "5px" }}
                        >
                          <FaCircleArrowLeft className="mr-2 align-middle" />{" "}
                          ก่อนหน้านี้
                        </button>
                      </div>
                    )}
                  </div>{" "}
                </>
              )}
            </>
          )}
        </>
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
        {/* ส่วนหัวของ Modal */}
        <DialogTitle
          style={{ fontWeight: "bold", fontSize: "20px", padding: "16px 24px" }}
        >
          ตัวอย่างการเขียนแนวคิด
        </DialogTitle>

        <div className="col-md-12">
          <div className="container">
            <DialogContent
              dividers
              style={{
                maxHeight: "80vh", // ความสูงสูงสุดของเนื้อหา (ปรับได้ตามต้องการ)
                overflowY: "auto",
              }}
            >
              <form className="pt-3">
                <label>แนวคิดเรื่อง </label>
                <br />
                <input
                  id="feelingInput"
                  type="text"
                  className="form-control"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  style={{ fontSize: "14px" }}
                  value={"พัฒนาระบบวิเคราะห์สินเชื่อ"}
                  disabled
                />
                <br />

                <label>ประโยชน์ของแนวคิด </label>
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: "14px",
                  }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feelingOption"
                      id="feelingOption1"
                      value="ลดขั้นตอนการทำงาน"
                      defaultChecked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="feelingOption1"
                    >
                      ลดขั้นตอนการทำงาน
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feelingOption"
                      id="feelingOption2"
                      value="พัฒนาการทำงาน"
                      disabled
                    />
                    <label
                      className="form-check-label"
                      htmlFor="feelingOption2"
                    >
                      พัฒนาการทำงาน
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="feelingOption"
                      id="feelingOption3"
                      value="ประหยัดหรือลดความสูญเสีย"
                      disabled
                    />
                    <label
                      className="form-check-label"
                      htmlFor="feelingOption3"
                    >
                      ประหยัดหรือลดความสูญเสีย
                    </label>
                  </div>
                </div>

                <br />

                <label>หลักการและเหตุผล </label>
                <br />
                <textarea
                  id="feelingTextarea"
                  className="form-control"
                  rows="3"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  style={{ fontSize: "14px" }}
                  value={`               ในการพิจารณาสินเชื่อในปัจจุบัน ยังมีการใช้เอกสารและการประเมินแบบแมนนวลจำนวนมาก ซึ่งอาจทำให้เกิดความล่าช้า ความผิดพลาด และไม่สามารถติดตามสถานะการพิจารณาได้อย่างมีประสิทธิภาพ จึงมีแนวคิดในการพัฒนาระบบวิเคราะห์สินเชื่อขึ้น เพื่อช่วยลดภาระของเจ้าหน้าที่ ปรับปรุงกระบวนการตัดสินใจให้รวดเร็ว และมีมาตรฐานมากยิ่งขึ้น`}
                  disabled
                ></textarea>
                <br />

                <label>วิธีดำเนินการ (อธิบายเป็นข้อ ๆ อย่างละเอียด) :</label>
                <br />
                <textarea
                  id="feelingTextarea"
                  className="form-control"
                  rows="10"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  style={{ fontSize: "14px" }}
                  value={`
                1. สร้างแบบฟอร์มกรอกข้อมูลสินเชื่อในระบบกลาง โดยให้ลูกค้าหรือเจ้าหน้าที่ป้อนข้อมูลได้โดยตรง
                2. ระบบดึงข้อมูลจากฐานข้อมูลภายใน เช่น ประวัติการชำระเงิน รายได้ หนี้สิน เพื่อนำมาวิเคราะห์
                3. ใช้เครื่องมือวิเคราะห์ (เช่น ระบบคะแนนเครดิต หรือโมเดล AI) เพื่อประเมินความเสี่ยง
                4. แสดงผลการวิเคราะห์ในรูปแบบ Dashboard พร้อมคำแนะนำเบื้องต้น
                5. มีระบบแจ้งเตือนสถานะการพิจารณาให้เจ้าหน้าที่ที่เกี่ยวข้อง
                6. จัดเก็บเอกสารและข้อมูลไว้อย่างเป็นระบบ ตรวจสอบย้อนหลังได้ง่าย`}
                  disabled
                />
                <br />

                <label>ผลที่คาดว่าจะได้รับ </label>
                <textarea
                  id="feelingTextarea"
                  className="form-control"
                  rows="6"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  style={{ fontSize: "14px" }}
                  value={`
                 1. ลดระยะเวลาในการวิเคราะห์สินเชื่อจากหลายวันเหลือไม่กี่ชั่วโมง
                 2. ลดความผิดพลาดจากการประเมินโดยบุคคล
                 3. ทำให้กระบวนการพิจารณามีความโปร่งใส และตรวจสอบได้
                 4. ช่วยให้ลูกค้าได้รับบริการที่รวดเร็วและน่าเชื่อถือมากขึ้น`}
                  disabled
                ></textarea>
                <br />

                <label>งบประมาณ </label>
                <br />
                <textarea
                  id="feelingTextarea"
                  className="form-control"
                  rows="2"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  style={{ fontSize: "14px" }}
                  value={"ใช้ทรัพยากรภายในในการพัฒนา (ไม่ใช้งบประมาณเพิ่มเติม)"}
                  disabled
                ></textarea>
                <br />
              </form>
            </DialogContent>
          </div>
        </div>
        {/* ปุ่มด้านล่าง */}
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "gray" }}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProposeIdea;
