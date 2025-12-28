import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";
import { useSearchParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"

import ReadData_Viewmain from "../../setreadDatas/mentor/ReadData_Viewmain";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

// const [searchParams] = useSearchParams();
import { useLocation } from "react-router-dom";

const DataFormReview = () => {
  // const { search } = useLocation();
  // const queryParams = new URLSearchParams(search);
  // const idemployee = queryParams.get("id");
  // const fullname = queryParams.get("fullname");
  // const position = queryParams.get("position");
  // const workplace = queryParams.get("workplace");
  // const startworkdate_PSN = queryParams.get("startworkdate_PSN");
  // const photo_PSN = queryParams.get("photo_PSN");
  

  const { state } = useLocation();
  const {
    idemployee,
    fullname,
    position,
    workplace,
    startworkdate_PSN,
    photo_PSN,
    ap_month,
  } = state || {};

  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
                <div className="col text-left">
                  <NavLink to="/ReadData_Litemain">
                    <b>
                      <i className="fas fa-reply"></i> ย้อนกลับ
                    </b>
                  </NavLink>
                </div>{" "}
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}>
                      <i className="fas fa-home"></i> หน้าหลัก
                    </a>
                  </li>
                  <li className="breadcrumb-item">รายงานการปฏิบัติงาน</li>
                  <li className="breadcrumb-item active">...</li>
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
   
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <ReadData_Viewmain
                  idemployee={idemployee}
                  fullname={fullname} 
                  position={position}
                  workplace={workplace}
                  startworkdate_PSN={startworkdate_PSN}
                  photo_PSN={photo_PSN}
                />
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
      </div>
    </>
  );
};

export default DataFormReview;
