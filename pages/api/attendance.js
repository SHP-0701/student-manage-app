/**
 * 출결 기록 관련 처리
 * REST API 사용(POST, GET, PUT, DELETE)
 */

import dbpool from "@/lib/db";

export default async function handler(req, res) {
  // 출결 등록(POST)
  if (req.method === "POST") {
    try {
      const { stdNum, stdName, workType, date, startTime, endTime, note } =
        req.body;

      if (!stdNum || !date || !stdName)
        return res.status(400).json({ message: "필수 값이 누락되었습니다." });

      const sql =
        "INSERT INTO student_attendance (stdNum, stdName, workDate, startTime, endTime, remark, workType) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        stdNum,
        stdName,
        date,
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
  }

  // 출결 내역 수정(PUT)
  else if (req.method === "PUT") {
  }

  // 출결 내역 삭제(DELETE)
  else if (req.method === "DELETE") {
  } else {
    return res.status(405).json({ message: "허용되지 않은 메서드" });
  }
}
