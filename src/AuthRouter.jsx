import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userToken } from "./recoilstore/userStores";
import { useNavigate, useLocation } from "react-router-dom";
import { Base64 } from "js-base64";
import Swal from "sweetalert2";

export default function AuthRouter() {
  const token = useRecoilValue(userToken);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const hasRedirected = useRef(false);

  // 🔓 PUBLIC PATH (ไม่บังคับ login / ไม่ redirect)
  const publicRoutes = [
    /^\/DataReportDSRs\/.+$/, // รองรับ param
  ];

  const isPublicRoute = publicRoutes.some((regex) =>
    regex.test(location.pathname)
  );

  useEffect(() => {
    // ✅ ถ้าเป็น public route → ปล่อยผ่าน
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    if (!token || hasRedirected.current) return;

    try {
      const fullnamePer = Base64.decode(token.PerFuNas || "");
      const _PerST = Base64.decode(token.PerST || "");
      const _AgU = Base64.decode(token.AgU || "");
      const _PerRG = Base64.decode(token.PerRG || "");
      const _PerWP = Base64.decode(token.PerWP || "");
      const _PerExp_Token = Base64.decode(token.PerExp_Token || "");

      // 🔴 Token หมดอายุ
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

      // ✅ เช็คสิทธิ์
      const userRG = ["1", "2", "3", "4", "5"];
      const adminWP = ["WP1073", "WP1031"];

      const isUser = userRG.includes(_PerRG) && _PerST === "1";
      const isAdmin =
        adminWP.includes(_PerWP) || (_AgU === "AGAD" && _PerST === "1");

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
      //console.log(`${role.toUpperCase()} เข้าระบบโดย : ${fullnamePer}`);

      // ✅ redirect แค่ครั้งเดียว
      hasRedirected.current = true;

      navigate(role === "admin" ? "/Admin_CheckCredit" : "/Salesperson", {
        replace: true,
      });
    } catch (err) {
      console.error("❌ Token error:", err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [token, navigate, location.pathname]);

  if (loading) return null;
  return null;
}
