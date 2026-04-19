import React, { useState, useEffect } from "react";
import apiClient from "../recoilstore/userStores"; // ปรับ path ให้ตรง
import { Outlet } from "react-router-dom";
import { Base64 } from "js-base64";

import Header from "./includes/admintemplate/Header";
import Navbar from "./includes/admintemplate/Navbar";
import Footer from "./includes/admintemplate/Footer";

// import { userToken } from "./recoilstore/userStores";
import { userToken } from "../recoilstore/userStores";
import { useRecoilValue } from "recoil";

const LayoutAdmin = () => {
  const getstore = useRecoilValue(userToken);

  const wpnamePer = Base64.decode(getstore.PerFuNas);
  const PerPhotoProfile_N = Base64.decode(getstore.PerPhotoProfile_N);
  const fullnamePer = Base64.decode(getstore.PerFuNas);

  //เมนูผลการตรวจสอบเครดิต ผู้ใช้

  const [contDataMenuChkCD1, setContDataMenuChkCD1] = useState([]); // Object to group by section ID
  const [contDataMenuChkCD2, setContDataMenuChkCD2] = useState([]); // Object to group by section ID
  const [contDataMenuChkCD3, setContDataMenuChkCD3] = useState([]); // Object to group by section ID

  const [activeTab, setActiveTab] = useState("wait");

  // 🔔 แจ้งเตือนหน้ารอตรวจข้อมูลเครดิต
  const loadUserNotification1 = async () => {
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_count",
      );

      if (data?.status) {
        setContDataMenuChkCD1(data.sqlDataCustomers); // 🔔 จำนวนงานตรวจสอบ
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  // 🔔 แจ้งเตือนหน้าแจ้งรอแก้ไขข้อมูล
  const loadUserNotification2 = async () => {
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers_Admin_Edit_count",
      );

      if (data?.status) {
        setContDataMenuChkCD2(data.sqlDataCustomers); // 🔔 จำนวนงานตรวจสอบ
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  // 🔔 แจ้งเตือนหน้าแจ้งรอแก้ไขข้อมูล
  const loadUserNotification3 = async () => {
    try {
      const { data } = await apiClient.get(
        "/api/insurances/datacustomers/count-approverNcb",
      );

      if (data?.status) {

        setContDataMenuChkCD3(data.total); // 🔔 จำนวนงานตรวจสอบ
      }
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };

  useEffect(() => {
    loadUserNotification1();
    loadUserNotification2();
    loadUserNotification3();
  }, []);

  return (
    <>
      <div className="text-sm hold-transition">
        <Header WPnamePer={wpnamePer} PicPer={PerPhotoProfile_N} />
        <Navbar
          FullnamePer={fullnamePer}
          contDataMenuChkCD1={contDataMenuChkCD1}
          contDataMenuChkCD2={contDataMenuChkCD2}
          contDataMenuChkCD3={contDataMenuChkCD3}
        />

        <Outlet />

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default LayoutAdmin;
