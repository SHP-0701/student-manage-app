import styles from '@/styles/Dashboard.module.css';
import SideMenu from '@/components/SideMenu';
import DashboardContent from '@/components/DashboardContent';

export default function Dashboard() {
    return (
        <div className={styles.dashboardContainer}>
            <SideMenu />
            <DashboardContent />
        </div>
    )
}