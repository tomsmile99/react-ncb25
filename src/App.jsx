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
import Sale_inputDataCredit from "./setDefaultPages/salesperson/sale_inputDataCredit";
import Sale_ExaminationCredit from "./setDefaultPages/salesperson/sale_ExaminationCredit";
import Sale_uploadphotoDataCredit from "./setDefaultPages/salesperson/sale_uploadphotoDataCredit";
import Sale_EditDataCustomer from "./setDefaultPages/salesperson/sale_EditDataCustomer";

import Sale_ExaminationCredit_Pass from "./setDefaultPages/salesperson/sale_ExaminationCredit_Pass";
import Sale_ExaminationCredit_Fail from "./setDefaultPages/salesperson/sale_ExaminationCredit_Fail";
import Sale_ExaminationCredit_Cancel from "./setDefaultPages/salesperson/sale_ExaminationCredit_Cancel";

// Admin เจ้าหน้าที่
import Admin_Refuse from "./setDefaultPages/admin/Admin_Refuse";
import Admin_CheckCreditEdit from "./setDefaultPages/admin/Admin_CheckCreditEdit";
import AdminViewPage from "./setDefaultPages/admin/AdminViewPage";
import Admin_CheckCredit from "./setDefaultPages/admin/Admin_CheckCredit";
import Admin_ReportTableChkCredit from "./setDefaultPages/admin/Admin_ReportTableChkCredit";

// รายงาน
import ReportNCBLiteMain from "./setDefaultPages/reportNCBsList/reportNCBLiteMain";
import ReportNCBLiteDSRMain from "./setDefaultPages/reportNCBsList/reportNCBLiteDSRMain";
import ReportNCBLiteMainOut from "./setDefaultPages/reportNCBsList/reportNCBLiteMainOut";
import ReportNCBLiteMainOutSum from "./setDefaultPages/reportNCBsList/reportNCBLiteMainOutSum";

import ViewReportDSR from "./setDefaultPages/admin/ViewReportDSR";
import { NotificationProvider } from "../src/layouts/includes/NotificationContext";
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

              {/* Layout สำหรับ User */}
              <Route element={<LayoutUser />}>
                <Route path="/Salesperson" element={<Salesperson />} />
                <Route
                  path="/Sale_inputDataCredit"
                  element={<Sale_inputDataCredit />}
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
                  path="/Admin_CheckCredit_old"
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
