import { NavLink } from 'react-router-dom';
import {BASE_URL_Dashboardd} from '../../../apiUrl/Api_Url'


import AddData from '../../../setreadDatas/user/DataInsurance/AddData';





const AddDataInsurance = () => {
  return (
    <>
      <div className="fadeIn">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
                <h1 style={{fontWeight: 'bold'}}><i className="fas fa-file-medical"></i> เพิ่มรายการแจ้งข้อมูลประกันภัย</h1>
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}><i className="fas fa-home"></i> หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">ระบบบริหารจัดการงานประกันภัย</li>
                  <li className="breadcrumb-item">
                    <NavLink to="/">
                      รายการแจ้งข้อมูลประกันภัย
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item active">เพิ่มรายการแจ้งข้อมูลประกันภัย</li>
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2">
              <div className="col-md-12">
                <AddData/>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
      </div>
    </>
  )
}

export default AddDataInsurance