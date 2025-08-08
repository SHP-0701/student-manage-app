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

export default function SchedulePage() {
  // 근로시간표 등록 모달 열기
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 근로시간표 담는 state
  const [scheduleData, setScheduleData] = useState([]);

  // 선택된 탭
  const [activeTab, setActiveTab] = useState('실습실');

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 현재 월 기준(getMonth() 관련)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 탭 목록
  const tabs = ['실습실', '카운터', 'ECSC', '모니터링'];

  // 날짜 기준 연도/학기 return 하는 util
  const currentYearTerm = getYearTerm(new Date());

  // 근로시간표 fetch
  const fetchSchedule = async () => {
    try {
      const res = await fetch(
        `/api/schedule?year=${currentYearTerm.year}&term=${
          currentYearTerm.term
        }&stdJob=${activeTab}&workDate=${getLocalDateString(selectedDate)}`
      );
      const result = await res.json();
      console.log('[/dashboard/schedule.js] API fetch result: ', result);
      setScheduleData(result);
    } catch (err) {
      console.error('데이터 fetch 실패: ', err);
    }
  };

  // 모달에서 submit 완료하면 부모 컴포넌트로 전달
  function handleSubmitSuccess(stdJob) {
    if (stdJob === activeTab) fetchSchedule();
  }

  useEffect(() => {
    fetchSchedule();
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
              onClick={() => setIsModalOpen(true)}
            >
              시간표 등록
            </button>
          </div>

          {/* 선택된 날짜 보여주는 Label */}
          <div className={styles.selectedDate}>
            <FaCalendarDay className={styles.dateIcon} />
            <label>
              {formatSelectedDate(selectedDate)} {activeTab} 시간표입니다.
            </label>
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>학년도</th>
                  <th>학기</th>
                  <th>성명</th>
                  <th>근로구분</th>
                  <th>담당업무</th>
                  <th>근로시간</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      해당 날짜의 근로시간표가 없습니다.
                    </td>
                  </tr>
                ) : (
                  scheduleData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{currentYearTerm.year}</td>
                      <td>{currentYearTerm.term}</td>
                      <td>{item.stdName}</td>
                      <td>{item.workType}</td>
                      <td>{item.stdJob}</td>
                      <td>
                        {item.startTime} ~ {item.endTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 모달 영역 */}
        {isModalOpen && (
          <ScheduleFormModal
            onClose={() => setIsModalOpen(false)}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
      </div>
    </Layout>
  );
}
