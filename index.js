'use strict';

let work_time = 0;
let now_status = 0;
let break_time;
let timer;
let break_count;
let audio_elm = new Audio();
let break_min,break_sec;
let min;
let sec;

function get_min() {
 if(document.timer.elements[0].value == ""){
    document.timer.elements[0].value = "0";
  }
  return document.timer.elements[0].value;
}

function get_sec(){
  if(document.timer.elements[1].value == ""){
    document.timer.elements[1].value = "0";
  }
  return document.timer.elements[1].value;
}

function get_break_min() {
  if(document.timer.elements[2].value == ""){
    document.timer.elements[2].value = "0";
  }
  return document.timer.elements[2].value;
}

function get_break_sec(){
  if(document.timer.elements[3].value == ""){
    document.timer.elements[3].value = "0";
  }
  return document.timer.elements[3].value;
}

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

//スタートボタンが押されたとき
function Start_count() {

  min = parseInt(get_min());
  sec = parseInt(get_sec()); 

	
  get_Reset().disabled = false;
  get_Start().disabled = true;
  work_time = (min*60)+sec;

  let msg = zeroPadding(min,2)+":"+zeroPadding(sec,2);
  remaing_Time().innerHTML = msg;

  timer = setInterval('countDown()', 1000);
}


function countDown() {
  now_status = 1;
  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';

  if(work_time<=0){
    work_time=0;
  }else{
    work_time--;
  }

  min = Math.floor(work_time/60); 
  sec = Math.floor(work_time%60);
  
  remaing_Time().innerHTML = zeroPadding(min,2)+":"+zeroPadding(sec,2);


  if (work_time <= 0) {
    clearInterval(timer);
    get_Break().disabled = false;
    audio_elm.play();
  }
}


function move_Break() {
   break_min = parseInt(get_break_min());
   break_sec = parseInt(get_break_sec());
   break_time = break_min*60+break_sec;
    remaing_Time().innerText = zeroPadding(break_min,2)+":"+zeroPadding(break_sec,2);
    get_Start().disabled = true;
    audio_elm.pause();
    audio_elm.currentTime = 0;
    break_count = setInterval('Breaktime()', 1000);
}

function break_reSet() {
  clearInterval(break_count);
  get_Start().disabled = false;
}

function Breaktime() {
  now_status = 0;

  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';
  break_time--;
  
  let count_break_min = Math.floor(break_time/60);  
  let count_break_sec = Math.floor(break_time%60);

  remaing_Time().innerText = zeroPadding(count_break_min,2)+":"+zeroPadding(count_break_sec,2);
  if (break_time <= 0) {
    break_reSet();
    audio_elm.play();
  }
}

function force_reSet() {
  if (now_status == 1) {
    clearInterval(timer);
    remaing_Time().innerText = work_time = "00:00";
    get_Start().disabled = false;
    get_Break().disabled = true;
    get_Reset().disabled = true;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }

  if (now_status == 0) {
    clearInterval(break_count);
    remaing_Time().innerText = break_time = 0;
    get_Break().disabled = true;
    get_Start().disabled = false;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }
}
