'use strict';

let work_time = 0;
let break_time = 300; //test sec 2 true sec 300
let now_status = 0;
let timer;
let break_count;
let audio_elm = new Audio();
let min;
let sec;

function getmin() {
  return document.min.elements[0].value;
}

function getsec(){
  if(document.timer.elements[1].value == ""){
    document.timer.elements[1].value = "0";
  }
  return document.timer.elements[1].value;
}

function getStart() {
  return document.getElementById('start');
}

function getBreak() {
  return document.getElementById('break');
}

function getReset() {
  return document.getElementById('reset');
}

function zeroPadding(num,len){
  return (Array(len).join('0')+num).slice(-len);
}

function remaingTime() {
  return document.getElementById('count_time');
}

//スタートボタンが押されたとき
function cntStart() {
	
  getReset().disabled = false;
  getStart().disabled = true;
  work_time = 1500; //test sec 5 //true sec 1500

  let disp_min = work_time/60;
  let disp_sec = work_time%60;

  let msg = disp_min+":"+zeroPadding(disp_sec,2);
  remaingTime().innerHTML = msg;

  timer = setInterval('countDown()', 1000);
}


function countDown() {
  now_status = 1;
  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';

  work_time--;

  //getTimer().innerText = work_time;
  min = Math.floor(work_time/60)%60; 
  
  sec = Math.floor(work_time%60);
  
  remaingTime().innerHTML = zeroPadding(min,2)+":"+zeroPadding(sec,2);



  if (work_time <= 0) {
    getBreak().disabled = false;
    reSet();
    audio_elm.play();
    audio_elm.loop();
  }
}

function reSet() {
  clearInterval(timer);
  work_time = 0;
}

function move_Break() {
  break_time = 300;
  let break_min = Math.floor(break_time/60);
  let break_sec = Math.floor(break_time%60);
  remaingTime().innerText = break_min+":"+break_sec;
  getStart().disabled = true;
  audio_elm.pause();
  audio_elm.currentTime = 0;
  break_count = setInterval('Breaktime()', 1000);
  console.log('succusess!');
}

function break_reSet() {
  clearInterval(break_count);
  getStart().disabled = false;
  console.log('succsess!');
}

function Breaktime() {
  now_status = 0;
  audio_elm.src = 'Clock-Alarm03-01(Loop).mp3';
  break_time--;
  let break_min = Math.floor(break_time/60);
  let break_sec = Math.floor(break_time%60);
  remaingTime().innerText = break_min+":"+zeroPadding(break_sec,2);
  if (break_time <= 0) {
    break_reSet();
    audio_elm.play();
  }
}

function force_reSet() {
  if (now_status == 1) {
    clearInterval(timer);
    remaingTime().innerText = work_time = 0;
    getStart().disabled = false;
    getBreak().disabled = true;
    getReset().disabled = true;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }

  if (now_status == 0) {
    clearInterval(break_count);
    remaingTime().innerText = break_time = 0;
    getBreak().disabled = true;
    getStart().disabled = false;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }
}
