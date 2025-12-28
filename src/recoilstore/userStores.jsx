import { atom, selector } from "recoil";
import { encryptStorage } from "../security/EncryptStorage";
import { Authorization_KEY_API } from "../apiUrl/Api_Url";
import axios from "axios";
import CryptoJS from "crypto-js"

//console.log('11111')

// Utility function to parse JWT
function parseJWT(token) {
  const [header, payload] = token.split(".");
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decodedPayload = atob(base64)
    .split("")
    .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
    .join("");
  return JSON.parse(decodeURIComponent(decodedPayload));
}

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
const BASE_API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

//Interceptor ใส่ header ถูกต้อง
// apiClient.interceptors.request.use(
//   (config) => {
//     config.headers = {
//       ...config.headers,
//       "x-api-key": BASE_API_KEY,
//       "Content-Type": "application/json",
//     };
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

//ใหม่

apiClient.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      "x-api-key": BASE_API_KEY,
    };

    // ❗ ถ้าเป็น FormData → ห้ามตั้ง Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Extract user details from the first token (if available)
let UserDetail = null;
const params = new URLSearchParams(window.location.search)
const tokenParam = params.get("token");

if(tokenParam){
  const decoded = decodeURIComponent(tokenParam)
  // ถอดรหัส (decrypt) ด้วย key เดียวกับตอน encrypt
  const bytes = CryptoJS.AES.decrypt(decoded, "secret-key-value")
  const decryptedToken = bytes.toString(CryptoJS.enc.Utf8)
  //const decodedObj = JSON.parse(decryptedToken)

  encryptStorage.setItem("userToken", decryptedToken) // เก็บ token แบบเข้ารหัส
  //console.log('22222', tokenParam)
  const itemUserToken = localStorage.getItem("userToken");

  

  const userTokenData = encryptStorage.getMultipleItems([
    "userToken",
  ]).userToken;


  //console.log('userTokenData', userTokenData)
  // console.log(userTokenData._AgU)
  // console.log(userTokenData._PerD)

  UserDetail = {
    AgU: userTokenData._AgU,
    PerD: userTokenData._PerD,
    PerTiNa: userTokenData._PerTiNa,
    PerFuNas: userTokenData._PerFuNa,
    PerST: userTokenData._PerST,
    PerPST: userTokenData._PerPST,
    PerPST_N: userTokenData._PerPST_N,
    PerPST_LV: userTokenData._PerPST_LV,
    PerWP: userTokenData._PerWP,
    PerWP_N: userTokenData._PerWP_N,
    PerBL: userTokenData._PerBL,
    PerBL_N: userTokenData._PerBL_N,
    PerRG: userTokenData._PerRG,
    PerRG_N: userTokenData._PerRG_N,
    PerPhotoProfile_N: userTokenData._PerPhotoProfile_N,
    PerExp_Token: userTokenData._PerExp_Token,
    PerLast_Login: userTokenData._PerLast_Login,
  };
  apiClient.interceptors.request.use((config) => {
    // 🔐 header (เก็บไว้ใช้งานทั่วไป)
    config.headers["Authorization"] = itemUserToken;

    // ✅ ส่ง token ให้ backend ผ่าน GET (ตรงกับ validateRequest)
    config.params = {
      ...(config.params || {}), // กัน params เดิมหาย
      _exp_Token: UserDetail.PerExp_Token,
      _PerWP_Token: UserDetail.PerWP,
      _PerRG_Token: UserDetail.PerRG,
      _PerST_Token: UserDetail.PerST,
    };
    return config;
  });
}else{
  const itemUserToken = localStorage.getItem("userToken");
 

  const userTokenData = encryptStorage.getMultipleItems([
    "userToken",
  ]).userToken;

   //console.log('userTokenData', userTokenData)

  UserDetail = {
    AgU: userTokenData._AgU,
    PerD: userTokenData._PerD,
    PerTiNa: userTokenData._PerTiNa,
    PerFuNas: userTokenData._PerFuNa,
    PerST: userTokenData._PerST,
    PerPST: userTokenData._PerPST,
    PerPST_N: userTokenData._PerPST_N,
    PerPST_LV: userTokenData._PerPST_LV,
    PerWP: userTokenData._PerWP,
    PerWP_N: userTokenData._PerWP_N,
    PerBL: userTokenData._PerBL,
    PerBL_N: userTokenData._PerBL_N,
    PerRG: userTokenData._PerRG,
    PerRG_N: userTokenData._PerRG_N,
    PerPhotoProfile_N: userTokenData._PerPhotoProfile_N,
    PerExp_Token: userTokenData._PerExp_Token,
    PerLast_Login: userTokenData._PerLast_Login,
  };
  apiClient.interceptors.request.use((config) => {
    // 🔐 header (เก็บไว้ใช้งานทั่วไป)
    config.headers["Authorization"] = itemUserToken;

    // ✅ ส่ง token ให้ backend ผ่าน GET (ตรงกับ validateRequest)
    config.params = {
      ...(config.params || {}), // กัน params เดิมหาย
      _exp_Token: UserDetail.PerExp_Token,
      _PerWP_Token: UserDetail.PerWP,
      _PerRG_Token: UserDetail.PerRG,
      _PerST_Token: UserDetail.PerST,
    };
    return config;
  });

  /*
  if (itemUserToken) {
    const userTokenData = encryptStorage.getMultipleItems([
      "userToken",
    ]).userToken; 
    
    console.log('userTokenData', userTokenData)
    // console.log(userTokenData._AgU)
    // console.log(userTokenData._PerD)

    UserDetail = {
      AgU: userTokenData._AgU,
      PerD: userTokenData._PerD,
      PerTiNa: userTokenData._PerTiNa,
      PerFuNas: userTokenData._PerFuNa,
      PerST: userTokenData._PerST,
      PerPST: userTokenData._PerPST,
      PerPST_N: userTokenData._PerPST_N,
      PerPST_LV: userTokenData._PerPST_LV,
      PerWP: userTokenData._PerWP,
      PerWP_N: userTokenData._PerWP_N,
      PerBL: userTokenData._PerBL,
      PerBL_N: userTokenData._PerBL_N,
      PerRG: userTokenData._PerRG,
      PerRG_N: userTokenData._PerRG_N,
      PerPhotoProfile_N: userTokenData._PerPhotoProfile_N,
      PerExp_Token: userTokenData._PerExp_Token,
      PerLast_Login: userTokenData._PerLast_Login,
    };

  }
  */
}

// atom สำหรับเก็บ token
export const userToken = atom({
  key: "userToken",
  default: UserDetail || null,
})

    // apiClient.interceptors.request.use((config) => {
    //   config.headers["Authorization"] = `${itemUserToken}`;
    //   config.headers["Decoded-Token-PerD"] = userTokenData._PerD;
    //   config.headers["Decoded-Token-PerFuNas"] = userTokenData._PerFuNa;
    //   config.headers["Decoded-Token-expiryDate"] = userTokenData._PerExp_Token;
    //   return config;
    // });




// export const userToken = selector({
//   key: "userTokenSelector",
//   get: () => {
//     try {
//       const token = encryptStorage.getItem("userToken")
//       return token || null;
//     } catch (e) {
//       return null;
//     }
//   },
// })

// Recoil state for tokens
// export const userToken = atom({
//   key: "userToken",
//   default: UserDetail || null,
// });

// export const userOutToken = atom({
//   key: "userOutToken",
//   default: UserDetail2,
// });

export default apiClient;
