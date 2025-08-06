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
import { getWorkHours } from '@/utils/timeUtils';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import AttendanceFormModal from '@/components/AttendanceFormModal';

export default function AttendancePage() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStdJob, setSearchStdJob] = useState('');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 등록/수정 모달 오픈 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mode, setMode] = useState(null);

  // 수정/삭제 시 선택된 학생 데이터 넘김
  const [selectedStudent, setSelectedStudent] = useState(null);

  // toast
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 페이징에 사용할 상태(현재 페이지 & 전체 페이지 수)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 수정 버튼 클릭 시 실행
  const handleModify = (item) => {
    setMode('modify');
    setSelectedStudent(item);
    setIsModalOpen(true);
  };

  // 삭제 버튼 핸들러
  const handleDelete = (student) => {
    setDeleteModalOpen(true);
    setSelectedStudent(student);
  };

  // 삭제 API 요청
  const confirmDelete = async (id) => {
    const res = await fetch('/api/attendance', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (res.ok) {
      showToastMsg(data.message);
      setDeleteModalOpen(false);
      fetchAttendance();
    } else {
      alert(data.message);
    }
  };

  // toast 호출 함수
  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      setToastMsg('');
    }, 3000);
  };

  // 출결 데이터 조회
  const fetchAttendance = async (clearFilter = false, page = 1) => {
    const queryParams = new URLSearchParams();

    if (!clearFilter) {
      if (searchYear) queryParams.append('year', searchYear);
      if (searchTerm) queryParams.append('term', searchTerm);
      if (searchName) queryParams.append('stdName', searchName);
      if (searchStdJob) queryParams.append('stdJob', searchStdJob);
      if (startDate)
        queryParams.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate)
        queryParams.append('endDate', endDate.toISOString().split('T')[0]);
    }

    queryParams.append('page', page); // 페이지 추가
    queryParams.append('limit', 5); // 한 페이지당 5개 row

    const res = await fetch(`/api/attendance?${queryParams.toString()}`);
    const data = await res.json();

    setAttendanceList(data.attendance || []);
    setTotalPages(data.totalPages || 1);
    setCurrentPage(data.currentPage || 1);

    if (clearFilter) {
      setSearchName('');
      setSearchYear('');
      setSearchTerm('');
      setSearchStdJob('');
      setStartDate(null);
      setEndDate(null);
    }
  };

  // 출결 데이터 가져올때 사용
  useEffect(() => {
    fetchAttendance(false, currentPage);
  }, [currentPage]);

  return (
    <Layout>
      <div className={styles.container}>
        <h2>근로학생 출결 기록</h2>

        {/* 필터 */}
        <div className={styles.filterSection}>
          <div className={styles.filters}>
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
              className={styles.searchInput}
            />

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText='시작일'
              dateFormat='yyyy-MM-dd'
            />
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
            <button
              className={styles.searchBtn}
              onClick={() => {
                setCurrentPage(1); // 페이지 초기화
                fetchAttendance(false, 1);
              }}
            >
              조회
            </button>
          </div>
          <button
            className={styles.registerBtn}
            onClick={() => {
              setIsModalOpen(true);
              setMode('insert');
            }}
          >
            출결 등록
          </button>
        </div>

        {/* 출결 테이블 */}
        <div className={styles.tableSection}>
          <table>
            <thead>
              <tr>
                <th>학년도</th>
                <th>학기</th>
                <th>날짜</th>
                <th>담당업무</th>
                <th>이름</th>
                <th>학번</th>
                <th>시작시간</th>
                <th>종료시간</th>
                <th>근로시간</th>
                <th>비고</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {/* map()으로 출결 데이터 출력 */}
              {attendanceList && attendanceList.length > 0 ? (
                attendanceList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.year}</td>
                    <td>{item.term}</td>
                    <td>{item.workDate}</td>
                    <td>{item.stdJob}</td>
                    <td>{item.stdName}</td>
                    <td>{item.stdNum}</td>
                    <td>{item.startTime?.slice(0, 5)}</td>
                    <td>{item.endTime?.slice(0, 5)}</td>
                    <td>{getWorkHours(item.startTime, item.endTime)}</td>
                    <td>{item.note}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleModify(item)}
                      >
                        수정
                      </button>
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
                  <td
                    colSpan={11}
                    style={{ textAlign: 'center', padding: '1rem' }}
                  >
                    출결 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션(pagination) */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`${styles.pageBtn} ${
                currentPage === i + 1 ? styles.activePage : ''
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* 모달 렌더링 */}
        {isModalOpen && (
          <AttendanceFormModal
            mode={mode}
            onClose={() => setIsModalOpen(false)}
            refreshList={(clear) => fetchAttendance(clear)}
            initialData={selectedStudent}
            showToastMsg={showToastMsg}
          />
        )}

        {deleteModalOpen && (
          <ConfirmDeleteModal
            title={'근로학생 출결 기록 삭제'}
            onClose={() => setDeleteModalOpen(false)}
            message={`${selectedStudent.stdName} 학생의 출결 기록을 삭제하시겠습니까?`}
            onDelete={() => confirmDelete(selectedStudent.id)}
          />
        )}

        {/* toast */}
        {showToast && <div className={styles.toast}>{toastMsg}</div>}
      </div>
    </Layout>
  );
}
