import React, { useState, useEffect } from "react";
import apiClient from "../recoilstore/userStores"; // ปรับ path ให้ตรง

import { Outlet } from "react-router-dom";
// import {encryptStorage} from '../security/EncryptStorage'


import { Base64 } from "js-base64";

import Header from "./includes/usertemplate/Header";
import Footer from "./includes/usertemplate/Footer";
import Navbar from "./includes/usertemplate/Navbar";
// import Header from './includes/usertemplate/Header';
//import Navbar from './includes/Navbar';
// import Footer from './includes/usertemplate/Footer';

import { useRecoilValue } from "recoil";
import { userToken } from "../recoilstore/userStores";

const LayoutUser = () => {
  const getstore = useRecoilValue(userToken);


  const _PerWP = Base64.decode(getstore.PerWP);
    const PerD = Base64.decode(getstore.PerD);
  const wpnamePer = Base64.decode(getstore.PerFuNas);
  const PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const fullnamePer = Base64.decode(getstore.PerFuNas);

  //เมนูผลการตรวจสอบเครดิต ผู้ใช้

  const [contDataMenuChkCD1, setContDataMenuChkCD1] = useState([]); // Object to group by section ID
  const [contDataMenuChkCD2, setContDataMenuChkCD2] = useState([]); // Object to group by section ID
   const [contDataMenuChkCD3, setContDataMenuChkCD3] = useState([]); // Object to group by section ID
   const [contDataMenuChkCD4, setContDataMenuChkCD4] = useState([]); // Object to group by section ID


  // 🔔 แจ้งเตือนหน้ายื่นแบบฟอร์ม 
const loadUserNotification1 = async () => {
  try {
    const { data } = await apiClient.get(
      "/api/insurances/datacustomers/count-pending",
      { params: { _PerWP } }
    );

    if (data?.status) {
      setContDataMenuChkCD1(data.total);
    }
  } catch (err) {
    console.error(err);
  }
};


  

   // 🔔 แจ้งเตือนหน้าผลการตรวขสอบเครดิต 
const loadUserNotification2 = async () => {
  try {
    const { data } = await apiClient.get(
      "/api/insurances/datacustomers/count-lv1",
      { params: { _PerWP } }
    );

    if (data?.status) {
      setContDataMenuChkCD2(data.total);
    }
  } catch (err) {
    console.error(err);
  }
};

const loadUserNotification3 = async () => {
       
  try {
    const { data } = await apiClient.get(
      "/api/insurances/datacustomers/count-Head",
      { params: { PerD } }
    );

    if (data?.status) {
      
      setContDataMenuChkCD3(data.total);

    }
  } catch (err) {
    console.error(err);
  }
};

const loadUserNotification4 = async () => {
       
  try {
    const { data } = await apiClient.get(
      "/api/insurances/datacustomers/count-approver",
      { params: { PerD } }
    );

    if (data?.status) {
      
      setContDataMenuChkCD4(data.total);

    }
  } catch (err) {
    console.error(err);
  }
};



  useEffect(() => {
    loadUserNotification1();
    loadUserNotification2();
    loadUserNotification3();
    loadUserNotification4();
  }, []);

  return (
    <div className="text-sm hold-transition layout-navbar-fixed">
      <Header WPnamePer={wpnamePer} PicPer={PerPhotoProfile_N} />
      <Navbar FullnamePer={fullnamePer} contDataMenuChkCD1={contDataMenuChkCD1} contDataMenuChkCD2={contDataMenuChkCD2}  contDataMenuChkCD3={contDataMenuChkCD3} contDataMenuChkCD4={contDataMenuChkCD4} />

      <Outlet />

      {/* <Footer /> */}
    </div>
  );
};

export default LayoutUser;
