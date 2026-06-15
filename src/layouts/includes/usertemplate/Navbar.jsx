import { NavLink, useLocation } from "react-router-dom";
import apiClient from "../../../recoilstore/userStores";
import { Base64 } from "js-base64";
import { userToken } from "../../../recoilstore/userStores";
import { useRecoilValue } from "recoil";
import { useState, useEffect, useContext } from "react";

import { TbTruckDelivery } from "react-icons/tb";
import { LuClipboardPlus } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";
import { RiChatFollowUpFill } from "react-icons/ri";
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
import { BsFillSendCheckFill } from "react-icons/bs";
import { FaCheckDouble } from "react-icons/fa";
import { LuUserRoundSearch } from "react-icons/lu";
// icons
import { FcDownLeft } from "react-icons/fc";
import { FaOutdent } from "react-icons/fa";
const Navbar = ({
  FullnamePer,
  contDataMenuChkCD1,
  contDataMenuChkCD2,
  contDataMenuChkCD3,
  contDataMenuChkCD4,
}) => {
  const getstore = useRecoilValue(userToken);

  const _AgU = Base64.decode(getstore.AgU);
  const PerD = Base64.decode(getstore.PerD);
  const _PerWP = Base64.decode(getstore.PerWP);
  const _PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  // const PerLV = Base64.decode(getstore.PerPST_LV);
  const PerPST = Base64.decode(getstore.PerPST);
  const PerPST_LV = Base64.decode(getstore.PerPST_LV);

  // role หัวหน้าหน่วย ผจก.สาขา ผู้ช่วย
  const allowRoles = ["LV007","LV008", "LV016", "LV017", "LV021", "LV021"];
  // role ผจก.เขต
  const ApproverRoles = ["LV006"];

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
          src="/SakERP.png"
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

            
            {allowRoles.includes(PerPST_LV) && (
              <li className="nav-item">
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
                fontSize: "13px",
                boxShadow: "0 2px 6px rgba(0, 0, 50, 0.06)",
              }}
            >
              <FaOutdent
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>รับรองผลการยื่นนอกหลักเกณฑ์</span>
            </li>

                <NavLink
                  to="/SalepersonView_Litemain_OutsideHead"
                  className={navClass}
                >
                  <FaCheckDouble
                    className="nav-item"
                    style={{ color: "#06407aff" }}
                  />
                  <p style={{ fontSize: "13px" }}>รายการรับทราบ</p>
                  <Badge count={contDataMenuChkCD3} />
                </NavLink>
              </li>
            )}
            {ApproverRoles.includes(PerPST_LV) && (
              <li className="nav-item">
                
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
                fontSize: "13px",
                boxShadow: "0 2px 6px rgba(0, 0, 50, 0.06)",
              }}
            >
              <FaOutdent
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  flexShrink: 0, // ป้องกันการบิดขนาด
                  marginRight: "5",
                }}
              />
              <span>อนุมัติผลการยื่นนอกหลักเกณฑ์</span>
            </li>

                <NavLink
                  to="/SalepersonView_Litemain_OutsideDistrict"
                  className={navClass}
                >
                  <FaCheckDouble
                    className="nav-item"
                    style={{ color: "#06407aff" }}
                  />
                  <p style={{ fontSize: "13px" }}>รายการอนุมัติ</p>
                  <Badge count={contDataMenuChkCD4} />
                </NavLink>
              </li>
            )}
           

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

            <li className="nav-item">
              <NavLink
                to="/SalepersonView_Litemain_Outside"
                className={navClass}
              >
                <BsFillSendCheckFill
                  className="nav-item"
                  style={{ color: "#06407aff" }}
                />
                <p style={{ fontSize: "13px" }}> แจ้งตรวจสอบนอกหลักเกณฑ์</p>
                {/* <Badge count={contDataMenuChkCD1} /> */}
              </NavLink>
            </li>
              <li className="nav-item">
              <NavLink
                to="/Sale_Send_consent"
                className={navClass}
              >
                <TbTruckDelivery
                  className="nav-item"
                  style={{ color: "#06407aff" }}
                />
                <p style={{ fontSize: "13px" }}> ส่งต้นฉบับหนังสือให้ความยินยอม</p>
                {/* <Badge count={contDataMenuChkCD1} /> */}
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
              <NavLink to="/sale_ManagementUser" className={navClass}>
                <LuUserRoundSearch
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "14px" }}
                />
                <p style={{ fontSize: "13px" }}>ค้นหาข้อมูลเครดิตลูกค้า</p>
                {/* <Badge count={getemployee_contain_Counts} /> */}
              </NavLink>
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
             <li className="nav-item">
              <NavLink to="/Sale_CheckCredit_Outsidefinish" className={navClass}>
                <RiChatFollowUpFill
                  className="nav-item"
                  style={{ color: "#06407aff", fontSize: "14px" }}
                />
                <p style={{ fontSize: "13px" }}>ติดตามสถานะตรวจนอกหลักเกณฑ์</p>
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
                <RiFileExcel2Fill
                  className=""
                  style={{ color: "#06407aff", fontSize: "19px" }}
                />
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

           
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Navbar;
