import Head from "next/head";
import { useRouter } from "next/router";
import { FaUser, FaLock } from 'react-icons/fa';
import styles from '@/styles/Login.module.css';
import { useState } from "react";
import LoginModal from '@/components/LoginModal';

export default function Home() {
  const router = useRouter();

  const [id, setId ] = useState(''); // id
  const [password, setPassword] = useState(''); // pw
  const [loginFailed, setLoginFailed] = useState(false); // 로그인 실패
  const [errMessage, setErrMessage] = useState(''); // response 에러메시지 저장 state

  // 로그인 submit시 실행
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id, password}),
    });

    // login.js에서 응답받은 데이터
    const data = await res.json();

    if(!res.ok) {
      setErrMessage(data.message);
      setLoginFailed(true);
    } else {
      // 로그인 성공 시 /dashboard 이동
      router.push('/dashboard');
    }
  }

  return (
    <>
      <Head>
        <title>근로학생 관리 시스템 - 로그인</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.title}>
          <h1>근로학생 관리 시스템</h1>
        </div>
        {
          // 로그인 실패 시 모달 렌더링
          loginFailed && (
            <LoginModal message={errMessage} onClose={() => {
              setLoginFailed(false);
              setErrMessage('');
            }} />
          )
        }

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <h2>시스템 로그인</h2>

          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">로그인</button>
        </form>
      </div>
    </>
  );
}