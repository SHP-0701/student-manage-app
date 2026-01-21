/*
  ===================================================================================================
    ○ 작성일자: 2025. 09. 15.(월)
    ○ 수정일자: 2026. 01. 21.(수)
    ○ 페이지명: /pages/api/changeschedule.js
    ○ 내용: 근로변경사항 모달(/components/ScheduleChangeFormModal.js)과 연동하는 백엔드 API
    ○ 작성자: 박수훈(shpark)
  ===================================================================================================
*/

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    // 프론트에서 넘어온 req.body(param)
    const { stdJob, stdNum, changeDate, beforeTime, afterTime, reason } =
      req.body;

    if (!stdNum || !stdJob)
      return res
        .status(400)
        .json({ message: '잘못된 요청입니다. 다시 확인해주세요.' });

    try {
      const query = `INSERT INTO student_changeSchedule(stdNum, stdJob, changeDate, beforeTime, afterTime, reason) VALUES(?, ?, ?, ?, ?, ?)`;
      const values = [
        stdNum,
        stdJob,
        changeDate,
        beforeTime,
        afterTime,
        reason,
      ];
      const [result] = await dbpool.execute(query, values);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: '근로변경사항 등록 완료' });
      }
      return res.status(500).json({ message: '등록 실패...' });
    } catch (err) {
      console.error('[/api/changeschedule] 등록(POST) 에러: ', err);
      return res.status(500).json({ message: '서버 에러' });
    }
  }

  // 조회(GET)
  else if (req.method === 'GET') {
    try {
      // 학생 상관없이 '변경일자', '선택된탭' 기준으로 조회 실시
      const { changeDate, tab, year, term } = req.query;

      if (!changeDate)
        return res.status(400).json({ message: '변경일자를 확인해주세요.' });

      const sql = `SELECT c.id, i.stdNum, i.stdName, c.stdJob, date_format(c.changeDate, '%Y-%m-%d') AS changeDate, c.beforeTime, c.afterTime, c.reason 
      FROM student_info AS i JOIN student_changeSchedule AS c ON i.stdNum = c.stdNum 
      WHERE c.changeDate = ? AND c.stdJob =? AND i.year = ? AND i.term = ? 
      ORDER BY c.id DESC`;

      const [rows] = await dbpool.execute(sql, [changeDate, tab, year, term]);

      return res.status(200).json({ length: rows.length, data: rows });
    } catch (err) {
      console.error('[/api/changeschedule.js] 조회(GET) 에러: ', err);
      return res.status(500).json({ message: '서버 에러' });
    }
  }

  // 삭제(DELETE)
  else if (req.method === 'DELETE') {
    const id = req.query.id;

    if (!id)
      return res
        .status(400)
        .json({ message: '근로변경사항 ID를 확인해주세요.' });

    try {
      const sql = `DELETE FROM student_changeSchedule WHERE id =?`;
      const [result] = await dbpool.execute(sql, [id]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: '삭제 대상을 찾을 수 없습니다. ' });
      } else {
        return res.status(200).json({ message: '근로변경사항 삭제 완료 ' });
      }
    } catch (err) {
      console.error('[/api/changeschedule.js] 삭제(DELETE) 에러: ', err);
      return res.status(500).json({ message: '서버 에러 발생' });
    }
  }

  // 수정(PUT)
  else if (req.method === 'PUT') {
    const { id, changeDate, beforeTime, afterTime, reason } = req.body;

    console.log(
      '[/api/changeschedule.js] id: ',
      id,
      ' changeDate: ',
      changeDate,
    );

    if (!id || !changeDate)
      return res.status(400).json({ message: '해당 데이터를 확인해주세요' });

    try {
      const sql = `UPDATE student_changeSchedule 
      SET beforeTime = ?, afterTime = ?, reason = ? 
      WHERE id = ? AND changeDate = ?`;

      const [rows] = await dbpool.execute(sql, [
        beforeTime,
        afterTime,
        reason,
        id,
        changeDate,
      ]);

      if (rows.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: '수정 대상을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '근로변경사항 수정 완료' });
    } catch (err) {
      console.error('[/api/changeschedule.js] 수정(PUT) 에러: ', err);
      return res.status(500).json({ message: 'API 서버 에러 ' });
    }
  }
}
