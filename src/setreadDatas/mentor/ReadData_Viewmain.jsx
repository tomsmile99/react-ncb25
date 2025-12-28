import { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { HiCheckCircle } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ViewWorkLogForum from "../../component/ViewWorkLogForum";
const ReadData_Viewmain = ({
  idemployee,
  fullname,
  position,
  workplace,
  startworkdate_PSN,
  photo_PSN,
}) => {
  const convertToThaiDate = (dateString) => {
    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const [tabs, setTabs] = useState([
    { key: "1", title: "เดือน 1" },
    { key: "2", title: "เดือน 2" },
    { key: "3", title: "เดือน 3" },
  ]);

  const [activeKey, setActiveKey] = useState("1");
  const [tabCounter, setTabCounter] = useState(4);

  const handleAddTab = () => {
    const newTabKey = tabCounter.toString();
    const newTab = { key: newTabKey, title: `เดือนที่ ${tabCounter}` };
    setTabs([...tabs, newTab]);
    setActiveKey(newTabKey);
    setTabCounter(tabCounter + 1);
  };

  const handleSelect = (k) => {
    if (k === "addTab") {
      handleAddTab();
    } else {
      setActiveKey(k);
    }
  };

  const employee = {
    // ข้อมูลพนักงานคนเดียว
    id: idemployee,
    name: fullname,
    position: position,
    workpaan: workplace,
    profilePicture: `https://apimb.sakerp.org/file_photoEMP/${photo_PSN}`,
    datestart: startworkdate_PSN,
  };

  useEffect(() => {
    console.log(idemployee);
  }, []);

  return (
    <>
      <div className="cartcustom">
        <div className="cartcustom bg-primary text-white">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
            ข้อมูลพนักงานทดลองงาน
          </h5>
        </div>
        <div className="card-body">
          {employee ? (
            <div
              className="d-flex align-items-center"
              style={{
                transition: "0.3s",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <Avatar
                src={employee.profilePicture}
                sx={{
                  width: 50,
                  height: 50,
                  mr: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.1)", boxShadow: 3 },
                }}
                alt={employee.name}
              />
              <div className="employee-details ms-3 col-md-10">
                <div className="fw-bold" style={{ color: "#4285f4" }}>
                  {employee.name}
                </div>
                <div className="row employee-details">
                  <div className="col-md-3 text-muted">
                    ตำแหน่ง : {employee.position}
                  </div>
                  <div className="col-md-3 text-muted">
                    พื้นที่ปฏิบัติงาน : {employee.workpaan}
                  </div>
                  <div className="col-md-3 text-muted">
                    วันที่เริ่มงาน : {convertToThaiDate(employee.datestart)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">ไม่มีข้อมูลพนักงาน</p>
          )}
        </div>

        <div className="mt-2 row">
          <div className="col-md-12 text-left mb-2">
            <Tabs
              id="controlled-tab-example"
              activeKey={activeKey}
              onSelect={handleSelect} // ใช้ handleSelect
              className="mb-3"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  eventKey={tab.key}
                  title={
                    tab.key === "1" ? (
                      <span>
                        {tab.title} <HiCheckCircle style={{ color: "green" }} />
                      </span>
                    ) : (
                      tab.title
                    )
                  }
                >
                  <div className="p-0 card-body table-responsive">
                    <div className="pt-2 mb-3 pl-2 pr-2">
                      <ViewWorkLogForum
                        activeKey={activeKey}
                        idemployee={idemployee}
                      />
                    </div>
                  </div>
                </Tab>
              ))}
              {/* <Tab key="addTab" eventKey="addTab" title={<FaCirclePlus style={{color : '#9aaeea' ,fontSize : "16px"}}/>} /> */}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadData_Viewmain;
