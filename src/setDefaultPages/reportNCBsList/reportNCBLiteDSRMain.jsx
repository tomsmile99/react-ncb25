import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"
import { NavLink, useLocation } from "react-router-dom";

import ReportNCBLiteMainDSR from "../../setreadDatas/reportExcellist/reportNCBLiteDSR";

const reportNCBLiteDSRMain = () => {
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
                   รายการรอการแก้ไขข้อมูลการตรวจสอบเครดิต
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
                     รายการรอการแก้ไขข้อมูลการตรวจสอบเครดิต
                  </li>
                </ol>
              </div>
            </div>
             <hr style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }} />
             <ReportNCBLiteMainDSR/>
           

          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default reportNCBLiteDSRMain;
