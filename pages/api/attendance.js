/**
 * 출결 기록 관련 처리
 * REST API 사용(POST, GET, PUT, DELETE)
 */

import dbpool from "@/lib/db";

export default async function handler(req, res) {
  // 출결 등록(POST)
  if (req.method === "POST") {
    try {
      console.log("[/api/attendance.js] 출결 등록 api 호출");
      const { stdNum, stdName, workType, workDate, startTime, endTime, note } =
        req.body;
      console.log("출결 등록 데이터 요청값: ", req.body);
      if (!stdNum || !workDate || !stdName)
        return res.status(400).json({ message: "필수 값이 누락되었습니다." });

      const sql =
        "INSERT INTO student_attendance (stdNum, stdName, workDate, startTime, endTime, remark, workType) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        stdNum,
        stdName,
        workDate,
        startTime,
        endTime,
        note,
        workType,
      ];

      await dbpool.execute(sql, values);

      return res.status(200).json({ message: "학생 출결 등록 성공" });
    } catch (err) {
      console.error("[/api/attendance.js] POST 에러 : ", err);
      return res.status(500).json({ message: "서버 오류 발생" });
    }
  }

  // 출결 내역 조회(GET)
  else if (req.method === "GET") {
    try {
      const { stdName, year, term, workType, stdJob, startDate, endDate } =
        req.query;

      let conditions = []; // 검색 조건
      let params = [];

      if (stdName) {
        conditions.push("s.stdName LIKE ?");
        params.push(`%${stdName}`);
      }

      if (year) {
        conditions.push("s.year = ?");
        params.push(year);
      }

      if (term) {
        conditions.push("s.term = ?");
        params.push(term);
      }

      if (workType) {
        conditions.push("a.workType = ?");
        params.push(workType);
      }

      if (stdJob) {
        conditions.push("s.stdJob = ?");
        params.push(stdJob);
      }

      if (startDate) {
        conditions.push("a.workDate >= ?");
        params.push(startDate);
      }

      if (endDate) {
        conditions.push("a.workDate <= ?");
        params.push(endDate);
      }

      const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

      const sql = `SELECT a.id, a.workDate, a.workType, a.startTime, a.endTime, a.remark, s.stdName, s.stdJob, s.stdNum FROM student_attendance a JOIN student_info s ON a.stdNum = s.stdNum ${whereClause} ORDER BY a.workDate DESC`;
      const [rows] = await dbpool.execute(sql, params);
      return res.status(200).json({ attendance: rows });
    } catch (err) {
      console.error("[/api/attendance.js] GET 에러 : ", err);
      return res.status(500).json({ message: "조회 실패" });
    }
  }

  // 출결 내역 수정(PUT)
  else if (req.method === "PUT") {
    const {
      id,
      workDate,
      workType,
      stdJob,
      stdName,
      stdNum,
      startTime,
      endTime,
      note,
    } = req.body;

    if (!id) return res.status(400).json({ message: "출결 ID가 필요합니다." });

    try {
      const [result] = await dbpool.query(
        `UPDATE student_attendance SET workDate = ?, workType = ?, stdName = ?, stdNum = ?, startTime = ?, endTime = ?, remark = ? WHERE id = ?`,
        [workDate, workType, stdName, stdNum, startTime, endTime, note, id]
      );

      res.status(200).json({ message: "출결 수정 성공" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "출결 수정 실패 ", error: err });
    }
  }

  // 출결 내역 삭제(DELETE)
  else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "출결 ID가 필요합니다" });

    try {
      const [result] = await dbpool.query(
        `DELETE FROM student_attendance WHERE id = ?`,
        [id]
      );
      res.status(200).json({ message: "출결 삭제 성공!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "출결 삭제 실패 ", error: err });
    }
  } else {
    return res.status(405).json({ message: "허용되지 않은 메서드" });
  }
}
