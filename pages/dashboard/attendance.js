/**
 * 출결 기록 화면
 * - 학생 출결 기록 조회함
 * - 연도/학기/근로구분별 필터 적용
 * - 학생 이름으로 검색 가능
 * - 월별 캘린더 또는 표로 출력(캘린더 / 표 둘다?)
 */

import Layout from "@/components/Layout";
import styles from "@/styles/Attendance.module.css";
import { useState, useEffect } from "react";

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWorkType, setSearchWorkType] = useState("");
}
