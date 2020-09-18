"use strict";

let min, sec, timer;
let break_count;
let key_name;
let now_status = 0;
let i;
let cnt = 0;
let audio_elm = new Audio();
let work_time, break_time;
let break_min, break_sec;
const BREAK = "ポモドーロ[休憩]";
const FOCUS = "ポモドーロ[集中]";
const prefix = "tp_";

let pelm = document.getElementById("preset");

function get_Start() {
    return document.getElementById("start");
}

function get_Break() {
    return document.getElementById("break");
}

function get_Reset() {
    return document.getElementById("reset");
}

function zeroPadding(num, len) {
    return (Array(len).join("0") + num).slice(-len);
}

function remaing_Time() {
    return document.getElementById("count_time");
}

function view_preset() {
    let ul = document.querySelector(".preset_wrapper");
    if (ul.classList.contains("open")) {
        ul.classList.remove("open");
        document.getElementById("disp_pattern").innerText = "プリセット一覧";
    } else {
        ul.classList.add("open");
        document.getElementById("disp_pattern").innerText = "閉じる";
    }
}

//プリセット表示関数
window.onload = function() {
    let select_preset = document.querySelectorAll(".preset");
    if (localStorage.length > 0) {
        for (let j = 0; j < select_preset.length; j++)
            select_preset[j].classList.add("isActive");
        document.getElementById("save_pattern").textContent = "作成";

        for (i = 0; i < localStorage.length; i++) {
            key_name = localStorage.key(i);
            if (key_name.includes(prefix)) {
                const liEl = document.createElement("option");
                liEl.textContent = key_name.slice(3);
                liEl.setAttribute("value", i);
                pelm.appendChild(liEl);
            } else {
                i++;
            }
        }
    } else if (localStorage.length == 0) {
        const nothting_msg = document.createElement("p");
        nothting_msg.textContent = "保存されたプリセットはありません。";
        const preset_wrapper = document.querySelector(".preset_wrapper");
        preset_wrapper.appendChild(nothting_msg);
        select_preset.classList.remove(".isActive");
    }
};

//時間の要素取得が多くなったので引数で指定できる関数化
function need_timer_value(i) {
    if (document.timer.elements[i].value == "") {
        return (document.timer.elements[i].value = 0);
    }
    return document.timer.elements[i].value;
}

function save_pattern() {
    let preset_name = window.prompt(
        "プリセット名を入力してください",
        "無題のプリセット"
    );
    if (preset_name == null) throw alert("キャンセルされました。");

    let w_min = window.prompt("集中したい分数を入力してください", "0");
    if (w_min == null) throw alert("キャンセルされました。");

    let w_sec = window.prompt("集中したい秒数を入力してください", "0");
    if (w_sec == null) throw alert("キャンセルされました。");

    let b_min = window.prompt("休憩したい分数を入力してください", "0");
    if (b_min == null) throw alert("キャンセルされました。");

    let b_sec = window.prompt("休憩したい秒数を入力してください", "0");
    if (b_sec == null) throw alert("キャンセルされました。");

    if (w_min == 0 && w_sec == 0 && b_min == 0 && b_sec == 0) {
        throw alert("すべての入力値が0です");
    }

    let time_pattern = {
        work_min: parseInt(w_min) * 60,
        work_sec: parseInt(w_sec),
        break_min: parseInt(b_min) * 60,
        break_sec: parseInt(b_sec)
    };

    let obj = JSON.stringify(time_pattern);

    localStorage.setItem(prefix + preset_name, obj);
}

function set_preset_value(btn) {
    let preset_no = document.getElementById("preset").value;

    key_name = localStorage.key(preset_no);
    let jsonObj = localStorage.getItem(key_name);
    let jsObj = JSON.parse(jsonObj);

    document.timer.elements[0].value = jsObj.work_min / 60;
    document.timer.elements[1].value = jsObj.work_sec;
    document.timer.elements[2].value = jsObj.break_min / 60;
    document.timer.elements[3].value = jsObj.break_sec;
}

function remove_preset(btn) {
    key_name = localStorage.key(btn.value);
    localStorage.removeItem(key_name);
    location.reload();
}

function Start_count() {
    if ((now_status = 0)) {
        get_Reset().disabled = false;
        get_Start().disabled = false;
    } else if ((now_status = 1)) {
        get_Reset().disabled = false;
        get_Start().disabled = true;
    }

    min = parseInt(need_timer_value(0));
    sec = parseInt(need_timer_value(1));

    work_time = min * 60 + sec;

    let msg = zeroPadding(min, 2) + ":" + zeroPadding(sec, 2);

    remaing_Time().innerHTML = msg;
    document.title = FOCUS;

    timer = setInterval("countDown()", 1000);
}

function countDown() {
    now_status = 1;
    audio_elm.src = "Clock-Alarm03-01(Loop).mp3";

    if (work_time <= 0) {
        work_time = 0;
    } else {
        work_time--;
    }

    min = Math.floor(work_time / 60);
    sec = Math.floor(work_time % 60);

    remaing_Time().innerHTML = zeroPadding(min, 2) + ":" + zeroPadding(sec, 2);

    if (work_time <= 0) {
        document.title = "ポモドーロ";
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

    break_time = break_min * 60 + break_sec;
    remaing_Time().innerText =
        zeroPadding(break_min, 2) + ":" + zeroPadding(break_sec, 2);
    audio_elm.pause();
    audio_elm.currentTime = 0;

    if (now_status == 1) {
        get_Start().disabled = false;
        get_Break().disabled = false;
    } else if (now_status == 0) {
        get_Start().disabled = true;
        get_Break().disabled = true;
    }
    document.title = BREAK;

    timer = setInterval("Breaktime()", 1000);
}

function Breaktime() {
    now_status = 1;

    audio_elm.src = "Clock-Alarm03-01(Loop).mp3";

    if (break_time <= 0) {
        break_time = 0;
    } else {
        break_time--;
    }

    let count_break_min = Math.floor(break_time / 60);
    let count_break_sec = Math.floor(break_time % 60);

    remaing_Time().innerText =
        zeroPadding(count_break_min, 2) + ":" + zeroPadding(count_break_sec, 2);
    if (break_time <= 0) {
        clearInterval(timer);
        audio_elm.play();
        get_Start().disabled = false;
        get_Break().disabled = get_Reset().disabled = true;
        document.title = "ポモドーロ";
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
        remaing_Time().innerText = break_time = "00:00";
        get_Break().disabled = true;
        get_Start().disabled = false;
        audio_elm.pause();
        audio_elm.currentTime = 0;
    }
    document.title = "ポモドーロ";
}
