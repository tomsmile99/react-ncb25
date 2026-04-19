import React, { useRef, useState, useEffect, useContext } from "react";
//MUI
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../recoilstore/userStores";
import { Base64 } from "js-base64";
import html2pdf from "html2pdf.js";
import { useRecoilValue } from "recoil";
import { FaSyncAlt } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { userToken } from "../../recoilstore/userStores";

import { Button } from "@mui/material";

import { NavLink } from "react-router-dom";
import Pagination from "../../component/Pagination";

import { FaPlusCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const SalepersonView_Litemain_Outsidefinish = () => {
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่
  const [totalPages, setTotalPages] = useState(0); // มีทั้งหมด ... หน้า
  const limit = 50; // จำนวนรายการต่อหน้า

  const [probationaryEmployees, setProbationaryEmployees] = useState([]);
  const location = useLocation();

  const getstore = useRecoilValue(userToken);

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const PerWP_N = Base64.decode(getstore.PerWP_N);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);

  const [branchManagers, setBranchManagers] = useState([]);
  const [areaManager, setAreaManager] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const getEmployeeDB_Admin = async (page) => {
    const params = {
      _page: page,
      _limit: limit,
      _PerWP: _PerWP,
    };

    // console.log(params);

    try {
      const { data } = await apiClient.get(`/api/insurances/GetDataOutsideFow`, {
        params,
      });

      // ❌ ห้ามใช้ currentPage ชื่อชนกับ state
      const {
        status,
        sqlDataCustomers,
        totalPages,
        currentPage: apiCurrentPage,
      } = data;

      if (status) {
        // console.log(sqlDataCustomers);
        setProbationaryEmployees(sqlDataCustomers);
        // setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [getDataShow, setgetDataShow] = useState({});

  // ✅ ใส่ตรงนี้เลย
  const [formData, setFormData] = useState({
    FormOutside_customer_name: "",
    FormOutside_customer_type: "",
    FormOutside_credit_limit: "",
    FormOutside_loan_type: "",
  });
  //Report DSR Page
  const handleView = (item) => {
    const id = item.FormOutside_form_number;

    const url = `${window.location.origin}/DataReportPDF/${id}`;

    window.open(url, "_blank");
  };

  const handleGetDataSingger = async (idForm) => {
    const id = idForm.FormOutside_form_number;

    const params = {
      idForm: id,
    };
    try {
      // ✅ 1. ส่ง idForm ไป WHERE ที่ API (ถูกต้อง)
      const { data } = await apiClient.get(
        `/api/insurances/GetDataOutsideDataShow`,
        {
          params,
        },
      );

      const { status, result, sqlDataCustomers, message } = data;

      if (status === 200) {
        const data2 = sqlDataCustomers[0];
        // console.log(sqlDataCustomers[0]);
        setgetDataShow(sqlDataCustomers[0]);
        setFormData({
          FormOutside_form_number: data2.FormOutside_form_number || "",
          FormOutside_customer_name: data2.FormOutside_customer_name || "",
          FormOutside_customer_type: data2.FormOutside_customer_type || "",
          FormOutside_loan_type: data2.FormOutside_loan_type || "",
          FormOutside_credit_limit: data2.FormOutside_credit_limit || "",
          FormOutside_requester_id: data2.FormOutside_requester_id || "",
          FormOutside_requester_name: data2.FormOutside_requester_name || "",
          FormOutside_requester_position:
            data2.FormOutside_requester_position || "",
          FormOutside_requester_branch:
            data2.FormOutside_requester_branch || "",
          FormOutside_IDrequester_branch:
            data2.FormOutside_IDrequester_branch || "",
          FormOutside_requester_department:
            data2.FormOutside_requester_department || "",
          FormOutside_requester_region:
            data2.FormOutside_requester_region || "",
          FormOutside_request_datetime:
            data2.FormOutside_request_datetime || "",
          FormOutside_reviewer_id: data2.FormOutside_reviewer_id || "",
          FormOutside_reviewer_name: data2.FormOutside_reviewer_name || "",
          FormOutside_reviewer_name: data2.FormOutside_reviewer_name || "",
          FormOutside_reviewer_position:
            data2.FormOutside_reviewer_position || "",
          FormOutside_review_status: data2.FormOutside_review_status || "",
          FormOutside_review_datetime: data2.FormOutside_review_datetime || "",
          FormOutside_approver_id: data2.FormOutside_approver_id || "",
          FormOutside_approver_name: data2.FormOutside_approver_name || "",
          FormOutside_approve_status: data2.FormOutside_approve_status || "",
          FormOutside_approve_datetime:
            data2.FormOutside_approve_datetime || "",
          FormOutside_lv_status: data2.FormOutside_lv_status || "",
          FormOutside_remark: data2.FormOutside_remark || "",
          FormOutside_created_at: data2.FormOutside_created_at || "",
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

  const fetchCustomerTypes = async (item) => {
    const PerWP = item.FormOutside_IDrequester_branch;
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
  const getThaiFullDate = () => {
    const date = new Date();
    const months = [
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

    return `วันที่ ${date.getDate()} เดือน ${months[date.getMonth()]} พ.ศ. ${
      date.getFullYear() + 543
    }`;
  };

  const indexInPage = (index, currentPage, limit) => {
    return (currentPage - 1) * limit + (index + 1);
  };

  // คำนวณ start index
  const startIndex = (currentPage - 1) * limit;
  // ตัดข้อมูลเฉพาะหน้าปัจจุบัน
  const currentData = probationaryEmployees.slice(
    startIndex,
    startIndex + limit,
  );

  const handleRefresh = () => {
    getEmployeeDB_Admin(); //
    setQuery("");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenModal = (item) => {
    setOpenModal(true); // ✅ เปิด modal
    handleGetDataSingger(item); // ✅ เก็บข้อมูลเดิม
    fetchCustomerTypes(item);
  };

  useEffect(() => {
    getEmployeeDB_Admin(currentPage);
  }, [currentPage]);

  const handleDel = async (tableId, idNumber) => {
    //  if (!tableId || !idNumber) return;

    // ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "ต้องการลบข้อมูลนี้หรือไม่?",
      text: "ลบแล้วไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      background: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiClient.post("api/insurances/datacustomers/delete", {
        tableId,
        idNumber,
      });

      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ",
          text: "ข้อมูลถูกลบเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#ffffff",
        });

        getEmployeeDB_Admin();
        window.location.assign("/Salesperson");
        // fetchData(); // โหลดข้อมูลใหม่
      } else {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: res.data.message || "เกิดข้อผิดพลาด",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบข้อมูลได้",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const steps = ["ผู้รับรอง", "อนุมัติ", "รับทราบ"];

  const getActiveStep = (status) => {
    switch (status) {
      case "Lv0":
        return 0;
      case "Lv1":
        return 1;
      case "Lv2":
        return 2;
      case "Lv3":
        return 3;
      default:
        return 0;
    }
  };

  const handleUpdateCustomer = async () => {
    try {
      const formDataUpload = new FormData();

      // ⭐ แปลงวันเกิด พ.ศ. → ค.ศ.
      // const birthdayCE = convertBirthdayToCE(birthdayTH);

      // if (!birthdayCE) {
      //   Swal.fire({
      //     icon: "warning",
      //     title: "ข้อมูลไม่ครบ",
      //     text: "กรุณากรอกวันเดือนปีเกิดให้ครบ",
      //   });
      //   return;
      // }

      if (
        !formData?.FormOutside_customer_name ||
        formData.FormOutside_customer_name.trim() === ""
      ) {
        // setPhoneError(true);
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกเบอร์โทรศัพท์",
          text: "ต้องระบุเบอร์โทรศัพท์ก่อนทำรายการ",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      /* ===============================
          🧾 ข้อมูลฟอร์ม (JSON)
        =============================== */
      const payload = {
        ...formData,
        // idForm: idForm,
        // LvChk: getDataLvChk,
        // CTM_birthdate: birthdayCE,
      };

      // console.log(payload);
      // return

      formDataUpload.append("payload", JSON.stringify(payload));

      const { data } = await apiClient.post(
        "/api/insurances/updateDataEdit_Outside",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 🔥 ต้องมี
          },
        },
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
          // setConsentError(false);
          window.location.assign("/SalepersonView_Litemain_Outside");
          // if (!formData2.customerType) {
          //   window.location.assign("/Salesperson");
          //   return; // ⛔ หยุดการทำงานตรงนี้ทันที
          // }
          // // 🔥 ครั้งแรก → เปิด modal
          // if (chksentFileRef.current === 1) {
          //   setOpenConsentModal(true);
          //   chksentFileRef.current = 2; // ✅ เปลี่ยนทันที ไม่รอ rerender
          // }
          // // 🔥 ครั้งที่สอง → redirect
          // else {
          //   window.location.assign("/Salesperson");
          // }

          // navigate("/Salesperson");
        });
      }
    } catch (error) {
      console.error("❌ อัปเดตข้อมูลไม่สำเร็จ:", error);
    }
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };
  useEffect(() => {
    if (location.state?.highlightId) {
      setHighlightId(location.state.highlightId);

      // ✅ ให้กระพริบ 5 วิ แล้วหาย
      setTimeout(() => {
        setHighlightId(null);
      }, 5000);
    }
  }, [location.state]);
  return (
    <>
      <div className="pt-2">
        <div className="cartcustom p-3 shadow-xl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // ดันซ้าย-ขวา
              width: "100%",
            }}
          >
            {/* ซ้าย: ไอคอน + ข้อความ */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {" "}
              {/* <NavLink
                to="/Sale_inputDataCredit_Outside"
                style={{ textDecoration: "none" }}
              >
                <Button
                  className="glow-button"
                  style={{
                    background: "#f1f5f9",
                    color: "#022d58",
                    border: "none",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    fontWeight: 500,
                  }}
                >
                  <FaPlusCircle /> แจ้งขอตรวจนอกหลักเกณฑ์
                </Button>
              </NavLink> */}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                onClick={handleRefresh}
                style={{
                  background:
                    "linear-gradient(to right,rgba(4, 40, 72, 1), #002b57)",
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

          <div className="table-responsive pt-2">
            <table className="table table-hover table-sm">
              <thead className="custom-buttonTBs">
                <tr>
                  <th className="text-center" style={{ width: "5%" }}>
                    ลำดับ
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
                    เลขที่แบบฟอร์ม
                  </th>
                  {/* <th className="text" style={{ width: "10%" }}>
                    รหัสลูกค้า
                  </th> */}
                  <th className="text" style={{ width: "15%" }}>
                    ชื่อ-นามสกุล ลูกค้า
                  </th>
                  <th className="text" style={{ width: "15%" }}>
                    ชื่อ-นามสกุล พนักงาน
                  </th>
                  <th className="text" style={{ width: "13%" }}>
                    ตำแหน่ง
                  </th>
                  <th className="text" style={{ width: "10%" }}>
                    พื้นที่ปฏิบัติงาน
                  </th>
                  <th className="text-center" style={{ width: "20%" }}>
                    สถานะติดตาม
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    วัน / เวลา ที่ยื่นแบบฟอร์ม
                  </th>
                  {/* <th className="text" style={{ width: "5%" }}>
                    เอกสารประกอบ
                  </th> */}
                  <th className="text-center" style={{ width: "5%" }}>
                    แก้ไข
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    หนังสือรับรอง
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
                  probationaryEmployees.map((item, index) => (
                    <tr
                      key={item.FormOutsideTable_id}
                      className={`text${
                        highlightId === item.FormOutsideTable_id
                          ? " blink-row"
                          : ""
                      }`}
                    >
                      <td className="text-center">
                        {(currentPage - 1) * limit + (index + 1)}
                      </td>

                      <td className="text-center">
                        {item.FormOutside_form_number || "-"}
                      </td>

                      <td>{item.FormOutside_customer_name}</td>

                      <td>{item.FormOutside_requester_name}</td>
                      <td>{item.FormOutside_requester_position}</td>
                      <td>{item.FormOutside_requester_branch}</td>
                      {/* PDF */}
                      <td>
                        <Box sx={{ width: "100%" }}>
                          <Stepper
                            activeStep={getActiveStep(
                              item.FormOutside_lv_status,
                            )}
                            alternativeLabel
                            sx={{
                              "& .MuiStepLabel-label": {
                                fontSize: "10px",
                              },
                              "& .MuiStepIcon-root": {
                                fontSize: "18px",
                              },
                              "& .MuiStepIcon-root.Mui-active": {
                                color: "#053622ce",
                              },
                              "& .MuiStepIcon-root.Mui-completed": {
                                color: "#148f41",
                              },
                              "& .MuiStepConnector-line": {
                                borderColor: "#cbd5f5",
                              },
                            }}
                          >
                            {steps.map((label) => (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        </Box>
                      </td>
                      <td>
                        <center>
                          {convertToThaiDate(item.FormOutside_created_at)}
                        </center>
                      </td>
                      {/* สถานะเอกสาร */}
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn-icon"
                            // onClick={() => handleGetDataSingger(item)}
                            onClick={() => handleOpenModal(item)}
                            disabled={item?.FormOutside_lv_status !== "Lv0"}
                            title={
                              item?.FormOutside_lv_status === "Lv0"
                                ? "แก้ไขข้อมูลการยื่นตรวจสอบนอกหลักเกณฑ์"
                                : "ไม่สามารถแก้ไขได้"
                            }
                            style={{
                              opacity:
                                item?.FormOutside_lv_status !== "Lv0" ? 0.5 : 1,
                              cursor:
                                item?.FormOutside_lv_status !== "Lv0"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                      {/* ปุ่มจัดการ */}
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          {item.FormOutside_form_number && (
                            <button
                              className="btn-icon"
                              onClick={() => handleView(item)}
                              title="เปิด PDF"
                            >
                              <FaRegFilePdf />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
      </div>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "9px",
                marginTop: "14px",
              }}
            >
              <div className="">
                <div className="form-header">
                  <h3 className="card-title">
                    แก้ไขข้อมูลแจ้งขอตรวจสอบข้อมูลเครดิตนอกหลักเกณฑ์
                  </h3>
                  <div style={{ color: "#7d7d7d" }}>
                    รหัสฟอร์ม : {getDataShow.FormOutside_form_number || "-"}
                  </div>
                </div>

                <div className="minimal-form">
                  <div className="form-row">
                    <label>
                      1. คำนำหน้าชื่อ + ชื่อ-นามสกุลลูกค้า{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>

                    <input
                      type="text"
                      name="FormOutside_customer_name"
                      value={formData.FormOutside_customer_name || ""}
                      onChange={handleChange}
                    />
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
                        ลูกค้าใหม่ (ลูกค้าเก่าปิดบัญชี ตั้งแต่ 1 ปี
                        กลับมาใช้บริการ)
                      </option>
                      <option value="3">ลูกค้าใหม่ (ย้ายไฟแนนซ์)</option>
                      <option value="4">ลูกค้าเก่า</option>
                      <option value="5">ลูกค้าเก่า (ย้ายไฟแนนซ์)</option>
                      <option value="6">
                        ลูกค้าเก่าต่อสัญญา/RENEW (ขอตรวจนอกหลักเกณฑ์)
                      </option>
                      <option value="7">
                        ลูกค้าเก่าต่อสัญญา/RENEW เพิ่มวงเงิน
                      </option>
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
                      <option value="6">
                        สินเชื่อโซลาร์ไมโครอินเวอร์เตอร์
                      </option>
                      <option value="7">
                        สินเชื่อเช่าซื้อ (รถจักรยานยนต์ใหม่)
                      </option>
                      <option value="8">สินเชื่อเช่าซื้อ (รถแลกเงิน)</option>
                      <option value="9">สินเชื่อทะเบียนรถ</option>
                      <option value="10">สินเชื่อโซลาร์แอร์</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <label style={{ fontSize: "14px" }}>
                      4. วงเงินขอสินเชื่อ{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                    className="mr-1"
                      type="text"
                      name="FormOutside_credit_limit"
                      value={formatNumber(formData.FormOutside_credit_limit)} // 👈 แสดงมี ,
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        const num = raw.replace(/[^0-9]/g, "");

                        setFormData((prev) => ({
                          ...prev,
                          FormOutside_credit_limit: num, // 👈 เก็บแบบไม่มี ,
                        }));
                      }}
                      placeholder="กรอกเฉพาะตัวเลข"
                    />บาท
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
                        FormOutside_reviewer_position:
                          selected?.position_PSN || "",
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
                {/* <button className="btn-submit" onClick={handleCheckOutside}>
                  <LuScanText /> ยื่นขอตรวจนอกหลักเกณฑ์
                </button> */}
                {/* <button className="btn-submit">บันทึกข้อมูล</button> */}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <button
                className="btn-cancel mr-2"
                style={{ height: "43px" }}
                onClick={() => setOpenModal(false)}
              >
                ยกเลิก
              </button>

              <div style={{ marginLeft: "auto" }}>
                <button className="btn-submit" onClick={handleUpdateCustomer}>
                  บันทึกการแก้ไข
                </button>
              </div>
            </div>
          </div>{" "}
        </div>
      )}
      {/* <div className="modal-backdrop">
          <div className="modal-box">
            <h3>แก้ไขข้อมูล</h3>

            <input
              value={getDataShow?.FormOutside_form_number || ""}
              onChange={(e) =>
                setEditData({
                  ...getDataShow,
                  FormOutside_form_number: e.target.value,
                })
              }
            />

            <button onClick={() => setOpenModal(false)}>ปิด</button>
          </div>
        </div>  */}
    </>
  );
};

export default SalepersonView_Litemain_Outsidefinish;
