/**
===============================================================================================================
가. (작성일자) 2025. 11. 5.(수)
나. (API 명) 출결 기록 백엔드 API
다. (API 기능) 출결 기록(/dashboard/attendance.js) 프론트와 연동을 통해 DB 접근, 가져오기, 등록/수정 등 작업을 담당
===============================================================================================================
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 조회(GET)
  if (req.method === 'GET') {
    try {
      // 페이지네이션(Pagination) param
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;

      // 필터(filter) param
      const year = req.query.year || '';
      const term = req.query.term || '';
      const workType = req.query.workType || '';
      const stdJob = req.query.stdJob || '';
      const stdName = req.query.stdName || '';
      const startDate = req.query.startDate || '';
      const endDate = req.query.endDate || '';

      // WHERE 조건 동적 생성(초기 WHERE 1=1로 항상 true로 설정하고 뒤에 AND 조건이 붙음)
      let whereClause = 'WHERE 1=1';
      const params = []; // 조건들이 들어갈 배열

      if (year) {
        whereClause += ' AND a.year = ?';
        params.push(year);
      }

      if (term) {
        whereClause += ' AND a.term = ?';
        params.push(term);
      }

      if (workType) {
        whereClause += ' AND i.workType = ?';
        params.push(workType);
      }

      if (stdJob) {
        whereClause += ' AND a.stdJob = ?';
        params.push(stdJob);
      }

      if (stdName) {
        whereClause += ' AND a.stdName LIKE ?';
        params.push(`%${stdName}%`);
      }

      if (startDate) {
        whereClause += ' AND a.workDate >= ?';
        params.push(startDate);
      }

      if (endDate) {
        whereClause += ' AND a.workDate <= ?';
        params.push(endDate);
      }

      // 학생정보(student_info) 테이블과 출결기록(student_attendance) 테이블 JOIN

      // 페이지네이션을 위한 데이터 총 개수 및 총 페이지 수 산출
      const countSQL = `SELECT COUNT(*) as totalCount FROM student_attendance a JOIN student_info i ON a.stdNum = i.stdNum AND a.year = i.year AND a.term = i.term ${whereClause}`;
      const [totalRows] = await dbpool.execute(countSQL, params);
      const totalCount = totalRows[0].totalCount;
      const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / limit);

      // 실제 데이터 조회
      const dataSQL = `SELECT a.id, DATE_FORMAT(a.workDate, '%Y-%m-%d') AS workDate, i.workType, a.stdJob, a.stdName, a.stdNum, a.startTime, a.endTime, a.totalWorkTime 
      FROM student_info i JOIN student_attendance a ON i.stdNum = a.stdNum AND i.year = a.year AND i.term = a.term 
      ${whereClause} ORDER BY a.workDate DESC, a.created_at DESC LIMIT ${offset}, ${limit}`;

      const [rows] = await dbpool.execute(dataSQL, params);

      return res.status(200).json({
        attendance: rows,
        totalCount,
        totalPages,
        currentPage: page,
      });
    } catch (err) {
      console.error('[/api/attendance.js] GET 에러: ', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }
  }

  // 등록(POST)
  else if (req.method === 'POST') {
    try {
      const { scheduleId } = req.body; // 해당 근로시간표 row의 ID를 가져옴.

      if (!scheduleId)
        return res.status(400).json({ message: 'scheduleId가 필요합니다.' });

      // 근로시간표(student_schedule) 테이블과 학생정보(student_info) 테이블 JOIN하여 데이터 가져오기
      const sql = `SELECT s.id, s.year, s.term, s.workDate, s.stdNum, s.startTime, s.endTime, s.isConfirmed, i.stdName, i.workType, i.stdJob, TIMEDIFF(s.endTime, s.startTime) as totalWorkTime
      FROM student_schedule s JOIN student_info i ON s.stdNum = i.stdNum AND s.year = i.year AND s.term = i.term WHERE s.id = ?`;

      const [rows] = await dbpool.execute(sql, [scheduleId]);

      // 데이터가 없으면 에러 처리
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: '해당 근로시간표를 찾을 수 없습니다.' });
      }

      const scheduleData = rows[0];

      // 이미 확인된 경우 체크
      if (scheduleData.isConfirmed === 1) {
        return res
          .status(400)
          .json({ message: '이미 확인된 근로 내역입니다.' });
      }

      // 트랜잭션 처리로 출결기록(student_attendance) 테이블에 insert & 근로시간표(student_schedule) 테이블에 update 실시
      const connection = await dbpool.getConnection();
      await connection.beginTransaction();

      // 트랜잭션 처리 중 예외 처리를 위한 try/catch
      try {
        // 출결기록(student_attendance) 테이블에 INSERT 실시
        const insertSql = `INSERT INTO student_attendance (id, year, term, stdNum, stdName, workType, stdJob, workDate, startTime, endTime, totalWorkTime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [
          scheduleId,
          scheduleData.year,
          scheduleData.term,
          scheduleData.stdNum,
          scheduleData.stdName,
          scheduleData.workType,
          scheduleData.stdJob,
          scheduleData.workDate,
          scheduleData.startTime,
          scheduleData.endTime,
          scheduleData.totalWorkTime,
        ];

        await connection.execute(insertSql, insertValues);

        // 근로시간표(student_schedule) Update(isConfirmed = 1)
        const updateSql = `UPDATE student_schedule SET isConfirmed = 1, confirmedAt = NOW() WHERE id = ?`;
        await connection.execute(updateSql, [scheduleId]);

        // 모두 성공하면 commit 실시
        await connection.commit();
        connection.release();

        return res.status(200).json({ message: '출결 기록 등록 성공' });
      } catch (transactionErr) {
        // 하나라도 실패하면 rollback
        await connection.rollback();
        connection.release();
        throw transactionErr;
      }
    } catch (err) {
      console.error('[/api/attendance.js] POST(등록) 에러: ', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }
  } else {
    return res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
