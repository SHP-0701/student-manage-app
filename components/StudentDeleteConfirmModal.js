/**
 * 학생 목록에서 '삭제' 버튼을 누르면 렌더링 되는 모달
 */

import styles from '@/styles/StudentDeleteConfirmModal.module.css';

export default function ConfirmDeleteModal({ student, onClose, onDelete }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>학생 정보 삭제</h3>
        <p>{student.stdName} 학생 정보를 정말 삭제하시겠습니까?</p>
        <div className={styles.buttons}>
          <button onClick={onClose} className={styles.cancel}>
            취소
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className={styles.confirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
