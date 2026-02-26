/*
 * 학생 정보 등록 & 수정 모달(StudentFormModal)
 */

import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/StudentFormModal.module.css';
import { useState, useEffect } from 'react';

export default function StudentFormModal({
  mode,
  initialData = null,
  onClose,
  refreshList,
}) {
  // Form state 초기화
  const [form, setForm] = useState({
    id: '', // row id(PK)
    year: '', // 학년도
    term: '', // 학기
    stdName: '', // 학생명
    stdNum: '', // 학번
    stdDept: '', // 학과
    workType: '', // 근로구분(국가장학, 대학행정인턴, 교육지원)
    stdJob: '', // 담당업무(카운터, 실습실, ECSC, 모니터링)
  });

  // 수정 모달에서 초기 데이터 세팅
  useEffect(() => {
    if (mode === 'modify' && initialData) {
      setForm({
        year: initialData.year || '',
        term: initialData.term || '',
        stdName: initialData.stdName || '',
        stdNum: initialData.stdNum || '',
        stdDept: initialData.stdDept || '',
        workType: initialData.workType || '',
        stdJob: initialData.stdJob || '',
      });
    }
  }, [mode, initialData]);

  // 입력(input) 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 등록 & 수정 핸들러(submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = mode === 'insert' ? 'POST' : 'PUT';

    try {
      const res = await fetch('/api/student', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: initialData?.id }),
      });

      const data = await res.json();

      if (res.ok) {
        onClose();
        refreshList();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('[StudentFormModal] 등록/수정 실패: ', err);
      alert(data.message);
    }
  };

  return (
    <ModalLayout maxWidth={450} onClose={onClose}>
      <h3>{mode === 'insert' ? '학생 등록' : '학생 정보 수정'}</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.rowGroup}>
          <label>
            학년도
            <select
              name='year'
              value={form.year}
              onChange={handleChange}
              required
            >
              <option value=''>연도 선택</option>
              <option value='2025'>2025</option>
              <option value='2026'>2026</option>
              <option value='2027'>2027</option>
              <option value='2028'>2028</option>
            </select>
          </label>
          <label>
            학기
            <select
              name='term'
              value={form.term}
              onChange={handleChange}
              required
            >
              <option value=''>학기 선택</option>
              <option value='1학기'>1학기</option>
              <option value='2학기'>2학기</option>
            </select>
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            학번
            <input
              type='text'
              name='stdNum'
              value={form.stdNum}
              onChange={handleChange}
              placeholder='학번 입력'
              required
            />
          </label>
          <label>
            이름
            <input
              type='text'
              name='stdName'
              value={form.stdName}
              onChange={handleChange}
              placeholder='이름 입력'
              required
            />
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            학과
            <input
              type='text'
              name='stdDept'
              value={form.stdDept}
              onChange={handleChange}
              placeholder='학과 입력'
              required
            />
          </label>
        </div>
        <div className={styles.rowGroup}>
          <label>
            근로구분
            <select
              name='workType'
              value={form.workType}
              onChange={handleChange}
              required
            >
              <option value=''>근로구분 선택</option>
              <option value='국가근로'>국가근로장학생</option>
              <option value='대학행정인턴'>대학행정인턴장학생</option>
              <option value='교육지원'>교육지원장학생</option>
            </select>
          </label>
          <label>
            담당업무
            <select
              name='stdJob'
              value={form.stdJob}
              onChange={handleChange}
              required
            >
              <option value=''>담당업무 선택</option>
              <option value='카운터'>카운터</option>
              <option value='실습실'>실습실</option>
              <option value='ECSC'>ECSC</option>
              <option value='모니터링'>모니터링</option>
            </select>
          </label>
        </div>

        <div className={styles.buttons}>
          <button type='button' className={styles.cancel} onClick={onClose}>
            취소
          </button>
          <button type='submit' className={styles.save}>
            {mode === 'insert' ? '등록' : '수정'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
