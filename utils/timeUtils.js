/**
 * 시작/종료 시간으로 근로시간 계산
 * 점심시간(12:00~13:00) 포함되면 1시간 차감
 * @param {string} start - 'HH:mm'
 * @param {string} end - 'HH:mm'
 * @returns {string} - '0시간 0분'
 */

export function getWorkHours(start, end) {
  if (!start || !end) return "-";

  const [sh, sm] = start.split(":").map(Number); // 시작 시간 쪼개기
  const [eh, em] = end.split(":").map(Number); // 종료 시간 쪼개기

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
