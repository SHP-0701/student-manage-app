/*
  ===================================================================================================
    ○ 작성일자: 2025. 11. 25.(화)
    ○ 수정일자: 2026. 01. 16.(금)
    ○ 페이지명: /pages/dashboard/schedule.js
    ○ 내용: 
      - 학생들의 근로시간표를 보여주는 페이지(근로변경사항 포함)
      - 좌측의 캘린더에서 날짜를 선택하면 해당날짜(일자/요일)에 근로하는 학생들의 목록을 우측에 보여줌
    ○ 작성자: 박수훈(shpark)
  ===================================================================================================
*/

import Layout from '@/components/Layout';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { isHoliday, getHolidayNames } from '@hyunbinseo/holidays-kr'; // 공휴일 표시 library
import styles from '@/styles/Schedule.module.css';
import { useState, useEffect } from 'react';
import ScheduleFormModal from '@/components/ScheduleFormModal';
import {
  formatSelectedDate,
  getYearTerm,
  getLocalDateString,
} from '@/utils/timeUtils';
import ScheduleChangeFormModal from '@/components/ScheduleChangeFormModal';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  FileSignature,
} from 'lucide-react';

export default function SchedulePage() {
  // 근로시간표 등록 모달 열기
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 근로변경사항 등록/수정 모달 열기
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  // 근로시간표 담는 state
  const [scheduleData, setScheduleData] = useState([]);

  // 근로변경사항 담는 state
  const [changeSchedule, setChangeSchedule] = useState([]);

  // 선택된 탭
  const [activeTab, setActiveTab] = useState('실습실');

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 근로시간표 수정을 위한 state
  const [editSchedule, setEditSchedule] = useState(null);

  // 근로변경사항 수정을 위한 state
  const [editChangeSchedule, setEditChangeSchedule] = useState(null);

  // 현재 월 기준(getMonth() 관련)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 탭 목록
  const tabs = ['실습실', '카운터', 'ECSC', '모니터링'];

  // 근로시간표 fetch
  const fetchSchedule = async () => {
    try {
      const res = await fetch(
        `/api/schedule?stdJob=${activeTab}&workDate=${getLocalDateString(
          selectedDate,
        )}&year=${getYearTerm(selectedDate).year}&term=${
          getYearTerm(selectedDate).term
        }`,
      );
      const result = await res.json();
      setScheduleData(result);
    } catch (err) {
      console.error('[/dashboard/schedule.js] fetchSchedule() 에러: ', err);
    }
  };

  // 근로변경사항 fetch
  const fetchChangeSchedule = async () => {
    try {
      const res = await fetch(
        `/api/schedule/changeschedule?changeDate=${getLocalDateString(
          selectedDate,
        )}&tab=${activeTab}&year=${getYearTerm(selectedDate).year}&term=${
          getYearTerm(selectedDate).term
        }`,
      );
      const result = await res.json();

      // 데이터가 존재하면 set, 없으면 빈 배열
      setChangeSchedule(result.data || []);
    } catch (err) {
      console.error('[/dashboard/schedule.js] 근로변경사항 fetch 실패: ', err);
    }
  };

  // 모달에서 submit 완료하면 부모 컴포넌트로 전달
  function handleSubmitSuccess(stdJob, mode, count = null) {
    let message = '';
    if (mode === 'modify') {
      message = '근로시간표가 수정되었습니다.';
    } else {
      if (count && count > 1) {
        // 건수가 넘어오고 1건 이상
        message = `총 ${count}건의 근로시간표가 등록되었습니다.`;
      } else {
        message = '근로시간표가 등록되었습니다.';
      }
    }

    // 성공 toast 알림 출력
    toast.success(message);

    if (stdJob === activeTab) {
      fetchSchedule();
    }
  }

  // 근로변경사항 등록/수정 완료 callback
  function handleSubmitChangeSuccess(stdJob, mode) {
    const action = mode === 'modify' ? '수정' : '등록';
    // 성공 toast 알림 출력
    toast.success(`근로변경사항이 ${action}되었습니다.`);

    if (stdJob === activeTab) {
      fetchChangeSchedule();
    }
  }

  // 근로시간표 삭제 버튼 handler
  const handleDelete = async (item) => {
    if (!item.id) return alert('삭제 대상 정보가 올바르지 않습니다');

    const ok = confirm(
      `[삭제 확인]\n날짜: ${getLocalDateString(selectedDate)}\n학생명: ${
        item.stdName
      }\n근로시간: ${item.startTime} ~ ${
        item.endTime
      }\n항목을 삭제하시겠습니까?`,
    );

    if (!ok) return;

    try {
      const res = await fetch(`/api/schedule?id=${item.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || '삭제되었습니다.');
        await fetchSchedule();
      } else {
        toast.error(data.message || '삭제 실패');
      }
    } catch (err) {
      console.error('[/dashboard/schedule.js] handleDelete 에러: ', err);
      toast.error('삭제 중 오류 발생');
    }
  };

  // 근로변경사항 삭제 버튼 handler
  const handleChangeDelete = async (item) => {
    const ok = confirm(
      `[삭제 확인]\n${item.changeDate} 일자\n${item.stdName} 학생 근로변경사항을 삭제하시겠습니까?`,
    );

    if (!ok) return;

    try {
      const res = await fetch(`/api/schedule/changeschedule?id=${item.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || '삭제되었습니다.');
        await fetchChangeSchedule();
      } else {
        toast.error(data.message || '삭제 실패');
      }
    } catch (err) {
      console.error('[/dashboard/schedule.js] handleChangeDelete() 에러', err);
      toast.error('삭제 중 에러 발생');
    }
  };

  // 근로확인 handler
  const handleConfirm = async (rowId) => {
    try {
      // POST 요청으로 출결기록(student_attendance) 생성(+ 근로시간표(student_schedule) isConfirmed도 업데이트)
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: rowId, // 근로시간표 row id
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || '근로확인 완료');
        await fetchSchedule(); // 데이터 새로고침
      } else {
        toast.error(data.message || '확인 처리 중 오류 발생');
      }
    } catch (err) {
      console.error('[/dashboard/schedule.js] handleConfirm() 에러: ', err);
      toast.error('확인 처리 중 오류 발생');
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchChangeSchedule();
  }, [activeTab, selectedDate]);

  return (
    <Layout>
      <div className={styles.container}>
        {/* 페이지 헤더 */}
        <h2 className={styles.pageTitle}>
          <CalendarDays className={styles.titleIcon} size={32} />
          근로시간표 관리
        </h2>

        {/** 좌/우 분할 레이아웃 Grid 적용 */}
        <div className={styles.contentGrid}>
          {/** 좌측(캘린더 영역) */}
          <div className={styles.leftSection}>
            <Calendar
              onActiveStartDateChange={({ activeStartDate }) =>
                setCurrentMonth(activeStartDate)
              }
              onChange={setSelectedDate}
              value={selectedDate}
              className={styles.myCalendar}
              calendarType='gregory'
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const tileMonth = date.getMonth();
                  const currentViewMonth = currentMonth.getMonth();

                  if (tileMonth != currentViewMonth) return;
                  if (isHoliday(date)) {
                    return 'holiday';
                  }

                  const day = date.getDay();
                  if (day === 0) return 'sunday';
                  if (day === 6) return 'saturday';
                }
              }}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const holidayNames = getHolidayNames(date);
                  if (!holidayNames || holidayNames.length === 0) return null;

                  const [main] = holidayNames[0].split('(');

                  return <div className={styles.holidayLabel}>{main}</div>;
                }
              }}
            />
          </div>

          {/** 우측 영역(탭 & 근로시간표 테이블) */}
          <div className={styles.rightSection}>
            {/** 01. 탭 버튼 그룹 */}
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tabBtn} ${
                    activeTab === tab ? styles.active : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              {/** 시간표 등록 버튼 */}
              <button
                className={styles.btnScheduleReg}
                onClick={() => {
                  setEditSchedule(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus size={18} />
                시간표 등록
              </button>
            </div>

            {/** 02. 근로시간표 테이블 섹션 */}
            <div className={styles.selectedDateLabel}>
              <Clock size={20} />
              <span>
                {formatSelectedDate(selectedDate)}
                {activeTab} 시간표
              </span>
            </div>

            {/** 근로시간표 테이블 래퍼 */}
            <div className={styles.scheduleWrapper}>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>학년도/학기</th>
                    <th style={{ width: '12%' }}>이름</th>
                    <th style={{ width: '14%' }}>근로구분</th>
                    <th style={{ width: '12%' }}>담당업무</th>
                    <th style={{ width: '22%' }}>근로시간</th>
                    <th style={{ width: '15%' }}>근로확인</th>
                    <th style={{ width: '15%' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: '3rem',
                          color: '#666',
                          textAlign: 'center',
                        }}
                      >
                        해당 날짜의 근로시간표가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    scheduleData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.year}-{item.term}
                        </td>
                        <td className={styles.nameCell}>{item.stdName}</td>
                        <td>
                          <span className={styles.badgeType}>
                            {item.workType}
                          </span>
                        </td>
                        <td>{item.stdJob}</td>
                        <td>
                          {item.startTime} ~ {item.endTime}
                        </td>
                        <td>
                          <button
                            className={`${styles.checkBtn} ${
                              item.isConfirmed
                                ? styles.confirmed
                                : styles.unconfirmed
                            }`}
                            onClick={() => handleConfirm(item.id)}
                            disabled={item.isConfirmed}
                          >
                            {item.isConfirmed ? (
                              <CheckCircle size={14} />
                            ) : null}
                            {item.isConfirmed ? '확인완료' : '확인'}
                          </button>
                        </td>
                        <td>
                          <div className={styles.actionBtnGroup}>
                            <button
                              className={`${styles.iconBtn} ${styles.modBtn}`}
                              onClick={() => {
                                setEditSchedule(item);
                                setIsModalOpen(true);
                              }}
                              title='수정'
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.delBtn}`}
                              onClick={() => handleDelete(item)}
                              title='삭제'
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/** 03. 근로변경사항 테이블 섹션 */}
            <div className={styles.changeSectionHeader}>
              <div
                className={styles.selectedDateLabel}
                style={{ marginBottom: 0 }}
              >
                <FileSignature size={20} />
                <span>근로변경사항</span>
              </div>
              <button
                className={styles.changeRegisterBtn}
                onClick={() => {
                  setIsChangeModalOpen(true);
                  setEditChangeSchedule(null);
                }}
              >
                <Plus size={14} />
                근로변경사항 등록
              </button>
            </div>

            {/** 근로변경사항 테이블 래퍼 */}
            <div className={styles.scheduleChangeWrapper}>
              <table className={styles.scheduleChangeTable}>
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>담당업무</th>
                    <th style={{ width: '8%' }}>이름</th>
                    <th style={{ width: '12%' }}>기존 근로</th>
                    <th style={{ width: '12%' }}>변경 근로</th>
                    <th>변경 사유</th>
                    <th style={{ width: '10%' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {changeSchedule.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '2rem',
                          color: '#666',
                        }}
                      >
                        등록된 근로변경사항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    changeSchedule.map((row) => (
                      <tr key={row.id}>
                        <td>{row.stdJob}</td>
                        <td className={styles.nameCell}>{row.stdName}</td>
                        <td style={{ color: '#888' }}>{row.beforeTime}</td>
                        <td style={{ color: '#4fc3f7', fontWeight: 'bold' }}>
                          {row.afterTime}
                        </td>
                        <td
                          style={{ textAlign: 'left', paddingLeft: '1.5rem' }}
                        >
                          {row.reason}
                        </td>
                        <td>
                          <div className={styles.actionBtnGroup}>
                            <button
                              className={`${styles.iconBtn} ${styles.modBtn}`}
                              onClick={() => {
                                setEditChangeSchedule(row);
                                setIsChangeModalOpen(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.delBtn}`}
                              onClick={() => handleChangeDelete(row)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/******** 모달 영역(Modal) ********/}
        {
          // 근로시간표 등록&수정 모달
          isModalOpen && (
            <ScheduleFormModal
              onClose={() => {
                setIsModalOpen(false);
                setEditSchedule(null);
              }}
              onSubmitSuccess={handleSubmitSuccess}
              editItem={editSchedule}
              mode={editSchedule ? 'modify' : 'insert'}
              selectedDate={selectedDate}
              currentStdJob={activeTab}
            />
          )
        }
        {
          // 근로변경사항 등록&수정 모달
          isChangeModalOpen && (
            <ScheduleChangeFormModal
              onClose={() => {
                setIsChangeModalOpen(false);
                setEditChangeSchedule(null);
              }}
              mode={editChangeSchedule ? 'modify' : 'insert'}
              modifyItem={editChangeSchedule}
              onSubmitSuccess={handleSubmitChangeSuccess}
              selectedDate={selectedDate}
              currentStdJob={activeTab}
            />
          )
        }
        {/******** 모달 영역(Modal) 종료 ********/}
      </div>
    </Layout>
  );
}
