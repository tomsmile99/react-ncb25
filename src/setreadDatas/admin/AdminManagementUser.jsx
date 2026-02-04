import React, { useRef, useState, useEffect, useContext } from "react";
import apiClient from "../../recoilstore/userStores";

import { FormControl, Form } from "react-bootstrap";
import { Base64 } from "js-base64";
import { useRecoilValue } from "recoil";
import { userToken } from "../../recoilstore/userStores";
import { MdSchedule } from "react-icons/md";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";

import { BsFiletypeDoc } from "react-icons/bs";

import Swal from "sweetalert2";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";

import { FaRegIdCard } from "react-icons/fa";
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

  return `${day} ${month} ${year}`;
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

  return `${day} ${month} ${year}`;
};

const AdminManagement = () => {
  const getstore = useRecoilValue(userToken);
  const _PerWP = Base64.decode(getstore.PerWP);

  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า

  const [query, setQuery] = useState(""); // ค้นหาชื่อ
  const [searchType, setSearchType] = useState(""); // name | citizen | form
  const [searchQuerySub, setSearchQuerySub] = useState(""); //ค้นหา  //คำนวณคะแนน

  const [approval, setApproval] = useState([]); // Object to group by section ID
  const [approvaltest, setApprovaltest] = useState([]); // Object to group by section ID

  const [probationaryEmployees, setProbationaryEmployees] = useState([]); // Object to group by section ID

  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup
  const [selectedItem, setSelectedItem] = useState(""); // เก็บข้อมูลแถวที่คลิก
  const [getDataShow, setgetDataShow] = useState([]); //แสดงข้อมูลเดี่ยว

  const [contractNumber, setContractNumber] = useState("");
  const [reasons, setReasons] = useState([]);

  const [editPhone, setEditPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState(""); // ค่าที่กดค้นหาจริง

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

  const getEmployeeDB_Admin = async (
    page,
    searchQuerySub = "",
    searchType = "",
  ) => {
    const params = {
      _page: page,
      search: searchQuerySub, // ⭐ ส่ง keyword
      searchKeyword: searchType, // ✅ ใช้ตัวนี้เท่านั้น
    };

    console.log(params);

    try {
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_AdminManagementUser`,
        { params },
      );

      const { status, sqlDataCustomers, totalPages } = data;

      if (status) {
        setProbationaryEmployees(sqlDataCustomers);
        setHasSearched(true);
        // setTotalPages(totalPages || 0);
      } else {
        setProbationaryEmployees([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setProbationaryEmployees([]);
      setTotalPages(0);
    }
  };

  const handleSearch = async () => {
    setHasSearched(true);
    setCurrentPage(1);
    await getEmployeeDB_Admin(1, query);
  };

  const handleReset = () => {
    setQuery("");
    setCurrentPage(1);
    setProbationaryEmployees([]); // ✅ เคลียร์ตาราง ไม่โหลดทั้งหมด
    setTotalPages(0);
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
        },
      );

      const { status, result, message } = data;

      if (status === 200) {
        // console.log("✅ ดึงข้อมูล PDF สำเร็จ");
        // console.log("📦 result จากหลังบ้าน:", result);
        setgetDataShow(result[0]);
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

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handleReasonChange = (e) => {
    const { value, checked } = e.target;

    setReasons((prev) => {
      if (checked) {
        // ✅ ติ๊ก → เพิ่มค่า
        return [...prev, value];
      } else {
        // ❌ เอาติ๊กออก → ลบค่า
        return prev.filter((item) => item !== value);
      }
    });
  };

  //   if (!base64String) {
  //     alert("ไม่พบข้อมูลไฟล์");
  //     return;
  //   }

  //   // base64String = "data:image/png;base64,....."
  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "px",
  //     format: "a4",
  //   });

  //   const imgProps = pdf.getImageProperties(base64String);

  //   // คำนวณขนาดรูปให้เหมาะกับ A4
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const ratio = imgProps.height / imgProps.width;
  //   const imgWidth = pageWidth - 40; // margin ซ้ายขวา 20px
  //   const imgHeight = imgWidth * ratio;

  //   pdf.addImage(base64String, imgProps.fileType, 20, 20, imgWidth, imgHeight);

  //   // เปิด PDF ในแท็บใหม่
  //   const pdfBlob = pdf.output("blob");
  //   const pdfURL = URL.createObjectURL(pdfBlob);

  //   window.open(pdfURL, "_blank");
  // };

  const openFileInNewTab = (relativePath) => {
    const base = import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB;
    window.open(`${base}/${relativePath}`, "_blank");
  };

  const reasonTextMap = {
    1: "เนื่องจากคุณสมบัติไม่ผ่านตามนโยบายของบริษัท",
    2: "เนื่องจากลูกค้ายกเลิกการขอสินเชื่อ",
    3: "เนื่องจาก ย้ายหน่วยทำสินเชื่อ",
    4: "เนื่องจากรายงาน ERROR / รายการไม่ถูกต้อง",
  };

  //Report DSR Page
  const handleSubmitReport = async () => {
    // ==========================
    // ❌ ดักกรณีผ่านอนุมัติแต่ไม่กรอกเลขที่สัญญา
    // ==========================
    if (approval === "approved" && !contractNumber.trim()) {
      setContractError(true);

      return; // ❌ หยุด ไม่ให้ยิง API
    }

    if (!editPhone || editPhone.length !== 10) {
      setPhoneError(true);
      return;
    }

    // ==========================
    // ✅ ผ่านเงื่อนไข ค่อยทำงานต่อ
    // ==========================

    // const payload = {
    //   ctmId: selectedItem,
    //   approval,
    //   reasons,
    //   contractNumber,
    //   CTM_phone: editPhone, // ✅ ใส่เบอร์โทร
    //   CTM_business_zone: getDataShow?.CTM_business_zone || "",
    // };

    let payload = null;
    if (approval === "approved") {
      payload = {
        ctmId: selectedItem,
        approval,
        CTM_phone: editPhone,
        reasons,
        contractNumber,
      };

      // console.log("payload approved:", payload);
    } else if (approval === "rejected") {
      payload = {
        ctmId: selectedItem,
        approval,
        contractNumber: "", // ✅ เซตเป็นค่าว่าง
        reasons,
        CTM_phone: editPhone,
        CTM_business_zone: getDataShow?.CTM_business_zone || "",
      };

      // console.log("payload not approved:", payload);
    } else {
      alert("กรุณาเลือกสถานะการแก้ไขรายงานผล");
      return;
    }

    // console.log(payload);
    // return;

    try {
      const res = await apiClient.post(
        "/api/insurances/datacustomers/updateDataApproveAdmin",
        { payload: JSON.stringify(payload) },
      );

      const { status, message } = res.data;

      if (status === 200) {
        console.log(message);
        // return;
        // console.log(smsDetail);
        // console.log(smsSmid);

        await getEmployeeDB_Admin();

        setShowPopup(false);
        setSelectedItem(null);

        Swal.fire({
          icon: "success",
          title: "ส่งรายงานผลสำเร็จ!",
          timer: 1800,
          showConfirmButton: false,
        });

        // window.location.assign("/Admin_Management");
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งรายงานผลได้",
      });
    }
  };

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

  const [contractError, setContractError] = useState(false);

  useEffect(() => {
    if (showPopup && getDataShow) {
      setEditPhone(getDataShow?.CTM_phone || "");
      setPhoneError(false);
    }
  }, [showPopup, getDataShow]);

  useEffect(() => {
    if (!hasSearched) return;
    getEmployeeDB_Admin(currentPage, query);
  }, [currentPage]);
  

  return (
    <div>
      <div className="pt-2">
        <div className="cartcustom p-3 shadow-sm">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            {/* --- เลือกประเภท --- */}
            <div>
              <div style={{ fontSize: 13, color: "#5b6b82", marginBottom: 4 }}>
                เลือกประเภทการค้นหา
              </div>

              <Form.Select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchQuerySub("");
                }}
                style={{ fontSize: 13, width: 180, height: 38 }}
              >
                <option value=""> - เลือกประเภท - </option>
                <option value="name">ชื่อลูกค้า</option>
                <option value="citizen">เลขบัตรประชาชน</option>
                <option value="form">เลขที่แบบฟอร์ม</option>
                <option value="branch">สาขา / หน่วย</option>
              </Form.Select>
            </div>

            {/* --- คำค้น --- */}
            <div>
              <div style={{ fontSize: 13, color: "#5b6b82", marginBottom: 4 }}>
                คำค้นหา
              </div>

              <InputGroup>
                <InputGroup.Text
                  style={{
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRight: "none",
                    borderRadius: "7px 0 0 7px",
                  }}
                >
                  <FiSearch style={{ color: "#888", fontSize: 16 }} />
                </InputGroup.Text>

                <FormControl
                  type="search"
                  disabled={!searchType}
                  placeholder={
                    !searchType
                      ? "กรุณาเลือกประเภทการค้นหา"
                      : searchType === "name"
                        ? "ค้นหาชื่อลูกค้า"
                        : searchType === "citizen"
                          ? "ค้นหาเลขบัตรประชาชน"
                          : "ค้นหาเลขที่แบบฟอร์ม"
                  }
                  value={searchQuerySub}
                  onChange={(e) => setSearchQuerySub(e.target.value)}
                  style={{
                    borderRadius: "0 7px 7px 0",
                    fontSize: 13,
                    border: "1px solid #e0e0e0",
                    borderLeft: "none",
                    boxShadow: "none",
                    width: 320,
                  }}
                />
              </InputGroup>
            </div>

            {/* --- ปุ่มค้นหา --- */}
            <button
              className="btn btn-primary"
              disabled={!searchType || !searchQuerySub}
              onClick={() => {
                getEmployeeDB_Admin(1, searchQuerySub, searchType); // ✅ ส่งตรง
              }}
            >
              ค้นหา
            </button>

            {/* --- ✅ ปุ่มล้าง --- */}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchType("");
                setSearchQuerySub("");
                setSearchKeyword("");
                getEmployeeDB_Admin(1); // โหลดข้อมูลทั้งหมดกลับมา
              }}
            >
              ล้าง
            </button>
          </div>

          {!hasSearched ? (
            <center>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              >
                <img
                  src="/Documents-amico.png"
                  className="brand-image pt-2"
                  style={{ height: 250, width: "auto" }}
                  alt="loop-color"
                />
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  ยังไม่มีรายการที่แสดงในขณะนี้
                </div>
                <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                  กรุณากรอกข้อมูลในช่องค้นหา
                </div>
              </div>
            </center>
          ) : probationaryEmployees.length === 0 ? (
            <center>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              >
                <img
                  src="/Documents-amico.png"
                  className="brand-image pt-2"
                  style={{ height: 250, width: "auto" }}
                  alt="loop-color"
                />
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  ยังไม่มีรายการที่แสดงในขณะนี้
                </div>
                <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                  กรุณากรอกข้อมูลในช่องค้นหา
                </div>
              </div>
            </center>
          ) : (
            <>
              <div className="table-responsive pt-2">
                <table className="table table-hover table-sm">
                  <thead className="custom-buttonTBs">
                    <tr>
                      <th className="text-center" style={{ width: "2%" }}>
                        ลำดับ
                      </th>
                      <th className="text" style={{ width: "10%" }}>
                        เลขที่แบบฟอร์ม
                      </th>
                      <th className="text" style={{ width: "10%" }}>
                        ชื่อ-นาม สกุลลูกค้า
                      </th>

                      <th className="text" style={{ width: "8%" }}>
                        เลขบัตรประชาชน
                      </th>
                      <th className="text" style={{ width: "10%" }}>
                        ผู้ขอสืบค้น
                      </th>
                        <th className="text" style={{ width: "7%" }}>
                        วันที่ยื่นขอสืบค้น
                      </th>
                      <th className="text" style={{ width: "7%" }}>
                        สาขา/หน่วย
                      </th>
                      <th className="text" style={{ width: "8%" }}>
                        เขต
                      </th>
                      <th className="text" style={{ width: "4%" }}>
                        ภาค
                      </th>
                    

                      <th className="text" style={{ width: "5%" }}>
                        วัน/เวลา ที่บันทึก
                      </th>

                      <th className="text" style={{ width: "8%" }}>
                        เอกสารประกอบ
                      </th>

                      <th className="text-center" style={{ width: "3%" }}>
                        รายงานผล
                      </th>
                      <th className="text" style={{ width: "10%" }}>
                        ผู้รายงานผลตรวจ
                      </th>

                      {/* <th className="text" style={{ width: "5%" }}>
                        วันที่รายงานผลตรวจ
                      </th> */}

                      <th className="text-center" style={{ width: "10%" }}>
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {probationaryEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="text-center text-muted py-4"
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "40px 0",
                              color: "#6c757d",
                              fontSize: "18px",
                            }}
                          >
                            <img
                              src="/Documents-amico.png"
                              className="brand-image pt-2"
                              style={{ height: 250, width: "auto" }}
                              alt="loop-color"
                            />
                            <div
                              style={{ fontWeight: 600, marginBottom: "4px" }}
                            >
                              ไม่พบข้อมูลในระบบ
                            </div>
                            <div style={{ fontSize: "14px", color: "#adb5bd" }}>
                              ยังไม่มีรายการที่แสดงในขณะนี้
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {probationaryEmployees.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{item.CTM_form_number}</td>
                            <td>
                              <div
                                style={{ fontWeight: 600, color: "#0f3d78" }}
                              >
                                {item.CTM_title_name}
                                {item.CTM_firstname} {item.CTM_lastname}
                              </div>
                              <div
                                style={{ fontSize: "12px", color: "#6c757d" }}
                              >
                                {item.CTM_phone
                                  ? `${item.CTM_phone.slice(
                                      0,
                                      3,
                                    )}-${item.CTM_phone.slice(3)}`
                                  : "-"}
                              </div>
                              {/* <div
                                style={{ fontSize: "12px", color: "#6c757d" }}
                              >
                                วัน/เดือน/ปี เกิด:{" "}
                                {convertToThaiDate(item.CTM_birthdate)}
                              </div> */}
                            </td>
                            <td>
                             <div className="citizen-cell">
                            {item.CTM_Old_status === "1" ? (
                              <span className="citizen-badge-old">
                                {item.CTM_citizen_id}
                              </span>
                            ) : (
                              <span>{item.CTM_citizen_id}</span>
                            )}
                          </div>
                            </td>
                            
                            <td>
                              <div>{item.CTM_recorder_fullname}</div>{" "}
                               <div
                                style={{ fontSize: "12px", color: "#6c757d" }}
                              >
                             {item.CTM_position || "-"}
                              </div>
                            </td>
                            <td>{convertToThaiDate(item.date_upEvidence)}</td>
                            <td>
                              <div
                              
                              >
                               {item.CTM_business_zone || "-"}
                              </div>
                            </td>
                            <td>
                              <div
                              
                              >
                                {item.CTM_branch || "-"}
                              </div>
                            </td>{" "}
                            <td>
                              <div
                              
                              >
                                {item.CTM_business_region || "-"}
                              </div>
                            </td>
                            <td>{convertToThaiDate(item.CTM_created_at)}</td>
                            <td className="text">
                              <button
                                className="doc-btn doc-consent mr-1"
                                onClick={() =>
                                  openFileInNewTab(
                                    `img/consent/${item.Form_consent_document}`,
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
                                    `img/application/${item.Form_application_document}`,
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
                                    `img/idcard/${item.Form_idcard_photo}`,
                                  )
                                }
                                title="รูปบัตรประชาชน"
                              >
                                <FaRegIdCard />
                              </button>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-icon"
                                title="รายงานผล"
                                onClick={() => {
                                  if (item.Form_verification_status === "Lv0" ) {
                                    Swal.fire({
                                      icon: "info",
                                      title: "รายการนี้รอการตรวจสอบ",
                                      text: "ยังไม่ได้รับการตรวจสอบข้อมูลเครดิต",
                                      confirmButtonText: "ตกลง",
                                      confirmButtonColor: "#495057",
                                    });
                                    return;
                                  }

                                  if (item.Form_verification_status === "Lv1E" ) {
                                    Swal.fire({
                                      icon: "info",
                                      title: "อยู่ระหว่างการแก้ไข",
                                      text: "ยังไม่ได้รับการตรวจสอบข้อมูลเครดิต",
                                      confirmButtonText: "ตกลง",
                                      confirmButtonColor: "#495057",
                                    });
                                    return;
                                  }
                                  

                                  if (item.Form_verification_status === "Lv1N" ) {
                                    Swal.fire({
                                      icon: "info",
                                      title: "รายการนี้ถูกยกเลิก",
                                      text: "ยังไม่ได้รับการตรวจสอบข้อมูลเครดิต",
                                      confirmButtonText: "ตกลง",
                                      confirmButtonColor: "#495057",
                                    });
                                    return;
                                  }
                                  handleView(item);
                                }}
                              >
                                <AiOutlineFileSearch /> 
                              </button>
                            </td>
                            <td>
                              <center>
                               <span style={{ fontSize : "12px" }}>{item.Form_Name_Inspector || "-"}{" "}</span> 
                                <div
                                  style={{ fontSize: "12px", color: "#6c757d" }}
                                >
                                  วันที่ตรวจ:{" "}
                                  {item.Form_date_inspertor ? (
                                    convertToThaiDate(item.Form_date_inspertor)
                                  ) : (
                                    <center>
                                      <span style={{ fontWeight: 600 }}>
                                        {item.Form_date_inspertor || "-"}
                                      </span>
                                    </center>
                                  )}
                                </div>
                              </center>
                            </td>
                            {/* <td>{item.Form_Inspector}</td> */}
                            <td className="text-center">
                              <center>

                                {item.Form_verification_status == "Lv1E" && (
                                  <center>
                                    <span
                                      className="status-badge status-wait"
                                      // onClick={() =>
                                      //   // handleStatusClick(item.CTM_form_number)
                                      // }
                                      style={{ cursor: "pointer" }}
                                    >
                                      รอการแก้ไขข้อมูล
                                    </span>
                                  </center>
                                )}

                                
                                {item.Form_verification_status == "Lv0" && (
                                  <center>
                                    <span
                                      className="status-badge status-wait"
                                      // onClick={() =>
                                      //   // handleStatusClick(item.CTM_form_number)
                                      // }
                                      style={{ cursor: "pointer" }}
                                    >
                                      รอเจ้าหน้าที่ตรวจสอบเครดิต
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

                                {item.Form_verification_status == "Lv1" &&
                                  item.Form_verification_status != "Lv1N" && (
                                    <center>
                                      <span
                                        className="status-badge status-pass"
                                        // onClick={() =>
                                        //   // handleStatusClick(item.CTM_form_number)
                                        // }
                                        style={{ cursor: "pointer" }}
                                      >
                                        ตรวจแล้ว
                                      </span>
                                    </center>
                                  )}

                                {item.Form_Approval_results === "approved" && (
                                  <span className="status-badge status-pass">
                                    ผ่านการอนุมัติ รหัสสัญญา{" "}
                                    {item.Form_Contract_number}
                                  </span>
                                )}

                                {item.Form_Approval_results === "rejected" && (
                                  <>
                                    <span className="status-badge status-fail">
                                      ไม่ผ่านการอนุมัติ <br />
                                      {/* ✅ สถานะการส่ง SMS */}
                                      {item.Form_status_SMS === "OK" ? (
                                        <span className="status-badge status-success ml-2">
                                          SMS ส่งสำเร็จแล้ว
                                        </span>
                                      ) : item.Form_status_SMS === "ERROR" ? (
                                        <span className="status-badge status-danger ml-2">
                                          SMS ส่งไม่สำเร็จ
                                        </span>
                                      ) : (
                                        <span className="status-badge  status-danger  ml-2">
                                          ไม่ส่ง SMS
                                        </span>
                                      )}
                                    </span>
                                  </>
                                )}
                              </center>
                              <div
                                style={{ fontSize: "12px", color: "#6c757d" }}
                              >
                                {item.Form_note_approval}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div style={{ height: "500px" }}></div>
          {/* )} */}
        </div>
      </div>

      {/* 🔹 Popup แสดงข้อมูล */}
      {showPopup && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3
              className="card-title"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#0f3d78", // น้ำเงินสุภาพมาตรฐาน SAK
                marginBottom: "10px",
              }}
            >
              <FaFileSignature
                style={{ color: "#023672ff", fontSize: "18px" }}
              />
              แก้ไขข้อมูล
            </h3>
            <div className="layout-wrapper3">
              {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}
              <div className="card recorder-card">
                <div className="card-title1" style={{ fontSize: "14px" }}>
                  ส่วนที่ 1 : รายละเอียดผู้ขอสืบค้น
                </div>

                <div className="rec-profile-row">
                  <div className="rec-info">
                    <div className="">
                      <strong>แบบฟอร์มเลขที่ : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_form_number || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>ผู้ขอสืบค้น : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_recorder_fullname || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>ตำแหน่ง : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_position || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>สาขา/หน่วย : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_branch || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>วัน/เวลาที่ ยื่นขอสืบค้น : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {convertToThaiDate(getDataShow?.CTM_created_at) || "-"}
                      </span>
                    </div>

                    <div className="pt-1">
                      <strong>เอกสารประกอบ </strong>
                      <ul
                        style={{
                          paddingLeft: "18px",
                          lineHeight: "1.8",
                        }}
                      >
                        <li>
                          <span
                            style={{
                              color: "#4a90e2",
                              cursor: "pointer",
                              fontWeight: "100",
                            }}
                            onClick={() =>
                              openFileInNewTab(
                                `img/consent/${getDataShow?.Form_consent_document}`,
                              )
                            }
                          >
                            หนังสือให้ความยินยอมเปิดเผยข้อมูลส่วนตัว
                          </span>
                        </li>

                        <li>
                          <span
                            style={{
                              color: "#4a90e2",
                              cursor: "pointer",
                              fontWeight: "100",
                            }}
                            onClick={() =>
                              openFileInNewTab(
                                `img/application/${getDataShow?.Form_application_document}`,
                              )
                            }
                          >
                            ใบสมัครขอสินเชื่อ
                          </span>
                        </li>

                        <li>
                          <span
                            style={{
                              color: "#4a90e2",
                              cursor: "pointer",
                              fontWeight: "100",
                            }}
                            onClick={() =>
                              openFileInNewTab(
                                `img/idcard/${getDataShow?.Form_idcard_photo}`,
                              )
                            }
                          >
                            สำเนาบัตรประชาชน
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card recorder-card">
                <div className="card-title2" style={{ fontSize: "14px" }}>
                  ส่วนที่ 2 : ข้อมูลลูกค้า
                </div>

                <div className="rec-profile-row">
                  <div className="rec-info">
                    <div className="">
                      <strong>ชื่อ - นามสกุลลูกค้า : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_title_name}
                        {getDataShow?.CTM_firstname} {getDataShow?.CTM_lastname}
                      </span>
                    </div>

                    <div className="">
                      <strong>วัน/เดือน/ปีเกิด : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {convertToThaiDate1(getDataShow?.CTM_birthdate) || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>หมายเลขบัตรประชาชน : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_citizen_id || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>หมายเลขโทรศัพท์ : </strong>

                      <input
                        className={`input-normal ${
                          phoneError ? "input-error" : ""
                        }`}
                        style={{ width: "220px", marginLeft: "8px" }}
                        value={editPhone}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setEditPhone(value);
                          if (value.length === 10) setPhoneError(false);
                        }}
                        placeholder="กรอกเบอร์โทร 10 หลัก"
                        maxLength={10}
                        inputMode="numeric"
                      />

                      {phoneError && (
                        <small style={{ color: "#e5533d", marginLeft: "8px" }}>
                          กรุณากรอกเบอร์โทรให้ครบ 10 หลัก
                        </small>
                      )}
                    </div>

                    <div className="">
                      <strong>ประเภทสินเชื่อที่ลูกค้าสมัคร : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.LTNL_Name || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>วงเงินขอสินเชื่อ : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.Form_loan_amount
                          ? Number(
                              getDataShow.Form_loan_amount,
                            ).toLocaleString()
                          : "-"}{" "}
                        บาท
                      </span>
                    </div>
                    <div className="">
                      <strong>ประเภทลูกค้า : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CMTN_Name || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card recorder-card">
                <div className="card-title3" style={{ fontSize: "14px" }}>
                  ส่วนที่ 3 : ผู้รายงานผลการตรวจสอบข้อมูลเครดิต (NCB)
                </div>

                <div className="rec-profile-row">
                  <div className="rec-info">
                    <div className="rec-row">
                      <strong>สรุปผลการรายงาน :</strong>

                      <center>
                        {getDataShow?.Form_verification_status === "Lv1" && (
                          <span
                            className="status-badge status-wait"
                            style={{ cursor: "pointer" }}
                          >
                            รอรายงานผลการให้สินเชื่อ
                          </span>
                        )}
                        {getDataShow?.Form_verification_status === "Lv2" && (
                          <span
                            className="status-badge status-pass"
                            style={{ cursor: "pointer" }}
                          >
                            ตรวจแล้ว
                          </span>
                        )}
                        {getDataShow?.Form_verification_status === "Lv3" && (
                          <span
                            className="status-badge status-cancel"
                            style={{ cursor: "pointer" }}
                          >
                            ยกเลิก
                          </span>
                        )}
                      </center>
                    </div>

                    <div className="rec-row">
                      <strong>รายละเอียดเพิ่มเติม:</strong>
                      {getDataShow?.CMTN_Name}
                    </div>
                    <hr />
                    <div className="rec-row">
                      <strong>ผู้รายงานผล :</strong>
                      {getDataShow?.Form_Name_Inspector}
                    </div>

                    <div className="rec-row">
                      <strong>ตำแหน่ง :</strong>
                      {getDataShow?.Form_Name_Positon}
                    </div>

                    <div className="rec-row">
                      <strong>วัน/เวลาที่ รายงานผล :</strong>
                      {convertToThaiDate(getDataShow?.Form_date_inspertor)}
                    </div>

                    <div className="rec-row pt-2">
                      <strong>
                        รายงานผลการตรวจสอบข้อมูลเครดิต :{" "}
                        <button
                          className="btn-icon"
                          onClick={() =>
                            handleViewModel(getDataShow?.CTM_form_number)
                          }
                        >
                          <AiOutlineFileSearch />
                        </button>
                      </strong>
                      {/* {getDataShow?.CMTN_Name } */}
                    </div>
                  </div>
                </div>
              </div>
              {/* 🔹 การ์ดที่ 1 : รายละเอียดผู้บันทึก */}
              <div className="card recorder-card">
                <div className="card-title4" style={{ fontSize: "14px" }}>
                  ส่วนที่ 4 : เลือกสถานะการอนุมัติสินเชื่อ
                </div>

                <form className="approval-form">
                  <div className="form-group">
                    <label className="form-label">
                      ผลการอนุมัติสินเชื่อ <span className="required">*</span> :
                    </label>

                    <div className="radio-group">
                      <label
                        className="radio-option mr-3"
                        style={{ fontSize: "14px" }}
                      >
                        <input
                          type="radio"
                          name="approval"
                          value="approved"
                          style={{ marginRight: 12 }}
                          checked={approval === "approved"}
                          onChange={() => {
                            setApproval("approved");
                            setReasons([]); // ✅ ล้างเหตุผลทันที
                          }}
                        />
                        <span className="custom-radio approved"></span>
                        ผ่านการอนุมัติ
                      </label>

                      <label
                        className="radio-option"
                        style={{ fontSize: "14px" }}
                      >
                        <input
                          type="radio"
                          name="approval"
                          value="rejected"
                          style={{ marginRight: 12 }}
                          checked={approval === "rejected"}
                          onChange={() => {
                            setApproval("rejected");
                            setContractNumber("");
                          }}
                        />
                        <span className="custom-radio rejected"></span>
                        ไม่ผ่านการอนุมัติ
                      </label>
                    </div>
                  </div>
                  {/* ✅ แสดงรายการเหตุผลเมื่อเลือก "ไม่ผ่าน" */}
                  {approval === "rejected" && (
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        background: "#f9fafc",
                        width: "fit-content",
                      }}
                    >
                      <p
                        style={{
                          marginBottom: "6px",
                          fontWeight: 600,
                          color: "red",
                        }}
                      >
                        โปรดเลือกเหตุผลที่ไม่ผ่าน * :
                      </p>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="1"
                          onChange={handleReasonChange}
                          checked={reasons.includes("1")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          1. เนื่องจากคุณสมบัติไม่ผ่านตามนโยบายของบริษัท
                        </span>
                      </label>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="2"
                          onChange={handleReasonChange}
                          checked={reasons.includes("2")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          2. เนื่องจากลูกค้ายกเลิกการขอสินเชื่อ
                        </span>
                      </label>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="3"
                          onChange={handleReasonChange}
                          checked={reasons.includes("3")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          3. เนื่องจาก ย้ายหน่วยทำสินเชื่อ
                        </span>
                      </label>

                      <label style={{ display: "block", marginBottom: "4px" }}>
                        <input
                          type="checkbox"
                          value="4"
                          onChange={handleReasonChange}
                          checked={reasons.includes("4")}
                        />
                        <span style={{ marginLeft: "6px" }}>
                          4. เนื่องจากรายงาน ERROR / รายการไม่ถูกต้อง
                        </span>
                      </label>
                    </div>
                  )}

                  {/* ✅ ตรวจสอบผลลัพธ์ */}
                  {approval === "rejected" && reasons.length > 0 && (
                    <div style={{ marginTop: "6px" }}>
                      <strong>เหตุผลที่เลือก:</strong>
                      <ol
                        style={{
                          marginTop: "6px",
                          paddingLeft: "18px",
                          color: "#c03300ff",
                        }}
                      >
                        {reasons.map((r, i) => (
                          <li key={i} style={{ marginBottom: "4px" }}>
                            {reasonTextMap[r]}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {approval === "approved" && (
                    <div className="form-group">
                      <div className="form-sub">
                        <div className="form-group">
                          <label>
                            เลขที่สัญญา
                            <span style={{ color: "#e5533d", marginLeft: 4 }}>
                              *
                            </span>
                          </label>

                          <input
                            className={`input-normal ${
                              contractError ? "input-error" : ""
                            }`}
                            value={contractNumber}
                            onChange={(e) => {
                              // ✅ เอาเฉพาะตัวเลข และจำกัดไม่เกิน 10 หลัก
                              const value = e.target.value
                                .replace(/[^a-zA-Z0-9]/g, "") // ❌ ตัดอักขระพิเศษ
                                .slice(0, 10); // จำกัด 10 ตัว

                              setContractNumber(value);
                              setContractError(false); // พอพิมพ์แล้วล้าง error
                            }}
                            placeholder="กรอกเลขที่สัญญา (10 หลัก)"
                            inputMode="numeric"
                            maxLength={10}
                          />

                          {contractError && (
                            <small style={{ color: "#e5533d" }}>
                              กรุณากรอกเลขที่สัญญา
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* 🔹 Footer ปุ่มปิด */}
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {/* ปุ่มยกเลิก */}
              <button
                className="btn-cancel-modern"
                onClick={() => {
                  setApproval("");
                  setReasons([]); // (ถ้าต้องการล้างเหตุผลด้วย)
                  closePopup();
                }}
              >
                ยกเลิก
              </button>

              {/* ปุ่มส่งข้อมูล */}
              <button
                className="btn-submit-modern"
                style={{
                  background: "#1296a7", // เขียวเข้มสุภาพ
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 18px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onClick={handleSubmitReport}
              >
                <BsSend /> รายงานผล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
