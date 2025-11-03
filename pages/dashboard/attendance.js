/**
 * 출결 기록 화면
 * - 학생 출결 기록 조회함
 * - 연도/학기/근로구분별 필터 적용
 */

import Layout from '@/components/Layout';
import DatePicker from 'react-datepicker';
import styles from '@/styles/Attendance.module.css';
import { useState, useEffect } from 'react';

export default function AttendancePage() {
  // 출결데이터 상태(state)
  const [attendanceList, setAttendanceList] = useState([]);

  // 필터 상태(state)
  const [searchYear, setSearchYear] = useState(''); // 학년도
  const [searchTerm, setSearchTerm] = useState(''); // 학기
  const [searchStdJob, setSearchStdJob] = useState(''); // 담당업무(실습실, 카운터, ECSC, 모니터링)
  const [searchName, setSearchName] = useState(''); // 이름
  const [startDate, setStartDate] = useState(null); // 필터 시작 날짜
  const [endDate, setEndDate] = useState(null); // 필터 종료 날짜

  // 페이지네이션 상태(state)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Toast 메시지 상태(state)
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 삭제 모달 관련 상태(state)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>출결 기록</h2>

        {/** 필터(검색조건) 영역 */}
        <div className={styles.filterCard}>
          <h3 className={styles.filterTitle}>검색조건</h3>
          {/** Filter UI */}
          <div className={styles.filterRow}>
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
              value={searchStdJob}
              onChange={(e) => setSearchStdJob(e.target.value)}
            >
              <option value=''>전체 담당업무</option>
              <option value='실습실'>실습실</option>
              <option value='카운터'>카운터</option>
              <option value='ECSC'>ECSC</option>
              <option value='모니터링'>모니터링</option>
            </select>

            <input
              type='text'
              placeholder='학생 이름'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <div className={styles.datePickerWrapper}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText='시작일'
                dateFormat='yyyy-MM-dd'
              />
            </div>
            <div className={styles.datePickerWrapper}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText='종료일'
                dateFormat='yyyy-MM-dd'
                minDate={startDate}
              />
            </div>
            <div className={styles.filterActions}>
              <button className={styles.searchBtn}>조회</button>
              <button className={styles.exportBtn}>내보내기</button>
            </div>
          </div>
        </div>

        {/** 근로내역 테이블 영역 */}
        <div className={styles.tableSection}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>근로날짜</th>
                <th>담당업무</th>
                <th>이름</th>
                <th>학번</th>
                <th>시작시간</th>
                <th>종료시간</th>
                <th>총근로시간</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList && attendanceList.length > 0 ? (
                attendanceList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.workDate}</td>
                    <td>{item.stdJob}</td>
                    <td>{item.stdName}</td>
                    <td>{item.stdNum}</td>
                    <td>{item.startTime?.slice(0, 5)}</td>
                    <td>{item.endTime?.slice(0, 5)}</td>
                    <td>{item.totalWorkTime}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(item)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.emptyMessage}>
                    출결 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/** 페이지네이션(pagination) */}
        <div className={styles.pagination}>{/** Pagination */}</div>
      </div>
    </Layout>
  );
}
