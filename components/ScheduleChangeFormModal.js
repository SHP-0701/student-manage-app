/* 근로변경사항 등록/수정 모달(ScheduleChangeFormModal) */

import { useRef, useState } from 'react';
import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/ScheduleChangeFormModal.module.css';
import { FaUser } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StudentSelectModal from './StudentSelectModal';

export default function ScheduleChangeFormModal({ onClose, mode = 'insert' }) {
  // 등록 or 수정 분리
  const isModify = mode === 'modify';

  // 선택된 학생 정보
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 학생 선택 모달 on/off
  const [showStudentModal, setShowStudentModal] = useState(false);

  // 선택된 날짜 정보
  const [changeDate, setChangeDate] = useState(new Date());
  const datePickerRef = useRef(null);

  // DB Column과 매칭
  const [beforeTime, setBeforeTime] = useState(''); // 변경이전
  const [afterTime, setAfterTime] = useState(''); // 변경후
  const [reason, setReason] = useState(''); // 변경사유

  return (
    <ModalLayout onClose={onClose} maxWidth={400}>
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
          <button type='submit' className={styles.btnSubmit}>
            {isModify ? '수정' : '등록'}
          </button>
        </div>
      </div>

      {/* 모달(Modal) 영역 */}
      {showStudentModal && (
        <StudentSelectModal
          onSelect={(student) => setSelectedStudent(student)}
          onClose={() => setShowStudentModal(false)}
        />
      )}
    </ModalLayout>
  );
}
