import { NavLink } from 'react-router-dom';


const ReadDataInsurance = () => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="mt-2 row">
            <div className="col-md-6 text-left mb-2">
              <NavLink to="/AddInsuranceForm" type="button" className="text-white btn btn-outline-primary btn-sm font-weight-bold">
                <i className="fas fa-file-medical mr-1" /> เพิ่มรายการแจ้งข้อมูลประกันภัย
              </NavLink>
            </div>
            <div className="col-md-6 text-right mb-2">
              <button type="button" className="btn btn-warning btn-sm" data-role="Click_PullData"><i className="fas fa-sync-alt" /></button>
            </div>
          </div>
        </div>
        <div className="p-0 card-body table-responsive">
        <table className="table table-hover table-sm">
          <thead className="bg-primary">
            <tr>
              <th className="text-center font-weight-bold">ลำดับ</th>
              <th className="text-center font-weight-bold">เลขที่แบบฟอร์ม</th>
              <th className="text-center font-weight-bold">ชื่อ - นามสกุล ลูกค้า</th>
              <th className="text-center font-weight-bold">เลขบัตรประชาชน</th>
              <th className="text-center font-weight-bold">เบอร์โทร</th>
              <th className="text-center font-weight-bold">ประเภทประกัน</th>
              <th className="text-center font-weight-bold">ผู้บันทึกข้อมูล</th>
              <th className="text-center font-weight-bold">วัน/เวลา ที่บันทึก</th>
              <th className="text-center font-weight-bold">สถานะ</th>
            </tr>
          </thead>
          <tbody className="fadeIn">
            <tr >
              <td className="text-center"></td>
              <td className="text-left">
                
              </td>
              <td className="text-left">
                
              </td>
              <td className="text-center">
                
              </td>
              <td className="text-center">
              </td>
              <td className="text-left">
                
              </td>
              
              <td className="text-center">
                
              </td>
              <td className="text-center">
              
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <div className="card-footer">

        </div>
      </div>  
    </>
  )
}

export default ReadDataInsurance