const preset_prefix = 'tp_';
const element_under_preset = document.querySelectorAll('.preset');
const pelm = document.getElementById('preset');

let count = 0;
let time_pattern = {}
let ul = document.querySelector('.preset_wrapper');
let prompt_value = [
  {
    key: 'name',
    title: 'プリセット名を入力してください',
    default_value: '無題のプリセット'
  },
  {key: 'w_min', title: '集中したい分数を入力してください', default_value: '0'},
  {key: 'w_sec', title: '集中したい秒数を入力してください', default_value: '0'},
  {key: 'b_min', title: '休憩したい分数を入力してください', default_value: '0'},
  {key: 'b_sec', title: '休憩したい秒数を入力してください', default_value: '0'},
];


export function init() {
  if (localStorage.length > 0) {
    for (let preset of element_under_preset) {
      preset.classList.add('isActive');
    }

    needElement('save_pattern').textContent = '作成';

    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      console.log(`key : ${key} count: ${count}`);
      createOptionElm(key, count);
      count++;
    }
  } else if (localStorage.length == 0) {
    const nothting_msg = document.createElement('p');
    nothting_msg.textContent = 'プリセットがありません';
    ul.appendChild(nothting_msg);
  }
}

//save preset to localStorage
export function savePattern() {
  prompt_value.forEach((target) => {
    showPrompt(target.key, target.title, target.default_value);
  });
  // TODO:Null or zero check
  let obj = JSON.stringify(time_pattern);
  console.log({obj});
  localStorage.setItem(preset_prefix + time_pattern.name, obj);
}

//set value from localStorage
export function setPresetValue() {
  let preset_no = needElement('preset').value;

  let key_name = localStorage.key(preset_no);

  console.log({preset_no,key_name});

  let jsonObj = localStorage.getItem(key_name);
  let jsObj = JSON.parse(jsonObj);

  console.log({jsonObj});

  document.timer.elements[0].value = jsObj.w_min / 60;
  document.timer.elements[1].value = jsObj.w_sec;
  document.timer.elements[2].value = jsObj.b_min / 60;
  document.timer.elements[3].value = jsObj.b_sec;
}

export function togglePresetElm() {
  ul.classList.toggle('open');

  if (ul.classList.contains('open')) {
    needElement('disp_pattern').innerText = 'プリセット一覧';
  } else {
    needElement('disp_pattern').innerText = '閉じる';
  }
}

/**
 * Push通知を送る関数
 * @param {string} subject 見出し
 * @param {string} body 本文
 */
export function sendPushNotification(subject, body) {
  Push.create(subject, {
    body: body,
    timeout: 6000,
  });
}



// show preset prompt
function showPrompt(key, title, default_value) {
  let prompt = window.prompt(title, default_value);
  inspectionNull(prompt);
  appendMap(key, prompt);
}

// null check for prompt
function inspectionNull(target_value) {
  if (target_value == null) throw alert('キャンセルされました。');
}

function parseTimeValue(key) {
  if (key.includes('min')) return true;
}

// add time_pattern
function appendMap(key, value) {
  if (parseTimeValue(key)) {
    value = parseInt(value) * 60;
  } else if (key == 'name') {
    value = value;
  } else {
    value = parseInt(value);
  }

  time_pattern[key] = value;
  console.log({time_pattern});
}


function createOptionElm(key, count) {
  let element = document.createElement('option');
  element.textContent = key.slice(3);
  element.setAttribute('value', count);
  pelm.appendChild(element);
}

