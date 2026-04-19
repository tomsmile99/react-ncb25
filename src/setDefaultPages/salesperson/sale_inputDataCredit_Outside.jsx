import React, { useEffect, useState } from "react";
import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";
import { AiOutlineFileProtect } from "react-icons/ai";
import { TbArrowBack } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import SalepersonView_addDataOutside from "../../setreadDatas/salepersonView/SalepersonView_addDataOutside";
import apiClient from "../../recoilstore/userStores";
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
 
const Sale_CheckCredit = () => {


const [formNo, setFormNo] = useState("");
const getEmployeeDB_Admin = async (page) => {
   
    try {
      const { data } = await apiClient.get(`/api/insurances/dataDataGencode`);

      const {
        status,
        customer_code,
      } = data;

      if (status) {

        // console.log(customer_code);
        setFormNo(customer_code);
      
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };



  useEffect(() => {
    getEmployeeDB_Admin();
  }, []);
  

   
  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
                <NavLink to="/SalepersonView_Litemain_Outside">
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
                    {/* ฟอร์มแจ้งขอตรวจสอบข้อมูลเครดิตลูกค้า เลขที่แบบฟอร์ม{" "}
                    <span
                      style={{
                        color: "#022D58",
                        fontWeight: 400,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: "#f2f3f3ff",
                      }}
                    >
                      {formNo}
                    </span> */}
                  </li>
                  {/* <li className="breadcrumb-item active">...</li> */}
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <SalepersonView_addDataOutside  idForm={formNo}/>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default Sale_CheckCredit;
