import { simpleDateTimeFormat } from "./SimpleDateTimeFormat";

export const elapsedText = (date: any) => {
  // 초 (밀리초)
  const seconds = 1;
  // 분
  const minute = seconds * 60;
  // 시
  const hour = minute * 60;
  // 일
  const day = hour * 24;

  let today = new Date();
  let elapsedTime = Math.trunc((today.getTime() - date.getTime()) / 1000);

  let elapsedText = "";
  if (elapsedTime < minute) {
    elapsedText = "방금 전";
  } else if (elapsedTime < hour) {
    elapsedText = Math.trunc(elapsedTime / minute) + "분 전";
  } else if (elapsedTime < day) {
    elapsedText = Math.trunc(elapsedTime / hour) + "시간 전";
  } else if (elapsedTime < day * 15) {
    elapsedText = Math.trunc(elapsedTime / day) + "일 전";
  } else {
    elapsedText = simpleDateTimeFormat(date, "yyyy.M.d");
  }

  return elapsedText;
};
