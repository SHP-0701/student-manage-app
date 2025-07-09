/**
 * '학생 정보' 메뉴를 탭하면 나오는 페이지
 * ㅇ 학생 정보 등록 / 조회 / 수정 / 삭제 가능
 * ㅇ 학생 조회 시 근로구분별, 연도별, 학기별 조건 검색
 */

import Layout from '@/components/Layout';
import StudentFormModal from '@/components/StudentFormModal';
import StudentDeleteConfirmModal from '@/components/StudentDeleteConfirmModal';
import styles from '@/styles/Student.module.css';
import { useEffect, useState } from 'react';

export default function StudentPage() {
  // 모달 창 오픈(등록/수정) state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 삭제 모달 창 오픈
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 모달 등록/수정/삭제 분기
  const [mode, setMode] = useState('');

  // 학생 목록 state
  const [students, setStudents] = useState([]);

  // 선택된 학생 정보
  const [currentStudent, setCurrentStudent] = useState(null);

  // 삭제할 학생 정보
  const [studentToDelete, setStudentToDelete] = useState(null);

  // 검색용 state
  const [searchName, setSearchName] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchWorkType, setSearchWorkType] = useState('');
  const [searchStdJob, setSearchStdJob] = useState('');

  // toast 관련 state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 페이징에 사용할 상태(현재 페이지 & 전체 페이지 수)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 학생 목록 가져오는(fetch) 함수
  const fetchStudents = async (page = 1) => {
    try {
      const limit = 5; // 한 페이지에 보여줄 개수

      const queryParams = new URLSearchParams({
        page,
        limit,
        year: searchYear,
        term: searchTerm,
        workType: searchWorkType,
        stdJob: searchStdJob,
        name: searchName,
      });

      const res = await fetch(`/api/student?${queryParams.toString()}`);
      const data = await res.json();

      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('[/dashboard/student.js] 학생 정보 가져오기 오류 : ', err);
    }
  };

  // '수정' 버튼 클릭 핸들러
  const handleEdit = (student) => {
    setMode('modify');
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  // '삭제' 버튼 클릭 핸들러
  const handleDelete = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  // toast 호출 함수
  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 3000);
  };

  // 삭제 동작 API
  const confirmDelete = async (id) => {
    const res = await fetch('/api/student', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (res.ok) {
      showToastMessage(data.message);
      setDeleteModalOpen(false);
      fetchStudents();
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  return (
    <Layout>
      <div className={styles.container}>
        <h2>근로학생 정보 관리</h2>

        {/* 필터 & 등록 버튼 영역 */}
        <div className={styles.filterSection}>
          <div className={styles.filters}>
            <select
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
            >
              <option value=''>전체 연도</option>
              <option value='2025'>2025년</option>
              <option value='2024'>2024년</option>
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
              <option value=''>전체</option>
              <option value='국가근로'>국가근로장학생</option>
              <option value='대학행정인턴'>대학행정인턴장학생</option>
              <option value='교육지원'>교육지원장학생</option>
            </select>

            <select
              value={searchStdJob}
              onChange={(e) => setSearchStdJob(e.target.value)}
            >
              <option value=''>전체</option>
              <option value='카운터'>카운터</option>
              <option value='실습실'>실습실</option>
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

            <button
              className={styles.searchBtn}
              onClick={() => {
                setCurrentPage(1);
                fetchStudents(1);
              }}
            >
              조회
            </button>
          </div>
          <button
            className={styles.registerBtn}
            onClick={() => {
              setMode('insert');
              setIsModalOpen(true);
            }}
          >
            학생 등록
          </button>
        </div>

        {/* 학생 테이블 */}
        <div className={styles.tableSection}>
          <table>
            <thead>
              <tr>
                <th>학년도</th>
                <th>학기</th>
                <th>근로구분</th>
                <th>담당업무</th>
                <th>이름</th>
                <th>학번</th>
                <th>학과</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {/* map()으로 학생 리스트 렌더링 */}
              {students && students.length > 0 ? (
                students.map((std) => (
                  <tr key={std.id}>
                    <td>{std.year}</td>
                    <td>{std.term}</td>
                    <td>{std.workType}</td>
                    <td>{std.stdJob}</td>
                    <td>{std.stdName}</td>
                    <td>{std.stdNum}</td>
                    <td>{std.stdDept}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(std)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(std)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan='7'>등록된 학생 정보가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? styles.activePage : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* 모달 렌더링 */}
        {isModalOpen && (
          <StudentFormModal
            mode={mode}
            initialData={currentStudent}
            onClose={() => setIsModalOpen(false)}
            refreshList={fetchStudents}
            showToastMessage={showToastMessage}
          />
        )}

        {deleteModalOpen && (
          <StudentDeleteConfirmModal
            student={studentToDelete}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={confirmDelete}
          />
        )}

        {/* Toast */}
        {showToast && <div className={styles.toast}>{toastMessage}</div>}
      </div>
    </Layout>
  );
}
