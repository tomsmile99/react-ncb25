import { TiBusinessCard } from "react-icons/ti";
import { useState, useEffect } from "react";
import apiClient from "../../../recoilstore/userStores";
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
import { userToken } from "../../../recoilstore/userStores";
import { Base64 } from "js-base64";

const convertToThaiDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

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

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
};
const Header = () => {
  const token = useRecoilValue(userToken);

  const PerD = Base64.decode(token?.PerD || "");
  const PerTiNa = Base64.decode(token?.PerTiNa || "");
  const PerFuNas = Base64.decode(token?.PerFuNas || "");

  const [openAgreement, setOpenAgreement] = useState(false);
  const [agreement, setAgreement] = useState(null);
  const [loadingAgreement, setLoadingAgreement] = useState(true);

  // ==========================
  // GET ตรวจสอบข้อตกลง
  // ==========================
  const getAgreement = async () => {
    try {
      const { data } = await apiClient.get(
        `/api/insurances/agreement_status?id=${PerD}`,
      );

      const { status, sqlDataCustomers } = data;

      if (status === 200) {
        setAgreement(sqlDataCustomers);
        console.log(sqlDataCustomers);
      }
    } catch (error) {
      console.error("GET Agreement Error:", error);
    } finally {
      setLoadingAgreement(false);
    }
  };

  useEffect(() => {
    if (!PerD) return;

    getAgreement();
  }, [PerD]);
  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand navbar-dark"
        style={{ backgroundColor: "#002b57" }}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <div className="nav-link" data-widget="pushmenu" role="button">
              <i className="fas fa-bars" />
            </div>
          </li>
          {/* <li className="nav-item">
            <a href="https://appncar.sakerp.org/STC/file_dc_downloads/แบบฟอร์มใบสั่งจอง.pdf" className="nav-link font-weight-bold" target="_blank" rel="noreferrer"><i className="mr-1 fas fa-file-pdf" /> แบบฟอร์มใบสั่งจอง</a>
          </li> */}

          <li className="nav-item">
            <a
              href="/คู่มือการใช้ระบบตรวจสอบเครดิต.pdf"
              className="nav-link font-weight-bold"
              target="_blank"
            >
              <i className="mr-1 fas fa-book" />
              คู่มือการใช้งานระบบ
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/คู่มือการใช้งานระบบ สร้างใบนำส่ง.pdf"
              className="nav-link font-weight-bold"
              target="_blank"
            >
              <i className="mr-1 fas fa-book" />
              คู่มือการสร้างหนังสือนำส่ง
            </a>
          </li>

          <li className="nav-item">
            <a
              href="model"
              className="nav-link font-weight-bold"
              data-toggle="modal"
              data-target="#ContactModal"
            >
              <i className="mr-1 fas fa-phone-square-alt" />
              ติดต่อสอบถาม
            </a>
          </li>
          <li className="nav-item">
            <a
              href="model"
              className="nav-link font-weight-bold"
              data-toggle="modal"
              data-target="#ContactModal1"
            >
              <TiBusinessCard fontSize={18} /> ติดตั้งเครื่องเสียบบัตร
            </a>
          </li>

          <li className="nav-item">
            {/* <a
              href="/5. ข้อตกลงการเก็บรักษาความลับและการปกป้อง.pdf"
              className="nav-link font-weight-bold"
              target="_blank"
            > */}
            <a
              href="#"
              className="nav-link font-weight-bold"
              onClick={(e) => {
                e.preventDefault();
                setOpenAgreement(true);
              }}
            >
              <i className="mr-1 fas fa-book" />
              ข้อตกลงการปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตของลูกค้า
            </a>
          </li>
        </ul>
      </nav>
      {/* /.End Navbar */}

      <div
        className="modal fade"
        id="ContactModal"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content contact-modal">
            <div type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </div>

            <div className="modal-body text-center">
              {/* ===== คนที่ 1 ===== */}
              <div className="contact-card">
                <i className="fas fa-headset contact-icon support"></i>

                <h6 className="contact-title">
                  เจ้าหน้าที่ด้านงานตรวจสอบเครดิตลูกค้า
                </h6>

                <p className="contact-name">( เจ้าหน้าที่ NCB )</p>

                <div className="contact-actions">
                  <a href="tel:881800" className="contact-phone">
                    เบอร์ภายใน 881800
                  </a>
                  {/* <a href="tel:0891234567" className="contact-phone secondary">
              เบอร์ส่วนตัว 089-123-4567
            </a> */}
                </div>
              </div>

              {/* ===== คนที่ 2 ===== */}
              <div className="contact-card mt-4">
                <i className="fas fa-user-cog contact-icon"></i>

                <h6 className="contact-title">
                  ฝ่ายพัฒนาระบบส่งเสริมปฏิบัติการ
                </h6>

                <p className="contact-name">คุณศริวิมล ( Admin )</p>

                <div className="contact-actions">
                  <a href="tel:881511" className="contact-phone">
                    เบอร์ภายใน 881511
                  </a>
                  {/* <a href="tel:0613561012" className="contact-phone secondary">
              เบอร์ส่วนตัว 061-356-1012
            </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="ContactModal1"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content contact-modal">
            <div type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </div>

            <div className="modal-header">
              <h5 className="modal-title">
                <TiBusinessCard fontSize={18} /> ดาวน์โหลดโปรแกรมอ่านบัตรประชาชน
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>

            <div className="modal-body" style={{ width: "80%" }}>
              <table className="table">
                <thead style={{ background: "#FFC107" }}>
                  <tr>
                    <th style={{ width: "80px", textAlign: "center" }}>
                      ลำดับ
                    </th>
                    <th>ไฟล์ดาวน์โหลด</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td align="center">1</td>
                    <td>
                      <a href="https://www.sakerp.org/file_downloadprograms/id_card_reader_sakerp_windows_10_64_1.0.1_setup.exe">
                        ⬇ windows 10, 11 (64 bit)
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">2</td>
                    <td>
                      <a href="https://www.sakerp.org/file_downloadprograms/id_card_reader_sakerp_windows_10_86_1.0.0_setup.exe">
                        ⬇ windows 10 (32 bit)
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">3</td>
                    <td>
                      <a href="https://www.sakerp.org/file_downloadprograms/id_card_reader_sakerp_windows_7_64_1.0.1_setup.exe">
                        ⬇ windows 7 (64 bit)
                      </a>
                    </td>
                  </tr>
                  <tr className="table-active">
                    <td align="center">4</td>
                    <td>
                      <a href="https://www.sakerp.org/file_downloadprograms/id_card_reader_sakerp_windows_7_86_1.0.1_setup.exe">
                        ⬇ windows 7 (32 bit)
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openAgreement}
        onClose={() => setOpenAgreement(false)}
        maxWidth="md"
        fullWidth
      >
        {/* <DialogTitle>
                ข้อตกลงการปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตของลูกค้า
              </DialogTitle> */}

        <DialogContent dividers>
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
              จำกัด ฝ่ายหนึ่ง กับพนักงานผู้ที่มีสิทธิรับรู้หรือใช้ข้อมูลเครดิต
              อีกฝ่ายหนึ่ง มีรายละเอียด ดังนี้
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
              3.2 ห้ามส่งมอบรายงานข้อมูลเครดิตให้แก่ลูกค้าที่เป็นเจ้าของข้อมูล
              ผู้ค้ำประกัน
              หรือบุคคลที่ไม่ใช่เจ้าของข้อมูลไม่ว่าเป็นรูปแบบเอกสารหรือเป็นข้อมูลอิเล็กทรอนิกส์
              และไม่ให้ลูกค้าเข้าถึง หรือดูรายงานข้อมูลเครดิตผ่านหน้าจอเครื่อง
              Computer หรือ Tablet ของบริษัทฯ เนื่องจากอาจเข้าข่ายเปิดเผย
              หรือใช้ข้อมูลผิดไปจากวัตถุประสงค์ที่กฎหมายกำหนด
            </Typography>

            <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
              ข้อ 4 หน้าที่ของผู้ปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตลูกค้า
            </Typography>

            <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
              ใช้ข้อมูลเครดิตของลูกค้าเพื่อนำข้อมูลเครดิตมาใช้ในการประกอบการวิเคราะห์สินเชื่อเท่านั้น
            </Typography>

            <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
              ข้อ 5 หน้าที่ในการใช้ข้อมูลเครดิต
            </Typography>

            <Typography sx={{ fontSize: 20, textIndent: "2em", lineHeight: 2 }}>
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
              <Typography align="center" sx={{ fontSize: 20, fontWeight: 700 }}>
                บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
              </Typography>

              <Typography align="center" sx={{ fontSize: 20, fontWeight: 700 }}>
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
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAgreement(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
