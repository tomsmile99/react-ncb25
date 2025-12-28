import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";

//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"

import SalepersonView_Examination_Fail from "../../setreadDatas/salepersonView/SalepersonView_Examination_Fail";

import { MdOutlineCancel } from "react-icons/md";

import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { AiOutlineFileProtect } from "react-icons/ai";
const sale_ExaminationCredit_Fail = () => {
  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#010f3fff",
                  }}
                >
                  <MdOutlineCancel
                    style={{
                      marginRight: "5px",
                      color: "#010f3fff",
                      fontSize: "20px",
                    }}
                  />
                  รายการไม่ผ่านการอนุมัติสินเชื่อ
                </h1>{" "}
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}>
                      <i className="fas fa-home"></i> หน้าหลัก
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    รายการไม่ผ่านการอนุมัติสินเชื่อ
                  </li>
                  {/* <li className="breadcrumb-item active">...</li> */}
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <SalepersonView_Examination_Fail />
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default sale_ExaminationCredit_Fail;
