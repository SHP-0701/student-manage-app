/**
 * 출결 등록/수정 모달
 * props: mode, onClose
 * initialData: 수정 시 데이터
 */

import styles from "@/styles/AttendanceFormModal.module.css";
import { useState, useEffect } from "react";
import StudentSelectModal from "./StudentSelectModal";

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

  // '학생 선택' 모달 열고 닫기
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);

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

  // 학생 선택 버튼 클릭 handler
  const handleSelectStudent = () => {
    setIsStudentSelectOpen(true);
  };

  // 학생 선택 핸들러
  const handleStudentSelected = (std) => {
    // 학생 선택 시 form에 값 세팅하기
    setForm((prev) => ({
      ...prev,
      stdName: std.stdName,
      stdNum: std.stdNum,
      workType: std.workType,
    }));
    setIsStudentSelectOpen(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{mode === "insert" ? "출결 등록" : "출결 수정"}</h3>
          {mode === "insert" && (
            <button
              className={styles.selectStudentBtn}
              onClick={handleSelectStudent}
            >
              학생 선택
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.rowGroup}>
            <label>날짜</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            <label>근로구분</label>
            <select
              name="workType"
              onChange={handleChange}
              disabled={mode === "modify"}
              value={form.workType}
            >
              <option value="">근로구분 선택</option>
              <option value="국가근로">국가근로장학생</option>
              <option value="대학행정인턴">대학행정인턴장학생</option>
              <option value="교육지원">교육지원장학생</option>
            </select>
          </div>

          <div className={styles.rowGroup}>
            <label>이름</label>
            <input
              type="text"
              name="stdName"
              value={form.stdName}
              onChange={handleChange}
              readOnly={mode === "modify"}
            />

            <label>학번</label>
            <input
              type="text"
              name="stdNum"
              value={form.stdNum}
              onChange={handleChange}
              readOnly={mode === "modify"}
            />
          </div>

          <div className={styles.rowGroup}>
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
          </div>

          <div>
            <label>비고</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button>저장</button>
            <button onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
      {/* '학생 선택' 모달 */}
      {isStudentSelectOpen && (
        <StudentSelectModal
          onSelect={handleStudentSelected}
          onClose={() => setIsStudentSelectOpen(false)}
        />
      )}
    </div>
  );
}
