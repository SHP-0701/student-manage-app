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

/**
 * 연속된 시간대들을 병합하는
 * @param {string[]} ranges - "HH:mm ~ HH:mm" 형식의 시간 문자열 배열
 * @returns {string[]} - 병합된 시간대 배열 "09:00~10:00", "10:00~11:00" -> "09:00~11:00"
 */
export function mergeWorkTime(ranges) {
  if (!ranges || ranges.length === 0) return;

  // 중복 제거
  const unique = Array.from(new Set(ranges));

  // 문자열을 '분' 단위 숫자로 parse -> "09:00~10:00" = { start: 540, end: 600 }
  const parsed = unique.map((range) => {
    const [start, end] = range.split('~');
    return {
      start,
      end,
      startMin: timeToMinutes(start),
      endMin: timeToMinutes(end),
    };
  });

  // 시작 시간 기준으로 정렬
  parsed.sort((a, b) => a.startMin - b.startMin);
  const merged = [];

  // 순차적 비교하면서 연속된 시간대 병합
  for (let i = 0; i < parsed.length; i++) {
    const current = parsed[i]; // 현재 시간대

    if (merged.length === 0) {
      merged.push({ ...current });
    } else {
      const last = merged[merged.length - 1];

      if (last.endMin === current.startMin) {
        // 연속되면 병합
        last.end = current.end;
        last.endMin = current.endMin;
      } else {
        merged.push({ ...current });
      }
    }
  }

  // "HH:mm ~ HH:mm" 형식으로 변환
  return merged.map(({ start, end }) => `${start}~${end}`);
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
