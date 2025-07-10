/**
 * 로그아웃 실행 시 호출되는 api
 */

export default function handler(req, res) {
  if (req.method === "POST") {
    // 세션 쿠키 초기화
    res.setHeader(
      "Set-Cookie",
      `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly;`
    );
    res.status(200).json({ message: "로그아웃 성공" });
  } else {
    res.status(405).end();
  }
}
