/*
  =================================================================================================================
    ○ 작성일자: 2026. 01. 07.(수)
    ○ 페이지명: /dashboard/student.js
    ○ 내용: 근로 학생 정보 관리 페이지
      - 학생 정보 등록, 수정, 삭제(논리 삭제) 등 CRUD 기능 구현
      - 근로시간표 등록 전 학생 정보 등록 반드시 필요(목록에서 선택하여 시간표 등록)
    ○ 작성자: 박수훈(shpark)
  =================================================================================================================
*/

import Layout from '@/components/Layout';
import StudentFormModal from '@/components/StudentFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import styles from '@/styles/Student.module.css';
import { useEffect, useState } from 'react';
import { getYearTerm } from '@/utils/timeUtils';

// 아이콘(lucide-react) import
import {
  Search,
  UserPlus,
  Filter,
  Pencil,
  Trash2,
  GraduationCap,
} from 'lucide-react';

export default function StudentPage() {
  const { year, term } = getYearTerm(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [mode, setMode] = useState('');
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // 검색 상태(state)
  const [searchName, setSearchName] = useState('');
  const [searchYear, setSearchYear] = useState(year);
  const [searchTerm, setSearchTerm] = useState(term);
  const [searchWorkType, setSearchWorkType] = useState('');
  const [searchStdJob, setSearchStdJob] = useState('');

  // 현재 연도 기준 -2 ~ +2 리스트 생성
  const yearOptions = Array.from({ length: 5 }, (_, i) => year - 2 + i);

  // toast 관련 state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 페이징 상태(현재 페이지 & 전체 페이지 수)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 학생 목록 fetch
  const fetchStudents = async (page = 1) => {
    try {
      const limit = 10; // 한 페이지에 보여줄 개수
      const queryParams = new URLSearchParams({
        page,
        limit,
        year: searchYear,
        term: searchTerm,
        workType: searchWorkType,
        stdJob: searchStdJob,
        stdName: searchName,
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
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        isActive: false, // 무조건 false(비활성화)로 변경
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showToastMessage(data.message);
      setDeleteModalOpen(false);
      fetchStudents(currentPage);
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
        {/** 01. 페이지 헤더 */}
        <div className={styles.headerSection}>
          <div className={styles.titleGroup}>
            <GraduationCap size={28} className={styles.titleIcon} />
            <h2>근로학생 정보 관리</h2>
          </div>
          <button
            className={styles.registerBtn}
            onClick={() => {
              setMode('insert');
              setCurrentStudent(null);
              setIsModalOpen(true);
            }}
          >
            <UserPlus size={18} />
            학생 등록
          </button>
        </div>

        {/* 02. 검색 및 필터 영역 */}
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <div className={styles.selectWrapper}>
              <Filter size={16} className={styles.filterIcon} />
              <select
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
              >
                <option value=''>전체 연도</option>
                {/** 배열 순회하며 option 생성 */}
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <option value=''>전체 학기</option>
                <option value='1학기'>1학기</option>
                <option value='2학기'>2학기</option>
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <select
                value={searchWorkType}
                onChange={(e) => setSearchWorkType(e.target.value)}
              >
                <option value=''>근로구분(전체)</option>
                <option value='국가근로'>국가근로장학생</option>
                <option value='대학행정인턴'>대학행정인턴장학생</option>
                <option value='교육지원'>교육지원장학생</option>
              </select>
            </div>

            <div className={styles.selectWrapper}>
              <select
                value={searchStdJob}
                onChange={(e) => setSearchStdJob(e.target.value)}
              >
                <option value=''>담당업무(전체)</option>
                <option value='카운터'>카운터</option>
                <option value='실습실'>실습실</option>
                <option value='ECSC'>ECSC</option>
                <option value='모니터링'>모니터링</option>
              </select>
            </div>
          </div>

          <div className={styles.searchGroup}>
            <input
              type='text'
              placeholder='이름 검색...'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className={styles.searchInput}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudents(1)}
            />
            <button
              className={styles.searchBtn}
              onClick={() => {
                setCurrentPage(1);
                fetchStudents(1);
              }}
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/** 03. 데이터(학생) 테이블 */}
        <div className={styles.tableSection}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>학년도/학기</th>
                <th>근로구분</th>
                <th>담당업무</th>
                <th>이름</th>
                <th>학번</th>
                <th>학과</th>
                <th style={{ textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((std) => (
                  <tr key={std.id}>
                    <td>
                      <span className={styles.termBadge}>
                        {std.year}-{std.term}
                      </span>
                    </td>
                    <td>{std.workType}</td>
                    <td>{std.stdJob}</td>
                    <td className={styles.nameCell}>{std.stdName}</td>
                    <td className={styles.monoCell}>{std.stdNum}</td>
                    <td>{std.stdDept}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(std)}
                          title='정보 수정'
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(std)}
                          title='학생 삭제'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='8'>등록된 학생 정보가 없습니다.</td>
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
            showToastMsg={showToastMessage}
          />
        )}

        {deleteModalOpen && (
          <ConfirmDeleteModal
            title={'학생 정보 삭제'}
            onClose={() => setDeleteModalOpen(false)}
            message={`${studentToDelete.stdName} 학생 정보를 삭제하시겠습니까?`}
            onDelete={() => confirmDelete(studentToDelete.id)}
          />
        )}

        {/* Toast */}
        {showToast && <div className={styles.toast}>{toastMessage}</div>}
      </div>
    </Layout>
  );
}
