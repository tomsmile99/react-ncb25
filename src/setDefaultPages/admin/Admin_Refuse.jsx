import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";

//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"

import AdminSetData_Refuse from "../../setreadDatas/admin/AdminSetData_Refuse";

import { BiSolidMessageSquareEdit } from "react-icons/bi";
const Admin_Refuse = () => {
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
                    color: "#3056d2",
                  }}
                >
                  <BiSolidMessageSquareEdit 
                    style={{ marginRight: "5px", color: "#3056d2" }}
                  />
                  รายการรอตรวจสอบข้อมูลเครดิตลูกค้า
                </h1>{" "}
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}>
                      <i className="fas fa-home"></i> หน้าหลัก
                    </a>
                  </li>
                  <li className="breadcrumb-item">รายการรอตรวจสอบข้อมูลเครดิตลูกค้า</li>
                  {/* <li className="breadcrumb-item active">...</li> */}
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <AdminSetData_Refuse />
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default Admin_Refuse;
