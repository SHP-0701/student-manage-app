/**
 * 로그인 실패 시 렌더링 되는 모달
 */

import ModalLayout from "@/components/ModalLayout";
import styles from "@/styles/LoginModal.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

export default function LoginModal({ message, onClose }) {
  return (
    <ModalLayout onClose={onClose} maxWidth={300}>
      <FaExclamationTriangle className={`${styles.icon} ${styles.error}`} />
      <p className={styles.p}>{message}</p>
      <button className={styles.button} onClick={onClose}>
        닫기
      </button>
    </ModalLayout>
  );
}
