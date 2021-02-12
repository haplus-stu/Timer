"use strict";

//Time
let min, sec, timer;
let break_count;
let work_time, break_time;
let break_min, break_sec;
let countCycle = 1;

//status
let now_status = 0;
const BREAK = "Focusaid[休憩]";
const FOCUS = "Focusaid[集中]";

//preset
let audio_elm = new Audio();
let pelm = document.getElementById("preset");
let key_name;
const preset_prefix = "tp_";

//other
let i;
let cnt = 0;

/**
 * 通知の許可ダイアログ
 */
window.onload = Push.Permission.request();

/**
 * Push通知を送る関数
 * @param {string} subject 見出し
 * @param {string} body 本文
 */
function sendPushNotification(subject, body) {
    Push.create(subject, {
        body: body,
        timeout: 6000,
    });
}

/**
 * DOM要素取得関数
 */

function needElement(elem_name) {
    return document.getElementById(elem_name);
}

function zeroPadding(num, len) {
    return (Array(len).join("0") + num).slice(-len);
}

function remaingTime() {
    return document.getElementById("count_time");
}

function togglePresetElm() {
    let ul = document.querySelector(".preset_wrapper");

    if (ul.classList.contains("open")) {
        ul.classList.remove("open");
        needElement("disp_pattern").innerText = "プリセット一覧";
    } else {
        ul.classList.add("open");
        needElement("disp_pattern").innerText = "閉じる";
    }
}

//プリセット表示関数
window.onload = function () {
    let element_under_preset = document.querySelectorAll(".preset");

    if (localStorage.length > 0) {
        for (let j = 0; j < element_under_preset.length; j++) {
            element_under_preset[j].classList.add("isActive");
        }
        needElement("save_pattern").textContent = "作成";

        for (i = 0; i < localStorage.length; i++) {
            key_name = localStorage.key(i);

            if (key_name.includes(preset_prefix)) {
                const liEl = document.createElement("option");
                liEl.textContent = key_name.slice(3);
                liEl.setAttribute("value", i);

                pelm.appendChild(liEl);
            } else {
                continue;
            }
        }
    } else if (localStorage.length == 0) {
        const nothting_msg = document.createElement("p");
        nothting_msg.textContent = "保存されたプリセットはありません。";

        const preset_wrapper = document.querySelector(".preset_wrapper");
        preset_wrapper.appendChild(nothting_msg);

        element_under_preset.classList.remove(".isActive");
    }
};

//時間の要素取得が多くなったので引数で指定できる関数化
function needTimerValue(i) {
    if (document.timer.elements[i].value == "") {
        return (document.timer.elements[i].value = 0);
    }
    return document.timer.elements[i].value;
}

function inspectionNull(target_value) {
    if (target_value == null) throw alert("キャンセルされました。");
}

function savePattern() {
    let preset_name = window.prompt(
        "プリセット名を入力してください",
        "無題のプリセット"
    );
    inspectionNull(preset_name);

    let w_min = window.prompt("集中したい分数を入力してください", "0");
    inspectionNull(w_min);

    let w_sec = window.prompt("集中したい秒数を入力してください", "0");
    inspectionNull(w_sec);

    let b_min = window.prompt("休憩したい分数を入力してください", "0");
    inspectionNull(b_min);

    let b_sec = window.prompt("休憩したい秒数を入力してください", "0");
    inspectionNull(b_sec);

    if (w_min == 0 && w_sec == 0 && b_min == 0 && b_sec == 0) {
        throw alert("すべての入力値が0です");
    }

    let time_pattern = {
        work_min: parseInt(w_min) * 60,
        work_sec: parseInt(w_sec),
        break_min: parseInt(b_min) * 60,
        break_sec: parseInt(b_sec),
    };

    let obj = JSON.stringify(time_pattern);

    localStorage.setItem(preset_prefix + preset_name, obj);
}

function setPresetValue() {
    let preset_no = needElement("preset").value;

    key_name = localStorage.key(preset_no);
    let jsonObj = localStorage.getItem(key_name);
    let jsObj = JSON.parse(jsonObj);

    document.timer.elements[0].value = jsObj.work_min / 60;
    document.timer.elements[1].value = jsObj.work_sec;
    document.timer.elements[2].value = jsObj.break_min / 60;
    document.timer.elements[3].value = jsObj.break_sec;
}

function removePreset(btn) {
    key_name = localStorage.key(btn.value);
    localStorage.removeItem(key_name);
    location.reload();
}

function startCount() {
    if ((now_status = 0)) {
        needElement("reset").disabled = false;
        needElement("start").disabled = false;
    } else if ((now_status = 1)) {
        needElement("reset").disabled = false;
        needElement("start").disabled = true;
    }

    min = parseInt(needTimerValue(0));
    sec = parseInt(needTimerValue(1));

    work_time = min * 60 + sec;

    let msg = zeroPadding(min, 2) + ":" + zeroPadding(sec, 2);

    remaingTime().innerHTML = msg;
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

    remaingTime().innerHTML = zeroPadding(min, 2) + ":" + zeroPadding(sec, 2);

    if (work_time <= 0) {
        document.title = "Focusaid";
        clearInterval(timer);
        now_status = 0;
        needElement("start").disabled = false;
        needElement("break").disabled = false;

        if (countCycle == 3) {
            countCycle = 0;
            //プッシュ通知
            sendPushNotification(
                "集中サイクル終了！",
                "長めの休憩を取ってリフレッシュ！次に備えましょう！"
            );
          console.log("集中サイクル終了休憩を取ってリフレッシュ！次に備えましょう！")
        } else {
            countCycle++;
            sendPushNotification(
                "集中フェーズ終了！",
                "休憩を取ってリフレッシュ！次に備えましょう！"
            );
          console.log("集中フェーズ終了休憩を取ってリフレッシュ！次に備えましょう！")
        }
        audio_elm.play();
    }
}

function moveBreak() {
    break_min = parseInt(needTimerValue(2));
    break_sec = parseInt(needTimerValue(3));

    break_time = break_min * 60 + break_sec;
    remaingTime().innerText =
        zeroPadding(break_min, 2) + ":" + zeroPadding(break_sec, 2);
    audio_elm.pause();
    audio_elm.currentTime = 0;

    if (now_status == 1) {
        needElement("start").disabled = false;
        needElement("break").disabled = false;
    } else if (now_status == 0) {
        needElement("start").disabled = true;
        needElement("break").disabled = true;
    }
    document.title = BREAK;

    timer = setInterval("breakTime()", 1000);
}

function breakTime() {
    now_status = 1;

    audio_elm.src = "Clock-Alarm03-01(Loop).mp3";

    if (break_time <= 0) {
        break_time = 0;
    } else {
        break_time--;
    }

    let count_break_min = Math.floor(break_time / 60);
    let count_break_sec = Math.floor(break_time % 60);

    remaingTime().innerText =
        zeroPadding(count_break_min, 2) + ":" + zeroPadding(count_break_sec, 2);
    if (break_time <= 0) {
        clearInterval(timer);

        //Push通知
        sendPushNotification("休憩フェーズ終了", "次も頑張りましょう！");

        audio_elm.play();

        needElement("start").disabled = false;
        needElement("break").disabled = true;
        needElement("reset").disabled = true;

        document.title = "Focusaid";
    }
}

function forceReset() {
    if (now_status == 1) {
        clearInterval(timer);

        remaingTime().innerText = work_time = "00:00";

        needElement("start").disabled = false;
        needElement("break").disabled = true;
        needElement("reset").disabled = true;

        audio_elm.pause();
        audio_elm.currentTime = 0;
    }

    if (now_status == 0) {
        clearInterval(timer);

        remaingTime().innerText = break_time = "00:00";

        needElement("break").disabled = true;
        needElement("start").disabled = false;

        audio_elm.pause();
        audio_elm.currentTime = 0;
    }
    document.title = "Focusaid";
}
