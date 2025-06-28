/**
 * 학생 정보 등록/수정 modal
 */

import styles from '@/styles/StudentFormModal.module.css';

export default function StudentFormModal({ mode = 'insert', onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'insert' ? '학생 등록' : '학생 정보 수정'}</h2>

        <form className={styles.form}>
          <label>
            학년도
            <select>
              <option value=''>선택</option>
              <option value='2024'>2024</option>
              <option value='2025'>2025</option>
              <option value='2026'>2026</option>
            </select>
          </label>

          <label>
            학기
            <select>
              <option value=''>선택</option>
              <option value='1학기'>1학기</option>
              <option value='2학기'>2학기</option>
            </select>
          </label>

          <label>
            학번
            <input type='text' placeholder='학번 입력' />
          </label>

          <label>
            근로구분
            <select>
              <option value=''>선택</option>
              <option value='국가근로'>국가근로장학생</option>
              <option value='대학행정인턴'>대학행정인턴장학생</option>
              <option value='교육지원'>교육지원장학생</option>
            </select>
          </label>

          <div className={styles.buttons}>
            <button type='button' className={styles.cancel} onClick={onClose}>
              취소
            </button>
            <button type='submit' className={styles.save}>
              {mode === 'insert' ? '등록' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
