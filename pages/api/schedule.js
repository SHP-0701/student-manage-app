/**
 * 근로시간표 백엔드 API
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    const { stdNum, year, term, schedule } = req.body;

    if (!stdNum || !year || !term)
      return res.status(400).json({ message: '잘못된 요청입니다.' });

    try {
      for (const entry of schedule) {
        const { days, startTime, endTime } = entry;

        await dbpool.execute(
          `INSERT INTO student_schedule (year, term, stdNum, day, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)`,
          [year, term, stdNum, days, startTime, endTime]
        );
      }

      res.status(200).json({ message: '근로시간표 등록 완료' });
    } catch (err) {
      console.error('[/api/schedule] 오류: ', err);
      res.status(500).json({ message: '서버 오류' });
    }
  }

  // 조회(GET)
  else if (req.method === 'GET') {
    const { year, term, stdJob, day } = req.query; // url param

    if (!year || !term || !stdJob || !day)
      return res.status(400).json({ message: 'URL Param을 찾을 수 없습니다.' });

    try {
      const query = `SELECT ss.stdNum, si.stdName, si.stdJob, ss.day, DATE_FORMAT(ss.startTime, '%H:%i') as startTime, DATE_FORMAT(ss.endTime, '%H:%i') as endTime 
      FROM student_info si JOIN student_schedule ss ON si.stdNum = ss.stdNum 
      WHERE ss.year = ? AND ss.term = ? AND si.stdJob = ? AND ss.day = ? 
      ORDER BY ss.stdNum, ss.day, ss.startTime`;

      const [rows] = await dbpool.execute(query, [year, term, stdJob, day]);

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
