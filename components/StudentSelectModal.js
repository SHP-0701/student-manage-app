/**
 * 학생 선택 모달
 * 출결 등록 모달에서 '학생 선택' 버튼을 누르면 렌더링 됨.
 * '수정' 모달에서는 렌더링 되지 않음.
 */

import styles from "@/styles/StudentSelectModal.module.css";

export default function StudentSelectModal({ onSelect, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>학생 선택</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>이름</th>
              <th>학번</th>
              <th>학과</th>
              <th>근로구분</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5">조회된 학생이 없습니다.</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.buttonGroup}>
          <button className={styles.closeBtn} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
