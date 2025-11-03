/**
 * '근로 시간표' 메뉴
 * 왼쪽: 캘린더(react-calendar)
 * 오른쪽: 리스트
 */

import Layout from '@/components/Layout';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { isHoliday, getHolidayNames } from '@hyunbinseo/holidays-kr'; // 공휴일 표시 package
import styles from '@/styles/Schedule.module.css';
import { useState, useEffect } from 'react';
import ScheduleFormModal from '@/components/ScheduleFormModal';
import { FaCalendarDay } from 'react-icons/fa';
import {
  formatSelectedDate,
  getYearTerm,
  getLocalDateString,
} from '@/utils/timeUtils';
import ScheduleChangeFormModal from '@/components/ScheduleChangeFormModal';

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
          selectedDate
        )}&year=${getYearTerm(selectedDate).year}&term=${
          getYearTerm(selectedDate).term
        }`
      );
      const result = await res.json();
      setScheduleData(result);
    } catch (err) {
      console.error('데이터 fetch 실패: ', err);
    }
  };

  // 근로변경사항 fetch
  const fetchChangeSchedule = async () => {
    try {
      const res = await fetch(
        `/api/changeschedule?changeDate=${getLocalDateString(
          selectedDate
        )}&tab=${activeTab}&year=${getYearTerm(selectedDate).year}&term=${
          getYearTerm(selectedDate).term
        }`
      );
      const result = await res.json();

      // 데이터가 존재하면 set, 없으면 빈 배열
      setChangeSchedule(result.data || []);
    } catch (err) {
      console.error('[/dashboard/schedule.js] 근로변경사항 fetch 실패: ', err);
    }
  };

  // 모달에서 submit 완료하면 부모 컴포넌트로 전달
  function handleSubmitSuccess(stdJob) {
    if (stdJob === activeTab) fetchSchedule();
  }

  // 근로시간표 삭제 버튼 handler
  const handleDelete = async (item) => {
    if (!item.id) return alert('삭제 대상 정보가 올바르지 않습니다');

    const ok = confirm(
      `[삭제 확인]\n날짜: ${getLocalDateString(selectedDate)}\n학생명: ${
        item.stdName
      }\n근로시간: ${item.startTime} ~ ${
        item.endTime
      }\n항목을 삭제하시겠습니까?`
    );

    if (!ok) return;

    try {
      const res = await fetch(`/api/schedule?id=${item.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        await fetchSchedule();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('[/dashboard/schedule.js] handleDelete 에러: ', err);
      alert('삭제 중 오류 발생');
    }
  };

  // 근로변경사항 삭제 버튼 handler
  const handleChangeDelete = async (item) => {
    const ok = confirm(
      `[삭제 확인]\n${item.changeDate} 일자\n${item.stdName} 학생 근로변경사항을 삭제하시겠습니까?`
    );

    if (!ok) return;

    try {
      const res = await fetch(`/api/changeschedule?id=${item.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        await fetchChangeSchedule();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('[/dashboard/schedule.js] handleChangeDelete() 에러', err);
      return alert('삭제 중 에러 발생');
    }
  };

  // 근로확인 handler
  const handleConfirm = async (rowId) => {
    try {
      const res = await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rowId, // 해당 근로시간표 데이터 id
          isConfirmed: true,
        }),
      });

      if (res.ok) {
        await fetchSchedule(); // 데이터 새로고침
      } else {
        const data = await res.json();
        alert(data.message || '확인 처리 중 오류 발생');
      }
    } catch (err) {
      console.error('확인 처리 실패: ', err);
      alert('확인 처리 중 오류 발생');
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchChangeSchedule();
  }, [activeTab, selectedDate]);

  return (
    <Layout>
      <div className={styles.container}>
        {/* 페이지 제목 */}
        <h3 className={styles.pageTitle}>근로시간표 조회</h3>

        {/* 왼쪽 영역: 캘린더(react-calendar) */}
        <div className={styles.left}>
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

                const currentYear = new Date().getFullYear();
                const tileYear = date.getFullYear();

                if (tileMonth != currentViewMonth) return;
                if (tileYear === currentYear && isHoliday(date))
                  return 'holiday';

                const day = date.getDay();
                if (day === 0) return 'sunday';
                if (day === 6) return 'saturday';
              }
            }}
            tileContent={({ date, view }) => {
              if (
                view === 'month' &&
                date.getFullYear() === new Date().getFullYear()
              ) {
                const currentYear = new Date().getFullYear();
                if (date.getFullYear() !== currentYear) return null;

                const holidayNames = getHolidayNames(date);
                if (!holidayNames || holidayNames.length === 0) return null;

                const [main, sub] = holidayNames[0].split('(');

                return (
                  <div className='holidayLabel'>
                    <div>{main}</div>
                    {sub && <div>({sub}</div>}
                  </div>
                );
              }
            }}
          />
        </div>

        {/* 오른쪽 영역: 탭 + 테이블 */}
        <div className={styles.right}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${
                  activeTab === tab ? styles.active : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}

            <button
              className={styles.btnScheduleReg}
              onClick={() => {
                setEditSchedule(null);
                setIsModalOpen(true);
              }}
            >
              시간표 등록
            </button>
          </div>

          {/* 선택된 날짜 보여주는 근로시간표 Label */}
          <div className={styles.selectedDate}>
            <FaCalendarDay className={styles.dateIcon} />
            <label>
              {formatSelectedDate(selectedDate)} {activeTab} 시간표입니다.
            </label>
          </div>

          {/* 근로시간표 테이블 */}
          <div className={styles.scheduleTableWrapper}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>학년도</th>
                  <th>학기</th>
                  <th>성명</th>
                  <th>근로구분</th>
                  <th>담당업무</th>
                  <th>근로시간</th>
                  <th>근로확인</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center' }}>
                      해당 날짜의 근로시간표가 없습니다.
                    </td>
                  </tr>
                ) : (
                  scheduleData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.year}</td>
                      <td>{item.term}</td>
                      <td>{item.stdName}</td>
                      <td>{item.workType}</td>
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
                          {item.isConfirmed ? '확인완료' : '확인'}
                        </button>
                      </td>
                      <td>
                        <button
                          className={styles.modBtn}
                          onClick={() => {
                            setEditSchedule(item);
                            setIsModalOpen(true);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className={styles.delBtn}
                          onClick={() => handleDelete(item)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 선택된 날짜 보여주는 근로변경사항 Label */}
          <div className={styles.selectedDate}>
            <FaCalendarDay className={styles.dateIcon} />
            <label>
              {formatSelectedDate(selectedDate)} {activeTab} 근로변경사항
              입니다.
            </label>
          </div>

          {/* 근로변경사항 등록 버튼 영역 */}
          <div className={styles.btnWrapper}>
            <button
              className={styles.changeRegisterBtn}
              onClick={() => {
                setIsChangeModalOpen(true);
                setEditChangeSchedule(null);
              }}
            >
              근로변경사항 등록
            </button>
          </div>

          {/* 근로변경사항 Table */}
          <div className={styles.changeTableWrapper}>
            <table className={styles.changeTable}>
              <thead>
                <tr>
                  <th>담당업무</th>
                  <th>성명</th>
                  <th>기존 근로</th>
                  <th>변경 근로</th>
                  <th>변경 사유</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {changeSchedule.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: 'center',
                        padding: '12px',
                        color: '#777',
                      }}
                    >
                      근로변경사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  changeSchedule.map((row) => (
                    <tr key={row.id}>
                      <td>{row.stdJob}</td>
                      <td>{row.stdName}</td>
                      <td>{row.beforeTime}</td>
                      <td>{row.afterTime}</td>
                      <td>{row.reason}</td>
                      <td>
                        <button
                          className={styles.modBtn}
                          onClick={() => {
                            setEditChangeSchedule(row);
                            setIsChangeModalOpen(true);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className={styles.delBtn}
                          onClick={() => handleChangeDelete(row)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
              onSubmitSuccess={fetchChangeSchedule}
              currentStdJob={activeTab}
            />
          )
        }
        {/******** 모달 영역(Modal) 종료 ********/}
      </div>
    </Layout>
  );
}
