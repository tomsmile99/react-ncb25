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
const ViewWorkLogForum = ({ activeKey, idemployee }) => {
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

  const handleSaveEdit = async () => {
    const recordId = editId; // ID ของรายการที่จะอัปเดต

    const updatedEntry = {
      daily_work_date: editDate,
      daily_work_result: editActivity,
      daily_work_issues: editNote,
      id: recordId,
    };

    try {
      const response = await apiClient.put(`/daily_update`, updatedEntry);
      // console.log("Full Response:", response); // ดู Response ทั้งหมด
      if (response && response.data) {
        // ตรวจสอบว่า response และ response.data มีค่า
        // console.log("Response Data:", response.data); // ดูข้อมูลใน response.data
        // console.log("ID from Backend:", response.data.result); // เก็บ idper ที่ส่งมาจากหลังบ้าน
        ReadData_daily(); // ดึงข้อมูลใหม่
        setOpenDialog(false);
        setEditId(null);
        setEditDate("");
        setEditActivity("");
        setEditNote("");
      } else {
        console.error(
          "Update failed:",
          response ? response.data.message : "No response received"
        );
      }
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsAssessmentComplete(false);
    setVersionEvo();
  };

  const handleSubmit = () => {
    handleClose();
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

  const handleSaveAssessment = async () => {
    // ตรวจสอบ comment ว่าห้ามว่าง
    if (!comment.trim()) {
      setCommentError("กรุณากรอกความคิดเห็นก่อนส่ง");
      return;
    }

    //ข้อมูลก่อนส่ง
    const allScoresData = [];
    const keys = Object.keys(scores);
    const idMentor = Idemployee; // ID พี่เลี้ยงผู้ประเมิน

    keys.forEach((key) => {
      const scoreData = scores[key];
      allScoresData.push({
        employees: employees, //รหัสพนักงานทดลองงาน
        mentor_id: idMentor,
        ...scoreData,
      });
    });

    const payload = {
      allScoresData: allScoresData,
      comment: comment,
    };

    try {
      const response = await apiClient.post(`/mentorAssesment`, payload);
      if (response && response.data) {
        Swal.fire({
          title: "ยืนยันการอนุมัติ?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "✅ อนุมัติ",
          cancelButtonText: "❌ ยกเลิก",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("✔ อนุมัติเรียบร้อย!", "", "success");
            console.log("อนุมัติ");
          }
        });
        ReadData_daily();
        ReadData_question_singer();
        getScoreAssesment();
        setOpen(false);
        window.location.reload();
      } else {
        console.error(
          "Update failed:",
          response ? response.data.message : "No response received"
        );
      }
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleUpdateAssessment = async () => {
    try {
      const payloadArray = Object.values(scores); // เก็บจาก useState ที่เปลี่ยนล่าสุด
      // const insertData = payloadArray.filter((item) => !item.isUpdate);
      const updateData = payloadArray.filter((item) => item.isUpdate);

      // เรียก API แยกกัน หรือส่งรวมใน payload เดียว
      const response = await apiClient.put(
        "/mentorAssesmentUpdate",
        updateData
      );

      if (response?.data) {
        // console.log("ID from Backend:", response.data.result); // เก็บ idper ที่ส่งมาจากหลังบ้าน

        alert("อัปเดตผลประเมินสำเร็จ");
        ReadData_daily();
        ReadData_question_singer();
        getScoreAssesment();
        window.location.reload(); // รีเฟรชหน้าเว็บ
      } else {
        alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } catch (error) {
      console.error("Error updating assessment:", error.message);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const handleAssessmentClick = () => {
    // โค้ดสำหรับแสดงผลการประเมิน
    setOpenView(true);
    // console.log("แสดงผลการประเมิน");
  };

  const handleCloseView = () => {
    setOpenView(false);
    setIsAssessmentComplete(false);
  };

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
      <div className="col-md-12 pb-2">
        {status_approval === "1" && (
          <Button
            variant="outlined" // เปลี่ยนจาก "contained" เป็น "outlined"
            color="primary"
            size="small"
            sx={{
              borderColor: "#3056d2", // สีเส้นขอบ
              color: "#3056d2", // สีตัวอักษร
              borderRadius: "7px",
              "&:hover": {
                borderColor: "#516fd2", // สีเส้นขอบเมื่อ hover
                backgroundColor: "rgba(48, 86, 210, 0.1)", // พื้นหลังเมื่อ hover (optional)
                color: "#516fd2", // สีตัวอักษรเมื่อ hover
              },
              padding: "8px 16px",
            }}
            onClick={handleAssessmentClick}
          >
            <BsFillFileEarmarkBarGraphFill /> ผลการประเมิน
          </Button>
        )}
      </div>

      {entries.length != 0 ? (
        <div
          style={{
            backgroundColor: "#fafbff",
            padding: "10px",
            textAlign: "center",
            color: "#6e7e8b",
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

      <Box sx={{ mt: 4 }}>
        {showTable ? (
          entries.length === 0 ? (
            <Typography variant="body1" color="textSecondary" align="center">
              <img
                src="/SAKAssessment/Search-rafiki.png"
                className="brand-image pt-2"
                style={{ height: 350, width: "auto" }}
                alt="loop-color"
              />
              <br />
              ขณะนี้ยังไม่มีบันทึกจากพนักงานทดลองงาน <br />
              โปรดรอการบันทึกข้อมูลเข้ามา
            </Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "200px", maxWidth: "200px" }}>
                      วันที่
                    </TableCell>
                    <TableCell sx={{ width: "800px", maxWidth: "800px" }}>
                      รายละเอียดการปฏิบัติงาน
                    </TableCell>
                    <TableCell sx={{ width: "400px", maxWidth: "400px" }}>
                      ปัญหาที่พบ / คำแนะนำจากพี่เลี้ยง
                    </TableCell>
                    <TableCell sx={{ width: "100px", maxWidth: "100px" }}>
                      การกระทำ
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
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEdit(index, entry)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          หมายเหตุ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="pt-3"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    backgroundColor: "#3056d2",
                    color: "white",
                    borderRadius: "7px",
                    "&:hover": {
                      backgroundColor: "#516fd2",
                    },
                    padding: "8px 16px",
                    animation:
                      status_approval === "0"
                        ? "pulseBackground 1s infinite"
                        : "none",
                  }}
                  onClick={handleOpen}
                >
                  บันทึกข้อมูล / รับทราบผลการปฏิบัติงาน
                </Button>
              </div>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: 20,
            width: "1000px", // กำหนดความกว้างของ Dialog
            maxWidth: "100%", // กำหนดความกว้างสูงสุดของ Dialog
          },
        }}
      >
        <DialogTitle>หมายเหตุ</DialogTitle>
        <DialogContent className="pt-2">
          <TextField
            fullWidth
            label="งานที่ปฏิบัติ"
            multiline
            rows={4} // จำนวนแถวเริ่มต้น
            rowsMax={10} // จำนวนแถวสูงสุด (ปรับได้ตามต้องการ)
            value={editActivity}
            onChange={(e) => setEditActivity(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
            autoComplete="off" // ปิด autocomplete เพื่อให้ TextArea ขยายได้
            disabled={true} // ค่าคงที่
          />
          <TextField
            fullWidth
            label="หมายเหตุ (ถ้ามี)"
            multiline // เพิ่ม multiline เพื่อให้ TextArea ใหญ่ขึ้น
            rows={3} // เพิ่มจำนวนแถวของ TextArea
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" size="small">
            ยกเลิก
          </Button>
          <Button onClick={handleSaveEdit} color="primary" size="small">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        PaperProps={{
          style: {
            borderRadius: 20,
            width: "1000px", // กำหนดความกว้างของ Dialog
            maxWidth: "100%", // กำหนดความกว้างสูงสุดของ Dialog
          },
        }}
        onClose={handleClose}
      >
        <DialogTitle>
          {" "}
          <div className="cartcustom bg-primary text-white">
            <h5 className="mb-0" style={{ fontSize: "14px" }}>
              แบบประเมินพนักงานทดลองงาน
            </h5>
          </div>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <div className="container mx-auto p-4">
              <div className="pb-3">
                คำชี้แจง : ให้พี่เลี้ยงประเมินพนักงานทดลองงานโดยใส่เครื่องหมาย 
                ตามหัวข้อที่กำหนดให้ โดยประเมินทุกสิ้นเดือน
                และส่งแบบประเมินมายังอีเมลงานสรรหาและประเมิน ไม่เกินวันที่ 5
                ของเดือนถัดไปหลังจากการประเมิน ระดับ 4 หมายถึง ดีเยี่ยม ระดับ 3
                หมายถึง ดี ระดับ 2 หมายถึง กำลังปรับปรุงในทางที่ดีขึ้น ระดับ 1
                หมายถึง ต้องปรับปรุง
                {/* {scoreData.map((item, index) => (
                  <div key={index}>
                  
                     คะแนน {item.score_evo}
                     ครั้งที่  :  {item.month_evo}
                  </div>
                ))} */}
              </div>

              <center>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">หัวข้อการประเมิน</th>
                      <th className="border p-2">รายละเอียด</th>
                      {[4, 3, 2, 1].map((score) => (
                        <th key={score} className="border p-2 text-center">
                          {score}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section, sectionIndex) => [
                      <tr key={`section-${section.id}`}>
                        <td className="p-2 font-bold" colSpan={6}>
                          {sectionIndex + 1}.{section.criteria_name}
                        </td>
                      </tr>,

                      ...(subQuestions[section.id] || []).map(
                        (sub, subIndex) => (
                          <tr
                            key={`sub-${
                              sub.id || `${sectionIndex}-${subIndex}`
                            }`}
                          >
                            <td className="border p-2 text-center">
                              {sectionIndex + 1}.{subIndex + 1}
                            </td>

                            <td className="border p-2">
                              {sub.criteria_name_sec}
                            </td>

                            {[4, 3, 2, 1].map((value) => (
                              <td
                                key={value}
                                className="border p-2 text-center"
                              >
                                <input
                                  type="radio"
                                  name={`${sub.id}-${subIndex}`}
                                  defaultChecked={
                                    scoreData?.find(
                                      (item) =>
                                        item.question_sub_id === String(sub.id)
                                    )?.score_evo === String(value)
                                  }
                                  onChange={() =>
                                    handleScoreChange(
                                      sub.id,
                                      sub.version_question_sec,
                                      value,
                                      subIndex,
                                      activeKey
                                    )
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        )
                      ),
                    ])}

                    <tr className="bg-gray-200">
                      <td className="border p-2 font-bold" colSpan={6}>
                        เต็ม 100 คะแนน
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-bold" colSpan={6}>
                        รวมคะแนนทั้งหมด{" "}
                        <span
                          style={{
                            color: scoreLevel.color,
                            fontWeight: "bold",
                          }}
                        >
                          {totalScore}
                        </span>{" "}
                        คะแนน คิดเป็นร้อยละ{" "}
                        <span
                          style={{
                            color: scoreLevel.color,
                            fontWeight: "bold",
                          }}
                        >
                          {percent}% (
                          {percent === 0
                            ? "รอการประเมินผล"
                            : percent >= 76
                            ? "สามารถปฏิบัติงานได้เป็นอย่างดี และหาความรู้ใหม่เพิ่มเติมเพื่อพัฒนางาน"
                            : percent >= 50
                            ? "สามารถปฏิบัติงานได้และพัฒนาการทำงานในด้านต่าง ๆ เพิ่มเติม"
                            : "ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ"}
                          )
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="pt-2 w-full">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 w-1/3">ระดับคะแนน</th>
                        <th className="border p-2">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-bold">
                          ตั้งแต่ 76 – 100 คะแนน
                        </td>
                        <td className="border p-2 font-bold">
                          สามารถปฏิบัติงานได้เป็นอย่างดี
                          และหาความรู้ใหม่เพิ่มเติมเพื่อพัฒนางาน
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-bold">
                          ตั้งแต่ 50 – 75 คะแนน
                        </td>
                        <td className="border p-2 font-bold">
                          สามารถปฏิบัติงานได้และพัฒนาการทำงานในด้านต่าง ๆ
                          เพิ่มเติม
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-bold">
                          ต่ำกว่า 50 คะแนน
                        </td>
                        <td className="border p-2 font-bold">
                          ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </center>

              <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
                <div className="cartcustom bg-primary text-white pb-2">
                  <h5 className="" style={{ fontSize: "14px" }}>
                    ความคิดเห็นของพี่เลี้ยง
                    (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                  </h5>
                </div>
                {/* <p className="block mb-2 text-sm">
                  ความคิดเห็นของพี่เลี้ยง
                  (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                </p> */}
                <div className="pt-2">
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className={`w-100 h-48 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                        commentError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="พิมพ์ความคิดเห็นที่นี่..."
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        setCommentError(""); // ล้าง error เมื่อผู้ใช้พิมพ์
                      }}
                    ></textarea>
                    {commentError && (
                      <p className="text-red-500 mt-1 font-semibold flex items-center gap-1">
                        <Alert severity="error">{commentError}</Alert>
                      </p>
                    )}
                  </form>
                </div>
              </div>
              {approval.map((item, index) => (
                <div className="col-md-12" key={index}>
                  <div className="row container">
                    <div className="col-md-6">
                      <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                        <div className="text-sm text-gray-500 text-left">
                          พี่เลี้ยง
                        </div>
                        <div className="mt-2">{item.ap_name_mentor}</div>
                        <div className="text-sm text-gray-600">
                          {item.ap_posit_mentor}
                        </div>
                        <div
                          style={{
                            marginTop: "0.5rem",
                            fontWeight: "600",
                            color:
                              item.ap_status_mentor === "1"
                                ? "green"
                                : "orange",
                          }}
                        >
                          {item.ap_status_mentor === "1"
                            ? "ประเมินผลแล้ว"
                            : "รอการประเมินผล"}
                        </div>

                        <div className="text-sm mt-1">
                          {convertToThaiDate(item.ap_date_approval_mentor)}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      {" "}
                      <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                        <div className="text-sm text-gray-500 text-left">
                          ผู้อนุมัติ / รับทราบผลการประเมิน
                        </div>
                        <div className="mt-2">{item.ap_name_head}</div>
                        <div className="text-sm text-gray-600">
                          {item.ap_posit_head}
                        </div>
                        <div className="mt-2 text-green-600 font-semibold">
                          <div
                            style={{
                              marginTop: "0.5rem",
                              fontWeight: "600",
                              color:
                                item.ap_status_head === "1"
                                  ? "green"
                                  : "orange",
                            }}
                          >
                            {item.ap_status_head === "1"
                              ? "ประเมินผลแล้ว"
                              : "รอการประเมินผล"}
                          </div>
                        </div>
                        <div className="text-sm mt-1">
                          {convertToThaiDate(item.ap_date_approval_head)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div
                style={{ display: "flex", justifyContent: "center" }}
                className="pt-3"
              >
                <>
                  {scoreData && scoreData.length > 0 ? (
                    <>
                      {status_app !== "1" && (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{
                              backgroundColor: "#f59e0b", // สีส้มสำหรับปุ่มแก้ไข
                              color: "white",
                              borderRadius: "7px",
                              "&:hover": {
                                backgroundColor: "#fbbf24",
                              },
                              padding: "8px 16px",
                            }}
                            onClick={handleUpdateAssessment}
                          >
                            แก้ไขผลการประเมินพนักงาน
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        backgroundColor: "#3056d2",
                        color: "white",
                        borderRadius: "7px",
                        "&:hover": {
                          backgroundColor: "#516fd2",
                        },
                        padding: "8px 16px",
                      }}
                      onClick={handleSaveAssessment}
                      disabled={!isAssessmentComplete}
                    >
                      บันทึกผลการประเมินพนักงาน
                    </Button>
                  )}
                </>
              </div>
            </div>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "gay" }}>
            ยกเลิก
          </Button>
          {/* <Button onClick={handleSubmit} color="primary">
            ยืนยัน
          </Button> */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openView}
        PaperProps={{
          style: {
            borderRadius: 20,
            width: "1000px", // กำหนดความกว้างของ Dialog
            maxWidth: "100%", // กำหนดความกว้างสูงสุดของ Dialog
          },
        }}
        onClose={handleCloseView}
      >
        <DialogTitle>
          {" "}
          <div className="cartcustom bg-primary text-white">
            <h5 className="mb-0" style={{ fontSize: "14px" }}>
              ผลการประเมิน
            </h5>
          </div>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <div className="container mx-auto p-4">
              <div className="pb-3">
                คำชี้แจง : ให้พี่เลี้ยงประเมินพนักงานทดลองงานโดยใส่เครื่องหมาย 
                ตามหัวข้อที่กำหนดให้ โดยประเมินทุกสิ้นเดือน
                และส่งแบบประเมินมายังอีเมลงานสรรหาและประเมิน ไม่เกินวันที่ 5
                ของเดือนถัดไปหลังจากการประเมิน ระดับ 4 หมายถึง ดีเยี่ยม ระดับ 3
                หมายถึง ดี ระดับ 2 หมายถึง กำลังปรับปรุงในทางที่ดีขึ้น ระดับ 1
                หมายถึง ต้องปรับปรุง
                {/* {scoreData.map((item, index) => (
                  <div key={index}>
                  
                     คะแนน {item.score_evo}
                     ครั้งที่  :  {item.month_evo}
                  </div>
                ))} */}
              </div>

              <center>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">หัวข้อการประเมิน</th>
                      <th className="border p-2">รายละเอียด</th>
                      {[4, 3, 2, 1].map((score) => (
                        <th key={score} className="border p-2 text-center">
                          {score}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section, sectionIndex) => [
                      <tr key={`section-${section.id}`}>
                        <td className="p-2 font-bold" colSpan={6}>
                          {sectionIndex + 1}.{section.criteria_name}
                        </td>
                      </tr>,

                      ...(subQuestions[section.id] || []).map(
                        (sub, subIndex) => (
                          <tr
                            key={`sub-${
                              sub.id || `${sectionIndex}-${subIndex}`
                            }`}
                          >
                            <td className="border p-2 text-center">
                              {sectionIndex + 1}.{subIndex + 1}
                            </td>

                            <td className="border p-2">
                              {sub.criteria_name_sec}
                            </td>

                            {[4, 3, 2, 1].map((value) => (
                              <td
                                key={value}
                                className="border p-2 text-center cursor-pointer"
                                onClick={() =>
                                  handleScoreChange(
                                    sub.id,
                                    sub.version_question_sec,
                                    value,
                                    subIndex,
                                    activeKey
                                  )
                                }
                              >
                                {scoreData?.find(
                                  (item) =>
                                    item.question_sub_id === String(sub.id)
                                )?.score_evo === String(value) ? (
                                  <span>✓</span>
                                ) : (
                                  <span>&nbsp;</span> // ช่องว่างสำหรับความสูงสม่ำเสมอ
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      ),
                    ])}

                    <tr className="bg-gray-200">
                      <td className="border p-2 font-bold" colSpan={6}>
                        เต็ม 100 คะแนน
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-bold" colSpan={6}>
                        รวมคะแนนทั้งหมด{" "}
                        <span
                          style={{
                            color: scoreLevel.color,
                            fontWeight: "bold",
                          }}
                        >
                          {totalScore}
                        </span>{" "}
                        คะแนน คิดเป็นร้อยละ{" "}
                        <span
                          style={{
                            color: scoreLevel.color,
                            fontWeight: "bold",
                          }}
                        >
                          {percent}% (
                          {percent >= 76
                            ? "สามารถปฏิบัติงานได้เป็นอย่างดี และหาความรู้ใหม่เพิ่มเติมเพื่อพัฒนางาน"
                            : percent >= 50
                            ? "สามารถปฏิบัติงานได้และพัฒนาการทำงานในด้านต่าง ๆ เพิ่มเติม"
                            : "ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ"}{" "}
                          )
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="pt-2 w-full">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 w-1/3">ระดับคะแนน</th>
                        <th className="border p-2">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-bold">
                          ตั้งแต่ 76 – 100 คะแนน
                        </td>
                        <td className="border p-2 font-bold">
                          สามารถปฏิบัติงานได้เป็นอย่างดี
                          และหาความรู้ใหม่เพิ่มเติมเพื่อพัฒนางาน
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-bold">
                          ตั้งแต่ 50 – 75 คะแนน
                        </td>
                        <td className="border p-2 font-bold">
                          สามารถปฏิบัติงานได้และพัฒนาการทำงานในด้านต่าง ๆ
                          เพิ่มเติม
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-bold">
                          ต่ำกว่า 50 คะแนน
                        </td>
                        <td className="border p-2 font-bold">
                          ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </center>

              <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
                <div className="cartcustom bg-primary text-white pb-2">
                  <h5 className="" style={{ fontSize: "14px" }}>
                    ความคิดเห็นของพี่เลี้ยง
                    (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                  </h5>
                </div>
                {/* <p className="block mb-2 text-sm">
                  ความคิดเห็นของพี่เลี้ยง
                  (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                </p> */}
                <div className="pt-2">
                  <textarea
                    className="w-100 h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="พิมพ์ความคิดเห็นที่นี่..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>

            {approval.map((item, index) => (
              <div className="col-md-12" key={index}>
                <div className="row container">
                  <div className="col-md-6">
                    <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                      <div className="text-sm text-gray-500 text-left">
                        พี่เลี้ยง
                      </div>
                      <div className="mt-2">{item.ap_name_mentor}</div>
                      <div className="text-sm text-gray-600">
                        {item.ap_posit_mentor}
                      </div>
                      <div className="mt-2 text-green-600 font-semibold">
                        <div
                          style={{
                            marginTop: "0.5rem",
                            fontWeight: "600",
                            color:
                              item.ap_status_mentor === "1"
                                ? "green"
                                : "orange",
                          }}
                        >
                          {item.ap_status_mentor === "1"
                            ? "ประเมินผลแล้ว"
                            : "รอการประเมินผล"}
                        </div>
                      </div>

                      <div className="text-sm mt-1">
                        {convertToThaiDate(item.ap_date_approval_mentor)}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {" "}
                    <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                      <div className="text-sm text-gray-500 text-left">
                        ผู้อนุมัติ / รับทราบผลการประเมิน
                      </div>
                      <div className="mt-2">{item.ap_name_head}</div>
                      <div className="text-sm text-gray-600">
                        {item.ap_posit_head}
                      </div>
                      <div className="mt-2 text-green-600 font-semibold">
                        <div
                          style={{
                            marginTop: "0.5rem",
                            fontWeight: "600",
                            color:
                              item.ap_status_head === "1" ? "green" : "orange",
                          }}
                        >
                          {item.ap_status_head === "1"
                            ? "ประเมินผลแล้ว"
                            : "รอการประเมินผล"}
                        </div>
                      </div>
                      <div className="text-sm mt-1">
                        {convertToThaiDate(item.ap_date_approval_head)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} style={{ color: "gay" }}>
            ยกเลิก
          </Button>
          {/* <Button onClick={handleSubmit} color="primary">
            ยืนยัน
          </Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewWorkLogForum;
