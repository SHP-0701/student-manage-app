/**
 * 공통 레이아웃(Layout.js)
 * /SideMenu 랑 /DashboardContent 사용 */

import SideMenu from './SideMenu';
import styles from '@/styles/Layout.module.css';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('username');
    if (name) setUserName(name);
  }, []);

  return (
    <div className={styles.layoutWrapper}>
      <SideMenu username={userName} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
