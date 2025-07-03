/**
 * 출결 기록 화면
 * - 학생 출결 기록 조회함
 * - 연도/학기/근로구분별 필터 적용
 * - 학생 이름으로 검색 가능 + 날짜 범위 조회
 * - 월별 캘린더 또는 표로 출력(캘린더 / 표 둘다?)
 */

import Layout from '@/components/Layout';
import styles from '@/styles/Attendance.module.css';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AttendancePage() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchWorkType, setSearchWorkType] = useState('');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 출결 데이터 조회
  const fetchAttendance = async () => {
    const queryParams = new URLSearchParams({
      name: searchName,
      year: searchYear,
      term: searchTerm,
      workType: searchWorkType,
    });

    if (startDate)
      queryParams.append('startDate', startDate.toISOString().split('T')[0]);
    if (endDate)
      queryParams.append('endDate', endDate.toISOString().split('T')[0]);

    const res = await fetch(`/api/attendace?${queryParams.toString()}`);
    const data = await res.json();
    setAttendanceList(data.attendance || []);
  };

  // 출결 데이터 가져올때 사용
  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <h2>근로학생 출결 기록</h2>

        {/* 필터 */}
        <div className={styles.filterSection}>
          <select
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
          >
            <option value=''>전체 연도</option>
            <option value='2024'>2024년</option>
            <option value='2025'>2025년</option>
            <option value='2026'>2026년</option>
          </select>

          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <option value=''>전체 학기</option>
            <option value='1학기'>1학기</option>
            <option value='2학기'>2학기</option>
          </select>

          <select
            value={searchWorkType}
            onChange={(e) => setSearchWorkType(e.target.value)}
          >
            <option value=''>전체 근로구분</option>
            <option value='국가근로'>국가근로장학생</option>
            <option value='대학행정인턴'>대학행정인턴장학생</option>
            <option value='교육지원'>교육지원장학생</option>
          </select>

          <input
            type='text'
            placeholder='학생 이름'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={styles.searchInput}
          />

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText='시작일'
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText='종료일'
            minDate={startDate}
          />
          <button className={styles.searchBtn}>조회</button>
        </div>

        {/* 출결 테이블 */}
        <div className={styles.tableSection}>
          <table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>근로구분</th>
                <th>이름</th>
                <th>학번</th>
                <th>시작시간</th>
                <th>종료시간</th>
                <th>근로시간</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {/* map()으로 출결 데이터 출력 */}
              <tr>
                <td colSpan='8'>출결 기록이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
