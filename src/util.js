function needElement(elem_name) {
  return document.getElementById(elem_name);
}

function zeroPadding(num, len) {
  return (Array(len).join('0') + num).slice(-len);
}

function remaingTime() {
  return document.getElementById('count_time');
}

//時間の要素取得が多くなったので引数で指定できる関数化
function needTimerValue(i) {
  if (document.timer.elements[i].value == '') {
    return (document.timer.elements[i].value = 0);
  }
  return document.timer.elements[i].value;
}
