import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import { Base64 } from "js-base64";
import { userToken } from "../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { RiIdCardFill } from "react-icons/ri";
import { LuScanText } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SalepersonView_addDataOutside = ({ idForm }) => {
  const navigate = useNavigate();
  const getstore = useRecoilValue(userToken);

  const PerFuNas_AgU = Base64.decode(getstore.PerFuNas);
  const PerPST_N = Base64.decode(getstore.PerPST_N);
  const PerWP_N = Base64.decode(getstore.PerWP_N);
  const PerBL_N = Base64.decode(getstore.PerBL_N);
  const PerRG_N = Base64.decode(getstore.PerRG_N);

  const PerFuNasRaw = Base64.decode(getstore.PerFuNas); // ชื่อ
  const PerTiNaRaw = Base64.decode(getstore.PerTiNa); // คำนำหน้า
  const PerFuNas = `${PerTiNaRaw}${PerFuNasRaw}`.trim();

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);
  const PerWPN = Base64.decode(getstore.PerWP_N);
  const PerBL = Base64.decode(getstore.PerBL);
  const PerWP = Base64.decode(getstore.PerWP);
  const PerRG = Base64.decode(getstore.PerRG);

  const [formNumber, setFormNumber] = useState(""); // SCF code
  const [formId, setFormId] = useState(""); // PK 6 หลัก

  const [FullNameTitle, setFullNameTitle] = useState("");

  const [branchManagers, setBranchManagers] = useState([]);
  const [areaManager, setAreaManager] = useState(null);

  const GetDataTitle = async () => {
    try {
      const res = await apiClient.get("/api/insurances/datacustomersTitle", {
        params: {
          PerD_title: PerD,
        },
      });

      const { status, data: result, message } = res.data;

      if (status === 200) {
        const fullname = `${result.title_name}${result.firstname_PSN} ${result.lastname_PSN}`;

        setFullNameTitle(fullname);

        // console.log("✅ ดึงข้อมูลคำนำหน้าสำเร็จ", PerD);
        // console.log("📦 result:", result);
      } else {
        console.warn("⚠️ status ไม่ใช่ 200 :", message);
      }
    } catch (error) {
      console.error("❌ ส่งข้อมูลไม่สำเร็จ (GetDataTitle):", error);
    }
  };

  const [formData, setFormData] = useState({
    CTM_employee_code: PerD, //รหัสผู้บันทึก
    CTM_recorder_fullname: PerFuNas, //ชืื่อผู้บันทึก
    CTM_position: PerPST_N, //ตำแหน่งผู้บันทึก

    CTM_branch: PerBL_N, //เขต
    CTM_branch_id: PerBL, //รหัสสาขา
    CTM_business_zone: PerWPN, //สาขา/หน่วย
    CTM_business_zone_id: PerWP, //รหัสสาขา/หน่วย

    CTM_business_region: PerRG_N, //
    CTM_business_region_id: PerRG, //

    FormOutside_customer_title: "",
    FormOutside_customer_firstname: "",
    FormOutside_customer_lastname: "",
  });

  const lastNameList = ["ใจดี", "สุขสันต์", "ยิ้มแย้ม", "สุขสม", "ทองแท้"];

  const [recorder, setRecorder] = useState({
    fullname: FullNameTitle, //ชื่อ
    position: PerPST_N, //ตำแหน่ง
    branch: PerBL_N, //เขต
    zone: PerWP_N, //สาขา
    PerD: PerD, //รหัสพนักงาน
    photo: `https://apimb.sakerp.org/file_photoEMP/${_PerPhotoProfile_N}`, // หรือ path ภายในระบบของคุณ
    region: PerRG_N, //ภาค

    date: new Date().toLocaleDateString("th-TH"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckOutside = async () => {
    const fullName = `${formData.FormOutside_customer_title}${formData.FormOutside_customer_firstname} ${formData.FormOutside_customer_lastname}`;
    // ✅ 0. ตรวจสอบเบอร์โทรศัพท์ก่อนเสมอ
    // if (!formData?.CTM_phone || formData.CTM_phone.trim() === "") {
    //   setPhoneError(true);
    //   Swal.fire({
    //     icon: "warning",
    //     title: "กรุณากรอกเบอร์โทรศัพท์",
    //     text: "ต้องระบุเบอร์โทรศัพท์ก่อนทำรายการ",
    //     confirmButtonText: "ตกลง",
    //   });
    //   return;
    // }

    const payload = {
      FormOutside_id: formId,
      FormOutside_form_number: scfCode,
      ...formData,
      // 🔥 override ตัวนี้
      FormOutside_customer_name: fullName,
    };

    console.log(payload);

    try {
      const { data } = await apiClient.post(
        "/api/insurances/datacustomers/AddDataOutside",
        {
          payload: JSON.stringify(payload),
        },
      );

      const { status, data: result } = data;

      if (status === 200) {
        // alert("สำเร็จ");
        // console.log(data);
        // console.log("📦 ข้อมูลที่บันทึก:", result);
        // console.log("📝 message:", message);

        // ✅ เด้งกลับไปหน้าตาราง + ส่ง id ที่เพิ่งบันทึกไปด้วย
        window.location.assign("/SalepersonView_Litemain_Outside");
        // navigate("/Salesperson", {
        //   state: {
        //     highlightId: idForm, // ✅ id ของรายการที่เพิ่งบันทึก
        //   },
        // });
      }
    } catch (error) {
      console.error("❌ ส่งข้อมูลไม่สำเร็จ (finger):", error);
    }
  };

  const [scfCode, setScfCode] = useState("");
  //ค้นหาชื่อผู้รับรอง
  const fetchCustomerTypes = async () => {
    const params = {
      PerWP: PerWP, // สถานที่
    };

    // console.log(payload);
    try {
      const { data } = await apiClient.get("/api/insurances/perManager", {
        params,
      });

      const { status, data: result } = data;

      if (status === 200) {
        // console.log(result.branch);
        // console.log(result.area);

        setBranchManagers(result.branch || []);
        setAreaManager(result.area || null);

        // console.log(data);

        // console.log("📦 ข้อมูลที่บันทึก:", result);
        // console.log("📝 message:", message);

        // ✅ เด้งกลับไปหน้าตาราง + ส่ง id ที่เพิ่งบันทึกไปด้วย
        // window.location.assign("/Salesperson");
        // navigate("/Salesperson", {
        //   state: {
        //     highlightId: idForm, // ✅ id ของรายการที่เพิ่งบันทึก
        //   },
        // });
      }
    } catch (error) {
      console.error("❌ ส่งข้อมูลไม่สำเร็จ (finger):", error);
    }
  };

  const generateSCFCode = () => {
    const now = new Date();

    const year = now.getFullYear().toString().slice(-2); // 25
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 03

    const prefix = `SCF${year}${month}-`;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const remainingLength = 15 - prefix.length;

    let randomPart = "";
    for (let i = 0; i < remainingLength; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return prefix + randomPart;
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };

  useEffect(() => {
    GetDataTitle(); // 1. โหลดข้อมูล title ก่อน
    fetchCustomerTypes(); // 2. โหลด dropdown

    // 3. generate code แล้ว set ลง state
    setScfCode(generateSCFCode());

    // Attendance(); // (ถ้ามีค่อยเปิด)
  }, []);

  //เรียกผู้อนุมัติ
  useEffect(() => {
    if (areaManager) {
      setFormData((prev) => ({
        ...prev,
        FormOutside_approver_id: areaManager.ID_personnel,
        FormOutside_approver_name: `${areaManager.title_name}${areaManager.firstname_PSN} ${areaManager.lastname_PSN}`,
        FormOutside_approver_position: areaManager.position_PSN,
      }));
    }
  }, [areaManager]);

  return (
    <div>
     <div className="container" >
        {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}

        <div className="card form-card" >
          <h3 className="card-title">รายละเอียดผู้ยื่นแบบฟอร์ม</h3>

          <div className="rec-grid">
            <div className="rec-item">
              <strong style={{ fontSize: "16px" }}>รหัสพนักงาน :</strong>
              <span style={{ fontSize: "16px" }}>{recorder.PerD}</span>
            </div>

            <div className="rec-item">
              <strong style={{ fontSize: "16px" }}>
                ชื่อ-นามสกุล ผู้ยื่นแบบฟอร์ม :
              </strong>
              <span style={{ fontSize: "16px" }}> {FullNameTitle}</span>
            </div>

            <div className="rec-item">
              <strong style={{ fontSize: "16px" }}>ตำแหน่ง :</strong>
              <span style={{ fontSize: "16px" }}>{recorder.position}</span>
            </div>

            <div className="rec-item">
              <strong style={{ fontSize: "16px" }}>ภาคธุรกิจ :</strong>
              <span style={{ fontSize: "16px" }}>{recorder.region}</span>
            </div>

            <div className="rec-item">
              <strong style={{ fontSize: "16px" }}>สาขา/หน่วย :</strong>
              <span style={{ fontSize: "16px" }}>{recorder.zone}</span>
            </div>

            <div className="rec-item">
              <strong style={{ fontSize: "16px" }}>สังกัด :</strong>
              <span style={{ fontSize: "16px" }}>{recorder.branch}</span>
            </div>

            <div className="rec-item ">
              <strong style={{ fontSize: "16px" }}>
                วัน/เวลา ที่ยื่นแบบฟอร์ม :
              </strong>
              <span style={{ fontSize: "16px" }}>{recorder.date}</span>
            </div>
          </div>
        </div>

        {/* 🔹 การ์ดที่ 2 : ฟอร์มรับข้อมูล */}
        <div className="card form-card">
          <div className="form-header">
            <h3 className="card-title">
              กรอกข้อมูลแจ้งขอตรวจสอบข้อมูลเครดิตนอกหลักเกณฑ์
            </h3>
            <div style={{ color: "#7d7d7d" }}>รหัสฟอร์ม : {scfCode || "-"}</div>
          </div>

          <div className="minimal-form">
            <div className="form-row">
              <label>
                1. ชื่อ-นามสกุลลูกค้า <span style={{ color: "red" }}>*</span>
              </label>

              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  name="FormOutside_customer_title"
                  value={formData.FormOutside_customer_title}
                  onChange={handleChange}
                  style={{ width: "140px" }}
                >
                  <option value="">-- คำนำหน้า --</option>

                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                  {/* <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option> */}

                  <option value="ดร.">ดร.</option>
                  <option value="ศ.">ศ.</option>
                  <option value="รศ.">รศ.</option>
                  <option value="ผศ.">ผศ.</option>

                  <option value="นพ.">นพ.</option>
                  <option value="พญ.">พญ.</option>
                  <option value="ทพ.">ทพ.</option>
                  <option value="ทพญ.">ทพญ.</option>

                  <option value="พล.อ.">พล.อ.</option>
                  <option value="พล.ท.">พล.ท.</option>
                  <option value="พล.ต.">พล.ต.</option>
                  <option value="พ.อ.">พ.อ.</option>
                  <option value="พ.ท.">พ.ท.</option>
                  <option value="พ.ต.">พ.ต.</option>

                  <option value="ร.ต.อ.">ร.ต.อ.</option>
                  <option value="ร.ต.ท.">ร.ต.ท.</option>
                  <option value="ร.ต.ต.">ร.ต.ต.</option>

                  <option value="ว่าที่ ร.ต.">ว่าที่ ร.ต.</option>

                  <option value="คุณ">คุณ</option>
                </select>

                <input
                  type="text"
                  name="FormOutside_customer_firstname"
                  placeholder="ชื่อ"
                  value={formData.FormOutside_customer_firstname}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="FormOutside_customer_lastname"
                  placeholder="นามสกุล"
                  value={formData.FormOutside_customer_lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <label style={{ fontSize: "14px" }}>
                2. ประเภทลูกค้า <span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="FormOutside_customer_type"
                value={formData.FormOutside_customer_type}
                onChange={handleChange}
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
            <div className="form-row">
              <label style={{ fontSize: "14px" }}>
                3. ประเภทสินเชื่อ <span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="FormOutside_loan_type"
                value={formData.FormOutside_loan_type}
                onChange={handleChange}
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
            <div className="form-row">
              <label style={{ fontSize: "14px" }}>
                4. วงเงินขอสินเชื่อ <span style={{ color: "red" }}>*</span>
              </label>

              <input
              className="mr-1"
                type="text"
                name="FormOutside_credit_limit"
                value={formatNumber(formData.FormOutside_credit_limit)} // ✅ แสดงมี ,
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  const num = raw.replace(/[^0-9]/g, "");

                  setFormData((prev) => ({
                    ...prev,
                    FormOutside_credit_limit: num, // ✅ เก็บเลขล้วน
                  }));
                }}
                placeholder="กรอกเฉพาะตัวเลข"
              />
              {"บาท"}
            </div>
          </div>
          <hr />

          <div className="form-row">
            <label style={{ fontSize: "14px" }}>
              5. เลือกผู้รับรองเสนอพิจารณา{" "}
              <span style={{ color: "red" }}>*</span>
            </label>

            <select
              name="FormOutside_reviewer_id"
              value={formData.FormOutside_reviewer_id}
              onChange={(e) => {
                const selected = branchManagers.find(
                  (x) => x.ID_personnel === e.target.value,
                );

                setFormData((prev) => ({
                  ...prev,
                  FormOutside_reviewer_id: selected?.ID_personnel || "",
                  FormOutside_reviewer_name: selected
                    ? `${selected.title_name}${selected.firstname_PSN} ${selected.lastname_PSN}`
                    : "",
                  FormOutside_reviewer_position: selected?.position_PSN || "",
                }));
              }}
            >
              <option value="">-- กรุณาเลือกผู้รับรอง --</option>

              {branchManagers.map((item, index) => (
                <option key={index} value={item.ID_personnel}>
                  {item.title_name}
                  {item.firstname_PSN} {item.lastname_PSN} (
                  {item.department_PSN})
                </option>
              ))}
            </select>
          </div>
          <hr />
          <div
            className="form-row"
            style={{
              display: "flex",
              justifyContent: "flex-end", // 👉 ดันไปขวา
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold" }}>ผู้อนุมัติ</div>

              {areaManager ? (
                <>
                  <div>
                    {areaManager.title_name}
                    {areaManager.firstname_PSN} {areaManager.lastname_PSN}
                  </div>
                  <div>ตำแหน่ง ผู้จัดการ{areaManager.department_PSN}</div>
                </>
              ) : (
                <div>กำลังโหลด...</div>
              )}
            </div>
          </div>
          <button className="btn-submit" onClick={handleCheckOutside}>
            <LuScanText /> ยื่นขอตรวจนอกหลักเกณฑ์
          </button>
          {/* <button className="btn-submit">บันทึกข้อมูล</button> */}
        </div>
      </div>
    </div>
  );
};

export default SalepersonView_addDataOutside;
