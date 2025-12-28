import React, { useState } from "react";

const IdeaForm = () => {
  const [formData, setFormData] = useState({
    ideaTitle: "",
    benefits: "",
    rationale: "",
    process: "",
    expectedResults: "",
    budget: "",
    mentorComment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ข้อมูลที่กรอก:", formData);
    // ส่งข้อมูล formData ไปยัง API ที่ต้องการ
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-5"
    >
      <h2 className="text-2xl font-bold text-center">แบบเสนอแนวคิด</h2>

      <div>
        <label className="font-semibold">1. แนวคิดเรื่อง:</label>
        <input
          type="text"
          name="ideaTitle"
          value={formData.ideaTitle}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกชื่อแนวคิด"
        />
      </div>

      <div>
        <label className="font-semibold">2. ประโยชน์ของแนวคิด:</label>
        <textarea
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          rows={3}
          placeholder="เช่น ลดขั้นตอนการทำงาน, เพิ่มประสิทธิภาพ ฯลฯ"
        />
      </div>

      <div>
        <label className="font-semibold">3. หลักการและเหตุผล:</label>
        <textarea
          name="rationale"
          value={formData.rationale}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          rows={4}
          placeholder="อธิบายถึงที่มาหรือความจำเป็น"
        />
      </div>

      <div>
        <label className="font-semibold">4. วิธีดำเนินการ:</label>
        <textarea
          name="process"
          value={formData.process}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          rows={4}
          placeholder="ขั้นตอนหรือวิธีการในการดำเนินงาน"
        />
      </div>

      <div>
        <label className="font-semibold">5. ผลที่คาดว่าจะได้รับ:</label>
        <textarea
          name="expectedResults"
          value={formData.expectedResults}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          rows={3}
          placeholder="ประโยชน์ที่คาดว่าจะได้รับจากแนวคิดนี้"
        />
      </div>

      <div>
        <label className="font-semibold">6. งบประมาณ:</label>
        <input
          type="text"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          placeholder="กรอกงบประมาณ (ถ้ามี)"
        />
      </div>

      <div>
        <label className="font-semibold">7. ความคิดเห็นของพี่เลี้ยง:</label>
        <textarea
          name="mentorComment"
          value={formData.mentorComment}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          rows={3}
          placeholder="ช่องให้พี่เลี้ยงให้ความเห็น"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        บันทึกแบบฟอร์ม
      </button>
    </form>
  );
};

export default IdeaForm;
