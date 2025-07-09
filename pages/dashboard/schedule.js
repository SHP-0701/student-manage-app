/**
 * '근로 시간표' 메뉴 선택 시 렌더링됨
 * 리스트 형태? 달력 형태? 아직 정해지진 않았는데 일단 리스트 형식으로 가보려고 함.
 */

import Layout from '@/components/Layout';
import styles from '@/styles/Schedule.module.css';

export default function SchedulePage() {
  return (
    <Layout>
      <div className={styles.container}></div>
    </Layout>
  );
}
