import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";

import { useRecoilValue } from "recoil";
import { userToken } from "./recoilstore/userStores";
import { Base64 } from "js-base64";
import apiClient from "./recoilstore/userStores";
import AuthRouter from "./AuthRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
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

import Sale_ManagementUser from "./setDefaultPages/salesperson/sale_ManagementUser";

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
// import Admin_ManagementCustomType from "./setDefaultPages/admin/Admin_ManagementCustomType";

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
  const token = useRecoilValue(userToken);

  const PerTiNa = Base64.decode(token?.PerTiNa || "");
  const PerFuNas = Base64.decode(token?.PerFuNas || "");

  const PerD = Base64.decode(token?.PerD || "");
  const PerWP = Base64.decode(token?.PerWP || "");

  const [agreement, setAgreement] = useState(null);
  const [loadingAgreement, setLoadingAgreement] = useState(true);
  const [openAgreement, setOpenAgreement] = useState(false);

  const adminWP = ["WP1073", "WP1031"];
  const isAdminWP = adminWP.includes(PerWP);
  const agreementImage = adminWP.includes(PerWP)
    ? "/ข้อตกลงแอดมิน.png"
    : "/ข้อตกลงสาขาหน่วย.png";

  // ==========================
  // GET ตรวจสอบข้อตกลง
  // ==========================
  // const role = localStorage.getItem("role"); // user หรือ admin
  const getAgreement = async () => {
    try {
      const role = localStorage.getItem("role")?.trim().toLowerCase();

      // console.log("ROLE =", role);

      // role ยังไม่พร้อม → ยังไม่ตรวจ Agreement
      if (role !== "admin" && role !== "user") {
        console.warn("Role ยังไม่พร้อม:", role);
        return;
      }

      const { data } = await apiClient.get(
        `/api/insurances/agreement_status?id=${PerD}`,
      );

      const { status, sqlDataCustomers } = data;

      if (status === 200 && sqlDataCustomers?.length > 0) {
        const customer = sqlDataCustomers[0];

        // console.log("Agreement Data =", customer);

        const agreementField =
          role === "admin"
            ? "NCB_Agreement_Admin_Confirm"
            : "NCB_Agreement_EM_Confirm";

        const agree = Number(customer[agreementField]);

        // console.log("agreementField =", agreementField);
        // console.log("agree =", agree);

        setAgreement(agree);

        // ⭐ กำหนดทั้ง true และ false
        setOpenAgreement(agree === 0);
      }
    } catch (error) {
      console.error("GET Agreement Error:", error);
    } finally {
      setLoadingAgreement(false);
    }
  };

  // ==========================
  // POST ยินยอมข้อตกลง
  // ==========================
  const handleAcceptAgreement = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการยอมรับข้อตกลง",
      text: "เมื่อกดยืนยัน ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อตกลงการใช้งานระบบเรียบร้อยแล้ว",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#9ca3af",
      reverseButtons: true,
      allowOutsideClick: false,

      customClass: {
        container: "swal-agreement-container",
        popup: "swal-agreement-popup",
      },
    });

    if (!result.isConfirmed) return;

    const role = localStorage.getItem("role")?.trim().toLowerCase();

    if (role !== "admin" && role !== "user") {
      Swal.fire({
        icon: "error",
        title: "ไม่พบสิทธิ์ผู้ใช้งาน",
        text: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      const { data } = await apiClient.post(
        "/api/insurances/datacustomers/updateData_NCB_Agreement",
        {
          id: PerD,
          role,
        },
      );

      if (data.status === 200) {
        setAgreement("1");
        setOpenAgreement(false);

        Swal.fire({
          icon: "success",
          title: "ยินยอมเรียบร้อย",
          text: "ขอบคุณที่ยอมรับข้อตกลงการใช้งาน",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("POST Agreement Error:", error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกการยินยอมได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#0f172a",
      });
    }
  };

  useEffect(() => {
    if (!PerD) return;

    getAgreement();
  }, [PerD]);

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
                  path="/sale_ManagementUser"
                  element={<Sale_ManagementUser />}
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

{/*                 
                <Route
                  path="/Admin_ManagementCustomType"
                  element={<Admin_ManagementCustomType />}
                /> */}


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

        <Dialog
          open={openAgreement}
          maxWidth="md"
          fullWidth
          disableEscapeKeyDown
        >
          {/* <DialogTitle
            sx={{
              fontSize: 16,
              fontWeight: 700,
              pb: 1,
              textAlign: "center",
              borderBottom: "1px solid #ececec",
            }}
          >
            รายละเอียดข้อตกลง
          </DialogTitle> */}

          <DialogContent dividers>
            {isAdminWP ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  p: 4,
                  borderRadius: 2,
                  lineHeight: 1.9,
                  fontSize: 22,
                  color: "#333",
                  fontFamily: '"THSarabunPSK", sans-serif',

                  "& *": {
                    fontFamily: '"THSarabunPSK", sans-serif !important',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  align="center"
                  gutterBottom
                >
                  ข้อตกลงการปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตของลูกค้า
                </Typography>

                <Typography paragraph sx={{ fontSize: 20, textIndent: "2em" }}>
                  ข้อตกลงฉบับนี้ จัดทำขึ้นระหว่างบริษัท ศักดิ์สยามลิสซิ่ง จำกัด
                  (มหาชน) ในฐานะสมาชิกผู้ใช้ข้อมูลเครดิตจากบริษัท
                  ข้อมูลเครดิตแห่งชาติ จำกัด ฝ่ายหนึ่ง
                  กับพนักงานที่ปฏิบัติงานในฝ่ายตรวจสอบข้อมูลเครดิต อีกฝ่ายหนึ่ง
                  มีรายละเอียด ดังนี้
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 1 วัตถุประสงค์
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  เนื่องจากพนักงานในฝ่ายตรวจสอบข้อมูลเครดิต
                  เป็นผู้ปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตลูกค้า
                  มีสิทธิรับรู้และเข้าถึงข้อมูลเครดิตของลูกค้า บริษัทฯ
                  จึงประสงค์ให้พนักงานเก็บรักษาความลับและการปกป้องข้อมูลเครดิตของ
                  ลูกค้าตามข้อ 2 ไว้เป็นข้อมูลที่เป็นความลับภายใต้ข้อตกลงนี้
                </Typography>

                <Typography sx={{ fontSize: 20 }} fontWeight={700} gutterBottom>
                  ข้อ 2 ข้อมูลที่เป็นความลับ
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  "ข้อมูลที่เป็นความลับ" หมายความว่า
                  ข้อมูลเครดิตของลูกค้าที่ได้จากระบบข้อมูลเครดิตบุคคลธรรมดา ของ
                  บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 3 การรักษาความลับของข้อมูล
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  3.1 ป้องกันมิให้บุคคลใด ๆ
                  รวมถึงพนักงานตำแหน่งอื่นที่ไม่มีสิทธิรับรู้หรือใช้ข้อมูลเครดิต
                  เข้ามาใช้หรือเข้าถึง ข้อมูลเครดิต
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  3.2 ไม่เข้าไปดูข้อมูลเครดิตของลูกค้าสินเชื่อรายใดๆ
                  เว้นแต่จะได้รับความยินยอมเป็นหนังสือจากเจ้าของข้อมูลและเป็นลูกค้าที่มีการขอสินเชื่อจากบริษัทเท่านั้น
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  3.3 ห้ามส่งมอบรายงานข้อมูลเครดิตให้แก่บุคคลที่ไม่เกี่ยวข้อง
                  ไม่ว่าเป็นรูปแบบเอกสารหรือเป็นข้อมูล อิเล็กทรอนิกส์
                  เนื่องจากอาจเข้าข่ายเปิดเผย
                  หรือใช้ข้อมูลผิดไปจากวัตถุประสงค์ที่กฎหมายกำหนด
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 4
                  หน้าที่ของผู้ปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตลูกค้า
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  เข้าใจ รับทราบ
                  บทบาทหน้าที่ในการปฏิบัติงานเกี่ยวข้องกับข้อมูลเครดิตลูกค้า
                  และปฏิบัติหน้าที่ตามข้อกำหนด อย่างเคร่งครัด
                  ตามหนังสือดังต่อไปนี้
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  4.1{" "}
                  <Link
                    href="https://appncar.sakerp.org/NCB/00-file_documents/01-สัญญาให้บริการสมาชิก.pdf" // เปลี่ยนเป็นลิงก์จริง
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    sx={{ fontSize: 20 }}
                    fontWeight={700}
                  >
                    สัญญาให้บริการสมาชิก ระหว่าง บริษัท ข้อมูลเครดิตแห่งชาติ
                    จำกัด และบริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                  </Link>{" "}
                  ลงวันที่ 20 มกราคม 2566
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  4.2
                  <Link
                    href="https://appncar.sakerp.org/NCB/00-file_documents/02-ซักซ้อมความเข้าใจหน้าที่ของสมาชิกก่อนใช้.pdf" // เปลี่ยนเป็นลิงก์จริง
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    sx={{ fontSize: 20 }}
                    fontWeight={700}
                  >
                    {" "}
                    หนังสือบริษัท ข้อมูลเครดิตแห่งชาติ จำกัด ที่ NCB-CP/A
                    54-16/2566{" "}
                  </Link>{" "}
                  วันที่ 18 มกราคม 2566 เรื่อง
                  ซักซ้อมความเข้าใจหน้าที่ของสมาชิกก่อนใช้ข้อมูลเครดิต
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  4.3{" "}
                  <Link
                    href="https://appncar.sakerp.org/NCB/00-file_documents/03-บันทึกข้อตกลง SAK _ NCB.pdf" // เปลี่ยนเป็นลิงก์จริง
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    sx={{ fontSize: 20 }}
                    fontWeight={700}
                  >
                    บันทึกข้อตกลง ในการอำนวยความสะดวกให้สมาชิกของบริษัท
                    ข้อมูลเครดิตแห่งชาติ จำกัด
                  </Link>{" "}
                  เชื่อมโยงข้อมูล บุคคลล้มละลายจากฐานข้อมูลของกรมบังคับคดี
                  กระทรวงยุติธรรม ระหว่าง บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด
                  และบริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน) ลงวันที่ 20 มกราคม
                  2566
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 5 ความรับผิดของพนักงานต่อบริษัทฯ
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  กรณีที่พนักงานฝ่าฝืนข้อกำหนดตามข้อตกลงนี้
                  และก่อให้เกิดความเสียหายแก่เจ้าของข้อมูลเครดิต อันเนื่อง
                  สาเหตุเกิดจากพนักงานโดยตรงจะต้องชดใช้ค่าเสียหายให้แก่เจ้าของข้อมูลเครดิตเช่นว่านั้นเองทั้งสิ้น
                </Typography>

                <Typography
                  align="right"
                  sx={{
                    mt: 5,
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                </Typography>

                {/* <Typography
                  align="right"
                  sx={{
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {PerTiNa} {PerFuNas}
                </Typography>

                <Typography
                  align="right"
                  sx={{
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                </Typography> */}
              </Box>
            ) : (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  p: 4,
                  borderRadius: 2,
                  lineHeight: 1.9,
                  fontSize: 22,
                  color: "#333",
                  fontFamily: '"THSarabunPSK", sans-serif',

                  "& *": {
                    fontFamily: '"THSarabunPSK", sans-serif !important',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  align="center"
                  gutterBottom
                >
                  ข้อตกลงการเก็บรักษาความลับ
                  การปกป้องข้อมูลและการใช้ข้อมูลเครดิตของลูกค้า
                </Typography>

                <Typography paragraph sx={{ fontSize: 20, textIndent: "2em" }}>
                  ข้อตกลงฉบับนี้ จัดทำขึ้นระหว่างบริษัท ศักดิ์สยามลิสซิ่ง จำกัด
                  (มหาชน) ในฐานะผู้ใช้ข้อมูลเครดิตจากบริษัท ข้อมูลเครดิตแห่งชาติ
                  จำกัด ฝ่ายหนึ่ง
                  กับพนักงานผู้ที่มีสิทธิรับรู้หรือใช้ข้อมูลเครดิต อีกฝ่ายหนึ่ง
                  มีรายละเอียด ดังนี้
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 1 วัตถุประสงค์
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  เนื่องจากพนักงานเป็นผู้ที่ปฏิบัติงาน
                  ที่มีสิทธิรับรู้หรือใช้ข้อมูลเครดิตของลูกค้า บริษัทฯ
                  จึงประสงค์ให้พนักงาน
                  เก็บรักษาความลับและการปกป้องข้อมูลเครดิตของลูกค้าตามข้อ 2
                  ไว้เป็นข้อมูลที่เป็นความลับภายใต้ข้อตกลงนี้
                </Typography>

                <Typography sx={{ fontSize: 20 }} fontWeight={700} gutterBottom>
                  ข้อ 2 ข้อมูลที่เป็นความลับ
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  "ข้อมูลที่เป็นความลับ" หมายความว่า
                  ข้อมูลเครดิตของลูกค้าที่พนักงานได้รับรายงานผลการตรวจสอบข้อมูล
                  เครดิต จากฝ่ายตรวจสอบข้อมูลเครดิต
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 3 การรักษาความลับของข้อมูล
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  3.1 ป้องกันมิให้บุคคลใด ๆ
                  รวมถึงพนักงานตำแหน่งอื่นที่ไม่มีสิทธิรับรู้หรือใช้ข้อมูลเครดิต
                  เข้ามาใช้หรือเข้าถึง ข้อมูลเครดิต
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  3.2
                  ห้ามส่งมอบรายงานข้อมูลเครดิตให้แก่ลูกค้าที่เป็นเจ้าของข้อมูล
                  ผู้ค้ำประกัน
                  หรือบุคคลที่ไม่ใช่เจ้าของข้อมูลไม่ว่าเป็นรูปแบบเอกสารหรือเป็นข้อมูลอิเล็กทรอนิกส์
                  และไม่ให้ลูกค้าเข้าถึง
                  หรือดูรายงานข้อมูลเครดิตผ่านหน้าจอเครื่อง Computer หรือ Tablet
                  ของบริษัทฯ เนื่องจากอาจเข้าข่ายเปิดเผย
                  หรือใช้ข้อมูลผิดไปจากวัตถุประสงค์ที่กฎหมายกำหนด
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 4
                  หน้าที่ของผู้ปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตลูกค้า
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  ใช้ข้อมูลเครดิตของลูกค้าเพื่อนำข้อมูลเครดิตมาใช้ในการประกอบการวิเคราะห์สินเชื่อเท่านั้น
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 5 หน้าที่ในการใช้ข้อมูลเครดิต
                </Typography>

                <Typography
                  sx={{ fontSize: 20, textIndent: "2em", lineHeight: 2 }}
                >
                  ดำเนินการให้ลูกค้าให้ความยินยอมในการเปิดเผยข้อมูลเครดิต
                  ตามแบบที่บริษัทฯ กำหนด และจัดส่งต้นฉบับ
                  หนังสือความยินยอมในการเปิดเผยข้อมูลเครดิต
                  มายังฝ่ายตรวจสอบข้อมูลเครดิต (สำนักงานใหญ่)
                  โดยยื่นตรวจสอบข้อมูลเครดิตในรอบ
                </Typography>

                <Box sx={{ pl: 6, mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: 350,
                      fontSize: 20,
                      // mb: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 20 }}>
                      <b>วันศุกร์ วันจันทร์ และวันอังคาร</b>
                    </Typography>

                    <Typography sx={{ fontSize: 20 }}>
                      ให้รวบรวมส่งภายใน <b>"วันพุธ"</b>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: 356,
                      fontSize: 20,
                    }}
                  >
                    <Typography sx={{ fontSize: 20 }}>
                      <b>วันพุธและวันพฤหัสบดี</b>
                    </Typography>

                    <Typography sx={{ fontSize: 20 }}>
                      ให้รวบรวมส่งภายใน <b>"วันศุกร์"</b>
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 20,
                    pl: 6,
                    mt: 1,
                    fontWeight: 700,
                  }}
                >
                  หากมีวันหยุดพิเศษให้ส่งตามรอบที่ฝ่ายตรวจสอบข้อมูลเครดิตกำหนด
                </Typography>

                <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
                  ข้อ 6 ความรับผิดของพนักงานต่อบริษัทฯ
                </Typography>

                <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
                  กรณีที่พนักงานฝ่าฝืนข้อกำหนดตามข้อตกลงนี้
                  และก่อให้เกิดความเสียหายแก่บริษัทฯ หรือเจ้าของข้อมูลเครดิต
                  พนักงานจะต้องชดใช้ค่าเสียหายที่เกิดขึ้นเช่นว่านั้นเองทั้งสิ้น
                </Typography>

                <Box
                  sx={{
                    width: 350, // ปรับตามต้องการ
                    ml: "auto", // ดันบล็อกไปชิดขวา
                    mt: 5,
                  }}
                >
                  <Typography
                    align="center"
                    sx={{ fontSize: 20, fontWeight: 700 }}
                  >
                    บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                  </Typography>

                  {/* <Typography align="center" sx={{ fontSize: 20, fontWeight: 700 }}>
                             {PerTiNa}
                             {PerFuNas}
                           </Typography>
             
                           <Typography
                             align="center"
                             sx={{
                               fontSize: 20,
                               fontWeight: 900,
                               color: "#2e7d32", // สีเขียว
                             }}
                           >
                             ยืนยันเมื่อ{" "}
                             {convertToThaiDate(
                               agreement?.[0]?.NCB_Agreement_EM_Confirm_Datetime,
                             )}
                           </Typography> */}
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              borderTop: "1px solid #ececec",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => {
                window.location.href =
                  "https://appncar.sakerp.org/systemApp/dashboard";
              }}
              sx={{
                color: "#666",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              ไม่ยินยอม
            </Button>

            <Button
              variant="contained"
              onClick={handleAcceptAgreement}
              sx={{
                textTransform: "none",
                px: 4,
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1e293b",
                  boxShadow: "none",
                },
              }}
            >
              ยินยอมและเริ่มใช้งาน
            </Button>
          </DialogActions>
        </Dialog>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
