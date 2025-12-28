import { useLocation } from "react-router-dom";

const AdminViewPage = () => {
  
  const { state } = useLocation();
  const item = state?.item;
  const data = JSON.parse(decodeURIComponent(new URLSearchParams(window.location.search).get("data")));

  return (
    <div style={{ padding: "20px" }}>
      <h2>รายละเอียดข้อมูล</h2>
      <p>ชื่อ: {item?.name}</p>
      <p>สถานะ: {item?.status}</p>
      <p>วันที่: {item?.date}</p>
    </div>
  );
};

export default AdminViewPage;
