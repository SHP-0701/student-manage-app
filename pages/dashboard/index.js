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
import Layout from '@/components/Layout';
import styles from '@/styles/Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();

  // Hydration Error 방지를 위한 state 관리
  const [admName, setAdmName] = useState('');

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

  // 이름이 로드되지 않았다면(리다이렉트 중) 빈 화면 보여주기
  if (!admName) return null;

  return (
    <Layout>
      <div className={styles.dashboardHome}>
        {/** 상단 환영 메시지 */}
        <div className={styles.welcomBox}>
          <h2>안녕하세요 {admName}님!</h2>
          <p>오늘도 좋은 하루 되세요!</p>
        </div>
      </div>
    </Layout>
  );
}
