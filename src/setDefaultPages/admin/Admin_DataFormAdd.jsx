import {BASE_URL_Dashboardd} from '../../apiUrl/Api_Url'
import { NavLink } from 'react-router-dom';
//import ReadDataInsurance from "../../setreadDatas/user/DataInsurance/ReadDataCard"

import AdminAdd_from from '../../setreadDatas/admin/AdminAdd_from';
import { BiSolidMessageSquareEdit } from "react-icons/bi";
const Admin_DataFormAdd = () => {
  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
              <div className="col text-left">
              <NavLink to="/Admin_Setting_from"><b><i className="fas fa-reply"></i> ย้อนกลับ</b></NavLink>
            </div>        </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}><i className="fas fa-home"></i> หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">เจ้าหน้าที่ปฏิบัติการ</li>
                  <li className="breadcrumb-item active">...</li>
                  {/* <li className="breadcrumb-item active">ข้อมูล..</li> */}
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
              <div className="col-md-12">
                <AdminAdd_from/>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
      </div>
    </>
  )
}

export default Admin_DataFormAdd