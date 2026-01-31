import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import { Base64 } from "js-base64";
import { userToken } from "../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { RiIdCardFill } from "react-icons/ri";
import { LuScanText } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";

const thaiMonths = [
  { value: 1, label: "มกราคม" },
  { value: 2, label: "กุมภาพันธ์" },
  { value: 3, label: "มีนาคม" },
  { value: 4, label: "เมษายน" },
  { value: 5, label: "พฤษภาคม" },
  { value: 6, label: "มิถุนายน" },
  { value: 7, label: "กรกฎาคม" },
  { value: 8, label: "สิงหาคม" },
  { value: 9, label: "กันยายน" },
  { value: 10, label: "ตุลาคม" },
  { value: 11, label: "พฤศจิกายน" },
  { value: 12, label: "ธันวาคม" },
];

const currentYearBE = new Date().getFullYear() + 543;
const maxYearBE = currentYearBE - 20; // 🔑 อายุ ≥ 20 ปี
const minYearBE = maxYearBE - 80; // เผื่อย้อนหลัง (ปรับได้)

const SalepersonView_addData = ({ idForm }) => {
  const navigate = useNavigate();
  const getstore = useRecoilValue(userToken);

  const PerFuNas_AgU = Base64.decode(getstore.PerFuNas);
  const PerPST_N = Base64.decode(getstore.PerPST_N);
  const PerWP_N = Base64.decode(getstore.PerWP_N);
  const PerBL_N = Base64.decode(getstore.PerBL_N);
  const PerRG_N = Base64.decode(getstore.PerRG_N);


  const PerFuNasRaw = Base64.decode(getstore.PerFuNas); // ชื่อ
    const PerTiNaRaw = Base64.decode(getstore.PerTiNa);  // คำนำหน้า
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

  const [phoneError, setPhoneError] = useState(false);
  const [FullNameTitle, setFullNameTitle] = useState("");
     const [IdcardError, setIdcardError] = useState(false);

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
    title: "",
    firstname: "",
    lastname: "",
    CTM_citizen_id: "",
    birthday: "",
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
    CTM_employee_code: PerD, //รหัสผู้บันทึก
    CTM_recorder_fullname: PerFuNas, //ผู้บันทึก
    CTM_position: PerPST_N, //รหัสผู้บันทึก

    CTM_branch: PerBL_N, //เขต
    CTM_branch_id: PerBL, //รหัสสาขา
    CTM_business_zone: PerWPN, //สาขา/หน่วย
    CTM_business_zone_id: PerWP, //รหัสสาขา/หน่วย

    CTM_business_region: PerRG_N, //
    CTM_business_region_id: PerRG, //
  });

  const [signMethod, setSignMethod] = useState("");
  const [showPopupSameLastname, setShowPopupSameLastname] = useState(false); // popup #1
  const [showSignMethod, setShowSignMethod] = useState(false); // popup #2

  const [showWitnessPopup1, setShowWitnessPopup1] = useState(false); // popup #1
  const [showWitnessPopup, setShowWitnessPopup] = useState(false); // popup #3
  const [showWarningPopup, setShowWarningPopup] = useState(false); // popup แจ้งเตือน

  const [witness1, setWitness1] = useState({ firstname: "", lastname: "" });
  const [witness2, setWitness2] = useState({ firstname: "", lastname: "" });

  const lastNameList = ["ใจดี", "สุขสันต์", "ยิ้มแย้ม", "สุขสม", "ทองแท้"];

  const [recorder, setRecorder] = useState({
    fullname: FullNameTitle, //ชื่อ
    position: PerPST_N, //ตำแหน่ง
    branch: PerBL_N, //เขต
    zone: PerWP_N, //สาขา
    region: PerRG_N, //ภาค
    photo: `https://apimb.sakerp.org/file_photoEMP/${_PerPhotoProfile_N}`, // หรือ path ภายในระบบของคุณ

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

  const [birthdayTH, setBirthdayTH] = useState({
    day: "",
    month: "",
    year: "", // พ.ศ.
  });

  const convertBirthdayToCE = () => {
    const { day, month, year } = birthdayTH;

    if (!day || !month || !year) return null;

    const yearCE = parseInt(year, 10) - 543;

    return `${yearCE}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ ถ้าแก้ไขเบอร์โทร → ล้าง error
    if (name === "CTM_phone") {
      setPhoneError(false);
    }
  };

  const setBirthdayFromCard = (birthDateEn) => {
    if (!birthDateEn) return;

    const [year, month, day] = birthDateEn.split("-");

    setBirthdayTH({
      day: String(parseInt(day, 10)),
      month: String(parseInt(month, 10)),
      year: String(parseInt(year, 10) + 543), // 🔑 ค.ศ. → พ.ศ.
    });
  };
  const handleSubmitWitness = async () => {
    // ✅ 0. ต้องเลือกวิธีลงชื่อก่อน
    if (!signMethod) {
      setShowWarningPopup(true);
      return;
    }



    setShowSignMethod(false);

    // ============================
    // ✅ กรณีใช้ "ลายนิ้วมือ"
    // ============================
    if (signMethod === "finger") {
      let witness1ToSend = witness1;

      
    // กันไม่ให้พยานตรงกับพนักงาน
      // const w2Last = (witness2?.lastname  || "").trim();
      // const cLast = (customerLastname || "").trim();
      // const w1Last = (witness1?.lastname || "").trim();

      // // ถ้ายังไม่กรอก ไม่ต้องเช็ค
      // if (!w2Last) return true;

      // // ❌ ห้ามซ้ำกับลูกค้า
      // if (w2Last === cLast) {
      //   setShowWarningPopup(true);
      //   return false;
      // }

      // // ❌ ห้ามซ้ำกับพยาน 1
      // if (w2Last === w1Last) {
      //   setShowWarningPopup(true);
      //   return false;
      // }

     if (customerLastname !== employeeLastname) {
        const parts = FullNameTitle.trim().split(/\s+/);
        const fname = parts[0];
        const lname = parts.slice(1).join(" ");

        witness1ToSend = { firstname: fname, lastname: lname };
        setWitness1(witness1ToSend);
      }
      // ✅ ถ้ายังไม่กรอกพยาน 2 → เปิด popup ก่อน
      if (!witness2?.firstname || !witness2?.lastname) {
        setShowWitnessPopup(true);
        return;
      }

      const birthdayCE = convertBirthdayToCE();

      if (!birthdayCE) {
        alert("กรุณากรอกวันเดือนปีเกิดให้ครบ");
        return;
      }

      
    // กันไม่ให้พยานตรงกับพนักงาน
      const w2Last = (witness2?.lastname  || "").trim();
      const cLast = (customerLastname || "").trim();
      const w1Last = (witness1?.lastname || "").trim();

      // ถ้ายังไม่กรอก ไม่ต้องเช็ค
      if (!w2Last) return true;

      // ❌ ห้ามซ้ำกับลูกค้า
      if (w2Last === cLast) {
        setShowWarningPopup(true);
        return false;
      }

      // // ❌ ห้ามซ้ำกับพยาน 1
      // if (w2Last === w1Last) {
      //   setShowWarningPopup(true);
      //   return false;
      // }

      // ✅ รวม payload ส่ง API (พยาน 1 + พยาน 2)
      const payload = {
        ...formData,
        birthday: birthdayCE, // ✅ เก็บเป็น ค.ศ.
        signMethod,
        witness1: witness1ToSend,
        witness2: witness2, // ✅ สำคัญมาก
        idForm: idForm,
      };

      // console.log("payload ลายเซ็น");
      // console.log(payload);

      try {
        const { data } = await apiClient.post(
          "/api/insurances/datacustomers/adddata",
          {
            payload: JSON.stringify(payload),
          }
        );

        const { status, data: result, message } = data;

        if (status === 200) {
          // console.log("✅ บันทึกสำเร็จ (ลายนิ้วมือ)");
          // console.log("📦 ข้อมูลที่บันทึก:", result);
          // console.log("📝 message:", message);

          // ✅ เด้งกลับไปหน้าตาราง + ส่ง id ที่เพิ่งบันทึกไปด้วย
          window.location.assign("/Salesperson");
          // navigate("/Salesperson", {
          //   state: {
          //     highlightId: idForm, // ✅ id ของรายการที่เพิ่งบันทึก
          //   },
          // });
        }
      } catch (error) {
        console.error("❌ ส่งข้อมูลไม่สำเร็จ (finger):", error);
      }

      return;
    }

    // ============================
    // ✅ กรณีใช้ "ลายเซ็น"
    // ============================
    if (signMethod === "signature") {
      const birthdayCE = convertBirthdayToCE();

      if (!birthdayCE) {
        alert("กรุณากรอกวันเดือนปีเกิดให้ครบ");
        return;
      }

      let witnessToSend;

      if (witness1.firstname && witness1.lastname) {
        witnessToSend = witness1;
      } else {
        const parts = FullNameTitle.trim().split(/\s+/);
        const fname = parts[0];
        const lname = parts.slice(1).join(" ");

        witnessToSend = { firstname: fname, lastname: lname };
      }

      const payload = {
        ...formData,
        birthday: birthdayCE, // ✅ เก็บเป็น ค.ศ.

        signMethod,
        witness1: witnessToSend,
        idForm: idForm,
      };

      // console.log("payload มือชื่อ");
      // console.log(payload);

      try {
        const { data } = await apiClient.post(
          "/api/insurances/datacustomers/adddata",
          {
            payload: JSON.stringify(payload),
          }
        );

        const { status, data: result, message } = data;

        if (status === 200) {
          // console.log("✅ บันทึกสำเร็จ (ลายเซ็น)");
          // console.log("📦 ข้อมูลที่บันทึก:", result);
          // console.log("📝 message:", message);
          // ✅ เด้งกลับไปหน้าตาราง + ส่ง id ที่เพิ่งบันทึกไปด้วย
          window.location.assign("/Salesperson");
          // navigate("/Salesperson", {
          //   state: {
          //     highlightId: idForm, // ✅ id ของรายการที่เพิ่งบันทึก
          //   },
          // });
        }
      } catch (error) {
        console.error("❌ ส่งข้อมูลไม่สำเร็จ (signature):", error);
      }
    }
  };

  const employeeLastname = FullNameTitle.split(" ").pop().trim();
  const customerLastname = formData.lastname.trim();

  const handleCheckLastname = () => {
    // ✅ 0. ตรวจสอบเบอร์โทรศัพท์ก่อนเสมอ
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
      setPhoneError(true);
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


    // 🔴 ต้องเป็นตัวเลข 13 หลักเท่านั้น
    const citizenId = formData.CTM_citizen_id.replace(/\D/g, "");

    if (citizenId.length !== 13) {
      setPhoneError(true);
      Swal.fire({
        icon: "warning",
        title: "หมายเลขบัตรประชาชนไม่ถูกต้อง",
        text: "หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (!formData?.title || formData.title.trim() === "") {
      setPhoneError(true);
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกคำนำหน้าชื่อลูกค้า",
        text: "ต้องระบุคำนำหน้าชื่อลูกค้า",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (!formData?.firstname || formData.firstname.trim() === "") {
      setPhoneError(true);
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกชื่อลูกค้า",
        text: "ต้องระบุชื่อลูกค้า",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (!formData?.lastname || formData.lastname.trim() === "") {
      setPhoneError(true);
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกนามสกุล",
        text: "ต้องระบุนามสกุล",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // 🔴 บังคับระบุวันเดือนปีเกิด (พ.ศ.)
    if (!birthdayTH.day || !birthdayTH.month || !birthdayTH.year) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุวันเดือนปีเกิด",
        text: "ต้องระบุ วัน / เดือน / ปีเกิด (พ.ศ.) ให้ครบถ้วน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (!customerLastname) return setShowWarningPopup(true);

    // ถ้าลูกค้านามสกุล = พนักงาน → ต้องแก้พยานคนแรกก่อน
    if (customerLastname === employeeLastname) {
      setShowPopupSameLastname(true);
    } else {
      setShowSignMethod(true);
    }
  };

  const isCardExpired = (dateExpiryEn) => {
    if (!dateExpiryEn) return true;

    const expireDate = new Date(dateExpiryEn);
    const today = new Date();

    // ตัดเวลาออก ป้องกัน error เวลาเทียบ
    expireDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return expireDate < today;
  };

  const isAgeAtLeast20 = (birthDateEn) => {
    if (!birthDateEn) return false;

    const birthDate = new Date(birthDateEn);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 20;
  };

  const handleReadCard = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5002", {
        headers: {
          "x-api-key": import.meta.env.VITE_REACT_API_KEY_CARDREADER,
        },
      });

      if (res.data.status === 200) {
        console.log(res);
        const card = res.data;

        // 🔹 วันหมดอายุบัตร
        const expiryEn = card.dateexpiry?.dateexpiryen;

        // 🔹 วันเกิด (ค.ศ.)
        const birthDateEn = card.datebirth?.datebirthen;

        // ❌ 1) เช็คบัตรหมดอายุ
        if (isCardExpired(expiryEn)) {
          alert(
            `❌ บัตรประชาชนหมดอายุ\nวันหมดอายุ: ${card.dateexpiry?.dateexpiryformatth}`
          );
          return;
        }

        // ❌ 2) เช็คอายุ < 20 ปี
        if (!isAgeAtLeast20(birthDateEn)) {
          alert("❌ อายุไม่ถึง 20 ปี ไม่สามารถทำรายการได้");
          return;
        }

        // ✅ ผ่านทุกเงื่อนไข → ดึงข้อมูลเข้าฟอร์ม
        setFormData((prev) => ({
          ...prev,
          title: card.thainame.prefixth,
          firstname: card.thainame.firstnameth,
          lastname: card.thainame.lastnameth,
          CTM_citizen_id: card.idnumber,
          birthday: birthDateEn,

          CTM_house_no: card.address.housenumber || "-",
          CTM_moo: card.address.villagenumber || "-",
          CTM_soi: card.address.alley || "-",
          CTM_road: card.address.road || "-",
          CTM_village_or_building: card.address.villagename || "-",
          CTM_district: card.address.district || "-",
          CTM_sub_district: card.address.subdistrict || "-",
          CTM_province: card.address.province || "-",
          CTM_postal_code: card.address.zipcode || "-",
        }));
        // 🔑 เพิ่มบรรทัดนี้
        setBirthdayFromCard(birthDateEn);

        Swal.fire({
          icon: "success",
          title: "ดึงข้อมูลบัตรสำเร็จ",
          text: "ลูกค้าอายุไม่น้อยกว่า 20 ปี",
          timer: 1800, // ⏱ ปิดเองใน 1.8 วินาที
          showConfirmButton: false, // ❌ ไม่ต้องกด
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถดึงข้อมูลบัตรได้",
          text: res.data.message,
          timer: 2200,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("ReadCard Error:", error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลบัตร");
    }
  };

  const normalizeToCE = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-").map(Number);

    // ถ้าปีมากกว่า 2400 ให้ถือว่าเป็น พ.ศ.
    const ceYear = year > 2400 ? year - 543 : year;

    return `${ceYear}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
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


// const validateWitness2Lastname = (lastname) => {
//   const w2Last = (lastname || "").trim();
//   const cLast = (customerLastname || "").trim();
//   const w1Last = (witness1?.lastname || "").trim();

//   // ถ้ายังไม่กรอก ไม่ต้องเช็ค
//   if (!w2Last) return true;

//   // ❌ ห้ามซ้ำกับลูกค้า
//   if (w2Last === cLast) {
//     setShowWarningPopup(true);
//     return false;
//   }

//   // ❌ ห้ามซ้ำกับพยาน 1
//   if (w2Last === w1Last) {
//     setShowWarningPopup(true);
//     return false;
//   }

//   return true;
// };




  //คะแนนประเมินแต่ละรอบ

  useEffect(() => {
    GetDataTitle();

    // Attendance();
  }, []);

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
                <span>{FullNameTitle}</span>
              </div>

              <div className="rec-row">
                <strong>ตำแหน่ง :</strong>
                <span>{recorder.position}</span>
              </div>

              <div className="rec-row">
                <strong>สาขา/หน่วย</strong>
                <span>{recorder.zone}</span>
              </div>

              <div className="rec-row">
                <strong>เขตธุรกิจ : </strong>
                <span>{recorder.branch}</span>
              </div>

              <div className="rec-row">
                <strong>ภาคธุรกิจ :</strong>
                <span>{recorder.region}</span>
              </div>

              <div className="rec-row">
                <strong>วันที่บันทึก :</strong>
                <span>{recorder.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 การ์ดที่ 2 : ฟอร์มรับข้อมูล */}
        <div className="card form-card">
          <div className="form-header">
            <h3 className="card-title">ส่วนที่ 2 : ฟอร์มรับข้อมูลลูกค้า</h3>
            <button className="btn-readcard" onClick={handleReadCard}>
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

                {/* เดือน (ชื่อไทย) */}
                <select
                  value={birthdayTH.month}
                  onChange={(e) =>
                    setBirthdayTH({ ...birthdayTH, month: e.target.value })
                  }
                  style={{ width: "140px" }}
                >
                  <option value="">เดือน</option>
                  {thaiMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* ปี พ.ศ. (อายุ ≥ 20 ปี) */}
                <select
                  value={birthdayTH.year}
                  onChange={(e) =>
                    setBirthdayTH({ ...birthdayTH, year: e.target.value })
                  }
                  style={{ width: "120px" }}
                >
                  <option value="">ปี พ.ศ.</option>
                  {Array.from(
                    { length: maxYearBE - minYearBE + 1 },
                    (_, i) => maxYearBE - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
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
              <h3 className="card-title mt-2">ที่อยู่ตามทะเบียนบ้าน</h3>
            

              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">บ้านเลขที่</label>
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
                  <label className="form-label">หมู่</label>
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
                  <label className="form-label">ซอย</label>
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
                  <label className="form-label">ถนน</label>
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
                  <label className="form-label">หมู่บ้าน / อาคาร</label>
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
                  <label className="form-label">แขวง / ตำบล</label>
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
                  <label className="form-label">เขต / อำเภอ</label>
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
                  <label className="form-label">จังหวัด</label>
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
                  <label className="form-label">รหัสไปรษณีย์</label>
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
          <button className="btn-submit" onClick={handleCheckLastname}>
            <LuScanText /> ตรวจสอบ
          </button>
          {/* <button className="btn-submit">บันทึกข้อมูล</button> */}
        </div>
      </div>

      {/* ✅ POPUP #1 : แก้ชื่อพยานแรก */}
      {showPopupSameLastname && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <div className="witness-header"></div>
            <h4>ตรวจสอบนามสกุลพยาน</h4>
            <p style={{ color: "#e13030ff" }}>
              ** พยานห้ามมีนามสกุลเดียวกับลูกค้า กรุณาเปลี่ยนชื่อพยาน **
            </p>

            <div className="form-group pt-2">
              <label>คำนำหน้า + ชื่อ</label>
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
                ถัดไป
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
              <img
                src="/Fingerprint-rafiki.png"
                alt="employee-order"
                style={{
                  height: "150px",
                  width: "auto",
                  marginBottom: "16px",
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <input
                type="radio"
                name="signMethod"
                value="finger"
                onChange={(e) => setSignMethod(e.target.value)}
              />

              <span>พิมพ์ลายนิ้วมือ</span>
            </label>

            <label className="choice-box1">
              <img
                src="/Agreement-amico.png"
                alt="employee-order"
                style={{
                  height: "150px",
                  width: "auto",
                  marginBottom: "16px",
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
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
                  className="modal-btn cancel"
                  onClick={() => setShowSignMethod(false)}
                >
                  ปิด
                </button>
                <button
                  className="modal-btn next"
                  onClick={handleSubmitWitness}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ POPUP #2.9 : พยานคนที่หนึ่ง */}
      {showWitnessPopup1 && (
        <div className="modal-overlay1">
          <div className="modal-content1 minimal-witness">
            <div className="witness-header">
              <img
                src="/Telecommuting-pana.png"
                alt="witness"
                className="witness-illustration"
                style={{ width: "140px" }}
              />
              <h4>เพิ่มพยานคนที่ 1</h4>
              <p style={{ color: "#e13030ff" }}>
                ** พยานห้ามมีนามสกุลเดียวกับลูกค้า กรุณาเปลี่ยนชื่อพยาน **
              </p>
            </div>

            <div className="form-group">
              <label>คำนำหน้า + ชื่อ</label>
              <input
                className="input-normal"
                value={witness1.firstname}
                onChange={(e) =>
                  setWitness1({ ...witness1, firstname: e.target.value })
                }
                placeholder="ตัวอย่าง: นายสมชาย"
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
                placeholder="ตัวอย่าง: ใจดี"
              />
            </div>

            <div className="modal-actions minimal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowWitnessPopup1(false);
                  setShowSignMethod(true);
                }}
              >
                กลับ
              </button>

              <button
                className="modal-btn next"
                onClick={() => {
                  const w1_last = witness1.lastname.trim();

                  if (!witness1.firstname.trim() || !w1_last)
                    return setShowWarningPopup(true);

                  if (
                    w1_last === customerLastname ||
                    w1_last === employeeLastname
                  )
                    return setShowWarningPopup(true);

                  setShowWitnessPopup1(false);

                  if (signMethod === "signature") {
                    return;
                  }

                  setShowWitnessPopup(true);
                }}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ POPUP #3 : พยานคนที่สอง */}
      {showWitnessPopup && (
        <div className="modal-overlay1">
          <div className="modal-content1 minimal-witness">
            <div className="witness-header">
              <img
                src="/Telecommuting-pana.png"
                alt="witness"
                className="witness-illustration"
                style={{ width: "140px" }}
              />
              <h4>เพิ่มพยานคนที่ 2</h4>
              <p style={{ color: "#e13030ff" }}>
                ** พยานห้ามมีนามสกุลเดียวกับลูกค้า กรุณาเปลี่ยนชื่อพยาน **
              </p>
            </div>

            <div className="form-group">
              <label>คำนำหน้า + ชื่อ</label>
              <input
                className="input-normal"
                value={witness2.firstname}
                placeholder="ตัวอย่าง: นางสาวพรทิพย์"
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
  placeholder="ตัวอย่าง: สุขใจ"
  onChange={(e) => {
    const value = e.target.value;

    // เซ็ตค่าก่อน
    setWitness2((prev) => ({ ...prev, lastname: value }));

    // ตรวจสอบทันที
    // validateWitness2Lastname(value);
  }}
/>

            </div>

            <div className="modal-actions minimal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowWitnessPopup(false);
                  setShowSignMethod(true);
                }}
              >
                กลับ
              </button>
              <button className="modal-btn next" onClick={handleSubmitWitness}>
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
