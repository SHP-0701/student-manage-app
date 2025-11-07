/*
=======================================================================================================================
가. (작성일자) 2025. 11. 7.(금)
나. (페이지명) attendance.js(출결기록 메뉴)
다. (페이지기능) 출결 기록 프론트 코드(백엔드 - /api/attendance.js 와 연동하여 기록 데이터 fetch 실시)
※ 출결 기록 삭제는 /api/attendance.js 가 아닌 /api/schedule/index.js에서 동작(근로시간표 내역 삭제 시 출결기록도 같이 삭제됨)
=======================================================================================================================
*/

import Layout from '@/components/Layout';
import DatePicker from 'react-datepicker';
import styles from '@/styles/Attendance.module.css';
import { useEffect, useState } from 'react';
import { getLocalDateString } from '@/utils/timeUtils';

export default function AttendancePage() {
  // 출결데이터 상태(state)
  const [attendanceList, setAttendanceList] = useState([]);

  // 필터 상태(state)
  const [searchYear, setSearchYear] = useState(''); // 학년도
  const [searchTerm, setSearchTerm] = useState(''); // 학기
  const [searchWorkType, setSearchWorkType] = useState(''); // 근로구분(국가근로, 대학행정인턴, 교육지원)
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

  // 출결 기록 fetch
  const fetchAttendance = async () => {
    try {
      // 쿼리 param 생성
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10, // 페이지당 10개
      });

      // 필터 조건 추가(값이 있을때만 추가)
      if (searchYear) params.append('year', searchYear);
      if (searchTerm) params.append('term', searchTerm);
      if (searchWorkType) params.append('workType', searchWorkType);
      if (searchStdJob) params.append('stdJob', searchStdJob);
      if (searchName) params.append('stdName', searchName);
      if (startDate) params.append('startDate', getLocalDateString(startDate));
      if (endDate) params.append('endDate', getLocalDateString(endDate));

      const res = await fetch(`/api/attendance?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setAttendanceList(data.attendance);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        alert(data.message || '출결 기록 조회 실패');
      }
    } catch (err) {
      console.error('[/dashboard/attendance.js] 출결 기록 fetch 에러: ', err);
      alert('출결기록 조회 중 오류 발생');
    }
  };

  // 페이지 로드 or 변경 시 자동 출결기록 조회
  useEffect(() => {
    fetchAttendance();
  }, [currentPage]); // currentPage 변경될 때마다 재조회

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
              <option value='2025'>2025년</option>
              <option value='2026'>2026년</option>
              <option value='2027'>2027년</option>
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
              <button className={styles.searchBtn} onClick={fetchAttendance}>
                조회
              </button>
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
                <th>근로구분</th>
                <th>담당업무</th>
                <th>이름</th>
                <th>학번</th>
                <th>시작시간</th>
                <th>종료시간</th>
                <th>총근로시간</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList && attendanceList.length > 0 ? (
                attendanceList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.workDate}</td>
                    <td>{item.workType}</td>
                    <td>{item.stdJob}</td>
                    <td>{item.stdName}</td>
                    <td>{item.stdNum}</td>
                    <td>{item.startTime?.slice(0, 5)}</td>
                    <td>{item.endTime?.slice(0, 5)}</td>
                    <td>{item.totalWorkTime}</td>
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
