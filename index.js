'use strict';

let min,sec,timer;
let break_count;
let now_status = 0;
let audio_elm = new Audio();
let work_time,break_time;
let break_min,break_sec;

function get_Start() {
  return document.getElementById('start');
}

function get_Break() {
  return document.getElementById('break');
}

function get_Reset() {
  return document.getElementById('reset');
}

function zeroPadding(num,len){
  return (Array(len).join('0')+num).slice(-len);
}

function remaing_Time() {
  return document.getElementById('count_time');
}

//時間の要素取得が多くなったので引数で指定できる関数化
function need_timer_value(i) {
  if(document.timer.elements[i].value == "") {
    return document.timer.elements[i].value = 0;
  }
  return document.timer.elements[i].value;
}


function Start_count() {

  if(now_status=0){
      get_Reset().disabled = false;
      get_Start().disabled = false;
  }else if(now_status=1){
      get_Reset().disabled = false;
      get_Start().disabled = true;
  }

  min = parseInt(need_timer_value(0));
  sec = parseInt(need_timer_value(1));
 
  work_time = (min*60)+sec;

  let msg = zeroPadding(min,2)+":"+zeroPadding(sec,2);

  remaing_Time().innerHTML = msg;

  timer = setInterval('countDown()', 1000); 
}


function countDown() {
  now_status = 1;
  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';

  if(work_time<=0){
      work_time = 0;
  }else{
    work_time--;
  }

  min = Math.floor(work_time/60); 
  sec = Math.floor(work_time%60);
  
  remaing_Time().innerHTML = zeroPadding(min,2)+":"+zeroPadding(sec,2);


  if (work_time <= 0) {
    clearInterval(timer);
    now_status = 0;
    get_Start().disabled = false;
    get_Break().disabled = false;
    audio_elm.play();
  }
}


function move_Break() {

   break_min = parseInt(need_timer_value(2));
   break_sec = parseInt(need_timer_value(3));

   break_time = (break_min*60)+break_sec;
    remaing_Time().innerText = zeroPadding(break_min,2)+":"+zeroPadding(break_sec,2);
    audio_elm.pause();
    audio_elm.currentTime = 0;

   if(now_status==1){
      get_Start().disabled = false;
      get_Break().disabled = false;  
    }else if(now_status==0){
      get_Start().disabled = true;
      get_Break().disabled = true;
    }

    timer = setInterval('Breaktime()', 1000);
}


function Breaktime() {

  now_status = 1;

  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';

  if(break_time<=0){
    break_time = 0;  
  }else{
    break_time--;
  }  

  let count_break_min = Math.floor(break_time/60);  
  let count_break_sec = Math.floor(break_time%60);

  remaing_Time().innerText = zeroPadding(count_break_min,2)+":"+zeroPadding(count_break_sec,2);
  if (break_time <= 0) {
    clearInterval(timer);
    audio_elm.play();
  }
}

function force_reSet() {
  if (now_status == 1) {
    clearInterval(timer);
    remaing_Time().innerText = work_time = "00:00";
    get_Start().disabled = false;
    get_Break().disabled = get_Reset().disabled = true;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }

  if (now_status == 0) {
    clearInterval(timer);
    remaing_Time().innerText = break_time = 0;
    get_Break().disabled = true;
    get_Start().disabled = false;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }
}
