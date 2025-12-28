import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  FaCheck,
  FaUsers,
  FaMale,
  FaFemale,
  FaChartLine,
  FaClock,
  FaRedo,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillFileEarmarkBarGraphFill } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { PieChart } from "@mui/x-charts/PieChart";
const AdminReadData = () => {
  const totalEmployees = 100;
  const passedEmployees = 72;
  const failedEmployees = totalEmployees - passedEmployees;

  const percentPassed = (passedEmployees / totalEmployees) * 100;
  const percentFailed = 100 - percentPassed;

  const failReasons = [
    { reason: "มาสายบ่อย", count: 10 },
    { reason: "ไม่ทำตามคำสั่ง", count: 12 },
    { reason: "ผลประเมินต่ำ", count: 6 },
  ];

  const employeeList = [
    {
      id: 1,
      name: "สมชาย ใจดี",
      region: "ภาคธุรกิจที่ 1",
      passed: true,
      gender: "ชาย",
      age: 28,
      score: 85,
      evaluationTime: 30,
    },
    {
      id: 2,
      name: "สมศรี กล้าหาญ",
      region: "ภาคธุรกิจที่ 1",
      passed: false,
      gender: "หญิง",
      age: 34,
      score: 60,
      evaluationTime: 40,
    },
    {
      id: 3,
      name: "อนงค์ แสนดี",
      region: "ภาคธุรกิจที่ 2",
      passed: true,
      gender: "หญิง",
      age: 26,
      score: 88,
      evaluationTime: 28,
    },
    {
      id: 4,
      name: "มนัส รักจริง",
      region: "ภาคธุรกิจที่ 2",
      passed: false,
      gender: "ชาย",
      age: 42,
      score: 55,
      evaluationTime: 45,
    },
    {
      id: 5,
      name: "สุนีย์ วิไล",
      region: "ภาคธุรกิจที่ 3",
      passed: true,
      gender: "หญิง",
      age: 29,
      score: 90,
      evaluationTime: 35,
    },
    {
      id: 6,
      name: "สมปอง ตรงใจ",
      region: "ภาคธุรกิจที่ 3",
      passed: false,
      gender: "ชาย",
      age: 31,
      score: 50,
      evaluationTime: 50,
    },
    {
      id: 7,
      name: "ปรีชา พงษ์ทอง",
      region: "ภาคธุรกิจที่ 4",
      passed: true,
      gender: "ชาย",
      age: 40,
      score: 80,
      evaluationTime: 33,
    },
    {
      id: 8,
      name: "สุดารัตน์ ใจงาม",
      region: "ภาคธุรกิจที่ 4",
      passed: false,
      gender: "หญิง",
      age: 36,
      score: 65,
      evaluationTime: 42,
    },
    {
      id: 9,
      name: "ณรงค์ชัย สมาน",
      region: "ภาคธุรกิจที่ 5",
      passed: true,
      gender: "ชาย",
      age: 30,
      score: 87,
      evaluationTime: 30,
    },
    {
      id: 10,
      name: "อำพร ทองคำ",
      region: "ภาคธุรกิจที่ 5",
      passed: false,
      gender: "หญิง",
      age: 38,
      score: 58,
      evaluationTime: 48,
    },
    {
      id: 11,
      name: "ประทีป สมหวัง",
      region: "สำนักงานใหญ่",
      passed: true,
      gender: "ชาย",
      age: 33,
      score: 92,
      evaluationTime: 29,
    },
    {
      id: 12,
      name: "ดวงใจ ปราณี",
      region: "สำนักงานใหญ่",
      passed: false,
      gender: "หญิง",
      age: 27,
      score: 63,
      evaluationTime: 44,
    },
  ];

  // คำนวณอัตราการผ่านตามเพศ
  const genders = ["ชาย", "หญิง"];
  const passByGender = genders.map((gender) => {
    const filtered = employeeList.filter((e) => e.gender === gender);
    const passed = filtered.filter((e) => e.passed).length;
    return {
      gender,
      percent: filtered.length === 0 ? 0 : (passed / filtered.length) * 100,
      total: filtered.length,
      passed,
    };
  });

  // คำนวณคะแนนเฉลี่ยและเวลาประเมินเฉลี่ยแต่ละภาคธุรกิจที่
  const regions = [
    "ภาคธุรกิจที่ 1",
    "ภาคธุรกิจที่ 2",
    "ภาคธุรกิจที่ 3",
    "ภาคธุรกิจที่ 4",
    "ภาคธุรกิจที่ 5",
    "สำนักงานใหญ่",
  ];
  const regionMetrics = regions.map((region) => {
    const employees = employeeList.filter((e) => e.region === region);
    const averageScore =
      employees.reduce((acc, cur) => acc + cur.score, 0) /
      (employees.length || 1);
    const averageTime =
      employees.reduce((acc, cur) => acc + cur.evaluationTime, 0) /
      (employees.length || 1);
    const passedCount = employees.filter((e) => e.passed).length;
    const reviewCount = employees.filter((e) => {
      // สมมุติ: ถ้าคะแนนอยู่ระหว่าง 50-70 ต้องทบทวน
      return e.score >= 50 && e.score <= 70;
    }).length;

    return {
      region,
      averageScore: averageScore.toFixed(2),
      averageTime: averageTime.toFixed(1),
      passRate:
        employees.length === 0 ? 0 : (passedCount / employees.length) * 100,
      reviewCount,
      total: employees.length,
    };
  });

  const pieData = passByGender.map(({ gender, percent, total }, index) => {
    const passed = Math.round((percent / 100) * total);
    return {
      id: index,
      value: passed,
      label: gender,
      color: gender === "ชาย" ? "#1976d2" : "#d81b60",
    };
  });

  return (
    <Box
      sx={{
        backgroundColor: "#F7FAFC",
        minHeight: "vh",
        padding: "2rem",
        fontFamily: "Prompt, sans-serif",
      }}
    >
      {/* <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#1565C0",
          mb: 3,
          textAlign: "center",
        }}
      >
        แดชบอร์ดการประเมินพนักงาน
      </Typography> */}

      <Grid container spacing={3}>
        {/* Total */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)", // สำหรับ Safari
              border: "1px solid rgba(255, 255, 255, 0.18)",
              // padding: "1rem",
              zIndex: 10,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#1565C0", width: 50, height: 50 }}>
                  <FaUsers size={30} />
                </Avatar>
                <Box>
                  <Typography color="text.secondary">พนักงานทั้งหมด</Typography>
                  <Typography variant="h5">{totalEmployees} คน</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percentPassed}
                    sx={{ mt: 1, height: 8, borderRadius: 5 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Passed */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)", // สำหรับ Safari
              border: "1px solid rgba(255, 255, 255, 0.18)",
              // padding: "1rem",
              zIndex: 10,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#51906f", width: 50, height: 50 }}>
                  <FaCheck size={30} />
                </Avatar>
                <Box>
                  <Typography color="text.secondary">ผ่านการประเมิน</Typography>
                  <Typography variant="h5">{passedEmployees} คน</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percentPassed}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#c1cdc8", // สีพื้นหลัง (track)
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#51906f", // สีของแถบ value (สีแดง)
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Failed */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)", // สำหรับ Safari
              border: "1px solid rgba(255, 255, 255, 0.18)",
              // padding: "1rem",
              zIndex: 10,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#f6494b", width: 50, height: 50 }}>
                  <IoClose size={40} />
                </Avatar>
                <Box>
                  <Typography color="text.secondary">
                    ไม่ผ่านการประเมิน
                  </Typography>
                  <Typography variant="h5">{failedEmployees} คน</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percentFailed}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#FFCDD2", // สีพื้นหลัง (track)
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#f6494b", // สีของแถบ value (สีแดง)
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              padding: "1rem",
              zIndex: 10,
              p: 2,
              mt: 2,
            }}
          >
           

<Typography
              variant="h6"
              sx={{ color: "#1565C0", fontWeight: 500, mb: 2 }}
            >
              <BsFillFileEarmarkBarGraphFill
                sx={{ fontWeight: "bold", color: "#1565C0" }}
              />{" "}
              สรุปการประเมินแยกตามภาคธุรกิจที่ <hr />
            </Typography>
            <Grid container spacing={2}>
              {[
                "ภาคธุรกิจที่ 1",
                "ภาคธุรกิจที่ 2",
                "ภาคธุรกิจที่ 3",
                "ภาคธุรกิจที่ 4",
                "ภาคธุรกิจที่ 5",
                "สำนักงานใหญ่",
              ].map((regionName) => {
                const employeesInRegion = employeeList.filter(
                  (e) => e.region === regionName
                );
                const passed = employeesInRegion.filter((e) => e.passed).length;
                const failed = employeesInRegion.length - passed;

                return (
                  <Grid item xs={12} md={4} key={regionName}>
                    <Card
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        boxShadow:
                          "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)", // สำหรับ Safari
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        padding: "1rem",
                        zIndex: 10,
                        mt: 1,
                        p: 2,
                      }}
                      variant="outlined"
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "#1565C0",
                        }}
                      >
                        {regionName}
                      </Typography>

                      <PieChart
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: passed,
                                label: "ผ่าน",
                                color: "#1565C0",
                              },
                              {
                                id: 1,
                                value: failed,
                                label: "ไม่ผ่าน",
                                color: "#f6494b",
                              },
                            ],
                            innerRadius: 20,
                            outerRadius: 40,
                          },
                        ]}
                        width={200}
                        height={100}
                      />
                      {/* <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 300, // ตัวบาง
                          fontSize: "16px", // ขนาดพอดี
                          color: "#2e7d32", // เขียวมาตรฐาน
                        }}
                      >
                        <FaCheckCircle
                          style={{ marginRight: 3, fontSize: "18px" }}
                        />
                        ผ่าน: {passed} คน
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 300, // ตัวบาง
                          fontSize: "16px", // ขนาดพอดี
                          color: "#d81b60", // เขียวมาตรฐาน
                        }}
                      >
                        {" "}
                        ❌ ไม่ผ่าน: {failed} คน
                      </Typography> */}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>

        {/* การ์ดที่สอง */}
        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow:
                "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              padding: "1rem",
              zIndex: 10,
              p: 2,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#1565C0", fontWeight: 500, mb: 2, mt: 1 }}
            >
              <VscGraph sx={{ fontWeight: "bold", color: "#1565C0" }} />{" "}
              สาเหตุที่ไม่ผ่านการประเมิน <hr />
            </Typography>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: failReasons.map((item) => item.reason),
                },
              ]}
              series={[
                {
                  data: failReasons.map((item) => item.count),
                  color: "#4285f4",
                },
              ]}
              height={300}
            />
          </Card>
        </Grid>


        
      </Grid>

      {/* Summary by Region */}
      <Card
        sx={{
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow:
            "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          padding: "1rem",
          zIndex: 10,
          mt: 2,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#1565C0", fontWeight: 500, mb: 3 }}
        >
          <FaClock size={22} /> ตัวชี้วัดเชิงลึก (KPI / Metrics) <hr />
        </Typography>

        <Grid container spacing={2}>
          {/* อัตราการผ่านตามเพศ */}
          {passByGender.map(({ gender, percent, total }) => {
            const icon =
              gender === "ชาย" ? (
                <FaMale size={40} color="#1976d2" />
              ) : (
                <FaFemale size={40} color="#d81b60" />
              );
            return (
              <Grid item xs={12} md={6} key={`gender-${gender}`}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  {icon}
                  <Box>
                    <Typography sx={{ fontWeight: "bold", color: "#1565C0" }}>
                      {gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ผ่าน: {percent.toFixed(1)}% จาก {total} คน
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}

          {/* อัตราการผ่านรวมแต่ละภาคธุรกิจที่ (%) */}
          {regionMetrics.map(({ region, passRate, total }) => (
            <Grid item xs={12} md={4} key={`passrate-${region}`}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <FaCheckCircle size={22} color="#1565C0" />
                <Box>
                  <Typography sx={{ fontWeight: "bold", color: "#1565C0" }}>
                    {region}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ผ่าน: {passRate.toFixed(1)}% จาก {total} คน
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}

          {/* คะแนนเฉลี่ย และเวลาที่ใช้ประเมินแต่ละภาคธุรกิจที่ */}
          {/* {regionMetrics.map(({ region, averageScore, averageTime }) => (
            <Grid item xs={12} md={4} key={`scoretime-${region}`}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography sx={{ fontWeight: "bold", color: "#1565C0" }}>
                  {region}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaChartLine color="#1565C0" />
                  <Typography variant="body2" color="text.secondary">
                    คะแนนเฉลี่ย: {averageScore}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaClock color="#1565C0" />
                  <Typography variant="body2" color="text.secondary">
                    เวลาประเมินเฉลี่ย: {averageTime} นาที
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))} */}

          {/* จำนวนพนักงานที่ต้องทบทวน / ประเมินซ้ำ */}
          {/* {regionMetrics.map(({ region, reviewCount }) => (
            <Grid item xs={12} md={4} key={`review-${region}`}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <FaRedo color="#d32f2f" size={22} />
                <Box>
                  <Typography sx={{ fontWeight: "bold", color: "#1565C0" }}>
                    {region}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ต้องทบทวน: {reviewCount} คน
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))} */}
        </Grid>

        {/* เวลาที่ใช้ในการประเมิน / ทดสอบเฉลี่ยรวม */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#1565C0",
            fontWeight: "500",
          }}
        >
          {/* <FaClock size={22} />
          <Typography variant="h6" component="span">
           ข้อมูลเชิงลึกโดยการประเมินจากข้อมูลจริง
          </Typography>
          <Typography
            variant="h6"
            component="span"
            color="text.secondary"
            fontWeight="normal"
          >
            {(
              employeeList.reduce((acc, cur) => acc + cur.evaluationTime, 0) /
              employeeList.length
            ).toFixed(1)}{" "}
            นาที
          </Typography> */}
        </Box>
      </Card>

      <Card
        sx={{
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow:
            "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)", // สำหรับ Safari
          border: "1px solid rgba(255, 255, 255, 0.18)",
          padding: "1rem",
          zIndex: 10,
          mt: 2,
          p: 2,
        }}
      >
        {" "}
        {/* สาเหตุหลักที่ไม่ผ่าน */}
        <Typography
          variant="h6"
          sx={{ color: "#1565C0", fontWeight: 500, mt: 3, mb: 2 }}
        >
          สาเหตุหลักที่ไม่ผ่าน <hr />
        </Typography>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: failReasons.map((item) => item.reason),
            },
          ]}
          series={[
            {
              data: failReasons.map((item) => item.count),
              color: "#4285f4",
            },
          ]}
          height={200}
        />
      </Card>

      {/* Employee Table */}
      <Card
        sx={{
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow:
            "0px 4px 8px rgba(16, 42, 156, 0.1), 0px 8px 16px rgba(16, 42, 156, 0.05)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)", // สำหรับ Safari
          // border: "1px solid rgba(255, 255, 255, 0.18)",
          padding: "1rem",
          zIndex: 10,
          mt: 2,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#1565C0", fontWeight: 500, mb: 2 }}
        >
          รายชื่อพนักงานและผลการประเมิน
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#4286f5" }}>
                <TableCell sx={{ color: "white" }}>ลำดับ</TableCell>
                <TableCell sx={{ color: "white" }}>ชื่อพนักงาน</TableCell>
                <TableCell sx={{ color: "white" }}>ภาคธุรกิจที่</TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  สถานะ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.region}</TableCell>
                  <TableCell align="center">
                    {employee.passed ? (
                      <Typography sx={{ color: "#2E7D32", fontWeight: "bold" }}>
                        ผ่าน
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "#C62828", fontWeight: "bold" }}>
                        ไม่ผ่าน
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AdminReadData;
