import React, { useRef, useState, useEffect, useContext } from "react";
import apiClient from "../../recoilstore/userStores";

import { FormControl, Form, InputGroup, Modal, Button } from "react-bootstrap";
import { Base64 } from "js-base64";
import { useRecoilValue } from "recoil";
import { userToken } from "../../recoilstore/userStores";
import { MdSchedule } from "react-icons/md";

import { FiSearch } from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import { BsSend } from "react-icons/bs";

import { BsFiletypeDoc } from "react-icons/bs";
import { MdEditLocationAlt } from "react-icons/md";
import Swal from "sweetalert2";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
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

const convertToThaiDateTime = (dateString) => {
  if (!dateString) return "-";

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

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds} น.`;
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

const SalepersonViewManagementUser = () => {
  const getstore = useRecoilValue(userToken);
  const _PerWP = Base64.decode(getstore.PerWP);
  const PerD = Base64.decode(getstore.PerD);
  const canEdit = ["003792", "000274", "002743", "004187"].includes(PerD);

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

  const [searchKeyword, setSearchKeyword] = useState("");

  const [editPhone, setEditPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

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
      _PerWP: _PerWP,
    };

    // console.log(params);

    try {
      const { data } = await apiClient.get(
        `/api/insurances/datacustomers_UserManagementUser`,
        { params },
      );

      const { status, sqlDataCustomers, totalPages } = data;

      if (status === 200) {
        setProbationaryEmployees(sqlDataCustomers);
        setHasSearched(true);

        // setTotalPages(totalPages || 0);
      } else {
        setProbationaryEmployees([]);
        setTotalPages(0);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "ไม่พบข้อมูล",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setProbationaryEmployees([]);
      setTotalPages(0);
    }
  };

  const handleOpenModal = async (data) => {
    setShowModal(true);
    // console.log(data.CTM_business_zone_id)

    try {
      const res = await apiClient.get("/api/insurances/selectWorkplace", {
        params: {
          branch_id: data.CTM_business_zone_id, // รหัสสาขา /หน่วย
        },
      });

      const { status, result, message } = res;

      if (status === 200) {
        setZoneList(res.data.data);
        // console.log(res.data)
      }
    } catch (err) {
      console.error(err);
    }
  };
  const openFileInNewTab = (relativePath) => {
    const base = import.meta.env.VITE_REACT_APP_UPLOAD_API_NCB;
    window.open(`${base}/${relativePath}`, "_blank");
  };

  //Report DSR Page

  const handleView = (item) => {
    const id = item.CTM_form_number;

    const url = `${window.location.origin}/DataReportDSRs/${id}`;

    window.open(url, "_blank");
  };

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
        <div className="p-3 shadow-sm">
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      getEmployeeDB_Admin(1, searchQuerySub, searchType);
                    }
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
                        สาขา/หน่วย
                      </th>
                      <th className="text" style={{ width: "8%" }}>
                        เขต
                      </th>
                      <th className="text" style={{ width: "4%" }}>
                        ภาค
                      </th>

                      <th className="text" style={{ width: "8%" }}>
                        เอกสารประกอบ
                      </th>

                      <th className="text" style={{ width: "7%" }}>
                        วันที่/เวลา ที่ยื่นเรื่อง
                      </th>
                      <th className="text" style={{ width: "10%" }}>
                        ผู้รายงานผลตรวจ
                      </th>

                      <th className="text" style={{ width: "5%" }}>
                        วัน/เวลา ตรวจสอบ
                      </th>
                      <th className="text-center" style={{ width: "3%" }}>
                        รายงานผล
                      </th>

                      {/* <th className="text" style={{ width: "5%" }}>
                        วันที่รายงานผลตรวจ
                      </th> */}

                      <th className="text-center" style={{ width: "10%" }}>
                        สถานะ
                      </th>

                      {canEdit && (
                        <th className="text" style={{ width: "1%" }}>
                          แก้ไข
                        </th>
                      )}
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
                            <td style={{ textAlign: "center" }}>
                              {item.CTM_form_number}
                            </td>
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
                            <td>
                              <div>{item.CTM_business_zone || "-"}</div>
                            </td>
                            <td>
                              <div>{item.CTM_branch || "-"}</div>
                            </td>{" "}
                            <td>
                              <div>{item.CTM_business_region || "-"}</div>
                            </td>
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
                            <td>
                              {convertToThaiDateTime(item.date_upEvidence)}
                            </td>
                            <td>
                              <center>
                                <span style={{ fontSize: "12px" }}>
                                  {item.Form_Name_Inspector || "-"}{" "}
                                </span>
                                <div
                                  style={{ fontSize: "12px", color: "#6c757d" }}
                                >
                                  {/* วันที่ตรวจ:{" "}
                                  {item.Form_date_inspertor ? (
                                    convertToThaiDateTime(item.Form_date_inspertor)
                                  ) : (
                                    <center>
                                      <span style={{ fontWeight: 600 }}>
                                        {item.Form_date_inspertor || "-"}
                                      </span>
                                    </center>
                                  )} */}
                                </div>
                              </center>
                            </td>
                            <td>
                              {convertToThaiDateTime(item.Form_date_inspertor)}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-icon"
                                title="รายงานผล"
                                onClick={() => {
                                  if (item.Form_verification_status === "Lv0") {
                                    Swal.fire({
                                      icon: "info",
                                      title: "รายการนี้รอการตรวจสอบ",
                                      text: "ยังไม่ได้รับการตรวจสอบข้อมูลเครดิต",
                                      confirmButtonText: "ตกลง",
                                      confirmButtonColor: "#495057",
                                    });
                                    return;
                                  }

                                  if (
                                    item.Form_verification_status === "Lv1E"
                                  ) {
                                    Swal.fire({
                                      icon: "info",
                                      title: "อยู่ระหว่างการแก้ไข",
                                      text: "ยังไม่ได้รับการตรวจสอบข้อมูลเครดิต",
                                      confirmButtonText: "ตกลง",
                                      confirmButtonColor: "#495057",
                                    });
                                    return;
                                  }

                                  if (
                                    item.Form_verification_status === "Lv1N"
                                  ) {
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
                            {canEdit && (
                              <td>
                                <FaEdit
                                  style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                    color: "#01337f",
                                  }}
                                  onClick={() => handleOpenModal(item)}
                                />
                              </td>
                            )}
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
    </div>
  );
};

export default SalepersonViewManagementUser;
