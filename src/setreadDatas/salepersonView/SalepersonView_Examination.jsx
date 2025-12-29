import React, { useRef, useState, useEffect, useContext } from "react";
import apiClient from "../../recoilstore/userStores";

import html2pdf from "html2pdf.js";
import { MdTouchApp } from "react-icons/md";

import { Base64 } from "js-base64";
import { useRecoilValue } from "recoil";
import { userToken } from "../../recoilstore/userStores";
import { MdSchedule } from "react-icons/md";
import { FaSearch, FaSyncAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BsFiletypeDoc } from "react-icons/bs";
import { jsPDF } from "jspdf";
import { IoMdPrint } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa6";
import Swal from "sweetalert2";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import Pagination from "../../component/Pagination";
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

const SalepersonView_Examination = () => {
  const getstore = useRecoilValue(userToken);
  const _PerWP = Base64.decode(getstore.PerWP);

  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 3; // จำนวนรายการต่อหน้า

  const [query, setQuery] = useState(""); // ค้นหาชื่อ

  const [approval, setApproval] = useState([]); // Object to group by section ID
  const [approvaltest, setApprovaltest] = useState([]); // Object to group by section ID

  const [probationaryEmployees, setProbationaryEmployees] = useState([]); // Object to group by section ID

  const [showPopup, setShowPopup] = useState(false); // เปิด/ปิด popup
  const [selectedItem, setSelectedItem] = useState(""); // เก็บข้อมูลแถวที่คลิก
  const [getDataShow, setgetDataShow] = useState([]); //แสดงข้อมูลเดี่ยว
  const [description, setDescription] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [reasons, setReasons] = useState([]);

  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [getDataShowPdf, setgetDataShowPdf] = useState({});
  const pdfRef = useRef();

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

  const getEmployeeDB_Admin = async (currentPage, searchQuery) => {
    const params = {
      page: currentPage, // หมายเลขหน้าปัจจุบัน
      limit, // จำนวนรายการต่อหน้า
      _PerWP: _PerWP,
    };

    try {
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_AdminLv1`,
        {
          params,
        }
      );

      const { status, sqlDataCustomers, totalPages } = data;
      if (status) {
        setProbationaryEmployees(sqlDataCustomers);
        // console.log("sd");
        setTotalPages(totalPages); // ตั้งค่าจำนวนหน้าทั้งหมด
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
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
        console.log("📦 result จากหลังบ้าน:", result);
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

  // const handleReasonChange = async (event) => {
  //   const { value, checked } = event.target;

  //   if (checked) {
  //     setReasons([...reasons, value]);

  //     // 🚀 ถ้าเลือกเหตุผลข้อที่ 1 → ส่ง SMS อัตโนมัติ
  //     if (value === "คุณสมบัติไม่ผ่านตามนโยบาย") {
  //       await sendRejectSMS();
  //     }
  //   } else {
  //     setReasons(reasons.filter((r) => r !== value));
  //   }
  // };
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

  //SMS
  const sendRejectSMS = async () => {
    const phone = getDataShow?.CTM_phone;

    if (!phone) {
      console.error("ไม่พบเบอร์โทรศัพท์ลูกค้า");
      return;
    }

    const message = `บริษัทฯ ไม่สามารถอนุมัติสินเชื่อให้ท่านได้ เป็นผลจากเกณฑ์พิจารณาของบริษัทเท่านั้น ไม่เกี่ยวข้องกับข้อมูลเครดิตบูโร สอบถาม ${
      getDataShow?.CTM_business_zone || "ที่ท่านทำการ"
    }`;

    alert(getDataShow?.CTM_business_zone);
    try {
      // const res = await apiClient.post("/sms/send", {
      //   phone: phone,
      //   message: message,
      //   sender: "SMSMKT.COM",
      //   campaign_name: "ตรวจสอบข้อมูลเครดิตลูกค้า",
      // });

      console.log("ส่ง SMS สำเร็จ!", res.data);
    } catch (err) {
      console.error("ส่ง SMS ไม่สำเร็จ", err);
    }
  };

  const navigate = useNavigate();

  // const openImageBase64AsPDF = (base64String) => {
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
        setgetDataShowPdf(result[0]);

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

  //Report DSR Page
  const handleSubmitReport = async () => {
    // ==========================
    // ❌ ดักกรณีผ่านอนุมัติแต่ไม่กรอกเลขที่สัญญา
    // ==========================
    if (approval === "approved" && !contractNumber.trim()) {
      setContractError(true);

      return; // ❌ หยุด ไม่ให้ยิง API
    }

    // ==========================
    // ✅ ผ่านเงื่อนไข ค่อยทำงานต่อ
    // ==========================

    const payload = {
      ctmId: selectedItem,
      approval,
      reasons,
      contractNumber,
      CTM_phone: getDataShow?.CTM_phone || "", // ✅ ใส่เบอร์โทร
      CTM_business_zone: getDataShow?.CTM_business_zone || "",
    };
    // console.log(payload);
    // return

    try {
      const res = await apiClient.post(
        "/api/insurances/datacustomers/updateDataApprove",
        { payload: JSON.stringify(payload) }
      );

      const { status, statusSms, smsDetail, smsSmid } = res.data;

      if (status === 200) {
        // console.log(statusSms);
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

        window.location.assign("/Sale_ExaminationCredit");
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

  const validateApproval = () => {
    if (approval === "approved" && !contractNumber.trim()) {
      setContractError(true);

      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกเลขที่สัญญา ก่อนบันทึกผลผ่านการอนุมัติ",
        confirmButtonText: "ตกลง",
      });

      return false;
    }

    return true;
  };

  useEffect(() => {
    getEmployeeDB_Admin(currentPage);
  }, [currentPage]);

  return (
    <div>
      <div className="pt-2">
        <div className="cartcustom p-3 shadow-sm">
          <div className="table-responsive pt-2">
            <table className="table table-hover table-sm">
              <thead className="custom-buttonTBs">
                <tr>
                  <th className="text-center" style={{ width: "2%" }}>
                    ลำดับ {getDataShow?.CTM_business_zone}
                  </th>
                  <th className="text" style={{ width: "8%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  <th className="text" style={{ width: "15%" }}>
                    ชื่อ-นาม สกุลลูกค้า
                  </th>
                  <th className="text" style={{ width: "7%" }}>
                    เบอร์โทรศัพท์
                  </th>

                  <th className="text" style={{ width: "15%" }}>
                    ผู้บันทึกข้อมูล
                  </th>

                  <th className="text" style={{ width: "10%" }}>
                    วัน/เวลา ที่บันทึก
                  </th>

                  <th className="text" style={{ width: "8%" }}>
                    เอกสารประกอบ
                  </th>
                  <th className="text-center" style={{ width: "3%" }}>
                    หนังสือยินยอม
                  </th>
                  <th className="text-center" style={{ width: "3%" }}>
                    รายงานผล
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    ผู้รายงานผลตรวจ
                  </th>

                  <th className="text" style={{ width: "5%" }}>
                    วัน/เวลา ที่รายงานผลตรวจ
                  </th>

                  <th className="text-center" style={{ width: "20%" }}>
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody>
                {probationaryEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted py-4">
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
                        />{" "}
                        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
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
                          <div style={{ fontWeight: 600, color: "#0f3d78" }}>
                            {item.CTM_title_name}
                            {item.CTM_firstname} {item.CTM_lastname}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                            เลขบัตรประชาชน: {item.CTM_citizen_id || "-"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                            วัน/เดือน/ปี เกิด:{" "}
                            {convertToThaiDate(item.CTM_birthdate)}
                          </div>
                        </td>
                        <td>
                          {item.CTM_phone
                            ? `${item.CTM_phone.slice(
                                0,
                                3
                              )}-${item.CTM_phone.slice(3)}`
                            : "-"}
                        </td>
                        <td>
                          <div>{item.CTM_recorder_fullname}</div>
                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                            ตำแหน่ง: {item.CTM_position || "-"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                            สาขา/หน่วย: {item.CTM_branch || "-"}
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
                        <td className="text-center">
                          <button
                            className="btn-icon"
                            onClick={() => handleDownloadPDF(item.CTM_Idnumber)}
                            title="ฟอร์มหนังสือยินยอม"
                          >
                            <IoMdPrint />
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn-icon"
                            title="รายงานผล"
                            onClick={() => {
                              if (item.Form_verification_status !== "Lv1") {
                                Swal.fire({
                                  icon: "info",
                                  title: "อยู่ระหว่างการตรวจสอบ",
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
                          {" "}
                          <center>{item.Form_Name_Inspector || "-"} </center>
                        </td>
                        <td>
                          {item.Form_date_inspertor ? (
                            convertToThaiDate(item.Form_date_inspertor)
                          ) : (
                            <center>
                              <span style={{ fontWeight: 600 }}>
                                {item.Form_date_inspertor || "-"}
                              </span>
                            </center>
                          )}
                        </td>
                        {/* <td>{item.Form_Inspector}</td> */}

                        {/* <td>
                      <center>-</center>
                    </td> */}
                        <td className="text-center">
                          <center>
                            {item.Form_verification_status === "Lv1" && (
                              <span
                                className="status-badge status-wait-strong smooth-blink-strong "
                                onClick={() =>
                                  handleStatusClick(item.CTM_form_number)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                รอรายงานผลการให้สินเชื่อ
                                {/* <div > <MdTouchApp className="hand-tap-icon" /></div>    */}
                              </span>
                            )}

                            {item.Form_verification_status === "Lv0" && (
                              <span
                                className="status-badge status-chk"
                                style={{ cursor: "pointer" }}
                              >
                                <MdSchedule
                                  className="clock-animate"
                                  style={{ fontSize: "18px" }}
                                />
                                รอการตรวจสอบ
                              </span>
                            )}
                          </center>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {/* {totalPages > 1 ? (
            <div className="card-footer clearfix">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                // onPageChange={handlePageChange}
              />
            </div>
          ) : ( */}
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
              สรุปผลการอนุมัติสินเชื่อ
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
                                `img/consent/${getDataShow?.Form_consent_document}`
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
                                `img/application/${getDataShow?.Form_application_document}`
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
                                `img/idcard/${getDataShow?.Form_idcard_photo}`
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
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.CTM_phone || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>ประเภทสินเชื่อที่ลูกค้าสมัคร : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.LTN_Name || "-"}
                      </span>
                    </div>

                    <div className="">
                      <strong>วงเงินขอสินเชื่อ : </strong>
                      <span style={{ fontWeight: "100" }}>
                        {getDataShow?.Form_loan_amount
                          ? Number(
                              getDataShow.Form_loan_amount
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
                      <label className="radio-option mr-3">
                        <input
                          type="radio"
                          name="approval"
                          value="approved"
                          style={{ marginRight: 12 }}
                          checked={approval === "approved"}
                          onChange={() => setApproval("approved")}
                        />
                        <span className="custom-radio approved"></span>
                        ผ่านการอนุมัติ
                      </label>

                      <label className="radio-option">
                        <input
                          type="radio"
                          name="approval"
                          value="rejected"
                          style={{ marginRight: 12 }}
                          checked={approval === "rejected"}
                          onChange={() => setApproval("rejected")}
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
                      <p style={{ marginBottom: "6px", fontWeight: 600 }}>
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
                              setContractNumber(e.target.value);
                              setContractError(false); // ✅ พอพิมพ์แล้วล้าง error
                            }}
                            placeholder="กรอกเลขที่สัญญา"
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
              <button className="btn-cancel-modern" onClick={closePopup}>
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
            src="/logo SAK เลขเสียภาษี.png"
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
                {getDataShowPdf?.CTM_business_zone}
              </span>
            </div>

            {/* ✅ วันที่ */}
            {(() => {
              const { day, month, year } = getThaiDateParts(
                getDataShowPdf?.CTM_created_at
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
            {getDataShowPdf?.CTM_firstname || ""}
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
            {getDataShowPdf?.CTM_lastname || ""}
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
            {convertToThaiDate(getDataShowPdf?.CTM_birthdate) || ""}
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
            {formatPhoneFront(getDataShowPdf?.CTM_phone)}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            บัตรประจำตัวประชาชนเลขที่ :{" "}
            {getDataShowPdf?.CTM_citizen_id?.replaceAll("-", "") // ✅ ลบ - ออกก่อน (ถ้ามี)
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
                    <span style={{ margin: "0 6px", fontSize: "20px" }}>-</span>
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
          (มหาชน) ซึ่งเป็นสมาชิกที่ข้าพเจ้าใช้บริการของบริษัท เพื่อประโยชน์ในการ
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
              ({getDataShowPdf?.CTM_title_name}
              {getDataShowPdf?.CTM_firstname} {getDataShowPdf?.CTM_lastname})
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
            {getDataShowPdf?.Form_witness2_name && (
              <div
                style={{
                  borderRadius: "10px",
                  width: "360px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div>( {getDataShowPdf?.Form_witness2_name} )</div>
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

              <div>({getDataShowPdf?.Form_witness1_name}) ตัวบรรจง</div>
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
  );
};

export default SalepersonView_Examination;
