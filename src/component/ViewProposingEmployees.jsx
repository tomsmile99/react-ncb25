import { useState, useEffect } from "react";
import apiClient from "../recoilstore/userStores";
import Alert from "@mui/material/Alert";
import {
  TextField,
  Button,
  Card,
  Typography,
  Box,
  Grid, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import loadingAnimation2 from "../jsonfiles/Animation - 1746696323972.json";
// import Lottie from "react-lottie-player";
import Lottie from "lottie-react";
import TextareaAutosize from "react-textarea-autosize";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";
import Swal from "sweetalert2";
//icons

import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";

//TOKEN

import { useRecoilValue } from "recoil";
import { userToken } from "../recoilstore/userStores";
const ViewProposingEmployees = ({ activeKey, idemployee }) => {
  const decodeBase64 = (encodedString) => {
    //แปลง Base 64 จาก token
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("Error decoding Base64 string", error);
      return encodedString;
    }
  };

  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [note, setNote] = useState("");

  const [scoreData, setScoreData] = useState(null);
  const [originalScoreData, setOriginalScoreData] = useState(""); // เก็บข้อมูลเดิม

  const [entries, setEntries] = useState("");
  const [employees, setEmployees] = useState(""); //รหัสพนักงานทดลองงาน

  const [status_approval, setStatus_approval] = useState(""); // สเตตัสการประเมิน
  const [showTable, setShowTable] = useState(false);

  const [editId, setEditId] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editActivity, setEditActivity] = useState("");
  const [editNote, setEditNote] = useState("");

  const [versionEvo, setVersionEvo] = useState("");

  const [scores, setScores] = useState({});
  const [sections, setSections] = useState([]);
  const [subQuestions, setSubQuestions] = useState([]); // Object to group by section ID
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false); //ตรวจสอบว่ากรอกข้อมูลครบไหม
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [status_app, setStatus_app] = useState("");

  const [approval, setApproval] = useState([]); // Object to group by section ID

  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [evaluationResults, setEvaluationResults] = useState(
    Array(10).fill(false)
  );

  //token
  const userDetails = useRecoilValue(userToken);
  const Idemployee = decodeBase64(userDetails.PerD); // รหัสผู้บันทึก

  //เรียกข้อมูลแยก
  const ReadData_daily = async () => {
    try {
      const { data } = await apiClient.get(
        `/daily_view_mentor&idper=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);

        setEntries(result);
        setEmployees(result[0]?.employee_id); //เอาแค่ชื่อเดียว
        setStatus_approval(result[0]?.status_approval_perform);

        // // setEntries([newEntry, ...entries]); // แค่เพิ่มข้อมูลเข้า state
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getScoreAssesment = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_question_mentor?activeKey=${activeKey}&idemployee=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);

        setScoreData(result); // เก็บผลลัพธ์ API ไว้ใน state
        const version = result[0]?.vertion_evo ?? null; // ถ้าไม่มีให้เป็น null
        setVersionEvo(version);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const show_approval_mentor = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_approval_mentor?activeKey=${activeKey}&idemployee=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);
        setApproval(result);
        const fetchedComment = result[0]?.ap_comment_emp ?? ""; // ถ้าไม่มี comment ให้ใส่ค่าว่าง
        setComment(fetchedComment);

        const status_approval = result[0]?.ap_status_head ?? ""; // ถ้าไม่มี comment ให้ใส่ค่าว่าง
        setStatus_app(status_approval);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleScoreChange = (id, version, score, subIndex, activeKey) => {
    const existingScore = scoreData.find(
      (item) => String(item.question_sub_id) === String(id)
    );

    if (existingScore && existingScore.id) {
      // Update case
      setScores((prevScores) => ({
        ...prevScores,
        [`${id}-${subIndex}`]: {
          id: existingScore.id, // เพิ่ม id สำหรับ update
          question_sub_id: id,
          score_evo: score,
          vertion_evo: version,
          month_evo: activeKey,
          isUpdate: true, // แยกสถานะไว้ใช้ต่อ
        },
      }));
    } else {
      // Insert case
      setScores((prevScores) => ({
        ...prevScores,
        [`${id}-${subIndex}`]: {
          question_sub_id: id,
          score_evo: score,
          vertion_evo: version,
          month_evo: activeKey,
          isUpdate: false,
        },
      }));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      // โหลดคำถาม
      if (versionEvo) {
        await ReadData_question_singer(versionEvo);
      } else {
        await ReadData_question_singer();
      }

      // โหลดข้อมูลอื่นๆ หลังคำถาม
      await ReadData_daily();
      await getScoreAssesment();
      await show_approval_mentor();
    };

    fetchData();
  }, [versionEvo, activeKey]);

  useEffect(() => {
    const totalSubQuestions = Object.values(subQuestions).flat().length;
    const numberOfScores = Object.keys(scores).length;

    setIsAssessmentComplete(
      numberOfScores === totalSubQuestions && totalSubQuestions > 0
    );
  }, [scores, subQuestions]);

  // useEffect(() => {
  //   ReadData_question_singer();
  // }, []);
  // useEffect(() => {
  //   // ตรวจสอบว่ามีการให้คะแนนครบทุกข้อหรือไม่เมื่อ scores เปลี่ยนแปลง
  //   const totalSubQuestions = Object.values(subQuestions).flat().length;
  //   const numberOfScores = Object.keys(scores).length;
  //   setIsAssessmentComplete(
  //     numberOfScores === totalSubQuestions && totalSubQuestions > 0
  //   );
  // }, [scores, subQuestions]);

  // useEffect(() => {
  //   ReadData_daily();
  //   getScoreAssesment();
  // }, [activeKey]);

  // useEffect(() => {
  //   if (versionEvo) {
  //     ReadData_question_singer(versionEvo);
  //   }
  // }, [versionEvo]);

  const handleEdit = (index, entry) => {
    setEditIndex(index);
    setEditDate(entry.daily_work_date);
    setEditActivity(entry.daily_work_result);
    setEditNote(entry.daily_work_issues);
    setEditId(entry.record_id);
    setOpenDialog(true);
  };

  const convertToThaiDate = (dateString) => {
    const date = new Date(dateString);
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

 
  // คำนวณคะแนนรวม
  const activeScores =
    scoreData && Object.keys(scoreData).length > 0 ? scoreData : scores;

  const totalScore = Object.values(activeScores).reduce(
    (acc, val) => acc + (parseInt(val.score_evo) || 0),
    0
  );

  const totalQuestions = Object.keys(activeScores).length;
  const percent =
    totalQuestions > 0
      ? ((totalScore / (totalQuestions * 4)) * 100).toFixed(2)
      : 0;
  const getScoreLevel = (percent) => {
    const value = parseFloat(percent);

    if (value === 0) return { color: "gray" }; // รอการประเมินผล → เทา
    if (value >= 76) return { color: "green" }; // ≥ 76 → สีเขียว
    if (value >= 50) return { color: "goldenrod" }; // 50–75 → สีเหลือง
    return { color: "red" }; // < 50 → สีแดง
  };
  const scoreLevel = getScoreLevel(percent);



  //
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 1000); // รอ 2 วินาที

    return () => clearTimeout(timer);
  }, []);

  const getemployee = [
    {
      id: 1,
      name: "กันนิกา ใจดี",
      position: "วิเคราะห์สินเชื่อ",
      workpaan: "สาขาอุตรดิตถ์",
      profilePicture:
        "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg",
      datestart: "1/12/68",
      progress: 100, // เพิ่ม property progress (เริ่มจาก 0)
      score: 78,
    },
    // ... พนักงานคนอื่นๆ
  ];

  return (
    <Box sx={{ maxWidth: 1550, mx: "auto" }}>
      <div
        className="container mt-4"
        style={{
          fontSize: "14px",
          lineHeight: 1.8,
        }}
      >
        {/* <div className="cartcustom bg-primary text-white">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
          เสนอบรรจุพนักงานทดลองงาน 
          </h5>
        </div> */}
        <h4 className="text-center fw-bold">บันทึกข้อความ</h4>

        <div className="mb-3">
          <strong>ส่วนงาน</strong> สำนักกงานใหญ่ บริษัท ทัดด์สยามโลจิสติกส์
          จำกัด (มหาชน)
          <br />
          <strong>วันที่</strong> 20/01/2568
          <br />
          <strong>เรื่อง</strong> เสนอบรรจุเป็นพนักงาน
          <br />
          <strong>เรียน</strong> กรรมการผู้จัดการ
        </div>

        <div className="mb-4">
          ข้าพเจ้า <strong>{getemployee.name}</strong> เลขพนักงาน{" "}
          {getemployee.getemployeeId} ตำแหน่ง {getemployee.position}
          พนักงานฝ่ายพัฒนาระบบส่งเสริมปฏิบัติการ สังกัด {getemployee.workpaan}
          ปฏิบัติหน้าที่เป็นพนักงานที่เลื่อนสอบมาจากพนักงานทดลองงาน...
        </div>

        <div className="text-danger fw-bold mb-2">กรอกเอง</div>
        <ol>
          <li className="fw-bold text-danger">{getemployee.name}</li>
        </ol>

        <div className="table-responsive mb-4">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>มาสาย</th>
                <th>ขาดงาน</th>
                <th>ลากิจ</th>
                <th>ลาป่วย</th>
                <th>เวลาออกงาน</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>1</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          ทั้งนี้ ขอเสนอให้ได้รับบรรจุเป็นพนักงาน ตั้งแต่วันที่ 1 กุมภาพันธ์
          2568 เป็นต้นไป
        </p>

        {/* <div className="mb-5">
          จึงเรียนมาเพื่อพิจารณา
          <br />
          <br />
          (...............................................)
          <br />
          ตำแหน่ง พนักงานฝ่ายพัฒนาระบบปฏิบัติการ
          <br />
          พนักงานที่เลื่อน
          <br />
          <br />
          (...............................................)
          <br />
          ตำแหน่ง หัวหน้าฝ่ายพัฒนาระบบส่งเสริมปฏิบัติการ
        </div> */}


      </div>
    </Box>
  );
};

export default ViewProposingEmployees;
