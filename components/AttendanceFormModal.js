/**
 * 출결 등록/수정 모달
 * props: mode, onClose
 * initialData: 수정 시 데이터
 */

import styles from "@/styles/AttendanceFormModal.module.css";
import { useState, useEffect } from "react";

export default function AttendanceFormModal({
  mode,
  initialData,
  onClose,
  refreshList,
}) {
  // 상태값
  const [form, setForm] = useState({
    date: "",
    workType: "",
    stdName: "",
    stdNum: "",
    startTime: "",
    endTime: "",
    note: "", // 비고
  });

  // 수정 모달인 경우 초기값 설정
  useEffect(() => {
    if (mode === "modify" && initialData) {
      setForm({
        date: initialData.date || "",
        workType: initialData.workType || "",
        stdName: initialData.stdName || "",
        stdNum: initialData.stdNum || "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        note: initialData.note || "",
      });
    }
  }, [mode, initialData]);

  // input 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 등록/수정 요청(submit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // mode에 따라 등록/수정 분기
    const method = mode === "insert" ? "POST" : "PUT";

    try {
      const res = await fetch("/api/attendance", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        refreshList(true);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(
        "[/components/AttendanceFormModal.js] 출결 등록 에러 : ",
        err
      );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{mode === "insert" ? "출결 등록" : "출결 수정"}</h3>
        <form onSubmit={handleSubmit}>
          <label>날짜</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>근로구분</label>
          <select name="workType" onChange={handleChange}>
            <option value="">근로구분 선택</option>
            <option value="국가근로">국가근로장학생</option>
            <option value="대학행정인턴">대학행정인턴장학생</option>
            <option value="교육지원">교육지원장학생</option>
          </select>

          <label>이름</label>
          <input
            type="text"
            name="stdName"
            value={form.stdName}
            onChange={handleChange}
          />

          <label>학번</label>
          <input
            type="text"
            name="stdNum"
            value={form.stdNum}
            onChange={handleChange}
          />

          <label>시작시간</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />

          <label>종료시간</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />

          <label>비고</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
          />

          <div className={styles.buttonGroup}>
            <button>저장</button>
            <button onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}
