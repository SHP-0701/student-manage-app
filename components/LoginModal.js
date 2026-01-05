/**
 * 로그인 실패 시 렌더링 되는 모달
 */

import ModalLayout from '@/components/ModalLayout';
import styles from '@/styles/LoginModal.module.css';

export default function LoginModal({ message, onClose }) {
  return (
    <ModalLayout onClose={onClose} maxWidth={300}>
      <p className={styles.p}>{message}</p>
      <button className={styles.button} onClick={onClose}>
        닫기
      </button>
    </ModalLayout>
  );
}
