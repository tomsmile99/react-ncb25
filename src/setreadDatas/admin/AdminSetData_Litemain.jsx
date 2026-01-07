import React, { useRef, useState, useEffect } from "react";
import apiClient from "../../recoilstore/userStores";
import html2pdf from "html2pdf.js";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { FaPlus, FaCalculator, FaTrash } from "react-icons/fa";
import { BsFiletypeDoc } from "react-icons/bs";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";
import { FormControl } from "react-bootstrap";
import Pagination from "../../component/Pagination";
import Swal from "sweetalert2";
import { Base64 } from "js-base64";
import { userToken } from "../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegIdCard } from "react-icons/fa";

import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import {
  AiOutlineFileSearch,
  AiOutlineCloudDownload,
  AiOutlineDelete,
} from "react-icons/ai";
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

  // เวลาพร้อมรูปแบบ 2 หลัก
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};
const convertToThaiDate1 = (dateString) => {
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

  return `${day} ${month} ${year} `;
};

const AdminSetData_Litemain = () => {
  const getstore = useRecoilValue(userToken);
  const PerD = Base64.decode(getstore.PerD); //รหัส
  const PerFuNas = Base64.decode(getstore.PerFuNas); //ชื่อ
  const PerPST_N = Base64.decode(getstore.PerPST_N); //ชื่อตำแหน่ง
  const PerBL_N = Base64.decode(getstore.PerBL_N);

  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 25; // จำนวนรายการต่อหน้า

  const [score, setScore] = useState("");
  const [level, setLevel] = useState("");
  const [risk, setRisk] = useState("");
  const [result, setResult] = useState("");
  const [getDataShow, setgetDataShow] = useState([]); //แสดงข้อมูลเดี่ยว

  const [probabilityInput, setProbabilityInput] = useState("");
  const [probabilityPercent, setProbabilityPercent] = useState("");

  const [openFeeModal, setOpenFeeModal] = useState(null);

  const [accounts, setAccounts] = useState([
    { status: "", amount: "", isNew: false },
  ]);
  const [reasons, setReasons] = useState([{ reason: "" }]);

  const [searchQuery, setSearchQuery] = useState(""); //ค้นหา

  //คำนวณคะแนน

  // ✅ ฟังก์ชันแปลงคะแนนเครดิตเป็นระดับและความเสี่ยง
  const handleScoreChange = (e) => {
    const value = e.target.value;
    setScore(value);
    const num = parseInt(value);

    if (!isNaN(num)) {
      if (num >= 753 && num <= 900) {
        setLevel("AA");
        setRisk("ความเสี่ยงต่ำ");
        setResult("ผ่าน");
      } else if (num >= 725 && num <= 752) {
        setLevel("BB");
        setRisk("ความเสี่ยงต่ำ");
        setResult("ผ่าน");
      } else if (num >= 699 && num <= 724) {
        setLevel("CC");
        setRisk("ความเสี่ยงต่ำ");
        setResult("ผ่าน");
      } else if (num >= 681 && num <= 698) {
        setLevel("DD");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num >= 666 && num <= 680) {
        setLevel("EE");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num >= 646 && num <= 665) {
        setLevel("FF");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num >= 616 && num <= 645) {
        setLevel("GG");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num >= 300 && num <= 615) {
        setLevel("HH");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      }

      // 🔹 ตัวเลขพิเศษต้องเช็กก่อนช่วง 0–615
      else if (num === 10) {
        setLevel("TT");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      } else if (num === 70) {
        setLevel("ZZ");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      } else if (num === 30) {
        setLevel("VV");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 40) {
        setLevel("WW");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 50) {
        setLevel("XX");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 60) {
        setLevel("YY");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      } else if (num === 0) {
        setLevel("-");
        setRisk("ความเสี่ยงปานกลาง");
        setResult("ผ่าน");
      }

      // 🔹 เงื่อนไขสุดท้าย (คะแนนทั่วไปต่ำกว่า 616)
      else if (num >= 0 && num <= 615) {
        setLevel("GG");
        setRisk("ความเสี่ยงสูง");
        setResult("ไม่ผ่าน");
      } else {
        setLevel("-");
        setRisk("-");
        setResult("-");
      }
    } else {
      setLevel("");
      setRisk("");
      setResult("");
    }
  };

  // ✅ ฟังก์ชันคำนวณความน่าจะเป็นในการชำระหนี้คืน
  const handleProbabilityChange = (e) => {
    const value = e.target.value;
    setProbabilityInput(value);

    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      const percent = Math.round((num / 10000) * 100); // 🔑 ปัดตาม 0.5
      setProbabilityPercent(`${percent}%`);
    } else {
      setProbabilityPercent("");
    }
  };

  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup
  const [selectedItem, setSelectedItem] = useState(null); // เก็บข้อมูลแถวที่คลิก

  const [probationaryEmployees, setProbationaryEmployees] = useState([]); // Object to group by section ID

  const [totalItemsWite, setTotalItemsWite] = useState(0);
  const [activeTab, setActiveTab] = useState("wait");

  const [dataWait, setDataWait] = useState([]);
  const [data, setData] = useState([]);
  const [dataPass, setDataPass] = useState([]);
  const [dataCancel, setDataCancel] = useState([]);
  // wait | pass | cancel

  const getEmployeeDB_Admin = async (page) => {
    const params = {
      _page: page,
      _limit: limit,
      activeTab,
      search: searchQuery, // ⭐ ส่ง keyword
    };

    // console.log(params);
    // return

    try {
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_Admin`,
        {
          params,
        }
      );

      // ❌ ห้ามใช้ currentPage ชื่อชนกับ state
      const {
        status,
        sqlDataCustomers,
        totalPages,
        // currentPage: apiCurrentPage,
      } = data;

      if (status) {
        // console.log(data);
        setProbationaryEmployees(sqlDataCustomers);
        setTotalPages(totalPages);
        // ✅ จำนวนข้อมูลทั้งหมด
        setTotalItemsWite(sqlDataCustomers.length);

        setTotalItemsWite(sqlDataCustomers.length);

        if (activeTab === "wait") {
          setDataWait(sqlDataCustomers);
        }
        if (activeTab === "pass") {
          setDataPass(sqlDataCustomers);
        }
        if (activeTab === "cancel") {
          setDataCancel(sqlDataCustomers);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //เปิดไฟล์เป็น PDF

  const openImageBase64AsPDF = (base64String) => {
    if (!base64String) {
      alert("ไม่พบข้อมูลไฟล์");
      return;
    }

    // base64String = "data:image/png;base64,....."
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(base64String);

    // คำนวณขนาดรูปให้เหมาะกับ A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = imgProps.height / imgProps.width;
    const imgWidth = pageWidth - 40; // margin ซ้ายขวา 20px
    const imgHeight = imgWidth * ratio;

    pdf.addImage(base64String, imgProps.fileType, 20, 20, imgWidth, imgHeight);

    // เปิด PDF ในแท็บใหม่
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    window.open(pdfURL, "_blank");
  };

  const handleStatusClick = async (idForm) => {
    setSelectedItem(idForm);

    const params = {
      idForm: idForm,
    };
    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_AdminSingle",
        {
          params,
        }
      );

      const { status, result, message } = data;

      if (status === 200) {
        // console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        // console.log("📦 result จากหลังบ้าน:", result);
        setgetDataShow(result[0]);
        setChkDataEdit(result[0].Form_status_Edit); //เช็คว่าเคยแก้ไขมาใหม่
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

    setShowPopup(true);
  };

  const loanTypeMap = {
    1: "สินเชื่อส่วนบุคคล",
    2: "สินเชื่อนาโนไฟแนนซ์",
    3: "สินเชื่อที่ดิน",
    4: "สินเชื่อโซลาร์รูฟท็อป",
    5: "สินเชื่อโซลาร์อินเวอร์",
    6: "สินเชื่อโซลาร์ไมโครอินเวอร์เตอร์",
    7: "สินเชื่อเช่าซื้อ (รถจักรยานยนต์ใหม่)",
    8: "สินเชื่อเช่าซื้อ (รถแลกเงิน)",
    9: "สินเชื่อทะเบียนรถ",
    10: "สินเชื่อโซลาร์แอร์",
  };

  //____________________________add row 1________________________________//

  // ✅ เพิ่มแถวใหม่ (input text)
  const handleAddAccount = () => {
    const newItem = {
      status: "",
      amount: "",
      isNew: true,
    };

    // เพิ่มไว้บนสุด
    setAccounts((prev) => [newItem, ...prev]);
  };

  // ✅ อัปเดตค่าช่อง
  const handleChange = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = value;
    setAccounts(updated);
  };

  // ✅ ลบแถว
  const handleRemoveAccount = (index) => {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  };
  //____________________________add row 1________________________________//

  //____________________________add row 2________________________________//
  // ✅ เพิ่มแถวใหม่
  const handleAddReason = () => {
    const newItem = {
      reason: "",
      isNew: true,
    };
    setReasons((prev) => [newItem, ...prev]);
  };

  const handleChangeReason = (index, value) => {
    const updated = [...reasons];
    updated[index].reason = value;
    setReasons(updated);
  };

  // ✅ ลบแถว

  const handleRemoveReason = (index) => {
    setReasons((prev) => prev.filter((_, i) => i !== index));
  };

  //____________________________add row 2________________________________//

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const [approval, setApproval] = useState(""); // Object to group by section ID
  const [joinProject, setJoinProject] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [bankrupt, setBankrupt] = useState("");
  const [description, setDescription] = useState("");
  const [valueCredit, setValueCredit] = useState("");
  const [ChkDataEdit, setChkDataEdit] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [reportDateError, setReportDateError] = useState("");

  const handleSubmit = async (e) => {
    try {
      setSubmitted(true);

      e.preventDefault();

      // 🔴 ดักเฉพาะกรณี "พบข้อมูล"
      if (approval === "approved") {
        if (!reportDate || reportDate.trim() === "") {
          setReportDateError("กรุณาระบุวันที่รายงานผล");
          return; // ❌ หยุดการทำงาน
        }
      }
      // -----------------------------
      // 1) Filter ข้อมูลก่อนส่ง
      // -----------------------------
      const filteredAccounts = accounts.filter(
        (acc) => acc.status.trim() !== "" && acc.amount.trim() !== ""
      );

      const filteredReasons = reasons.filter((r) => r.reason.trim() !== "");

      // -----------------------------
      // 2) สร้าง payload ตาม approval
      // -----------------------------
      let payload = {};

      if (approval === "approved") {
        payload = {
          ctmId: selectedItem,
          approval,
          joinProject,
          reportDate,
          bankrupt,
          valueCredit,

          score,
          level,
          probabilityInput,
          probabilityPercent,
          result,
          risk,

          accounts: filteredAccounts,
          reasons: filteredReasons,
          description,

          PerD,
          PerFuNas,
          PerPST_N,
          LevelStaus: "Lv1",
          StatusEdit: "0",
          ChkStatusEdit: ChkDataEdit,
        };
      } else if (approval === "rejected") {
        payload = {
          ctmId: selectedItem,
          approval,

          description, //คำอธิบาย การยกเลิก

          PerD,
          PerFuNas,
          PerPST_N,
          LevelStaus: "Lv1N",
          // StatusEdit: "0",
          StatusCancel: "Cancel",
          ChkStatusEdit: ChkDataEdit,
        };

        console.log(payload);
      } else if (approval === "pending") {
        payload = {
          ctmId: selectedItem,
          approval,

          description, //คำอธิบายแก้ไข

          PerD,
          PerFuNas,
          PerPST_N,
          LevelStaus: "Lv1E",
          StatusEdit: "1",
          ChkStatusEdit: ChkDataEdit,
        };
      } else {
        alert("ค่า approval ไม่ถูกต้อง");
        return;
      }

      // console.log("payload:", payload);

      // -----------------------------
      // 3) ส่งข้อมูลไป API
      // -----------------------------
      const res = await apiClient.post(
        "/api/insurances/datacustomers/addDataCreditscore",
        { payload: JSON.stringify(payload) }
      );

      if (res.data.status === 200) {
        // 1️⃣ ปิด popup ก่อน
        setShowPopup(false);
        getEmployeeDB_Admin();
        // 2️⃣ แสดง SweetAlert แบบรอให้ผู้ใช้กด OK
        await Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          text: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        });

        return;
      } else {
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลได้",
        });
        return;
      }
    } catch (error) {
      console.error("❌ ERROR ส่งข้อมูล:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const getWaitingStatus = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);

    const diffMs = now - created;
    const diffMin = diffMs / 1000 / 60;

    // ตัวอย่างใน getWaitingStatus
    if (diffMin <= 5) {
      return {
        color: "#E6F7EC",
        textColor: "#157347",
        label: "รอไม่นาน",
      };
    } else if (diffMin <= 10) {
      return {
        color: "#FFF8E1",
        textColor: "#ebac00ff",
        label: "เริ่มรอนาน",
      };
    } else {
      return {
        color: "#FDEAEA",
        textColor: "#B02A37",
        label: "รอนานมาก",
      };
    }
  };

  const [now, setNow] = useState(new Date());

  const getDiffTime = (createdAt, now) => {
    const diffMs = now - new Date(createdAt);

    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { minutes, seconds };
  };

  const getDiffMinute = (createdAt) => {
    return Math.floor((new Date() - new Date(createdAt)) / 1000 / 60);
  };

  //Report DSR Page
  const handleView = (item) => {
    const id = item.CTM_form_number;

    const url = `${window.location.origin}/DataReportDSRs/${id}`;

    window.open(url, "_blank");
  };

  const handleViewModel = (item) => {
    const id = item;

    const url = `${window.location.origin}/DataReportDSRs/${id}`;

    window.open(url, "_blank");
  };

  const handleToggleBooking = async (item) => {
    // 🔒 ถ้าเปิดแล้ว ห้ามกดซ้ำ
    // if (item.Form_status_chk === "1") return;

    const confirm = await Swal.fire({
      icon: "question",
      title: "ยืนยันการเปิดจองงาน",
      html: `
      ต้องการ <b style="color:#198754">เปิดจองงานตรวจสอบ</b><br/>
      เลขที่ใบงาน <b>${item.CTM_form_number}</b> ใช่หรือไม่
    `,
      showCancelButton: true,
      confirmButtonText: "เปิดจอง",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#adb5bd",
      reverseButtons: true,
    });

    // ❌ กดยกเลิก
    if (!confirm.isConfirmed) return;

    // 🔄 1) เช็กสถานะล่าสุดจาก DB ก่อน
    const Getlatest = await checkLatestBookingStatus(item.CTM_form_number);
    const latest = Getlatest.result[0];
    // console.log(latest.Form_status_chk)
    // return;
    if (latest && latest.Form_status_chk === "1") {
      const result = await Swal.fire({
        icon: "info",
        title: "รายการนี้ถูกจองแล้ว",
        html: `
        งานตรวจสอบเลขที่ <b>${item.CTM_form_number}</b><br/><br/>
        ถูกจองโดย<br/>
        <b style="color:#0d6efd">
          ${latest.Form_Name_status_chk || "-"}
        </b><br/>
        <span style="font-size:12px;color:#6c757d">
          เมื่อวันที่ ${
            latest.Form_date_chk ? convertToThaiDate(latest.Form_date_chk) : "-"
          }
        </span>
      `,
        confirmButtonText: "รับทราบ",
      });

      // 🔁 กดรับทราบ → รีโหลดข้อมูลใหม่
      if (result.isConfirmed) {
        getEmployeeDB_Admin();
      }
      return;
    }

    const payload = {
      form_id: item.CTM_form_number, // รหัสใบงาน
      status: "1", // เปิดจอง
      action_name: PerFuNas, // ชื่อคนกด
      action_id: PerD, // รหัสพนักงาน
    };

    // console.log(payload);

    try {
      const res = await apiClient.post(
        "/api/insurances/datacustomers/addSwitStatus",
        { payload: JSON.stringify(payload) }
      );
      if (res.data.status === 200) {
        console.log(res.data.data);
        await Swal.fire({
          icon: "success",
          title: "เปิดจองสำเร็จ",
          text: "ระบบได้เปิดจองงานตรวจสอบเรียบร้อยแล้ว",
          timer: 2000,
          showConfirmButton: false,
        });
        // 🔁 โหลดข้อมูลใหม่
        getEmployeeDB_Admin();
      } else {
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลได้",
        });
        return;
      }
    } catch (error) {
      console.error("เปิดจองไม่สำเร็จ", error);

      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเปิดจองได้",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // 🔍 ดึงสถานะล่าสุดจาก DB
  const checkLatestBookingStatus = async (formNumber) => {
    const res = await apiClient.post(
      "/api/insurances/datacustomers/checkBookingStatus",
      { form_id: formNumber }
    );

    if (res.data?.status === 200) {
      return res.data;
    }

    return null;
  };

  const handleReToggleBooking = async (item) => {
    // // 🔒 ถ้าเปิดแล้ว ห้ามกดซ้ำ
    // if (item.Form_status_chk === "1") return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการยกเลิกงานจอง",
      html: `
    ต้องการ <b style="color:#dc3545">ยกเลิกงานจองตรวจสอบ</b><br/>
    เลขที่ใบงาน <b>${item.CTM_form_number}</b><br/>
    <span style="color:#6c757d;font-size:12px">
      งานจะถูกคืนเข้าสู่คิวกลาง และสามารถถูกจองใหม่ได้
    </span>
  `,
      showCancelButton: true,
      confirmButtonText: "ยกเลิกงานจอง",
      cancelButtonText: "กลับ",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#adb5bd",
      reverseButtons: true,
    });

    // ❌ กดยกเลิก
    if (!confirm.isConfirmed) return;

    const payload = {
      form_id: item.CTM_form_number, // รหัสใบงาน
      status: "0", // เปิดจอง
      action_name: "", // ชื่อคนกด
      action_id: "", // รหัสพนักงาน
    };

    // console.log(payload);

    try {
      const res = await apiClient.post(
        "/api/insurances/datacustomers/addSwitStatus",
        { payload: JSON.stringify(payload) }
      );
      if (res.data.status === 200) {
        console.log(res.data.data);
        await Swal.fire({
          icon: "success",
          title: "ยกเลิกการจองสำเร็จ",
          text: "ระบบได้ยกเลิกการจองงานตรวจสอบเรียบร้อยแล้ว",
          timer: 2000,
          showConfirmButton: false,
        });
        // 🔁 โหลดข้อมูลใหม่
        getEmployeeDB_Admin();
      } else {
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกข้อมูลได้",
        });
        return;
      }
    } catch (error) {
      console.error("ยกเลิกจองไม่สำเร็จ", error);

      Swal.fire({
        icon: "error",
        title: "ไม่สามารถยกเลิกการจองได้",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const openFileInNewTab = (relativePath) => {
    const base = import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB;
    window.open(`${base}/${relativePath}`, "_blank");
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setNow(new Date());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  //รวมฟังก์ชันนับจำนวน

  const [contDataMenuChkCD1, setContDataMenuChkCD1] = useState(""); // ฟังก์ชัน
  const [contDataMenuChkCD2, setContDataMenuChkCD2] = useState(""); // Object to group by section ID
  const [contDataMenuChkCD3, setContDataMenuChkCD3] = useState(""); // Object to group by section ID
  const [contDataMenuChkCD4, setContDataMenuChkCD4] = useState(""); // Object to group by section ID

  // 🔔 จำนวนรายการตรวจข้อมูลเครดิต

  const loadUserNotification1 = async () => {
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_count"
      );

      if (data?.status) {
        setContDataMenuChkCD1(data.sqlDataCustomers); // 🔔 จำนวนงานตรวจสอบ
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  const loadUserNotification2 = async () => {
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_countApproved" //
      );

      if (data?.status) {
        setContDataMenuChkCD2(data.sqlDataCustomers); // 🔔
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  const loadUserNotification3 = async () => {
    //Cancel
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_countCancel"
      );

      if (data?.status) {
        setContDataMenuChkCD3(data.sqlDataCustomers); // 🔔 จำนวนงานตรวจสอบ
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  const loadUserNotification4 = async () => {
    //Cancel
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_countRejected"
      );

      if (data?.status) {
        setContDataMenuChkCD4(data.sqlDataCustomers); // 🔔 จำนวนงานตรวจสอบ
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  // เปลี่ยนหน้า (Pagination)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 🔁 เปลี่ยน tab → รีเซ็ตหน้า + โหลด notification

  //เก่า
  // useEffect(() => {
  //   setCurrentPage(1);

  //   loadUserNotification1();
  //   loadUserNotification2();
  //   loadUserNotification3();
  //   loadUserNotification4();
  // }, [activeTab]);

  // useEffect(() => {
  //   setCurrentPage(1);
  //   getEmployeeDB_Admin(1);
  // }, [searchQuery]);

  // // 📦 โหลดข้อมูลตาราง (เปลี่ยน page หรือ tab)
  // useEffect(() => {
  //   getEmployeeDB_Admin(currentPage);
  // }, [currentPage, activeTab]);

  // 🔔 notification โหลดครั้งเดียว
  useEffect(() => {
    loadUserNotification1();
    loadUserNotification2();
    loadUserNotification3();
    loadUserNotification4();
  }, []);

  // 🔁 reset page เมื่อเปลี่ยน tab
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 🔍 reset page เมื่อ search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 📦 โหลดข้อมูลตาราง (จุดเดียว)
  useEffect(() => {
    getEmployeeDB_Admin(currentPage);
  }, [currentPage, activeTab, searchQuery]);

  const handleRefresh = () => {
    // setCurrentPage(1); // กลับไปหน้าแรก
    getEmployeeDB_Admin(1); // ดึงข้อมูลใหม่
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // 🔑 ค้นแล้วกลับหน้าแรก
  };

  return (
    <div>
      <div className="row g-3">
        {/* รอตรวจสอบ */}
        <div className="col-md-3 col-sm-12">
          <div
            className={`card-dashboard p-3 shadow-sm d-flex align-items-center 
        ${activeTab === "wait" ? "active-card" : ""}`}
            style={{ backgroundColor: "#F5F7FF", cursor: "pointer" }}
            onClick={() => setActiveTab("wait")}
          >
            <img
              src="/Checklist-amico.png"
              // src={`${
              //   import.meta.env.VITE_REACT_APP_PHOTO
              // }/Checklist-amico.png`}
              style={{ height: 80 }}
            />
            <div style={{ marginLeft: 12 }}>
              <p className="title">รอตรวจสอบ</p>
              <p className="value">ทั้งหมด {contDataMenuChkCD1} รายการ</p>
            </div>
          </div>
        </div>

        {/* ตรวจสอบแล้ว */}
        <div className="col-md-3 col-sm-12">
          <div
            className={`card-dashboard p-3 shadow-sm d-flex align-items-center
        ${activeTab === "pass" ? "active-card" : ""}`}
            style={{ backgroundColor: "#F5F7FF", cursor: "pointer" }}
            onClick={() => setActiveTab("pass")}
          >
            <img
              src="/Insurance-amico (1).png"
              // src={`${
              //   import.meta.env.VITE_REACT_APP_PHOTO
              // }/Insurance-amico (1).png`}
              style={{ height: 80 }}
            />
            <div style={{ marginLeft: 12 }}>
              <p className="title">ตรวจสอบแล้ว</p>
              <p className="value">ทั้งหมด {contDataMenuChkCD2} รายการ</p>
            </div>
          </div>
        </div>

        {/* ยกเลิก */}
        <div className="col-md-3 col-sm-12">
          <div
            className={`card-dashboard p-3 shadow-sm d-flex align-items-center
            ${activeTab === "cancel" ? "active-card" : ""}`}
            style={{ backgroundColor: "#F5F7FF", cursor: "pointer" }}
            onClick={() => setActiveTab("cancel")}
          >
            <img
              // src={`${import.meta.env.VITE_REACT_APP_PHOTO}/Cancel-bro.png`}
              src="/Cancel-bro.png"
              style={{ height: 80 }}
            />
            <div style={{ marginLeft: 12 }}>
              <p className="title">ยกเลิกรายการตรวจสอบ</p>
              <p className="value">ทั้งหมด {contDataMenuChkCD3} รายการ</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div
            className={`card-dashboard p-3 shadow-sm d-flex align-items-center
           ${activeTab === "fail" ? "active-card" : ""}`}
            style={{ backgroundColor: "#F5F7FF", cursor: "pointer" }}
            onClick={() => setActiveTab("fail")}
          >
            <img
              src="/Cancel-bro.png"
              // src={`${import.meta.env.VITE_REACT_APP_PHOTO}/Cancel-bro.png`}
              style={{ height: 80 }}
            />
            <div style={{ marginLeft: 12 }}>
              <p className="title">รายการไม่ผ่านการอนุมัติสินเชื่อ</p>
              <p className="value">ทั้งหมด {contDataMenuChkCD4} รายการ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="cartcustom p-3 shadow-sm">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // ดันซ้าย-ขวา
              width: "100%",
            }}
          >
            {/* ซ้าย: ไอคอน + ข้อความ */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#5b6b82", marginTop: 4 }}>
                  ค้นหาข้อมูลที่ต้องการ
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="pt-1">
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        background: "white",
                        border: "1px solid #e0e0e0",
                        borderRight: "none",
                        borderRadius: "7px 0 0 7px",
                      }}
                    >
                      <FiSearch style={{ color: "#888", fontSize: "16px" }} />
                    </InputGroup.Text>
                    <FormControl
                      type="search"
                      placeholder="ค้นหาชื่อลูกค้า / เลขบัตร / เลขที่แบบฟอร์ม"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{
                        borderRadius: "0 7px 7px 0",
                        fontSize: "13px",
                        border: "1px solid #e0e0e0",
                        borderLeft: "none",
                        boxShadow: "none",
                      }}
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* ขวาสุด: ปุ่ม action */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                onClick={handleRefresh}
                style={{
                  background:
                    "linear-gradient(to right,rgba(22, 60, 93, 1), #002b57)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                }}
              >
                <FaSyncAlt /> รีเฟรช
              </Button>
            </div>
          </div>

          {activeTab === "wait" && (
            <div className="table-responsive pt-2">
              {/* รอการตรวจสอบ */}
              <table className="table table-hover table-sm">
                <thead className="custom-buttonTBs">
                  <tr>
                    <th className="text-center" style={{ width: "2%" }}>
                      ลำดับ
                    </th>
                    <th className="text" style={{ width: "7%" }}>
                      เลขที่แบบฟอร์ม
                    </th>
                    <th className="text" style={{ width: "8%" }}>
                      ชื่อ-สกุลลูกค้า
                    </th>
                    <th className="text" style={{ width: "3%" }}>
                      เลขบัตรประชาชน
                    </th>
                    <th className="text" style={{ width: "9%" }}>
                      ผู้ขอสืบค้น
                    </th>
                    {/* <th className="text" style={{ width: "10%" }}>
                      ตำแหน่ง
                    </th> */}
                    <th className="text" style={{ width: "6%" }}>
                      สาขา/หน่วย
                    </th>
                    <th className="text" style={{ width: "6%" }}>
                      เขต
                    </th>
                    <th className="text" style={{ width: "3%" }}>
                      ภาค
                    </th>
                    <th className="text" style={{ width: "7%" }}>
                      เอกสารประกอบ
                    </th>
                    <th className="text" style={{ width: "5%" }}>
                      วันที่/เวลา ที่ยื่นเรื่อง
                    </th>

                    <th className="text-center" style={{ width: "5%" }}>
                      สถานะ
                    </th>

                    <th className="text-center" style={{ width: "5%" }}>
                      การตรวจสอบ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {probationaryEmployees.map((item, index) => (
                    <tr key={item.CTM_form_number}>
                      <td className="text-center">
                        {(currentPage - 1) * limit + (index + 1)}
                      </td>

                      <td>{item.CTM_form_number}</td>
                      <td>
                        {item.CTM_title_name}
                        {item.CTM_firstname} {item.CTM_lastname}
                      </td>
                      <td>{item.CTM_citizen_id}</td>
                      <td>
                        {item.CTM_recorder_fullname}
                        <div style={{ fontSize: "10px" }}>
                          ตำแหน่ง : {item.CTM_position}
                        </div>
                      </td>

                      <td>{item.CTM_business_zone}</td>
                      <td>{item.belong}</td>
                      <td>{item.CTM_business_region}</td>
                      <td className="text">
                        <button
                          className="doc-btn doc-consent mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/consent/${item.Form_consent_document}`
                            )
                          }
                          title="หนังสือยินยอมเปิดเผยข้อมูล"
                        >
                          <BsFiletypeDoc />
                        </button>

                        <button
                          className="doc-btn doc-application mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/application/${item.Form_application_document}`
                            )
                          }
                          title="แบบฟอร์มคำขอ"
                        >
                          <IoDocumentTextOutline />
                        </button>

                        <button
                          className="doc-btn doc-idcard mr-2 mt-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/idcard/${item.Form_idcard_photo}`
                            )
                          }
                          title="รูปบัตรประชาชน"
                        >
                          <FaRegIdCard />
                        </button>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                          }}
                        >
                          {/* วันที่สร้าง */}
                          <span>{convertToThaiDate(item.CTM_created_at)}</span>

                          {/* เคยแก้ไข */}

                          {item.Form_status_Edit === "1" && (
                            <button
                              onClick={() =>
                                setOpenFeeModal(item.SCORE_additional_fee)
                              }
                              style={{
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                fontSize: "11px",
                                color: "#d9822b",
                                fontWeight: 600,
                                cursor: "pointer",
                                // textDecoration: "underline",
                              }}
                            >
                              ข้อมูลปรับแก้
                            </button>
                          )}
                        </div>
                      </td>

                      {/* สถานะรอตรวจ */}
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {(() => {
                          // const waitStatus = getWaitingStatus(
                          //   item.date_upEvidence
                          // );

                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {/* ปุ่มสถานะ */}
                              {item.Form_status_chk === "0" ? (
                                <button
                                  // onClick={() =>
                                  //   handleStatusClick(item.CTM_form_number)
                                  // }
                                  style={{
                                    border: "none",
                                    borderRadius: "999px",
                                    padding: "6px 18px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    backgroundColor: "#f6b72ff5",
                                       color: "#5a3103ff",
                                    cursor: "pointer",
                                    minWidth: "120px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                  }}
                                >
                                  0w · รอตรวจสอบ
                                </button>
                              ) : (
                                <>
                                  {PerD === item.Form_idPer_chk ? (
                                    // ✅ ไอดีตรง → เปิดให้ตรวจสอบได้
                                    <button
                                      onClick={() =>
                                        handleStatusClick(item.CTM_form_number)
                                      }
                                      style={{
                                        border: "none",
                                        borderRadius: "999px",
                                        padding: "6px 18px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        backgroundColor: "#039201ff",
                                        color: "#f6f6f6ff",
                                        cursor: "pointer",
                                        minWidth: "120px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                      }}
                                      className="status-badge  smooth-blink-strong"
                                    >
                                      เริ่มการตรวจสอบ
                                    </button>
                                  ) : (
                                    // ⛔ ไอดีไม่ตรง → กำลังตรวจสอบ (กดไม่ได้)
                                    <div>
                                      <button
                                        disabled
                                        style={{
                                          border: "none",
                                          borderRadius: "999px",
                                          padding: "6px 18px",
                                          fontSize: "10px",
                                          fontWeight: 600,
                                          backgroundColor: "#edededff",
                                          color: "#616161",
                                          cursor: "not-allowed",
                                          minWidth: "120px",
                                          boxShadow:
                                            "0 1px 3px rgba(0,0,0,0.08)",
                                        }}
                                      >
                                        กำลังตรวจสอบโดย..
                                        <span style={{ fontSize: "10px" }}>
                                          {" "}
                                          {item.Form_Name_status_chk}
                                        </span>
                                      </button>{" "}
                                    </div>
                                  )}
                                </>
                              )}

                              {/* สถานะเวลา */}

                              {/* <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: status.textColor,
                                }}
                              >
                                <span
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: status.textColor,
                                    display: "inline-block",
                                  }}
                                />
                                {status.label}
                              </div> */}

                              {/* เวลาเดิน */}
                              {/* <div
                                style={{
                                  fontSize: "11px",
                                  color: "#6c757d",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              > */}
                              {/* ⏱ {minutes}:
                                {seconds.toString().padStart(2, "0")} */}
                              {/* </div> */}
                            </div>
                          );
                        })()}
                      </td>

                      <td className="td-switch">
                        <div className="switch-wrapper pb-4">
                          {item.Form_status_chk === "1" ? (
                            <>
                              {PerD === item.Form_idPer_chk ? (
                                /* 🔒 สวิตช์เมื่อเปิดจองแล้ว */

                                <label className="switch-booking switch-locked">
                                  <input
                                    type="checkbox"
                                    checked={true} // ✅ ยึดจาก DB
                                    onChange={() => handleReToggleBooking(item)}
                                  />
                                  <span className="slider">
                                    <span className="text on">ตรวจอยู่</span>
                                  </span>
                                </label>
                              ) : (
                                <label className="switch-booking switch-locked">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    disabled
                                  />
                                  <span className="slider">
                                    <span className="text on">ตรวจอยู่</span>
                                  </span>
                                </label>
                              )}
                            </>
                          ) : (
                            /* 🔓 สวิตช์สำหรับกดเปิดจอง */
                            <label className="switch-booking">
                              <input
                                type="checkbox"
                                checked={false} // ✅ FIX สำคัญมาก
                                onChange={() => handleToggleBooking(item)}
                              />
                              <span className="slider">
                                <span className="text on"></span>
                                <span className="text off">จองงาน</span>
                              </span>
                            </label>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 ? (
                <div className="card-footer clearfix">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <div style={{ height: "500px" }}></div>
              )}
            </div>
          )}

          {activeTab === "pass" && (
            <div className="table-responsive pt-2">
              <table className="table table-hover table-sm">
                <thead className="custom-buttonTBs">
                  <tr>
                    <th className="text-center" style={{ width: "2%" }}>
                      ลำดับ
                    </th>
                    <th className="text" style={{ width: "5%" }}>
                      เลขที่แบบฟอร์ม
                    </th>
                    <th className="text" style={{ width: "14%" }}>
                      ชื่อ-นาม สกุลลูกค้า
                    </th>

                    <th className="text" style={{ width: "15%" }}>
                      ผู้ขอสืบค้น
                    </th>
                    <th className="text" style={{ width: "10%" }}>
                      สาขา / หน่วย
                    </th>
                    <th className="text" style={{ width: "10%" }}>
                      เขต
                    </th>
                    <th className="text" style={{ width: "5%" }}>
                      ภาค
                    </th>

                    <th className="text" style={{ width: "7%" }}>
                      เอกสารประกอบ
                    </th>
                    <th className="text" style={{ width: "7%" }}>
                      วันที่/เวลา ที่ยื่นเรื่อง
                    </th>
                    <th className="text" style={{ width: "10%" }}>
                      ผู้ตรวจสอบ
                    </th>
                    <th className="text" style={{ width: "10%" }}>
                      วัน/เวลา ที่ตรวจสอบ
                    </th>
                    <th className="text" style={{ width: "7%" }}>
                      รายงานผล
                    </th>

                    <th className="text-center" style={{ width: "10%" }}>
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {probationaryEmployees.map((item, index) => (
                    <tr key={item.CTM_form_number}>
                      <td className="text-center">
                        {(currentPage - 1) * limit + (index + 1)}
                      </td>

                      <td>{item.CTM_form_number}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                          {item.CTM_title_name}
                          {item.CTM_firstname} {item.CTM_lastname}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                        </div>
                      </td>

                      <td>
                        <div>{item.CTM_recorder_fullname}</div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ตำแหน่ง: {item.CTM_position || "-"}
                        </div>
                      </td>
                      <td> {item.CTM_business_zone || "-"}</td>
                      <td> {item.belong || "-"}</td>
                      <td> {item.region || "-"}</td>
                      <td className="text">
                        <button
                          className="doc-btn doc-consent mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/consent/${item.Form_consent_document}`
                            )
                          }
                          title="หนังสือยินยอมเปิดเผยข้อมูล"
                        >
                          <BsFiletypeDoc />
                        </button>

                        <button
                          className="doc-btn doc-application mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/application/${item.Form_application_document}`
                            )
                          }
                          title="แบบฟอร์มคำขอ"
                        >
                          <IoDocumentTextOutline />
                        </button>

                        <button
                          className="doc-btn doc-idcard mr-2 mt-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/idcard/${item.Form_idcard_photo}`
                            )
                          }
                          title="รูปบัตรประชาชน"
                        >
                          <FaRegIdCard />
                        </button>
                      </td>
                      <td>{convertToThaiDate(item.CTM_created_at)}</td>

                      <td>{item.Form_Name_Inspector}</td>
                      <td>{convertToThaiDate(item.Form_date_inspertor)}</td>
                      <td className="text">
                        <center>
                          <div>
                            <button
                              className="btn-icon"
                              onClick={() => handleView(item)}
                              title="รายงานผล"
                            >
                              <AiOutlineFileSearch />
                            </button>
                          </div>
                        </center>
                      </td>

                      <td className="text">
                        {item.Form_verification_status === "Lv0" && (
                          <span
                            className="status-badge status-wait"
                            onClick={() =>
                              handleStatusClick(item.CTM_form_number)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            0w - รอตรวจสอบข้อมูล
                          </span>
                        )}
                        {item.Form_verification_status >= "Lv1" &&
                          item.Form_verification_status != "Lv1N" && (
                            <center>
                              <span
                                className="status-badge status-pass"
                                // onClick={() =>
                                //   handleStatusClick(item.CTM_form_number)
                                // }
                                style={{ cursor: "pointer" }}
                              >
                                ตรวจแล้ว
                              </span>
                            </center>
                          )}
                        {item.Form_verification_status === "Lv1N" && (
                          <span
                            className="status-badge status-cancel"
                            onClick={() =>
                              handleStatusClick(item.CTM_form_number)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            1N ยกเลิกรายการตรวจสอบ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 ? (
                <div className="card-footer clearfix">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <div style={{ height: "500px" }}></div>
              )}
            </div>
          )}

          {activeTab === "cancel" && (
            <div className="table-responsive pt-2">
              <table className="table table-hover table-sm">
                <thead className="custom-buttonTBs">
                  <tr>
                    <th className="text-center" style={{ width: "2%" }}>
                      ลำดับ
                    </th>
                    <th className="text" style={{ width: "5%" }}>
                      เลขที่แบบฟอร์ม
                    </th>
                    <th className="text" style={{ width: "14%" }}>
                      ชื่อ-นาม สกุลลูกค้า
                    </th>

                    <th className="text" style={{ width: "15%" }}>
                      ผู้ขอสืบค้น
                    </th>
                    <th className="text" style={{ width: "8%" }}>
                      สาขา / หน่วย
                    </th>
                    <th className="text" style={{ width: "8%" }}>
                      เขต
                    </th>
                    <th className="text" style={{ width: "5%" }}>
                      ภาค
                    </th>

                    <th className="text" style={{ width: "7%" }}>
                      เอกสารประกอบ
                    </th>
                    <th className="text" style={{ width: "7%" }}>
                      วันที่/เวลา ที่ยื่นเรื่อง
                    </th>
                    <th className="text" style={{ width: "10%" }}>
                      ผู้ตรวจสอบ
                    </th>
                    <th className="text" style={{ width: "10%" }}>
                      วัน/เวลา ที่ตรวจสอบ
                    </th>
                    {/* <th className="text" style={{ width: "7%" }}>
                      รายงานผล
                    </th> */}

                    <th className="text-center" style={{ width: "10%" }}>
                      สถานะ
                    </th>
                    <th className="text-center" style={{ width: "25%" }}>
                      รายละเอียด
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {probationaryEmployees.map((item, index) => (
                    <tr key={item.CTM_form_number}>
                      <td className="text-center">
                        {(currentPage - 1) * limit + (index + 1)}
                      </td>

                      <td>{item.CTM_form_number}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                          {item.CTM_title_name}
                          {item.CTM_firstname} {item.CTM_lastname}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                        </div>
                      </td>

                      <td>
                        <div>{item.CTM_recorder_fullname}</div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ตำแหน่ง: {item.CTM_position || "-"}
                        </div>
                      </td>
                      <td> {item.CTM_business_zone || "-"}</td>
                      <td> {item.belong || "-"}</td>
                      <td> {item.region || "-"}</td>
                      <td className="text">
                        <button
                          className="doc-btn doc-consent mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/consent/${item.Form_consent_document}`
                            )
                          }
                          title="หนังสือยินยอมเปิดเผยข้อมูล"
                        >
                          <BsFiletypeDoc />
                        </button>

                        <button
                          className="doc-btn doc-application mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/application/${item.Form_application_document}`
                            )
                          }
                          title="แบบฟอร์มคำขอ"
                        >
                          <IoDocumentTextOutline />
                        </button>

                        <button
                          className="doc-btn doc-idcard mr-2 mt-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/idcard/${item.Form_idcard_photo}`
                            )
                          }
                          title="รูปบัตรประชาชน"
                        >
                          <FaRegIdCard />
                        </button>
                      </td>
                      <td>{convertToThaiDate(item.CTM_created_at)}</td>

                      <td>{item.Form_Name_Inspector}</td>
                      <td>{convertToThaiDate(item.Form_date_inspertor)}</td>
                      {/* <td className="text">
                        <center>
                          <div className="">
                            <button
                              className="btn-icon"
                              onClick={() => handleView(item)}
                            >
                              <AiOutlineFileSearch />
                            </button>
                          </div>
                        </center>
                      </td> */}

                      <td className="text">
                        {item.Form_verification_status === "Lv0" && (
                          <span
                            className="status-badge status-wait"
                            onClick={() =>
                              handleStatusClick(item.CTM_form_number)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            0w - รอตรวจสอบข้อมูล
                          </span>
                        )}
                        {item.Form_verification_status >= "Lv1" &&
                          item.Form_verification_status != "Lv1N" && (
                            <center>
                              <span
                                className="status-badge status-pass"
                                onClick={() =>
                                  handleStatusClick(item.CTM_form_number)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                ตรวจแล้ว
                              </span>
                            </center>
                          )}
                        {item.Form_verification_status === "Lv1N" && (
                          <span
                            className="status-badge status-cancel"
                            // onClick={() =>
                            //   handleStatusClick(item.CTM_form_number)
                            // }
                            style={{ cursor: "pointer" }}
                          >
                            1N ยกเลิกรายการตรวจสอบ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 ? (
                <div className="card-footer clearfix">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <div style={{ height: "500px" }}></div>
              )}
            </div>
          )}

          {activeTab === "fail" && (
            <div className="table-responsive pt-2">
              <table className="table table-hover table-sm">
                <thead className="custom-buttonTBs">
                  <tr>
                    <th className="text-center" style={{ width: "2%" }}>
                      ลำดับ
                    </th>
                    <th className="text" style={{ width: "8%" }}>
                      เลขที่แบบฟอร์ม
                    </th>
                    <th className="text" style={{ width: "13%" }}>
                      ชื่อ-นาม สกุลลูกค้า
                    </th>

                    <th className="text" style={{ width: "16%" }}>
                      ผู้บันทึกข้อมูล
                    </th>

                    <th className="text" style={{ width: "10%" }}>
                      วัน/เวลา ที่บันทึก
                    </th>

                    <th className="text" style={{ width: "10%" }}>
                      เอกสารประกอบ
                    </th>
                    <th className="text" style={{ width: "5%" }}>
                      รายงานผล
                    </th>
                    <th className="text" style={{ width: "11%" }}>
                      ผู้รายงานผลตรวจ
                    </th>

                    <th className="text" style={{ width: "5%" }}>
                      วัน/เวลา ที่รายงานผลตรวจ
                    </th>

                    <th className="text-center" style={{ width: "5%" }}>
                      สถานะ
                    </th>
                    <th className="text-center" style={{ width: "15%" }}>
                      SMS
                    </th>
                    <th>หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {probationaryEmployees.map((item, index) => (
                    <tr key={item.CTM_form_number}>
                      <td className="text-center">
                        {" "}
                        {(currentPage - 1) * limit + (index + 1)}
                      </td>
                      <td>{item.CTM_form_number}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                          {item.CTM_title_name}
                          {item.CTM_firstname} {item.CTM_lastname}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          วัน/เดือน/ปี เกิด:{" "}
                          {convertToThaiDate1(item.CTM_birthdate)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เบอร์โทร : {item.CTM_phone || "-"}
                        </div>
                      </td>

                      <td>
                        <div>{item.CTM_recorder_fullname}</div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ตำแหน่ง: {item.CTM_position || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          สาขา/หน่วย: {item.CTM_business_zone || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          เขต: {item.belong || "-"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ภาค: {item.region || "-"}
                        </div>
                      </td>
                      <td>{convertToThaiDate(item.CTM_created_at)}</td>
                      <td className="text">
                        <button
                          className="doc-btn doc-consent mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/consent/${item.Form_consent_document}`
                            )
                          }
                          title="หนังสือยินยอมเปิดเผยข้อมูล"
                        >
                          <BsFiletypeDoc />
                        </button>

                        <button
                          className="doc-btn doc-application mr-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/application/${item.Form_application_document}`
                            )
                          }
                          title="แบบฟอร์มคำขอ"
                        >
                          <IoDocumentTextOutline />
                        </button>

                        <button
                          className="doc-btn doc-idcard mr-2 mt-1"
                          onClick={() =>
                            openFileInNewTab(
                              `img/idcard/${item.Form_idcard_photo}`
                            )
                          }
                          title="รูปบัตรประชาชน"
                        >
                          <FaRegIdCard />
                        </button>
                      </td>
                      <td className="text">
                        <center>
                          <div>
                            <button
                              className="btn-icon"
                              onClick={() => handleView(item)}
                            >
                              <AiOutlineFileSearch />
                            </button>
                          </div>
                        </center>
                      </td>
                      <td>{item.Form_Name_Inspector}</td>
                      <td>{convertToThaiDate(item.Form_date_inspertor)}</td>
                      {/* <td>{item.Form_Inspector}</td> */}

                      <td className="text-center">
                        <center>
                          {item.Form_Approval_results === "rejected" && (
                            <span className="status-badge status-fail">
                              2N-ไม่ผ่านการอนุมัติ
                            </span>
                          )}
                        </center>
                      </td>
                      <td className="text-center">
                        {item.Form_status_SMS === "OK" ? (
                          <>
                            <AiOutlineCheckCircle
                              style={{ color: "#16a34a", fontSize: "18px" }}
                            />{" "}
                            <div style={{ fontSize: "12px" }}>
                              รหัสอ้างอิง {item.Form_id_SMS}
                            </div>
                          </>
                        ) : item.Form_status_SMS === "ERROR" ? (
                          <AiOutlineCloseCircle
                            style={{ color: "#dc2626", fontSize: "18px" }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ color: "#161616ff", fontSize: "14px" }}>
                        {" "}
                        {item.Form_note_approval}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 ? (
                <div className="card-footer clearfix">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <div style={{ height: "500px" }}></div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Popup แสดงข้อมูล */}
      {showPopup && selectedItem && (
        <div className="modal-overlay3">
          <div className="modal-content3">
            {/* 🔹 หัวเรื่อง */}
            <h3
              className="card-title"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
                fontWeight: "600",
                color: "#0f3d78",
                marginBottom: "10px",
              }}
            >
              <FaFileSignature
                style={{ color: "#023672ff", fontSize: "20px" }}
              />
              สรุปผลการอนุมัติสินเชื่อ
            </h3>

            {/* 🔹 ส่วนที่ 1 */}
            <div className="card recorder-card full-width">
              <div className="card-title1" style={{ fontSize: "18px" }}>
                รายละเอียดผู้ขอสืบค้น
              </div>

              <div className="rec-grid2">
                <div>
                  <strong>แบบฟอร์มเลขที่ :</strong>{" "}
                  {getDataShow?.CTM_form_number || "-"}
                </div>
                <div>
                  <strong>ผู้ขอสืบค้น :</strong>{" "}
                  {getDataShow?.CTM_recorder_fullname || "-"}
                </div>
                <div>
                  <strong>ตำแหน่ง :</strong> {getDataShow?.CTM_position || "-"}
                </div>
                <div>
                  <strong>สาขา/หน่วย :</strong>{" "}
                  {getDataShow?.CTM_business_zone || "-"}
                </div>
                <div>
                  <strong>วัน/เวลาที่ยื่นขอสืบค้น :</strong>{" "}
                  {convertToThaiDate(getDataShow?.CTM_created_at) || "-"}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <strong>เอกสารประกอบ </strong>{" "}
                  <ul
                    style={{
                      marginTop: "6px",
                      paddingLeft: "18px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      <span
                        style={{ color: "#4a90e2", cursor: "pointer" }}
                        onClick={() =>
                          openFileInNewTab(
                            `img/consent/${getDataShow?.Form_consent_document}`
                          )
                        }
                        title="หนังสือยินยอมเปิดเผยข้อมูล"
                      >
                        หนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                      </span>
                    </li>

                    <li>
                      <span
                        style={{ color: "#4a90e2", cursor: "pointer" }}
                        onClick={() =>
                          openFileInNewTab(
                            `img/application/${getDataShow?.Form_application_document}`
                          )
                        }
                        title="แบบฟอร์มคำขอ"
                      >
                        ใบสมัครขอสินเชื่อ
                      </span>
                    </li>

                    <li>
                      <span
                        style={{ color: "#4a90e2", cursor: "pointer" }}
                        onClick={() =>
                          openFileInNewTab(
                            `img/idcard/${getDataShow?.Form_idcard_photo}`
                          )
                        }
                        title="รูปบัตรประชาชน"
                      >
                        สำเนาบัตรประชาชน
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 🔹 ส่วนที่ 2 */}
            <div className="card recorder-card full-width">
              <div className="card-title2" style={{ fontSize: "18px" }}>
                ข้อมูลลูกค้า
              </div>

              <div className="rec-grid2">
                <div>
                  <strong>ชื่อ - นามสกุลลูกค้า :</strong>{" "}
                  {getDataShow?.CTM_title_name}
                  {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname}
                </div>
                <div>
                  <strong>วัน/เดือน/ปีเกิด :</strong>{" "}
                  {convertToThaiDate1(getDataShow?.CTM_birthdate) || "-"}
                </div>
                <div>
                  <strong>หมายเลขบัตรประชาชน :</strong>{" "}
                  {getDataShow?.CTM_citizen_id || "-"}
                </div>
                <div>
                  <strong>หมายเลขโทรศัพท์ :</strong>{" "}
                  {getDataShow?.CTM_phone || "-"}
                </div>
                <div>
                  <strong>ประเภทสินเชื่อที่ลูกค้าสมัคร :</strong>{" "}
                  {getDataShow?.LTNL_Name || "-"}
                  {/* {loanTypeMap[getDataShow?.Form_loan_type] || "-"} */}
                </div>
                <div>
                  <strong>วงเงินขอสินเชื่อ :</strong>{" "}
                  {getDataShow?.Form_loan_amount
                    ? Number(getDataShow.Form_loan_amount).toLocaleString()
                    : "-"}{" "}
                  บาท
                </div>

                <div>
                  <strong>ประเภทลูกค้า :</strong>{" "}
                  {getDataShow?.CMTN_Name || "-"}
                </div>
              </div>
            </div>

            {/* 🔹 ส่วนที่ 3 */}
            <div className="card recorder-card full-width">
              <div className="card-title4" style={{ fontSize: "18px" }}>
                รายงานผลการตรวจสอบข้อมูลเครดิต
              </div>

              <form className="approval-form">
                <div className="form-group">
                  {/* 🔹 ส่วนเลือกสถานะ */}
                  <div className="form-group">
                    <div className="radio-group mt-3">
                      <label className="form-label">
                        สถานะ <span className="required">*</span> :
                      </label>
                      <label>
                        <input
                          className="mr-1"
                          type="radio"
                          name="approval"
                          value="approved"
                          checked={approval === "approved"}
                          onChange={() => setApproval("approved")}
                        />{" "}
                        พบข้อมูล
                      </label>

                      <label>
                        <input
                          type="radio"
                          className="mr-1"
                          name="approval"
                          value="rejected"
                          checked={approval === "rejected"}
                          onChange={() => setApproval("rejected")}
                          style={{ accentColor: "red" }}
                        />{" "}
                        ยกเลิกรายการ
                      </label>

                      <label>
                        <input
                          type="radio"
                          className="mr-1"
                          name="approval"
                          value="pending"
                          checked={approval === "pending"}
                          onChange={() => setApproval("pending")}
                          style={{ accentColor: "green" }}
                        />{" "}
                        รอการแก้ไข
                      </label>
                    </div>
                  </div>
                </div>
                <hr />

                {/* 🔹 แสดงฟอร์มตามสถานะ */}
                {approval === "approved" && (
                  <div className="credit-form">
                    <div className="section-block">
                      <div className="credit-row">
                        {/* 🔹 เข้าร่วมโครงการ */}
                        <div className="form-group">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              fontSize: "18px",
                            }}
                          >
                            <label>
                              ลูกค้าเข้าร่วมโครงการ{" "}
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                “คุณสู้ เราช่วย”
                              </span>{" "}
                              หรือไม่ <span className="required">*</span> :
                            </label>

                            <label style={{ marginBottom: 0 }}>
                              <input
                                type="radio"
                                className="ml-2 mr-2"
                                name="joinProject"
                                value="no"
                                checked={joinProject === "no"}
                                onChange={() => setJoinProject("no")}
                              />
                              ไม่เข้าร่วม
                            </label>

                            <label style={{ marginBottom: 0 }}>
                              <input
                                type="radio"
                                className="ml-2 mr-2"
                                name="joinProject"
                                value="yes"
                                checked={joinProject === "yes"}
                                onChange={() => setJoinProject("yes")}
                              />
                              เข้าร่วม
                            </label>
                          </div>
                        </div>

                        {/* 🔹 รายได้ */}
                      </div>
                      <label className="form-label-inline">
                        1. มีสินเชื่อส่วนบุคคลภายใต้การกำกับ จำนวน{" "}
                        <span className="required">*</span> :{" "}
                        <label>
                          <input
                            type="number"
                            placeholder="กรุณากรอก"
                            className="input-normal"
                            value={valueCredit}
                            onChange={(e) => setValueCredit(e.target.value)}
                            style={{
                              height: "35px", // 🔽 ลดความสูง
                              padding: "2px 6px", // 🔽 ลดช่องว่างใน
                              lineHeight: "1.2",
                              fontSize: "14px",
                            }}
                          />
                        </label>
                        <label className="mr-1 ml-3">
                          แห่ง{" "}
                          <span style={{ color: "red" }}>
                            (ไม่นับรวมของ SAKSIAM)
                          </span>
                        </label>
                      </label>
                      <div className="credit-row">
                        {/* 🔹 สถานะบุคคลล้มละลาย */}
                        <div className="form-group-inline">
                          <label className="form-label-inline">
                            2.สถานะการเป็นบุคคลล้มละลาย{" "}
                            <span className="required">*</span> :{" "}
                            <label className="ml-2 mr-2">
                              <input
                                type="radio"
                                className="mr-1"
                                name="bankrupt"
                                value="no"
                                checked={bankrupt === "no"}
                                onChange={() => setBankrupt("no")}
                              />{" "}
                              ไม่เป็น
                            </label>
                            <label className="mr-2">
                              <input
                                type="radio"
                                className="mr-1"
                                name="bankrupt"
                                value="yes"
                                checked={bankrupt === "yes"}
                                onChange={() => setBankrupt("yes")}
                              />{" "}
                              เป็น
                            </label>
                            {/* 🔹 วันที่ข้อมูล NCB สิ้นงวด */}
                            <label className="mr-1 ml-3">
                              {" "}
                              ตามฐานข้อมูล NCB ณ สิ้นงวด :{" "}
                            </label>
                            <label>
                              <input
                                type="date"
                                className={`input-normal ${
                                  submitted && reportDateError
                                    ? "input-error"
                                    : ""
                                }`}
                                value={reportDate}
                                onChange={(e) => {
                                  setReportDate(e.target.value);
                                  if (e.target.value) {
                                    setReportDateError(""); // ✅ เลือกแล้วหาย error
                                  }
                                }}
                              />
                            </label>
                            {/* 🔴 ข้อความแจ้งเตือน */}
                            {/* {submitted && reportDateError && (
                                <div className="input-error-text">
                                  {reportDateError}
                                </div>
                              )} */}
                          </label>
                        </div>
                      </div>
                      {/* 🔹 คะแนนเครดิต */}
                      {/* <div className="credit-form"> */}
                      3.คะแนนเครดิต <span className="required">*</span>
                      {/* 🔹 ฟอร์มหลัก (แถวเดียว) */}
                      <div className="credit-row-main">
                        <div className="form-group">
                          <label>
                            คะแนนเครดิต <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            className="input-normal"
                            placeholder="กรอกคะแนนเครดิต"
                            value={score}
                            onChange={handleScoreChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            ระดับคะแนนเครดิต <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="input-normal"
                            value={level}
                            disabled
                            readOnly
                            placeholder="ระดับคะแนนเครดิตจะแสดงอัตโนมัติ"
                          />
                        </div>

                        {/* 🔹 ความน่าจะเป็นในการชำระหนี้คืน */}
                        <div className="form-group">
                          <label>
                            ความน่าจะเป็นในการชำระหนี้คืน{" "}
                            <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            className="input-normal"
                            placeholder="กรอกตัวเลข (0-10000)"
                            value={probabilityInput}
                            onChange={handleProbabilityChange}
                          />
                          <input
                            type="text"
                            className="input-normal"
                            style={{ marginTop: "6px" }}
                            value={probabilityPercent}
                            readOnly
                            placeholder="% จะแสดงอัตโนมัติ"
                          />
                        </div>

                        {/* 🔹 ผลการตรวจสอบข้อมูลเครดิต */}
                        {/* 🔹 ผลการตรวจสอบข้อมูลเครดิต */}
                        <div className="form-group">
                          <label>
                            ผลการตรวจสอบข้อมูลเครดิต{" "}
                            <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="input-normal"
                            value={result}
                            readOnly
                            style={{
                              color:
                                result === "ผ่าน"
                                  ? "#0f8f2d" // สีเขียว
                                  : result === "ไม่ผ่าน"
                                  ? "#c91414" // สีแดง
                                  : "black",
                              fontWeight: "bold",
                            }}
                            placeholder="ผลตรวจสอบข้อมูลเครดิตจะแสดงอัตโนมัติ"
                          />
                          <p
                            className="risk-note"
                            style={{
                              color:
                                risk === "ความเสี่ยงต่ำ"
                                  ? "#0f8f2d" // เขียว
                                  : risk === "ความเสี่ยงปานกลาง"
                                  ? "#f0ad00" // เหลือง
                                  : risk === "ความเสี่ยงสูง"
                                  ? "#c91414" // แดง
                                  : "black",
                              fontWeight: "bold",
                            }}
                          >
                            ระดับความเสี่ยง :{" "}
                            <strong>{risk || "แสดงอัตโนมัติ"}</strong>
                          </p>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                    <hr />

                    {/* 🔹 ส่วนที่ 3.1 เหตุผลประกอบเพิ่มเติม */}
                    <div>
                      <div className="form-section-title">
                        3.1 เหตุผลประกอบเพิ่มเติม
                      </div>

                      {/* 🔹 Loop รายการบัญชี */}
                      {accounts.map((acc, index) => (
                        <div
                          key={index}
                          className="credit-row"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "8px",
                          }}
                        >
                          {/* 🔹 ช่องสถานะบัญชี */}
                          <select
                            className="select-account-status"
                            value={acc.status}
                            onChange={(e) =>
                              handleChange(index, "status", e.target.value)
                            }
                          >
                            <option value="">
                              - เลือกสถานะบัญชี ({index + 1}) -
                            </option>

                            <option
                              value="มีสถานะบัญชี (10) - ปกติ
                              (ไม่มีหนี้ค้างชำระหรือมีหนี้ค้างชำระไม่เกิน 90
                              วัน)"
                            >
                              มีสถานะบัญชี (10) - ปกติ
                              (ไม่มีหนี้ค้างชำระหรือมีหนี้ค้างชำระไม่เกิน 90
                              วัน)
                            </option>

                            <option value="มีสถานะบัญชี (11) - ปิดบัญชี">
                              มีสถานะบัญชี (11) - ปิดบัญชี
                            </option>

                            <option value="มีสถานะบัญชี (12) - พักชำระหนี้ตามนโยบายของสมาชิก">
                              มีสถานะบัญชี (12) - พักชำระหนี้ตามนโยบายของสมาชิก
                            </option>

                            <option value="มีสถานะบัญชี (13) - พักชำระหนี้ตามนโยบายของรัฐ">
                              มีสถานะบัญชี (13) - พักชำระหนี้ตามนโยบายของรัฐ
                            </option>

                            <option
                              value="มีสถานะบัญชี (14) -
                              พักชำระหนี้เกษตรกรตามนโยบายของรัฐ"
                            >
                              มีสถานะบัญชี (14) -
                              พักชำระหนี้เกษตรกรตามนโยบายของรัฐ
                            </option>

                            <option
                              value="มีสถานะบัญชี (15) - ปกติ
                              (ไม่มีหนี้ค้างชำระหรือมีหนี้ค้างชำระไม่เกิน 90 วัน
                              ตามข้อตกลงหรือสัญญาประนีประนอมยอมความ)"
                            >
                              มีสถานะบัญชี (15) - ปกติ
                              (ไม่มีหนี้ค้างชำระหรือมีหนี้ค้างชำระไม่เกิน 90 วัน
                              ตามข้อตกลงหรือสัญญาประนีประนอมยอมความ)
                            </option>

                            <option value="มีสถานะบัญชี (20) - หนี้ค้างชำระเกิน 90 วัน">
                              มีสถานะบัญชี (20) - หนี้ค้างชำระเกิน 90 วัน
                            </option>

                            <option
                              value="มีสถานะบัญชี (21) - หนี้ค้างชำระเกิน 90 วัน
                              จากเหตุการณ์ไม่ปกติ"
                            >
                              มีสถานะบัญชี (21)-หนี้ค้างชำระเกิน 90 วัน
                              เนื่องจากได้รับผลกระทบจากสถานการณ์ไม่ปกติ
                            </option>

                            <option value="มีสถานะบัญชี (30) - อยู่ในกระบวนการทางกฎหมาย">
                              มีสถานะบัญชี (30) - อยู่ในกระบวนการทางกฎหมาย
                            </option>

                            <option
                              value="มีสถานะบัญชี (31) -
                              อยู่ระหว่างชำระหนี้ตามคำพิพากษาตามยอม"
                            >
                              มีสถานะบัญชี (31) -
                              อยู่ระหว่างชำระหนี้ตามคำพิพากษาตามยอม
                            </option>

                            <option
                              value="มีสถานะบัญชี (32) - ศาลพิพากษายกฟ้อง
                              (ขาดอายุความหรือเหตุอื่น)"
                            >
                              มีสถานะบัญชี (32)-ศาลพิพากษายกฟ้อง
                              เนื่องจากขาดอายุความหรือเหตุอื่นฯ
                            </option>

                            <option value="มีสถานะบัญชี (33) - ปิดบัญชีเนื่องจากตัดหนี้สูญ">
                              มีสถานะบัญชี (33) - ปิดบัญชีเนื่องจากตัดหนี้สูญ
                            </option>

                            <option
                              value="มีสถานะบัญชี (40) -
                              อยู่ระหว่างชำระสินเชื่อเพื่อปิดบัญชี"
                            >
                              มีสถานะบัญชี (40) -
                              อยู่ระหว่างชำระสินเชื่อเพื่อปิดบัญชี
                            </option>

                            <option value="มีสถานะบัญชี (41) - อยู่ระหว่างตรวจสอบรายการ">
                              มีสถานะบัญชี (41) - อยู่ระหว่างตรวจสอบรายการ
                            </option>

                            <option
                              value="มีสถานะบัญชี (42) - โอนหรือขายหนี้ที่ค้างชำระเกิน
                              90 วัน"
                            >
                              มีสถานะบัญชี (42) - โอนหรือขายหนี้ที่ค้างชำระเกิน
                              90 วัน
                            </option>

                            <option
                              value="มีสถานะบัญชี (43) -
                              โอนหรือขายหนี้และชำระหนี้เสร็จสิ้น"
                            >
                              มีสถานะบัญชี (43) -
                              โอนหรือขายหนี้และชำระหนี้เสร็จสิ้น
                            </option>

                            <option
                              value="มีสถานะบัญชี (44) -
                              โอนหรือขายหนี้ที่เป็นสถานะบัญชีปกติ"
                            >
                              มีสถานะบัญชี (44) -
                              โอนหรือขายหนี้ที่เป็นสถานะบัญชีปกติ
                            </option>

                            <option
                              value="มีสถานะบัญชี (51) - หยุดนำส่งข้อมูล
                              เนื่องจากมีการบอกเลิกสัญญา"
                            >
                              มีสถานะบัญชี (51) - หยุดนำส่งข้อมูล
                              เนื่องจากมีการบอกเลิกสัญญา
                            </option>

                            <option
                              value="มีสถานะบัญชี (52) - หนี้ค้างชำระเกิน 90 วัน
                              โดยยังไม่ได้ยื่นฟ้อง และหยุดนำส่งข้อมูล"
                            >
                              มีสถานะบัญชี (52) - หนี้ค้างชำระเกิน 90 วัน
                              โดยยังไม่ได้ยื่นฟ้อง และหยุดนำส่งข้อมูล
                            </option>

                            <option
                              value="มีสถานะบัญชี (53) - หนี้ค้างชำระเกิน 90 วัน
                              อยู่ในกระบวนการทางกฎหมาย และหยุดนำส่งข้อมูล"
                            >
                              มีสถานะบัญชี (53)-หนี้ค้างชำระเกิน 90 วัน
                              โดยอยู่ในกระบวนการทางกฎหมาย และหยุดนำส่งข้อมูล
                            </option>
                          </select>

                          {/* 🔹 จำนวนบัญชี */}

                          <input
                            type="number"
                            className="input-normal"
                            placeholder="กรอกจำนวนบัญชี"
                            value={acc.amount}
                            onChange={(e) =>
                              handleChange(index, "amount", e.target.value)
                            }
                          />

                          {/* 🔹 ปุ่มลบ */}
                          {index !== 0 && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleRemoveAccount(index)}
                              style={{
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* 🔹 ปุ่มเพิ่มรายการ */}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={handleAddAccount}
                        style={{
                          marginTop: "10px",
                          backgroundColor: "#022d7dff",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                      >
                        <FaPlus /> เพิ่มข้อมูล
                      </button>
                    </div>
                    <hr />
                    {/* 🔹 ส่วนที่ 3.2 เหตุผลประกอบคะแนนเครดิต */}
                    <div>
                      <div className="">3.2 เหตุผลประกอบคะแนนเครดิต</div>

                      {reasons.map((r, index) => (
                        <div
                          key={index}
                          className="credit-row"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "8px",
                          }}
                        >
                          {/* 🔹 แสดง select ถ้าไม่ใช่รายการใหม่ */}
                          {!r.isNew ? (
                            <select
                              className="input-normal"
                              value={r.reason}
                              onChange={(e) =>
                                handleChangeReason(index, e.target.value)
                              }
                            >
                              <option>
                                - เลือกเหตุผลประกอบคะแนนเครดิต ({index + 1}) -
                              </option>
                              <option>
                                00 :
                                ไม่พบประวัติสินเชื่อลูกค้าในรายงานข้อมูลเครดิต
                                (ไม่มีข้อมูลการเป็นหนี้หรือประวัติชำระหนี้ในระบบ)
                              </option>
                              <option>
                                {" "}
                                011 : ยอดหนี้ค้างเฉลี่ยต่อบัญชี
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างสูง
                              </option>
                              <option>012 : ไม่ได้ใช้งาน</option>
                              <option>
                                {" "}
                                013 : สัดส่วนยอดหนี้คงเหลือ ต่อวงเงิน
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างสูง
                              </option>
                              <option>
                                {" "}
                                014 : ยอดหนี้รวมคงค้าง
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างสูง
                              </option>
                              <option>
                                {" "}
                                015 : ประวัติข้อมูลเครดิตที่ดี
                                ที่ปรากฎในรายงานข้อมูลเครดิตจำกัด
                              </option>
                              <option>016 : ไม่ได้ใช้งาน</option>
                              <option>
                                {" "}
                                017 :
                                ยอดหนี้รวมคงค้างของบัญชีสินเชื่อแบบผ่อนชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                018 : วงเงินคงเหลือ
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างน้อย
                              </option>
                              <option>
                                {" "}
                                019 : ประวัติข้อมูลเครดิต
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างจำกัด
                              </option>
                              <option>
                                {" "}
                                020 :
                                ประวัติการค้างชำระของสินเชื่อเพื่อการเกษตรในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                021 : ประวัติสินเชื่อที่ดี
                                ที่ปรากฏในรายงานข้อมูลเครดิต ค่อนข้างสั้น
                              </option>
                              <option>
                                {" "}
                                022 : ยอดหนี้ที่ค้างชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                023 : ประวัติการค้างชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                024 : ยอดหนี้ของสินเชื่อประเภทการเกษตร
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>

                              <option>
                                {" "}
                                025 : ความหลากหลายของประเภทสินเชื่อ
                                ที่ปรากฏในรายงานข้อมูลเครดิตน้อย
                              </option>
                              <option>
                                {" "}
                                026 : ภาระสินเชื่อ ที่ปรากฏในรายงานข้อมูลเครดิต
                                ค่อนข้างสูง
                              </option>
                              <option>027 : ไม่ได้ใช้งาน</option>
                              <option>
                                {" "}
                                028 : การสืบค้นล่าสุด
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                029 : การสืบค้น ที่ปรากฏในรายงานข้อมูลเครดิต{" "}
                              </option>
                              <option>
                                {" "}
                                030 :
                                จำนวนบัญชีหรือสัดส่วนบัญชีสินเชื่อแบบผ่อนชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                031 : จำนวนบัญชีหรือสัดส่วนบัญชีที่เปิดล่าสุด
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>032 : ไม่ได้ใช้งาน</option>

                              <option>
                                {" "}
                                TT : ปัจจุบันค้างชำระเกิน 90 วัน
                                หรือมีสถานะอยู่ในกระบวนการทางกฎหมาย
                              </option>
                              <option>
                                {" "}
                                VV :
                                บัญชีอยู่ระหว่างตรวจสอบบัตรประจำตัวประชาชนถูกฉ้อฉล
                              </option>
                              <option>
                                {" "}
                                WW : บัญชีมีการโต้แย้ง
                                หรือขอตรวจสอบข้อมูลจากเจ้าของข้อมูล
                              </option>
                              <option>
                                {" "}
                                XX : ไม่มีบัญชี
                                แต่มีประวัติการถูกเรียกดูเพื่ออนุมัติสินเชื่อใหม่
                                มากกว่า หรือเท่ากับ 5 ครั้ง{" "}
                              </option>
                              <option>
                                {" "}
                                YY : ไม่มีบัญชี
                                แต่มีประวัติการถูกเรียกดูเพื่ออนุมัติสินเชื่อใหม่
                                น้อยกว่า 5 ครั้ง{" "}
                              </option>

                              <option>
                                {" "}
                                ZZ : ข้อมูลไม่เพียงพอต่อการให้คะแนนเครดิต{" "}
                              </option>
                            </select>
                          ) : (
                            // 🔹 input text ถ้าเป็นแถวที่เพิ่มใหม่
                            <select
                              className="input-normal"
                              value={r.reason}
                              onChange={(e) =>
                                handleChangeReason(index, e.target.value)
                              }
                            >
                              <option>
                                - เลือกเหตุผลประกอบคะแนนเครดิต ({index + 1}) -
                              </option>
                              <option>
                                00 :
                                ไม่พบประวัติสินเชื่อลูกค้าในรายงานข้อมูลเครดิต
                                (ไม่มีข้อมูลการเป็นหนี้หรือประวัติชำระหนี้ในระบบ)
                              </option>
                              <option>
                                {" "}
                                011 : ยอดหนี้ค้างเฉลี่ยต่อบัญชี
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างสูง
                              </option>
                              <option>012 : ไม่ได้ใช้งาน</option>
                              <option>
                                {" "}
                                013 : สัดส่วนยอดหนี้คงเหลือ ต่อวงเงิน
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างสูง
                              </option>
                              <option>
                                {" "}
                                014 : ยอดหนี้รวมคงค้าง
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างสูง
                              </option>
                              <option>
                                {" "}
                                015 : ประวัติข้อมูลเครดิตที่ดี
                                ที่ปรากฎในรายงานข้อมูลเครดิตจำกัด
                              </option>
                              <option>016 : ไม่ได้ใช้งาน</option>
                              <option>
                                {" "}
                                017 :
                                ยอดหนี้รวมคงค้างของบัญชีสินเชื่อแบบผ่อนชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                018 : วงเงินคงเหลือ
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างน้อย
                              </option>
                              <option>
                                {" "}
                                019 : ประวัติข้อมูลเครดิต
                                ที่ปรากฏในรายงานข้อมูลเครดิตค่อนข้างจำกัด
                              </option>
                              <option>
                                {" "}
                                020 :
                                ประวัติการค้างชำระของสินเชื่อเพื่อการเกษตรในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                021 : ประวัติสินเชื่อที่ดี
                                ที่ปรากฏในรายงานข้อมูลเครดิต ค่อนข้างสั้น
                              </option>
                              <option>
                                {" "}
                                022 : ยอดหนี้ที่ค้างชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                023 : ประวัติการค้างชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                024 : ยอดหนี้ของสินเชื่อประเภทการเกษตร
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>

                              <option>
                                {" "}
                                025 : ความหลากหลายของประเภทสินเชื่อ
                                ที่ปรากฏในรายงานข้อมูลเครดิตน้อย
                              </option>
                              <option>
                                {" "}
                                026 : ภาระสินเชื่อ ที่ปรากฏในรายงานข้อมูลเครดิต
                                ค่อนข้างสูง
                              </option>
                              <option>027 : ไม่ได้ใช้งาน</option>
                              <option>
                                {" "}
                                028 : การสืบค้นล่าสุด
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                029 : การสืบค้น ที่ปรากฏในรายงานข้อมูลเครดิต{" "}
                              </option>
                              <option>
                                {" "}
                                030 :
                                จำนวนบัญชีหรือสัดส่วนบัญชีสินเชื่อแบบผ่อนชำระ
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>
                                {" "}
                                031 : จำนวนบัญชีหรือสัดส่วนบัญชีที่เปิดล่าสุด
                                ที่ปรากฏในรายงานข้อมูลเครดิต
                              </option>
                              <option>032 : ไม่ได้ใช้งาน</option>

                              <option>
                                {" "}
                                TT : ปัจจุบันค้างชำระเกิน 90 วัน
                                หรือมีสถานะอยู่ในกระบวนการทางกฎหมาย
                              </option>
                              <option>
                                {" "}
                                VV :
                                บัญชีอยู่ระหว่างตรวจสอบบัตรประจำตัวประชาชนถูกฉ้อฉล
                              </option>
                              <option>
                                {" "}
                                WW : บัญชีมีการโต้แย้ง
                                หรือขอตรวจสอบข้อมูลจากเจ้าของข้อมูล
                              </option>
                              <option>
                                {" "}
                                XX : ไม่มีบัญชี
                                แต่มีประวัติการถูกเรียกดูเพื่ออนุมัติสินเชื่อใหม่
                                มากกว่า หรือเท่ากับ 5 ครั้ง{" "}
                              </option>
                              <option>
                                {" "}
                                YY : ไม่มีบัญชี
                                แต่มีประวัติการถูกเรียกดูเพื่ออนุมัติสินเชื่อใหม่
                                น้อยกว่า 5 ครั้ง{" "}
                              </option>

                              <option>
                                {" "}
                                ZZ : ข้อมูลไม่เพียงพอต่อการให้คะแนนเครดิต{" "}
                              </option>
                            </select>
                          )}

                          {/* 🔹 ปุ่มลบ — ห้ามแสดงบนแถวแรก */}
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveReason(index)}
                              style={{
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* 🔹 ปุ่มเพิ่มรายการใหม่ */}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={handleAddReason}
                        style={{
                          marginTop: "10px",
                          backgroundColor: "#022d7dff",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                      >
                        <FaPlus /> เพิ่มข้อมูล
                      </button>
                    </div>

                    <hr />
                    <div className="form-group">
                      <label>คำอธิบายเพิ่มเติม : </label>
                      <textarea
                        className="input-normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}

                {approval === "rejected" && (
                  <div className="form-sub">
                    <div className="section-block">
                      <div className="form-group">
                        <label>คำอธิบายเพิ่มเติม : </label>
                        <textarea
                          className="input-normal"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {approval === "pending" && (
                  <div className="form-sub">
                    <div className="form-group">
                      <label>หมายเหตุ</label>
                      <textarea
                        className="input-normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* 🔹 Footer */}
            <div className="popup-footer">
              <button className="btn-cancel-modern" onClick={closePopup}>
                ยกเลิก
              </button>
              <button
                className="btn-submit-modern"
                type="button"
                onClick={handleSubmit}
              >
                <BsSend style={{ marginRight: "6px" }} />
                รายงานผล
              </button>
            </div>
          </div>
        </div>
      )}
      {openFeeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setOpenFeeModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "360px",
              background: "#fff",
              borderRadius: "12px",
              padding: "16px 18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "8px",
                color: "#3056d2",
              }}
            >
              รายละเอียดข้อมูลที่ปรับแก้ {}
            </div>

            {/* Content */}
            <div
              style={{
                fontSize: "13px",
                color: "#333",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {openFeeModal || "-"}
            </div>

            {/* Footer */}
            <div style={{ textAlign: "right", marginTop: "14px" }}>
              <button
                onClick={() => setOpenFeeModal(null)}
                style={{
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  backgroundColor: "#e4e4e4",
                  cursor: "pointer",
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSetData_Litemain;
