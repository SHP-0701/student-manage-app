/**
 * 학생 정보 등록/수정 modal
 */

import styles from "@/styles/StudentFormModal.module.css";
import { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";

export default function StudentFormModal({
  mode,
  initialData = null,
  onClose,
  refreshList,
  showToastMessage,
}) {
  // 폼 상태 관리
  const [form, setForm] = useState({
    year: "",
    term: "",
    stdName: "" /* 이름 */,
    stdNum: "" /* 학번 */,
    stdDept: "" /* 학과 */,
    workType: "" /* 근로구분(국가장학, 대학행정인턴, 교육지원 */,
    stdJob: "" /* 담당업무(카운터, 실습실, ECSC, 모니터링) */,
  });

  // 입력(input) 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 제출(submit) 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/student", {
        method: mode === "insert" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: initialData?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        showToastMessage(data.message);
        onClose();
        refreshList();
      }
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  useEffect(() => {
    if (mode === "modify" && initialData) {
      setForm({
        year: initialData.year || "",
        term: initialData.term || "",
        stdName: initialData.stdName || "",
        stdNum: initialData.stdNum || "",
        stdDept: initialData.stdDept || "",
        workType: initialData.workType || "",
        stdJob: initialData.stdJob || "",
      });
    }
  }, [mode, initialData]);

  return (
    <ModalLayout onClose={onClose} maxWidth={400}>
      <h2>{mode === "insert" ? "학생 등록" : "학생 정보 수정"}</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.rowGroup}>
          <label>
            학년도
            <select name="year" value={form.year} onChange={handleChange}>
              <option value="">선택</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </label>
          <label>
            학기
            <select name="term" value={form.term} onChange={handleChange}>
              <option value="">선택</option>
              <option value="1학기">1학기</option>
              <option value="2학기">2학기</option>
            </select>
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
              placeholder="학번 입력"
            />
          </label>

          <label>
            이름
            <input
              type="text"
              name="stdName"
              value={form.stdName}
              onChange={handleChange}
              placeholder="이름 입력"
            />
          </label>
        </div>

        <label>
          학과
          <input
            type="text"
            name="stdDept"
            value={form.stdDept}
            onChange={handleChange}
            placeholder="학과 입력"
          />
        </label>

        <div className={styles.rowGroup}>
          <label>
            근로구분
            <select
              name="workType"
              value={form.workType}
              onChange={handleChange}
            >
              <option value="">선택</option>
              <option value="국가근로">국가근로장학생</option>
              <option value="대학행정인턴">대학행정인턴장학생</option>
              <option value="교육지원">교육지원장학생</option>
            </select>
          </label>

          <label>
            담당업무
            <select name="stdJob" value={form.stdJob} onChange={handleChange}>
              <option value="">선택</option>
              <option value="카운터">카운터</option>
              <option value="실습실">실습실</option>
              <option value="ECSC">ECSC</option>
              <option value="모니터링">모니터링</option>
            </select>
          </label>
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            취소
          </button>
          <button type="submit" className={styles.save}>
            {mode === "insert" ? "등록" : "수정"}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
