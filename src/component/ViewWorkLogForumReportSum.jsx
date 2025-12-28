import { useState, useEffect } from "react";
import apiClient from "../recoilstore/userStores";
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
//TOKEN

import { useRecoilValue } from "recoil";
import { userToken } from "../recoilstore/userStores";
const ViewWorkLogForumReport = ({ activeKey, idemployee, ap_vertion_evo }) => {
  //sss
  const decodeBase64 = (encodedString) => {
    //แปลง Base 64 จาก token
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("Error decoding Base64 string", error);
      return encodedString;
    }
  };

  const [scoreData, setScoreData] = useState({});
  const [scoreData2, setScoreData2] = useState({});
  const [scoreData3, setScoreData3] = useState({});

  //ชุด 1
  const [scores, setScores] = useState({});
  const [sections, setSections] = useState([]);
  const [subQuestions, setSubQuestions] = useState([]); // Object to group by section ID
  //ชุด 2
  const [scores2, setScores2] = useState({});
  const [sections2, setSections2] = useState([]);
  const [subQuestions2, setSubQuestions2] = useState([]); // Object to group by section ID

  //ชุด 3
  const [scores3, setScores3] = useState({});
  const [sections3, setSections3] = useState([]);
  const [subQuestions3, setSubQuestions3] = useState([]); // Object to group by section ID

  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false); //ตรวจสอบว่ากรอกข้อมูลครบไหม
  const [comment, setComment] = useState("");
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [status_approval, setStatus_approval] = useState(""); // สเตตัสการประเมิน
  const [status_app, setStatus_app] = useState("");
  const [versionEvo, setVersionEvo] = useState({});
  const [showTable, setShowTable] = useState(false);

  const [approval, setApproval] = useState([]); // Object to group by section ID

  const [open, setOpen] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(
    Array(10).fill(false)
  );

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
        // console.log(data)
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
        `/show_question_mentor?activeKey=1&idemployee=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result[0].vertion_evo);
        setScoreData(result); // เก็บผลลัพธ์ API ไว้ใน state
        // console.log("API call successful. Result dataฟหก:", result);
        setVersionEvo(result[0]?.vertion_evo); // เก็บ version_evo ที่ทำข้อสอบเพื่อดึงข้อสอบมา
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getScoreAssesment2 = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_question_mentor?activeKey=2&idemployee=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result[0].vertion_evo);
        setScoreData2(result); // เก็บผลลัพธ์ API ไว้ใน state
        // console.log("API call successful. Result data:กกกกก", result);
        setVersionEvo(result[0]?.vertion_evo); // เก็บ version_evo ที่ทำข้อสอบเพื่อดึงข้อสอบมา
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getScoreAssesment3 = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_question_mentor?activeKey=3&idemployee=${idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result[0].vertion_evo);
        setScoreData3(result); // เก็บผลลัพธ์ API ไว้ใน state
        // console.log("API call successful. Result data:", result);
        setVersionEvo(result[0]?.vertion_evo); // เก็บ version_evo ที่ทำข้อสอบเพื่อดึงข้อสอบมา
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

  useEffect(() => {
    if (versionEvo) {
      ReadData_question_singer(versionEvo);
      show_approval_mentor();
    }
  }, [versionEvo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTable(true);
    }, 1000); // รอ 2 วินาที

    return () => clearTimeout(timer);
  }, []);

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
    // ตรวจสอบว่ามีการให้คะแนนครบทุกข้อหรือไม่เมื่อ scores เปลี่ยนแปลง
    const totalSubQuestions = Object.values(subQuestions).flat().length;
    const numberOfScores = Object.keys(scores).length;
    setIsAssessmentComplete(
      numberOfScores === totalSubQuestions && totalSubQuestions > 0
    );
  }, [scores, subQuestions]);

  useEffect(() => {
    ReadData_daily();
    getScoreAssesment();
    getScoreAssesment2();
    getScoreAssesment3();
    // console.log(idemployee);
  }, [activeKey]);

  const handleClose = () => {
    setOpen(false);
    setIsAssessmentComplete(false);
    setVersionEvo(null);
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
    if (value >= 76) return { color: "#4caf50" }; // สีเขียว
    if (value >= 50) return { color: "rgba(214, 164, 0, 0.99)" }; // สีเหลือง
    return { color: "red" }; // สีแดง
  };

  const scoreLevel = getScoreLevel(percent);

  // คำนวณคะแนนรวม
  const activeScores2 =
    scoreData2 && Object.keys(scoreData2).length > 0 ? scoreData2 : scores;

  const totalScore2 = Object.values(activeScores2).reduce(
    (acc, val) => acc + (parseInt(val.score_evo) || 0),
    0
  );

  const totalQuestions2 = Object.keys(activeScores2).length;
  const percent2 =
    totalQuestions2 > 0
      ? ((totalScore2 / (totalQuestions2 * 4)) * 100).toFixed(2)
      : 0;

  const getScoreLevel2 = (percent2) => {
    const value = parseFloat(percent2);
    if (value >= 76) return { color: "#4caf50" }; // สีเขียว
    if (value >= 50) return { color: "rgba(214, 164, 0, 0.99)" }; // สีเหลือง
    return { color: "red" }; // สีแดง
  };

  const scoreLevel2 = getScoreLevel2(percent2);

  // คำนวณคะแนนรวม (เวอร์ชัน 3)
  const activeScores3 =
    scoreData3 && Object.keys(scoreData3).length > 0 ? scoreData3 : scores;

  const totalScore3 = Object.values(activeScores3).reduce(
    (acc, val) => acc + (parseInt(val.score_evo) || 0),
    0
  );

  const totalQuestions3 = Object.keys(activeScores3).length;
  const percent3 =
    totalQuestions3 > 0
      ? ((totalScore3 / (totalQuestions3 * 4)) * 100).toFixed(2)
      : 0;

  const getScoreLevel3 = (percent3) => {
    const value = parseFloat(percent3);
    if (value >= 76) return { color: "#4caf50" }; // สีเขียว
    if (value >= 50) return { color: "rgba(214, 164, 0, 0.99)" }; // สีเหลือง
    return { color: "red" }; // สีแดง
  };

  const scoreLevel3 = getScoreLevel3(percent3);

  const ReadData_question_singer = async () => {
    try {
      const { data } = await apiClient.get(
        `/question_user_view_singer?version_evo=${ap_vertion_evo}`
      );

      const { status, result } = data;
      if (status) {
        const { main_questions, sub_questions } = result;

        const formattedMainSections = main_questions.map((item) => ({
          id: item.id_main_section,
          criteria_name: item.criteria_name,
          isOld: true,
        }));

        setSections(formattedMainSections);

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

  const ReadData_question_singer2 = async () => {
    try {
      const { data } = await apiClient.get(
        `/question_user_view_singer?version_evo=${ap_vertion_evo}`
      );

      const { status, result } = data;
      if (status) {
        const { main_questions, sub_questions } = result;

        const formattedMainSections = main_questions.map((item) => ({
          id: item.id_main_section,
          criteria_name: item.criteria_name,
          isOld: true,
        }));

        setSections2(formattedMainSections);

        // console.log(sections);
        const groupedSubQuestions = sub_questions.reduce((acc, sub) => {
          if (!acc[sub.section_id]) {
            acc[sub.section_id] = [];
          }
          acc[sub.section_id].push(sub);
          return acc;
        }, {});
        setSubQuestions2(groupedSubQuestions);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const ReadData_question_singer3 = async () => {
    try {
      const { data } = await apiClient.get(
        `/question_user_view_singer?version_evo=${ap_vertion_evo}`
      );

      const { status, result } = data;
      if (status) {
        const { main_questions, sub_questions } = result;

        const formattedMainSections = main_questions.map((item) => ({
          id: item.id_main_section,
          criteria_name: item.criteria_name,
          isOld: true,
        }));

        setSections3(formattedMainSections);

        const groupedSubQuestions = sub_questions.reduce((acc, sub) => {
          if (!acc[sub.section_id]) {
            acc[sub.section_id] = [];
          }
          acc[sub.section_id].push(sub);
          return acc;
        }, {});
        setSubQuestions3(groupedSubQuestions);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if (ap_vertion_evo) {
      ReadData_question_singer();
      ReadData_question_singer2();
      ReadData_question_singer3();
    }
  }, [ap_vertion_evo]);

  return (
    <Box sx={{ maxWidth: 1550, mx: "auto" }}>
      {/* การประเมินเดือนหนึ่ง */}
      <DialogTitle>
        {" "}
        <center>
          <p className="mb-0" style={{ fontSize: "18px", fontWeight: "bold" }}>
            แบบประเมินพนักงานทดลองงาน ครั้งที่ 1
          </p>
        </center>
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
            </div>

            <center>
              {showTable ? (
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
                    animationData={loadingAnimation2} // ไฟล์ JSON ของแอนิเมชัน
                    loop={true}
                    style={{ width: 900, height: 400 }} // ขนาดที่ต้องการ
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
                      <td className="border p-2 font-bold">ต่ำกว่า 50 คะแนน</td>
                      <td className="border p-2 font-bold">
                        ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </center>

            <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
              <div className="pb-2">
                <h5 className="" style={{ fontSize: "14px" }}>
                  ความคิดเห็นของพี่เลี้ยง
                  (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                </h5>
              </div>

              {scoreData[0]?.ap_comment_emp && (
                <div className="pt-2">{scoreData[0].ap_comment_emp}</div>
              )}

              <div className="row container">
                <div className="col-md-6">
                  <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                    <div className="text-sm text-gray-500 text-left">
                      พี่เลี้ยง
                    </div>
                    <div className="mt-2"> {scoreData[0]?.ap_name_mentor}</div>
                    <div className="mt-2">
                      {" "}
                      ({scoreData[0]?.ap_posit_mentor})
                    </div>
                    <div className="text-sm text-gray-600">
                      {/* {item.ap_posit_mentor} */}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontWeight: "600",
                        color: "green",
                      }}
                    >
                      รับทราบ
                    </div>

                    <div className="text-sm mt-1">
                      {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                    <div className="text-sm text-gray-500 text-left">
                      ผจก. / หัวหน้าฝ่าย
                    </div>
                    <div className="mt-2"> {scoreData[0]?.ap_name_head}</div>
                    <div className="mt-2">
                      {" "}
                      ( {scoreData[0]?.ap_posit_head} )
                    </div>
                    <div className="text-sm text-gray-600">
                      {/* {item.ap_posit_mentor} */}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontWeight: "600",
                        color: "green",
                      }}
                    >
                      รับทราบ
                    </div>

                    <div className="text-sm mt-1">
                      {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                    </div>
                  </div>
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
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontWeight: "600",
                          color:
                            item.ap_status_mentor === "1" ? "green" : "orange",
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
          </div>
        </Grid>
      </DialogContent>
      <hr />
      {/* การประเมินเดือนสอง */}
      <DialogTitle>
        {" "}
        <center>
          <p className="mb-0" style={{ fontSize: "18px", fontWeight: "bold" }}>
            แบบประเมินพนักงานทดลองงาน ครั้งที่ 2
          </p>
        </center>
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
            </div>

            <center>
              {showTable ? (
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
                    {sections2.map((section, sectionIndex) => [
                      <tr key={`section-${section.id}`}>
                        <td className="p-2 font-bold" colSpan={6}>
                          {sectionIndex + 1}.{section.criteria_name}
                        </td>
                      </tr>,

                      ...(subQuestions2[section.id] || []).map(
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
                                {scoreData2?.find(
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
                            color: scoreLevel2.color,
                            fontWeight: "bold",
                          }}
                        >
                          {totalScore2}
                        </span>{" "}
                        คะแนน คิดเป็นร้อยละ{" "}
                        <span
                          style={{
                            color: scoreLevel2.color,
                            fontWeight: "bold",
                          }}
                        >
                          {percent2}% (
                          {percent2 >= 76
                            ? "สามารถปฏิบัติงานได้เป็นอย่างดี และหาความรู้ใหม่เพิ่มเติมเพื่อพัฒนางาน"
                            : percent2 >= 50
                            ? "สามารถปฏิบัติงานได้และพัฒนาการทำงานในด้านต่าง ๆ เพิ่มเติม"
                            : "ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ"}{" "}
                          )
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                    animationData={loadingAnimation2} // ไฟล์ JSON ของแอนิเมชัน
                    loop={true}
                    style={{ width: 900, height: 400 }} // ขนาดที่ต้องการ
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
                      <td className="border p-2 font-bold">ต่ำกว่า 50 คะแนน</td>
                      <td className="border p-2 font-bold">
                        ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </center>

            <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
              <div className="pb-2">
                <h5 className="" style={{ fontSize: "14px" }}>
                  ความคิดเห็นของพี่เลี้ยง
                  (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                </h5>
              </div>

              {scoreData2[0]?.ap_comment_emp && (
                <div className="pt-2">{scoreData2[0].ap_comment_emp}</div>
              )}
            </div>
            <div className="row container">
              <div className="col-md-6">
                <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                  <div className="text-sm text-gray-500 text-left">
                    พี่เลี้ยง
                  </div>
                  <div className="mt-2"> {scoreData[0]?.ap_name_mentor}</div>
                  <div className="mt-2"> ({scoreData[0]?.ap_posit_mentor})</div>
                  <div className="text-sm text-gray-600">
                    {/* {item.ap_posit_mentor} */}
                  </div>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontWeight: "600",
                      color: "green",
                    }}
                  >
                    รับทราบ
                  </div>

                  <div className="text-sm mt-1">
                    {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                  <div className="text-sm text-gray-500 text-left">
                    ผจก. / หัวหน้าฝ่าย
                  </div>
                  <div className="mt-2"> {scoreData2[0]?.ap_name_head}</div>
                  <div className="mt-2">
                    {" "}
                    ( {scoreData2[0]?.ap_posit_head} )
                  </div>
                  <div className="text-sm text-gray-600">
                    {/* {item.ap_posit_mentor} */}
                  </div>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontWeight: "600",
                      color: "green",
                    }}
                  >
                    รับทราบ
                  </div>

                  <div className="text-sm mt-1">
                    {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                  </div>
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
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontWeight: "600",
                          color:
                            item.ap_status_mentor === "1" ? "green" : "orange",
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
          </div>
        </Grid>
      </DialogContent>
      <hr />
      {/* การประเมินเดือนสอง */}
      <DialogTitle>
        {" "}
        <center>
          <p className="mb-0" style={{ fontSize: "18px", fontWeight: "bold" }}>
            แบบประเมินพนักงานทดลองงาน ครั้งที่ 3
          </p>
        </center>
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
            </div>

            <center>
              {showTable ? (
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
                    {sections3.map((section, sectionIndex) => [
                      <tr key={`section-${section.id}`}>
                        <td className="p-2 font-bold" colSpan={6}>
                          {sectionIndex + 1}.{section.criteria_name}
                        </td>
                      </tr>,

                      ...(subQuestions3[section.id] || []).map(
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
                                {scoreData3?.find(
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
                            color: scoreLevel3.color,
                            fontWeight: "bold",
                          }}
                        >
                          {totalScore3}
                        </span>{" "}
                        คะแนน คิดเป็นร้อยละ{" "}
                        <span
                          style={{
                            color: scoreLevel3.color,
                            fontWeight: "bold",
                          }}
                        >
                          {percent3}% (
                          {percent3 >= 76
                            ? "สามารถปฏิบัติงานได้เป็นอย่างดี และหาความรู้ใหม่เพิ่มเติมเพื่อพัฒนางาน"
                            : percent3 >= 50
                            ? "สามารถปฏิบัติงานได้และพัฒนาการทำงานในด้านต่าง ๆ เพิ่มเติม"
                            : "ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ"}{" "}
                          )
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                    animationData={loadingAnimation2} // ไฟล์ JSON ของแอนิเมชัน
                    loop={true}
                    style={{ width: 900, height: 400 }} // ขนาดที่ต้องการ
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
                      <td className="border p-2 font-bold">ต่ำกว่า 50 คะแนน</td>
                      <td className="border p-2 font-bold">
                        ควรปรับปรุงการปฏิบัติงานในด้านต่าง ๆ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </center>

            <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
              <div className=" pb-2">
                <h5 className="" style={{ fontSize: "14px" }}>
                  ความคิดเห็นของพี่เลี้ยง
                  (ระบุถึงข้อดีและข้อที่ควรปรับปรุงของพนักงาน)
                </h5>
              </div>

              {scoreData3[0]?.ap_comment_emp && (
                <div className="pt-2">{scoreData3[0].ap_comment_emp}</div>
              )}
            </div>

            <div className="row container">
              <div className="col-md-6">
                <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                  <div className="text-sm text-gray-500 text-left">
                    พี่เลี้ยง
                  </div>
                  <div className="mt-2"> {scoreData[0]?.ap_name_mentor}</div>
                  <div className="mt-2"> ({scoreData[0]?.ap_posit_mentor})</div>
                  <div className="text-sm text-gray-600">
                    {/* {item.ap_posit_mentor} */}
                  </div>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontWeight: "600",
                      color: "green",
                    }}
                  >
                    รับทราบ
                  </div>

                  <div className="text-sm mt-1">
                    {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="w-1/2 border border-gray-400 p-4 text-center rounded">
                  <div className="text-sm text-gray-500 text-left">
                    ผจก. / หัวหน้าฝ่าย
                  </div>
                  <div className="mt-2"> {scoreData3[0]?.ap_name_head}</div>
                  <div className="mt-2">
                    {" "}
                    ( {scoreData3[0]?.ap_posit_head} )
                  </div>
                  <div className="text-sm text-gray-600">
                    {/* {item.ap_posit_mentor} */}
                  </div>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontWeight: "600",
                      color: "green",
                    }}
                  >
                    รับทราบ
                  </div>

                  <div className="text-sm mt-1">
                    {/* {convertToThaiDate(item.ap_date_approval_mentor)} */}
                  </div>
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
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontWeight: "600",
                          color:
                            item.ap_status_mentor === "1" ? "green" : "orange",
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
          </div>
        </Grid>
      </DialogContent>
    </Box>
  );
};

export default ViewWorkLogForumReport;
