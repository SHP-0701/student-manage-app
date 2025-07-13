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
  return (
    <Layout>
      <div className={styles.container}></div>
    </Layout>
  );
}
