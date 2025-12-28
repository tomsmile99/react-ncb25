import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"
import { NavLink, useLocation } from "react-router-dom";

import AdminFinal_reporttable from "../../setreadDatas/admin/AdminFinal_reporttable";

const Admin_ReportTableChkCredit = () => {
  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-3 mt-2 align-items-center">
              <div className="col-sm-12 col-md-6 d-flex align-items-center">
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#3056d2",
                  }}
                >
                  <BiSolidMessageSquareEdit
                    style={{ marginRight: "6px", color: "#3056d2" }}
                  />
                  สรุปรายการตรวจสอบข้อมูลเครดิตลูกค้า
                </h1>
              </div>
              <div className="col-sm-12 col-md-6">
                <ol className="breadcrumb float-sm-right mb-0">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}>
                      <i className="fas fa-home"></i> หน้าหลัก
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    สรุปรายการตรวจสอบข้อมูลเครดิตลูกค้า
                  </li>
                </ol>
              </div>
            </div>

            <hr style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }} />

            {/* การ์ดสองใบซ้ายขวา */}
            <div className="row g-3">
             <AdminFinal_reporttable/>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default Admin_ReportTableChkCredit;
