/**
 * 학생 정보 등록/수정 modal
 */

import styles from '@/styles/StudentFormModal.module.css';
import { useState } from 'react';

export default function StudentFormModal({ mode = 'insert', onClose }) {
  // 폼 상태 관리
  const [form, setForm] = useState({
    year: '',
    term: '',
    stdName: '', /* 이름 */
    stdNum: '', /* 학번 */
    workType: '', /* 근로구분(국가장학, 대학행정인턴, 교육지원 */
  });

  // 입력(input) 핸들러
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  }

  // 제출(submit) 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('[/components/StudentFormModal.js] 폼 데이터 확인 : ', form);

    try {
      const res = await fetch('/api/student', {
        method: mode === 'insert' ? 'POST' : 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if(!res.ok) {
        alert(data.message);
      } else {
        alert(data.message);
        onClose();
      }
    } catch(err) {
      console.error(err);
      alert('등록 실패');
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'insert' ? '학생 등록' : '학생 정보 수정'}</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            학년도
            <select name='year' value={form.year} onChange={handleChange}>
              <option value=''>선택</option>
              <option value='2024'>2024</option>
              <option value='2025'>2025</option>
              <option value='2026'>2026</option>
            </select>
          </label>

          <label>
            학기
            <select name='term' value={form.term} onChange={handleChange}>
              <option value=''>선택</option>
              <option value='1학기'>1학기</option>
              <option value='2학기'>2학기</option>
            </select>
          </label>

          <label>
            학번
            <input type='text' name='stdNum' value={form.stdNum} onChange={handleChange} placeholder='학번 입력' />
          </label>

          <label>
            이름
            <input type='text' name='stdName' value={form.stdName} onChange={handleChange} placeholder='이름 입력' />
          </label>

          <label>
            근로구분
            <select name='workType' value={form.workType} onChange={handleChange}>
              <option value=''>선택</option>
              <option value='국가근로'>국가근로장학생</option>
              <option value='대학행정인턴'>대학행정인턴장학생</option>
              <option value='교육지원'>교육지원장학생</option>
            </select>
          </label>

          <div className={styles.buttons}>
            <button type='button' className={styles.cancel} onClick={onClose}>
              취소
            </button>
            <button type='submit' className={styles.save}>
              {mode === 'insert' ? '등록' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
