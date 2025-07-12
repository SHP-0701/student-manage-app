/**
 * 학생 정보, 출결 기록 '삭제' 버튼 누르면 렌더링 되는 공통 삭제 모달
 */

import { FaExclamationTriangle } from "react-icons/fa";
import styles from "@/styles/ConfirmDeleteModal.module.css";
import ModalLayout from "@/components/ModalLayout";

export default function ConfirmDeleteModal({
  title,
  message,
  onClose,
  onDelete,
}) {
  return (
    <ModalLayout onClose={onClose} maxWidth={350}>
      {/* 아이콘 */}
      <FaExclamationTriangle className={styles.icon} />
      <h3 className={styles.h3}>{title}</h3>
      <p className={styles.p}>{message}</p>
      <div className={styles.buttons}>
        <button className={styles.cancel} onClick={onClose}>
          취소
        </button>
        <button className={styles.confirm} onClick={() => onDelete()}>
          삭제
        </button>
      </div>
    </ModalLayout>
  );
}
