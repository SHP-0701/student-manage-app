/* 
  ==================================================================================
  ○ 작성일자: 2026. 01. 05.(월)
  ○ 페이지명: 근로학생 관리시스템 대시보드(/dashboard/index.js)
  ○ 내 용:
    - 로그인 성공 후 보여지는 대시보드 화면
    - 근로학생 근로 상황 등 간략한 정보를 한 눈에 볼 수 있음.
  ○ 작성자: 박수훈(shpark)
  ================================================================================== 
*/

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import DashboardHome from './DashboardHome';

export default function DashboardPage() {
  const router = useRouter();

  // username이 없으면 비로그인 -> 메인 로그인 페이지로 보냄
  useEffect(() => {
    const name = sessionStorage.getItem('username');
    if (!name) router.push('/');
  }, []);

  return (
    <Layout>
      <DashboardHome />
    </Layout>
  );
}
