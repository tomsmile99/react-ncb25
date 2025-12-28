import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../recoilstore/userStores";
import { Button, Form, Card, Table, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

//TOKEN
import { useRecoilValue } from "recoil";
import { userToken } from "../../recoilstore/userStores";

const EvaluationForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const version = params.get("version");

  useEffect(() => {
    console.log("Version:", version);
  }, [version]);

  const decodeBase64 = (encodedString) => {
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("Error decoding Base64 string", error);
      return encodedString;
    }
  };

  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState("");

  const [subQuestions, setSubQuestions] = useState({}); // Object to group by section ID
  const [showModal, setShowModal] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [newSubQuestion, setNewSubQuestion] = useState("");

  // const removeSection = (section) => {   //ลบหัวข้อใหญ่
  //   setSections(sections.filter((s) => s.id !== section.id));
  //   const updatedSubQuestions = { ...subQuestions };
  //   delete updatedSubQuestions[section.id];
  //   setSubQuestions(updatedSubQuestions);

  // };
  const removeSection1 = (idToRemove) => {
    // ลบ section ออกจากอาเรย์
    const updatedSections = sections.filter(
      (section) => section.id !== idToRemove
    );
    setSections(updatedSections);

    // ลบ subQuestions ที่เกี่ยวข้องกับ section นั้น
    const updatedSubQuestions = { ...subQuestions };
    delete updatedSubQuestions[idToRemove];
    setSubQuestions(updatedSubQuestions);
  };

  const removeSection = async (section) => {
    //  เป็นหัวข้อใหม่ที่ยังไม่บันทึกลงฐานข้อมูล

    if (section == "") {
      alert(section);
      setSections(sections.filter((s) => s.id !== section.id));
    } else {
      setSections(sections.filter((s) => s.id !== section.id));
      //  เป็นหัวข้อที่มาจากฐานข้อมูล ต้องยิง API ไปลบ
      try {
        const response = await apiClient.post("/question_del", {
          id_main_section: section,
          // status: true,
        });

        if (response && response.data) {
          ReadData_question_singer();

          Swal.fire({
            icon: "success",
            title: "ลบสำเร็จ",
            text: "เปิดใช้งานเวอร์ชันเรียบร้อยแล้ว",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถส่งข้อมูลได้",
        });
      }
    }
  };

  const openModal = (section) => {
    setCurrentSection(section.id);
    setShowModal(true);
  };

  const handleAddSubQuestion = () => {
    if (newSubQuestion.trim() !== "") {
      setSubQuestions({
        ...subQuestions,
        [currentSection]: [
          ...(subQuestions[currentSection] || []),
          { criteria_name_sec: newSubQuestion }, // Store as object
        ],
      });
      setNewSubQuestion("");
      setShowModal(false);
    }
  };

  const removeSubQuestion = (sectionId, subIndex) => {
    //ลบหัวข้อย่อย

    setSubQuestions({
      ...subQuestions,
      [sectionId]: subQuestions[sectionId].filter(
        (_, index) => index !== subIndex
      ),
    });
  };

  const addSection = () => {
    if (newSection.trim() !== "") {
      const generateRandomId = (length = 10) => {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      };

      const newSectionObject = {
        id: generateRandomId(),
        criteria_name: newSection,
      };

      setSections([...sections, newSectionObject]);
      setSubQuestions({ ...subQuestions, [newSectionObject.id]: [] });
      setNewSection("");
    }
  };

  const ReadData_question_singer = async () => {
    try {
      const { data } = await apiClient.get(
        `/question_view_singer?version=${version}`
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
        console.log(sections)

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

  const handleSave = async () => {
    const generateId = () => "_" + Math.random().toString(36).substr(2, 9);
    const newSectionsToSave = sections.filter((section) => !section.isOld);

    const newSectionData = newSectionsToSave.map((section) => {
      const section_id = section.id; // Use the temporary ID generated on the client
      return {
        id: section_id,
        section_name: section.criteria_name,
        version: version,
        sub_questions: (subQuestions[section.id] || []).map((q) => ({
          id: generateId(),
          section_id,
          question: q.criteria_name_sec,
          version: version,
        })),
      };
    });

    const existingSectionsWithNewSubs = sections
      .filter(
        (section) =>
          section.isOld && subQuestions[section.id]?.some((sub) => !sub.id)
      )
      .map((section) => ({
        id: section.id,
        sub_questions: (subQuestions[section.id] || [])
          .filter((sub) => !sub.id) // Only new sub-questions
          .map((q) => ({
            id: generateId(),
            section_id: section.id,
            question: q.criteria_name_sec,
            version: version,
          })),
      }));

    const newSubQuestionsPayloadForExistingSections =
      existingSectionsWithNewSubs.flatMap(({ sub_questions }) => sub_questions);

    const newSectionsPayload = newSectionData.map(
      ({ id, section_name, version }) => ({
        id,
        section_name,
        version,
      })
    );

    const newSubQuestionsPayloadForNewSections = newSectionData.flatMap(
      ({ sub_questions }) => sub_questions
    );

    try {
      if (newSectionsPayload.length > 0) {
        const responseNewSections = await apiClient.post("/question_inseart", {
          sections: newSectionsPayload,
        });

        if (responseNewSections && responseNewSections.data) {
          console.log("New Sections Saved:", responseNewSections.data.message);
        }
      }

      if (newSubQuestionsPayloadForNewSections.length > 0) {
        const responseNewSubQuestions = await apiClient.post(
          "/sub_question_inseart",
          {
            subquestions: newSubQuestionsPayloadForNewSections,
          }
        );
        if (responseNewSubQuestions && responseNewSubQuestions.data) {
          console.log(
            "New Sub Questions for New Sections Saved:",
            responseNewSubQuestions.data.message
          );
        }
      }

      if (newSubQuestionsPayloadForExistingSections.length > 0) {
        const responseExistingSubQuestions = await apiClient.post(
          "/sub_question_inseart",
          {
            subquestions: newSubQuestionsPayloadForExistingSections,
          }
        );
        if (responseExistingSubQuestions && responseExistingSubQuestions.data) {
          console.log(
            "New Sub Questions for Existing Sections Saved:",
            responseExistingSubQuestions.data.message
          );
        }
      }

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เปิดใช้งานเวอร์ชันเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });

      ReadData_question_singer();
    } catch (error) {
      console.error("Error saving form:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  useEffect(() => {
    ReadData_question_singer();
  }, [version]);

  return (
    <div className="">
      <Card className="cartcustom p-3 shadow-sm">
        <Card.Header className="bg-primary text-white cartcustomTag">
          <h5 className="mb-0" style={{ fontSize: "14px" }}>
            รายชื่อพนักงานทดลองงาน (อยู่ภายใต้การดูแล) สร้างฟอร์มเวอร์ชัน{" "}
            {version}
          </h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>เพิ่มหัวข้อใหญ่ ( ไม่ต้องใส่เลขข้อ )</Form.Label>
              <div className="row d-flex align-items-center">
                <div className="col-md-10">
                  <Form.Control
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="ใส่ชื่อหัวข้อใหญ่"
                    className="h-100"
                  />
                </div>
                <div className="col-md-2 d-flex align-items-stretch ">
                  <Button
                    className="w-100"
                    style={{
                      height: "80%",
                      borderRadius: "7px",
                      padding: "10px",
                    }}
                    onClick={addSection}
                  >
                    เพิ่มหัวข้อ
                  </Button>
                </div>
              </div>
            </Form.Group>
          </Form>

          {sections.map((section, index) => (
            <Card className="mt-2 cartcustom" key={section.id}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="col-md-12 row">
                  <div className="col-10">
                    <h6 className="mb-0">
                      {index + 1}.{section.criteria_name}
                      {section.isOld && (
                        <span className="text-muted ml-2">
                          (จากเวอร์ชันก่อนหน้า)
                        </span>
                      )}
                    </h6>
                  </div>
                  <div className="col-md-2 d-flex justify-content-end">
                    <Button
                      size="sm"
                      style={{ fontSize: "10px" }}
                      onClick={() => openModal(section)}
                      className="mr-1"
                    >
                      <FaPlus /> เพิ่มหัวข้อย่อย
                    </Button>
                    {section.isOld ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-white"
                        onClick={() => removeSection(section.id)}
                      >
                        <FaTrash />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-white"
                        onClick={() => removeSection1(section.id)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Table bordered>
                  <tbody>
                    {(subQuestions[section.id] || []).map((sub, subIndex) => (
                      <tr key={sub.id || subIndex}>
                        {" "}
                        {/* Use sub.id if it exists (for old subs) */}
                        <td style={{ width: "5%" }}>
                          {index + 1}.{subIndex + 1}
                        </td>
                        <td style={{ width: "90%" }}>
                          {sub.criteria_name_sec}
                        </td>
                        <td style={{ width: "5%" }}>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-white"
                            onClick={() =>
                              removeSubQuestion(section.id, subIndex)
                            }
                            disabled={sub.isOld}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(subQuestions[section.id] || []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          ไม่มีหัวข้อย่อย
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
        {(sections.some((sec) => !sec.isOld) ||
          Object.values(subQuestions)
            .flat()
            .some((sub) => !sub.isOld) ||
          Object.keys(subQuestions).length > 0) && (
          <div
            className="mt-3 text-end"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button onClick={handleSave}>บันทึกการปรับรูปแบบฟอร์ม</Button>
          </div>
        )}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มหัวข้อย่อย</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newSubQuestion}
            onChange={(e) => setNewSubQuestion(e.target.value)}
            placeholder="ใส่ชื่อหัวข้อย่อย"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleAddSubQuestion}>
            เพิ่มหัวข้อย่อย
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EvaluationForm;
