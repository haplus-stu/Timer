'use strict';
import * as Preset from './preset.js';


// Time
let min, sec, timer;
let work_time, break_time;
let break_min, break_sec;
let countCycle = 1;

// status
const None = 0;
const Focus = 1;
const Break = 2;
const BREAK_TITLE = 'Focusaid[休憩]';
const FOCUS_TITLE = 'Focusaid[集中]';
const NOT_RUUNING = 0;
const RUUNING = 1;

let stat = None;
let now_status = 0;

// preset
let audio_elm = new Audio();

// other
let i;
let cnt = 0;

needElement('disp_pattern').addEventListener('click',Preset.togglePresetElm);
needElement('save_pattern').addEventListener('click',Preset.savePattern);
needElement('use_btn').addEventListener('click',Preset.setPresetValue);

window.addEventListener('load',()=>{
Preset.init(),
Push.Permission.request()
});

function startCount() {

  if (now_status = NOT_RUUNING) {
    needElement('reset').disabled = false;
    needElement('start').disabled = false;
  } else if (now_status = RUUNING) {
    needElement('reset').disabled = false;
    needElement('start').disabled = true;
  }

  min = parseInt(needTimerValue(0));
  sec = parseInt(needTimerValue(1));

  work_time = min * 60 + sec;

  let msg = zeroPadding(min, 2) + ':' + zeroPadding(sec, 2);

  remaingTime().innerHTML = msg;
  document.title = FOCUS_TITLE;

  timer = setInterval('countDown()', 1000);
}

function countDown() {
  stat = Focus;
  console.log(`now stat: ${stat}`);
  now_status = RUUNING;
  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';

  if (work_time <= 0) {
    work_time = 0;
    stat = Break;
  } else {
    work_time--;
  }

  min = Math.floor(work_time / 60);
  sec = Math.floor(work_time % 60);

  remaingTime().innerHTML = zeroPadding(min, 2) + ':' + zeroPadding(sec, 2);

  if (work_time <= 0) {
    stat = Break;

    document.title = 'Focusaid';
    clearInterval(timer);

    now_status = NOT_RUUNING;
    needElement('start').disabled = false;
    needElement('break').disabled = false;

    if (countCycle == 3) {
      countCycle = 0;
      //プッシュ通知
      Preset.sendPushNotification(
          '集中サイクル終了！',
          '長めの休憩を取ってリフレッシュ！次に備えましょう！');
    } else {
      countCycle++;
      Preset.sendPushNotification(
          '集中フェーズ終了！', '休憩を取ってリフレッシュ！次に備えましょう！');
    }
    audio_elm.play();
  }
}

function moveBreak() {
  break_min = parseInt(needTimerValue(2));
  break_sec = parseInt(needTimerValue(3));

  break_time = break_min * 60 + break_sec;
  remaingTime().innerText =
      zeroPadding(break_min, 2) + ':' + zeroPadding(break_sec, 2);
  audio_elm.pause();
  audio_elm.currentTime = 0;

  if (now_status == RUUNING) {
    needElement('start').disabled = false;
    needElement('break').disabled = false;
  } else if (now_status == NOT_RUUNING) {
    needElement('start').disabled = true;
    needElement('break').disabled = true;
  }
  document.title = BREAK_TITLE;

  timer = setInterval('breakTime()', 1000);
}

function breakTime() {
  stat = Break;
  now_status = 1;

  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';

  if (break_time <= 0) {
    break_time = 0;
  } else {
    break_time--;
  }

  let count_break_min = Math.floor(break_time / 60);
  let count_break_sec = Math.floor(break_time % 60);

  remaingTime().innerText =
      zeroPadding(count_break_min, 2) + ':' + zeroPadding(count_break_sec, 2);
  if (break_time <= 0) {

    stat = Focus;
    clearInterval(timer);

    // Push通知
    sendPushNotification('休憩フェーズ終了', '次も頑張りましょう！');

    audio_elm.play();

    needElement('start').disabled = false;
    needElement('break').disabled = true;
    needElement('reset').disabled = true;

    document.title = 'Focusaid';
  }
}

function forceReset() {
  if (now_status == 1) {
    clearInterval(timer);

    remaingTime().innerText = work_time = '00:00';

    needElement('start').disabled = false;
    needElement('break').disabled = true;
    needElement('reset').disabled = true;

    audio_elm.pause();
    audio_elm.currentTime = 0;
  }

  if (now_status == NOT_RUUNING) {
    clearInterval(timer);

    remaingTime().innerText = break_time = '00:00';

    needElement('break').disabled = true;
    needElement('start').disabled = false;

    audio_elm.pause();
    audio_elm.currentTime = 0;
  }
  document.title = 'Focusaid';
}

//Leave site confirm
window.onbeforeunload = function(e) {
  if (now_status == RUUNING) {
    e.preventDefault();
    return '';
  }
};

//keyboard shortcuts
shortcut.add("Alt+s",function(){
  console.log(`now stat: ${stat}`);
  if(stat == None || stat == Focus){
    startCount();
  }else if( stat == Break){
    moveBreak();
  }
});
