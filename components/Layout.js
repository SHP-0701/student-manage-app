/*
=======================================================================================
  ○ 작성일자: 2026. 01. 05.(월)
  ○ 페이지명: /components/Layout.js
  ○ 내용: 페이지 구성 기본틀(왼쪽: 사이드메뉴 / 오른쪽: 해당 메뉴 콘텐츠)
  ○ 작성자: 박수훈(shpark)
=======================================================================================
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SideMenu from './SideMenu';
import styles from '@/styles/Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('username');
    if (name) setUserName(name);
  }, []);

  return (
    <div className={styles.layoutWrapper}>
      <SideMenu username={userName} currentPath={router.pathname} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
