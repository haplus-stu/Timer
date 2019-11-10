'use strict';

let work_time = 0; 
let break_time = 300;//test sec 2 true sec 300
let now_status = 0;
let timer;
let break_count;
let audio_elm = new Audio();


function getTimer() {
  return document.getElementById("timer");
}

function getStart() {
  return document.getElementById("start");
}

function getBreak() {
  return   document.getElementById("break");
}

function getReset() {
  return document.getElementById("reset");
}

function cntStart() {
  getReset().disabled = false;
  getStart().disabled = true;
  work_time = 1500;//test sec 5 //true sec 1500
  getTimer().innerText =  work_time; 
  timer = setInterval("countDown()",1000);
}

function countDown() {
  now_status = 1;
  audio_elm.src = "Clock-Alarm03-01(Loop).mp3"

  work_time --;
  getTimer().innerText =  work_time; 
  if(work_time<=0){
    getBreak().disabled= false;
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
  break_time=300;
  getTimer().innerText = break_time;
  getStart().disabled=true;
  audio_elm.pause();
  audio_elm.currentTime = 0;
  break_count = setInterval("Breaktime()",1000);
  console.log("succusess!"); 
}

function break_reSet() {
  clearInterval(break_count);
  getStart().disabled= false;
  console.log("succsess!");
}

function Breaktime() {
  now_status = 0;
  audio_elm.src = "Clock-Alarm03-01(Loop).mp3"
  break_time --;
 getTimer().innerText = break_time;
  if(break_time <= 0){
    break_reSet();
    audio_elm.play();
  }
}

  function force_reSet() {
    if(now_status==1){
      clearInterval(timer);
      getTimer().innerText= work_time=0;
      getStart().disabled = false;
      getBreak().disabled = true;
      getReset().disabled = true;
      audio_elm.pause();
      audio_elm.currentTime = 0;
      }
    
      if(now_status== 0){
        clearInterval(break_count);
        getTimer().innerText= break_time=0;
        getBreak().disabled = true;
        getStart().disabled = false;
        audio_elm.pause();
        audio_elm.currentTime = 0;
      }


  }
