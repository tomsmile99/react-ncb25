import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";

//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"

import AdminView_Litemain_OutsideNcb from "../../setreadDatas/admin/AdminView_Litemain_OutsideNcb";


import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { AiOutlineFileProtect } from "react-icons/ai";
const Admin_CheckCredit_OutsideNcb = () => {
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
                  <AiOutlineFileProtect
                    style={{
                      marginRight: "5px",
                      color: "#010f3fff",
                      fontSize: "20px",
                    }}
                  />
                  อนุมัติการยื่นขอตรวจสอบนอกหลักเกณฑ์ ( เจ้าหน้าที่ NCB )
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
                    อนุมัติการยื่นขอตรวจสอบนอกหลักเกณฑ์ ( เจ้าหน้าที่ NCB )
                  </li>
                  {/* <li className="breadcrumb-item active">...</li> */}
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12"> 
                <AdminView_Litemain_OutsideNcb />
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default Admin_CheckCredit_OutsideNcb;
