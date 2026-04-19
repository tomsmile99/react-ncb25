import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../recoilstore/userStores";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
const SalepersonView_DataCustomer = ({ idForm }) => {
  const navigate = useNavigate();
  const pdfRef = useRef();
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

  const formatPhoneFront = (phone = "") => {
    const digits = phone.replace(/\D/g, ""); // เอาเฉพาะตัวเลข

    if (digits.length < 4) return digits;

    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  };

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

  const getThaiDateParts = (dateStr) => {
    if (!dateStr) return { day: "-", month: "-", year: "-" };

    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: thaiMonths[date.getMonth()],
      year: (date.getFullYear() + 543).toString(),
    };
  };

  //get
  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    CTM_citizen_id: "",
    CTM_birthdate: "",
    CTM_phone: "",
    CTM_house_no: "",
    CTM_moo: "",
    CTM_soi: "",
    CTM_road: "",
    CTM_village_or_building: "",
    CTM_sub_district: "",
    CTM_district: "",
    CTM_province: "",
    CTM_postal_code: "",
  });

  //PUT ส่งรูปหลักฐาน
  const [formData2, setFormData2] = useState({
    loanType: "",
    loanAmount: "",
    customerType: "",
  });

  const [images, setImages] = useState({
    img1: null,
    img2: null,
    img3: null,
  });

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    setImages((prev) => ({
      ...prev,
      [name]: files[0], // ✅ File ใหม่ จะทับค่าเดิมทันที
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // popup #1
  const [previewImage, setPreviewImage] = useState(false); // popup #3
  const [getDataShow, setgetDataShow] = useState({});
  const [getDataEditReport, setgetDataEditReport] = useState({});
  const [getDataLvChk, setgetDataLvChk] = useState("");
  const [getDataChkEdit, setgetDataChkEdit] = useState("");

  const [oldConsentFile, setOldConsentFile] = useState(null);
  const [openConsentModal, setOpenConsentModal] = useState(false);

  const [consentError, setConsentError] = useState(false);
   const [IdcardError, setIdcardError] = useState(false);

  const chksentFileRef = useRef(2);

  const handleDownloadPDF = async (idForm) => {
    const params = {
      idForm: idForm,
    };

    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers/dataPDF",
        {
          params,
        }
      );

      const { status, result, resultEdit, message } = data;

      if (status === 200) {
        setgetDataShow(result[0]);
        setgetDataLvChk(result[0].Form_verification_status);
        setgetDataChkEdit(result[0].Form_status_Edit);

        const data = result[0];

        console.log(data);
        setgetDataShow(data); // ถ้ายังต้องใช้โชว์ที่อื่น Form_verification_status
        setgetDataEditReport(resultEdit[0]);
        setFormData({
          title: data.CTM_title_name || "",
          firstname: data.CTM_firstname || "",
          lastname: data.CTM_lastname || "",
          CTM_citizen_id: data.CTM_citizen_id || "",
          CTM_birthdate: data.CTM_birthdate || "",
          CTM_phone: data.CTM_phone || "",
          CTM_house_no: data.CTM_house_no || "",
          CTM_moo: data.CTM_moo || "",
          CTM_soi: data.CTM_soi || "",
          CTM_road: data.CTM_road || "",
          CTM_village_or_building: data.CTM_village_or_building || "",
          CTM_sub_district: data.CTM_sub_district || "",
          CTM_district: data.CTM_district || "",
          CTM_province: data.CTM_province || "",
          CTM_postal_code: data.CTM_postal_code || "",

          CTM_employee_code: data.CTM_employee_code || "",
          CTM_recorder_fullname: data.CTM_recorder_fullname || "",
          CTM_position: data.CTM_position || "",
          CTM_branch: data.CTM_branch || "",
          CTM_business_zone: data.CTM_business_zone || "",
          CTM_business_region: data.CTM_business_region || "",

          customerType: data.Form_loan_type || "",
          loanAmount: data.Form_loan_amount || "", //เก่า
        });

        setFormData2({
          // customerType: data.Form_customer_type || "",
          loanAmount: data.Form_loan_amount || "", // ⭐ ตั้งค่าที่ get มา
          // loanType: data.Form_loan_type || "",

          loanType: data.Form_customer_type || "",
          customerType: data.Form_loan_type || "",
        });

        // ⭐ ตั้งค่าภาพ (รองรับ URL หรือ Base64)
        setImages({
          img1: data.Form_consent_document || null,
          img2: data.Form_application_document || null,
          img3: data.Form_idcard_photo || null,
        });

        // ✅ เก็บไฟล์เดิม (หนังสือยินยอม) ไว้ตรวจว่า user อัปโหลดใหม่หรือยัง
        setOldConsentFile(data.Form_consent_document || null);
      } else {
        console.error("❌ ไม่สำเร็จ:", message);
      }

      if (!data || !data.status) {
        console.error("ไม่พบข้อมูลสำหรับ PDF");
        return;
      }
    } catch (error) {
      console.error("โหลดข้อมูลสำหรับ PDF ไม่สำเร็จ:", error);
    }
  };

  const handleUpdateCustomer = async () => {  
      try {
        const formDataUpload = new FormData();

          // ⭐ แปลงวันเกิด พ.ศ. → ค.ศ.
        const birthdayCE = convertBirthdayToCE(birthdayTH);

        if (!birthdayCE) {
          Swal.fire({
            icon: "warning",
            title: "ข้อมูลไม่ครบ",
            text: "กรุณากรอกวันเดือนปีเกิดให้ครบ",
          });
          return;

        }



        if (!formData?.CTM_phone || formData.CTM_phone.trim() === "") {
              setPhoneError(true);
              Swal.fire({
                icon: "warning",
                title: "กรุณากรอกเบอร์โทรศัพท์",
                text: "ต้องระบุเบอร์โทรศัพท์ก่อนทำรายการ",
                confirmButtonText: "ตกลง",
              });
              return;
            }
        
              if (!formData.CTM_phone || formData.CTM_phone.length !== 10) {
                Swal.fire({
                icon: "warning",
                title: "กรุณากรอกเบอร์โทรศัพท์ให้ครบ",
                text: "ต้องระบุเบอร์โทรศัพท์ให้ครบ 10 หลักก่อนทำรายการ",
                confirmButtonText: "ตกลง",
              });
            return;
          }

         if (!formData?.CTM_citizen_id || formData.CTM_citizen_id.trim() === "") { 
              setIdcardError(true);
              Swal.fire({
                icon: "warning",
                title: "กรุณากรอกหมายเลขบัตรประชาชน",
                text: "ต้องระบุหมายเลขบัตรประชาชน",
                confirmButtonText: "ตกลง",
              });
              return;
            }
             if (!formData.CTM_citizen_id || formData.CTM_citizen_id.length !== 13) {
            
                Swal.fire({
                icon: "warning",
                title: "กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก",
                text: "ต้องระบุเลขบัตรประชาชนให้ครบ 13 หลักก่อนทำรายการ",
                confirmButtonText: "ตกลง",
              });
            
            return;
          }

          /* ===============================
          🧾 ข้อมูลฟอร์ม (JSON)
        =============================== */
          const payload = {
            ...formData,
            ...formData2,
            idForm: idForm,
            LvChk: getDataLvChk,
            CTM_birthdate: birthdayCE,
          };

          formDataUpload.append("payload", JSON.stringify(payload));

      /* ===============================
            🖼 แนบไฟล์ (เฉพาะไฟล์ที่เปลี่ยน)
        =============================== */
      if (images.img1 instanceof File) {
        formDataUpload.append("img1", images.img1);
      }
      if (images.img2 instanceof File) {
        formDataUpload.append("img2", images.img2);
      }
      if (images.img3 instanceof File) {
        formDataUpload.append("img3", images.img3);
      }

      // console.log("📦 formDataUpload ก่อนส่ง:");

      // for (let [key, value] of formDataUpload.entries()) {
      //   if (value instanceof File) {
      //     console.log(key, "=>", value.name, value.type, value.size + " bytes");
      //   } else {
      //     console.log(key, "=>", value);
      //   }
      // }

      // return;

      const { data } = await apiClient.post(
        "/api/insurances/datacustomers/updateDataEdit_evidence",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 🔥 ต้องมี
          },
        }
      );
      const { status, result, payload_raw, payload_json, files } = data;

      if (status === 200) {
        // console.log("✅ payload_raw =", payload_raw);
        // console.log("📨 payload_json =", payload_json);
        // console.log("📄 files =", files);
        // return;
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          text: "อัปเดตข้อมูลเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#4a90e2", // ฟ้า SAK
          background: "#ffffff",
          color: "#333",
          timer: 2000,
          timerProgressBar: true,

          showConfirmButton: false,
        }).then(() => {
          // 🔥 เงื่อนไขใหม่: ถ้ายังไม่เลื
          setConsentError(false);
          if (!formData2.customerType) {
            window.location.assign("/Salesperson");
            return; // ⛔ หยุดการทำงานตรงนี้ทันที
          }
          // 🔥 ครั้งแรก → เปิด modal
          if (chksentFileRef.current === 1) {
            setOpenConsentModal(true);
            chksentFileRef.current = 2; // ✅ เปลี่ยนทันที ไม่รอ rerender
          }
          // 🔥 ครั้งที่สอง → redirect
          else {
            window.location.assign("/Salesperson");
          }

          // navigate("/Salesperson");
        });
      }
    } catch (error) {
      console.error("❌ อัปเดตข้อมูลไม่สำเร็จ:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    chksentFileRef.current = 1;
  };

  const openModal = (img) => {
    setPreviewImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };

  const handleDownloadPDFNew = async (idForm) => {
    const params = {
      idForm: idForm,
    };
    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers/dataPDF",
        {
          params,
        }
      );

      const { status, result, message } = data;

      if (status === 200) {
        // console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        // console.log("📦 result จากหลังบ้าน:", result);
        setgetDataShow(result[0]);

        setTimeout(() => {
          const element = pdfRef.current;

          // ✅ แสดงก่อนสร้าง PDF
          element.style.position = "static";
          element.style.top = "0";
          element.style.left = "0";
          element.style.visibility = "visible";

          const options = {
            margin: 10,
            filename: `form_${idForm}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          };

          html2pdf()
            .from(element)
            .set(options)
            .outputPdf("bloburl")
            .then((pdfUrl) => {
              window.open(pdfUrl, "_blank");
            })
            .finally(() => {
              // ✅ ซ่อนกลับ
              element.style.position = "absolute";
              element.style.top = "-9999px";
              element.style.left = "-9999px";
              element.style.visibility = "hidden";
            });
        }, 300); // ✅ รอ DOM render
      } else {
        console.error("❌ ไม่สำเร็จ:", message);
      }

      if (!data || !data.status) {
        console.error("ไม่พบข้อมูลสำหรับ PDF");
        return;
      }
    } catch (error) {
      console.error("โหลดข้อมูลสำหรับ PDF ไม่สำเร็จ:", error);
    }
  };

  const getPreviewSrc = (img, folder) => {
    if (!img) return null;

    // 🔥 ถ้าเป็นไฟล์ใหม่
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }

    // 🔹 ถ้าเป็นชื่อไฟล์จาก DB
    return `${
      import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
    }img/${folder}/${img}`;
  };

  //วันเดือนปีเกิด
  const [birthdayTH, setBirthdayTH] = useState({
    day: "",
    month: "",
    year: "",
  });

  const thaiMonths1 = [
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
  ];

  const convertBirthdayToCE = () => {
    const { day, month, year } = birthdayTH;
    if (!day || !month || !year) return null;

    const ceYear = parseInt(year, 10) - 543;

    return `${ceYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

const handlePhoneChange = (e) => {
  const value = e.target.value
    .replace(/\D/g, "") // ❌ ตัดทุกอย่างที่ไม่ใช่ตัวเลข
    .slice(0, 10);      // ❌ ไม่เกิน 10 หลัก

  setFormData((prev) => ({
    ...prev,
    CTM_phone: value,
  }));
};

const handleCitizenIdChange = (e) => {
  const value = e.target.value
    .replace(/\D/g, "") // ❌ ตัดทุกอย่างที่ไม่ใช่ตัวเลข
    .slice(0, 13);      // ❌ ไม่ให้เกิน 13 หลัก

  setFormData((prev) => ({
    ...prev,
    CTM_citizen_id: value,
  }));
};



  useEffect(() => {
    handleDownloadPDF(idForm);
  }, []);

  useEffect(() => {
    chksentFileRef.current = 1;
  }, [idForm]);
  useEffect(() => {
    if (formData?.CTM_birthdate) {
      const [y, m, d] = formData.CTM_birthdate.split("-");

      setBirthdayTH({
        day: d,
        month: m,
        year: (parseInt(y, 10) + 543).toString(),
      });
    }
  }, [formData?.CTM_birthdate]);

  

  return (
    <div>
      {getDataEditReport?.SCORE_additional_fee_Edit && (
        <div className="edit-alert-card">
          <div className="edit-alert-icon">⚠️</div>

          <div className="edit-alert-content">
            <div className="edit-alert-title">แจ้งเตือนการแก้ไขข้อมูล</div>

            <div className="edit-alert-text">
              {getDataEditReport.SCORE_additional_fee_Edit}
            </div>
          </div>
        </div>
      )}

      <div className="layout-wrapper">
        {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}
        <div className="card recorder-card">
          <h3 className="card-title">ส่วนที่ 1 : รายละเอียดผู้บันทึกข้อมูล</h3>

          <div className="rec-profile-row">
            {/* <img
              src={`https://apimb.sakerp.org/file_photoEMP/${getDataShow?.photo_PSN}`}
              alt="profile"
              className="rec-photo-rect"
            /> */}

            <div className="rec-info">
              <div className="rec-row">
                <strong>ชื่อผู้บันทึก : </strong>
                <span> {getDataShow?.CTM_recorder_fullname || ""}</span>
              </div>

              <div className="rec-row">
                <strong>ตำแหน่ง : </strong>
                <span>{getDataShow?.CTM_position || ""}</span>
              </div>

              <div className="rec-row">
                <strong>สาขา/หน่วย : </strong>
                <span>{getDataShow?.CTM_business_zone || ""}</span>
              </div>

              <div className="rec-row">
                <strong>เขตธุรกิจ : </strong>
                <span>{getDataShow?.CTM_branch || ""}</span>
              </div>

              <div className="rec-row">
                <strong>ภาคธุรกิจ : </strong>
                <span>{getDataShow?.CTM_business_region || ""}</span>
              </div>

              <div className="rec-row">
                <strong>วันที่บันทึก : </strong>
                <span>
                  {convertToThaiDate(getDataShow?.CTM_created_at) || ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 การ์ดที่ 2 : ฟอร์มรับข้อมูล */}
        <div className="card form-card">
          <div className="form-header">
            <h3 className="card-title">ส่วนที่ 2 : รายละเอียดข้อมูลลูกค้า</h3>
            {/* <button className="btn-readcard">
              <RiIdCardFill style={{ fontSize: "16px", marginRight: 5 }} />
              ดึงข้อมูลบัตร
            </button> */}
          </div>

          <div className="form-grid">
            <div className="form-group small">
              <label>คำนำหน้า</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="นาย / นาง / น.ส."
              />
            </div>

            <div className="form-group small">
              <label>ชื่อ</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="ชื่อจริง"
              />
            </div>
            <div className="form-group small">
              <label>นามสกุล</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="นามสกุล"
              />
            </div>

              <div className="form-group small">
  <label>หมายเลขบัตรประชาชน</label>
  <input
    type="text"
    name="CTM_citizen_id"
    value={formData.CTM_citizen_id}
    onChange={handleCitizenIdChange}
    placeholder="x xxxx xxxxxx xx x"
    maxLength={13}
  />

  {formData.CTM_citizen_id &&
    formData.CTM_citizen_id.length < 13 && (
      <small style={{ color: "red" }}>
        กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก
      </small>
    )}
</div>


            {/* <div className="form-group small">
              <label>วันเดือนปีเกิด</label>
              <input
                type="date"
                name="birthday"
                value={formData.CTM_birthdate || ""}
                onChange={handleChange}
               
              />

             
            </div> */}

            <div className="form-group small">
              <label>วันเดือนปีเกิด (พ.ศ.)</label>

              <div style={{ display: "flex", gap: "6px" }}>
                {/* วัน */}
                <input
                  type="number"
                  placeholder="วัน"
                  min={1}
                  max={31}
                  value={birthdayTH.day}
                  onChange={(e) =>
                    setBirthdayTH({ ...birthdayTH, day: e.target.value })
                  }
                  style={{ width: "70px" }}
                />

                {/* เดือน */}
                <select
                  value={birthdayTH.month}
                  onChange={(e) =>
                    setBirthdayTH({ ...birthdayTH, month: e.target.value })
                  }
                  style={{ width: "140px" }}
                >
                  <option value="">เดือน</option>
                  {thaiMonths1.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* ปี พ.ศ. */}
                <input
                  type="number"
                  placeholder="พ.ศ."
                  value={birthdayTH.year}
                  onChange={(e) =>
                    setBirthdayTH({ ...birthdayTH, year: e.target.value })
                  }
                  style={{ width: "90px" }}
                />
              </div>
            </div>

             <div className="form-group small">
  <label>เบอร์โทรศัพท์</label>
  <input
    type="text"
    name="CTM_phone"
    value={formData.CTM_phone}
    onChange={handlePhoneChange}
    placeholder="กรุณากรอกเบอร์โทรศัพท์"
    maxLength={10}
  />

  {/* แจ้งเตือนถ้ายังไม่ครบ 10 หลัก */}
  {formData.CTM_phone &&
    formData.CTM_phone.length < 10 && (
      <small style={{ color: "red" }}>
        กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก
      </small>
    )}
</div>

            {/* <div className="form-group full">
              <label>ที่อยู่ตามทะเบียนบ้าน</label>

             
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_house_no"
                    value={formData.CTM_house_no}
                    onChange={handleChange}
                    placeholder="บ้านเลขที่"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_moo"
                    value={formData.CTM_moo}
                    onChange={handleChange}
                    placeholder="หมู่"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_soi"
                    value={formData.CTM_soi}
                    onChange={handleChange}
                    placeholder="ซอย"
                  />
                </div>
              </div>


              <div className="row mt-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_road"
                    value={formData.CTM_road}
                    onChange={handleChange}
                    placeholder="ถนน"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_village_or_building"
                    value={formData.CTM_village_or_building}
                    onChange={handleChange}
                    placeholder="หมู่บ้าน / อาคาร"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_sub_district"
                    value={formData.CTM_sub_district}
                    onChange={handleChange}
                    placeholder="แขวง / ตำบล"
                  />
                </div>
              </div>

    
              <div className="row mt-2">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_district"
                    value={formData.CTM_district}
                    onChange={handleChange}
                    placeholder="เขต / อำเภอ"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_province"
                    value={formData.CTM_province}
                    onChange={handleChange}
                    placeholder="จังหวัด"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="CTM_postal_code"
                    value={formData.CTM_postal_code}
                    onChange={handleChange}
                    placeholder="รหัสไปรษณีย์"
                  />
                </div>
              </div>
            </div> */}
          </div>
          {/* <button className="btn-submit" onClick={handleCheckLastname}>
            <LuScanText /> ตรวจสอบ
          </button> */}
          {/* <button className="btn-submit">บันทึกข้อมูล</button> */}
        </div>
      </div>

      {/* 🔹 การ์ดที่ 3 : อัปโหลดรูปถ่ายลูกค้า */}

      <div style={{ padding: "0 20px" }} className="pt-1">
        <div className="card form-card full-width">
          <div className="form-header">
            <h3 className="card-title">ส่วนที่ 3 : อัปโหลดรูปถ่ายลูกค้า</h3>
          </div>

          <div className="form-grid">
            <div className="form-group small">
              <label style={{ fontSize: "16px" }}>ประเภทสินเชื่อ</label>
              <select
                name="customerType"
                value={formData2.customerType}
                onChange={(e) =>
                  setFormData2({ ...formData2, customerType: e.target.value })
                }
                disabled={getDataShow?.Form_verification_status === "Lv0N"}
                className="input-select"
              >
                <option value="">-- เลือกประเภทสินเชื่อ --</option>
                <option value="1">สินเชื่อส่วนบุคคล</option>
                <option value="2">สินเชื่อนาโนไฟแนนซ์</option>
                <option value="3">สินเชื่อที่ดิน</option>
                <option value="4">สินเชื่อโซลาร์รูฟท็อป</option>
                <option value="5">สินเชื่อโซลาร์แอร์</option>
                <option value="6">สินเชื่อโซลาร์ไมโครอินเวอร์เตอร์</option>
                <option value="7">สินเชื่อเช่าซื้อ (รถจักรยานยนต์ใหม่)</option>
                <option value="8">สินเชื่อเช่าซื้อ (รถแลกเงิน)</option>
                <option value="9">สินเชื่อทะเบียนรถ</option>
                <option value="10">สินเชื่อโซลาร์แอร์</option>
              </select>
            </div>

            <div className="form-group small">
              <label style={{ fontSize: "16px" }}>วงเงินขอสินเชื่อ</label>
              <input
                type="text"
                name="loanAmount"
                placeholder="กรอกเฉพาะตัวเลข"
                className="input-number"
                disabled={getDataShow?.Form_verification_status === "Lv0N"}
                value={formatNumber(formData2.loanAmount)} // ✅ แสดงลูกน้ำ (ทั้งตอนแก้ไข/รับค่ามา)
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, ""); // ลบลูกน้ำ
                  const numericValue = rawValue.replace(/[^0-9]/g, ""); // เหลือแต่ตัวเลข

                  setFormData2({
                    ...formData2,
                    loanAmount: numericValue, // ✅ เก็บเลขล้วน
                  });
                  setErrors({ ...errors, loanAmount: false });
                }}
              />
            </div>

            <div className="form-group small">
              <label style={{ fontSize: "16px" }}>ประเภทลูกค้า</label>
              <select
                name="loanType"
                value={formData2.loanType}
                disabled={getDataShow?.Form_verification_status === "Lv0N"}
                onChange={(e) =>
                  setFormData2({ ...formData2, loanType: e.target.value })
                }
                className="input-select"
              >
                <option value="">-- เลือกประเภทลูกค้า --</option>
                <option value="1">ลูกค้าใหม่</option>
                <option value="2">
                  ลูกค้าใหม่ (ลูกค้าเก่าปิดบัญชี ตั้งแต่ 1 ปี กลับมาใช้บริการ)
                </option>
                <option value="3">ลูกค้าใหม่ (ย้ายไฟแนนซ์)</option>
                <option value="4">ลูกค้าเก่า</option>
                <option value="5">ลูกค้าเก่า (ย้ายไฟแนนซ์)</option>
                <option value="6">
                  ลูกค้าเก่าต่อสัญญา/RENEW (ขอตรวจนอกหลักเกณฑ์)
                </option>
                <option value="7">ลูกค้าเก่าต่อสัญญา/RENEW เพิ่มวงเงิน</option>
                <option value="8">
                  ลูกค้าเก่าต่อสัญญา/RENEW เงื่อนไขการชำระรายงวด
                  มีการต่อสัญญาต่อเนื่อง ตั้งแต่ 1 ปีขึ้นไป
                </option>
              </select>
            </div>
          </div>
          <hr />
          <div className="upload-grid preview-style">
            <div className="upload-group pb">
              <label className="tag-label1">
                หนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
              </label>

              <input
                type="file"
                name="img1"
                accept="image/*"
                disabled={getDataShow?.Form_verification_status === "Lv0N"}
                onChange={handleImageChange}
              />
              {images.img1 && (
                <div className="pt-4">
                  <img
                    src={getPreviewSrc(images.img1, "consent")}
                    alt="หนังสือยินยอม"
                    className="preview-img-full"
                    onClick={() =>
                      openModal(getPreviewSrc(images.img1, "consent"))
                    }
                  />
                  <p className="img-label">
                    สำเนาหนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                  </p>
                </div>
              )}
            </div>

            <div className="upload-group">
              <label className="tag-label1">ใบสมัครสินเชื่อ</label>
              <input
                type="file"
                name="img2"
                accept="image/*"
                disabled={getDataShow?.Form_verification_status === "Lv0N"}
                onChange={handleImageChange}
              />

              {images.img2 && (
                <div className="pt-4">
                  <img
                    src={getPreviewSrc(images.img2, "application")}
                    alt="หนังสือยินยอม"
                    className="preview-img-full"
                    onClick={() =>
                      openModal(getPreviewSrc(images.img2, "application"))
                    }
                  />
                  <p className="img-label">
                    สำเนาใบสมัครสินเชื่อ
                  </p>
                </div>
              )}

              {/* {images.img2 && (
  <div className="pt-4">
    <img
      src={
        images.img2 instanceof File
          ? URL.createObjectURL(images.img2) // ✅ รูปใหม่
          : `${import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB}img/application/${images.img2}` // ✅ รูปเก่า
      }
      alt="สำเนาใบสมัครสินเชื่อ"
      className="preview-img-full"
      onClick={() =>
        openModal(
          images.img2 instanceof File
            ? URL.createObjectURL(images.img2)
            : `${import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB}img/application/${images.img2}`
        )
      }
    />
    <p className="img-label">สำเนาใบสมัครสินเชื่อ</p>
  </div>
)} */}

            </div>

            <div className="upload-group">
              <label className="tag-label1">รูปบัตรประชาชน</label>
              <input
                type="file"
                name="img3"
                accept="image/*"
                disabled={getDataShow?.Form_verification_status === "Lv0N"}
                onChange={handleImageChange}
              />

               {images.img3 && (
                <div className="pt-4">
                  <img
                    src={getPreviewSrc(images.img3, "idcard")}
                    alt="หนังสือยินยอม"
                    className="preview-img-full"
                    onClick={() =>
                      openModal(getPreviewSrc(images.img3, "idcard"))
                    }
                  />
                  <p className="img-label">
                    สำเนาหนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                  </p>
                </div>
              )}



              {/* {images.img3 && (
  <div className="pt-4">
    <img
      src={
        images.img3 instanceof File
          ? URL.createObjectURL(images.img3) // ✅ รูปใหม่ที่เพิ่งเลือก
          : `${import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB}img/idcard/${images.img3}` // ✅ รูปเก่าจาก backend
      }
      alt="สำเนาบัตรประชาชน"
      className="preview-img-full"
      onClick={() =>
        openModal(
          images.img3 instanceof File
            ? URL.createObjectURL(images.img3)
            : `${import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB}img/idcard/${images.img3}`
        )
      }
      onError={(e) => (e.target.style.display = "none")}
    />
    <p className="img-label">สำเนาบัตรประชาชน</p>
  </div>
)} */}
            </div>

            {isModalOpen && (
              <div className="modal-overlay1" onClick={closeModal}>
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={previewImage} alt="zoom" className="modal-img" />

                  <button className="status-cancel" onClick={closeModal}>
                    ปิด
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn-submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  background: "#0d3b7a",
                  color: "#fff",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleUpdateCustomer}
              >
                บันทึกการแก้ไข
              </button>
              {/* <button
                className="btn-submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  background: "#0d3b7a",
                  color: "#fff",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setOpenConsentModal(true)}
              >
                บันทึกการแก้ไข
              </button> */}
            </div>
          </div>
        </div>

        {openConsentModal && (
          <div className="modal-overlay2">
            <div className="modal-content step-modal">
              {/* 🔷 Header */}
              <h3 className="step-title">หนังสือให้ความยินยอม</h3>
              <p className="step-subtitle">
                กรุณาดำเนินการตามขั้นตอนด้านล่างให้ครบถ้วน
              </p>

              {/* ================= STEP 1 ================= */}
              <div className="step-section">
                <div className="step-header">
                  <span className="step-badge step-badge-danger">STEP 1</span>
                  <span className="step-text step-text-danger">
                    ตรวจสอบเอกสารเดิม{" "}
                    <a style={{ color: "red" }}> (ให้ลูกค้าเซ็นใหม่)</a>
                  </span>
                </div>

                {images.img1 ? (
                  <button
                    className="btn-outline"
                    onClick={() => handleDownloadPDFNew(idForm)}
                  >
                    📄 ดาวน์โหลดหนังสือยินยอมฉบับใหม่ (ปรับแก้แล้ว)
                  </button>
                ) : (
                  <p className="text-muted">ไม่มีไฟล์หนังสือยินยอมเดิม</p>
                )}
              </div>

              {/* ================= STEP 2 ================= */}
              <div className="step-section">
                <div className="step-header">
                  <span className="step-badge">STEP 2</span>
                  <span className="step-text">อัปโหลดหนังสือยินยอมใหม่</span>
                </div>

                <input
                  type="file"
                  name="img1"
                  accept="image/*"
                  disabled={getDataShow?.Form_verification_status === "Lv0N"}
                  onChange={handleImageChange}
                />
                {/* {images.img1 && (
                  <>
                    <div className="pt-4">
                      {getDataShow?.Form_consent_document && (
                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
                          }img/consent/${
                            getDataShow.Form_consent_document
                          }?t=${Date.now()}`}
                          alt="หนังสือยินยอม"
                          className="preview-img-full"
                          onClick={() =>
                            openModal(
                              `${
                                import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
                              }img/consent/${getDataShow.Form_consent_document}`
                            )
                          }
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}

                      <p className="img-label">
                        สำเนาหนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                      </p>
                    </div>
                  </>
                )} */}
              </div>

              {/* ================= STEP 3 ================= */}
              <div className="step-section">
                <div className="step-header">
                  <span className="step-badge">STEP 3</span>
                  <span className="step-text">ยืนยันและบันทึกข้อมูล</span>
                </div>
                {consentError && (
                  <div className="inline-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>กรุณาอัปโหลดหนังสือยินยอมฉบับใหม่ก่อนบันทึก</span>
                  </div>
                )}
                <div className="btn-group-modal">
                  <button
                    className="btn-submit"
                    onClick={() => {
                      if (!images.img1 || images.img1 === oldConsentFile) {
                        setConsentError(true);
                        return;
                      }

                      setOpenConsentModal(false);
                      handleUpdateCustomer();
                    }}
                  >
                    ยืนยันการอัปโหลด
                  </button>

                  <button
                    className="btn-submit btn-secondary"
                    onClick={() => {
                      setConsentError(false);
                      window.location.assign("/Salesperson");
                      return;
                    }}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ✅ ส่วนนี้จะถูกนำไปสร้าง PDF */}

     
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden",

          width: "730px",
          minHeight: "1000px",
          padding: "20px 32px",
          background: "#ffffff",

          fontFamily: "THSarabunPSK",
          fontSize: "22px", // ✅ ใช้ px
          fontWeight: 400, // ✅ น้ำหนักจริง
          lineHeight: "1.4",
          color: "#4d4d4d",
        }}
      >
        {/* โลโก้ + หัว */}
        <div style={{ textAlign: "left", marginBottom: "8px" }}>
          <img
            src="/logo SAK เลขเสียภาษี.png"
            alt="logo"
            style={{ width: "350px", height: "auto" }} // ✅ ปรับขนาดใหญ่ขึ้น
          />
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "22px",

            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          หนังสือให้ความยินยอมในการเปิดเผยข้อมูล
        </div>

        <div
          style={{
            marginTop: "10px",
            fontSize: "14px",
            textAlign: "right",
            width: "100%",
            marginBottom: "15px",
          }}
        >
          {/* ทำที่ */}

          <div>
            {/* ✅ วันที่ */}
            {(() => {
              const { day, month, year } = getThaiDateParts(
                getDataShow?.CTM_created_at
              );
              // const { day, month, year } = getThaiDateParts(dateNow);

              return (
                <div style={{ fontSize: "22px" }}>
                  {/* ✅ ทำที่ (ความยาวรวม = วันที่ทั้งหมด) */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px auto", // ⭐ ล็อกความกว้างคำ
                      rowGap: "6px",

                      lineHeight: "1.6",
                      justifyContent: "end",
                    }}
                  >
                    {/* แถวทำที่ */}
                    <div style={{ textAlign: "right" }} className="mt-1">
                      ทำที่
                    </div>
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          width: "279px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",

                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {getDataShow?.CTM_business_zone}
                      </span>
                    </div>

                    {/* แถววันที่ */}
                    <div style={{ textAlign: "right" }} className="mt-1">
                      วันที่
                    </div>
                    <div>
                      <div
                        style={{
                          display: "inline-block",
                          width: "40px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",

                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {day}
                      </div>
                      &nbsp;เดือน&nbsp;
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",
                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {month}
                      </div>
                      &nbsp;พ.ศ.&nbsp;
                      <div
                        style={{
                          display: "inline-block",
                          width: "60px",
                          borderBottom: "1px dotted #000",
                          textAlign: "center",
                          lineHeight: "1", // 🔑 บีบ baseline ลง
                          paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                        }}
                      >
                        {year}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #000",
          }}
        >
          {/* 🔷 แถบหัวข้อ */}
          <div
            style={{
              borderBottom: "1px solid #000",
              padding: "6px 12px",
              fontWeight: 400, // ✅ ตัวบาง
            }}
          >
            บุคคลธรรมดา
          </div>

          {/* 🔷 เนื้อหา */}
          <div style={{ padding: "9px" }}>
            <div style={{ marginBottom: "4px" }} className="mt-1">
              ข้าพเจ้า นาย/นาง/นางสาว{" "}
              <div
                style={{
                  display: "inline-block",
                  minWidth: "200px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",

                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {getDataShow?.CTM_firstname || ""}
              </div>{" "}
              นามสกุล{" "}
              <div
                style={{
                  display: "inline-block",
                  minWidth: "220px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {getDataShow?.CTM_lastname || ""}
              </div>
            </div>

            <div style={{ marginBottom: "8px" }} className="mt-1">
              วัน/เดือน/ปี พ.ศ.เกิด{" "}
              <div
                style={{
                  display: "inline-block",
                  minWidth: "233px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {convertToThaiDate(getDataShow?.CTM_birthdate) || ""}
              </div>{" "}
              หมายเลขโทรศัพท์{" "}
              <div
                style={{
                  display: "inline-block",
                  minWidth: "163px",
                  borderBottom: "1px dotted #000",
                  textAlign: "center",
                  lineHeight: "1", // 🔑 บีบ baseline ลง
                  paddingBottom: "1px", // 🔑 ดันเส้นขึ้นมาใกล้ข้อความ
                }}
              >
                {formatPhoneFront(getDataShow?.CTM_phone)}
              </div>
            </div>

            {/* 🔷 เลขบัตรประชาชน */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "6px" }}>
                บัตรประจำตัวประชาชนเลขที่ :
              </span>

              {getDataShow?.CTM_citizen_id?.replaceAll("-", "")
                .split("")
                .map((digit, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* ช่องตัวเลข */}
                    <span
                      style={{
                        width: "16px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        lineHeight: "1",

                        border: "1px solid #000",
                        marginLeft: index === 0 ? "0" : "-1px", // 🔑 ซ้อนเส้น
                      }}
                    >
                      {digit}
                    </span>

                    {/* ขีดคั่น เฉพาะตำแหน่งที่กำหนด */}
                    {[0, 4, 9, 11].includes(index) && (
                      <span
                        style={{
                          margin: "0 6px", // ✅ เว้นเฉพาะตรง -
                          fontSize: "20px",
                          lineHeight: "1",
                        }}
                      >
                        -
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div
          className="row mb-2 pt-4 print-text"
          style={{
            fontFamily: "THSarabunPSK",
            textAlign: "justify", // ✅ Justify
            textAlignLast: "left", // ✅ บรรทัดสุดท้ายไม่ยืด
            fontWeight: 400, // ✅ น้ำหนักจริง
            lineHeight: "1.35",
            wordBreak: "normal",
            overflowWrap: "normal",
          }}
        >
          <div style={{ paddingLeft: "100px", letterSpacing: "0.4px" }}>
            ข้าพเจ้าตกลงยินยอมให้ บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด (“บริษัท”)
            เปิดเผยหรือให้ข้อมูลของ
          </div>

          <div style={{ letterSpacing: "0.5px" }}>
            ข้าพเจ้าแก่ บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
            ซึ่งเป็นสมาชิกหรือผู้ใช้บริการของบริษัท เพื่อประโยชน์ในการ
          </div>

          <div style={{ letterSpacing: "0.81px" }}>
            วิเคราะห์สินเชื่อ
            ตามคำขอสินเชื่อ/ขอออกบัตรเครดิตของข้าพเจ้าที่ให้ไว้กับบริษัทดังกล่าวข้างต้น
            รวมทั้งเพื่อ
          </div>

          <div style={{ letterSpacing: "0.4px" }}>
            ประโยชน์ในการทบทวนสินเชื่อ ต่ออายุสัญญาสินเชื่อ/บัตรเครดิต
            การบริหารและป้องกันความเสี่ยงตามข้อกำหนด
          </div>

          <div style={{ letterSpacing: "0.3px" }}>
            ของธนาคารแห่งประเทศไทย และให้ถือว่าคู่ฉบับ และบรรดาสำเนา ภาพถ่าย
            ข้อมูลอิเล็กทรอนิกส์ หรือโทรสารที่ทำ
          </div>

          <div style={{ letterSpacing: "0.7px" }}>
            สำเนาขึ้นจากหนังสือให้ความยินยอมฉบับนี้ โดยการถ่ายสำเนา
            ถ่ายภาพหรือบันทึกไว้ไม่ว่าในรูปแบบใดๆ เป็น
          </div>

          <div style={{ letterSpacing: "0.4px" }}>
            หลักฐานในการให้ความยินยอมของข้าพเจ้าเช่นเดียวกัน
          </div>
        </div>

        <div style={{ paddingLeft: "100px", letterSpacing: "0.4px" }}>
          ข้าพเจ้าจึงได้ลงลายมือชื่อไว้เป็นสำคัญ
        </div>

        {/* ✅ โซนลายเซ็นทั้งหมด */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginTop: "18px",
          }}
        >
          {/* ✅ กล่องผู้ให้ความยินยอม */}
          <div
            style={{
              border: "1px solid #000",
              borderRadius: "22px",
              width: "400px",
              padding: "6px 10px", // 🔻 จาก 10px → 6px
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="pt-2"
            >
              {/* ไอคอนติ๊ก */}
              <img src="/5290982.png" width={20} alt="signature-icon" />

              {/* ข้อความ + เส้น */}
              <div style={{ textAlign: "left", fontSize: "20px" }}>
                &nbsp;&nbsp;ลงชื่อ&nbsp;
                ..........................................................................
                <br />
              </div>
            </div>
            <div
              style={{
                // marginLeft: "56px",
                marginTop: "6px",
                width: "430px",
                position: "relative",
                fontSize: "20px",
              }}
            >
              {/* วงเล็บ + เส้น */}(
              ..........................................................................
              )
              <span style={{ fontSize: "20px", marginLeft: "8px" }}>
                ตัวบรรจง
              </span>
              {/* ชื่อ (ลอยบนเส้น) */}
              <div
                style={{
                  position: "absolute",
                  top: "-10px", // 🔑 ปรับระดับความลอย
                  left: "45%",
                  transform: "translateX(-50%)",
                  background: "#fff", // 🔑 กันเส้นทับตัวอักษร
                  padding: "0 8px",
                  whiteSpace: "nowrap",
                  fontWeight: "normal",
                }}
              >
                {getDataShow?.CTM_title_name}
                {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname}
              </div>
            </div>

            <div style={{ fontSize: "20px", fontWeight: 800 }}>
              ผู้ให้ความยินยอม
            </div>
          </div>
          {/* ✅ โซนพยาน (จัดซ้าย–ขวา) */}
          <div
            style={{
              display: "flex",
              gap: "16px", // ✅ ระยะห่างซ้าย-ขวา
            }}
          >
            {/* ✅ พยานคนที่ 2 (แสดงเฉพาะตอนมีค่า) */}
            {getDataShow?.Form_witness2_name && (
              <div
                style={{
                  borderRadius: "10px",
                  width: "360px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div>( {getDataShow?.Form_witness2_name} )</div>
                <div>พยาน</div>
              </div>
            )}

            {/* ✅ พยานคนที่ 1 (แสดงตลอด) */}
            <div
              style={{
                border: "1px solid #000",
                borderRadius: "22px",
                width: "400px",
                padding: "6px 10px", // 🔻 จาก 10px → 6px
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="pt-2"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{ textAlign: "left", fontSize: "20px" }}>
                  &nbsp;&nbsp;ลงชื่อ&nbsp;
                  ..........................................................................
                  <br />
                </div>
              </div>

              <div
                style={{
                  // marginLeft: "56px",
                  marginTop: "6px",
                  width: "430px",
                  position: "relative",
                  fontSize: "20px",
                }}
              >
                (
                ..........................................................................
                )
                <span style={{ fontSize: "20px", marginLeft: "8px" }}>
                  ตัวบรรจง
                </span>
                <div
                  style={{
                    position: "absolute",
                    top: "-10px", // 🔑 ปรับระดับความลอย
                    left: "45%",
                    transform: "translateX(-50%)",
                    background: "#fff", // 🔑 กันเส้นทับตัวอักษร
                    padding: "0 8px",
                    whiteSpace: "nowrap",
                    fontWeight: "normal",
                  }}
                >
                  {getDataShow?.Form_witness1_name}
                </div>
              </div>

              <div style={{ fontSize: "20px", fontWeight: 800 }}>พยาน</div>
            </div>
          </div>
        </div>

        {/* ✅ กรอบหมายเหตุ */}
        <div
          style={{
            border: "1px solid #000",
            padding: "6px 10px",

            fontSize: "20px",
            lineHeight: "1.4",
            textAlign: "justify",
          }}
        >
          <strong>หมายเหตุ :</strong>{" "}
          ข้อมูลที่เปิดเผยให้แก่สมาชิกหรือผู้ใช้บริการเป็นองค์ประกอบหนึ่งในการพิจารณาสินเชื่อของสถาบันการเงิน
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
          <span>
            {" "}
            &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
            &nbsp;แต่การเปิดเผยข้อมูลดังกล่าวเป็นสิทธิของเจ้าของข้อมูลที่จะให้ความยินยอมหรือไม่ก็ได้
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SalepersonView_DataCustomer;
