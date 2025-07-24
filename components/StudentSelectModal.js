/**
 * 학생 선택 모달
 * 출결 기록 등록 모달, 근로시간표 등록 모달에서 사용하는 공통 모달
 */

import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/StudentSelectModal.module.css';
import { useEffect, useState } from 'react';
import { getYearTerm } from '@/utils/timeUtils';

export default function StudentSelectModal({ onSelect, onClose }) {
  // 학생 목록
  const [students, setStudents] = useState([]);
  const { year, term } = getYearTerm(new Date());

  // 학생 이름 검색 파라미터용
  const [searchStdName, setSearchStdName] = useState('');

  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams({
        year: year,
        term: term,
      });

      if (searchStdName) queryParams.append('name', searchStdName);

      const res = await fetch(`/api/student?${queryParams.toString()}`);
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error('[StudentSelectModal.js] 학생 목록 가져오기 오류 : ', err);
    }
  };

  // 학생 목록 가져오기
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <ModalLayout onClose={onClose} maxWidth={500}>
      <h2>학생 선택</h2>
      {/* 이름 검색 */}
      <div className={styles.searchSection}>
        <input
          type='text'
          placeholder='학생 이름'
          value={searchStdName}
          onChange={(e) => setSearchStdName(e.target.value)}
        />
        <button onClick={fetchStudents}>검색</button>
      </div>
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
                        stdName: std.stdName, // 이름
                        stdNum: std.stdNum, // 학번
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
      <div className={styles.buttonGroup}>
        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </ModalLayout>
  );
}
