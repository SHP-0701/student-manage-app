/* 근로변경사항 등록/수정 모달(ScheduleChangeFormModal) */

import { useEffect, useRef, useState } from 'react';
import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/ScheduleChangeFormModal.module.css';
import { FaUser } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StudentSelectModal from './StudentSelectModal';
import { getLocalDateString } from '@/utils/timeUtils';
import toast from 'react-hot-toast';

export default function ScheduleChangeFormModal({
  onClose,
  mode = 'insert',
  modifyItem,
  currentStdJob,
  selectedDate,
  onSubmitSuccess,
}) {
  // 등록 or 수정 분리
  const isModify = mode === 'modify'; // mode가 'modify'면 true

  // 선택된 학생 정보
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 학생 선택 모달 on/off
  const [showStudentModal, setShowStudentModal] = useState(false);

  // 선택된 날짜 정보
  const [changeDate, setChangeDate] = useState(selectedDate);
  const datePickerRef = useRef(null);

  // DB Column과 매칭
  const [beforeTime, setBeforeTime] = useState(''); // 변경이전
  const [afterTime, setAfterTime] = useState(''); // 변경후
  const [reason, setReason] = useState(''); // 변경사유

  // submit 버튼 handler
  const handleSubmit = async () => {
    if (!selectedStudent) return alert('학생을 선택해주세요.');
    if (!reason) return alert('변경사유를 입력하세요.');

    try {
      const requestData = RequestData();

      console.log('[ScheduleChangeFormModal.js] requestData is ', requestData);

      const res = await submitScheduleChange(requestData);
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        onSubmitSuccess(selectedStudent.stdJob);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('[ScheduleChangeFormModal.js] handleSubmit() 에러: ', err);
    }
  };

  // 백엔드 요청 reqData
  const RequestData = () => ({
    stdJob: selectedStudent.stdJob,
    stdNum: selectedStudent.stdNum,
    changeDate: isModify
      ? getLocalDateString(new Date(modifyItem.changeDate))
      : getLocalDateString(changeDate),
    beforeTime,
    afterTime,
    reason,
    ...(isModify && { id: modifyItem.id }),
  });

  // 백엔드 fetch 요청
  const submitScheduleChange = (data) => {
    return fetch(`/api/changeschedule`, {
      method: isModify ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    if (isModify) {
      // 학생 정보 세팅
      setSelectedStudent({
        stdName: modifyItem.stdName,
        stdJob: modifyItem.stdJob,
        stdNum: modifyItem.stdNum,
      });

      setChangeDate(new Date(modifyItem.changeDate)); // 변경일자
      setBeforeTime(modifyItem.beforeTime); // 기존근로
      setAfterTime(modifyItem.afterTime);
      setReason(modifyItem.reason); // 변경사유
    }
  }, [isModify, modifyItem]);

  return (
    <ModalLayout onClose={onClose} maxWidth={450}>
      {/* Modal Title */}
      <h3 className={styles.title}>
        근로변경사항 {isModify ? '수정' : '등록'}
      </h3>

      {/* 학생 선택 */}
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
        {!isModify && (
          <button
            type='button'
            onClick={() => setShowStudentModal(true)}
            className={styles.selectStdBtn}
            disabled={isModify}
          >
            학생 선택
          </button>
        )}
      </div>

      {/* 폼 영역 */}
      <div className={styles.formSection}>
        <div className={styles.row}>
          <label>
            변경일자
            <DatePicker
              ref={datePickerRef}
              selected={changeDate}
              onChange={(d) => {
                setChangeDate(d);
                setTimeout(() => datePickerRef.current?.setOpen(false), 0);
              }}
              dateFormat='yyyy-MM-dd'
              placeholderText='변경일자 선택'
              shouldCloseOnSelect
            />
          </label>
          <label>
            담당업무
            <input type='text' value={selectedStudent?.stdJob || ''} readOnly />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            이전 근무시간
            <input
              type='text'
              name='beforeTime'
              value={beforeTime}
              onChange={(e) => setBeforeTime(e.target.value)}
              placeholder='예시: 09:00~12:00'
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            변경 근무시간
            <input
              type='text'
              name='afterTime'
              value={afterTime}
              onChange={(e) => setAfterTime(e.target.value)}
              placeholder='예시: 8/22(금) 13:00~15:00 변경'
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            변경사유
            <input
              type='text'
              name='reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={255}
              placeholder='변경사유 입력(최대 255자)'
            />
          </label>
        </div>
        {/* 버튼 영역(등록/취소) */}
        <div className={styles.btnGroup}>
          <button type='button' onClick={onClose}>
            취소
          </button>
          <button className={styles.btnSubmit} onClick={handleSubmit}>
            {isModify ? '수정' : '등록'}
          </button>
        </div>
      </div>

      {/* 모달(Modal) 영역 */}
      {showStudentModal && (
        <StudentSelectModal
          onSelect={(student) => setSelectedStudent(student)}
          onClose={() => setShowStudentModal(false)}
          selectTab={currentStdJob}
        />
      )}
    </ModalLayout>
  );
}
