/**
 * 학생 선택 모달
 * 출결 기록 등록 모달, 근로시간표 등록 모달에서 사용하는 공통 모달
 */

import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/StudentSelectModal.module.css';
import { useEffect, useState } from 'react';
import { getYearTerm } from '@/utils/timeUtils';

export default function StudentSelectModal({ onSelect, onClose, selectTab }) {
  // 학생 목록
  const [students, setStudents] = useState([]);
  const { year, term } = getYearTerm(new Date());

  // 학생 이름 검색 파라미터용
  const [searchStdName, setSearchStdName] = useState('');

  // 페이징
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // 한 페이지 당 5개 보여줌

  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams({
        year: year,
        term: term,
        stdJob: selectTab,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (searchStdName) queryParams.append('stdName', searchStdName);

      console.log(
        '[/components/StudentSelectModal.js] queryParams? ',
        queryParams
      );

      const res = await fetch(`/api/student?${queryParams.toString()}`);
      const data = await res.json();

      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('[StudentSelectModal.js] 학생 목록 가져오기 오류 : ', err);
    }
  };

  // '검색' 버튼 핸들러
  const handleSearch = () => {
    setCurrentPage(1);
    fetchStudents();
  };

  // 학생 목록 가져오기
  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  return (
    <ModalLayout onClose={onClose} maxWidth={650}>
      <h2>학생 선택</h2>

      {/* 이름 검색 */}
      <div className={styles.searchSection}>
        <input
          type='text'
          placeholder='학생 이름'
          value={searchStdName}
          onChange={(e) => setSearchStdName(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 학생 목록 테이블 영역 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>학과</th>
            <th>근로구분</th>
            <th>선택</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((std) => (
              <tr key={std.id}>
                <td>{std.stdName}</td>
                <td>{std.stdNum}</td>
                <td>{std.stdDept}</td>
                <td>{std.workType}</td>
                <td>
                  <button
                    className={styles.selectBtn}
                    onClick={() => {
                      onSelect({
                        id: std.id,
                        year: std.year,
                        term: std.term,
                        stdName: std.stdName,
                        stdNum: std.stdNum,
                        stdDept: std.stdDept,
                        workType: std.workType,
                        stdJob: std.stdJob,
                      });
                      onClose();
                    }}
                  >
                    선택
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>조회된 학생이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
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
      )}

      {/* 닫기 버튼 */}
      <div className={styles.buttonGroup}>
        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </ModalLayout>
  );
}
