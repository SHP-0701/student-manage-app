/**
 * 모달 공통 레이아웃(ModalLayout)
 * 모달 레이아웃 뼈대는 만들어져 있고 안에 내용(children)만 계속 바뀔 예정
 */

import styles from '@/styles/ModalLayout.module.css';

export default function ModalLayout({ children, onClose, maxWidth = 450 }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ maxWidth: `${maxWidth}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
