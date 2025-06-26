/**
 * 로그인 시 처음 접속하는 메인 대시보드에 출력될 Content
 * (/pages/dashboard/DashboardHome.js)
 */

import styles from '@/styles/Dashboard.module.css';
import {
  FaUserGraduate,
  FaClock,
  FaExclamationCircle,
  FaUserPlus,
  FaClipboardList,
  FaChartBar,
} from 'react-icons/fa';

export default function DashboardHome() {
  const admName = sessionStorage.getItem('username');

  return (
    <div className={styles.dashboardHome}>
      <div className={styles.welcomeBox}>
        <h2>안녕하세요 {admName} 님!</h2>
        <p>오늘도 좋은 하루 되세요!</p>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <FaUserGraduate />
          <h3>등록된 학생</h3>
          <p>42명</p>
        </div>
        <div className={styles.card}>
          <FaClock />
          <h3>오늘 출근</h3>
          <p>8명</p>
        </div>
        <div className={styles.card}>
          <FaExclamationCircle />
          <h3>결근 학생</h3>
          <p>2명</p>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3>빠른 작업</h3>
        <button>
          <FaUserPlus />
          학생 등록
        </button>
        <button>
          <FaClipboardList />
          출결 보기
        </button>
        <button>
          <FaChartBar />
          통계 이동
        </button>
      </div>
    </div>
  );
}
