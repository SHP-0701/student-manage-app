/**
 * 시작/종료 시간으로 근로시간 계산
 * 점심시간(12:00~13:00) 포함되면 1시간 차감
 * @param {string} start - 'HH:mm'
 * @param {string} end - 'HH:mm'
 * @returns {string} - '0시간 0분'
 */

export function getWorkHours(start, end) {
  if (!start || !end) return '-';

  const [sh, sm] = start.split(':').map(Number); // 시작 시간 쪼개기
  const [eh, em] = end.split(':').map(Number); // 종료 시간 쪼개기

  let startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;

  let diffMinutes = endMinutes - startMinutes;

  const lunchStart = 12 * 60;
  const lunchEnd = 13 * 60;

  if (startMinutes < lunchEnd && endMinutes > lunchStart) diffMinutes -= 60;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours} 시간 ${minutes} 분`;
}

/**
 * 현재년도 및 학기(1학기 / 2학기) return 해줌
 * @param {Date} date - 기준 날짜
 * @returns {Object} { year: '2025', term: '1학기 } - '년도', '학기' 배열
 */

export function getYearTerm(date) {
  if (!(date instanceof Date))
    throw new Error(
      '[/timeUtils.js] getYearTerm() date param은 Date 객체여야 합니다.'
    );

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  let term = '';
  if (month >= 3 && month <= 8) {
    term = '1학기';
  } else {
    term = '2학기';
  }

  return { year: String(year), term };
}

/**
 * 요일 한글로 포맷하는 함수
 * @param {Date} date - 기준 날짜
 * @returns {String} - ${formatted} 근로시간표입니다.
 */
export function formatSelectedDate(date) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  };
  const formatted = new Intl.DateTimeFormat('ko-KR', options).format(date);

  return `${formatted} 근로시간표입니다.`;
}

/**
 * 요일 한글로 포맷(0 = 일, 1 = 월, 2 = 화... 6 = 토)
 * @param {Date} - 선택된 날짜
 * @return {Stirng} - 선택된 날짜의 요일 문자열
 */

export function getKoreanDayName(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}
