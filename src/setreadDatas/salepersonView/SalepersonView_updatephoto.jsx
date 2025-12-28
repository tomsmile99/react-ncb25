import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TiUpload } from "react-icons/ti";
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

  const [isModalOpen, setIsModalOpen] = useState(false); // popup #1
  const [previewImage, setPreviewImage] = useState(false); // popup #3
  const [getDataShow, setgetDataShow] = useState({});

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

  const handleUpdateCustomer = async () => {
    if (!validateForm() || !validateImages()) return;

    try {
      const formDataUpload = new FormData();

      formDataUpload.append("idForm", idForm);
      formDataUpload.append("loanType", formData2.loanType);
      formDataUpload.append("loanAmount", formData2.loanAmount);
      formDataUpload.append("customerType", formData2.customerType);

      // ✅ แนบไฟล์
      if (images.img1) formDataUpload.append("img1", images.img1);
      if (images.img2) formDataUpload.append("img2", images.img2);
      if (images.img3) formDataUpload.append("img3", images.img3);

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
        "/api/insurances/datacustomers/updateData_evidence",
        formDataUpload
      );
      const { status, result, files, post } = data;

      if (status === 200) {
        // console.log("✅ status =", status);
        // console.log("📨 message =", post);
        // console.log("📄 files =", files);

        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.assign("/SAKCreditScoring/Salesperson");
        });
      }
    } catch (err) {
      console.error(err);
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
              <label className="tag-label1">รูปบัตรประชาชน</label>
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
                  cursor: "pointer",
                }}
                onClick={handleUpdateCustomer}
              >
                <TiUpload size={16} /> อัปโหลดหลักฐาน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalepersonView_updatephoto;
