import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SalepersonView_updatephoto from "../../setreadDatas/salepersonView/SalepersonView_updatephoto";

//ฟังก์ชันสร้างเลขที่แบบฟอร์ม
const generateFormNo = (prefix = "CTM-NCB") => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  // รูปแบบ: PREFIX-YYYYMMDD-HHMM-#####  เช่น NCB-20251107-1315-48329
  const datestamp = `${y}${m}${day}-${hh}${mm}`;
  const rnd = Math.floor(10000 + Math.random() * 90000); // 5-digit random
  return `${prefix}-${datestamp}-${rnd}`;
};

const sale_EditDataCredit = () => {

  const { CTM_Idnumber } = useParams();


  // console.log("✅ รับค่าฟอร์ม:", CTM_Idnumber);
  const [formNo, setFormNo] = useState(() => generateFormNo("CTM-NCB"));


  useEffect(() => {
    console.log("✅ CTM_Idnumber ที่รับมา:", CTM_Idnumber);
  }, []);

  const handleRegenerate = () => {
    setFormNo(generateFormNo("CTM-NCB"));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formNo);
      alert("คัดลอกแล้ว: " + formNo);
    } catch (e) {
      alert("คัดลอกไม่สำเร็จ — กรุณาลองอีกครั้ง");
    }
  };

  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
                <NavLink to="/Salesperson">
                  <b>
                    <i className="fas fa-reply"></i> ย้อนกลับ
                  </b>
                </NavLink>
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    {/* <a href={BASE_URL_Dashboardd}>
                      <i className="fas fa-home"></i> หน้าหลัก
                    </a> */}
                  </li>
                  <li className="">
                    ฟอร์มแจ้งขอตรวจสอบข้อมูลเครดิตลูกค้า เลขที่แบบฟอร์ม{" "}
                    <span
                      style={{
                        color: "#022D58",
                        fontWeight: 400,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: "#f2f3f3ff",
                      }}
                    >
                     {CTM_Idnumber}
                    </span>
                  </li>
                  {/* <li className="breadcrumb-item active">...</li> */}
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <SalepersonView_updatephoto idForm={CTM_Idnumber}  />
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default sale_EditDataCredit;
