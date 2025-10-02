/**
 * 근로시간표 등록 모달
 */

import { useState, useRef, useEffect } from 'react';
import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/ScheduleFormModal.module.css';
import { FaUser } from 'react-icons/fa';
import StudentSelectModal from './StudentSelectModal';
import {
  getYearTerm,
  getLocalDateString,
  combineTime,
} from '@/utils/timeUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ScheduleFormModal({
  onClose,
  onSubmitSuccess,
  editItem,
  mode = 'insert',
  selectedDate,
  currentStdJob,
}) {
  const isModify = mode === 'modify';

  // '학생 선택'에서 선택된 학생 정보
  const [selectedStudent, setSelectedStudent] = useState(null);

  // '학생 선택' 모달 렌더링 제어
  const [showStudentModal, setShowStudentModal] = useState(false);

  // 날짜 & 시간 입력 상태값
  const [workDate, setWorkDate] = useState(null);

  // 일일 등록 & 일괄 등록 탭(Tab)
  const [activeTab, setActiveTab] = useState('daily'); // 기본값 '일일' 등록

  // 일괄 등록용 state
  const [bulkStartDate, setBulkStartDate] = useState(null); // 일괄등록 '시작일'
  const [bulkEndDate, setBulkEndDate] = useState(null); // 일괄등록 '종료일'

  // 데이터 구조가 담기는 state
  const [weeklySchedule, setWeeklySchedule] = useState({});

  // 시간 및 분 옵션
  const hourOptions = Array.from({ length: 10 }, (_, i) => i + 9); // 9~18시
  const minuteOptions = [0, 10, 20, 30, 40, 50]; // 10분 단위

  // 시간 입력 state
  const [startHour, setStartHour] = useState(''); // 시작 '시간'
  const [startMinute, setStartMinute] = useState(''); // 시작 '분'
  const [endHour, setEndHour] = useState(''); // 종료 '시간'
  const [endMinute, setEndMinute] = useState(''); // 종료 '분'

  // 선택된 날짜 기준 '학년도', '학기' Set
  const { year, term } = getYearTerm(selectedDate);

  // 학생 선택 모달 handler
  const handleStudentSelect = () => {
    setShowStudentModal(true);
  };

  // 체크박스 핸들러
  const handleWeekdayCheck = (dayIdx, isChecked) => {
    if (isChecked) {
      setWeeklySchedule((prev) => ({
        ...prev,
        [dayIdx]: {
          startHour: '',
          startMinute: '',
          endHour: '',
          endMinute: '',
        },
      }));
    } else {
      setWeeklySchedule((prev) => {
        const newSchedule = { ...prev };
        delete newSchedule[dayIdx];
        return newSchedule;
      });
    }
  };

  // 시간 변경 핸들러
  const handleTimeChange = (dayIdx, field, value) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [field]: value,
      },
    }));
  };

  // 등록(submit) 버튼 핸들러
  const handleSubmit = async () => {
    if (!selectedStudent) return alert('학생을 먼저 선택해주세요');

    // 시간 조합
    const startTime = combineTime(startHour, startMinute);
    const endTime = combineTime(endHour, endMinute);

    if (!startTime || !endTime)
      return alert('시작시간과 종료시간을 선택해주세요');

    if (startTime >= endTime)
      return alert('시작 시간은 종료 시간보다 빠르거나 같을 수 없습니다.');

    try {
      // 수정(PUT) 요청
      if (isModify && editItem) {
        const res = await fetch(`/api/schedule`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editItem.id,
            startTime,
            endTime,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          onSubmitSuccess(editItem.stdJob);
          onClose();
        } else {
          return alert(data.message);
        }
      }

      // 일괄 등록 처리(bulk)
      else if (activeTab === 'bulk') {
      }

      // 등록(POST) 요청
      else {
        if (!workDate) return alert('근로일자를 선택해주세요.');
        const res = await fetch('/api/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stdNum: selectedStudent.stdNum,
            year: year,
            term: term,
            workDate: getLocalDateString(workDate),
            startTime,
            endTime,
          }),
        });

        // 백엔드에서 넘어온 message 확인용
        const data = await res.json();

        if (res.ok) {
          alert(data.message);
          onSubmitSuccess(selectedStudent.stdJob);
          onClose();
        } else {
          return alert(data.message);
        }
      }
    } catch (err) {
      console.error('[ScheduleFormModal.js] handleSubmit() Error ', err);
    }
  };

  const datePickerRef = useRef();

  useEffect(() => {
    if (isModify && editItem) {
      if (editItem.startTime) {
        const [sHour, sMinute] = editItem.startTime.split(':');
        setStartHour(parseInt(sHour));
        setStartMinute(parseInt(sMinute));
      }
      if (editItem.endTime) {
        const [eHour, eMinute] = editItem.endTime.split(':');
        setEndHour(parseInt(eHour));
        setEndMinute(parseInt(eMinute));
      }
      setSelectedStudent({
        stdName: editItem.stdName,
        stdNum: editItem.stdNum,
      });
    }
  }, [isModify, editItem]);

  return (
    <ModalLayout onClose={onClose} maxWidth={400}>
      <h3 className={styles.title}>
        근로시간표 {mode === 'insert' ? '등록' : '수정'}
      </h3>

      {/** 학생 정보 섹션(Section) */}
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
          <button className={styles.selectStdBtn} onClick={handleStudentSelect}>
            학생 선택
          </button>
        )}
      </div>

      {/** '일일등록' or '일괄등록' 탭(Tab) Section */}
      {mode === 'insert' && (
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === 'daily' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('daily')}
          >
            일일등록
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === 'bulk' ? styles.active : ''
            }`}
            onClick={() => setActiveTab('bulk')}
          >
            일괄등록
          </button>
        </div>
      )}

      {/* 근로시간표 Form 영역 */}
      <div className={styles.formSection}>
        {/** 수정 모드(mode === 'modify')이거나 '일일 등록' 탭일 때(activeTab === 'daily') */}
        {(mode === 'modify' ||
          (mode === 'insert' && activeTab === 'daily')) && (
          <>
            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>학년도</span>
                <input type='text' value={year} readOnly />
              </div>
              <div>
                <span className={styles.fieldLabel}>학기</span>
                <input type='text' value={term} readOnly />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>학번</span>
                <input
                  type='text'
                  value={selectedStudent?.stdNum || ''}
                  readOnly
                />
              </div>
              <div>
                <span className={styles.fieldLabel}>성명</span>
                <input
                  type='text'
                  value={selectedStudent?.stdName || ''}
                  readOnly
                />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>근로일자</span>
                {isModify ? (
                  <div className={styles.readOnlyDate}>{editItem.workDate}</div>
                ) : (
                  <DatePicker
                    ref={datePickerRef}
                    selected={workDate}
                    onChange={(date) => {
                      setWorkDate(date);
                      // 달력 입력 폼 닫기(setTimeout() 사용)
                      setTimeout(() => {
                        datePickerRef.current?.setOpen(false);
                      }, 0);
                    }}
                    shouldCloseOnSelect={true}
                    dateFormat='yyyy-MM-dd'
                    placeholderText='근로일자 선택'
                    popperContainer={({ children }) => (
                      <div style={{ position: 'relative', zIndex: 1000 }}>
                        {children}
                      </div>
                    )}
                    popperPlacement='bottom-start'
                  />
                )}
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>시작 시간</span>
                <div className={styles.timeInputs}>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                  >
                    <option value=''>시</option>
                    {hourOptions.map((h, idx) => (
                      <option key={idx} value={h}>
                        {h}시
                      </option>
                    ))}
                  </select>
                  <select
                    value={startMinute}
                    onChange={(e) => setStartMinute(e.target.value)}
                  >
                    <option value=''>분</option>
                    {minuteOptions.map((m, idx) => (
                      <option key={idx} value={m}>
                        {m}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <span className={styles.fieldLabel}>종료 시간</span>
                <div className={styles.timeInputs}>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                  >
                    <option value=''>시</option>
                    {hourOptions.map((h, idx) => (
                      <option key={idx} value={h}>
                        {h}시
                      </option>
                    ))}
                  </select>
                  <select
                    value={endMinute}
                    onChange={(e) => setEndMinute(e.target.value)}
                  >
                    <option value=''>분</option>
                    {minuteOptions.map((m, idx) => (
                      <option key={idx} value={m}>
                        {m}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
        {/* 일괄등록(bulk) 탭 */}
        {mode === 'insert' && activeTab === 'bulk' && (
          <>
            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>학년도</span>
                <input type='text' value={year} readOnly />
              </div>
              <div>
                <span className={styles.fieldLabel}>학기</span>
                <input type='text' value={term} readOnly />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>학번</span>
                <input
                  type='text'
                  value={selectedStudent?.stdNum || ''}
                  readOnly
                />
              </div>
              <div>
                <span className={styles.fieldLabel}>성명</span>
                <input
                  type='text'
                  value={selectedStudent?.stdName || ''}
                  readOnly
                />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>시작일</span>
                <DatePicker
                  selected={bulkStartDate}
                  onChange={(date) => setBulkStartDate(date)}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='시작일 선택'
                  popperContainer={({ children }) => (
                    <div style={{ position: 'relative', zIndex: 1000 }}>
                      {children}
                    </div>
                  )}
                  popperPlacement='bottom-start'
                />
              </div>
              <div>
                <span className={styles.fieldLabel}>종료일</span>
                <DatePicker
                  selected={bulkEndDate}
                  onChange={(date) => setBulkEndDate(date)}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='종료일 선택'
                  popperContainer={({ children }) => (
                    <div style={{ position: 'relative', zIndex: 1000 }}>
                      {children}
                    </div>
                  )}
                  popperPlacement='bottom-start'
                />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <span className={styles.fieldLabel}>요일별 시간 설정</span>
                <div className={styles.weeklyScheduleContainer}>
                  {['월', '화', '수', '목', '금'].map((day, idx) => (
                    <div key={idx} className={styles.weekdayScheduleRow}>
                      <label className={styles.weekdayCheckbox}>
                        <input
                          type='checkbox'
                          checked={!!weeklySchedule[idx]}
                          onChange={(e) =>
                            handleWeekdayCheck(idx, e.target.checked)
                          }
                        />
                        {day}
                      </label>

                      {weeklySchedule[idx] && (
                        <div className={styles.weekdayTimeInputs}>
                          <div className={styles.timeInputs}>
                            <select
                              value={weeklySchedule[idx]?.startHour || ''}
                              onChange={(e) =>
                                handleTimeChange(
                                  idx,
                                  'startHour',
                                  e.target.value
                                )
                              }
                            >
                              <option value=''>시</option>
                              {hourOptions.map((h, idx) => (
                                <option key={idx} value={h}>
                                  {h}시
                                </option>
                              ))}
                            </select>
                            <select
                              value={weeklySchedule[idx]?.startMinute || ''}
                              onChange={(e) =>
                                handleTimeChange(
                                  idx,
                                  'startMinute',
                                  e.target.value
                                )
                              }
                            >
                              <option value=''>분</option>
                              {minuteOptions.map((m, idx) => (
                                <option key={idx} value={m}>
                                  {m}분
                                </option>
                              ))}
                            </select>
                          </div>
                          <span>~</span>
                          <div className={styles.timeInputs}>
                            <select
                              value={weeklySchedule[idx]?.endHour || ''}
                              onChange={(e) =>
                                handleTimeChange(idx, 'endHour', e.target.value)
                              }
                            >
                              <option value=''>시</option>
                              {hourOptions.map((h, idx) => (
                                <option key={idx} value={h}>
                                  {h}시
                                </option>
                              ))}
                            </select>
                            <select
                              value={weeklySchedule[idx]?.endMinute || ''}
                              onChange={(e) =>
                                handleTimeChange(
                                  idx,
                                  'endMinute',
                                  e.target.value
                                )
                              }
                            >
                              <option value=''>분</option>
                              {minuteOptions.map((m, idx) => (
                                <option key={idx} value={m}>
                                  {m}분
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.btnGroup}>
        <button onClick={onClose}>취소</button>
        <button className={styles.submit} onClick={handleSubmit}>
          {isModify ? '수정' : '등록'}
        </button>
      </div>

      {/* 모달 영역 */}
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
