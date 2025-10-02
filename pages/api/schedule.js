/*
===============================================================================================================

가. (작성일자) 2025. 9. 16.(화)
나. (API 명) 근로시간표 백엔드 API
다. (API 기능) 근로시간표(/dashboard/schedule.js) 프론트와 연동을 통해 DB 접근, 가져오기, 등록/수정 등 작업을 담당
라. (기타사항)
  - REST API를 따름.
  - 수정(PUT)에서 근로확인여부를 저장 ※ 등록(POST) 아님

===============================================================================================================
*/

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    const { year, term, workDate, stdNum, startTime, endTime } = req.body;

    if (!stdNum || !workDate)
      return res.status(400).json({ message: '잘못된 요청입니다.' });

    try {
      // 근로시간표 등록
      const query = `INSERT INTO student_schedule(year, term, workDate, stdNum, startTime, endTime) VALUES(?, ?, ?, ?, ?, ?)`;
      const values = [year, term, workDate, stdNum, startTime, endTime];
      const [result] = await dbpool.execute(query, values);

      if (result.affectedRows > 0)
        return res.status(200).json({ message: '근로시간표 등록 성공' });
    } catch (err) {
      console.error('[/api/schedule] 오류: ', err);
      return res.status(500).json({ message: '서버 오류' });
    }
  }

  // 조회(GET)
  else if (req.method === 'GET') {
    const { year, term, stdJob, workDate } = req.query;

    if (!stdJob || !workDate)
      return res.status(400).json({ message: 'URL Param을 찾을 수 없습니다.' });

    try {
      const query = `
      SELECT 
        si.year,
        si.term,
        ss.id,
        date_format(ss.workDate, '%Y-%m-%d') as workDate,
        ss.stdNum, 
        si.stdName, 
        si.stdJob, 
        si.workType, 
        DATE_FORMAT(ss.startTime, '%H:%i') as startTime, 
        DATE_FORMAT(ss.endTime, '%H:%i') as endTime,
        ss.isConfirmed,
        ss.confirmedAt 
      FROM student_info si JOIN student_schedule ss ON si.stdNum = ss.stdNum AND si.year = ss.year AND si.term = ss.term
      WHERE si.stdJob = ? AND ss.workDate = ? AND ss.year = ? AND ss.term = ?
      ORDER BY ss.startTime`;

      const [rows] = await dbpool.execute(query, [
        stdJob,
        workDate,
        year,
        term,
      ]);
      return res.status(200).json(rows);
    } catch (err) {
      console.error('DB 에러: ', err);
      return res.status(500).json({ message: '서버 에러' });
    }
  }

  // 수정(PUT)
  else if (req.method === 'PUT') {
    const { id, startTime, endTime, isConfirmed } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ message: '근로시간표 ID가 존재하지 않습니다' });

    try {
      // 근로시간표 확인/미확인 상태 업데이트
      if (isConfirmed !== undefined) {
        const sql = `UPDATE student_schedule SET isConfirmed = ?, confirmedAt = now() WHERE id = ?`;
        const [result] = await dbpool.execute(sql, [isConfirmed ? 1 : 0, id]);

        if (result.affectedRows === 0)
          return res
            .status(404)
            .json({ message: '근로확인할 대상을 찾을 수 없습니다.' });

        return res.status(200).json({ message: '근로 확인이 완료되었습니다.' });
      }

      if (!startTime || !endTime)
        return res
          .status(400)
          .json({ message: '시작시간 / 종료시간은 필수입니다' });

      if (startTime >= endTime)
        return res.status(400).json({
          message: '시작시간은 종료시간보다 빠르거나 같을 수 없습니다',
        });

      let sql = `UPDATE student_schedule SET startTime = ?, endTime = ?, updated_at = NOW() WHERE id = ?`;
      const [result] = await dbpool.query(sql, [startTime, endTime, id]);

      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ message: '수정할 대상을 찾을 수 없습니다 ' });

      return res.status(200).json({ message: '근로시간표 수정 완료' });
    } catch (err) {
      console.error('[/api/schedule.js] Error: ', err);
      return res
        .status(500)
        .json({ message: '근로시간표 수정 실패', error: err });
    }
  }

  // 삭제(DELETE)
  else if (req.method === 'DELETE') {
    const id = req.query.id;

    if (!id)
      return res.status(400).json({ message: '근로시간표 ID가 필요합니다.' });

    try {
      const [result] = await dbpool.execute(
        `DELETE FROM student_schedule WHERE id =?`,
        [id]
      );

      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ message: '삭제 대상을 찾을 수 없습니다. ' });

      return res.status(200).json({ message: '근로시간표 삭제 성공' });
    } catch (err) {
      console.error('[/api/schedule.js] DELETE error: ', err);
      return res
        .status(500)
        .json({ message: '근로시간표 삭제 실패', error: err });
    }
  }

  // 허용되지 않은 메소드 처리
  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`허용되지 않은 메서드: ${req.method}`);
  }
}
