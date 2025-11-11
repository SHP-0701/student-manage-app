/*
 *********************************************************************
 * ▢ 작성일자: 2025. 11. 10.(월)
 * ▢ API명: export.js(출결기록 엑셀 내보내기)
 * ▢ 주요기능: 출결 기록 내 필터 조회된 내용을 엑셀(.xlsx)로 내보냄(exceljs 라이브러리 활용)
 * ▢ 작성자: 박수훈
 *********************************************************************
 */

import ExcelJS from 'exceljs';
import dbpool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: '허용되지 않은 메서드' });

  try {
    // 쿼리 파라미터에서 필터 조건 가져오기
    const { year, term, workType, stdJob, stdName, startDate, endDate } =
      req.query;

    // SQL Query 생성(조건부 필터링)
    let sql = `SELECT workDate, workType, stdJob, stdName, stdNum, startTime, endTime, totalWorkTime FROM student_attendance WHERE 1=1`;
    const params = [];

    if (year) {
      sql += ` AND year = ?`;
      params.push(year);
    }
    if (term) {
      sql += ` AND term = ?`;
      params.push(term);
    }
    if (workType) {
      sql += ` AND workType = ?`;
      params.push(workType);
    }
    if (stdJob) {
      sql += ` AND stdJob = ?`;
      params.push(stdJob);
    }
    if (stdName) {
      sql += ` AND stdName LIKE ?`;
      params.push(`%${stdName}%`);
    }
    if (startDate) {
      sql += ` AND workDate >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND workDate <= ?`;
      params.push(endDate);
    }

    sql += ` ORDER BY workDate DESC, startTime ASC`;

    // 데이터 조회 실시
    const [rows] = await dbpool.execute(sql, params);

    if (rows.length === 0)
      return res.status(404).json({ message: '내보낼 데이터가 없습니다' });

    // 엑셀 워크북 생성
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('출결 기록');

    // 엑셀 헤더 설정
    worksheet.columns = [
      { header: '근로날짜', key: 'workDate', width: 15 },
      { header: '근로구분', key: 'workType', width: 20 },
      { header: '담당업무', key: 'stdJob', width: 15 },
      { header: '이름', key: 'stdName', width: 12 },
      { header: '학번', key: 'stdNum', width: 12 },
      { header: '시작시간', key: 'startTime', width: 12 },
      { header: '종료시간', key: 'endTime', width: 12 },
      { header: '총근로시간', key: 'totalWorkTime', width: 15 },
    ];

    // 헤더(header) 스타일링
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }, // 파란색 배경
    };
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getRow(1).height = 25;

    // 엑셀 워크시트에 데이터 추가(시간 형식 처리)
    rows.forEach((row) => {
      worksheet.addRow({
        workDate: row.workDate,
        workType: row.workType,
        stdJob: row.stdJob,
        stdName: row.stdName,
        stdNum: row.stdNum,
        startTime: row.startTime?.substring(0, 5) || '', // HH:MM 형식
        endTime: row.endTime?.substring(0, 5) || '',
        totalWorkTime: row.totalWorkTime?.substring(0, 5) || '',
      });
    });

    // 모든 셀 테두리 추가 및 가운데 정렬 실시
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    });

    // 엑셀 파일 버퍼 생성
    const buffer = await workbook.xlsx.writeBuffer();

    // 파일명 생성(현재 날짜 포함)
    const fileName = `출결기록_${new Date().toISOString().split('T')[0]}.xlsx`;

    // 응답 헤더 설정
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );

    // 파일 전송
    return res.send(buffer);
  } catch (err) {
    console.error('[/api/attendance/export.js] 엑셀 내보내기 에러: ', err);
    return res.status(500).json({ message: '엑셀 파일 생성 중 오류 발생' });
  }
}
