/**
 * 학생 정보 등록/수정/삭제 등등 처리
 * [REST API]
 * method: 등록(POST), 수정(PUT), 조회(GET), 삭제(DELETE)
 * props: 등록(insert), 수정(modify)
 */

import dbpool from '@/lib/db';
export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    try {
      const { year, term, stdName, stdNum, stdDept, workType, stdJob } =
        req.body;

      // 간단한 유효성 검사
      if (!year || !stdNum || !stdName) {
        return res.status(400).json({ message: '필수 항목 누락됨.' });
      }

      const sql =
        'INSERT INTO student_info (year, term, stdName, stdNum, stdDept, workType, stdJob) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [year, term, stdName, stdNum, stdDept, workType, stdJob];
      const [result] = await dbpool.execute(sql, values);

      return res.status(200).json({ message: '학생 정보 등록 성공' });
    } catch (err) {
      console.error('[/api/student.js] POST 에러 ', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }
  }

  // 목록 가져오기(GET)
  else if (req.method === 'GET') {
    try {
      // 쿼리 파라미터 읽기
      const page = Math.max(parseInt(req.query.page) || 1, 1); // 기본값: 1
      const limit = Math.max(parseInt(req.query.limit) || 5, 1); // 기본값: 5
      const offset = (page - 1) * limit;

      const searchName = req.query.name || '';
      const searchYear = req.query.year || '';
      const searchTerm = req.query.term || '';
      const searchWorkType = req.query.workType || '';
      const searchStdJob = req.query.stdJob || '';

      // 조건 만들기
      let whereClause = 'WHERE 1=1';
      const params = [];

      if (searchYear) {
        whereClause += ' AND year = ?';
        params.push(searchYear);
      }

      if (searchTerm) {
        whereClause += ' AND term = ?';
        params.push(searchTerm);
      }

      if (searchWorkType) {
        whereClause += ' AND workType = ?';
        params.push(searchWorkType);
      }

      if (searchStdJob) {
        whereClause += ' AND stdJob = ?';
        params.push(searchStdJob);
      }

      if (searchName) {
        whereClause += ' AND stdName LIKE ?';
        params.push(`%${searchName}%`);
      }

      // 총 개수 가져오기
      const [countRows] = await dbpool.execute(
        `SELECT COUNT(*) AS totalCount FROM student_info ${whereClause}`,
        params
      );
      const totalCount = countRows[0].totalCount;

      // 총 페이지 최소 1 보장
      const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / limit);

      // 데이터 가져오기
      const sql = `
      SELECT id, year, term, stdName, stdNum, stdDept, workType, stdJob, created_at 
      FROM student_info  
      ${whereClause}
      ORDER BY created_at DESC LIMIT ${offset}, ${limit}
      `;

      const [rows] = await dbpool.execute(sql, params);

      return res.status(200).json({
        students: rows,
        totalCount,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error('[/api/student.js] GET 에러 ', error);
      return res.status(500).json({ message: '학생 목록 조회 실패' });
    }
  }

  // 학생 정보 수정하기(PUT)
  else if (req.method === 'PUT') {
    try {
      const { id, year, term, stdName, stdNum, stdDept, workType, stdJob } =
        req.body;

      if (!id) return res.status(400).json({ message: '학생 ID가 없습니다.' });

      const sql =
        'UPDATE student_info SET year = ?, term = ?, stdName = ?, stdNum = ?, stdDept = ?, workType = ?, stdJob = ? WHERE id = ?';
      const values = [
        year,
        term,
        stdName,
        stdNum,
        stdDept,
        workType,
        stdJob,
        id,
      ];
      await dbpool.execute(sql, values);

      return res.status(200).json({ message: '학생 정보 수정 성공' });
    } catch (error) {
      console.error('[/api/student.js] PUT 에러 ', error);
      return res.status(500).json({ message: '수정 오류 발생' });
    }
  }

  // 학생 정보 삭제(DELETE)
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: '학생 ID가 없습니다.' });

      await dbpool.execute('DELETE FROM student_info WHERE id = ?', [id]);
      return res.status(200).json({ message: '학생 정보 삭제 완료' });
    } catch (error) {
      console.error('[/api/student.js] DELETE 에러 ', error);
      return res.status(500).json({ message: '삭제 오류 발생' });
    }
  }

  // 허용 안 된 메서드
  else {
    return res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
