import { useState, useEffect } from "react";
import apiClient from "../../../recoilstore/userStores";
import { useForm, Controller } from "react-hook-form";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Swal from "sweetalert2";

import { Tab, Tabs } from "react-bootstrap";
import WorkLogForum from "../../../component/WorkLogForum";
import { HiCheckCircle } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { FcTimeline } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { FcOvertime } from "react-icons/fc";
import { FcBullish } from "react-icons/fc";
import { useRecoilValue } from "recoil";
import { userToken } from "../../../recoilstore/userStores";

const ProposeIdea = ({ FullnamePer, PerPhotoProfile_N, PerPST_N, PerWP_N }) => {
  const userDetails = useRecoilValue(userToken);
  const [isEdit, setIsEdit] = useState(false); // <-- state ใหม่
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
            // ReadDataedit();
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
        } else {
          setValue("ideaTopic", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("ideaBenefit", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("ideaRationale", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("actionPlan", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("expectedOutcome", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setValue("budgetAmount", ""); // กรณีไม่มีข้อมูล ให้เคลียร์ input
          setIsEdit(false);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  useEffect(() => {
    ReadDataedit();
  }, []);

  const [tabs, setTabs] = useState([
    { key: "1", title: "เดือนที่ 1" },
    { key: "2", title: "เดือนที่ 2" },
    { key: "3", title: "เดือนที่ 3" },
  ]);
  const [activeKey, setActiveKey] = useState("1");
  const [tabCounter, setTabCounter] = useState(4);
  const [open, setOpen] = useState(false);

  const handleAddTab = () => {
    const newTabKey = tabCounter.toString();
    const newTab = { key: newTabKey, title: `เดือนที่ ${tabCounter}` };
    setTabs([...tabs, newTab]);
    setActiveKey(newTabKey);
    setTabCounter(tabCounter + 1);
  };

  const handleSelect = (k) => {
    if (k === "addTab") {
      handleAddTab();
    } else {
      setActiveKey(k);
    }
  };
  const employee1 = {
    // ข้อมูลพนักงานคนเดียว
    id: 1,
    name: FullnamePer,
    position: PerPST_N,
    workpaan: PerWP_N,
    profilePicture:
      `https://apimb.sakerp.org/file_photoEMP/` + PerPhotoProfile_N,
    datestart: "2568-11-01",
  };

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
                        ที่สามารถส่งเสริมสร้างประโยชน์ทางเศรษฐกิจ สังคม
                        และ/หรือสิ่งแวดล้อมให้มีความหลากหลาย
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

                <form className="pt-3 " onSubmit={handleSubmit(sendForm)}>
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
                        style={{ color: "#0247b5", fontWeight: "bold" }}
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
                      <label className="form-check-label" htmlFor="benefit2"  style={{ color: "#0247b5", fontWeight: "bold" }}>
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
                      <label className="form-check-label" htmlFor="benefit3"  style={{ color: "#0247b5", fontWeight: "bold" }}>
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
                    rows="4"
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                    style={{ fontSize: "14px" }}
                  ></textarea>
                  <br />

                  <label>วิธีดำเนินการ (อธิบายเป็นข้อ ๆ อย่างละเอียด) </label>
                  <br />
                  <textarea
                    {...register("actionPlan")}
                    id="actionPlan"
                    className="form-control"
                    rows="4"
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                    style={{ fontSize: "14px" }}
                  ></textarea>
                  <br />

                  <label>ผลที่คาดว่าจะได้รับ </label>
                  <textarea
                    {...register("expectedOutcome")}
                    id="expectedOutcome"
                    className="form-control"
                    rows="2"
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
                        borderRadius: "7px",
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
        </div>{" "}
        {/* <hr /> */}
        <div className="cartcustom mt-2">
          <div className="container4">
            <div className="cartcustom3 mb-2 mt-1">
              <div className="d-flex align-items-center">
                <div className="text-content">
                  <span className="welcome-text" style={{ fontSize: "14px" }}>
                    บทความแสดงความรู้สึกตลอดระยะเวลาการทำงาน
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 row">
              <div className="col-md-12">
                <textarea
                  id="feelingTextarea"
                  className="form-control"
                  rows="50"
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  style={{ fontSize: "14px" }}
                ></textarea>
              </div>
              <div className="col-md-12 text-right mt-3">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4285f4",
                    color: "white",
                    borderRadius: "7px",
                    "&:hover": { backgroundColor: "#5a94f2" },
                    padding: "8px 16px",
                    borderRadius: "20px",
                  }}
                  // onClick={handleSaveSingleEntry} // ปุ่มเพิ่ม: แค่เพิ่มข้อมูลใน state
                  fullWidth
                >
                  <IoIosSend className="mr-2" /> ส่งแสดงความรู้สึก
                </Button>
              </div>
            </div>
          </div>
        </div>{" "}
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
