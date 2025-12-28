import { BASE_URL_Dashboardd } from "../../apiUrl/Api_Url";

//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"

import Mentor_Proposing_employees from "../../setreadDatas/mentor/Mentor_Proposing_employees";

import { BiSolidMessageSquareEdit } from "react-icons/bi";
const Mentor_proposing_employees = ({
  FullnamePer,
  PerPhotoProfile_N,
  PerPST_N,
  PerWP_N,
  PerD,
  PerWP,
}) => {
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
                  เสนอบรรจุพนักงาน (บันทึกข้อความ)
                </h1>{" "}
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}>
                      <i className="fas fa-home"></i> หน้าหลัก
                    </a>
                  </li>
                  <li className="breadcrumb-item">เสนอบรรจุพนักงาน</li>
                  {/* <li className="breadcrumb-item active">...</li> */}
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <Mentor_Proposing_employees
                  FullnamePer={FullnamePer}
                  PerPhotoProfile_N={PerPhotoProfile_N}
                  PerPST_N={PerPST_N}
                  PerWP_N={PerWP_N}
                  PerD={PerD}
                  PerWP={PerWP}
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

export default Mentor_proposing_employees;
