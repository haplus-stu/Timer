'use strict';

let min,sec,timer;
let break_count;
let key_name;
let now_status = 0;
let i ; 
let cnt = 0;
let audio_elm = new Audio();
let work_time,break_time;
let break_min,break_sec;
let pelm = document.getElementById('preset');			

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

//プリセット表示関数
//プリセット名表示まで完了
window.onload = function(){
	if(localStorage.length > 0){
		for(i=0;i < localStorage.length-1; i++){
      key_name = localStorage.key(i);
			let jsonObj = localStorage.getItem(key_name);
			let jsObj = JSON.parse(jsonObj);

			const liEl = document.createElement('li');
			const read_liEl_value = this.document.createElement('button');
			read_liEl_value.textContent='読み出し';
			read_liEl_value.setAttribute('onclick','set_preset_value(this)');
      read_liEl_value.setAttribute('value',i);
      
      const remove_liEl_value = this.document.createElement('button');
			remove_liEl_value.textContent='削除';
			remove_liEl_value.setAttribute('onclick','remove_preset(this)');
      remove_liEl_value.setAttribute('value',i);
      

			liEl.textContent = key_name+':'+'集中時間 :'+jsObj.work_min/60+'分'+jsObj.work_sec+'秒'+' 休憩時間 :'+jsObj.break_min/60+'分'+jsObj.break_sec+'秒'; 
			pelm.appendChild(liEl);
      liEl.appendChild(read_liEl_value);
      liEl.appendChild(remove_liEl_value);

			//console.log(cnt);
			//console.log(key_name);
			//console.log(jsObj);
			//console.log(liEl);
			
		}
	}
}

//時間の要素取得が多くなったので引数で指定できる関数化
function need_timer_value(i) {
  if(document.timer.elements[i].value == "") {
    return document.timer.elements[i].value = 0;
  }
  return document.timer.elements[i].value;
}



function save_pattern(){
  let preset_name = window.prompt('プリセット名を入力してください','無題のプリセット');
  let w_min = window.prompt('集中したい分数を入力してください','0');
  let w_sec = window.prompt('集中したい秒数を入力してください','0');
  let b_min = window.prompt('休憩したい分数を入力してください','0');
  let b_sec = window.prompt('休憩したい秒数を入力してください','0');

	let time_pattern= {
       work_min: parseInt(w_min)*60,
       work_sec: parseInt(w_sec),
       break_min: parseInt(b_min)*60,
       break_sec: parseInt(b_sec),
	};

	let obj = JSON.stringify(time_pattern);

	localStorage.setItem(preset_name,obj);
	location.reload();

//	console.log(time_pattern);
//	console.log(obj_name);
}



function set_preset_value(btn){

	key_name = localStorage.key(btn.value);
	let jsonObj = localStorage.getItem(key_name);
	let jsObj = JSON.parse(jsonObj);


	document.timer.elements[0].value = jsObj.work_min/60;
	document.timer.elements[1].value = jsObj.work_sec;
	document.timer.elements[2].value = jsObj.break_min/60;
	document.timer.elements[3].value = jsObj.break_sec;
}

function remove_preset(btn){
	key_name = localStorage.key(btn.value);
  localStorage.removeItem(key_name);
  location.reload();
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
	remaing_Time().innerText = break_time ="00:00";
    get_Break().disabled = true;
    get_Start().disabled = false;
    audio_elm.pause();
    audio_elm.currentTime = 0;
  }
}

