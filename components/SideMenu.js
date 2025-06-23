import styles from '@/styles/SideMenu.module.css';
import { FaUser, FaUserGraduate, FaClipboardList, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

export default function SideMenu({username}) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.topSection}>
                <FaUser className={styles.userIcon} />
                <p className={styles.welcome}>{username} 님 환영합니다.</p>
                <button className={styles.logout}><FaSignOutAlt />로그아웃</button>
            </div>

            <nav className={styles.nav}>
                <ul>
                    <li><FaUserGraduate />학생 정보</li>
                    <li><FaClipboardList />출결 기록</li>
                    <li><FaChartBar />통계</li>
                </ul>
            </nav>
        </aside>
    )
}