import { NavLink } from 'react-router-dom';
import {BASE_URL_Dashboardd} from '../../../apiUrl/Api_Url'
// import AddData from '../../../setreadDatas/jobsolarrooftop/Datasolarrooftops/AddData';


const AddForm = () => {
  return (
    <>
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2 mt-2">
              <div className="col-sm-12 col-md-4">
                <h1 style={{fontWeight: 'bold'}}><i className="fas fa-file-medical"></i> ยื่นใบจองโซลาร์รูฟท็อป</h1>
              </div>
              <div className="col-sm-12 col-md-8">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href={BASE_URL_Dashboardd}><i className="fas fa-home"></i> หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">ระบบบริหารจัดการงานการตลาด</li>
                  <li className="breadcrumb-item">งานขายโซลาร์รูฟท็อป</li>
                  <li className="breadcrumb-item">
                    <NavLink to="/DataSolarRoofTops">
                      ข้อมูลใบจองโซลาร์รูฟท็อป
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item active">ยื่นใบจองโซลาร์รูฟท็อป</li>
                </ol>
              </div>
            </div>
            <hr />
            <div className="row mb-2 fadeIn">
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

export default AddForm