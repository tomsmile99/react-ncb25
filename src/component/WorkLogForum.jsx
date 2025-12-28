import { useState, useEffect } from "react";
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
import apiClient from "../recoilstore/userStores";
import TextareaAutosize from "react-textarea-autosize";
import Swal from "sweetalert2";
import { FaCheckCircle } from "react-icons/fa";
//TOKEN

import { useRecoilValue } from "recoil";
import { userToken } from "../recoilstore/userStores";

//icons

import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";

const WorkLogForum = ({ activeKey }) => {
  const decodeBase64 = (encodedString) => {
    //แปลง Base 64 จาก token
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("Error decoding Base64 string", error);
      return encodedString;
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

  //token
  const userDetails = useRecoilValue(userToken);
  const Idemployee = decodeBase64(userDetails.PerD); // รหัสผู้บันทึก

  //useState
  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editActivity, setEditActivity] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [delId, setDelId] = useState();

  const [approval, setApproval] = useState("");
  const [status_app, setStatus_app] = useState("");

  const [datasing, setDatasing] = useState([]);

  const handleSaveSingleEntry = async () => {
    if (!date || !activity) {
      alert("กรุณากรอกวันที่และกิจกรรมให้ครบ");
      return;
    }

    const newEntry = { date, activity, note, activeKey, Idemployee };

    try {
      const response = await apiClient.post("/daily_inseart", newEntry); // ส่งเป็น array เพื่อให้ backend ใช้งานได้เหมือนเดิม

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลเรียบร้อย!",
          text: "รายการของคุณถูกเพิ่มแล้ว",
          showConfirmButton: false, // ไม่แสดงปุ่ม "ตกลง"
          timer: 2000, // ตั้งเวลาให้ปิดเองใน 5000 มิลลิวินาที (5 วินาที)
        });

        // เคลียร์ฟอร์มหลังจากบันทึก
        ReadData_daily();
        setDate("");
        setActivity("");
        setNote("");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  //เรียกข้อมูลแยก
  const ReadData_daily = async () => {
    try {
      const { data } = await apiClient.get(
        `/daily_view?activeKey=${activeKey}&idper=${Idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);

        setDatasing(result);

        // setEntries([newEntry, ...entries]); // แค่เพิ่มข้อมูลเข้า state
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //ดึงสเตตัสการอนุมัติเพิ่อควบคุมปุ่ม
  const show_approval_mentor = async () => {
    try {
      const { data } = await apiClient.get(
        `/show_approval_mentor?activeKey=${activeKey}&idemployee=${Idemployee}`
      );

      const { status, result } = data;
      if (status) {
        // console.log("API call successful. Result data:", result);
        setApproval(result);
        const status_approval = result[0]?.ap_status_head ?? ""; // ถ้าไม่มี comment ให้ใส่ค่าว่าง
        setStatus_app(status_approval);
      } else {
        console.error("Error: Status is not true. Received data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleResetinput = async () => {
    setDate(""); // ล้างวันที่
    setActivity(""); // ล้างงานที่ปฏิบัติ
    setNote(""); // ล้างหมายเหตุ
  };

  useEffect(() => {
    ReadData_daily();
    show_approval_mentor();
  }, [activeKey]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedEntry = {
          id: id,
        };

        try {
          const response = await apiClient.post(`/daily_del`, updatedEntry);
          console.log("Full Response:", response); // ดู Response ทั้งหมด

          if (response && response.data) {
            // ตรวจสอบว่า response และ response.data มีค่า
            // console.log("Response Data:", response.data); // ดูข้อมูลใน response.data
            // console.log("ID from Backend:", response.data.result); // เก็บ idper ที่ส่งมาจากหลังบ้าน
            ReadData_daily(); // ดึงข้อมูลใหม่
            Swal.fire("ลบเรียบร้อย!", "รายการของคุณถูกลบแล้ว", "success");
          } else {
            console.error(
              "delete failed:",
              response ? response.data.message : "No response received"
            );
            Swal.fire("Error!", "Failed to delete the entry.", "error");
          }
        } catch (error) {
          console.error("Error during delete:", error);
          Swal.fire("Error!", "Something went wrong during deletion.", "error");
        }
      }
    });
  };
  const handleEdit = (index, entry) => {
    setEditIndex(index);
    setEditDate(entry.daily_work_date);
    setEditActivity(entry.daily_work_result);
    setEditNote(entry.daily_work_issues);
    setOpenDialog(true);
    setEditId(entry.record_id);
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

      console.log("Full Response:", response); // ดู Response ทั้งหมด
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

  const entryWithDate = datasing.find((entry) => entry.daily_work_date);

  return (
    <Box sx={{ maxWidth: 1550, mx: "auto", mt: 2 }}>
      <form>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="วันที่"
              type="date"
              InputLabelProps={{
                shrink: true,
                style: { fontSize: "0.8rem" },
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              size="small"
              disabled={status_app === "1"}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "auto",
              overflow: "hidden",
            }}
          >
            <TextField
              fullWidth
              multiline
              InputProps={{
                inputComponent: TextareaAutosize,
                style: {
                  padding: "8px",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                },
              }}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
              InputLabelProps={{
                style: { fontSize: "0.8rem" },
              }}
              placeholder="งานที่ปฏิบัติแต่ละวัน..."
              disabled={status_app === "1"}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="หมายเหตุ (ถ้ามี)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              size="small"
              InputLabelProps={{
                style: { fontSize: "0.8rem" },
              }}
              disabled={status_app === "1"}
            />
          </Grid>

          {/* ปุ่มเพิ่ม */}

          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3056d2",
                color: "white",
                borderRadius: "7px",
                "&:hover": { backgroundColor: "#516fd2" },
                padding: "8px 16px",
              }}
              onClick={handleSaveSingleEntry} // ปุ่มเพิ่ม: แค่เพิ่มข้อมูลใน state
              fullWidth
              disabled={status_app === "1"}
            >
              <FaCirclePlus className="mr-2" /> เพิ่ม
            </Button>
          </Grid>

          {/* ปุ่มบันทึก */}
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#516fd2",
                color: "white",
                borderRadius: "7px",
                "&:hover": { backgroundColor: "#3056d2" },
                padding: "8px 16px",
              }}
              onClick={handleResetinput} // ปุ่มบันทึก: ส่งข้อมูลไป API
              fullWidth
              disabled={status_app === "1"}
            >
              <BiReset className="mr-2" style={{ fontSize: "18px" }} /> ล้าง
            </Button>
          </Grid>
        </Grid>
      </form>

      <hr />
      {datasing.length != 0 ? (
        <div
          style={{
            backgroundColor: "#fafbff",
            padding: "16px",
            borderRadius: "10px",
            textAlign: "center",
            color: "#6e7e8b",
            fontFamily: "TH Sarabun PSK", // ฟอนต์ที่อ่านง่าย
          }}
        >
          {/* หัวข้อ */}
          <Typography
            variant="body1"
            style={{ fontSize: "15px", fontWeight: 600 }}
          >
            ตารางบันทึกการปฏิบัติงาน
          </Typography>

          {/* วันที่ */}
          {entryWithDate &&
            (() => {
              const date = new Date(entryWithDate.daily_work_date);
              const month = date.toLocaleString("th-TH", { month: "long" });
              const year = date.getFullYear() + 543;

              return (
                <Typography
                  variant="body2"
                  style={{ fontSize: "14px", marginTop: 4 }}
                >
                  ครั้งที่ {activeKey} เดือน {month} พ.ศ. {year}
                </Typography>
              );
            })()}

          {/* สถานะ */}

          {status_app === "1" && (
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              gap={0.7}
              sx={{
                marginTop: 1,
                px: 1.5,
                py: 0.5,
                background: "rgba(0, 128, 0, 0.08)", // เขียวจางๆ
                borderRadius: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(0, 128, 0, 0.15)",
                  transform: "scale(1.03)",
                },
              }}
            >
              <FaCheckCircle
                style={{
                  color: "#03a446ff",
                  fontSize: "16px",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <Typography
                variant="body2"
                style={{
                  fontSize: "13px",
                  color: "#03a446ff",
                  fontWeight: 500,
                }}
              >
                ถูกประเมินผลแล้ว
              </Typography>
            </Box>
          )}
        </div>
      ) : null}

      <Box sx={{ mt: 4 }}>
        {datasing.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            ยังไม่มีรายการบันทึก
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "200px", maxWidth: "200px" }}>
                  วันที่
                </TableCell>
                <TableCell sx={{ width: "800px", maxWidth: "800px" }}>
                  รายละเอียดการปฏิบัติงาน
                </TableCell>
                <TableCell sx={{ width: "200px", maxWidth: "200px" }}>
                  <center> ปัญหาที่พบ / คำแนะนำจากพี่เลี้ยง</center>
                </TableCell>
                <TableCell sx={{ width: "100px", maxWidth: "100px" }}>
                  <center> การกระทำ</center>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datasing.map((entry, index) => (
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
                    }}
                  >
                    {entry.daily_work_issues}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(index, entry)}
                        size="small"
                        disabled={status_app === "1"}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(entry.record_id)}
                        size="small"
                        disabled={status_app === "1"}
                      >
                        <FaRegTrashCan />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        <DialogTitle>แก้ไขรายการ </DialogTitle>
        <DialogContent className="pt-2">
          <TextField
            fullWidth
            label="วันที่"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
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
    </Box>
  );
};

export default WorkLogForum;
