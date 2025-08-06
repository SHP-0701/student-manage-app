/**
 * 근로시간표 백엔드 API
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    const { year, term, workDate, stdNum, startTime, endTime } = req.body;

    if (!stdNum || !year || !term || !workDate || !startTime || !endTime)
      return res.status(400).json({ message: '잘못된 요청입니다.' });

    try {
      // 중복 등록 방지
      const [isExist] = await dbpool.query(
        `SELECT id FROM student_schedule WHERE stdNum = ? AND workDate = ?`,
        [stdNum, workDate]
      );
      if (isExist.length > 0)
        return res.status(409).json({ message: '이미 등록된 날짜입니다.' });

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
    const { year, term, stdJob, workDate } = req.query; // url param

    console.log('[/api/schedule.js] URL param is: ', req.query);

    if (!year || !term || !stdJob || !workDate)
      return res.status(400).json({ message: 'URL Param을 찾을 수 없습니다.' });

    try {
      const query = `
      SELECT 
        ss.stdNum, 
        si.stdName, 
        si.stdJob, 
        si.workType, 
        DATE_FORMAT(ss.startTime, '%H:%i') as startTime, 
        DATE_FORMAT(ss.endTime, '%H:%i') as endTime 
      FROM student_info si JOIN student_schedule ss ON si.stdNum = ss.stdNum 
      WHERE ss.year = ? AND ss.term = ? AND si.stdJob = ? AND ss.workDate = ?
      ORDER BY ss.stdNum, ss.workDate, ss.startTime`;

      const [rows] = await dbpool.execute(query, [
        year,
        term,
        stdJob,
        workDate,
      ]);
      return res.status(200).json(rows);
    } catch (err) {
      console.error('DB 에러: ', err);
      return res.status(500).json({ message: '서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`허용되지 않은 메서드: ${req.method}`);
  }
}
