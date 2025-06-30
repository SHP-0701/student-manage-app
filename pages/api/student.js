/**
 * 학생 정보 등록/수정/삭제 등등 처리
 * method: 등록(POST), 수정(PUT)
 * props: 등록(insert), 수정(modify)
 */

import dbpool from '@/lib/db';
export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    try {
      const { year, term, stdName, stdNum, stdDept, workType } = req.body;

      // 간단한 유효성 검사
      if (!year || !stdNum || !stdName) {
        return res.status(400).json({ message: '필수 항목 누락됨.' });
      }

      const sql =
        'INSERT INTO student_info (year, term, stdName, stdNum, stdDept, workType) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [year, term, stdName, stdNum, stdDept, workType];
      const [result] = await dbpool.execute(sql, values);

      return res.status(200).json({ message: '학생 정보 등록 성공' });
    } catch (err) {
      console.error('[/api/student.js] POST 에러 ', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }
  }
  // 목록 가져오기(GET)
  else if (req.method === 'GET') {
    try {
      const [rows] = await dbpool.execute(
        'SELECT * FROM student_info ORDER BY created_at DESC'
      );
      return res.status(200).json({ students: rows });
    } catch (error) {
      console.error('[/api/student.js] GET 에러 ', error);
      return res.status(500).json({ message: '학생 목록 조회 실패' });
    }
  }

  // 학생 정보 수정하기(PUT)
  else if (req.method === 'PUT') {
    try {
      const { id, year, term, stdName, stdNum, stdDept, workType } = req.body;

      if (!id) return res.status(400).json({ message: '학생 ID가 없습니다.' });

      const sql =
        'UPDATE student_info SET year = ?, term = ?, stdName = ?, stdNum = ?, stdDept = ?, workType = ? WHERE id = ?';
      const values = [year, term, stdName, stdNum, stdDept, workType, id];
      await dbpool.execute(sql, values);

      return res.status(200).json({ message: '학생 정보 수정 성공' });
    } catch (error) {
      console.error('[/api/student.js] PUT 에러 ', error);
      return res.status(500).json({ message: '수정 오류 발생' });
    }
  }

  // 허용 안 된 메서드
  else {
    return res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
