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

import { FaTimes } from "react-icons/fa";
import { userToken } from "../../recoilstore/userStores";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@mui/material";

import { NavLink } from "react-router-dom";
import Pagination from "../../component/Pagination";

import { FaPlusCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const SalepersonView_Litemain_OutsideDistrict = () => {
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
      IdHead: PerD,
    };

    // console.log(params);

    try {
      const { data } = await apiClient.get(
        `/api/insurances/GetDataOutsideDistrict`,
        {
          params,
        },
      );

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

  const handleUpdateCustomer = async (Idnum) => {
    try {
      const payload = {
        IdForm: Idnum,
      };

      const { data } = await apiClient.post(
        "/api/insurances/updateDataEdit_OutsideDistrict",
        payload,
      );

      const { status, result, message } = data;

      if (status === 200) {
        Swal.fire({
          icon: "success",
          title: "อนุมัติแล้ว",
          text: "รายการนี้ได้รับการอนุมัติเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#4a90e2",
          background: "#ffffff",
          color: "#333",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.assign("/SalepersonView_Litemain_OutsideDistrict");
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
            <div
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            ></div>

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
                  <th className="text-center" style={{ width: "1%" }}>
                    ลำดับ
                  </th>
                  <th className="text-center" style={{ width: "12%" }}>
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
                  <th className="text-center" style={{ width: "17%" }}>
                    สถานะติดตาม
                  </th>
                  <th className="text" style={{ width: "5%" }}>
                    วัน / เวลา ที่ยื่นแบบฟอร์ม
                  </th>
                  {/* <th className="text" style={{ width: "5%" }}>
                    เอกสารประกอบ
                  </th> */}

                  <th className="text-center" style={{ width: "5%" }}>
                    หนังสือรับรอง
                  </th>
                  <th className="text-center" style={{ width: "15%" }}>
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
                      {/* สถานะเอกสาร */}
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn  d-flex align-items-center gap-1 status-app-strong smooth-blink-strong"
                            onClick={() => handleOpenModal(item)}
                            title="อนุมัติรายการ"
                            style={{
                              height: "32px",
                              minWidth: "120px", // 🔥 ยาวกว่าแบบคุมได้
                              padding: "0 24px",
                              borderRadius: "8px",
                              border: "none",
                              background:
                                "linear-gradient(135deg, #28a745, #20c997)",
                              color: "#fff",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              boxShadow: "0 4px 12px rgba(40,167,69,0.3)",
                              transition: "0.2s",
                              cursor: "pointer",
                              whiteSpace: "nowrap", // ✅ ไม่ตกบรรทัด
                            }}
                          >
                            <FaCheckCircle />
                            รับรองผลการยื่น
                          </button>
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
                  <h3 className="card-title">อนุมัติรายการนอกหลักเกณฑ์</h3>
                  {/* <div style={{ color: "#7d7d7d" }}>
                    รหัสฟอร์ม : {getDataShow.FormOutside_form_number || "-"}
                  </div> */}
                </div>

                <div className="minimal-form">
                  <div className="form-row"></div>

                  {/* BODY (แสดงข้อมูลสำคัญ) */}
                  <div className="minimal-form">
                    <div className="form-row">
                      <label>ชื่อลูกค้า</label>
                      <div>{getDataShow.FormOutside_customer_name}</div>
                    </div>

                    <div className="form-row">
                      <label>ประเภทลูกค้า</label>
                      <div>{getDataShow.CMTN_Name}</div>
                    </div>
                    <div className="form-row">
                      <label>ประเภทสินเชื่อ</label>
                      <div>{getDataShow.LTNL_Name}</div>
                    </div>

                    <div className="form-row">
                      <label>วงเงินขอสินเชื่อ</label>
                      <div style={{ fontWeight: "bold", color: "#28a745" }}>
                        {formatNumber(getDataShow.FormOutside_credit_limit)} บาท
                      </div>
                    </div>
                  </div>
                </div>
                <hr />

                <div
                  className="form-row mt-5"
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {/* 🔹 CARD COMPONENT */}
                  {[
                    {
                      title: "ผู้ยื่นขอตรวจสอบ",
                      name: getDataShow?.FormOutside_requester_name,
                      position: getDataShow?.FormOutside_requester_position,
                      date: getDataShow?.FormOutside_created_at,
                      labelDate: "วันที่ยื่น",
                    },
                    {
                      title: "ผู้รับรอง",
                      name: getDataShow?.FormOutside_reviewer_name,
                      position: getDataShow?.FormOutside_reviewer_position,
                      date: getDataShow?.FormOutside_review_datetime,
                      labelDate: "วันที่รับรองผล",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        flex: "1",
                        minWidth: "250px",
                        background: "#fff",
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        borderTop: "5px solid #14ae80",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#14ae80",
                          marginBottom: "10px",
                        }}
                      >
                        {item.title}
                      </div>

                      {getDataShow ? (
                        <>
                          <div style={{ fontSize: "15px", fontWeight: "500" }}>
                            {item.name || "-"}
                          </div>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#555",
                              marginTop: "5px",
                            }}
                          >
                            ตำแหน่ง {item.position || "-"}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#888",
                              marginTop: "5px",
                            }}
                          >
                            {item.labelDate}{" "}
                            {item.date ? convertToThaiDate(item.date) : "-"}
                          </div>
                        </>
                      ) : (
                        <div>กำลังโหลด...</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center", // 👉 กึ่งกลาง
                alignItems: "center",
                gap: "12px",
                marginTop: "15px",
              }}
            >
              {/* ❌ ยกเลิก */}
              <button
                onClick={() => setOpenModal(false)}
                style={{
                  height: "42px",
                  minWidth: "120px",
                  padding: "0 18px",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  background: "#f5f5f5",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap", // ✅ ไม่ให้ตกบรรทัด
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <FaTimes />
                ยกเลิก
              </button>

              {/* ✅ รับรอง */}
              <button
                onClick={() =>
                  handleUpdateCustomer(getDataShow.FormOutside_form_number)
                }
                style={{
                  height: "42px",
                  minWidth: "220px", // 🔥 ยาวกว่าแบบคุมได้
                  padding: "0 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  color: "#fff",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(40,167,69,0.3)",
                  transition: "0.2s",
                  cursor: "pointer",
                  whiteSpace: "nowrap", // ✅ ไม่ตกบรรทัด
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <FaCheckCircle />
                อนุมัติผลการยื่นตรวจ
              </button>
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

export default SalepersonView_Litemain_OutsideDistrict;
