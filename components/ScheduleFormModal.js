/**
 * 근로시간표 등록 모달
 * 모달 공통 레이아웃(ModalLayout.js) 사용
 */

import { useState } from 'react';
import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/ScheduleFormModal.module.css';
import { FaCheck, FaUser } from 'react-icons/fa';
import StudentSelectModal from './StudentSelectModal';

const days = ['월', '화', '수', '목', '금'];
const timeSlots = [
  '09:00~10:00',
  '10:00~11:00',
  '11:00~12:00',
  '13:00~14:00',
  '14:00~15:00',
  '15:00~16:00',
  '16:00~17:00',
  '17:00~18:00',
];

export default function ScheduleFormModal({ onClose }) {
  const [selected, setSelected] = useState({});

  // '학생 선택'에서 선택된 학생 정보
  const [selectedStudent, setSelectedStudent] = useState(null);

  // '학생 선택' 모달 렌더링 제어
  const [showStudentModal, setShowStudentModal] = useState(false);

  // 학생 선택 모달 handler
  const handleStudentSelect = () => {
    setShowStudentModal(true);
  };

  // grid에 cell 클릭 시 실행됨
  const toggleCell = (day, time) => {
    const key = `${day}-${time}`;
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 등록(submit) 버튼 핸들러
  const handleSubmit = async () => {
    if (!selectedStudent) return alert('학생을 먼저 선택해주세요');

    // selected 안에 저장돼있는 grid 선택 값들을 다 쪼개서 result라는 새로운 배열로 return
    const result = Object.entries(selected)
      .filter(([_, checked]) => checked)
      .map(([key]) => {
        const [day, time] = key.split('-');
        const [startTime, endTime] = time.split('~');
        return { days: day, startTime, endTime };
      });

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stdNum: selectedStudent.stdNum,
          schedule: result,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('근로시간표가 등록되었습니다.');
        onClose();
      } else {
        alert(`등록 실패: ${data.message}`);
      }
    } catch (err) {
      console.error('[ScheduleFormModal] handleSubmit() 등록 오류: ', err);
      alert('등록 중 오류 발생');
    }
  };

  return (
    <ModalLayout onClose={onClose} maxWidth={700}>
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

      <div className={styles.gridWrapper}>
        <table className={styles.grid}>
          <thead>
            <tr>
              <th>시간/요일</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td>{time}</td>
                {days.map((day) => {
                  const key = `${day}-${time}`;
                  return (
                    <td key={key} onClick={() => toggleCell(day, time)}>
                      <div
                        className={`${styles.cell} ${
                          selected[key] ? styles.selected : ''
                        }`}
                      >
                        {selected[key] && <FaCheck className={styles.check} />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
