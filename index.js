'use strict';

var work_time = 0; 
var break_time = 300;　//test sec 2 true sec 300
var nowStatus = 0;
var timer;
var break_count;
var audio_elm = new Audio();

function cntStart() {
  document.getElementById("reset").disabled = false;
  document.getElementById("start").disabled = true;
  work_time = 1500;//test sec 5 //true sec 1500
  //document.getElementById("break").disabled= true;
  document.getElementById("timer").innerText =  work_time; 
  timer = setInterval("countDown()",1000);
}

function countDown() {
  nowStatus = 1;
  audio_elm.src = "カービィすぎて原曲が伝わらない「大きな古時計」.mp3"

  work_time --;
  document.getElementById("timer").innerText =  work_time; 
  if(work_time<=0){
    document.getElementById("break").disabled= false;
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
  break_time=2;
  document.getElementById("timer").innerText = break_time;
  document.getElementById("start").disabled=true;
  audio_elm.pause();
  audio_elm.currentTime = 0;
  break_count = setInterval("Breaktime()",1000);
  console.log("succusess!"); 
}

function break_reSet() {
  clearInterval(break_count);
  document.getElementById("start").disabled= false;
  console.log("succsess!");
}

function Breaktime() {
  nowStatus = 0;
  audio_elm.src = "カービィすぎて原曲が伝わらない「大きな古時計」.mp3"
  break_time --;
  document.getElementById("timer").innerText = break_time;
  if(break_time <= 0){
    break_reSet();
    audio_elm.play();
  }
}

  function force_reSet() {
    if(nowStatus==1){
      clearInterval(timer);
      document.getElementById("timer").innerText= work_time=0;
      document.getElementById("start").disabled = false;
      document.getElementById("break").disabled = true;
      document.getElementById("reset").disabled = true;
      audio_elm.pause();
      audio_elm.currentTime = 0;
      }
    
      if(nowStatus== 0){
        clearInterval(break_count);
        document.getElementById("timer").innerText= break_time=0;
        document.getElementById("break").disabled = true;
        document.getElementById("start").disabled = false;
        audio_elm.pause();
        audio_elm.currentTime = 0;
      }
  }
