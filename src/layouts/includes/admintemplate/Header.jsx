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

          {/* <li className="nav-item">
            <a href="model" className="nav-link font-weight-bold" data-toggle="modal" data-target="#ManualModal"><i className="mr-1 fas fa-book" /> คู่มือการใช้งานระบบ</a>
          </li>

          <li className="nav-item">
            <a href="model" className="nav-link font-weight-bold" data-toggle="modal" data-target="#ContactModal"><i className="mr-1 fas fa-phone-square-alt" /> ติดต่อสอบถาม</a>
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
              ข้อ 4 หน้าที่ของผู้ปฏิบัติงานที่เกี่ยวข้องกับข้อมูลเครดิตลูกค้า
            </Typography>

            <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
              เข้าใจ รับทราบ
              บทบาทหน้าที่ในการปฏิบัติงานเกี่ยวข้องกับข้อมูลเครดิตลูกค้า
              และปฏิบัติหน้าที่ตามข้อกำหนด อย่างเคร่งครัด ตามหนังสือดังต่อไปนี้
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
                สัญญาให้บริการสมาชิก ระหว่าง บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด
                และบริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
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
              และบริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน) ลงวันที่ 20 มกราคม 2566
            </Typography>

            <Typography sx={{ fontSize: 22 }} fontWeight={700} gutterBottom>
              ข้อ 5 ความรับผิดของพนักงานต่อบริษัทฯ
            </Typography>

            <Typography sx={{ fontSize: 20, textIndent: "2em" }}>
              กรณีที่พนักงานฝ่าฝืนข้อกำหนดตามข้อตกลงนี้
              และก่อให้เกิดความเสียหายแก่เจ้าของข้อมูลเครดิต อันเนื่อง
              สาเหตุเกิดจากพนักงานโดยตรงจะต้องชดใช้ค่าเสียหายให้แก่เจ้าของข้อมูลเครดิตเช่นว่านั้นเองทั้งสิ้น
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
                  agreement?.[0]?.NCB_Agreement_Admin_Confirm_Datetime,
                )}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAgreement(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>


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
      {/* /.End Navbar */}
    </>
  );
};

export default Header;
