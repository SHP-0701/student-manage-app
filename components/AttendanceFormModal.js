/**
 * 출결 기록 등록 & 수정 모달(AttendanceFormModal)
 * 학생 선택 모달로 학생 정보 세팅
 */

import ModalLayout from "@/components/ModalLayout";
import styles from "@/styles/AttendanceFormModal.module.css";
import { useState, useEffect } from "react";
import StudentSelectModal from "./StudentSelectModal";

export default function AttendanceFormModal({
  mode,
  initialData,
  onClose,
  refreshList,
  showToastMsg,
}) {
  const [form, setForm] = useState({
    workDate: "",
    stdNum: "",
    stdName: "",
    year: "",
    term: "",
    workType: "",
    stdJob: "",
    startTime: "",
    endTime: "",
    note: "",
  });

  // 학생 선택 모달 오픈
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);

  // 수정 모달인 경우 초기값 설정
  useEffect(() => {
    if (mode === "modify" && initialData) {
      setForm({
        workDate: initialData.workDate.split("T")[0] || "",
        stdNum: initialData.stdNum || "",
        stdName: initialData.stdName || "",
        year: initialData.year || "",
        term: initialData.term || "",
        workType: initialData.workType || "",
        stdJob: initialData.stdJob || "",
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

  // 학생 선택 모달에서 학생을 선택했을때 실행
  const handleStudentSelected = (std) => {
    setForm((prev) => ({
      ...prev,
      stdNum: std.stdNum,
      stdName: std.stdName,
      year: std.year,
      term: std.term,
      stdDept: std.stdDept,
      workType: std.workType,
      stdJob: std.stdJob,
    }));
    setIsStudentSelectOpen(false);
  };

  // 등록 & 수정 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = mode === "insert" ? "POST" : "PUT";

    try {
      const res = await fetch("/api/attendance", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: initialData?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToastMsg(data.message);
        refreshList(true);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("[AttendanceFormModal] 등록/수정 오류 ", err);
    }
  };

  return (
    <ModalLayout onClose={onClose} maxWidth={450}>
      <div className={styles.modalHeader}>
        <h3>{mode === "insert" ? "출결 내역 등록" : "출결 내역 수정"}</h3>
        {/* 출결 등록 모달일때만 '학생 선택' 버튼 렌더링 */}
        {mode === "insert" && (
          <button
            type="button"
            className={styles.selectStudentBtn}
            onClick={() => setIsStudentSelectOpen(true)}
          >
            학생 선택
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.rowGroup}>
          <label>
            학년도
            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            학기
            <input
              type="text"
              name="term"
              value={form.term}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className={styles.rowGroup}>
          <label>
            학번
            <input
              type="text"
              name="stdNum"
              value={form.stdNum}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            성명
            <input
              type="text"
              name="stdName"
              value={form.stdName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            근로구분
            <input
              type="text"
              name="workType"
              value={form.workType}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            담당업무
            <input
              type="text"
              name="stdJob"
              value={form.stdJob}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            근로일자
            <input
              type="date"
              name="workDate"
              value={form.workDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            시작시간
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
            />
          </label>
          <label>
            종료시간
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            비고
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          </label>
        </div>
        {/* 버튼 영역 */}
        <div className={styles.btnGroup}>
          <button type="button" onClick={onClose}>
            취소
          </button>
          <button type="submit">{mode === "insert" ? "등록" : "수정"}</button>
        </div>
      </form>

      {/* 학생 선택 모달 */}
      {isStudentSelectOpen && (
        <StudentSelectModal
          onSelect={handleStudentSelected}
          onClose={() => setIsStudentSelectOpen(false)}
        />
      )}
    </ModalLayout>
  );
}
