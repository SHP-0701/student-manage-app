/**
 * 출결 기록 관련 처리
 * REST API 사용(POST, GET, PUT, DELETE)
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 출결 등록(POST)
  if (req.method === 'POST') {
  }

  // 출결 내역 조회(GET)
  else if (req.method === 'GET') {
  }

  // 출결 내역 수정(PUT)
  else if (req.method === 'PUT') {
  }

  // 출결 내역 삭제(DELETE)
  else if (req.method === 'DELETE') {
  } else {
    return res.status(405).json({ message: '허용되지 않은 메서드' });
  }
}
