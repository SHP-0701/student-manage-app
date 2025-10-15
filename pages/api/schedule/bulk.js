/*
=====================================================================================================================================================
가. (작 성 일) 2025. 10. 15.(수)
나. (API 명) bulk.js
다. (API 기능) 근로시간표(/dashboard/schedule.js) 프론트와 연동을 통해 근로시간표 일괄 등록 작업을 담당(수정 및 삭제는 근로시간표 백엔드 API인 /schedule/index.js 에서 처리)
라. (작 성 자) 박수훈
=====================================================================================================================================================
*/

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    // 트랙잭션 사용을 위한 connection 할당
    const connection = await dbpool.getConnection();

    try {
      const { schedules } = req.body;

      // 유효성 검사
      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        return res
          .status(400)
          .json({ message: '등록할 근로시간표 데이터가 없습니다.' });
      }

      // 트랙잭션 시작
      await connection.beginTransaction();

      // SQL Query
      const sql = `INSERT INTO student_schedule (year, term, workDate, stdNum, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)`;

      // 각 스케쥴 데이터 삽입
      for (const schedule of schedules) {
        const { year, term, workDate, stdNum, startTime, endTime } = schedule;

        if (!stdNum || !workDate || !startTime || !endTime)
          throw new Error('필수 항목 누락');

        await connection.execute(sql, [
          year,
          term,
          workDate,
          stdNum,
          startTime,
          endTime,
        ]);
      }

      // 트랜잭션 commit
      await connection.commit();

      return res.status(200).json({
        message: `총 ${schedules.length} 개의 근로시간표가 등록되었습니다.`,
      });
    } catch (e) {
      // 에러 발생한 경우 롤백
      await connection.rollback();
      console.error('[/api/schedule/bulk.js] 등록(POST) 에러: ', e);
      return res.status(500).json({ message: '일괄 등록 중 오류 발생' });
    } finally {
      connection.release();
    }
  } else {
    return res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
