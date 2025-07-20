/**
 * 근로시간표 등록 모달
 * 모달 공통 레이아웃(ModalLayout.js) 사용
 */

import { useState } from "react";
import ModalLayout from "@/components/ModalLayout";
import styles from "@/styles/ScheduleFormModal.module.css";

const days = ["월", "화", "수", "목", "금"];
const timeSlots = [
  "09:00~10:00",
  "10:00~11:00",
  "11:00~12:00",
  "13:00~14:00",
  "14:00~15:00",
  "15:00~16:00",
  "16:00~17:00",
  "17:00~18:00",
];

export default function ScheduleFormModal({ onClose }) {
  const [selected, setSelected] = useState({});

  // grid에 cell 클릭 시 실행됨
  const toggleCell = (day, time) => {
    const key = `${day}-${time}`;
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <ModalLayout onClose={onClose} maxWidth={700}>
      <h3 className={styles.title}>근로시간표 등록</h3>

      <div className={styles.gridWrapper}>
        <table className={styles.grid}>
          <thead>
            <tr>
              <th>시간/요일</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td>{time}</td>
                {days.map((day) => {
                  const key = `${day}-${time}`;
                  return (
                    <td key={key} onClick={() => toggleCell(day, time)}>
                      <div
                        className={`${styles.cell} ${
                          selected[key] ? styles.selected : ""
                        }`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.btnGroup}>
        <button onClick={onClose}>취소</button>
        <button className={styles.submit}>등록</button>
      </div>
    </ModalLayout>
  );
}
