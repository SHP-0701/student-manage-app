/**
 * 출결 기록 관련 처리
 * REST API 사용(POST, GET, PUT, DELETE)
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 출결 등록(POST)
  if (req.method === 'POST') {
    try {
      const {
        year,
        term,
        stdNum,
        stdName,
        workType,
        stdJob,
        workDate,
        startTime,
        endTime,
        note,
      } = req.body;
      if (!stdNum || !stdName)
        return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

      const sql =
        'INSERT INTO student_attendance (year, term, stdNum, stdName, workType, stdJob, workDate, startTime, endTime, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [
        year,
        term,
        stdNum,
        stdName,
        workType,
        stdJob,
        workDate,
        startTime,
        endTime,
        note,
      ];

      await dbpool.execute(sql, values);

      return res.status(200).json({ message: '학생 출결 등록 성공' });
    } catch (err) {
      console.error('[/api/attendance.js] POST 에러 : ', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }
  }

  // 출결 내역 조회(GET)
  else if (req.method === 'GET') {
    try {
      // 페이지네이션 관련 param
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 7, 1);
      const offset = (page - 1) * limit;

      // 검색 조건 처리
      const stdName = req.query.stdName || '';
      const year = req.query.year || '';
      const term = req.query.term || '';
      const stdJob = req.query.stdJob || '';
      const startDate = req.query.startDate || '';
      const endDate = req.query.endDate || '';

      let whereClause = 'WHERE 1=1';
      const params = [];

      if (stdName) {
        whereClause += ' AND i.stdName LIKE ?';
        params.push(`%${stdName}%`);
      }

      if (year) {
        whereClause += ' AND a.year = ?';
        params.push(year);
      }

      if (term) {
        whereClause += ' AND a.term = ?';
        params.push(term);
      }

      if (stdJob) {
        whereClause += ' AND i.stdJob = ?';
        params.push(stdJob);
      }

      if (startDate) {
        whereClause += ' AND a.workDate >= ?';
        params.push(startDate);
      }

      if (endDate) {
        whereClause += ' AND a.workDate <= ?';
        params.push(endDate);
      }

      // 데이터 총 개수(total) 가져오기
      const [totalRows] = await dbpool.execute(
        `SELECT COUNT(*) as totalCount FROM student_attendance a JOIN student_info i ON a.stdNum = i.stdNum ${whereClause}`,
        params
      );

      const totalCount = totalRows[0].totalCount;
      const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / limit);

      const sql = `SELECT a.id, DATE_FORMAT(a.workDate, '%Y-%m-%d') AS workDate, i.year, i.term, a.startTime, a.endTime, a.note, i.stdName, i.stdJob, i.stdNum 
      FROM student_attendance a JOIN student_info i ON a.stdNum = i.stdNum 
      ${whereClause} ORDER BY a.workDate DESC, a.created_at DESC LIMIT ${offset}, ${limit}`;

      const [rows] = await dbpool.execute(sql, params);
      return res
        .status(200)
        .json({ attendance: rows, totalCount, totalPages, currentPage: page });
    } catch (err) {
      console.error('[/api/attendance.js] GET 에러 : ', err);
      return res.status(500).json({ message: '조회 실패' });
    }
  }

  // 출결 내역 수정(PUT)
  else if (req.method === 'PUT') {
    const { id, workDate, startTime, endTime, note } = req.body;

    if (!id) return res.status(400).json({ message: '출결 ID가 필요합니다.' });

    try {
      const [result] = await dbpool.query(
        `UPDATE student_attendance SET workDate = ?, startTime = ?, endTime = ?, note = ? WHERE id = ?`,
        [workDate, startTime, endTime, note, id]
      );

      res.status(200).json({ message: '출결 수정 성공' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '출결 수정 실패 ', error: err });
    }
  }

  // 출결 내역 삭제(DELETE)
  else if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: '출결 ID가 필요합니다' });

    try {
      const [result] = await dbpool.query(
        `DELETE FROM student_attendance WHERE id = ?`,
        [id]
      );
      res.status(200).json({ message: '출결 삭제 성공!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '출결 삭제 실패 ', error: err });
    }
  } else {
    return res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
