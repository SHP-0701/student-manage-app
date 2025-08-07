/**
 * 근로시간표 등록 모달
 * 모달 공통 레이아웃(ModalLayout.js) 사용
 */

import { useState } from 'react';
import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/ScheduleFormModal.module.css';
import { FaUser } from 'react-icons/fa';
import StudentSelectModal from './StudentSelectModal';
import { getYearTerm, getLocalDateString } from '@/utils/timeUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ScheduleFormModal({ onClose }) {
  // '학생 선택'에서 선택된 학생 정보
  const [selectedStudent, setSelectedStudent] = useState(null);

  // '학생 선택' 모달 렌더링 제어
  const [showStudentModal, setShowStudentModal] = useState(false);

  // 날짜 & 시간 입력 상태값
  const [workDate, setWorkDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // 현재 날짜 기준 '학년도', '학기' 가져옴
  const { year, term } = getYearTerm(new Date());

  // 학생 선택 모달 handler
  const handleStudentSelect = () => {
    setShowStudentModal(true);
  };

  // 등록(submit) 버튼 핸들러
  const handleSubmit = async () => {
    if (!selectedStudent) return alert('학생을 먼저 선택해주세요');
    if (startTime >= endTime)
      return alert('시작 시간은 종료 시간보다 빠르거나 같을 수 없습니다.');

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stdNum: selectedStudent.stdNum,
          year,
          term,
          workDate: getLocalDateString(workDate),
          startTime,
          endTime,
        }),
      });

      // 백엔드에서 넘어온 message 확인용
      const data = await res.json();

      if (res.ok) {
        alert('근로시간표 등록 완료');
        onClose();
      } else {
        return alert(data.message);
      }
    } catch (err) {
      console.error('[ScheduleFormModal.js] handleSubmit() Error ', err);
    }
  };

  return (
    <ModalLayout onClose={onClose} maxWidth={400}>
      <h3 className={styles.title}>근로시간표 등록</h3>

      <div className={styles.stdInfoSection}>
        <div className={styles.stdInfo}>
          {selectedStudent ? (
            <span>
              <FaUser className={styles.icons} />
              <strong>{selectedStudent.stdName}</strong> (
              {selectedStudent.stdNum})
            </span>
          ) : (
            <span className={styles.placeHolder}>
              <FaUser className={styles.icons} /> 학생을 선택해주세요
            </span>
          )}
        </div>
        <button className={styles.selectStdBtn} onClick={handleStudentSelect}>
          학생 선택
        </button>
      </div>

      {/* 근로시간표 내용 입력 영역 */}
      <div className={styles.formSection}>
        <div className={styles.row}>
          <label>
            학년도
            <input type='text' value={year} readOnly />
          </label>
          <label>
            학기
            <input type='text' value={term} readOnly />
          </label>
        </div>

        <div className={styles.row}>
          <label>
            학번
            <input type='text' value={selectedStudent?.stdNum || ''} readOnly />
          </label>
          <label>
            성명
            <input
              type='text'
              value={selectedStudent?.stdName || ''}
              readOnly
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            근로일자
            <DatePicker
              selected={workDate}
              onChange={(date) => {
                console.log(
                  '[/components/ScheduleFormModal.js] Datepicker 선택된 날짜: ',
                  date,
                  ' 타입: ',
                  typeof date
                );
                setWorkDate(date);
              }}
              dateFormat='yyyy-MM-dd'
              placeholderText='근로일자 선택'
              className={styles.datePickerInput}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            시작 시간
            <input
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label>
            종료 시간
            <input
              type='time'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>
      </div>

      <div className={styles.btnGroup}>
        <button onClick={onClose}>취소</button>
        <button className={styles.submit} onClick={handleSubmit}>
          등록
        </button>
      </div>

      {/* 모달 영역 */}
      {showStudentModal && (
        <StudentSelectModal
          onSelect={(student) => setSelectedStudent(student)}
          onClose={() => setShowStudentModal(false)}
        />
      )}
    </ModalLayout>
  );
}
