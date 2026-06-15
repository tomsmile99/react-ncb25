import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TiUpload } from "react-icons/ti";
import { GoChecklist } from "react-icons/go";
import { GrDocumentText } from "react-icons/gr";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineComputer } from "react-icons/md";
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

const SalepersonView_updatephoto = ({ idForm }) => {
  const navigate = useNavigate();
  //get
  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    CTM_lastname: "",
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

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

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

  const [isModalOpen, setIsModalOpen] = useState(false); // popup #1
  const [previewImage, setPreviewImage] = useState(false); // popup #3
  const [getDataShow, setgetDataShow] = useState({});
  const [acceptConfirm, setAcceptConfirm] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    setImages((prev) => ({
      ...prev,
      [name]: file, // ✅ เก็บ File
    }));

    setErrors((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [name]: false,
      },
    }));
  };

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
        },
      );

      const { status, result, message } = data;

      if (status === 200) {
        // console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        // console.log("📦 result จากหลังบ้าน:", result);
        setgetDataShow(result[0]);
        const data = result[0];

        setgetDataShow(data); // ถ้ายังต้องใช้โชว์ที่อื่น
        setFormData({
          title: data.CTM_title_name || "",
          firstname: data.CTM_firstname || "",
          CTM_lastname: data.CTM_lastname || "",
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
        });
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

  const [errors, setErrors] = useState({
    loanType: false,
    loanAmount: false,
    customerType: false,
    images: {
      img1: false,
      img2: false,
      img3: false,
    },
  });

  const validateForm = () => {
    const newErrors = {
      loanType: !formData2.loanType,
      loanAmount: !formData2.loanAmount,
      customerType: !formData2.customerType,
      images: !(images.img1 || images.img2 || images.img3),
    };

    setErrors(newErrors);

    // ถ้ามี error อย่างน้อย 1 ช่อง → ไม่ผ่าน
    return !Object.values(newErrors).some(Boolean);
  };
  const validateImages = () => {
    const newImageErrors = {
      img1: !images.img1,
      img2: !images.img2,
      img3: !images.img3,
    };

    setErrors((prev) => ({
      ...prev,
      images: newImageErrors,
    }));

    return !Object.values(newImageErrors).some(Boolean);
  };

  const InfoItem = ({ label, value }) => (
    <div>
      <div
        style={{
          color: "#64748b",
          fontSize: "13px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#0f172a",
          fontWeight: 600,
          fontSize: "15px",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );

  const ImagePreviewCard = ({ file, title }) => (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: 700,
          fontSize: "15px",
          color: "#0f172a",
        }}
      >
        {title}
      </div>

      <img
        src={URL.createObjectURL(file)}
        alt={title}
        style={{
          width: "100%",
          maxHeight: "800px",
          objectFit: "contain",
          background: "#f8fafc",
          cursor: "zoom-in",
        }}
        onClick={() => openModal(URL.createObjectURL(file))}
      />
    </div>
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCustomerData = async () => {
    if (isSubmitting) return; // ❌ กันกดซ้ำ
    if (!validateForm() || !validateImages()) return;

    setIsSubmitting(true); // 🔒 ล็อกปุ่ม

    try {
      const formDataUpload = new FormData();

      formDataUpload.append("idForm", idForm);
      formDataUpload.append("loanType", formData2.loanType);
      formDataUpload.append("loanAmount", formData2.loanAmount);
      formDataUpload.append("customerType", formData2.customerType);

      if (images.img1) formDataUpload.append("img1", images.img1);
      if (images.img2) formDataUpload.append("img2", images.img2);
      if (images.img3) formDataUpload.append("img3", images.img3);

      // ✅ เพิ่มบัตรประชาชน
      formDataUpload.append("CTM_citizen_id", formData.CTM_citizen_id);

      // formDataUpload.forEach((value, key) => {
      //   console.log(key, value);
      // });

      const { data } = await apiClient.post(
        "/api/insurances/datacustomers/updateData_evidence",
        formDataUpload,
      );

      if (data.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false, // ⭐ ห้ามคลิกนอก
          allowEscapeKey: false,
        });

        window.location.assign("/Salesperson");
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422) {
        Swal.fire({
          icon: "warning",
          title: "ไฟล์ไม่ถูกต้อง",
          text: err.response.data.message,
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsSubmitting(false); // 🔓 ปลดล็อก (กรณี error)
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const getCustomerTypeName = (type) => {
    const customerTypes = {
      1: "สินเชื่อส่วนบุคคล",
      2: "สินเชื่อนาโนไฟแนนซ์",
      3: "สินเชื่อที่ดิน",
      4: "สินเชื่อโซลาร์รูฟท็อป",
      // 5: "สินเชื่อโซลาร์แอร์",
      6: "สินเชื่อโซลาร์ไมโครอินเวอร์เตอร์",
      7: "สินเชื่อเช่าซื้อ (รถจักรยานยนต์ใหม่)",
      8: "สินเชื่อเช่าซื้อ (รถแลกเงิน)",
      9: "สินเชื่อทะเบียนรถ",
      10: "สินเชื่อโซลาร์แอร์",
    };

    return customerTypes[type] || "-";
  };
  const getCustomerTypeText = (type) => {
    const customerTypes = {
      1: "ลูกค้าใหม่",
      2: "ลูกค้าใหม่ (ลูกค้าเก่าปิดบัญชี ตั้งแต่ 1 ปี กลับมาใช้บริการ)",
      3: "ลูกค้าใหม่ (ย้ายไฟแนนซ์)",
      4: "ลูกค้าเก่า",
      5: "ลูกค้าเก่า (ย้ายไฟแนนซ์)",
      6: "ลูกค้าเก่าต่อสัญญา/RENEW (ขอตรวจนอกหลักเกณฑ์)",
      7: "ลูกค้าเก่าต่อสัญญา/RENEW เพิ่มวงเงิน",
      8: "ลูกค้าเก่าต่อสัญญา/RENEW เงื่อนไขการชำระรายงวด มีการต่อสัญญาต่อเนื่อง ตั้งแต่ 1 ปีขึ้นไป",
      9: "ลูกค้าเก่า เงื่อนไขสินเชื่อเพื่อให้ความช่วยเหลือลูกหนี้",
    };

    return customerTypes[type] || "-";
  };

  const [checkList, setCheckList] = useState({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
    c6: false,
    c7: false,
    c8: false,
    c9: false,
    c10: false,
  });

  const checkedCount = Object.values(checkList).filter(Boolean).length;
  const isAllChecked = checkedCount === 10;

  const handleCheck = (key) => {
    setCheckList((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    handleDownloadPDF(idForm);
  }, []);

  return (
    <div>
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
                <strong>ชื่อผู้บันทึก:</strong>
                <span> {getDataShow?.CTM_recorder_fullname || ""}</span>
              </div>

              <div className="rec-row">
                <strong>ตำแหน่ง:</strong>
                <span>{getDataShow?.CTM_position || ""}</span>
              </div>

              <div className="rec-row">
                <strong>สาขา:</strong>
                <span>{getDataShow?.CTM_branch || ""}</span>
              </div>

              <div className="rec-row">
                <strong>เขตธุรกิจ:</strong>
                <span>{getDataShow?.CTM_business_zone || ""}</span>
              </div>

              <div className="rec-row">
                <strong>ภาคธุรกิจ:</strong>
                <span>{getDataShow?.CTM_business_region || ""}</span>
              </div>

              <div className="rec-row">
                <strong>วันที่บันทึก:</strong>
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
                disabled
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
                disabled
              />
            </div>
            <div className="form-group small">
              <label>นามสกุล</label>
              <input
                type="text"
                name="lastname"
                value={formData.CTM_lastname}
                onChange={handleChange}
                placeholder="นามสกุล"
                disabled
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
                disabled
              />
            </div>

            <div className="form-group small">
              <label>วันเดือนปีเกิด</label>
              <input
                type="text"
                name="birthday"
                value={convertToThaiDate(formData.CTM_birthdate)}
                readOnly
                disabled
              />
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
                disabled
              />
            </div>
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
            <h3 className="card-title">ส่วนที่ 3 : อัปโหลดเอกสารลูกค้า</h3>
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
                className={`input-select ${
                  errors.customerType ? "input-error" : ""
                }`}
              >
                <option value="">-- เลือกประเภทสินเชื่อ --</option>
                <option value="1">สินเชื่อส่วนบุคคล</option>
                <option value="2">สินเชื่อนาโนไฟแนนซ์</option>
                <option value="3">สินเชื่อที่ดิน</option>
                <option value="4">สินเชื่อโซลาร์รูฟท็อป</option>
                {/* <option value="5">สินเชื่อโซลาร์แอร์</option> */}
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
                placeholder="กรอกเฉพาะตัวเลข"
                className="input-number"
                value={formatNumber(formData2.loanAmount)} // ✅ แสดงลูกน้ำ
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
                onChange={(e) =>
                  setFormData2({ ...formData2, loanType: e.target.value })
                }
                className={`input-select ${
                  errors.loanType ? "input-error" : ""
                }`}
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
                <option value="9">
                  ลูกค้าเก่า เงื่อนไขสินเชื่อเพื่อให้ความช่วยเหลือลูกหนี้
                </option>
              </select>
            </div>
          </div>
          <hr />

          <div className="upload-grid preview-style">
            <div
              className={`upload-group pb ${
                errors.images.img1 ? "input-error" : ""
              }`}
            >
              <label className="tag-label1">
                หนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
              </label>

              <input
                type="file"
                name="img1"
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.img1 &&
                (() => {
                  const previewUrl = URL.createObjectURL(images.img1);

                  return (
                    <div className="pt-4">
                      <img
                        src={previewUrl}
                        alt="preview1"
                        className="preview-img-full"
                        onClick={() => openModal(previewUrl)} // ✅ ส่ง URL
                      />
                      <p className="img-label">
                        สำเนาหนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                      </p>
                    </div>
                  );
                })()}
            </div>

            <div
              className={`upload-group ${
                errors.images.img2 ? "input-error" : ""
              }`}
            >
              <label className="tag-label1">ใบสมัครสินเชื่อ</label>
              <input
                type="file"
                name="img2"
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.img2 &&
                (() => {
                  const previewUrl = URL.createObjectURL(images.img2);

                  return (
                    <div className="pt-4">
                      <img
                        src={previewUrl}
                        alt="preview2"
                        className="preview-img-full"
                        onClick={() => openModal(previewUrl)} // ✅ ส่ง URL
                      />
                      <p className="img-label">สำเนาใบสมัครสินเชื่อ</p>
                    </div>
                  );
                })()}
            </div>

            <div
              className={`upload-group ${
                errors.images.img3 ? "input-error" : ""
              }`}
            >
              <label className="tag-label1">รูปสำเนาบัตรประชาชน</label>
              <input
                type="file"
                name="img3"
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.img3 &&
                (() => {
                  const previewUrl = URL.createObjectURL(images.img3);

                  return (
                    <div className="pt-4">
                      <img
                        src={previewUrl} // ✅ ใช้ URL
                        alt="preview3"
                        className="preview-img-full"
                        onClick={() => openModal(previewUrl)} // ✅ ส่ง URL
                      />
                      <p className="img-label">สำเนารูปถ่ายบัตรประชาชน</p>
                    </div>
                  );
                })()}
            </div>
            {openConfirmModal && (
              <div className="modal-overlay1">
                <div
                  style={{
                    background: "#ffffff",
                    width: "92%",
                    maxWidth: "1100px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    borderRadius: "24px",
                    padding: "30px",
                    boxShadow: "0 25px 60px rgba(15,23,42,0.18)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "25px",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                      }}
                    >
                      <GoChecklist />
                    </div>

                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "#0f172a",
                          fontWeight: 700,
                          fontSize: "22px",
                        }}
                      >
                        ตรวจสอบข้อมูลก่อนส่ง
                      </h3>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        กรุณาตรวจสอบรายละเอียดและเอกสารก่อนยืนยันส่งข้อมูล
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "18px",
                      padding: "22px",
                      marginBottom: "25px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: "18px",
                      }}
                    >
                      ข้อมูลลูกค้า
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(260px,1fr))",
                        gap: "18px",
                      }}
                    >
                      <InfoItem
                        label="ชื่อ - นามสกุล"
                        value={`${formData.title}${formData.firstname} ${formData.CTM_lastname}`}
                      />

                      <InfoItem
                        label="เลขบัตรประชาชน"
                        value={formData.CTM_citizen_id}
                      />

                      <InfoItem
                        label="เบอร์โทรศัพท์"
                        value={formData.CTM_phone}
                      />

                      <InfoItem
                        label="ประเภทสินเชื่อ"
                        value={getCustomerTypeName(formData2.customerType)}
                      />

                      <InfoItem
                        label="ประเภทลูกค้า"
                        value={getCustomerTypeText(formData2.loanType)}
                      />

                      <InfoItem
                        label="วงเงินสินเชื่อ"
                        value={`${formatNumber(formData2.loanAmount)} บาท`}
                      />
                    </div>
                  </div>

               <div
  style={{
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    background: "#ffffff",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  }}
>
  {/* Progress */}
  <div
    style={{
      marginBottom: "20px",
      padding: "12px 16px",
      background: "#f8fafc",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{
        fontWeight: 600,
        color: "#334155",
      }}
    >
      รายการตรวจสอบก่อนส่งข้อมูล
    </span>

    <span
      style={{
        background: "#dbeafe",
        color: "#1d4ed8",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      {checkedCount}/10 ข้อ
    </span>
  </div>

  {/* Section 1 */}
  <div style={{ marginBottom: "20px" }}>
    <h5
      style={{
        color: "#2563eb",
        fontWeight: 700,
        marginBottom: "12px",
      }}
    >
      <GrDocumentText /> 1. ใบสมัครและหนังสือให้ความยินยอม
    </h5>

    <label style={{ display: "block", marginBottom: "10px", paddingLeft: "41px" }}>
      <input
        type="checkbox"
        checked={checkList.c1}
        onChange={() => handleCheck("c1")}
      />{" "}
      ชื่อ - นามสกุลลูกค้า ถูกต้องตรงกัน
    </label>

    <label style={{ display: "block", marginBottom: "10px" , paddingLeft: "41px" }}>
      <input
        type="checkbox"
        checked={checkList.c2}
        onChange={() => handleCheck("c2")}
      />{" "}
      วันเดือนปีเกิดลูกค้า ถูกต้องตรงกัน
    </label>

    <label style={{ display: "block", marginBottom: "10px" , paddingLeft: "41px" }}>
      <input
        type="checkbox"
        checked={checkList.c3}
        onChange={() => handleCheck("c3")}
      />{" "}
      เลขบัตรประชาชนลูกค้า ตรงกัน
    </label>

    <label style={{ display: "block" , paddingLeft: "41px"}}>
      <input
        type="checkbox"
        checked={checkList.c4}
        onChange={() => handleCheck("c4")}
      />{" "}
      เบอร์โทรศัพท์ ถูกต้องตรงกัน
    </label>
  </div>

  <hr style={{ margin: "20px 0" }} />

  {/* Section 2 */}
  <div style={{ marginBottom: "20px" }}>
    <h5
      style={{
        color: "#2563eb",
        fontWeight: 700,
        marginBottom: "12px",
      }}
    >
      <HiOutlineClipboardDocumentList /> 2. เอกสารทั้ง 3 ฉบับ
    </h5>

    <label style={{ display: "block", marginBottom: "10px" , paddingLeft: "41px"}}>
      <input
        type="checkbox"
        checked={checkList.c5}
        onChange={() => handleCheck("c5")}
      />{" "}
      ไม่มีการลงนามเขียนทับ/ย้ำ
    </label>

    <label style={{ display: "block", marginBottom: "10px" , paddingLeft: "41px"}}>
      <input
        type="checkbox"
        checked={checkList.c6}
        onChange={() => handleCheck("c6")}
      />{" "}
      ลักษณะการลงนามเหมือนกันทุกฉบับ
    </label>

    <label style={{ display: "block", paddingLeft: "41px" }}>
      <input
        type="checkbox"
        checked={checkList.c7}
        onChange={() => handleCheck("c7")}
      />{" "}
      ลงนามครบถ้วนทั้งลูกค้า และพยาน
    </label>
  </div>

  <hr style={{ margin: "20px 0" }} />

  {/* Section 3 */}
  <div>
    <h5
      style={{
        color: "#2563eb",
        fontWeight: 700,
        marginBottom: "12px",
      }}
    >
     <MdOutlineComputer />  3. ใบสมัครและข้อมูลในระบบ
    </h5>

    <label style={{ display: "block", marginBottom: "10px" , paddingLeft: "41px"}}>
      <input
        type="checkbox"
        checked={checkList.c8}
        onChange={() => handleCheck("c8")}
      />{" "}
      ประเภทสินเชื่อ ตรงกับในระบบ
    </label>

    <label style={{ display: "block", marginBottom: "10px" , paddingLeft: "41px"}}>
      <input
        type="checkbox"
        checked={checkList.c9}
        onChange={() => handleCheck("c9")}
      />{" "}
      วงเงินสินเชื่อ ตรงกับในระบบ
    </label>

    <label style={{ display: "block" , paddingLeft: "41px"}}>
      <input
        type="checkbox"
        checked={checkList.c10}
        onChange={() => handleCheck("c10")}
      />{" "}
      ประเภทลูกค้า เลือกถูกต้อง
    </label>
  </div>

  {/* Alert */}
  <div
    style={{
      marginTop: "24px",
      padding: "14px 16px",
      borderRadius: "12px",
      background: isAllChecked ? "#f0fdf4" : "#fffbeb",
      border: isAllChecked
        ? "1px solid #86efac"
        : "1px solid #fde68a",
      color: isAllChecked ? "#166534" : "#92400e",
    }}
  >
    <div style={{ fontWeight: 700 }}>
      {isAllChecked ? "✅ ตรวจสอบครบถ้วนแล้ว" : "⚠️ กรุณาตรวจสอบข้อมูลให้ครบ"}
    </div>

    <div
      style={{
        marginTop: "4px",
        fontSize: "13px",
      }}
    >
      ต้องเลือกครบทั้ง 10 รายการก่อนจึงจะสามารถส่งข้อมูลได้
    </div>
  </div>
</div>

                  {/* <div
                    style={{
                      marginTop: "20px",
                      padding: "14px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#334155",
                        fontWeight: 500,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={confirmChecked}
                        onChange={(e) => setConfirmChecked(e.target.checked)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                      ข้าพเจ้าได้ตรวจสอบข้อมูลทั้งหมดถูกต้องครบถ้วนแล้ว
                    </label>
                  </div> */}

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px",
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "20px",
                    }}
                  >
                    <button
                      onClick={() => setOpenConfirmModal(false)}
                      style={{
                        height: "46px",
                        padding: "0 22px",
                        borderRadius: "12px",
                        border: "1px solid #d1d5db",
                        background: "#ffffff",
                        color: "#374151",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ย้อนกลับ
                    </button>

                    <button
                      disabled={!isAllChecked}
                      onClick={() => {
                        // setOpenConfirmModal(false);
                        submitCustomerData();
                      }}
                      style={{
                        height: "46px",
                        padding: "0 24px",
                        borderRadius: "12px",
                        border: "none",
                        background: isAllChecked
                          ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
                          : "#cbd5e1",
                        color: "#ffffff",
                        fontWeight: 600,
                        cursor: isAllChecked ? "pointer" : "not-allowed",
                        boxShadow: isAllChecked
                          ? "0 8px 20px rgba(37,99,235,0.25)"
                          : "none",
                        transition: "all .2s ease",
                      }}
                    >
                      ✓ ยืนยันส่งข้อมูล ({checkedCount}/10)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isModalOpen && (
              <div className="modal-overlay1" onClick={closeModal}>
                <div className="modal-content">
                  <img src={previewImage} alt="zoom" className="modal-img" />
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
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onClick={() => {
                  if (!validateForm() || !validateImages()) return;

                  setOpenConfirmModal(true);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "กำลังบันทึก..."
                ) : (
                  <>
                    <TiUpload size={16} />
                    อัปโหลดหลักฐาน
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalepersonView_updatephoto;
