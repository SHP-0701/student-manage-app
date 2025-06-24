import styles from '@/styles/Dashboard.module.css';
import SideMenu from '@/components/SideMenu';
import DashboardContent from '@/components/DashboardContent';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('username');
    if (name) setUserName(name);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <SideMenu username={userName} />
      <DashboardContent />
    </div>
  );
}
