/**
 * 근로변경사항 백엔드 API
 * /api/schedule.js 랑 같이 써볼까 했는데 괜히 더 헷갈릴거 같아 별도의 api로 분리함.
 */

import dbpool from '@/lib/db';

export default async function handler(req, res) {
  // 등록(POST)
  if (req.method === 'POST') {
    // 프론트에서 넘어온 req.body(param)
  }
}
