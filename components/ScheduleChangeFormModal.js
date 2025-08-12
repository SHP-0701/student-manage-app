/* 근로변경사항 등록/수정 모달(ScheduleChangeFormModal) */

import { useState } from 'react';
import ModalLayout from '@components/ModalLayout';
import styles from '@/styles/ScheduleChangeFormModal.module.css';

export default function ScheduleChangeFormModal({ onClose, mode = 'insert' }) {
  // 등록 or 수정 분리
  const isModify = mode === 'modify';

  return (
    <ModalLayout onClose={onClose} maxWidth={400}>
      {/* Modal Title */}
      <h3 className={styles.title}>
        근로변경사항 {isModify ? '수정' : '등록'}
      </h3>
    </ModalLayout>
  );
}
