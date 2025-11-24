/**
 * Layout에 공통적으로 들어갈 왼쪽 메뉴(SideMenu)
 */

import styles from '@/styles/SideMenu.module.css';
import { useRouter } from 'next/router';
import {
  FaUser,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
  FaRegCalendarAlt,
} from 'react-icons/fa';

export default function SideMenu({ username }) {
  const router = useRouter();

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/');
      } else {
        console.error('로그아웃 실패');
      }
    } catch (err) {
      console.error('로그아웃 에러 : ', err);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <FaUser className={styles.userIcon} />
        <p className={styles.welcome}>{username} 님 환영합니다.</p>
        <button className={styles.logout} onClick={handleLogout}>
          <FaSignOutAlt />
          로그아웃
        </button>
      </div>

      <nav className={styles.nav}>
        <ul>
          <li onClick={() => router.push('/dashboard')}>
            <FaHome />
            대시보드
          </li>
          <li onClick={() => router.push('/dashboard/student')}>
            <FaUserGraduate />
            학생 정보
          </li>
          <li onClick={() => router.push('/dashboard/attendance')}>
            <FaClipboardList />
            출결 기록
          </li>
          <li onClick={() => router.push('/dashboard/schedule')}>
            <FaRegCalendarAlt />
            근로시간표
          </li>
          <li onClick={() => router.push('/dashboard/statistics')}>
            <FaChartBar />
            통계
          </li>
        </ul>
      </nav>
    </aside>
  );
}
