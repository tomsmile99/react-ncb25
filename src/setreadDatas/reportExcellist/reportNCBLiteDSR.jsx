import React, { useState } from "react";
import { FaCalendarAlt, FaFileExcel, FaSyncAlt, FaChartBar } from "react-icons/fa";

const reportNCBLiteDSR = () => {
  const [filters, setFilters] = useState({
    region: "",
    zone: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClear = () => {
    setFilters({
      region: "",
      zone: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="filter-card">
      <div className="filter-row">
        <div className="filter-group">
          <label>ภาคธุรกิจ</label>
          <select name="region" value={filters.region} onChange={handleChange}>
            <option value="">- เลือกภาคธุรกิจ -</option>
            <option>เหนือ</option>
            <option>กลาง</option>
            <option>ใต้</option>
            <option>อีสาน</option>
          </select>
        </div>

        <div className="filter-group">
          <label>เขตธุรกิจ</label>
          <select name="zone" value={filters.zone} onChange={handleChange}>
            <option value="">- เลือกเขตธุรกิจ -</option>
            <option>เขต 1</option>
            <option>เขต 2</option>
            <option>เขต 3</option>
          </select>
        </div>

        {/* <div className="filter-group">
          <label>สถานะ</label>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">- เลือกสถานะ -</option>
            <option>รอตรวจสอบ</option>
            <option>ตรวจแล้ว</option>
            <option>ยกเลิก</option>
          </select>
        </div> */}

        <div className="filter-group">
          <label>เลือกวันที่</label>
          <div className="date-range">
            <div className="date-input">
              {/* <FaCalendarAlt className="icon" /> */}
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
              />
            </div>
            <span className="date-sep">ถึง</span>
            <div className="date-input">
              {/* <FaCalendarAlt className="icon" /> */}
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="filter-actions">
        {/* <button className="btn" style={{background :"#0234a1"}}>
          <FaChartBar /> แสดงรายงาน
        </button> */}
        <button className="btn btn-green">
          <FaFileExcel /> Excel
        </button>
        <button className="btn btn-red" onClick={handleClear}>
          <FaSyncAlt /> Clear
        </button>
      </div>
     
      </div>

     
    </div>
  );
};

export default reportNCBLiteDSR;
