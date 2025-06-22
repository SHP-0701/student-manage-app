import dbpool from "@/lib/db";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    // post 요청만 허용
    if(req.method !== 'POST') return res.status(405).json({message: '허용되지 않은 메서드'});

    try {
        const {id, password} = req.body;
        console.log('[/api/login.js] input password: ', password);
        bcrypt.hash(password, 10).then(hash => {
            console.log('[/api/login.js] hashed password: ', hash);
        });

        // id 해당 사용자 정보 찾기
        const [rows] = await dbpool.execute(
            'SELECT * FROM admin_manage WHERE id = ?', [id]
        );

        if (rows.length === 0) return res.status(401).json({message: '존재하지 않는 사용자입니다.'
        });

        const admin = rows[0];

        // 2. 비밀번호 일치 여부 확인
        const result = await bcrypt.compare(password, admin.password);
        console.log('[/api/login.js] 비밀번호 비교 결과: ', result);

        if(!result) return res.status(401).json({message: '아이디 또는 비밀번호가 일치하지 않습니다.'});

        // 3. 로그인 성공
        return res.status(200).json({message: '환영합니다. ' + admin.name} + ' 님');

    } catch(e) {
        console.error('[/api/login.js] 로그인 오류: ', e);
        return res.status(500).json({message: '서버 오류'});
    }
}