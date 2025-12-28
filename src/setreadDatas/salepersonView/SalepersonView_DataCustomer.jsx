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

        // console.log(data);
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
          loanAmount: data.Form_loan_amount || "",
        });

        setFormData2({
          customerType: data.Form_customer_type || "",
          loanAmount: data.Form_loan_amount || "", // ⭐ ตั้งค่าที่ get มา
          loanType: data.Form_loan_type || "",
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

      /* ===============================
      🧾 ข้อมูลฟอร์ม (JSON)
    =============================== */
      const payload = {
        ...formData,
        ...formData2,
        idForm: idForm,
        LvChk: getDataLvChk,
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
            window.location.assign("/SAKCreditScoring/Salesperson");
            return; // ⛔ หยุดการทำงานตรงนี้ทันที
          }
          // 🔥 ครั้งแรก → เปิด modal
          if (chksentFileRef.current === 1) {
            setOpenConsentModal(true);
            chksentFileRef.current = 2; // ✅ เปลี่ยนทันที ไม่รอ rerender
          }
          // 🔥 ครั้งที่สอง → redirect
          else {
            window.location.assign("/SAKCreditScoring/Salesperson");
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
        console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        console.log("📦 result จากหลังบ้าน:", result);
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

  useEffect(() => {
    handleDownloadPDF(idForm);
  }, []);

  useEffect(() => {
    chksentFileRef.current = 1;
  }, [idForm]);

  return (
    <div>
      {getDataEditReport?.SCORE_additional_fee && (
        <div className="edit-alert-card">
          <div className="edit-alert-icon">⚠️</div>

          <div className="edit-alert-content">
            <div className="edit-alert-title">แจ้งเตือนการแก้ไขข้อมูล</div>

            <div className="edit-alert-text">
              {getDataEditReport.SCORE_additional_fee}
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
                onChange={handleChange}
                placeholder="x xxxx xxxxxx xx x"
                maxLength={13}
              />
            </div>

            <div className="form-group small">
              <label>วันเดือนปีเกิด</label>
              <input
                type="date"
                name="birthday"
                value={formData.CTM_birthdate || ""}
                onChange={handleChange}
                // readOnly
              />

              {/* แสดงวันที่แบบไทยด้านล่าง */}
              {/* <div style={{ marginTop: "5px", marginLeft: "6px" }}>
                {convertToThaiDate(formData.CTM_birthdate)}
              </div> */}
            </div>

            <div className="form-group small">
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                name="CTM_phone"
                value={formData.CTM_phone}
                onChange={handleChange}
                placeholder="091-123-5678"
                maxLength={10}
              />
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
                <>
                  <div className="pt-4">
                    {getDataShow?.Form_application_document && (
                      <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
                        }img/application/${
                          getDataShow.Form_application_document
                        }`}
                        alt="สำเนาใบสมัครสินเชื่อ"
                        className="preview-img-full"
                        onClick={() =>
                          openModal(
                            `${
                              import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
                            }img/application/${
                              getDataShow.Form_application_document
                            }`
                          )
                        }
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}

                    <p className="img-label">สำเนาใบสมัครสินเชื่อ</p>
                  </div>
                </>
              )}
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
                <>
                  <div className="pt-4">
                    {getDataShow?.Form_idcard_photo && (
                      <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
                        }img/idcard/${getDataShow.Form_idcard_photo}`}
                        alt="หนังสือยินยอม"
                        className="preview-img-full"
                        onClick={() =>
                          openModal(
                            `${
                              import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB
                            }img/idcard/${getDataShow.Form_idcard_photo}`
                          )
                        }
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}

                    <p className="img-label">สำเนาบัตรประชาชน</p>
                  </div>
                </>
              )}
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
                      window.location.assign("/SAKCreditScoring/Salesperson");
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

            width: "740px", // ✅ คุมความกว้าง
            minHeight: "1040px", // ✅ ไม่ให้ยืดเกิน
            padding: "24px 32px",

            background: "#fff",
            fontFamily: "TH Sarabun New, sans-serif",
            fontSize: "14px", // 🔻 ลดจาก 16 → 14
            lineHeight: "1.6", // 🔻 จาก 1.75 → 1.6
            color: "#4d4d4d",
          }}
        >
          {/* โลโก้ + หัว */}
          <div style={{ textAlign: "left", marginBottom: "12px" }}>
            <img
              src="/SAKCreditScoring/logo SAK เลขเสียภาษี.png"
              alt="logo"
              style={{ width: "400px", height: "auto" }} // ✅ ปรับขนาดใหญ่ขึ้น
            />
          </div>
          <br />
          <div
            style={{
              textAlign: "center",
              fontSize: "16px",
              // fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            หนังสือให้ความยินยอมในการเปิดเผยข้อมูล
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "14px",
              textAlign: "right",
              width: "100%",
            }}
          >
            {/* ทำที่ */}

            <div
              style={{
                marginTop: "20px",
                fontSize: "14px",
                textAlign: "right",
                width: "100%",
              }}
            >
              {/* ✅ ทำที่ (ความยาวรวม = วันที่ทั้งหมด) */}
              <div>
                ทำที่&nbsp;
                <span
                  style={{
                    display: "inline-block",
                    width: "279px", // ✅ ให้เท่ากับความยาววันที่รวม
                    borderBottom: "1px dotted #000",
                    textAlign: "center",
                  }}
                >
                  {getDataShow?.CTM_business_zone}
                </span>
              </div>

              {/* ✅ วันที่ */}
              {(() => {
                const { day, month, year } = getThaiDateParts(
                  getDataShow?.CTM_created_at
                );

                return (
                  <div style={{ marginTop: "6px" }}>
                    วันที่&nbsp;
                    <span
                      style={{
                        display: "inline-block",
                        width: "40px",
                        borderBottom: "1px dotted #000",
                        textAlign: "center",
                      }}
                    >
                      {day}
                    </span>
                    &nbsp;เดือน&nbsp;
                    <span
                      style={{
                        display: "inline-block",
                        width: "110px",
                        borderBottom: "1px dotted #000",
                        textAlign: "center",
                      }}
                    >
                      {month}
                    </span>
                    &nbsp;พ.ศ.&nbsp;
                    <span
                      style={{
                        display: "inline-block",
                        width: "60px",
                        borderBottom: "1px dotted #000",
                        textAlign: "center",
                      }}
                    >
                      {year}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #000",
              marginTop: "12px",
              padding: "8px",
              fontSize: "14px",
            }}
          >
            <b>บุคคลธรรมดา</b>
            <hr />
            <br />
            ข้าพเจ้า นาย/นาง/นางสาว{" "}
            <span
              style={{
                display: "inline-block",
                minWidth: "200px",
                borderBottom: "1px dotted #000",
                textAlign: "center",
              }}
            >
              {getDataShow?.CTM_firstname || ""}
            </span>{" "}
            นามสกุล{" "}
            <span
              style={{
                display: "inline-block",
                minWidth: "200px",
                borderBottom: "1px dotted #000",
                textAlign: "center",
              }}
            >
              {getDataShow?.CTM_lastname || ""}
            </span>
            <br />
            วัน/เดือน/ปี พ.ศ.เกิด{" "}
            <span
              style={{
                display: "inline-block",
                minWidth: "200px",
                borderBottom: "1px dotted #000",
                textAlign: "center",
              }}
            >
              {convertToThaiDate(getDataShow?.CTM_birthdate) || ""}
            </span>{" "}
            หมายเลขโทรศัพท์
            <span
              style={{
                display: "inline-block",
                minWidth: "200px",
                borderBottom: "1px dotted #000",
                textAlign: "center",
              }}
            >
              {formatPhoneFront(getDataShow?.CTM_phone)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              บัตรประจำตัวประชาชนเลขที่ :{" "}
              {getDataShow?.CTM_citizen_id?.replaceAll("-", "") // ✅ ลบ - ออกก่อน (ถ้ามี)
                .split("") // ✅ แยกเป็นตัวอักษร
                .map((digit, index) => (
                  <span
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {/* ✅ ช่องตัวเลข */}
                    <span
                      style={{
                        width: "15px",
                        height: "25px",
                        border: "1px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "100",
                      }}
                    >
                      {digit}
                    </span>

                    {/* ✅ ขีดคั่นตำแหน่งตามรูปบัตร ปชช */}
                    {[0, 4, 9, 11].includes(index) && (
                      <span style={{ margin: "0 6px", fontSize: "20px" }}>
                        -
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>

          <p
            style={{
              marginTop: "19px",
              textAlign: "justify",
              textIndent: "6em",
              fontSize: "14px",
              wordBreak: "break-word",
            }}
          >
            ข้าพเจ้าตกลงยินยอมให้ บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด (“บริษัท”)
            เปิดเผยหรือให้นำข้อมูลของ ข้าพเจ้าแก่ บริษัท ศักดิ์สยามลิสซิ่ง จำกัด
            (มหาชน) ซึ่งเป็นสมาชิกที่ข้าพเจ้าใช้บริการของบริษัท
            เพื่อประโยชน์ในการ
            วิเคราะห์สินเชื่อตามกฎหมายสินเชื่อ/ขอออกบัตรเครดิตของข้าพเจ้าที่ให้ไว้กับบริษัทดังกล่าวข้างต้นรวมทั้งเพื่อ
            ประโยชน์ในการทบทวนสินเชื่อ ต่ออายุสัญญาสินเชื่อ/บัตรเครดิต
            การบริหารและป้องกันความเสี่ยงตามข้อกำหนด ของธนาคารแห่งประเทศไทย
            และให้ถือว่าคู่ฉบับ และบรรดาสำเนา ภายถ่าย ข้อมูลอิเล็กทรอนิกส์
            หรือโทรสารที่ทำ สำเนาขึ้นมาจากหนังสือให้ความยินยอมฉบับนี้
            โดยการถ่ายสำเนา ถ่ายภาพหรือบันทึกไว้ไม่ว่าในรูปแบบใดๆ
            เป็นหลักฐานในการให้ความยินยอมของข้าพเจ้าเช่นเดียวกัน
          </p>
          <p
            style={{
              marginTop: "12px",
              textAlign: "justify",
              textIndent: "6em",
              fontSize: "14px",
            }}
          >
            ข้าพเจ้าจึงได้ลงลายมือชื่อไว้เป็นสำคัญ
          </p>
          {/* ✅ โซนลายเซ็นทั้งหมด */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginTop: "20px",
            }}
          >
            {/* ✅ กล่องผู้ให้ความยินยอม */}
            <div
              style={{
                border: "1px solid #000",
                borderRadius: "10px",
                width: "360px",
                padding: "12px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* ไอคอนติ๊ก */}
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    border: "1px solid #000",
                    borderRadius: "80%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    marginRight: "6px",
                  }}
                >
                  ✓
                </span>

                {/* ข้อความ + เส้น */}
                <div style={{ textAlign: "left" }}>
                  ลงชื่อ
                  <span
                    style={{
                      display: "inline-block",
                      width: "260px",
                      borderBottom: "1px dotted #000",
                      marginLeft: "8px",
                    }}
                  ></span>
                </div>
              </div>

              <div>
                ({getDataShow?.CTM_title_name}
                {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname})
                ตัวบรรจง
              </div>
              <div>ผู้ให้ความยินยอม</div>
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
                  borderRadius: "10px",
                  width: "360px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  ลงชื่อ{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: "260px", // ✅ ปรับความยาวเส้นได้
                      borderBottom: "1px dotted #000",
                      marginLeft: "8px",
                    }}
                  ></span>
                </div>

                <div>({getDataShow?.Form_witness1_name}) ตัวบรรจง</div>
                <div>พยาน</div>
              </div>
            </div>
          </div>

          <br />
          {/* ✅ กรอบหมายเหตุ */}
          <div
            style={{
              border: "1px solid #000",
              padding: "6px 10px",
              marginTop: "15px",
              fontSize: "14px",
              lineHeight: "1.4",
              textAlign: "justify",
            }}
          >
            <strong>หมายเหตุ :</strong>{" "}
            ข้อมูลนี้เป็นของให้แก่สมาชิกหรือผู้ใช้บริการเป็นองค์ประกอบหนึ่งในการพิจารณาสินเชื่อของสถาบันการเงิน
            แต่การเปิดเผยข้อมูลนี้จะผูกพันถึงสิทธิของเจ้าของข้อมูลที่จะให้ความยินยอมหรือไม่ก็ได้
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalepersonView_DataCustomer;
