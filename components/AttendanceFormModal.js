/**
 * 출결 등록/수정 모달
 * props: mode, onClose
 * initialData: 수정 시 데이터
 */

import styles from '@/styles/AttendanceFormModal.module.css';
import { useState, useEffect } from 'react';

export default function AttendanceFormModal({
  mode,
  initialData,
  onClose,
  refreshList,
}) {
  // 상태값
  const [form, setForm] = useState({
    date: '',
    workType: '',
    stdName: '',
    stdNum: '',
    startTime: '',
    endTime: '',
    note: '', // 비고
  });

  // 수정 모달인 경우 초기값 설정
  useEffect(() => {
    if (mode === 'modify' && initialData) {
      setForm({
        date: initialData.date || '',
        workType: initialData.workType || '',
        stdName: initialData.stdName || '',
        stdNum: initialData.stdNum || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        note: initialData.note || '',
      });
    }
  }, [mode, initialData]);

  // input 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 등록/수정 요청(submit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = mode === 'insert' ? 'POST' : 'PUT';
  };
}
