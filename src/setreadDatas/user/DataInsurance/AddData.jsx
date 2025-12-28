import { NavLink } from 'react-router-dom';
//import { useForm, Controller } from "react-hook-form";

import { useForm } from 'react-hook-form';

const AddData = () => {

  /*
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur"
  },{ validateHiddenInputs: true });
  */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const sendForm = (data) => {

    const newdatas = {
      first: 'Wes',
      last: 'Bos',
    };

    const newData = {
      ...data,
      ...newdatas
    };

    console.log(newData)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="mt-2 row">
            <div className="col text-left mb-2">
              <NavLink to="/"><b><i className="fas fa-reply"></i> ย้อนกลับ</b></NavLink>
            </div>
            <div className="col text-right mb-2">
              <b><i className="fas fa-file-alt"></i> ฟอร์มแจ้งข้อมูลประกันภัย</b>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 mb-2">
              <div className="callout callout-primary col-md-12">
                <span className="font-weight-bold h6 mt-1">ส่วนที่ 1 : กรอกรายละเอียดข้อมูลลูกค้า</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(sendForm)}>
            <input {...register('firstName')} />
            <input {...register('lastName', { required: true })} />
            {errors.lastName && <p>Last name is required.</p>}
            <input {...register('age', { pattern: /\d+/ })} />
            {errors.age && <p>Please enter number for age.</p>}
            <input type="submit" />
          </form>


          <div className="mt-2 row mb-2">
            <div className="col-md-2 mb-3">
              <label htmlFor="NCB_TitleName_CTM_ADD">คำนำหน้าชื่อ ลูกค้า<span style={{color: 'red'}}>*</span> :</label>
              <select className="form-control cursor_P" name="NCB_TitleName_CTM_ADD" id="NCB_TitleName_CTM_ADD">
                <option value>- เลือกคำนำหน้าเชื่อ -</option>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
                <option value="OtherTitle_CT">อื่นๆ</option>
              </select><span className="myErrors" />
            </div>
            <div className="col-md-1 mb-3" id="showOtherTitle_CT">
              <label htmlFor="NCB_RankName_CTM_ADD">ระบุ<span style={{color: 'red'}}>*</span> :</label>
              <input type="text" className="form-control" name="NCB_RankName_CTM_ADD" id="NCB_RankName_CTM_ADD" maxLength={50} placeholder="ระบุ" /><span className="myErrors" />
            </div>
            <div className="col-lg-3 mb-3">
              <label className="fh" htmlFor="NCB_FristName_CTM_ADD">ชื่อจริงลูกค้า<span style={{color: 'red'}}>*</span> : </label>
              <input type="text" className="form-control NCB_FristName_CTM_ADD" id="NCB_FristName_CTM_ADD" name="NCB_FristName_CTM_ADD" maxLength={100} placeholder="กรอกชื่อจริงลูกค้า" /><span className="myErrors" />
            </div>
            <div className="col-lg-3 mb-3">
              <label className="fh" htmlFor="NCB_LastName_CTM_ADD">นามสกุลลูกค้า<span style={{color: 'red'}}>*</span> : </label>
              <input type="text" className="form-control NCB_LastName_CTM_ADD" id="NCB_LastName_CTM_ADD" name="NCB_LastName_CTM_ADD" maxLength={100} placeholder="กรอกนามสกุลลูกค้า" /><span className="myErrors" />
            </div>
            <div className="col-lg-3 mb-3">
              <label className="fh" htmlFor="NCB_IDCard_CTM_ADD">หมายเลขบัตรประชาชนลูกค้า (13 หลัก) <span style={{color: 'red'}}>*</span> : </label>
              <input className="form-control NCB_IDCard_CTM_ADD Checknum" type="text" id="NCB_IDCard_CTM_ADD" name="NCB_IDCard_CTM_ADD" maxLength={13}  placeholder="กรอกหมายเลขบัตรประชาชน 13 หลัก" /><span className="myErrors" />
            </div>
            <div className="col-lg-4 mb-3">
              <label className="fh" htmlFor="NCB_Day_CTM_ADD">วัน/เดือน/ปี พ.ศ. เกิดลูกค้า <span style={{color: 'red'}}>*</span>  : </label>
              <div className="form-inline">
                <select className="form-control cursor_P Data_Birthday_CTM_ADD" id="NCB_Day_CTM_ADD" name="NCB_Day_CTM_ADD" style={{width: '20%'}}>
                  <option value>วัน</option>
                </select>
                <span className="ml-1 mr-1" style={{fontSize: 9}}>-</span>
                <select className="form-control cursor_P Data_Birthday_CTM_ADD" id="NCB_Months_CTM_ADD" name="NCB_Months_CTM_ADD" style={{width: '40%'}}>
                  <option value>เดือน</option>
                </select>
                <span className="ml-1 mr-1" style={{fontSize: 9}}>-</span>
                <select className="form-control cursor_P Data_Birthday_CTM_ADD" id="NCB_Year_CTM_ADD" name="NCB_Year_CTM_ADD" style={{width: '30%'}}>
                  <option value>ปี</option>
                </select><span className="myErrors" />
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="NCB_Phone_CTM_ADD">หมายเลขโทรศัพท์ (10 หลัก)<span style={{color: 'red'}}>*</span> :</label>
              <input type="text" className="form-control col-md-10" name="NCB_Phone_CTM_ADD" id="NCB_Phone_CTM_ADD" maxLength={10} placeholder="กรอกหมายเลขโทรศัพท์ 10 หลัก" /><span className="myErrors" />	
            </div>
          </div>{/* /.row */}

        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-md-6 text-left mb-2">
              <div className="textRed">วัน/เวลา ที่บันทึกข้อมูล : 
                <span className="fb"> {new Date().toLocaleString() + " น."}</span>
              </div>
            </div>
            <div className="col-md-6 text-right">
              <button type="submit" className="btn btn-primary btn-sm mr-2" id="Confrim_SaveForm"><span style={{fontSize: '10pt', fontWeight: 'bold'}}><i className="far fa-save" /> บันทึกข้อมูล</span></button>
              <button type="button" className="btn btn-primary btn-sm disabled" id="Confrim_SaveForm_wait" style={{display: 'none'}}><span style={{fontSize: '10pt', fontWeight: 'bold'}}> <span className="mb-1 spinner-border spinner-border-sm" role="status" aria-hidden="true" /> กรุณารอสักครู่..</span></button>

              <NavLink to="/" type="button" className="btn btn-sm btn-secondary" id="btnback">
                <span style={{fontSize: '10pt', fontWeight: 'bold'}}>ยกเลิก</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>  
    </>
  )
}

export default AddData