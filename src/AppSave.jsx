import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Base64 } from "js-base64";
import Swal from "sweetalert2";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { userToken } from "./recoilstore/userStores";
import apiClient from "./recoilstore/userStores";
import { BASE_URL_Login } from "./apiUrl/Api_Url";

// Layouts
import Header from "./layouts/includes/Header";
import Navbar from "./layouts/includes/Navbar";
import Footer from "./layouts/includes/Footer";

// Pages: Menu Main
import Announcement from "./setreadDatas/menuMain/MenuAnnouncement";

// Pages: Sales
import AddSolarRoofTopForm from "./setDefaultPages/jobsolarrooftop/Datasolarrooftops/AddForm";
import Salesperson from "./setDefaultPages/salesperson/sale_CheckCredit";
import Sale_inputDataCredit from "./setDefaultPages/salesperson/sale_inputDataCredit";
import Sale_ExaminationCredit from "./setDefaultPages/salesperson/sale_ExaminationCredit";
import Sale_uploadphotoDataCredit from "./setDefaultPages/salesperson/sale_uploadphotoDataCredit";

// Sales Results
import Sale_ExaminationCredit_Pass from "./setDefaultPages/salesperson/sale_ExaminationCredit_Pass";
import Sale_ExaminationCredit_Fail from "./setDefaultPages/salesperson/sale_ExaminationCredit_Fail";
import Sale_ExaminationCredit_Cancel from "./setDefaultPages/salesperson/sale_ExaminationCredit_Cancel";

// Admin
import Admin_Refuse from "./setDefaultPages/admin/Admin_Refuse";
import Admin_CheckCreditEdit from "./setDefaultPages/admin/Admin_CheckCreditEdit";
import AdminViewPage from "./setDefaultPages/admin/AdminViewPage";
import Admin_CheckCredit from "./setDefaultPages/admin/Admin_CheckCredit";
import Admin_ReportTableChkCredit from "./setDefaultPages/admin/Admin_ReportTableChkCredit";

// Reports
import ReportNCBLiteMain from "./setDefaultPages/reportNCBsList/reportNCBLiteMain";
import ReportNCBLiteDSRMain from "./setDefaultPages/reportNCBsList/reportNCBLiteDSRMain";
import ReportNCBLiteMainOut from "./setDefaultPages/reportNCBsList/reportNCBLiteMainOut";

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
  const getstore = useRecoilValue(userToken);

  // Decode Token Data
  const fullnamePer = Base64.decode(getstore.PerFuNas);
  const PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const PerPST_N = Base64.decode(getstore.PerPST_N);
  const PerWP_N = Base64.decode(getstore.PerWP_N);
  const PerD = Base64.decode(getstore.PerD);
  const PerWP = Base64.decode(getstore.PerWP);
  const PerLV = Base64.decode(getstore.PerPST_LV);
  const _AgU = Base64.decode(getstore.AgU);
  const _PerWP = Base64.decode(getstore.PerWP);

  const [dateType, setDateType] = useState("");

  // -------------------------------------------------------------------
  // Fetch Personnel Type
  // -------------------------------------------------------------------
  // const ReadData_personnel = async () => {
  //   try {
  //     const { data } = await apiClient.get(`/chk_person_level?PerD=${PerD}`);
  //     if (data.status) {
  //       setDateType(data?.result?.[0]?.type_PSN ?? "");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   ReadData_personnel();
  // }, []);

  // -------------------------------------------------------------------
  // Permission Config
  // -------------------------------------------------------------------

  const SUPER_VIEW_PERD = new Set(["003792", "002367"]);

  const isSuperView = (perD) => SUPER_VIEW_PERD.has(perD);

  const getRoleFromPerWP = (perWP, perD) => {
    if (
      ["WP1031", "WP9999", "WP8888"].includes(perWP) &&
      ["003792", "002367"].includes(perD)
    ) {
      return "admin";
    }
    return "user";
  };

  const userRole = getRoleFromPerWP(_PerWP, PerD);

  const isAdminLike = _AgU === "AGAD" || userRole === "admin";
  const levelNum = parseInt(PerLV.replace("LV", ""), 10);

  // Permission Rules
  const canSeeProbationGroup =
    isSuperView(PerD) || isAdminLike || dateType === "0";

  // -------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/">
        <Header />
        <Navbar
          FullnamePer={fullnamePer}
          PerPST_N={PerPST_N}
          PerWP_N={PerWP_N}
        />

        <div className="content-wrapper" style={{ backgroundColor: "#fff" }}>
          <Routes>
            {/* ========== เมนูหลัก ========== */}
            <Route path="/" element={<Announcement />} />

            {/* ========== กลุ่มพนักงานทดลองงาน ========== */}
            {canSeeProbationGroup ? (
              <>
                <Route
                  path="/Salesperson"
                  element={
                    <Salesperson
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />

                <Route
                  path="/Sale_inputDataCredit"
                  element={
                    <Sale_inputDataCredit
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />

                <Route
                  path="/Sale_ExaminationCredit"
                  element={
                    <Sale_ExaminationCredit
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />

                <Route
                  path="/Sale_ExaminationCredit_Pass"
                  element={
                    <Sale_ExaminationCredit_Pass
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />

                <Route
                  path="/Sale_ExaminationCredit_Fail"
                  element={
                    <Sale_ExaminationCredit_Fail
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />

                <Route
                  path="/Sale_ExaminationCredit_Cancel"
                  element={
                    <Sale_ExaminationCredit_Cancel
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />

                <Route
                  path="/Sale_uploadphotoDataCredit"
                  element={
                    <Sale_uploadphotoDataCredit
                      FullnamePer={fullnamePer}
                      PerPhotoProfile_N={PerPhotoProfile_N}
                      PerPST_N={PerPST_N}
                      PerWP_N={PerWP_N}
                      PerD={PerD}
                    />
                  }
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}

            {/* อื่นๆ */}
            <Route
              path="/DataSolarRoofTops/AddDataForm"
              element={<AddSolarRoofTopForm />}
            />

            <Route path="/AdminViewPage" element={<AdminViewPage />} />

            {/* Admin */}
            <Route path="/Admin_Refuse" element={<Admin_Refuse />} />
            <Route path="/Admin_CheckCreditEdit" element={<Admin_CheckCreditEdit />} />
            <Route path="/Admin_ReportTableChkCredit" element={<Admin_ReportTableChkCredit />} />
            <Route path="/Admin_CheckCredit" element={<Admin_CheckCredit />} />

            {/* รายงาน */}
            <Route path="/reportNCBLiteMain" element={<ReportNCBLiteMain />} />
            <Route path="/reportNCBLiteDSRMain" element={<ReportNCBLiteDSRMain />} />
            <Route path="/ReportNCBLiteMainOut" element={<ReportNCBLiteMainOut />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
