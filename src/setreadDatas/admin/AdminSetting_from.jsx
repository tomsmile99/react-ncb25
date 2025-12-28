import React, { useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import { Button, Card } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { useNavigate } from "react-router-dom"; // เพิ่ม
import { userToken } from "../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import { TbTransformPointTopRight } from "react-icons/tb";
import { FcAddDatabase } from "react-icons/fc";
import Lottie from "lottie-react";
import loadingAnimation2 from "../../../src/jsonfiles/Animation - 1739373993124.json";
const EvaluationForm = () => {
  const [cards, setCards] = useState([]);
  const [nextFormNumber, setNextFormNumber] = useState(1); // ลำดับถัดไป
  const navigate = useNavigate();
  const token = useRecoilValue(userToken);

  const [activeVersion, setActiveVersion] = useState(null); // track version ที่ใช้งาน
  // กำหนดชุดสีที่อยากให้เปลี่ยน
  const colors = ["#d9d9d9", "#4a90e2", "#ff7f50", "#42b883", "#f39c12"];
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    // ตั้ง interval ให้เปลี่ยนสีทุก 2 วิ
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
      // ใช้ mod (%) ให้วนกลับไป index 0 อีกรอบ
    }, 2000);

    return () => clearInterval(interval); // cleanup เวลา component unmount
  }, []);
  const handleToggle = async (version) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ต้องการเปิดใช้งานเวอร์ชันนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // setActiveVersion(version);
        try {
          const response = await apiClient.post("/switch_question_inseart", {
            version_question: version,
            status: true,
          });

          fetchForms(); //รีเฟสหน้าเรียกฟอร์ม
          setActiveVersion((prev) => (prev === version ? null : version));
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "เปิดใช้งานเวอร์ชันเรียบร้อยแล้ว",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถส่งข้อมูลได้",
          });
        }
      }
    });
  };

  const fetchForms = async () => {
    try {
      const res = await apiClient.get("/question_view");
      const formData = res.data.result || [];

      // console.log("ข้อมูลฟอร์ม:", formData);

      // กรองข้อมูลให้เหลือ version_question ที่ไม่ซ้ำกัน และเก็บเฉพาะ version ที่ใหม่ที่สุด
      const uniqueForms = formData.reduce((acc, current) => {
        const existingForm = acc.find(
          (item) => item.version_question === current.version_question
        );
        if (
          !existingForm ||
          parseInt(current.version_question, 10) >
            parseInt(existingForm.version_question, 10)
        ) {
          acc = acc.filter(
            (item) => item.version_question !== current.version_question
          );
          acc.push(current);
        }
        return acc;
      }, []);

      // หาค่า version_question ที่มากที่สุดจากข้อมูลทั้งหมด (รวมที่ซ้ำกัน)
      const maxVersion = formData.reduce((max, form) => {
        const version = parseInt(form.version_question, 10);
        return version > max ? version : max;
      }, 0);

      setCards(uniqueForms); // เซ็ตข้อมูลฟอร์มที่ไม่ซ้ำกัน
      setNextFormNumber(maxVersion + 1); // ตั้งเลขเวอร์ชันถัดไป
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลจาก backend
    fetchForms();
  }, [token]);

  const handleCreateForm = () => {
    // ส่งไปหน้าฟอร์มพร้อมเลขเวอร์ชัน
    navigate(`/admin/Admin_DataFormAdd?version=${nextFormNumber}`);
  };

  return (
    <div>
      <Card className="cartcustom p-3 shadow-sm">
        <Card.Header className="bg-primary text-white cartcustomTag">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
            การจัดการฟอร์มแบบประเมินพนักงานทดลองงาน
          </h5>
        </Card.Header>

        <div className="row px-3 pt-3">
          <div className="col-md-2 mb-3">
            <Card
              className="cartcustom d-flex justify-content-center align-items-center shadow-sm"
              style={{ height: "300px", cursor: "pointer" }}
              onClick={handleCreateForm}
            >
              <FcPlus style={{ fontSize: "24px" }} />
              <div style={{ fontSize: "12px", color: "gray" }}>สร้างฟอร์ม</div>
            </Card>
          </div>

          {cards.map((card) => (
            <div className="col-md-2 mb-3" key={card.version_question}>
              <Card
                className="cartcustom p-3 shadow-sm d-flex flex-column justify-content-between"
                style={{
                  height: "300px",
                  cursor: "pointer",
                  opacity: card.status_question !== "1" ? 0.7 : 1, // จางถ้าไม่ active
                  filter:
                    card.status_question !== "1" ? "grayscale(60%)" : "none", // ทำให้สีซีด
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="text-center"
                  style={{ color: "gray", fontSize: "13px" }}
                >
                  แบบประเมินพนักงานทดลองงาน{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #4a90e2, #1565c0)",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginLeft: "6px",
                      display: "inline-block",
                      width: "30%",
                    }}
                  >
                    V.{card.version_question}
                  </span>
                </div>

                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    fontSize: "60px",
                    color: colors[colorIndex],
                    transition: "color 0.5s ease",
                  }}
                >
                  <img
                    src="/SAKAssessment/Add files-rafiki.png"
                    className="brand-image pt-2"
                    style={{ height: 150, width: "auto" }}
                    alt="loop-color"
                  />
                </div>

                <div className="form-check form-switch text-center mt-1 pt-2">
                  <input
                    className={`form-check-input ${
                      card.status_question === "1" ||
                      activeVersion === card.version_question
                        ? "bg-success border-success"
                        : ""
                    }`}
                    type="checkbox"
                    checked={
                      card.status_question === "1" ||
                      activeVersion === card.version_question
                    }
                    onChange={() => handleToggle(card.version_question)}
                  />
                  <label
                    className="form-check-label"
                    style={{ fontSize: "12px" }}
                  >
                    {card.status_question === "1" ? "เปิดใช้งานอยู่" : "ปิด"}
                  </label>
                </div>

                <div
                  className="btn btn-sm custom-buttonStart1 mt-auto"
                  onClick={() =>
                    navigate(
                      `/admin/Admin_DataFormAdd?version=${card.version_question}`
                    )
                  }
                >
                  แก้ไขฟอร์ม
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EvaluationForm;
