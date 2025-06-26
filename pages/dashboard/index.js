import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function DashboardPage() {
  const router = useRouter();

  // username이 없으면 비로그인 -> 메인 로그인 페이지로 보냄
  useEffect(() => {
    const name = sessionStorage.getItem('username');
    if (!name) router.push('/');
  }, []);

  return (
    <Layout>
      <h1>대시보드</h1>
      <p>여기는 로그인 후 보는 관리자 대시보드입니다</p>
    </Layout>
  );
}
