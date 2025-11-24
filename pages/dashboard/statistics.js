/* ===================================================================================================
  ▢ 파일명: /pages/dashboard/statistics.js
  ▢ 내용: 근로 학생별 통계 데이터를 그래프(차트, 원형 등)로 보여줌
  ▢ 작성일: 2025. 11. 24.(월)
  ▢ 작성자: 박수훈(shpark)
 =================================================================================================== */

import Layout from '@/components/Layout';
import styles from '@/styles/Statistics.module.css';
import { useState, useEffect } from 'react';

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState('실습실');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 더미 데이터
  const dummyStudents = [
    { id: 1, name: '김철수', stdJob: '실습실', totalHours: 120 },
    { id: 2, name: '이영희', stdJob: '모니터링', totalHours: 95 },
    { id: 3, name: '박민수', stdJob: '실습실', totalHours: 150 },
    { id: 4, name: '최지연', stdJob: '카운터', totalHours: 80 },
    { id: 5, name: '정수민', stdJob: 'ECSC', totalHours: 110 },
    { id: 6, name: '강동욱', stdJob: '실습실', totalHours: 75 },
  ];

  useEffect(() => {
    setStudents(dummyStudents);
  }, []);

  // 탭에 따라 학생 필터링
  const filteredStudents = students.filter((std) => {
    if (activeTab === '실습실') {
      return std.stdJob === '실습실';
    } else {
      return ['모니터링', '카운터', 'ECSC'].includes(std.stdJob);
    }
  });

  const handleStudentClick = (std) => {
    setSelectedStudent(std);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>근로 데이터 통계</h2>

        <div className={styles.contentWrapper}>
          {/** 좌측: 학생 목록 */}
          <section className={styles.studentListSection}>
            {/** 탭 버튼(실습실 / 사무실) */}
            <div className={styles.tabButtons}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === '실습실' ? styles.active : ''
                }`}
                onClick={() => setActiveTab('실습실')}
              >
                실습실
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === '사무실' ? styles.active : ''
                }`}
                onClick={() => setActiveTab('사무실')}
              >
                사무실
              </button>
            </div>

            {/** 학생 목록 테이블 */}
            <div className={styles.tableWrapper}>
              <table className={styles.studentTable}></table>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
