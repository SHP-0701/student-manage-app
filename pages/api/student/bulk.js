/*
  ===================================================================================================
    ○ 작성일자 : 2026. 03. 05.(목)
    ○ API명 : /pages/api/student/bulk.js
    ○ 내용 : 학생정보 관리 페이지에서 학생정보를 일괄적으로 등록하는 백엔드 API
      ※ 일괄등록 기능만 수행하는 API라서 수정/삭제는 고려하지 않음
    ○ 작성자 : 박수훈(shpark)
  ===================================================================================================
*/

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: '허용되지 않은 메서드' });

  const students = req.body;

  if (!students || students.length === 0)
    return res.status(400).json({ message: '등록할 데이터가 없습니다.' });

  // [1] 트랜잭션을 위한 단일 커넥션 확보
  const conn = await dbpool.getConnection();

  try {
    await conn.beginTransaction();

    const values = students.map((std) => [
      std['학년도'] || '',
      std['학기'] || '',
      std['이름'] || '',
      std['학번'] || '',
      std['학과'] || '',
      std['근로구분'] || '',
      std['담당업무'] || '',
    ]);

    // [2] 일괄등록 Insert 쿼리 실행
    const sql = `INSERT INTO student_info (year, term, stdName, stdNum, stdDept, workType, stdJob) VALUES ?`;

    await conn.query(sql, [values]);

    // [3] 쿼리 최종 반영(commit)
    await conn.commit();

    return res.status(200).json({
      message: `학생 정보가 성공적으로 ${students.length} 건 등록되었습니다.`,
    });
  } catch (error) {
    // [4] 오류 감지 시 즉각 Rollback
    await conn.rollback();
    console.error(`[/api/student/bulk.js] 일괄등록 트랜잭션 롤백: `, error);
    return res.status(500).json({
      message: `DB 일괄 등록 중 오류가 발생하여 전체 롤백되었습니다.`,
    });
  } finally {
    if (conn) conn.release();
  }
}
