/**
 * 로그인 후 처음 진입하는 메인 대시보드(/pages/dashboard/index.js)
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
