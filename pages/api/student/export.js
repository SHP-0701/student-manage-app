/*
  ===================================================================================================
    ○ 작성일자: 2026. 03. 18.(수)
    ○ API명: /pages/api/student/export.js
    ○ 내용: 학생정보 관리 페이지에서 학생목록 다운로드(내보내기) 담당 API
    ○ 작성자: 박수훈(shpark)
  ===================================================================================================
*/

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: '허용되지 않은 메서드' });

  // 프론트에서 쿼리스트링으로 보낸 검색 조건 받기
  const { year, term } = req.query;

  try {
    // AND 조건 동적 검색을 위한 꼼수
    let sql = `SELECT * FROM student_info WHERE 1=1`;
    const params = [];

    if (year) {
      sql += ` AND year = ?`;
      params.push(year);
    }

    if (term) {
      sql += ` AND term = ?`;
      params.push(term);
    }

    // 최신 등록 순 정렬
    sql += ` ORDER BY id DESC`;

    const [rows] = await dbpool.query(sql, params);

    return res.status(200).json({
      success: true,
      students: rows,
    });
  } catch (e) {
    console.error(
      `[/api/student/export.js] 엑셀 내보내기(다운로드) 데이터 조회 오류: `,
      e,
    );
    return res.status(500).json({
      message: '엑셀 데이터 조회 중 오류 발생',
    });
  }
}
