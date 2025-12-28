
import {encryptStorage} from '../security/EncryptStorage'
import Swal from 'sweetalert2'
import {BASE_URL_Login} from '../apiUrl/Api_Url'
// import Cookies from 'js-cookie';
// import { Base64 } from "js-base64";

//console.log(Base64.decode(Base64.decode(Cookies.get('userToken'))))
//console.log(Base64.decode(Base64.decode(JSON.parse(Cookies.get('userToken')))))
//const userToken = JSON.parse(Base64.decode(Base64.decode(Cookies.get('userToken'))))
//console.log(userToken._PerD)


/*
const userToken_AgU       = userToken._AgU
const userToken_PerD      = userToken._PerD
const userToken_PerTiNa   = userToken._PerTiNa
const userToken_PerFuNas  = userToken._PerFuNa
const _userToken_PerST    = userToken._PerST
const _userToken_PerPST   = userToken._PerPST

const _userToken_PerPST_LV   = userToken._PerPST_LV

const _userToken_PerWP    = userToken._PerWP
const _userToken_PerBL    = userToken._PerBL
const _userToken_PerRG    = userToken._PerRG

const _userToken_PerPST_N   = userToken._PerPST_N 
const _userToken_PerWP_N    = userToken._PerWP_N
const _userToken_PerBL_N    = userToken._PerBL_N
const _userToken_PerRG_N    = userToken._PerRG_N
*/

const itemUserToken = localStorage.getItem('userToken')
// console.log(itemUserToken)
if(itemUserToken == null){
  Swal.fire({
    icon: 'warning',
    title: 'สิทธิ์การเข้าถึงของท่านไม่ถูกต้อง',
    html: 'กรุณา Login เข้าใช้ระบบใหม่',
    confirmButtonText : 'ตกลง',
    confirmButtonColor : '#005b85' //
  }).then(() => {
    window.location.href = BASE_URL_Login
  })
}

  const userToken_AgU      = (encryptStorage.getMultipleItems(['userToken'])).userToken._AgU
  const userToken_PerD      = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerD
  const userToken_PerTiNa   = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerTiNa
  const userToken_PerFuNas  = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerFuNa
  const _userToken_PerST    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerST
  const _userToken_PerPST   = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerPST
  const _userToken_PerPST_LV   = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerPST_LV

  const _userToken_PerWP    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerWP
  const _userToken_PerBL    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerBL
  const _userToken_PerRG    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerRG

  const _userToken_PerPST_N   = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerPST_N 
  const _userToken_PerWP_N    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerWP_N
  const _userToken_PerBL_N    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerBL_N
  const _userToken_PerRG_N    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerRG_N

  const _userToken_PerExp_Token    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerExp_Token
  const _userToken_PerLast_Login    = (encryptStorage.getMultipleItems(['userToken'])).userToken._PerLast_Login

// console.log((encryptStorage.getMultipleItems(['userToken'])).userToken)




//console.log(userToken_PerD)

// eslint-disable-next-line react-refresh/only-export-components
const UserDetail = {
  AgU       : userToken_AgU, //AcGU_Group
  PerD      : userToken_PerD, //รหัสพนักงาน
  PerTiNa   : userToken_PerTiNa, //คำนำหน้าชื่อ
  PerFuNas  : userToken_PerFuNas, //ชื่อ-นามสกุลพนักงาน
  PerST     : _userToken_PerST, //สถานะ User
  PerPST    : _userToken_PerPST, //Code ตำแหน่ง
  PerPST_N  : _userToken_PerPST_N, //ชื่อ ตำแหน่ง
  PerPST_LV  : _userToken_PerPST_LV, //ระดับ ตำแหน่ง
  PerWP     : _userToken_PerWP, //Code พื้นที่ปฏิบัติงาน
  PerWP_N   : _userToken_PerWP_N, //ชื่อพื้นที่ปฏิบัติงาน
  PerBL     : _userToken_PerBL, //Code สังกัด
  PerBL_N     : _userToken_PerBL_N, //ชื่อ สังกัด
  PerRG     : _userToken_PerRG, //Code ภาค/สำนักงานใหญ่
  PerRG_N     : _userToken_PerRG_N, //ชื่อ ภาค/สำนักงานใหญ่
  PerExp_Token     : _userToken_PerExp_Token, //ชื่อ ภาค/สำนักงานใหญ่
  PerLast_Login     : _userToken_PerLast_Login, //ชื่อ ภาค/สำนักงานใหญ่
}

//console.log(UserDetail)

export const userReducer = (state = UserDetail) => {
  return state
}
