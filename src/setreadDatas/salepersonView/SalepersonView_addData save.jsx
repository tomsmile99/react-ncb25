import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import html2pdf from "html2pdf.js";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { FaIdCard, FaUser } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { userToken } from "../../recoilstore/userStores";
import { RiIdCardFill } from "react-icons/ri";

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

const SalepersonView_addData = ({ idForm }) => {
  const [signMethod, setSignMethod] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    cid: "",
    birthday: "",
    number: "",
    address: "",
  });

  const [showPopupSameLastname, setShowPopupSameLastname] = useState(false); // popup #1
  const [showSignMethod, setShowSignMethod] = useState(false); // popup #2
  const [showWitnessPopup, setShowWitnessPopup] = useState(false); // popup #3
  const [showWarningPopup, setShowWarningPopup] = useState(false); // popup แจ้งเตือน

  const [witness1, setWitness1] = useState({ firstname: "", lastname: "" });
  const [witness2, setWitness2] = useState({ firstname: "", lastname: "" });

  const lastNameList = ["ใจดี", "สุขสันต์", "ยิ้มแย้ม", "สุขสม", "ทองแท้"];

  const [recorder, setRecorder] = useState({
    fullname: "กมลชนก สุขดี",
    position: "พนักงานสินเชื่อ",
    branch: "สาขาอุตรดิตถ์",
    zone: "เขตเหนือบน",
    region: "ภาคเหนือ",
    photo: `https://apimb.sakerp.org/file_photoEMP/9a03f5a6654323813b17069a33539a31.jpg`, // หรือ path ภายในระบบของคุณ
    date: new Date().toLocaleDateString("th-TH"),
  });

  const [images, setImages] = useState({
    img1: null,
    img2: null,
    img3: null,
  });

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setImages((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getEmployeeDB_Admin = async (currentPage, searchQuery) => {
    const params = {
      page: currentPage, // หมายเลขหน้าปัจจุบัน
      limit, // จำนวนรายการต่อหน้า
      query: searchQuery, // คำค้นหา
    };

    try {
      const { data } = await apiClient.get(`/show_employee_admin`, { params });

      const { status, result, totalPages } = data;
      if (status) {
        setProbationaryEmployees(result);
        // console.log(result)
        setTotalPages(totalPages); // ตั้งค่าจำนวนหน้าทั้งหมด
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleCheckLastname = () => {
    const employeeLastname = recorder.fullname.split(" ").pop().trim();
    const customerLastname = formData.lastname.trim();

    if (!customerLastname) return setShowWarningPopup(true);

    // ถ้า นามสกุลพนักงาน = ลูกค้า → พยานคนแรกต้องแก้ก่อน
    if (employeeLastname === customerLastname) {
      setShowPopupSameLastname(true);
    } else {
      setShowSignMethod(true);
    }
  };

  const customerLastname = formData.lastname.trim();
  // Popup แจ้งเตือนกรอกข้อมูลพยาน

  // const openModal = (img) => {
  //   setPreviewImage(img);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setPreviewImage(null);
  // };

  //คะแนนประเมินแต่ละรอบ

  // useEffect(() => {
  //   getEmployeeDB_Admin(currentPage, query);
  //   // Attendance();
  // }, [currentPage, query]);

  return (
    <div>
      <div className="layout-wrapper">
        {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}
        <div className="card recorder-card">
          <h3 className="card-title">ส่วนที่ 1 : รายละเอียดผู้บันทึกข้อมูล</h3>

          <div className="rec-profile-row">
            <img
              src={recorder.photo}
              alt="profile"
              className="rec-photo-rect"
            />

            <div className="rec-info">
              <div className="rec-row">
                <strong>ชื่อผู้บันทึก:</strong>
                <span>{recorder.fullname}</span>
              </div>

              <div className="rec-row">
                <strong>ตำแหน่ง:</strong>
                <span>{recorder.position}</span>
              </div>

              <div className="rec-row">
                <strong>สาขา:</strong>
                <span>{recorder.zone}</span>
              </div>

              <div className="rec-row">
                <strong>เขตธุรกิจ:</strong>
                <span>{recorder.branch}</span>
              </div>

              <div className="rec-row">
                <strong>ภาคธุรกิจ:</strong>
                <span>{recorder.region}</span>
              </div>

              <div className="rec-row">
                <strong>วันที่บันทึก:</strong>
                <span>{recorder.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 การ์ดที่ 2 : ฟอร์มรับข้อมูล */}
        <div className="card form-card">
          <div className="form-header">
            <h3 className="card-title">
              ส่วนที่ 2 : ฟอร์มรับข้อมูลลูกค้า (เสียบบัตร) 
            </h3>
            <button className="btn-readcard">
              <RiIdCardFill style={{ fontSize: "16px", marginRight: 5 }} />
              ดึงข้อมูลบัตร
            </button>
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
                name="cid"
                value={formData.cid}
                onChange={handleChange}
                placeholder="x xxxx xxxxxx xx x"
              />
            </div>

            <div className="form-group small">
              <label>วันเดือนปีเกิด</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>

            <div className="form-group small">
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="091-123-5678"
              />
            </div>

            <div className="form-group full">
              <label>ที่อยู่ตามทะเบียนบ้าน</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="บ้านเลขที่ / หมู่บ้าน / แขวง / เขต / จังหวัด"
              />
            </div>
          </div>
          <button className="btn-submit" onClick={handleCheckLastname}>
            ถัดไป
          </button>
          <button className="btn-submit">บันทึกข้อมูล</button>
        </div>
      </div>

      {/* 🔹 การ์ดที่ 3 : อัปโหลดรูปถ่ายลูกค้า */}
      {/* <div style={{ padding: "0 20px" }} className="pt-1">
        <div className="card form-card full-width">
          <div className="form-header">
            <h3 className="card-title">ส่วนที่ 3 : อัปโหลดรูปถ่ายลูกค้า</h3>
          </div>

          <div className="form-grid">
            <div className="form-group small">
              <label style={{ fontSize: "16px" }}>ประเภทสินเชื่อ</label>
              <select
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                className="input-select"
              >
                <option value="">-- เลือกประเภทสินเชื่อ --</option>
                <option value="สินเชื่อส่วนบุคคล">1. สินเชื่อส่วนบุคคล</option>
                <option value="สินเชื่อนาโนไฟแนนซ์">
                  2. สินเชื่อนาโนไฟแนนซ์
                </option>
                <option value="สินเชื่อที่ดิน">3. สินเชื่อที่ดิน</option>
                <option value="สินเชื่อโซลาร์รูฟท็อป">
                  4. สินเชื่อโซลาร์รูฟท็อป
                </option>
                <option value="สินเชื่อโซลาร์แอร์">
                  5. สินเชื่อโซลาร์แอร์
                </option>
                <option value="สินเชื่อเช่าซื้อ (รถจักรยานยนต์ใหม่)">
                  6. สินเชื่อเช่าซื้อ (รถจักรยานยนต์ใหม่)
                </option>
                <option value="สินเชื่อเช่าซื้อ (รถแลกเงิน)">
                  7. สินเชื่อเช่าซื้อ (รถแลกเงิน)
                </option>
                <option value="สินเชื่อทะเบียนรถ">8. สินเชื่อทะเบียนรถ</option>
              </select>
            </div>

          
            <div className="form-group small">
              <label style={{ fontSize: "16px" }}>วงเงินขอสินเชื่อ</label>
              <input
                type="text"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    loanAmount: e.target.value.replace(/[^0-9]/g, ""),
                  })
                }
                placeholder="กรอกเฉพาะตัวเลข"
                className="input-number"
              />
            </div>

            <div className="form-group small">
              <label style={{ fontSize: "16px" }}>ประเภทลูกค้า</label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className="input-select"
              >
                <option value="">-- เลือกประเภทลูกค้า --</option>
                <option value="ลูกค้าใหม่">1. ลูกค้าใหม่</option>
                <option value="ลูกค้าใหม่ (ลูกค้าเก่าปิดบัญชี 1 ปีกลับมาใช้บริการ)">
                  2. ลูกค้าใหม่ (ลูกค้าเก่าปิดบัญชี ตั้งแต่ 1 ปี
                  กลับมาใช้บริการ)
                </option>
                <option value="ลูกค้าใหม่ (ย้ายไฟแนนซ์)">
                  3. ลูกค้าใหม่ (ย้ายไฟแนนซ์)
                </option>
                <option value="ลูกค้าเก่า">4. ลูกค้าเก่า</option>
                <option value="ลูกค้าเก่า (ย้ายไฟแนนซ์)">
                  5. ลูกค้าเก่า (ย้ายไฟแนนซ์)
                </option>
                <option value="ลูกค้าเก่าต่อสัญญา/RENEW (นอกหลักเกณฑ์)">
                  6. ลูกค้าเก่าต่อสัญญา/RENEW (ขอตรวจนอกหลักเกณฑ์)
                </option>
                <option value="ลูกค้าเก่าต่อสัญญา/RENEW เพิ่มวงเงิน">
                  7. ลูกค้าเก่าต่อสัญญา/RENEW เพิ่มวงเงิน
                </option>
                <option value="ลูกค้าเก่าต่อสัญญา/RENEW ทะเบียนรถ (ชำระรายเดือน)">
                  8. ลูกค้าเก่าต่อสัญญา/RENEW ทะเบียนรถ
                  (เงื่อนไขการชำระรายเดือน)
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
                onChange={handleImageChange}
              />
              {images.img1 && (
                <>
                  <div className="pt-4">
                    <img
                      src={images.img1}
                      alt="preview1"
                      className="preview-img-full"
                      onClick={() => openModal(images.img1)}
                    />
                    <p className="img-label">
                      สำเนาหนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="upload-group">
              <label className="tag-label1">ใบสมัครสินเชื่อ</label>
              <input
                type="file"
                name="img2"
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.img2 && (
                <>
                  <div className="pt-4">
                    <img
                      src={images.img2}
                      alt="preview2"
                      className="preview-img-full"
                      onClick={() => openModal(images.img2)}
                    />
                    <p className="img-label">สำเนาใบสมัครสินเชื่อ</p>{" "}
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
                onChange={handleImageChange}
              />
              {images.img3 && (
                <>
                  <div className="pt-4">
                    <img
                      src={images.img3}
                      alt="preview3"
                      className="preview-img-full"
                      onClick={() => openModal(images.img3)}
                    />
                    <p className="img-label">สำเนารูปถ่ายบัตรประชาชน</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay1" onClick={closeModal}>
              <div className="modal-content">
                <img src={previewImage} alt="zoom" className="modal-img" />
              </div>
            </div>
          )}
        </div>
      </div> */}

      {/* ✅ POPUP #1 : แก้ชื่อพยานแรก */}
      {showPopupSameLastname && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h4>ตรวจสอบนามสกุลพยาน</h4>
            <p>พยานห้ามมีนามสกุลเดียวกับลูกค้า กรุณาเปลี่ยนชื่อพยาน</p>

            <div className="form-group pt-2">
              <label>ชื่อ</label>
              <input
                className="input-normal"
                value={witness1.firstname}
                onChange={(e) =>
                  setWitness1({ ...witness1, firstname: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>นามสกุล</label>
              <input
                className="input-normal"
                value={witness1.lastname}
                onChange={(e) =>
                  setWitness1({ ...witness1, lastname: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowPopupSameLastname(false)}
              >
                ปิด
              </button>
              <button
                className="modal-btn next"
                onClick={() => {
                  if (witness1.lastname.trim() === customerLastname) {
                    setShowWarningPopup(true);
                    return;
                  }
                  setShowPopupSameLastname(false);
                  setShowSignMethod(true);
                }}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ POPUP #2 : เลือกวิธีลงชื่อ */}
      {showSignMethod && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h4>การลงลายมือชื่อของลูกค้า</h4>

            <label className="choice-box1">
              <input
                type="radio"
                name="signMethod"
                value="finger"
                onChange={(e) => setSignMethod(e.target.value)}
              />
              <span>พิมพ์ลายนิ้วมือ</span>
            </label>

            <label className="choice-box1">
              <input
                type="radio"
                name="signMethod"
                value="signature"
                onChange={(e) => setSignMethod(e.target.value)}
              />
              <span>ลายมือชื่อ (ลายเซ็น)</span>
            </label>

            <div className="modal-actions">
              <div className="modal-actions">
                <button
                  className="modal-btn next"
                  onClick={() => {
                    if (!signMethod) return setShowWarningPopup(true);

                    if (signMethod === "finger") {
                      setShowSignMethod(false);
                      setShowWitnessPopup(true); // popup #3
                    } else {
                      setShowSignMethod(false);
                      console.log("ดำเนินการต่อด้วยลายเซ็น ✅");
                    }
                  }}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* ✅ POPUP #2.9 : พยานคนที่หนึ่ง */}
      {showWitnessPopup && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h4>เพิ่มพยานคนที่ 1</h4>

            <div className="form-group">
              <label>ชื่อ</label>
              <input
                className="input-normal"
                value={witness2.firstname}
                onChange={(e) =>
                  setWitness2({ ...witness2, firstname: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>นามสกุล</label>
              <input
                className="input-normal"
                value={witness2.lastname}
                onChange={(e) =>
                  setWitness2({ ...witness2, lastname: e.target.value })
                }
              />
            </div>

            <div
              className="modal-actions"
              style={{ justifyContent: "space-between" }}
            >
              {/* ✅ ปุ่มกลับไปหน้าเลือกวิธีลงชื่อ */}
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowWitnessPopup(false);
                  setShowSignMethod(true); // ย้อนกลับ popup #2
                }}
              >
                กลับ
              </button>

              {/* ✅ ปุ่มบันทึก / ตรวจเงื่อนไข */}
              <button
                className="modal-btn next"
                onClick={() => {
                  const employeeFirstname = recorder.fullname
                    .split(" ")[0]
                    .trim();
                  const employeeLastname = recorder.fullname
                    .split(" ")
                    .pop()
                    .trim();
                  const customerLastname = formData.lastname.trim();

                  const w2_first = witness2.firstname.trim();
                  const w2_last = witness2.lastname.trim();

                  // ✅ ถ้าไม่ได้แก้พยานคนแรก → พยานคนแรก = พนักงานผู้บันทึก
                  const w1_first =
                    witness1.firstname.trim() || employeeFirstname;
                  const w1_last = witness1.lastname.trim() || employeeLastname;

                  // 1) ห้ามเว้นว่าง
                  if (!w2_first || !w2_last) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // 2) ห้ามซ้ำลูกค้า
                  if (w2_last === customerLastname) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // 3) ห้ามซ้ำพนักงานผู้บันทึก
                  if (w2_last === employeeLastname) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // 4) ห้ามซ้ำพยานคนแรก (จริง ทั้งชื่อ+สกุล)
                  if (w2_first === w1_first && w2_last === w1_last) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // ✅ ผ่านทุกเงื่อนไข
                  setShowWitnessPopup(false);
                  console.log("✅ บันทึกพยานคนที่ 2 สำเร็จ:", witness2);
                }}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ✅ POPUP #3 : พยานคนที่สอง */}
      {showWitnessPopup && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h4>เพิ่มพยานคนที่ 2</h4>

            <div className="form-group">
              <label>ชื่อ</label>
              <input
                className="input-normal"
                value={witness2.firstname}
                onChange={(e) =>
                  setWitness2({ ...witness2, firstname: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>นามสกุล</label>
              <input
                className="input-normal"
                value={witness2.lastname}
                onChange={(e) =>
                  setWitness2({ ...witness2, lastname: e.target.value })
                }
              />
            </div>

            <div
              className="modal-actions"
              style={{ justifyContent: "space-between" }}
            >
              {/* ✅ ปุ่มกลับไปหน้าเลือกวิธีลงชื่อ */}
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowWitnessPopup(false);
                  setShowSignMethod(true); // ย้อนกลับ popup #2
                }}
              >
                กลับ
              </button>

              {/* ✅ ปุ่มบันทึก / ตรวจเงื่อนไข */}
              <button
                className="modal-btn next"
                onClick={() => {
                  const employeeFirstname = recorder.fullname
                    .split(" ")[0]
                    .trim();
                  const employeeLastname = recorder.fullname
                    .split(" ")
                    .pop()
                    .trim();
                  const customerLastname = formData.lastname.trim();

                  const w2_first = witness2.firstname.trim();
                  const w2_last = witness2.lastname.trim();

                  // ✅ ถ้าไม่ได้แก้พยานคนแรก → พยานคนแรก = พนักงานผู้บันทึก
                  const w1_first =
                    witness1.firstname.trim() || employeeFirstname;
                  const w1_last = witness1.lastname.trim() || employeeLastname;

                  // 1) ห้ามเว้นว่าง
                  if (!w2_first || !w2_last) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // 2) ห้ามซ้ำลูกค้า
                  if (w2_last === customerLastname) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // 3) ห้ามซ้ำพนักงานผู้บันทึก
                  if (w2_last === employeeLastname) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // 4) ห้ามซ้ำพยานคนแรก (จริง ทั้งชื่อ+สกุล)
                  if (w2_first === w1_first && w2_last === w1_last) {
                    setShowWarningPopup(true);
                    return;
                  }

                  // ✅ ผ่านทุกเงื่อนไข
                  setShowWitnessPopup(false);
                  console.log("✅ บันทึกพยานคนที่ 2 สำเร็จ:", witness2);
                }}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ POPUP แจ้งเตือน */}
      {showWarningPopup && (
        <div className="modal-overlay1">
          <div className="modal-content1" style={{ textAlign: "center" }}>
            <h4 style={{ color: "#d23434" }}>ตรวจสอบข้อมูลอีกครั้ง</h4>
            <p style={{ fontSize: "14px", marginTop: "6px" }}>
              ข้อมูลไม่ถูกต้อง หรือมีนามสกุลซ้ำกัน
            </p>

            <div
              className="modal-actions"
              style={{ justifyContent: "center", marginTop: "18px" }}
            >
              <button
                className="modal-btn next"
                style={{ width: "120px" }}
                onClick={() => setShowWarningPopup(false)}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalepersonView_addData;
