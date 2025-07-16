/**
 * '근로 시간표' 메뉴
 * 왼쪽: 캘린더(react-calendar)
 * 오른쪽: 리스트
 */

import Layout from '@/components/Layout';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import styles from '@/styles/Schedule.module.css';
import { useState, useEffect } from 'react';

export default function SchedulePage() {
  // 선택된 탭
  const [activeTab, setActiveTab] = useState('실습실');

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 탭 목록
  const tabs = ['실습실', '카운터', 'ECSC', '모니터링'];

  return (
    <Layout>
      <div className={styles.container}>
        {/* 페이지 제목 */}
        <h3 className={styles.pageTitle}>근로시간표 조회</h3>

        {/* 왼쪽 영역: 캘린더(react-calendar) */}
        <div className={styles.left}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className={styles.myCalendar}
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
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>성명</th>
                  <th>근로구분</th>
                  <th>담당업무</th>
                  <th>근로시간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>파이리</td>
                  <td>국가근로</td>
                  <td>카운터</td>
                  <td>09:00~12:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
