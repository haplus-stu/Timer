let pelm:HTMLElement = document.getElementById('preset');
let key_name:string;
const preset_prefix:string = 'tp_';
/**
 * 通知の許可ダイアログ
 */
window.onload = Push.Permission.request();

window.onload = function() {
  let element_under_preset = document.querySelectorAll<HTMLElement>('.preset');

  if (localStorage.length > 0) {
    for (let j:number = 0; j < element_under_preset.length; j++) {
      element_under_preset[j].classList.add('isActive');
    }
    needElement('save_pattern').textContent = '‰ΩúÊàê';

    // for (let i:number = 0; i < localStorage.length; i++) {
    //   key_name = localStorage.key(i);
    // 
    //   if (key_name.includes(preset_prefix)) {
    //     const liEl = document.createElement('option');
    //     liEl.textContent = key_name.slice(3);
    //     liEl.setAttribute('value', i.toString());
    // 
    //     pelm.appendChild(liEl);
    //   } else {
    //     continue;
    //   }
    // }

    for (let key in localStorage){
      if(!localStorage.hasOwnProperty(key)) continue;
      console.log(key);
    }
  } else if (localStorage.length == 0) {
    const nothting_msg = document.createElement('p');
    nothting_msg.textContent = '‰øùÂ≠ò„Åï„Çå„Åü„Éó„É™„Çª„ÉÉ„Éà„ÅØ„ÅÇ„Çä„Åæ„Åõ„Çì„ÄÇ';

    const preset_wrapper = document.querySelector('.preset_wrapper');
    preset_wrapper.appendChild(nothting_msg);

    element_under_preset.classList.remove('.isActive');
  }
};


function inspectionNull(target_value:string) {
  if (target_value == null) throw alert('キャンセルされました。');
}

function savePattern() {
  let preset_name =
      window.prompt('プリセット名を入力してください', '無題のプリセット');
  inspectionNull(preset_name);

  let w_min = window.prompt('集中したい分数を入力してください', '0');
  inspectionNull(w_min);

  let w_sec = window.prompt('集中したい秒数を入力してください', '0');
  inspectionNull(w_sec);

  let b_min = window.prompt('休憩したい分数を入力してください', '0');
  inspectionNull(b_min);

  let b_sec = window.prompt('休憩したい秒数を入力してください', '0');
  inspectionNull(b_sec);

  if (w_min == 0 && w_sec == 0 && b_min == 0 && b_sec == 0) {
    throw alert('すべての入力値が0です');
  }

  let time_pattern = {
    work_min: parseInt(w_min) * 60,
    work_sec: parseInt(w_sec),
    break_min: parseInt(b_min) * 60,
    break_sec: parseInt(b_sec),
  };

  let obj = JSON.stringify(time_pattern);

  localStorage.setItem(preset_prefix + preset_name, obj);
  location.reload();
}

function setPresetValue() {
  let preset_no = needElement('preset').value;

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

/**
 * Push通知を送る関数
 * @param {string} subject 見出し
 * @param {string} body 本文
 */
function sendPushNotification(subject:string, body:string) {
  Push.create(subject, {
    body: body,
    timeout: 6000,
  });
}

function togglePresetElm() {
  let ul = document.querySelector('.preset_wrapper');

  if (ul.classList.contains('open')) {
    ul.classList.remove('open');
    needElement('disp_pattern').innerText = 'プリセット一覧';
  } else {
    ul.classList.add('open');
    needElement('disp_pattern').innerText = '閉じる';
  }
}
