import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthRouter from "./AuthRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Layouts
import LayoutAdmin from "./layouts/LayoutAdmin";
import LayoutUser from "./layouts/LayoutUser";

// Pages: สาขา/หน่วย
import AddSolarRoofTopForm from "./setDefaultPages/jobsolarrooftop/Datasolarrooftops/AddForm";
import Salesperson from "./setDefaultPages/salesperson/sale_CheckCredit";
import Sale_Send_consent from "./setDefaultPages/salesperson/sale_Send_consent";
import Sale_inputDataCredit from "./setDefaultPages/salesperson/sale_inputDataCredit";
import Sale_inputDataCredit_Outside from "./setDefaultPages/salesperson/sale_inputDataCredit_Outside";

import Sale_ExaminationCredit from "./setDefaultPages/salesperson/sale_ExaminationCredit";
import Sale_uploadphotoDataCredit from "./setDefaultPages/salesperson/sale_uploadphotoDataCredit";
import Sale_EditDataCustomer from "./setDefaultPages/salesperson/sale_EditDataCustomer";
import SalepersonView_Litemain_Outside from "./setDefaultPages/salesperson/sale_CheckCredit_Outside"; //ขอตรวจนอกหลักเกณฑ์
import SalepersonView_Litemain_OutsideHead from "./setDefaultPages/salesperson/sale_CheckCredit_OutsideHead"; //ขอตรวจนอกหลักเกณฑ์
import SalepersonView_Litemain_OutsideDistrict from "./setDefaultPages/salesperson/sale_CheckCredit_OutsideDistrict"; //ขอตรวจนอกหลักเกณฑ์

import Sale_CheckCredit_Outsidefinish from "./setDefaultPages/salesperson/sale_CheckCredit_Outsidefinish"; //ขอตรวจนอกหลักเกณฑ์

import Sale_ExaminationCredit_Pass from "./setDefaultPages/salesperson/sale_ExaminationCredit_Pass";
import Sale_ExaminationCredit_Fail from "./setDefaultPages/salesperson/sale_ExaminationCredit_Fail";
import Sale_ExaminationCredit_Cancel from "./setDefaultPages/salesperson/sale_ExaminationCredit_Cancel";

// Admin เจ้าหน้าที่
import Admin_Refuse from "./setDefaultPages/admin/Admin_Refuse";
import Admin_CheckCreditEdit from "./setDefaultPages/admin/Admin_CheckCreditEdit";
import AdminViewPage from "./setDefaultPages/admin/AdminViewPage";
import Admin_CheckCredit from "./setDefaultPages/admin/Admin_CheckCredit";
import Admin_ReportTableChkCredit from "./setDefaultPages/admin/Admin_ReportTableChkCredit";
import Admin_Management from "./setDefaultPages/admin/Admin_Management";
import Admin_ManagementUser from "./setDefaultPages/admin/Admin_ManagementUser";

import AdminView_Litemain_OutsideNcb from "./setDefaultPages/admin/Admin_CheckCredit_OutsideNcb"; //ขอตรวจนอกหลักเกณฑ์
import Adminfollow_Send_consent from "./setDefaultPages/admin/Adminfollow_Send_consent";

// รายงาน
import ReportNCBLiteMain from "./setDefaultPages/reportNCBsList/reportNCBLiteMain";
import ReportNCBLiteMainDanger from "./setDefaultPages/reportNCBsList/reportNCBLiteMainDanger";
import ReportNCBLiteDSRMain from "./setDefaultPages/reportNCBsList/reportNCBLiteDSRMain";
import ReportNCBLiteMainOut from "./setDefaultPages/reportNCBsList/reportNCBLiteMainOut";
import ReportNCBLiteMainOutSum from "./setDefaultPages/reportNCBsList/reportNCBLiteMainOutSum";

import ViewReportDSR from "./setDefaultPages/admin/ViewReportDSR";
import { NotificationProvider } from "../src/layouts/includes/NotificationContext";

import PdfViewer from "./component/PdfViewer";
// -------------------------------------------------------------------
// Theme
// -------------------------------------------------------------------
const theme = createTheme({
  typography: {
    fontFamily: "Kanit, sans-serif",
  },
});

// -------------------------------------------------------------------
// Main App
// -------------------------------------------------------------------
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        {/* <Router basename="/"> */}
        <Router basename="/">
          <AuthRouter /> {/* ตรวจสอบ token ก่อน */}
          <div className="content-wrapper" style={{ backgroundColor: "#fff" }}>
            <Routes>
              {/* ========== เมนูหลัก ========== */}
              <Route path="/" element={<Salesperson />} />
              <Route
                path="/DataReportDSRs/:CTM_Idnumber"
                element={<ViewReportDSR />}
              />
              <Route
                path="/DataReportPDF/:FormOutside_form_number"
                element={<PdfViewer />}
              />

              {/* Layout สำหรับ User */}
              <Route element={<LayoutUser />}>
                <Route path="/Salesperson" element={<Salesperson />} />
                <Route
                  path="/Sale_inputDataCredit"
                  element={<Sale_inputDataCredit />}
                />

                <Route
                  path="/Sale_Send_consent"
                  element={<Sale_Send_consent />}
                />

                <Route
                  path="/Sale_inputDataCredit_Outside"
                  element={<Sale_inputDataCredit_Outside />}
                />
                <Route
                  path="/SalepersonView_Litemain_Outside"
                  element={<SalepersonView_Litemain_Outside />}
                />
                <Route
                  path="/SalepersonView_Litemain_OutsideHead"
                  element={<SalepersonView_Litemain_OutsideHead />}
                />
                <Route
                  path="/SalepersonView_Litemain_OutsideDistrict"
                  element={<SalepersonView_Litemain_OutsideDistrict />}
                />
                <Route
                  path="/Sale_CheckCredit_Outsidefinish"
                  element={<Sale_CheckCredit_Outsidefinish />}
                />

                <Route
                  path="/Sale_ExaminationCredit"
                  element={<Sale_ExaminationCredit />}
                />
                <Route
                  path="/Sale_ExaminationCredit_Pass"
                  element={<Sale_ExaminationCredit_Pass />}
                />
                <Route
                  path="/Sale_ExaminationCredit_Fail"
                  element={<Sale_ExaminationCredit_Fail />}
                />
                <Route
                  path="/Sale_ExaminationCredit_Cancel"
                  element={<Sale_ExaminationCredit_Cancel />}
                />
                <Route
                  path="/Sale_uploadphotoDataCredit/:CTM_Idnumber"
                  element={<Sale_uploadphotoDataCredit />}
                />
                <Route
                  path="/sale_EditDataCustomer/:CTM_Idnumber"
                  element={<Sale_EditDataCustomer />}
                />
                <Route
                  path="/ReportNCBLiteMainOutSum"
                  element={<ReportNCBLiteMainOutSum />}
                />
                <Route
                  path="/ReportNCBLiteMainOut"
                  element={<ReportNCBLiteMainOut />}
                />

              
              </Route>

              {/* Admin */}
              <Route element={<LayoutAdmin />}>
                <Route
                  path="/Admin_CheckCredit"
                  element={<Admin_CheckCredit />}
                />
                <Route path="/AdminViewPage" element={<AdminViewPage />} />
                <Route path="/Admin_Refuse" element={<Admin_Refuse />} />
                <Route
                  path="/Admin_CheckCreditEdit"
                  element={<Admin_CheckCreditEdit />}
                />
                <Route
                  path="/Admin_ReportTableChkCredit"
                  element={<Admin_ReportTableChkCredit />}
                />
                <Route
                  path="/AdminView_Litemain_OutsideNcb"
                  element={<AdminView_Litemain_OutsideNcb />}
                />

                <Route
                  path="/Adminfollow_Send_consent"
                  element={<Adminfollow_Send_consent />}
                />

                {/* รายงาน */}
                <Route
                  path="/reportNCBLiteMain"
                  element={<ReportNCBLiteMain />}
                />
                <Route
                  path="/reportNCBLiteDSRMain"
                  element={<ReportNCBLiteDSRMain />}
                />
                {/* <Route
                  path="/ReportNCBLiteMainOut"
                  element={<ReportNCBLiteMainOut />}
                /> */}

                <Route
                  path="/Admin_Management"
                  element={<Admin_Management />}
                />

                <Route
                  path="/Admin_ManagementUser"
                  element={<Admin_ManagementUser />}
                />

                  <Route
                  path="/ReportNCBLiteMainDanger"
                  element={<ReportNCBLiteMainDanger />}
                />
              </Route>

              {/* อื่นๆ */}
              <Route
                path="/DataSolarRoofTops/AddDataForm"
                element={<AddSolarRoofTopForm />}
              />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
