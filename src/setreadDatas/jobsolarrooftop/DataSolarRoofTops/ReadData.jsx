import { useState } from "react";
import { Avatar, Button } from "@mui/material";
import { Tab, Tabs } from "react-bootstrap";
import WorkLogForum from "../../../component/WorkLogForum";
import { HiCheckCircle } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
const ReadDataInsurance = ({PerD,FullnamePer,PerPhotoProfile_N,PerPST_N,PerWP_N}) => { 
  const [tabs, setTabs] = useState([
    { key: "1", title: "เดือนที่ 1" },
    { key: "2", title: "เดือนที่ 2" },
    { key: "3", title: "เดือนที่ 3" },
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
  const employee1 = {
     // ข้อมูลพนักงานคนเดียว
     id: 1,
     name: FullnamePer,
     position: PerPST_N,
     workpaan: PerWP_N,
     profilePicture:`https://apimb.sakerp.org/file_photoEMP/` + PerPhotoProfile_N,   
     datestart: "2568-11-01",
  };
  return (
    <>
      <div className="cartcustom2 mb-2">
        <div className="d-flex align-items-center">
          {" "}
          {/* ใช้ d-flex และ align-items-center เพื่อจัดเรียงแนวนอนและจัดกึ่งกลางแนวตั้ง */}
          <div className="ml-2">
            {" "}
            <Avatar
              src={employee1.profilePicture}
              sx={{
                width: 70,
                height: 70,
                mr: 2,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.1)", boxShadow: 3 },
              }}
              alt={employee1.name}
            />
          </div>{" "}
          {/* เพิ่ม margin-right (mr-3) เพื่อเว้นระยะห่างจากรูป */}
          <div className="text-content">
            <span className="welcome-text">
              ยินดีต้อนรับเข้าสู่ การประเมินพนักงานทดลองงาน รหัสพนักงาน : {PerD}
            </span>
            <span className="user-info">
              {employee1.name} - {employee1.workpaan}
            </span>
          </div>
        </div>
      </div>
      <div className="cartcustom">
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
                        {tab.title}
                         {/* <HiCheckCircle style={{ color: "green" }} /> */}
                      </span>
                    ) : (
                      tab.title
                    )
                  }
                >
                  <div className="p-0 card-body table-responsive">
                    <div className="pt-2 mb-3 pl-2 pr-2"> 
                      <WorkLogForum activeKey={activeKey} />
                    </div>
                  </div>
                </Tab>
              ))}
              <Tab
                key="addTab"
                eventKey="addTab"
                title={
                  <FaCirclePlus
                    style={{ color: "#9aaeea", fontSize: "16px" }}
                  />
                }
              />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadDataInsurance;
