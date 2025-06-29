/**
 * '학생 정보' 메뉴를 탭하면 나오는 페이지
 * ㅇ 학생 정보 등록 / 조회 / 수정 / 삭제 가능
 * ㅇ 학생 조회 시 근로구분별, 연도별, 학기별 조건 검색
 * ㅇ 근로 내역 테이블과 연계하여 해당 학생이 이번년도 월별 근로 얼마나 했는지 조회 가능
 */

import Layout from '@/components/Layout';
import StudentFormModal from '@/components/StudentFormModal';
import styles from '@/styles/Student.module.css';
import { useState } from 'react';

export default function StudentPage() {

  // 모달 창 오픈(등록/수정) state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 등록/수정/삭제 분기
  const [mode, setMode] = useState('');

  return (
    <Layout>
      <div className={styles.container}>
        <h2>근로학생 정보 관리</h2>

        {/* 필터 & 등록 버튼 영역 */}
        <div className={styles.filterSection}>
          <div className={styles.filters}>
            <select>
              <option>2025년</option>
              <option>2024년</option>
            </select>
            <select>
              <option>1학기</option>
              <option>2학기</option>
            </select>
            <select>
              <option>전체</option>
              <option>국가근로장학생</option>
              <option>대학행정인턴장학생</option>
              <option>교육지원장학생</option>
            </select>
            <button className={styles.searchBtn}>조회</button>
          </div>
          <button className={styles.registerBtn} onClick={() => {
            setMode('insert');
            setIsModalOpen(true);
          }}>학생 등록</button>
        </div>

        {/* 학생 테이블 */}
        <div className={styles.tableSection}>
          <table>
            <thead>
              <tr>
                <th>학년도</th>
                <th>학기</th>
                <th>이름</th>
                <th>학번</th>
                <th>학과</th>
                <th>근로구분</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025</td>
                <td>1학기</td>
                <td>파이리</td>
                <td>202512345</td>
                <td>컴퓨터인공지능공학부</td>
                <td>국가근로장학생</td>
                <td>
                  <button className={styles.editBtn}>수정</button>
                  <button className={styles.deleteBtn}>삭제</button>
                </td>
              </tr>
              {/* TO-DO list: 이후 map()으로 학생 리스트 렌더링 */}
            </tbody>
          </table>
        </div>

        {/* 모달 렌더링 */}
        {
          isModalOpen && (
            <StudentFormModal mode={mode} onClose={() => setIsModalOpen(false)} />
          )
        }
      </div>
    </Layout>
  );
}
