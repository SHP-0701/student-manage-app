/**
 * 시작/종료 시간으로 근로시간 계산(TIME 형식 Return)
 * 점심시간(12:00~13:00) 포함되면 1시간 차감
 * @param {string} start - 'HH:mm:ss' 또는 'HH:mm'
 * @param {string} end - 'HH:mm:ss' 또는 'HH:mm'
 * @returns {string} - 'HH:MM:SS'
 */
export function calculateWorkTime(start, end) {
  if (!start || !end) return '00:00:00';

  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  let startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;

  let diffMinutes = endMinutes - startMinutes;

  const lunchStart = 12 * 60;
  const lunchEnd = 13 * 60;

  if (startMinutes < lunchEnd && endMinutes > lunchStart) diffMinutes -= 60;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:00`;
}

/**
 * 현재년도 및 학기(1학기 / 2학기) return
 * @param {Date} date - 기준 날짜
 * @returns {Object} { year: '2025', term: '1학기 } - '년도', '학기' 배열
 */
export function getYearTerm(date) {
  if (!(date instanceof Date)) {
    throw new Error(
      '[/timeUtils.js] getYearTerm() date param은 Date 객체여야 합니다.'
    );
  }

  // 학기 시작 월 상수 정의(3월 학기 시작)
  const ACADEMIC_YEAR_START_MONTH = 3;

  // 1, 2월인 경우 년도 -1 실시
  let year = date.getFullYear();
  const month = date.getMonth() + 1;

  // 현재 월이 3월보다 작으면 작년도로 취급(2026. 1. => 2025학년도)
  if (month < ACADEMIC_YEAR_START_MONTH) {
    year -= 1;
  }

  let term = '';
  if (month >= ACADEMIC_YEAR_START_MONTH && month <= 8) {
    term = '1학기';
  } else {
    term = '2학기';
  }

  return { year: String(year), term };
}

/**
 * 요일 한글로 포맷하는 함수
 * @param {Date} date - 기준 날짜
 * @returns {String} - ${formatted}
 */
export function formatSelectedDate(date) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  };
  const formatted = new Intl.DateTimeFormat('ko-KR', options).format(date);

  return `${formatted}`;
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

/** "HH:mm -> 분(min)으로 변환" */
function timeToMinutes(timeStr) {
  const [hour, minute] = timeStr.split(':').map(Number);
  return hour * 60 + minute;
}

/** 분(min) -> "HH:mm" 문자열로 변환 */
function minutesToTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * 한국 시간 기준(GMT+9) 'YYYY-MM-DD' 형식 문자열 반환
 * @param {Date}: 변환할 날짜
 * @return {String}: `${year}-${month}-${day}` 문자열
 */
export function getLocalDateString(date) {
  if (!(date instanceof Date)) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * hour, minute 입력받아서 'HH:mm' 형식으로 출력
 * @param {String, String}: 'hour', 'minute'
 * @return {String}: `HH:mm`
 */
export function combineTime(hour, minute) {
  if (hour && minute !== '') {
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  }
  return '';
}
