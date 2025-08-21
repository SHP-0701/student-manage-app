/**
 * 근로변경사항 백엔드 API
 * /api/schedule.js 랑 같이 써볼까 했는데 괜히 더 헷갈릴거 같아 별도의 api로 분리함.
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
    // 학생 상관없이 '변경일자' 기준으로 조회 실시
    const { changeDate } = req.query;
    console.log('[/api/changeschedule.js] 조회(GET) changeDate: ', changeDate);
    return res.status(200).json({ message: '조회 완료' });
  }
}
