/*
  =============================================================================
    ○ 작성일자: 2025. 01. 05.(월)
    ○ 페이지명: 공통 레이아웃 사이드 메뉴(/components/SideMenu.js)
    ○ 내용: 페이지 기본 틀인 /components/Layout.js 내에서 보여질 사이드메뉴를 정의
    ○ 작성자: 박수훈(shpark)
  =============================================================================
*/

import { useRouter } from 'next/router';
import styles from '@/styles/SideMenu.module.css';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarDays,
  LogOut,
  UserCircle,
} from 'lucide-react';

export default function SideMenu({ username, currentPath }) {
  const router = useRouter();

  // 로그아웃 처리
  const handleLogout = () => {
    sessionStorage.removeItem('username');
    router.push('/');
  };

  // 메뉴 이동 함수
  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <aside className={styles.sideMenu}>
      {/** 01. 프로필 영역 */}
      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          <UserCircle size={48} strokeWidth={1.5} color='#e5e7eb' />
        </div>
        <div className={styles.welcomeText}>
          <p className={styles.username}>{username || '관리자'} 님</p>
          <span className={styles.welcomeMsg}>환영합니다.</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={14} style={{ marginRight: '6px' }} />
          로그아웃
        </button>
      </div>

      {/** 02. 네비게이션 메뉴 */}
      <nav className={styles.navMenu}>
        <ul className={styles.menuList}>
          {/** 대시보드 */}
          <li
            className={`${styles.menuItem} ${
              currentPath === '/dashboard' ? styles.active : ''
            }`}
            onClick={() => navigateTo('/dashboard')}
          >
            <LayoutDashboard size={20} strokeWidth={1.5} />
            <span>대시보드</span>
          </li>

          {/** 학생 정보 */}
          <li
            className={`${styles.menuItem} ${
              currentPath === '/dashboard/student' ? styles.active : ''
            }`}
            onClick={() => navigateTo('/dashboard/student')}
          >
            <Users size={20} strokeWidth={1.5} />
            <span>학생 정보</span>
          </li>

          {/* 출결 기록 */}
          <li
            className={`${styles.menuItem} ${
              currentPath === '/dashboard/attendance' ? styles.active : ''
            }`}
            onClick={() => navigateTo('/dashboard/attendance')}
          >
            <ClipboardList size={20} strokeWidth={1.5} />
            <span>출결 기록</span>
          </li>

          {/* 근로 시간표 */}
          <li
            className={`${styles.menuItem} ${
              currentPath === '/dashboard/schedule' ? styles.active : ''
            }`}
            onClick={() => navigateTo('/dashboard/schedule')}
          >
            <CalendarDays size={20} strokeWidth={1.5} />
            <span>근로시간표</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
