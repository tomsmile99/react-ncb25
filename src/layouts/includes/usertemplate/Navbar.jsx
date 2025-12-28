import { NavLink, useLocation } from "react-router-dom";
import apiClient from "../../../recoilstore/userStores";
import { Base64 } from "js-base64";
import { userToken } from "../../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { useState, useEffect, useContext } from "react";

import { BsFillClipboardCheckFill } from "react-icons/bs";
import { TbDevicesCancel } from "react-icons/tb";
import { HiClipboardList } from "react-icons/hi";
import { IoPersonCircle } from "react-icons/io5";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { RiFileExcel2Fill } from "react-icons/ri";
import { SiGitbook } from "react-icons/si";
import { FaBookReader } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { AiOutlineFileProtect } from "react-icons/ai";
import { TbDeviceIpadCancel } from "react-icons/tb";
import { MdOutlineCancel } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
// icons
import {
  FcDownLeft,
  FcAdvertising,
  FcCalendar,
  FcCollaboration,
  FcIdea,
  FcBullish,
  FcKindle,
  FcApproval,
  FcOk,
  FcSurvey,
  FcPodiumWithSpeaker,
} from "react-icons/fc";

const Navbar = ({ FullnamePer,contDataMenuChkCD1, contDataMenuChkCD2, getcountidea }) => {


  const getstore = useRecoilValue(userToken);

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);

  const ifshowmenu = getcountidea;
  const [dateType, setDateType] = useState("");

  // =========================
  // Helpers: สิทธิ์/บทบาท
  // =========================

  // 1) กลุ่ม PerD ที่เห็นทุกเมนู (SuperViewers)
  const SUPER_VIEW_PERD = new Set([
    "003792", // เพิ่ม PerD ที่ต้องการให้เห็นทุกเมนูได้ที่นี่
    "002367",
    // "002530",
  ]);

  let getemployee_contain_Counts = 2;

  const isSuperView = (perD) => SUPER_VIEW_PERD.has(perD);

  // 2) ตรวจ role จาก PerWP + PerD (เช่น admin)
  function getRoleFromPerWP(perWP, perD) {
    if (
      ["WP1031", "WP9999", "WP8888"].includes(perWP) &&
      ["003792", "002367"].includes(perD)
    ) {
      return "admin";
    }
    return "user";
  }
  const userRole = getRoleFromPerWP(_PerWP, PerD);

  // 3) ช็อตคัตสิทธิ์พื้นฐาน
  const isAdminLike = _AgU === "AGAD" || userRole === "admin";
  const levelNum = parseInt(PerLV.replace("LV", ""), 10);

  // =========================
  // กลุ่มสิทธิ์ของแต่ละหมวดเมนู (อ่านง่าย ใช้ซ้ำ)
  // ถ้าเป็น SuperView จะ true ทุกกลุ่ม
  // =========================

  // กลุ่ม "พนักงานทดลองงาน"
  const canSeeProbationGroup =
    isSuperView(PerD) || isAdminLike || dateType === "0";

  // กลุ่ม "ประเมินผลการปฏิบัติ (พี่เลี้ยง)"
  const canSeeMentorGroup =
    isSuperView(PerD) || ((isAdminLike || dateType === "1") && levelNum >= 6);

  // กลุ่ม "อนุมัติผลการประเมิน (หัวหน้า/ผจก.สาขา)"
  const canSeeLeaderApproveGroup =
    isSuperView(PerD) ||
    ((isAdminLike || dateType === "1") && levelNum > 10 && levelNum < 23);

  // กลุ่ม "ผู้จัดการเขต / ผช.กก.ผู้จัดการ"
  const canSeeDirectorGroup =
    isSuperView(PerD) || ((isAdminLike || dateType === "1") && levelNum < 10);
  // &&
  // levelNum > 6;

  // กลุ่ม "ผู้จัดการฝ่ายบุคคล"
  const canSeeHRManagerGroup =
    isSuperView(PerD) ||
    ((isAdminLike || dateType === "1") && levelNum < 10 && levelNum > 6);

  // กลุ่ม "เจ้าหน้าที่งานสรรหาและประเมิน" WP0011 ฝ่ายบุคคล
  const canSeeRecruitAdminGroup =
    isSuperView(PerD) ||
    isAdminLike ||
    (_PerWP === "WP0011" && dateType === "1");

  // กลุ่ม "ผู้บริหาร"  PerPST
  const canSeeExecutiveGroup = [
    "002530",
    "002367",
    "003792",
    "000016",
  ].includes(PerD);

  // =========================
  // Fetch ประเภทพนักงาน
  // =========================
  // const ReadData_personnel = async () => {
  //   try {
  //     const { data } = await apiClient.get(`/chk_person_level?PerD=${PerD}`);
  //     const { status, result } = data;
  //     if (status) setDateType(result?.[0]?.type_PSN ?? "");
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //   }
  // };

  // ปุ่ม (กจ.) เฉพาะ PerD ตามกำหนด
  const canSeePresidentItem =
    isSuperView(PerD) || ["002530", "003792", "002367"].includes(PerD);

  // กลุ่ม "เจ้าหน้าที่งานสรรหาและประเมิน" WP0011 ฝ่ายบุคคล
  const chkhead = isSuperView(PerD) || ["003791", "000016"].includes(PerD);

  // useEffect(() => {
  //   ReadData_personnel();
  // }, []);

  // =========================
  // UI Helpers
  // =========================
  const navClass = ({ isActive }) =>
    `nav-link minimal ${isActive ? "active" : ""}`;

  const Badge = ({ count }) =>
    count > 0 ? <span className="circle">{count}</span> : null;

  return (
    <aside className="main-sidebar sidebar-light-primary sidebar-minimal">
      {/* Brand */}
      <NavLink className="brand-link brand-minimal" end>
        <img
          src="/SAKCreditScoring/SakERP.png"
          className="brand-image"
          style={{ height: 30, width: "auto" }}
        />
        <span className="">SAKSIAM (NCB)</span>
      </NavLink>

      {/* Sidebar */}
      <div className="sidebar os-host os-theme-light">
        {/* user */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex user-minimal">
          <div className="image">
            <img
              src={`https://apimb.sakerp.org/file_photoEMP/${_PerPhotoProfile_N}`}
              alt="User"
              className="img-circle avatar-minimal"
            />
          </div>
          <div className="info">
            <span className="d-block user-name">คุณ {FullnamePer} </span>
          </div>
        </div>

        {/* menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column nav-child-indent nav-legacy"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <a
                className="nav-link minimal"
                href={import.meta.env.VITE_BASE_URL_DASHBOARDD || "#"}
              >
                <FcDownLeft className="nav-icon" />
                <p>กลับหน้าหลัก </p>
              </a>
            </li>

            <li
              className="nav-header header-minimal"
              style={{
                background:
                  "linear-gradient(135deg, #0158bbff 0%, #002b57 100%)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "14px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0, 0, 50, 0.06)",
              }}
            >
              <SiGitbook
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>เมนูการจัดการ</span>
            </li>

            <li className="nav-item">
              <NavLink to="/Salesperson" className={navClass}>
                <FaBookReader
                  className="nav-item"
                  style={{ color: "#06407aff" }}
                />
                <p style={{ fontSize: "13px" }}>ยื่นแบบฟอร์ม</p>
                <Badge count={contDataMenuChkCD1} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/Sale_ExaminationCredit" className={navClass}>
                <MdAssessment
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "14px" }}
                />
                <p style={{ fontSize: "13px" }}>ผลการตรวจสอบเครดิต</p>
                <Badge count={contDataMenuChkCD2} />
              </NavLink>
            </li>

            <li
              className="nav-header header-minimal"
              style={{
                background:
                  "linear-gradient(135deg, #0158bbff 0%, #002b57 100%)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "14px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0, 0, 50, 0.06)",
              }}
            >
              <FiEdit3
                style={{
                  color: "#fff",
                  fontSize: "20px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>รายงานผลการอนุมัติ</span>
            </li>

            <li className="nav-item">
              <NavLink to="/Sale_ExaminationCredit_Pass" className={navClass}>
                <AiOutlineFileProtect
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "14px" }}
                />
                <p style={{ fontSize: "13px" }}>ผ่านการอนุมัติสินเชื่อ</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Sale_ExaminationCredit_Fail" className={navClass}>
                <MdOutlineCancel
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "14px" }}
                />
                <p style={{ fontSize: "13px" }}>ไม่ผ่านการอนุมัติสินเชื่อ</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li> 

            <li className="nav-item">
              <NavLink to="/Sale_ExaminationCredit_Cancel" className={navClass}>
                <TbDeviceIpadCancel
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "14px" }}
                />
                <p style={{ fontSize: "13px" }}>ยกเลิกการตรวจสอบ</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>

          
          
         
            
            <li
              className="nav-header header-minimal"
              style={{
                background:
                  "linear-gradient(135deg, #0158bbff 0%, #002b57 100%)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "14px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0, 0, 50, 0.06)",
              }}
            >
              <TbReportAnalytics
                style={{
                  color: "#fff",
                  fontSize: "20px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>รายงาน</span>
            </li>

              <li className="nav-item">
              <NavLink to="/ReportNCBLiteMainOutSum" className={navClass}>
                <RiFileExcel2Fill className="" style={{ color: "#06407aff" ,fontSize: "19px" }} />
                <p>รายงานสรุปการยื่นขอสืบค้น</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>
 
          
            <li className="nav-item">
              <NavLink to="/ReportNCBLiteMainOut" end className={navClass}>
                <RiTeamLine
                  className=""
                  style={{ color: "#06407aff", fontSize: "19px" }}
                />
                <p style={{ fontSize: "12px" }}>รายงาน ( สำหรับบุคคลภายนอก )</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>


            
            {/* <li
              className="nav-header header-minimal"
              style={{
                background:
                  "linear-gradient(135deg, #f38a1bff 0%, #ffb71bff 100%)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "14px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0, 0, 50, 0.06)",
              }}
            >
              <IoPersonCircle
                style={{
                  color: "#fff",
                  fontSize: "23px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>เมนูสลับไปเป็นแอดมิน</span>
            </li>

            <li className="nav-item">
              <NavLink to="/Admin_CheckCredit" className={navClass}>
                <BsFillClipboardCheckFill
                  className="nav-item"
                  style={{ color: "#06407aff" }}
                />
                <p style={{ fontSize: "13px" }}>รอตรวจสอบข้อมูลเครดิต </p>
              
              </NavLink>
            </li> */}
   
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;
