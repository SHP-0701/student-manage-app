/* 
  ==================================================================================
    ○ 작성일자: 2026. 01. 05.(월)
    ○ 페이지명: 근로학생 관리시스템 대시보드(/dashboard/index.js)
    ○ 내 용: 로그인 후 관리자 대시보드 화면 및 인증(로그인 여부) 체크
    ○ 작성자: 박수훈(shpark)
  ================================================================================== 
*/

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Users,
  CalendarCheck,
  Bell,
  UserPlus,
  CalendarPlus,
  FileEdit,
  Calendar,
} from 'lucide-react';
import Layout from '@/components/Layout';
import styles from '@/styles/Dashboard.module.css';

// 탭(tab)
const STD_JOB = ['실습실', '카운터', 'ECSC', '모니터링'];

// 근로자 현황 더미(dummy) 데이터
const DUMMY_DATA = [
  {
    id: 1,
    workType: '국가근로',
    stdJob: '실습실',
    stdName: '김철수',
    workTime: '09:00 ~ 12:00',
    status: '근로대기',
  },
  {
    id: 2,
    workType: '교육지원',
    stdJob: '실습실',
    stdName: '이영희',
    workTime: '13:00 ~ 17:00',
    status: '근로대기',
  },
  {
    id: 3,
    workType: '행정인턴',
    stdJob: '카운터',
    stdName: '박민수',
    workTime: '09:00 ~ 14:00',
    status: '근로대기',
  },
  {
    id: 4,
    workType: '행정인턴',
    stdJob: 'ECSC',
    stdName: '정지원',
    workTime: '10:00 ~ 16:00',
    status: '근로대기',
  },
  {
    id: 5,
    workType: '교육지원',
    stdJob: '실습실',
    stdName: '최근로',
    workTime: '14:00 ~ 18:00',
    status: '근로대기',
  },
  {
    id: 6,
    workType: '국가근로',
    stdJob: '실습실',
    stdName: '홍길동',
    workTime: '15:00 ~ 18:00',
    status: '근로대기',
  },
];

export default function DashboardPage() {
  const router = useRouter();

  // Hydration Error 방지를 위한 state 관리
  const [admName, setAdmName] = useState('');

  // 탭 상태 관리(초기값: '실습실')
  const [activeTab, setActiveTab] = useState(STD_JOB[0]);

  // 근로자 현황 상태 관리
  const [workerList, setWorkerList] = useState(DUMMY_DATA);

  useEffect(() => {
    // 01. 세션 체크
    const name = sessionStorage.getItem('username');

    // 02. 비로그인 시 리다이렉트(로그인 페이지로)
    if (!name) {
      router.push('/');
    } else {
      // 03. 로그인 상태면 이름 state 세팅
      setAdmName(name);
    }
  }, [router]);

  // 선택된 탭에 맞는 데이터 필터링
  const filteredList = workerList.filter((item) => item.stdJob === activeTab);

  // 출근 버튼 클릭 핸들러
  const handleCheckIn = (id) => {
    setWorkerList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: '근로중' } : item,
      ),
    );
  };

  // 퇴근 버튼 클릭 핸들러
  const handleCheckOut = (id) => {
    setWorkerList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: '근로종료' } : item,
      ),
    );
  };

  // 퀵 메뉴 핸들러
  const handleQuickAction = (action) => {
    if (action === 'schedule') {
      router.push(`/dashboard/schedule`);
    } else {
      alert(`${action} 모달 출력`);
    }
  };

  // 이름이 로드되지 않았다면(리다이렉트 중) 빈 화면 보여주기
  if (!admName) return null;

  return (
    <Layout>
      <div className={styles.dashboardHome}>
        {/** 상단 환영 메시지 */}
        <div className={styles.welcomeBox}>
          <h2>안녕하세요 {admName}님!</h2>
          <p>오늘도 좋은 하루 되세요!</p>
        </div>

        {/** 총 근로 인원, 금일 근로인원, 근로확인 대기 인원 카드 영역 */}
        <div className={styles.statusContainer}>
          {/** [1] 총 인원 */}
          <div className={styles.statusCard}>
            {/** 아이콘 영역 */}
            <div
              className={styles.iconBox}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
              }}
            >
              <Users size={28} />
            </div>
            {/** 텍스트 영역 */}
            <div className={styles.textArea}>
              <h3>총 인원</h3>
              <p className={styles.statusValue}>
                32<span>명</span>
              </p>
            </div>
          </div>

          {/** [2] 금일 근로 인원 */}
          <div className={styles.statusCard}>
            <div
              className={styles.iconBox}
              style={{
                backgroundColor: 'rgba(0, 188, 212, 0.15)',
                color: '#00bcd4',
              }}
            >
              <CalendarCheck size={28} />
            </div>
            <div className={styles.textArea}>
              <h3>금일 근로인원</h3>
              <p className={`${styles.statusValue} ${styles.highlightText}`}>
                5<span>명</span>
              </p>
            </div>
          </div>

          {/** [3] 확인 대기 */}
          <div className={styles.statusCard}>
            <div
              className={styles.iconBox}
              style={{
                backgroundColor: 'rgba(255, 107, 107, 0.15)',
                color: '#ff6b6b',
              }}
            >
              <Bell size={28} />
            </div>
            <div className={styles.textArea}>
              <h3>확인 대기</h3>
              <p className={`${styles.statusValue} ${styles.alertText}`}>
                2<span>건</span>
              </p>
            </div>
          </div>
        </div>

        {/** 하단 콘텐츠 영역 */}
        <div className={styles.contentRow}>
          {/** [4] 금일 근로자 현황 섹션 */}
          <div className={styles.workerSection}>
            <h3 className={styles.sectionTitle}>금일 근로자 현황</h3>

            {/** 탭 버튼 영역 */}
            <div className={styles.tabContainer}>
              {STD_JOB.map((stdJob) => (
                <button
                  key={stdJob}
                  className={`${styles.tabItem} ${activeTab === stdJob ? styles.active : ''}`}
                  onClick={() => setActiveTab(stdJob)}
                >
                  {stdJob}
                </button>
              ))}
            </div>

            {/** 테이블 영역 */}
            <div className={styles.tableWrapper}>
              <table className={styles.workerTable}>
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>근로구분</th>{' '}
                    {/** 국가근로, 행정인턴, 교육지원 */}
                    <th style={{ width: '20%' }}>이름</th>
                    <th style={{ width: '35%' }}>근무시간</th>
                    <th style={{ width: '25%' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 ? (
                    // 데이터 있을 때 출력하기
                    filteredList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className={styles.badge}>{item.workType}</span>
                        </td>
                        <td>{item.stdName}</td>
                        <td>{item.workTime}</td>
                        <td>
                          <div className={styles.btnGroup}>
                            {/** 출근 버튼 */}
                            <button
                              className={`${styles.checkBtn} ${item.status === '근로중' ? styles.working : ''}`}
                              onClick={() => handleCheckIn(item.id)}
                              disabled={item.status != '근로대기'}
                            >
                              출근
                            </button>
                            {/** 퇴근 버튼 */}
                            <button
                              className={`${styles.checkBtn} ${item.status === '근로종료' ? styles.done : ''}`}
                              onClick={() => handleCheckOut(item.id)}
                              disabled={item.status !== '근로중'}
                            >
                              퇴근
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // 데이터 없을 때 출력
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: 'center',
                          padding: '3rem',
                          color: '#666',
                        }}
                      >
                        근로예정 학생이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/** 우측 사이드바 영역(퀵 메뉴 + 메모장) */}
          <aside className={styles.sideBar}>
            {/** [01] 퀵 메뉴 */}
            <div className={styles.quickMenuBox}>
              <h3 className={styles.sidebarTitle}>퀵 메뉴</h3>
              <div className={styles.menuGrid}>
                <button
                  className={styles.menuBtn}
                  onClick={() => handleQuickAction(`학생등록`)}
                >
                  <UserPlus size={24} />
                  <span>학생 등록</span>
                </button>
                <button
                  className={styles.menuBtn}
                  onClick={() => handleQuickAction(`시간표등록`)}
                >
                  <CalendarPlus size={24} />
                  <span>시간표 등록</span>
                </button>
                <button
                  className={styles.menuBtn}
                  onClick={() => handleQuickAction(`근로변경`)}
                >
                  <FileEdit size={24} />
                  <span>근로 변경</span>
                </button>
                <button
                  className={styles.menuBtn}
                  onClick={() => handleQuickAction(`schedule`)}
                >
                  <Calendar size={24} />
                  <span>전체 시간표</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
