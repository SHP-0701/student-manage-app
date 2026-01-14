/*
  =======================================================================================================================
    ○ 작성일자: 2025. 11. 07.(금)
    ○ 수정일자: 2026. 01. 14.(수)
    ○ 페이지명: /dashboard/attendance.js
    ○ 내용: 출결 기록 페이지
      - 출결 기록 삭제는 /api/attendance.js 가 아닌 /api/schedule/index.js에서 동작
      - 근로시간표 삭제 시 출결 기록도 같이 삭제
    ○ 작성자: 박수훈(shpark)
  =======================================================================================================================
*/

import Layout from '@/components/Layout';
import DatePicker from 'react-datepicker';
import styles from '@/styles/Attendance.module.css';
import { useEffect, useState } from 'react';
import { getLocalDateString, getYearTerm } from '@/utils/timeUtils';
import { Toaster, toast } from 'react-hot-toast';

export default function AttendancePage() {
  // 출결데이터 상태
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
  const [totalCount, setTotalCount] = useState(1);

  // 출결 기록 fetch
  const fetchAttendance = async () => {
    try {
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
        setTotalCount(data.totalCount);
      } else {
        alert(data.message || '출결 기록 조회 실패');
      }
    } catch (err) {
      console.error('[/dashboard/attendance.js] 출결 기록 fetch 에러: ', err);
      alert('출결기록 조회 중 오류 발생');
    }
  };

  // 엑셀 내보내기(export) 함수
  const handleExport = async () => {
    try {
      // 엑셀 내보내기 로딩 표시
      const toastId = toast.loading('엑셀 파일 생성중...');

      // 쿼리 파라미터 생성(현재 필터 조건 사용)
      const params = new URLSearchParams();

      if (searchYear) params.append('year', searchYear);
      if (searchTerm) params.append('term', searchTerm);
      if (searchWorkType) params.append('workType', searchWorkType);
      if (searchStdJob) params.append('stdJob', searchStdJob);
      if (searchName) params.append('stdName', searchName);
      if (startDate) params.append('startDate', getLocalDateString(startDate));
      if (endDate) params.append('endDate', getLocalDateString(endDate));

      // API 호출
      const res = await fetch(`/api/attendance/export?${params.toString()}`);

      if (!res.ok) {
        const err = await res.json();
        toast.dismiss(toastId); // 로딩 제거
        toast.error(err.message || '엑셀 내보내기 실패');
        return;
      }

      // 파일 다운로드 실시
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `출결기록_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss(toastId); // 로딩 제거
      toast.success('엑셀 다운로드 완료');
    } catch (err) {
      console.error('[/dashboard/attendance.js] 엑셀 다운로드 에러: ', err);
      toast.error('엑셀 다운로드 중 오류 발생');
    }
  };

  useEffect(() => {
    const { year, term } = getYearTerm(new Date());
    if (year) setSearchYear(year);
    if (term) setSearchTerm(term);
    fetchAttendance();
  }, [currentPage]);

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    const pages = [];

    // 1페이지는 항상 표시
    pages.push(
      <button
        key={1}
        className={`${styles.pageNumber} ${
          currentPage === 1 ? styles.active : ''
        }`}
        onClick={() => setCurrentPage(1)}
      >
        1
      </button>
    );

    // 시작&끝 페이지 계산
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    // 현재 페이지가 앞쪽에 있을 때
    if (currentPage <= 3) endPage = Math.min(5, totalPages - 1);

    // 현재 페이지가 뒤쪽에 있을 때
    if (currentPage >= totalPages - 2) startPage = Math.max(2, totalPages - 4);

    // 첫 페이지와 시작 페이지 사이 생략(...) 표시
    if (startPage > 2)
      pages.push(
        <span key='dots-1' className={styles.dots}>
          ...
        </span>
      );

    // 중간 페이지들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageNumber} ${
            currentPage === i ? styles.active : ''
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // 끝 페이지와 마지막 페이지 사이 생략(...) 표시
    if (endPage < totalPages - 1) {
      pages.push(
        <span key='dots-2' className={styles.dots}>
          ...
        </span>
      );
    }

    // 마지막 페이지(totalPage가 1보다 클 때만)
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`${styles.pageNumber} ${
            currentPage === totalPages ? styles.act : ''
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <Layout>
      {/** Toast container */}
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
          },
        }}
      />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>출결 기록</h2>
          <div className={styles.totalCount}>
            Total <span className={styles.countNum}>{totalCount}</span>
          </div>
        </div>

        {/** 필터(검색조건) 카드 영역 */}
        <div className={styles.filterCard}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>검색조건</h3>
          </div>

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
            <div className={styles.datePickerGroup}>
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
            </div>

            <div className={styles.filterActions}>
              <button className={styles.searchBtn} onClick={fetchAttendance}>
                조회
              </button>
              <button className={styles.exportBtn} onClick={handleExport}>
                내보내기
              </button>
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
                    <td>
                      <span className={styles.badge}>{item.workType}</span>
                    </td>
                    <td>{item.stdJob}</td>
                    <td className={styles.nameCell}>{item.stdName}</td>
                    <td>{item.stdNum}</td>
                    <td>{item.startTime?.slice(0, 5)}</td>
                    <td>{item.endTime?.slice(0, 5)}</td>
                    <td className={styles.timeCell}>
                      {item.totalWorkTime?.substring(0, 5)}
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
        <div className={styles.pagination}>{renderPagination()}</div>
      </div>
    </Layout>
  );
}
