/**
 * '근로 시간표' 메뉴
 * 왼쪽: 캘린더(react-calendar)
 * 오른쪽: 리스트
 */

import Layout from "@/components/Layout";
import styles from "@/styles/Schedule.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";

export default function SchedulePage() {
  // 선택된 탭
  const [activeTab, setActiveTab] = useState("실습실");

  // 탭 목록
  const tabs = ["실습실", "카운터", "ECSC", "모니터링"];

  return (
    <Layout>
      <div className={styles.container}>
        {/* 왼쪽 영역: 캘린더(react-calendar) */}
        <div className={styles.left}>
          <Calendar />
        </div>

        {/* 오른쪽 영역: 탭 + 테이블 */}
        <div className={styles.right}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${
                  activeTab === tab ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>학번</th>
                  <th>성명</th>
                  <th>근로구분</th>
                  <th>담당업무</th>
                  <th>근로시간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>202512345</td>
                  <td>파이리</td>
                  <td>국가근로</td>
                  <td>카운터</td>
                  <td>09:00~12:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
