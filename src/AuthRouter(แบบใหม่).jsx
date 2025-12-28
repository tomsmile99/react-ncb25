import { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
// import { userTokenState } from './recoilstore/userStores'
import { userToken } from "./recoilstore/userStores";
import { useNavigate, useLocation } from "react-router-dom";
import { Base64 } from "js-base64";
import Swal from "sweetalert2";


import CryptoJS from "crypto-js"
import {encryptStorage} from './security/EncryptStorage'

export default function AuthRouter() {

  const setUserToken = useSetRecoilState(userToken)
  //const token = useRecoilValue(userToken);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  //const hasRedirected = useRef(false);

  // 🔓 PUBLIC PATH (ไม่บังคับ login / ไม่ redirect)
  // const publicRoutes = [
  //   /^\/DataReportDSRs\/.+$/, // รองรับ param
  // ];

  // const isPublicRoute = publicRoutes.some((regex) =>
  //   regex.test(location.pathname)
  // );

  useEffect(() => {
    // ✅ ถ้าเป็น public route → ปล่อยผ่าน
    // if (isPublicRoute) {
    //   setLoading(false);
    //   return;
    // }

    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    //console.log('1')

    // สมมติว่าคุณอาจจะเช็ค token จาก localStorage หรือ API ก็ได้
    // setTimeout(() => {
    //   setLoading(false); 
    // }, 1000); // จำลอง delay

    if (tokenParam){ // กรณี Login หรือ กดเข้าระบบ มาใหม่
      const decoded = decodeURIComponent(tokenParam)

      // ถอดรหัส (decrypt) ด้วย key เดียวกับตอน encrypt
      const bytes = CryptoJS.AES.decrypt(decoded, "secret-key-value")
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8)
      encryptStorage.setItem("userToken", decryptedToken) // เก็บ token แบบเข้ารหัส

      try {
        // แปลง string → object
        const decodedObj = JSON.parse(decryptedToken)

        // เก็บเข้ารหัสใน storage + update Recoil
        encryptStorage.setItem("userToken", decodedObj)
        

        console.log("✅ Token Updated:", decodedObj)
        console.log(Base64.decode(decodedObj._AgU))

        /*
        const fullnamePer = Base64.decode(decodedObj._PerFuNas || "")
        const _PerST = Base64.decode(decodedObj._PerST || "")
        const _AgU = Base64.decode(decodedObj._AgU || "")
        const _PerRG = Base64.decode(decodedObj._PerRG || "")
        const _PerWP = Base64.decode(decodedObj._PerWP || "")
        const _PerExp_Token = Base64.decode(decodedObj._PerExp_Token || "")

        if (_PerExp_Token * 1000 < Date.now()) {
          Swal.fire({
            icon: "warning",
            title: "Token หมดอายุ",
            text: "กรุณา Login ใหม่",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005b85",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            //window.location.href = "https://appncar.sakerp.org/";
          });

          return;
        }
        
        //   // ✅ เช็คสิทธิ์
        const userRG = ["1", "2", "3", "4", "5"];
        const adminWP = ["WP1073", "WP1031"];

        const isUser = userRG.includes(_PerRG) && _PerST === "1";
        const isAdmin =
          adminWP.includes(_PerWP) || (_AgU === "AGAD" && _PerST === "1");

        setUserToken(decodedObj)
        */

        /*
        let role = "guest";
        if (isAdmin) role = "admin";
        else if (isUser) role = "user";

        if (role === "guest") {
          Swal.fire({
            icon: "warning",
            title: "ไม่มีสิทธิ์เข้าใช้งาน",
            confirmButtonColor: "#005b85",
          });
          return;
        }

        localStorage.setItem("role", role);
        console.log(`${role.toUpperCase()} เข้าระบบโดย : ${fullnamePer}`);

        // ✅ redirect แค่ครั้งเดียว
        //hasRedirected.current = true;

        navigate(role === "admin" ? "/Admin_CheckCredit" : "/Salesperson", {
          replace: true,
        });
        */

        // console.log('1 : '+ _PerST)
        // console.log('1 : '+ _AgU)
        // console.log('1 : '+ _PerRG)
        // console.log('1 : '+ _PerWP)
        // console.log('1 : '+ _PerExp_Token)

        // const checkArr_PerRG = ["1","2","3","4","5"]; // เฉพาะ สาขา/หน่วย
        // let resultCheckUser = checkArr_PerRG.includes(_PerRG);

        // const checkArr_PerAdmin = ["WP0013"]; // เฉพาะ ฝ่ายประกัน
        // let resultCheckAdmin = checkArr_PerAdmin.includes(_PerWP);

        // if(_PerExp_Token * 1000 < Date.now()){
        //   //alert('ขออภัย Token ของท่านหมดอายุการใช้งาน กรุณา Login เข้าใช้ระบบใหม่');
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Token ของท่านหมดอายุการใช้งาน',
        //     html: 'กรุณา Login เข้าใช้ระบบใหม่',
        //     confirmButtonText : 'ตกลง',
        //     confirmButtonColor : '#005b85'
        //   }).then(() => {
        //     window.location.href = BASE_URL_Login //เปิดตอน production
        //   })
        // }else{

        //   if(resultCheckAdmin || _AgU == 'AGAD' && _PerST == 1){
           
        //     setUserToken(decodedObj)
        //     navigate("/Admin/DataDashboard")
        //   }else if(resultCheckUser && _PerST == 1){
            
        //     setUserToken(decodedObj)
        //     navigate("/Dashboard")
        //   }else{
        //     Swal.fire({
        //       icon: 'warning',
        //       title: 'สิทธิ์การเข้าถึงของท่านไม่ถูกต้อง',
        //       html: 'กรุณาติดต่อเจ้าหน้าที่',
        //       confirmButtonText : 'ตกลง',
        //       confirmButtonColor : '#005b85' //
        //     }).then(() => {
        //       window.location.href = BASE_URL_Login //เปิดตอน production
        //     })
        //   }
        //   setLoading(false); // ✅ เมื่อเสร็จแล้ว
        // }


      } catch (error) {
        console.error("❌ Error parsing token:", error)
        navigate("/")
      }
    }else{
      const getstore = encryptStorage.getItem("userToken")

      /*
      if (getstore) {

        const fullnamePer = Base64.decode(getstore._PerFuNas || "")
        const _PerST = Base64.decode(getstore._PerST || "")
        const _AgU = Base64.decode(getstore._AgU || "")
        const _PerRG = Base64.decode(getstore._PerRG || "")
        const _PerWP = Base64.decode(getstore._PerWP || "")
        const _PerExp_Token = Base64.decode(getstore._PerExp_Token || "")

        // console.log('2 : '+ _PerST)
        // console.log('2 : '+ _AgU)
        // console.log('2 : '+ _PerRG)
        // console.log('2 : '+ _PerWP)
        // console.log('2 : '+ _PerExp_Token)

        if (_PerExp_Token * 1000 < Date.now()) {
          Swal.fire({
            icon: "warning",
            title: "Token หมดอายุ",
            text: "กรุณา Login ใหม่",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#005b85",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            //window.location.href = "https://appncar.sakerp.org/";
          });

          return;
        }

        //   // ✅ เช็คสิทธิ์
        const userRG = ["1", "2", "3", "4", "5"];
        const adminWP = ["WP1073", "WP1031"];

        const isUser = userRG.includes(_PerRG) && _PerST === "1";
        const isAdmin =
          adminWP.includes(_PerWP) || (_AgU === "AGAD" && _PerST === "1");

        setUserToken(getstore)

        
        let role = "guest";
        if (isAdmin) role = "admin";
        else if (isUser) role = "user";

        if (role === "guest") {
          Swal.fire({
            icon: "warning",
            title: "ไม่มีสิทธิ์เข้าใช้งาน",
            confirmButtonColor: "#005b85",
          });
          return;
        }

        localStorage.setItem("role", role);
        console.log(`${role.toUpperCase()} เข้าระบบโดย : ${fullnamePer}`);

        // ✅ redirect แค่ครั้งเดียว
        //hasRedirected.current = true;

        navigate(role === "admin" ? "/Admin_CheckCredit" : "/Salesperson", {
          replace: true,
        });
        

      } else {
        //console.log('3')
        navigate("/") // redirect ไปหน้า Home
      }
      */
    }


    // if (!token || hasRedirected.current) return;

    // try {


    //   const fullnamePer = Base64.decode(token.PerFuNas || "");
    //   const _PerST = Base64.decode(token.PerST || "");
    //   const _AgU = Base64.decode(token.AgU || "");
    //   const _PerRG = Base64.decode(token.PerRG || "");
    //   const _PerWP = Base64.decode(token.PerWP || "");
    //   const _PerExp_Token = Base64.decode(token.PerExp_Token || "");

    //   // 🔴 Token หมดอายุ
    //   if (_PerExp_Token * 1000 < Date.now()) {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Token หมดอายุ",
    //       text: "กรุณา Login ใหม่",
    //       confirmButtonText: "ตกลง",
    //       confirmButtonColor: "#005b85",
    //       allowOutsideClick: false,
    //       allowEscapeKey: false,
    //     }).then(() => {
    //       //window.location.href = "https://appncar.sakerp.org/";
    //     });

    //     return;
    //   }

    //   // ✅ เช็คสิทธิ์
    //   const userRG = ["1", "2", "3", "4", "5"];
    //   const adminWP = ["WP1073", "WP1031"];

    //   const isUser = userRG.includes(_PerRG) && _PerST === "1";
    //   const isAdmin =
    //     adminWP.includes(_PerWP) || (_AgU === "AGAD" && _PerST === "1");

    //   let role = "guest";
    //   if (isAdmin) role = "admin";
    //   else if (isUser) role = "user";

    //   if (role === "guest") {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "ไม่มีสิทธิ์เข้าใช้งาน",
    //       confirmButtonColor: "#005b85",
    //     });
    //     return;
    //   }

    //   localStorage.setItem("role", role);
    //   console.log(`${role.toUpperCase()} เข้าระบบโดย : ${fullnamePer}`);

    //   // ✅ redirect แค่ครั้งเดียว
    //   hasRedirected.current = true;

    //   navigate(role === "admin" ? "/Admin_CheckCredit" : "/Salesperson", {
    //     replace: true,
    //   });
    // } catch (err) {
    //   console.error("❌ Token error:", err);
    //   navigate("/");
    // } finally {
    //   setLoading(false);
    // }
  }, [navigate, setUserToken]);

  if (loading) return null;
  return null;
}
