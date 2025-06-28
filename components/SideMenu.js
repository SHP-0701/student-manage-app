import styles from '@/styles/SideMenu.module.css';
import { useRouter } from 'next/router';
import {
  FaUser,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';

export default function SideMenu({ username }) {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <FaUser className={styles.userIcon} />
        <p className={styles.welcome}>{username} 님 환영합니다.</p>
        <button className={styles.logout}>
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
          <li>
            <FaClipboardList />
            출결 기록
          </li>
          <li>
            <FaChartBar />
            통계
          </li>
        </ul>
      </nav>
    </aside>
  );
}
