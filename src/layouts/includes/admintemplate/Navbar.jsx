import { NavLink, useLocation } from "react-router-dom";
import apiClient from "../../../recoilstore/userStores";
import { Base64 } from "js-base64";
import { userToken } from "../../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";

import { BsFillClipboardCheckFill } from "react-icons/bs";

import { IoPersonCircle } from "react-icons/io5";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";

import { TbReportSearch } from "react-icons/tb";
import { RiFileExcel2Fill } from "react-icons/ri";

import { BiSolidEditLocation } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
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

const Navbar = ({
  FullnamePer,
  contDataMenuChkCD1,
  contDataMenuChkCD2,
  contDataMenuChkCD3,

  getcountidea,
}) => {
  const getstore = useRecoilValue(userToken);

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);

  const ifshowmenu = getcountidea;
  const [dateType, setDateType] = useState("");

  // 🔒 รหัสที่อนุญาตให้เห็นเมนูนี้เท่านั้น
  const allowManagementMenu = ["003792", "000274", "002743"]; // <-- เจ้าหน้าที่เห็นเมนูนีี้เฉพาะบางคน

  const canSeeManagementMenu = allowManagementMenu.includes(String(PerD));

  const navClass = ({ isActive }) =>
    `nav-link minimal ${isActive ? "active" : ""}`;

  const Badge = ({ count }) =>
    count > 0 ? <span className="circle">{count}</span> : null;

  return (
    <aside className="main-sidebar sidebar-light-primary sidebar-minimal">
      {/* Brand */}
      <NavLink className="brand-link brand-minimal" end>
        <img
          src={`${import.meta.env.VITE_REACT_APP_PHOTO}/SakERP.png`}
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
              <IoPersonCircle
                style={{
                  color: "#fff",
                  fontSize: "23px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>เมนูสำหรับเจ้าหน้าที่</span>
            </li>

            {/* <li className="nav-item">
              <NavLink to="/Salesperson" className={navClass}>
                <FaBookReader
                  className="nav-item"
                  style={{ color: "#06407aff" }}
                />
                <p style={{ fontSize: "13px" }}>ยื่นแบบฟอร์ม</p>

              </NavLink>
            </li> */}

            <li className="nav-item">
              <NavLink to="/Admin_CheckCredit" className={navClass}>
                <BsFillClipboardCheckFill
                  className="nav-item"
                  style={{ color: "#06407aff" }}
                />
                <p style={{ fontSize: "13px" }}>รอตรวจสอบข้อมูลเครดิต</p>
                <Badge count={contDataMenuChkCD1} />
              </NavLink>
            </li>
           
            <li className="nav-item">
              <NavLink to="/Admin_ManagementUser" className={navClass}>
                <FaSearch
                  className=""
                  style={{ color: "#06407aff", fontSize: "13px" }}
                />
                <p style={{ fontSize: "13px" }}>ค้นหาข้อมูลเครดิตลูกค้า</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>
             <li className="nav-item">
              <NavLink to="/AdminView_Litemain_OutsideNcb" className={navClass}>
                <FaCheckCircle
                  className=""
                  style={{ color: "#06407aff", fontSize: "13px" }}
                />
                <p style={{ fontSize: "12px" }}>คำขอตรวจสอบนอกหลักเกณฑ์</p>
                <Badge count={contDataMenuChkCD3} />
              </NavLink>
            </li>

            {/* <li className="nav-item">
                  <NavLink to="/Admin_Refuse" className={navClass}>
                    <TbDevicesCancel
                      className="nav-item"
                      style={{ color: "#06407aff", fontSize: "20px" }}
                    />
                    <p style={{ fontSize: "13px" }}>ออกหนังสือปฏิเสธลูกค้า</p>
                  
                  </NavLink>
                </li> */}

            {/* <li className="nav-item">
              <NavLink to="/Admin_ReportTableChkCredit" className={navClass}>
                <HiClipboardList
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "20px" }}
                />
                <p style={{ fontSize: "13px" }}>รายการตรวจสอบข้อมูลเครดิต</p>
              
              </NavLink>
            </li> */}
            {/* <li className="nav-item">
                  <NavLink to="/Admin_Setting_from" className={navClass}>
                    <FcDocument className="nav-icon" />
                    <p>การจัดการฟอร์มประเมิน</p>
                    // <Badge count={getemployee_contain_Counts} />
                  </NavLink>
                </li> */}

            {/* เมนูแก้ไข */}

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
              <span>เมนูสำหรับการแก้ไข</span>
            </li>

            <li className="nav-item">
              <NavLink to="/Admin_CheckCreditEdit" className={navClass}>
                <BiSolidMessageSquareEdit
                  className=""
                  style={{ color: "#06407aff", fontSize: "17px" }}
                />
                <p>แจ้งรอการแก้ไขข้อมูล</p>
                <Badge count={contDataMenuChkCD2} />
              </NavLink>
            </li>

            {/* เมนูแก้ไข */}

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
              <TbReportSearch
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
              <NavLink to="/reportNCBLiteMain" className={navClass}>
                <RiFileExcel2Fill
                  className=""
                  style={{ color: "#06407aff", fontSize: "19px" }}
                />
                <p  style={{fontSize:"12px"}}>รายงานสรุปการยื่นขอสืบค้น</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/ReportNCBLiteDSRMain" end className={navClass}>
                <RiFileExcel2Fill className="" style={{ color: "#06407aff" , fontSize: "19px" }} />
                <p  style={{fontSize:"12px"}}>สรุปการยื่นขอสืบค้น ( นอกหลักเกณฑ์ )</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
            </li>

            {/* <li className="nav-item">
              <NavLink to="/ReportNCBLiteMainOut" end className={navClass}>
                <RiFileExcel2Fill
                  className=""
                  style={{ color: "#06407aff", fontSize: "19px" }}
                />
                <p style={{ fontSize: "12px" }}>รายงาน ( สำหรับบุคคลภายนอก )</p>
              
              </NavLink>
            </li>  */}
            {canSeeManagementMenu && (
              <>
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
                  <TbReportSearch
                    style={{
                      color: "#fff",
                      fontSize: "20px",
                      flexShrink: 0, // ป้องกันการบิดขนาด
                      marginRight: "5",
                    }}
                  />
                  <span>การจัดการข้อมูล</span>
                </li>

                <li className="nav-item">
                  <NavLink to="/Admin_Management" className={navClass}>
                    <BiSolidEditLocation
                      className=""
                      style={{ color: "#06407aff", fontSize: "19px" }}
                    />
                    <p>แก้ไขสถานะรายงานผล</p>
                    {/* <Badge count={getemployee_contain_Counts} /> */}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;
