import { useState, useEffect } from "react";
import apiClient from "../recoilstore/userStores";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import loadingAnimation2 from "../jsonfiles/Animation - 1746696323972.json";
// import Lottie from "react-lottie-player";
import Lottie from "lottie-react";
import TextareaAutosize from "react-textarea-autosize";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";
//icons

import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";

//TOKEN

import { useRecoilValue } from "recoil";
import { userToken } from "../recoilstore/userStores";
const ViewWorkLogHistoryPdf = ({ activeKey, idemployee }) => {
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

  const [versionEvo, setVersionEvo] = useState("");

  const [scores, setScores] = useState({});
  const [sections, setSections] = useState([]);
  const [subQuestions, setSubQuestions] = useState([]); // Object to group by section ID
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false); //ตรวจสอบว่ากรอกข้อมูลครบไหม
  const [comment, setComment] = useState("");

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
        `/daily_view_mentor?activeKey=${activeKey}&idper=${idemployee}`
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
        // console.log("API call successful. Result data:", result[0].vertion_evo);
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

  // คำนวณคะแนนรวม
  const activeScores =
    scoreData && Object.keys(scoreData).length > 0 ? scoreData : scores;

  const ReadData_question_singer = async () => {
    try {
      const endpoint = versionEvo
        ? `/question_mentor_view_singer?version_evo=${versionEvo}`
        : `/question_mentor_view_singer_null`;

      const { data } = await apiClient.get(endpoint);

      const { status, result } = data;
      if (status) {
        const { main_questions, sub_questions } = result;

        const formattedMainSections = main_questions.map((item) => ({
          id: item.id_main_section,
          criteria_name: item.criteria_name,
          isOld: true,
        }));

        setSections(formattedMainSections);
        // console.log(sections);
        const groupedSubQuestions = sub_questions.reduce((acc, sub) => {
          if (!acc[sub.section_id]) {
            acc[sub.section_id] = [];
          }
          acc[sub.section_id].push(sub);
          return acc;
        }, {});
        setSubQuestions(groupedSubQuestions);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 1000); // รอ 2 วินาที

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ maxWidth: 1550, mx: "auto" }}>
      {entries.length != 0 ? (
        <div
          style={{
            backgroundColor: "#4285f4",
            padding: "10px",
            textAlign: "center",
            color: "#ffff",
            borderRadius: "7px",
          }}
        >
          <Typography variant="body1" style={{ fontSize: "14px" }}>
            ตารางบันทึกการปฏิบัติงาน
          </Typography>
          <Typography variant="body1" style={{ fontSize: "14px" }}>
            เดือนที่ {activeKey} ตั้งแต่วันที่ 6 ถึง 10 เดือน มกราคม พ.ศ 2568
          </Typography>
        </div>
      ) : null}

      <Box sx={{ px: 2, mt: 1 }}>
        {" "}
        {/* px = paddingX (padding ซ้ายและขวา) */}
        {showTable ? (
          entries.length === 0 ? (
            <Typography variant="body1" color="textSecondary" align="center">
              ยังไม่มีรายการบันทึก
            </Typography>
          ) : (
            <>
              <Table>
                <TableHead sx={{ backgroundColor: "#fafbff" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "200px",
                        maxWidth: "200px",
                        verticalAlign: "top",
                      }}
                    >
                      วันที่
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "800px",
                        maxWidth: "1000px",
                        verticalAlign: "top",
                      }}
                    >
                      	รายละเอียดการปฏิบัติงาน
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "400px",
                        maxWidth: "400px",
                        verticalAlign: "top",
                      }}
                    >
                      ปัญหาที่พบ / คำแนะนำจากพี่เลี้ยง
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        {convertToThaiDate(entry.daily_work_date)}
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "pre-wrap", verticalAlign: "top" }}
                      >
                        {entry.daily_work_result}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#fa7900",
                          fontWeight: "bold",
                          verticalAlign: "top",
                        }}
                      >
                        {entry.daily_work_issues}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              animationData={loadingAnimation2}
              loop={true}
              style={{ width: 900, height: 400 }}
            />
            <p
              style={{
                marginTop: "12px",
                color: "#555",
                fontSize: "16px",
              }}
            >
              กำลังโหลดข้อมูล...
            </p>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default ViewWorkLogHistoryPdf;
