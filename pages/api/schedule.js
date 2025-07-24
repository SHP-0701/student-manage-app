/**
 * 근로시간표 백엔드 API
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    const { stdNum, schedule } = req.body;

    if (!stdNum) return res.status(400).json({ message: '잘못된 요청입니다.' });

    try {
      for (const entry of schedule) {
        const { days, startTime, endTime } = entry;

        await dbpool.execute(
          `INSERT INTO student_schedule (stdNum, day, startTime, endTime) VALUES (?, ?, ?, ?)`,
          [stdNum, days, startTime, endTime]
        );
      }

      res.status(200).json({ message: '근로시간표 등록 완료' });
    } catch (err) {
      console.error('[/api/schedule] 오류: ', err);
      res.status(500).json({ message: '서버 오류' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`허용되지 않은 메서드: ${req.method}`);
  }
}
